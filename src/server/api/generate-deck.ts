import { generateDeckPlan } from '../lib/claude'
import { getDataJson } from '../lib/dataContext'
import {
  getDeckPlanningSystemPrompt,
  buildDeckPlanningUserPrompt,
  getDeckTemplateFillSystemPrompt,
  buildDeckTemplateFillUserPrompt,
} from '../lib/prompts'
import { renderDeck, analyzeTemplate, fillTemplate } from '../lib/deckRenderer'
import { getClientConfig } from '../../config/clientConfig'
import type { DeckRequest, DeckResponse, SlidePlan, TemplateFillPlan } from '../../types/deck.types'

function parseSlidePlan(rawText: string): SlidePlan {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }
  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.slides || !Array.isArray(parsed.slides)) {
    throw new Error('Invalid SlidePlan: missing slides array')
  }
  return parsed as SlidePlan
}

function parseTemplateFillPlan(rawText: string): TemplateFillPlan {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude response')
  }
  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.slides || !Array.isArray(parsed.slides)) {
    throw new Error('Invalid TemplateFillPlan: missing slides array')
  }
  return parsed as TemplateFillPlan
}

function buildFilename(config: ReturnType<typeof getClientConfig>): string {
  const date = new Date().toISOString().split('T')[0]
  const name = (config?.shortName || 'Report').replace(/\s+/g, '_')
  return `${name}_Presentation_${date}.pptx`
}

async function handleCustomMode(
  body: DeckRequest,
  config: ReturnType<typeof getClientConfig>,
  dataJson: string
): Promise<DeckResponse> {
  const systemPrompt = config
    ? getDeckPlanningSystemPrompt(config)
    : getDeckPlanningSystemPrompt()

  const userPrompt = buildDeckPlanningUserPrompt(body.prompt, dataJson, {
    focusAreas: body.focusAreas,
    audience: body.audience,
    slideCount: body.slideCount,
  })

  // Step 1: Claude generates the slide plan
  let rawPlan = await generateDeckPlan(systemPrompt, userPrompt)
  let plan: SlidePlan

  try {
    plan = parseSlidePlan(rawPlan)
  } catch (parseError) {
    // One retry with a fix prompt
    const fixPrompt = `Your previous response was not valid JSON. Please fix it and respond with ONLY the valid JSON SlidePlan.

Previous response (first 2000 chars):
${rawPlan.substring(0, 2000)}

Error: ${parseError instanceof Error ? parseError.message : String(parseError)}

Respond with ONLY valid JSON matching the SlidePlan schema.`

    rawPlan = await generateDeckPlan(systemPrompt, fixPrompt)
    plan = parseSlidePlan(rawPlan)
  }

  // Step 2: Render to PPTX via python-pptx in E2B
  const pptxBuffer = await renderDeck(plan, config!)

  return {
    success: true,
    filename: buildFilename(config),
    data: pptxBuffer.toString('base64'),
    slideCount: plan.slides.length,
  }
}

async function handleTemplateMode(
  body: DeckRequest,
  config: ReturnType<typeof getClientConfig>,
  dataJson: string
): Promise<DeckResponse> {
  if (!body.templateFile) {
    return { success: false, filename: '', data: '', slideCount: 0, error: 'No template file provided' }
  }

  // Step 1: Analyze the template structure
  const templateStructure = await analyzeTemplate(body.templateFile)

  // Step 2: Claude generates the fill plan
  const systemPrompt = config
    ? getDeckTemplateFillSystemPrompt(config)
    : getDeckTemplateFillSystemPrompt()

  const userPrompt = buildDeckTemplateFillUserPrompt(
    body.prompt,
    dataJson,
    JSON.stringify(templateStructure, null, 2)
  )

  let rawPlan = await generateDeckPlan(systemPrompt, userPrompt)
  let fillPlan: TemplateFillPlan

  try {
    fillPlan = parseTemplateFillPlan(rawPlan)
  } catch (parseError) {
    const fixPrompt = `Your previous response was not valid JSON. Please fix it and respond with ONLY the valid JSON TemplateFillPlan.

Previous response (first 2000 chars):
${rawPlan.substring(0, 2000)}

Error: ${parseError instanceof Error ? parseError.message : String(parseError)}

Respond with ONLY valid JSON matching the template fill schema.`

    rawPlan = await generateDeckPlan(systemPrompt, fixPrompt)
    fillPlan = parseTemplateFillPlan(rawPlan)
  }

  // Step 3: Fill the template via python-pptx in E2B
  const pptxBuffer = await fillTemplate(fillPlan, config!, body.templateFile)

  return {
    success: true,
    filename: buildFilename(config),
    data: pptxBuffer.toString('base64'),
    slideCount: templateStructure.length,
  }
}

export async function handleGenerateDeck(body: DeckRequest): Promise<DeckResponse> {
  try {
    const config = getClientConfig(body.clientId || 'acme')
    const dataJson = getDataJson(body.clientId)

    if (body.mode === 'template') {
      return await handleTemplateMode(body, config, dataJson)
    } else {
      return await handleCustomMode(body, config, dataJson)
    }
  } catch (err) {
    console.error('Deck generation error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return {
      success: false,
      filename: '',
      data: '',
      slideCount: 0,
      error: message,
    }
  }
}

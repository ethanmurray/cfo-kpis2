import { generateCode, generateNarrative, generateDirectAnalysis } from '../lib/claude'
import { executeCode } from '../lib/e2b'
import { getDataJson } from '../lib/dataContext'
import {
  CODE_GENERATION_SYSTEM_PROMPT,
  buildCodeGenUserPrompt,
  NARRATIVE_SYSTEM_PROMPT,
  buildNarrativeUserPrompt,
  DIRECT_ANALYSIS_SYSTEM_PROMPT,
  buildDirectAnalysisUserPrompt,
} from '../lib/prompts'
import type { AskRequest, AskResponse } from '../../types/ai.types'

const MAX_RETRIES = 2

export async function handleAsk(body: AskRequest): Promise<AskResponse> {
  const { question, filters, conversationHistory } = body

  // Build conversation context for follow-ups
  let historyContext = ''
  if (conversationHistory && conversationHistory.length > 0) {
    historyContext = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n')
  }

  // Try E2B sandbox approach first, fall back to direct analysis if E2B is unavailable
  try {
    return await handleWithE2B(question, filters, historyContext)
  } catch (e2bError) {
    const errorMsg = e2bError instanceof Error ? e2bError.message : String(e2bError)
    console.log(`E2B unavailable (${errorMsg}), falling back to direct analysis`)
    return await handleDirectAnalysis(question, filters, historyContext)
  }
}

async function handleWithE2B(
  question: string,
  filters?: AskRequest['filters'],
  historyContext?: string
): Promise<AskResponse> {
  const systemPrompt = CODE_GENERATION_SYSTEM_PROMPT
  let userPrompt = buildCodeGenUserPrompt(question, filters)
  if (historyContext) {
    userPrompt = `Previous conversation:\n${historyContext}\n\nNew question: ${userPrompt}`
  }

  // Step 1: Generate Python code
  let pythonCode = await generateCode(systemPrompt, userPrompt)

  // Step 2: Execute in E2B sandbox with retry
  const dataJson = getDataJson()
  let stdout = ''
  let images: string[] = []
  let error: string | null = null
  let retries = 0

  while (retries <= MAX_RETRIES) {
    const result = await executeCode(pythonCode, dataJson)
    stdout = result.stdout
    images = result.images
    error = result.error

    if ((stdout || images.length > 0) && !result.error) {
      error = null
      break
    }

    if (result.error && retries < MAX_RETRIES) {
      const fixPrompt = `The previous code produced an error. Fix it and return only the corrected Python code.

Original question: ${question}

Previous code:
\`\`\`python
${pythonCode}
\`\`\`

Error:
${result.error}

${stdout ? `Partial stdout output:\n${stdout}` : 'No stdout output was produced.'}`

      pythonCode = await generateCode(systemPrompt, fixPrompt)
      retries++
    } else {
      break
    }
  }

  // Step 3: Generate executive narrative
  let narrative = ''
  if (stdout || images.length > 0) {
    narrative = await generateNarrative(
      NARRATIVE_SYSTEM_PROMPT,
      buildNarrativeUserPrompt(question, stdout, error)
    )
  } else if (error) {
    narrative = 'The analysis could not be completed. Please try rephrasing your question.'
  }

  return { narrative, pythonCode, stdout, images, error }
}

async function handleDirectAnalysis(
  question: string,
  filters?: AskRequest['filters'],
  historyContext?: string
): Promise<AskResponse> {
  const dataJson = getDataJson()

  let userPrompt = buildDirectAnalysisUserPrompt(question, dataJson, filters)
  if (historyContext) {
    userPrompt = `Previous conversation:\n${historyContext}\n\nNew question: ${userPrompt}`
  }

  userPrompt += `\n\nRespond with ONLY valid JSON containing "pythonCode", "stdout", "narrative", and "chart" fields. Use ONLY numbers from the dataset above.`

  const rawText = await generateDirectAnalysis(
    DIRECT_ANALYSIS_SYSTEM_PROMPT,
    userPrompt
  )

  // Parse the JSON response
  let narrative = ''
  let pythonCode = ''
  let stdout = ''
  const images: string[] = []

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      narrative = parsed.narrative || ''
      pythonCode = parsed.pythonCode || ''
      stdout = parsed.stdout || ''
      if (parsed.chart) {
        images.push('svg:' + parsed.chart)
      }
    } else {
      narrative = rawText
    }
  } catch {
    const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/)
    if (svgMatch) {
      images.push('svg:' + svgMatch[0])
      narrative = rawText.replace(svgMatch[0], '').trim()
    } else {
      narrative = rawText
    }
  }

  return {
    narrative,
    pythonCode,
    stdout,
    images,
    error: null,
  }
}

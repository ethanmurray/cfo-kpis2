import type { VercelRequest, VercelResponse } from '@vercel/node'
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'

export const maxDuration = 60

const SONNET_MODEL = 'us.anthropic.claude-sonnet-4-20250514-v1:0'

const ANALYSIS_SYSTEM_PROMPT = `You are a senior financial analyst advising the CFO of Northern Trust Corporation, one of the world's leading custody banks.

## Company Context
- Assets Under Custody/Administration: $15.8 trillion
- Annual Revenue: ~$7.1 billion
- ~19,500 employees globally
- Ranked 4th globally by AUC among custody banks

You will be given a question and financial context. Analyze the data and provide a thorough executive-level response WITH a chart visualization.

## Response Format
You MUST respond with valid JSON only. No text before or after the JSON. Use this exact structure:

{
  "narrative": "Your executive analysis here. Structure it as: **Key Finding**: one sentence. **Analysis**: 3-5 sentences with specific numbers. **Recommendation**: 1-2 sentences.",
  "chart": "<svg>...</svg>"
}

## Chart Requirements
Generate ONE clean SVG chart that best visualizes the key data point(s). The SVG must:
- Be a complete, valid SVG element with xmlns attribute
- Use viewBox="0 0 600 350" for consistent sizing
- Use Northern Trust brand colors: primary green #006747, gold #D4AF37, accents #10b981, #3b82f6, #f59e0b, #ef4444, #8b5cf6
- Use font-family="system-ui, -apple-system, sans-serif"
- Include a clear title, axis labels, and data labels
- Use clean, modern styling with rounded elements where appropriate
- Choose the right chart type: bar chart for comparisons, line chart for trends, donut/pie for composition, horizontal bar for rankings
- No emoji in labels

## Analysis Requirements
- Be direct and action-oriented, no hedging
- Use specific numbers: currency in millions/billions, percentages to 1 decimal place
- Compare to targets, benchmarks, or prior periods where relevant`

function extractText(content: Array<{ type: string; text?: string }>): string {
  return content
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text!)
    .join('\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { question, filters, conversationHistory } = req.body
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing question parameter' })
    }

    const anthropic = new AnthropicBedrock({
      awsRegion: process.env.AWS_REGION || 'us-west-2',
    })

    let historyContext = ''
    if (conversationHistory && conversationHistory.length > 0) {
      historyContext = conversationHistory
        .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
        .join('\n')
    }

    let userPrompt = `Question: ${question}\n`

    if (filters) {
      const activeFilters = Object.entries(filters).filter(([, v]) => v && v !== 'All')
      if (activeFilters.length > 0) {
        userPrompt += `Active filters: ${activeFilters.map(([k, v]: [string, unknown]) => `${k}=${v}`).join(', ')}\n`
      }
    }

    if (historyContext) {
      userPrompt = `Previous conversation:\n${historyContext}\n\nNew question: ${userPrompt}`
    }

    userPrompt += `\nUse your deep knowledge of Northern Trust's financials. Key reference data: AUC ~$15.8T, revenue ~$7.1B, ~19,500 employees, CET1 ~12.6%, ROE ~15%, cost-to-income ~68%, NIM ~1.45%, trust fees ~$4.8B, investment mgmt fees ~$1.6B, NII ~$700M. Generate realistic, specific numbers consistent with NT's public financial profile.

Remember: respond with ONLY valid JSON containing "narrative" and "chart" fields. The chart must be a complete SVG element.`

    const response = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 8192,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = extractText(response.content).trim()

    // Try to parse the JSON response
    let narrative = ''
    let svgChart = ''

    try {
      // Extract JSON from potential markdown fences
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        narrative = parsed.narrative || ''
        svgChart = parsed.chart || ''
      } else {
        // Fallback: treat the entire response as narrative
        narrative = rawText
      }
    } catch {
      // If JSON parsing fails, try to extract narrative and SVG separately
      const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/)
      if (svgMatch) {
        svgChart = svgMatch[0]
        narrative = rawText.replace(svgMatch[0], '').trim()
      } else {
        narrative = rawText
      }
    }

    // Return SVG as a special image entry (prefixed with "svg:" so frontend can distinguish)
    const images: string[] = []
    if (svgChart) {
      images.push('svg:' + svgChart)
    }

    return res.status(200).json({
      narrative,
      pythonCode: '',
      stdout: '',
      images,
      error: null,
    })
  } catch (err: unknown) {
    console.error('Ask error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}

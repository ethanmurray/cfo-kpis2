import type { VercelRequest, VercelResponse } from '@vercel/node'
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'

export const maxDuration = 30

const CLASSIFY_SYSTEM_PROMPT = `You classify CFO dashboard questions into two tiers. Respond with ONLY valid JSON, no other text.

Available dashboard pages:
- "/" (Executive Dashboard): Enterprise overview, 2025 targets, critical alerts, financial/balance sheet/client/operations metrics, peer percentile
- "/financials" (Group Financials): P&L, balance sheet overview, capital ratios, funding, NIM analysis
- "/business-economics" (Business Economics): Revenue by segment, client acquisition, margin analysis
- "/clients" (Client Economics): Client profitability, wallet share, relationship depth, retention
- "/products" (Product Economics): Product profitability, pricing, expense allocation
- "/operations" (Finance Operations): Month-end close, reconciliation, treasury operations, STP rates
- "/alm" (ALM & Treasury): Asset-liability management, interest rate risk, liquidity, capital metrics
- "/planning" (Planning & Strategy): Strategic initiatives, interactive scenarios, forecasts
- "/external-positioning" (External Positioning): Market position, peer comparison, valuation
- "/risk-compliance" (Risk & Compliance): Regulatory, cybersecurity, operational risk
- "/market-risk" (Market Risk): Market risk metrics, VaR, stress testing

Classification rules:
- If the question asks for a specific metric or view that clearly maps to ONE page, return tier "navigate" with the route, tab name if applicable, and a brief description.
- If the question requires custom analysis, comparison across multiple domains, or cannot be answered by a single existing page, return tier "dynamic".

Response format:
{"tier": "navigate", "route": "/path", "tab": "tabName", "pageName": "Page Name", "description": "Brief description of what the user will find"}
or
{"tier": "dynamic"}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { question } = req.body
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing question parameter' })
    }

    const anthropic = new AnthropicBedrock({
      awsRegion: process.env.AWS_REGION || 'us-west-2',
    })

    const response = await anthropic.messages.create({
      model: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
      max_tokens: 512,
      system: CLASSIFY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    })

    const rawText = response.content
      .filter((block) => block.type === 'text' && 'text' in block)
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')
      .trim()

    // Parse the classification response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(200).json({ tier: 'dynamic' })
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (parsed.tier === 'navigate' && parsed.route) {
      return res.status(200).json({
        tier: 'navigate',
        route: parsed.route,
        tab: parsed.tab || undefined,
        pageName: parsed.pageName || '',
        description: parsed.description || '',
      })
    }

    return res.status(200).json({ tier: 'dynamic' })
  } catch (err: unknown) {
    console.error('Classify error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}

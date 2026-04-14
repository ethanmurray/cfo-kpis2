import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 30

const CLASSIFY_SYSTEM_PROMPT = `You classify CFO dashboard questions into two tiers. Respond with ONLY valid JSON, no other text.

Available dashboard pages and their tab slugs:
- "/" (Executive Dashboard): Enterprise overview, 2025 targets, critical alerts, financial/balance sheet/client/operations metrics, peer percentile. No tabs.
- "/financials" (Group Financials): Tabs: "pl" (P&L & Profitability), "balancesheet" (Balance Sheet), "funding" (Funding), "assets" (Assets), "capital" (Capital ratios incl. CET1), "liquidity" (Treasury & Liquidity), "nim" (NII/NIM Analysis)
- "/business-economics" (Business Economics): Tabs: "segment-pl" (Segment P&L), "roe-sva" (ROE & SVA Analysis), "variance" (Variance Analysis), "products" (Product Line Detail)
- "/clients" (Client Economics): Tabs: "raroc" (Client RAROC), "wallet" (Wallet Share & Cross-Sell), "relationship" (Relationship Health), "attribution" (Profit Attribution), "activity" (Activity & Flow), "deposits" (Deposits & Commitments)
- "/products" (Product Economics): Tabs: "profitability" (Product P&L), "pricing" (Pricing & Value Capture), "expenses" (Expense Management)
- "/operations" (Finance Operations): Tabs: "pulse" (Daily Pulse), "custody" (Custody & Settlement), "treasury" (Treasury Operations), "close" (Month-End Close), "recon" (Reconciliation & Controls)
- "/alm" (ALM & Treasury): Tabs: "irr" (Interest Rate Risk), "liquidity" (Liquidity Management), "funding" (Funding & Maturity), "hedging" (Hedge Program)
- "/planning" (Planning & Strategy): Tabs: "initiatives" (Strategic Initiatives), "scenario-builder" (Scenario Builder), "drivertrees" (Driver Trees), "scenarios" (Scenarios & Forecasts), "stress" (Stress Tests)
- "/external-positioning" (External Positioning): Tabs: "scoreboard" (Peer Scoreboard), "positioning" (Strategic Positioning), "competitive" (Competitive Dynamics), "trends" (Performance Trends)
- "/risk-compliance" (Risk & Compliance): Tabs: "risk-metrics" (Risk Metrics), "risk-appetite" (Risk Appetite), "compliance" (Compliance Monitoring), "regulatory" (Regulatory Oversight), "finance-controls" (Finance Controls)
- "/market-risk" (Market Risk): Tabs: "peers" (Peer Comparison), "positioning" (Strategic Positioning), "risk" (Risk Metrics), "compliance" (Compliance)
- "/workforce" (Workforce Analytics): Tabs: "headcount" (Headcount Analytics), "compensation" (Compensation & Benefits), "productivity" (Productivity Metrics), "attrition" (Attrition & Retention)
- "/forecast" (Forecast Performance): Tabs: "accuracy" (Forecast Accuracy), "budget" (Budget Performance), "bias" (Bias Analysis), "outlook" (Full Year Outlook)

Classification rules:
- If the question asks for a specific metric or view that clearly maps to ONE page, return tier "navigate" with the route and the exact tab slug from the list above. Only use tab slugs listed above — do not invent tab names.
- If the question requires custom analysis, comparison across multiple domains, or cannot be answered by a single existing page, return tier "dynamic".

Response format:
{"tier": "navigate", "route": "/path", "tab": "tabSlug", "pageName": "Page Name", "description": "Brief description of what the user will find"}
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

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
    })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
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

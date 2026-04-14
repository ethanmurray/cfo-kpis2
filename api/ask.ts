import type { VercelRequest, VercelResponse } from '@vercel/node'
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'
import { readFileSync } from 'fs'
import { join } from 'path'

export const maxDuration = 60

const SONNET_MODEL = 'us.anthropic.claude-sonnet-4-20250514-v1:0'

// Client configs for prompt generation (self-contained to avoid ESM import issues on Vercel)
const CLIENT_PROMPTS: Record<string, { description: string; bullets: string; chartColors: string }> = {
  acme: {
    description: 'Acme Bank Corporation, a diversified financial services company',
    bullets: `- Assets Under Custody/Administration: $8.5 trillion
- Annual Revenue: ~$12 billion
- ~35,000 employees globally
- Diversified across commercial, wealth, capital markets, and retail banking
- Headquarters: New York, New York`,
    chartColors: '#006747 (green), #D4AF37 (gold), #10b981, #3b82f6, #f59e0b, #ef4444, #8b5cf6',
  },
}

// Load static data snapshot (generated from mock data generators)
const dataCache = new Map<string, string>()
function getDataJson(clientId?: string): string {
  const id = clientId || 'acme'
  if (dataCache.has(id)) return dataCache.get(id)!

  // Try per-client file first, fall back to default
  const filenames = [`data-${id}.json`, 'data.json']

  const basePaths = [
    join(process.cwd(), 'api'),
    process.cwd(),
    '/var/task/api',
  ]

  for (const base of basePaths) {
    for (const file of filenames) {
      try {
        const data = readFileSync(join(base, file), 'utf-8')
        dataCache.set(id, data)
        return data
      } catch { /* try next */ }
    }
  }
  throw new Error('Could not find data.json')
}

const DATA_SCHEMA = `The data.json contains these top-level keys:
- executiveSummary: AUC, revenue (QTD/YTD), costToIncome, preTaxMargin, EPS, alerts, strategicTargets
- revenue: timeSeries (36 months), byCategory (revenue categories with actual/budget/priorYear), topClients
- auc: total, feeEarning, change (daily/monthly/yearly), netNewBusiness (quarterly), feeMargin, byAssetClass, byRegion, byClientSegment, topClients
- operational: costToIncome (current + trend), costPerTransaction, stpRate, automationRate, expensesByCategory
- profitability: NII, nonInterestIncome, totalRevenue, opExpenses, preTaxIncome, netIncome, ROE, ROA, margins, EPS (GAAP/adjusted/diluted), bookValue, sharesOutstanding, timeSeries
- risk: operationalEvents, settlementFailRate, capitalRatios, liquidityRatios
- clientMetrics: retentionRate, churnRate, newClients, lostClients, avgRevenuePerClient, clientGrowth
- marketPosition: marketShare (overall + byRegion), ranking, competitiveFees
- strategicTargets: summary, detailed targets with progress/drivers/initiatives/risks
- peerComparison: peers with AUC/revenue/ROE/efficiency/marketCap
- balanceSheet: totalAssets, loans, securities, deposits, equity, leverageRatio, RWA, capitalAllocation
- employees: totalEmployees, revenuePerEmployee, byDepartment, turnoverRate
- segmentPnL: segments with revenue/expenses/ROE/efficiency
- techROI: totalTechSpend, investments with ROI/payback, automationSavings
- regulatory: examinations, openFindings, CAMELS rating
- cybersecurity: securityScore, incidents, vulnerabilities, phishing results
- creditRisk: loanPortfolio by segment, concentrations, riskRating, chargeOffs
- capital: CET1 (ratio/capital/RWA/headroom), Tier1, totalCapital, SLR, AOCI
- liquidity: LCR (value/HQLA/netCashOutflows), NSFR, liquidityBuffer, unencumberedAssets, depositStability
- interestRate: NII (MTD/QTD/YTD/runRate), NIM, sensitivity (NII/EVE), depositBeta, duration, repricingGaps, hedgeCoverage
- orderFlow: depositFlows, loanPipeline, commitments, paymentsVolume, securitiesFlow
- balanceSheetDetailed: totalAssets/Liabilities, loans (bySegment, fixedFloating), deposits (bySegment, insured/uninsured), securities, costMetrics, fundingMix, qualityProxies
- forecasts: deposits7D, deposits12W, loans12W, nii8Q, lcr7D, cet18Q (each with forecast points, scenarios, drivers, sensitivities)
- peers: bank peers with marketData, valuation, fundamentals, creditMarket, news`

function getSystemPrompt(clientId?: string): string {
  const c = CLIENT_PROMPTS[clientId || 'acme'] || CLIENT_PROMPTS.acme
  return `You are a senior data analyst for ${c.description}.

## Company Context
${c.bullets}

## Your Task
Given a question from a CFO or senior finance executive and the complete financial dataset, you must:
1. Write Python code that analyzes the data and prints findings to stdout
2. Write a 3-5 sentence executive narrative summarizing the key insight, analysis, and recommendation
3. Generate an SVG chart that visualizes the key data points

## CRITICAL RULES
- ONLY use numbers that come from the provided dataset. Do NOT invent, estimate, or hallucinate any figures.
- Every number you cite must be traceable to a specific field in the data.
- If the data does not contain information needed to answer, say so explicitly.

## Response Format
Respond with valid JSON only. No text before or after:

{
  "pythonCode": "import json\\nimport pandas as pd\\n\\ndata = json.load(open('/tmp/data.json'))\\n# ... analysis code ...\\nprint('Key findings...')",
  "stdout": "The actual output your Python code would produce if executed against the data",
  "narrative": "**Key Finding**: ... **Analysis**: ... **Recommendation**: ...",
  "chart": "<svg>...</svg>"
}

## Python Code Requirements
- Load data with: data = json.load(open('/tmp/data.json'))
- Use pandas for data manipulation
- Print clear, formatted findings to stdout
- Keep code under 100 lines, well-commented
- Format currency as "$X.XB" or "$XXXM", percentages to 1 decimal
- The code should be a faithful representation of the analysis

## stdout Requirements
- This field must contain the EXACT text output the Python code would print
- Use the ACTUAL numbers from the provided data, not made-up values

## Chart Requirements
Generate ONE clean SVG chart. The SVG must:
- Be a complete element with xmlns="http://www.w3.org/2000/svg"
- Use viewBox="0 0 600 350" for consistent sizing
- Use brand colors: ${c.chartColors}
- Use font-family="system-ui, -apple-system, sans-serif"
- Include title, axis labels, and data labels with actual values from the data
- Choose the right chart type for the data

## Narrative Requirements
- Be direct and action-oriented, no hedging
- ONLY cite numbers from the provided data or computed from it
- Structure: **Key Finding** (1 sentence), **Analysis** (3-5 sentences), **Recommendation** (1-2 sentences)

${DATA_SCHEMA}`
}

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
    const { question, filters, conversationHistory, clientId } = req.body
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing question parameter' })
    }

    const anthropic = new AnthropicBedrock({
      awsRegion: process.env.AWS_REGION || 'us-west-2',
    })

    // Load the full dataset for the requested client
    const dataJson = getDataJson(clientId)

    // Truncate if needed to fit in context (keep under ~100K chars)
    const truncatedData = dataJson.length > 100000
      ? dataJson.substring(0, 100000) + '...(truncated)'
      : dataJson

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

    userPrompt += `\nHere is the complete financial dataset:\n${truncatedData}\n\nRespond with ONLY valid JSON containing "pythonCode", "stdout", "narrative", and "chart" fields. Use ONLY numbers from the dataset above.`

    const response = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 8192,
      system: getSystemPrompt(clientId),
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = extractText(response.content).trim()

    // Parse the JSON response
    let narrative = ''
    let pythonCode = ''
    let stdout = ''
    let svgChart = ''

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        narrative = parsed.narrative || ''
        pythonCode = parsed.pythonCode || ''
        stdout = parsed.stdout || ''
        svgChart = parsed.chart || ''
      } else {
        narrative = rawText
      }
    } catch {
      // If JSON parsing fails, try to extract components separately
      const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/)
      if (svgMatch) {
        svgChart = svgMatch[0]
        narrative = rawText.replace(svgMatch[0], '').trim()
      } else {
        narrative = rawText
      }
    }

    const images: string[] = []
    if (svgChart) {
      images.push('svg:' + svgChart)
    }

    return res.status(200).json({
      narrative,
      pythonCode,
      stdout,
      images,
      error: null,
    })
  } catch (err: unknown) {
    console.error('Ask error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}

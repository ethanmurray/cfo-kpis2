import type { VercelRequest, VercelResponse } from '@vercel/node'
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export const maxDuration = 60

const SONNET_MODEL = 'us.anthropic.claude-sonnet-4-20250514-v1:0'

// Load static data snapshot (generated from mock data generators)
let cachedData: string | null = null
function getDataJson(): string {
  if (!cachedData) {
    // Try multiple paths to find data.json in Vercel's runtime environment
    const paths = [
      join(process.cwd(), 'api', 'data.json'),
      join(process.cwd(), 'data.json'),
      '/var/task/api/data.json',
    ]
    for (const p of paths) {
      try {
        cachedData = readFileSync(p, 'utf-8')
        break
      } catch { /* try next */ }
    }
    if (!cachedData) {
      throw new Error('Could not find data.json')
    }
  }
  return cachedData
}

const DATA_SCHEMA = `The data.json contains these top-level keys:
- executiveSummary: AUC, revenue (QTD/YTD), costToIncome, preTaxMargin, EPS, alerts, strategicTargets
- revenue: timeSeries (36 months), byCategory (6 fee categories with actual/budget/priorYear), topClients
- auc: total, feeEarning, change (daily/monthly/yearly), netNewBusiness (quarterly), feeMargin, byAssetClass, byRegion, byClientSegment, topClients
- operational: costToIncome (current + trend), costPerTransaction, stpRate, automationRate, expensesByCategory
- profitability: NII, nonInterestIncome, totalRevenue, opExpenses, preTaxIncome, netIncome, ROE, ROA, margins, EPS (GAAP/adjusted/diluted), bookValue, sharesOutstanding, timeSeries
- risk: operationalEvents, settlementFailRate, capitalRatios, liquidityRatios
- clientMetrics: retentionRate, churnRate, newClients, lostClients, avgRevenuePerClient, clientGrowth
- marketPosition: marketShare (overall + byRegion), ranking, competitiveFees
- strategicTargets: summary, 9 detailed targets with progress/drivers/initiatives/risks
- peerComparison: 5 peers (BNY Mellon, State Street, JPMorgan, Northern Trust, Citibank) with AUC/revenue/ROE/efficiency/marketCap
- balanceSheet: totalAssets, loans, securities, deposits, equity, leverageRatio, RWA, capitalAllocation
- employees: totalEmployees, revenuePerEmployee, byDepartment, turnoverRate
- segmentPnL: 3 segments (C&IS, Wealth Management, Asset Management) with revenue/expenses/ROE/efficiency
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
- peers: 12 bank peers with marketData, valuation, fundamentals, creditMarket, news`

const CODE_GEN_SYSTEM_PROMPT = `You are a senior data analyst for Northern Trust Corporation, one of the world's leading custody banks.

## Company Context
- Assets Under Custody/Administration: $15.8 trillion
- Annual Revenue: ~$7.1 billion
- ~19,500 employees globally
- Ranked 4th globally by AUC among custody banks

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
- The code should be a faithful representation of the analysis — a user reviewing it should be able to verify every number in the narrative

## stdout Requirements
- This field must contain the EXACT text output the Python code would print
- Use the ACTUAL numbers from the provided data, not made-up values
- Include formatted tables, key metrics, and comparisons

## Chart Requirements
Generate ONE clean SVG chart. The SVG must:
- Be a complete element with xmlns="http://www.w3.org/2000/svg"
- Use viewBox="0 0 600 350" for consistent sizing
- Use Northern Trust brand colors: #006747 (green), #D4AF37 (gold), #10b981, #3b82f6, #f59e0b, #ef4444, #8b5cf6
- Use font-family="system-ui, -apple-system, sans-serif"
- Include title, axis labels, and data labels with actual values from the data
- Choose the right chart type for the data

## Narrative Requirements
- Be direct and action-oriented, no hedging
- ONLY cite numbers from the provided data or computed from it
- Structure: **Key Finding** (1 sentence), **Analysis** (3-5 sentences), **Recommendation** (1-2 sentences)

${DATA_SCHEMA}`

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

    // Load the full dataset
    const dataJson = getDataJson()

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
      system: CODE_GEN_SYSTEM_PROMPT,
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

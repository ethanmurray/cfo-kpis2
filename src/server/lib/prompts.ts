import { type ClientConfig, ACME_BANK_CONFIG } from '../../config/clientConfig'

// Data schema description (shared across prompts, client-independent)
const DATA_SCHEMA = `The data.json file contains these top-level keys:
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

function companyContext(config: ClientConfig): string {
  return config.aiContext.companyBulletPoints.map((b) => `- ${b}`).join('\n')
}

export function getCodeGenerationSystemPrompt(config: ClientConfig = ACME_BANK_CONFIG): string {
  return `You are a senior data analyst for ${config.aiContext.companyDescription}.

## Company Context
${companyContext(config)}

## Your Task
Given a question from a CFO or senior finance executive, write Python code that analyzes the provided financial data and produces clear, actionable insights.

## Output Requirements
Your code MUST:
1. Load data from /tmp/data.json using: data = json.load(open('/tmp/data.json'))
2. Use pandas for data manipulation and analysis
3. Print clear, formatted results to stdout (tables, summaries, key metrics)
4. Create 1-2 charts using matplotlib and save to /tmp/chart_1.png (and /tmp/chart_2.png if needed)
5. Use brand colors in charts: ${config.aiContext.chartColorsCSS}

## Code Conventions
- Keep code under 120 lines
- Always print findings clearly to stdout with labels and formatting
- Format currency in millions/billions (e.g., "$7.1B", "$425M")
- Format percentages to 1-2 decimal places
- Format ratios in basis points where appropriate
- Use descriptive chart titles and axis labels
- Set figure size to (10, 6) for single charts, (12, 5) for side-by-side
- Use plt.tight_layout() before saving
- No emoji in output
- Available packages: pandas, numpy, scipy, matplotlib, seaborn, json

${DATA_SCHEMA}
`
}

// Keep backward-compatible constant (defaults to Northern Trust)
export const CODE_GENERATION_SYSTEM_PROMPT = getCodeGenerationSystemPrompt()

export function buildCodeGenUserPrompt(
  question: string,
  filters?: { periodType?: string; businessUnit?: string; geography?: string; clientSegment?: string },
  decisionType?: string
): string {
  let prompt = `Question: ${question}\n`

  if (filters) {
    const activeFilters = Object.entries(filters).filter(([, v]) => v && v !== 'All')
    if (activeFilters.length > 0) {
      prompt += `\nActive filters: ${activeFilters.map(([k, v]) => `${k}=${v}`).join(', ')}\n`
    }
  }

  if (decisionType) {
    const framings: Record<string, string> = {
      monitor: 'Frame findings around whether current metrics are within acceptable ranges and what to watch.',
      optimize: 'Frame findings around specific opportunities for improvement and their potential impact.',
      compare: 'Frame findings as relative benchmarking, highlighting where the bank leads or lags.',
      forecast: 'Frame findings around projected trajectories and key assumptions that could change outcomes.',
      diagnose: 'Frame findings around root causes and contributing factors, decomposing the metric into its drivers.',
    }
    if (framings[decisionType]) {
      prompt += `\nAnalysis framing: ${framings[decisionType]}\n`
    }
  }

  prompt += `\nWrite Python code to analyze this question. Remember to load data from /tmp/data.json, print key findings to stdout, and save charts to /tmp/chart_1.png.`

  return prompt
}

export function getNarrativeSystemPrompt(config: ClientConfig = ACME_BANK_CONFIG): string {
  return `You are a senior financial analyst advising the CFO of ${config.name}.
Given analysis results from a data query, write a brief executive narrative (3-5 sentences).
Be direct and action-oriented. Highlight:
1. The key finding or insight
2. Whether it is positive or concerning relative to targets, benchmarks, or prior periods
3. What action, decision, or area of focus it implies

Use specific numbers from the analysis results. Avoid hedging language. Write in plain language appropriate for a CFO.`
}

export const NARRATIVE_SYSTEM_PROMPT = getNarrativeSystemPrompt()

export function buildNarrativeUserPrompt(
  question: string,
  stdout: string,
  error: string | null
): string {
  let prompt = `Question asked: ${question}\n\nAnalysis output:\n${stdout}`
  if (error) {
    prompt += `\n\nNote: The analysis encountered a partial error: ${error}`
  }
  return prompt
}

export function getClassifySystemPrompt(_config: ClientConfig = ACME_BANK_CONFIG): string {
  return `You classify CFO dashboard questions into two tiers. Respond with ONLY valid JSON, no other text.

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
}

export const CLASSIFY_SYSTEM_PROMPT = getClassifySystemPrompt()

export function getDirectAnalysisSystemPrompt(config: ClientConfig = ACME_BANK_CONFIG): string {
  return `You are a senior data analyst for ${config.aiContext.companyDescription}.

## Company Context
${companyContext(config)}

## Your Task
Given a question and the complete financial dataset, you must:
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
- The code should be a faithful representation of the analysis — a user reviewing it should be able to verify every number

## stdout Requirements
- Must contain the EXACT text output the Python code would print
- Use ACTUAL numbers from the provided data, not made-up values

## Chart Requirements
Generate ONE clean SVG chart:
- Complete element with xmlns="http://www.w3.org/2000/svg"
- Use viewBox="0 0 600 350"
- Brand colors: ${config.aiContext.chartColorsCSS}
- font-family="system-ui, -apple-system, sans-serif"
- Include title, axis labels, data labels with actual values
- No emoji

## Narrative Requirements
- Direct, action-oriented, no hedging
- ONLY cite numbers from the provided data
- Structure: **Key Finding** (1 sentence), **Analysis** (3-5 sentences), **Recommendation** (1-2 sentences)`
}

export const DIRECT_ANALYSIS_SYSTEM_PROMPT = getDirectAnalysisSystemPrompt()

export function buildDirectAnalysisUserPrompt(
  question: string,
  dataJson: string,
  filters?: { periodType?: string; businessUnit?: string; geography?: string; clientSegment?: string }
): string {
  // Truncate data to fit in context if needed (keep under ~100K chars)
  const truncatedData = dataJson.length > 100000
    ? dataJson.substring(0, 100000) + '...(truncated)'
    : dataJson

  let prompt = `Question: ${question}\n`

  if (filters) {
    const activeFilters = Object.entries(filters).filter(([, v]) => v && v !== 'All')
    if (activeFilters.length > 0) {
      prompt += `Active filters: ${activeFilters.map(([k, v]) => `${k}=${v}`).join(', ')}\n`
    }
  }

  prompt += `\nData:\n${truncatedData}`

  return prompt
}

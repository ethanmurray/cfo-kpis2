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

// Keep backward-compatible constant
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

// ── Deck Planning Prompts ──────────────────────────────────────────────

export function getDeckPlanningSystemPrompt(config: ClientConfig = ACME_BANK_CONFIG): string {
  return `You are a presentation strategist creating executive PowerPoint decks for ${config.aiContext.companyDescription}.

## Company Context
${companyContext(config)}

## Your Task
Given a user prompt describing the story to tell, create a structured slide plan as JSON. You will be given the full financial dataset — every number in your plan MUST come from this data.

## Output Format
Respond with ONLY valid JSON matching this schema. No text before or after.

{
  "title": "Deck title",
  "subtitle": "Subtitle or date line",
  "slides": [
    {
      "layout": "title|section-divider|kpi-grid|chart-narrative|two-column|table|title-content",
      "title": "Slide title",
      "subtitle": "Optional subtitle",
      "content": {
        "textBlocks": [{"text": "...", "style": "heading|body|bullet|callout", "position": "left|right|full"}],
        "charts": [{
          "type": "bar|line|pie|doughnut|scatter",
          "title": "Chart title",
          "data": {"labels": ["Q1","Q2",...], "series": [{"name": "Series A", "values": [1.2, 1.5,...]}]},
          "position": "left|right|full"
        }],
        "tables": [{"headers": ["Col1","Col2"], "rows": [["val1","val2"]], "position": "left|right|full"}],
        "kpis": [{"label": "CET1 Ratio", "value": "12.8%", "change": "+30bps QoQ", "status": "positive|negative|neutral"}],
        "narrative": "Executive commentary for this slide",
        "speakerNotes": "Additional context for the presenter"
      }
    }
  ]
}

## Layout Types — When to Use Each
- **title**: Opening slide only. Deck title, subtitle, company name, date.
- **section-divider**: Use between major sections to introduce a new topic. Title + optional subtitle only.
- **kpi-grid**: 3-6 headline KPI metrics with values, changes, and status indicators. Best for executive summary or key metrics overview. Include narrative below the KPI boxes.
- **chart-narrative**: One chart (left ~60%) with narrative text (right ~40%). Best for telling a data story — the chart shows the trend/comparison, the narrative explains the "so what".
- **two-column**: Two content areas side by side. Can hold two charts, chart + table, chart + bullets, etc. Good for comparisons or showing related metrics together.
- **table**: Full-width data table. Use for detailed breakdowns, peer comparisons, segment performance. Keep to 4-8 rows max.
- **title-content**: Title with full-width text/bullets below. Use for strategic commentary, key takeaways, action items, or outlook.

## Chart Type Guidance
- **bar**: Comparisons across categories (segments, peers, products). Use for budget vs actual, this year vs last year.
- **line**: Trends over time (revenue trajectory, NIM evolution, stock price). 2-4 series max.
- **pie/doughnut**: Composition or mix (revenue by category, AUC by region, RWA breakdown). Max 6 slices.
- **scatter**: Correlation or positioning (P/E vs ROE, efficiency vs profitability across peers).

## Story Arc
Structure the deck as a coherent narrative:
1. Title slide
2. Executive summary (kpi-grid with 4-6 headline metrics)
3. Context/market environment (if relevant)
4. 3-6 deep-dive slides on the focus areas (chart-narrative, two-column, or table layouts)
5. Peer positioning or benchmarking (if relevant)
6. Outlook / key actions / closing (title-content)

## Audience Framing
Adjust tone and depth based on the audience:
- **Board**: Strategic, high-level, focus on targets vs actuals, risk posture, peer positioning. Fewer slides, bigger numbers.
- **CFO/Leadership**: Detail-oriented, variance-focused, actionable. Include driver analysis and decompositions.
- **Investors**: Growth narrative, returns-focused (ROE, EPS, book value), peer premium/discount story. Forward-looking.
- **Regulators**: Compliance emphasis, capital adequacy, liquidity buffers, risk appetite utilization. Conservative framing.

## Critical Rules
- ONLY use numbers from the provided dataset. Every value must trace to a field in the data.
- Chart data arrays must contain actual numbers, not placeholders.
- Format currency as "$X.XB" or "$XXXM". Percentages to 1 decimal. Ratios in bps where appropriate.
- Keep total slides between the requested count (±2).
- Speaker notes should provide presenter context — what to emphasize, potential questions.
- No emoji.

${DATA_SCHEMA}`
}

export function buildDeckPlanningUserPrompt(
  prompt: string,
  dataJson: string,
  options?: {
    focusAreas?: string[]
    audience?: string
    slideCount?: number
  }
): string {
  const truncatedData = dataJson.length > 100000
    ? dataJson.substring(0, 100000) + '...(truncated)'
    : dataJson

  let userPrompt = `Story/Focus: ${prompt}\n`

  if (options?.audience) {
    userPrompt += `Audience: ${options.audience}\n`
  }
  if (options?.focusAreas && options.focusAreas.length > 0) {
    userPrompt += `Focus areas: ${options.focusAreas.join(', ')}\n`
  }
  if (options?.slideCount) {
    userPrompt += `Target slide count: ${options.slideCount}\n`
  }

  userPrompt += `\nHere is the complete financial dataset:\n${truncatedData}`
  userPrompt += `\n\nRespond with ONLY valid JSON matching the SlidePlan schema. Use ONLY numbers from the dataset above.`

  return userPrompt
}

export function getDeckTemplateFillSystemPrompt(config: ClientConfig = ACME_BANK_CONFIG): string {
  return `You are a presentation specialist updating an existing PowerPoint template for ${config.aiContext.companyDescription}.

## Company Context
${companyContext(config)}

## Your Task
You are given:
1. The structure of an existing PowerPoint template (slide titles, placeholder names and types)
2. The complete financial dataset
3. User guidance on what to update and what story to tell

Your job is to decide what new content goes into each placeholder in the template.

## Output Format
Respond with ONLY valid JSON matching this schema:

{
  "slides": [
    {
      "index": 0,
      "fills": [
        {"placeholderName": "Title 1", "newContent": "Q1 2026 Financial Review"},
        {"placeholderName": "Text Placeholder 2", "newContent": "Revenue grew 8.2% YoY to $3.1B..."}
      ],
      "tableFills": [
        {"placeholderName": "Table 1", "headers": ["Metric", "Actual", "Budget", "Var"], "rows": [["Revenue", "$3.1B", "$2.9B", "+6.9%"]]}
      ]
    }
  ]
}

## Rules
- Only fill placeholders that exist in the template structure provided.
- Use ONLY numbers from the provided dataset.
- Write executive-quality commentary — direct, specific, no hedging.
- If a placeholder doesn't need updating (e.g., a logo or decorative element), omit it from the fills.
- For tables, provide complete header + row data matching the table dimensions.
- Format currency as "$X.XB" or "$XXXM". Percentages to 1 decimal.

${DATA_SCHEMA}`
}

export function buildDeckTemplateFillUserPrompt(
  prompt: string,
  dataJson: string,
  templateStructure: string
): string {
  const truncatedData = dataJson.length > 100000
    ? dataJson.substring(0, 100000) + '...(truncated)'
    : dataJson

  return `User guidance: ${prompt}

Template structure:
${templateStructure}

Financial dataset:
${truncatedData}

Respond with ONLY valid JSON matching the template fill schema. Use ONLY numbers from the dataset.`
}

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

import { format } from 'date-fns'
import {
  generateTimeSeries,
  generateClients,
  generateRiskEvents,
  randomInRange,
} from '../utils/dataGenerators'
import type {
  ExecutiveSummaryData,
  RevenueData,
  AUCData,
  OperationalMetrics,
  ProfitabilityData,
  RiskMetrics,
  ClientMetricsData,
  MarketPositionData,
  StrategicTargetsData,
  StrategicTarget,
  PeerComparisonData,
  BalanceSheetData,
  EmployeeProductivityData,
  SegmentPnLData,
  TechnologyROIData,
  RegulatoryExaminationData,
  CybersecurityMetricsData,
  CreditRiskDetailData,
} from '../types/dashboard.types'

// Northern Trust - Real-world scale data
// Based on publicly available information (2023-2024 data)
// Northern Trust is one of the world's leading custody banks

// Generate base clients data with Northern Trust scale
const clients = generateClients(450) // Northern Trust serves ~450 institutional clients
const BASE_AUC = 15_800_000_000_000 // $15.8 trillion in assets under custody/administration
const BASE_REVENUE = 7_100_000_000 // ~$7.1 billion annual revenue

// Scale client AUC to match Northern Trust's actual scale
const clientAUCSum = clients.reduce((sum, client) => sum + client.auc, 0)
const scaleFactor = BASE_AUC / clientAUCSum
clients.forEach(client => {
  client.auc *= scaleFactor
  client.revenue = client.auc * randomInRange(0.00035, 0.00055) // 3.5-5.5 bps fee rate
})

const totalAUC = BASE_AUC
const totalRevenue = BASE_REVENUE

// Executive Summary Data
export const getExecutiveSummaryData = (): ExecutiveSummaryData => {
  const currentQtrRevenue = totalRevenue * 0.26 // Q1 2024 actual
  const ytdRevenue = totalRevenue * 0.78 // YTD through Q3
  const budgetQtr = currentQtrRevenue * 1.02
  const budgetYtd = ytdRevenue * 1.03

  // Get profitability data for EPS and book value
  const profitData = getProfitabilityData()

  return {
    auc: {
      value: totalAUC,
      yoyGrowth: 8.2, // Northern Trust has seen strong AUC growth
    },
    revenue: {
      qtd: currentQtrRevenue,
      ytd: ytdRevenue,
      qtdVsBudget: ((currentQtrRevenue - budgetQtr) / budgetQtr) * 100,
      ytdVsBudget: ((ytdRevenue - budgetYtd) / budgetYtd) * 100,
    },
    costToIncome: {
      value: 67.8, // Northern Trust typical efficiency ratio ~68%
      trend: 'down',
    },
    preTaxMargin: {
      value: 28.2,
      periodOverPeriod: 0.8,
    },
    eps: {
      current: profitData.eps.adjusted,
      consensusEstimate: profitData.eps.consensusEstimate,
      surprise: profitData.eps.surprise,
    },
    tangibleBookValuePerShare: profitData.bookValue.tangibleBookValuePerShare,
    marketCap: 18_500_000_000, // ~$18.5B market cap
    dividendYield: 3.45, // ~3.45% dividend yield
    alerts: [
      {
        id: '1',
        type: 'info',
        message: 'AUC surpassed $15.8T driven by market appreciation and net new business',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'info',
        message: 'Q3 adjusted EPS of $2.01 beat consensus estimate by $0.04 (2.0%)',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'info',
        message: 'Net New Business of $240B YTD exceeds annual target',
        timestamp: new Date().toISOString(),
      },
    ],
    strategicTargets: {
      overallScore: 83,
      onTrack: 7,
      atRisk: 2,
      total: 9,
    },
  }
}

// Revenue Performance Data
export const getRevenueData = (): RevenueData => {
  // Northern Trust revenue breakdown (Asset Servicing focused)
  const custodyFees = totalRevenue * 0.42 // Custody & fund administration
  const transactionFees = totalRevenue * 0.22 // Trade settlement & clearing
  const securitiesLending = totalRevenue * 0.12 // Securities lending
  const fundAdmin = totalRevenue * 0.14 // Fund administration
  const fxRevenue = totalRevenue * 0.06 // Foreign exchange
  const other = totalRevenue * 0.04 // Other services

  return {
    timeSeries: generateTimeSeries(36, totalRevenue / 12, 0.045, 0.08),
    byCategory: [
      {
        category: 'Custody Fees',
        actual: custodyFees,
        budget: custodyFees * 1.01,
        priorYear: custodyFees * 0.94,
      },
      {
        category: 'Transaction Fees',
        actual: transactionFees,
        budget: transactionFees * 0.99,
        priorYear: transactionFees * 0.96,
      },
      {
        category: 'Securities Lending',
        actual: securitiesLending,
        budget: securitiesLending * 1.04,
        priorYear: securitiesLending * 1.08,
      },
      {
        category: 'Fund Administration',
        actual: fundAdmin,
        budget: fundAdmin * 1.02,
        priorYear: fundAdmin * 0.98,
      },
      {
        category: 'Foreign Exchange',
        actual: fxRevenue,
        budget: fxRevenue * 0.97,
        priorYear: fxRevenue * 0.93,
      },
      {
        category: 'Other Services',
        actual: other,
        budget: other * 1.01,
        priorYear: other * 0.97,
      },
    ],
    topClients: clients.slice(0, 10).map((client) => ({
      clientName: client.name,
      revenue: client.revenue,
      percentage: (client.revenue / totalRevenue) * 100,
    })),
  }
}

// Assets Under Custody Data
export const getAUCData = (): AUCData => {
  // Northern Trust asset class breakdown
  const aucByAssetClass = [
    { class: 'Equities', value: totalAUC * 0.48, percentage: 48 },
    { class: 'Fixed Income', value: totalAUC * 0.32, percentage: 32 },
    { class: 'Alternatives', value: totalAUC * 0.12, percentage: 12 },
    { class: 'Cash & Other', value: totalAUC * 0.08, percentage: 8 },
  ]

  // Northern Trust geographic breakdown (Americas-heavy with Chicago HQ)
  const aucByRegion = [
    { region: 'Americas', value: totalAUC * 0.55, percentage: 55 },
    { region: 'EMEA', value: totalAUC * 0.30, percentage: 30 },
    { region: 'APAC', value: totalAUC * 0.15, percentage: 15 },
  ]

  // Northern Trust client segment breakdown
  const aucBySegment = [
    { segment: 'Pension Funds', value: totalAUC * 0.38, percentage: 38 },
    { segment: 'Asset Managers', value: totalAUC * 0.28, percentage: 28 },
    { segment: 'Insurance Companies', value: totalAUC * 0.18, percentage: 18 },
    { segment: 'Endowments & Foundations', value: totalAUC * 0.10, percentage: 10 },
    { segment: 'Sovereign Wealth', value: totalAUC * 0.06, percentage: 6 },
  ]

  // Fee-earning AUC (typically 85-90% of total)
  const feeEarningAUC = totalAUC * 0.88

  // Net New Business - Northern Trust targets $300-500B annually
  const aucWon = 425_000_000_000 // $425B won YTD
  const aucLost = 185_000_000_000 // $185B lost YTD
  const netNewBusiness = aucWon - aucLost

  // Fee margin calculation (revenue per $1B AUC)
  const feeMarginBPS = (totalRevenue / totalAUC) * 10000 // basis points
  const revenuePerBillion = (totalRevenue / totalAUC) * 1_000_000_000

  return {
    total: totalAUC,
    feeEarningAUC,
    feeEarningPercentage: 88.0,
    change: {
      daily: 0.08,
      monthly: 1.5,
      yearly: 8.2,
    },
    netNewBusiness: {
      aucWon,
      aucLost,
      netChange: netNewBusiness,
      quarterly: [
        { quarter: 'Q1 2024', won: 105_000_000_000, lost: 42_000_000_000, net: 63_000_000_000 },
        { quarter: 'Q2 2024', won: 118_000_000_000, lost: 51_000_000_000, net: 67_000_000_000 },
        { quarter: 'Q3 2024', won: 112_000_000_000, lost: 48_000_000_000, net: 64_000_000_000 },
        { quarter: 'Q4 2024', won: 90_000_000_000, lost: 44_000_000_000, net: 46_000_000_000 },
      ],
    },
    feeMargin: {
      basisPoints: feeMarginBPS,
      revenuePerBillionAUC: revenuePerBillion,
      target: 4_200_000, // Target $4.2M per $1B AUC
    },
    byAssetClass: aucByAssetClass,
    byRegion: aucByRegion,
    byClientSegment: aucBySegment,
    topClients: clients.slice(0, 20).map((client) => ({
      clientName: client.name,
      auc: client.auc,
      percentage: (client.auc / totalAUC) * 100,
    })),
    timeSeries: generateTimeSeries(36, totalAUC / 12, 0.082, 0.05),
  }
}

// Operational Efficiency Data
export const getOperationalMetrics = (): OperationalMetrics => {
  const operatingExpenses = totalRevenue * 0.678 // Northern Trust efficiency ratio ~68%

  return {
    costToIncome: {
      current: 67.8,
      trend: generateTimeSeries(24, 69.5, -0.015, 0.02).map(d => ({ ...d, value: d.value })),
      benchmark: 65.0,
    },
    costPerTransaction: 1.62,
    stpRate: 95.8, // Northern Trust has industry-leading automation
    automationRate: 89.2,
    expensesByCategory: [
      {
        category: 'Personnel',
        actual: operatingExpenses * 0.52,
        budget: operatingExpenses * 0.52 * 1.01,
      },
      {
        category: 'Technology',
        actual: operatingExpenses * 0.28, // Heavy tech investment
        budget: operatingExpenses * 0.28 * 0.99,
      },
      {
        category: 'Operations',
        actual: operatingExpenses * 0.11,
        budget: operatingExpenses * 0.11 * 1.00,
      },
      {
        category: 'Facilities',
        actual: operatingExpenses * 0.06,
        budget: operatingExpenses * 0.06 * 1.02,
      },
      {
        category: 'Other',
        actual: operatingExpenses * 0.03,
        budget: operatingExpenses * 0.03 * 0.98,
      },
    ],
  }
}

// Profitability Data
export const getProfitabilityData = (): ProfitabilityData => {
  const nonInterestIncome = totalRevenue * 0.92 // Primarily fee-based
  const netInterestIncome = totalRevenue * 0.08
  const totalRev = totalRevenue
  const opExpenses = totalRev * 0.678
  const preTaxInc = totalRev - opExpenses
  const taxRate = 0.19 // Effective tax rate ~19%
  const netInc = preTaxInc * (1 - taxRate)

  // Northern Trust real data (approximate)
  const sharesOutstanding = 207_000_000 // ~207 million shares
  const totalBookValue = 14_800_000_000 // ~$14.8B equity
  const intangibles = 2_500_000_000 // ~$2.5B goodwill and intangibles
  const tangibleBookVal = totalBookValue - intangibles

  const gaapEPS = netInc / sharesOutstanding
  const adjustedEPS = gaapEPS * 1.08 // Adjusted for one-time items
  const consensusEPS = adjustedEPS * 0.98 // Slightly below estimate
  const dilutedShares = sharesOutstanding * 1.01

  const compensationExpense = opExpenses * 0.52

  return {
    netInterestIncome,
    nonInterestIncome,
    totalRevenue: totalRev,
    operatingExpenses: opExpenses,
    preTaxIncome: preTaxInc,
    netIncome: netInc,
    roe: 13.8, // Northern Trust typical ROE
    roa: 1.02,
    margins: {
      preTaxMargin: (preTaxInc / totalRev) * 100,
      operatingMargin: ((totalRev - opExpenses) / totalRev) * 100,
      netMargin: (netInc / totalRev) * 100,
    },
    eps: {
      gaap: gaapEPS,
      adjusted: adjustedEPS,
      diluted: netInc / dilutedShares,
      consensusEstimate: consensusEPS,
      surprise: ((adjustedEPS - consensusEPS) / consensusEPS) * 100,
    },
    bookValue: {
      totalBookValue,
      tangibleBookValue: tangibleBookVal,
      bookValuePerShare: totalBookValue / sharesOutstanding,
      tangibleBookValuePerShare: tangibleBookVal / sharesOutstanding,
    },
    sharesOutstanding,
    compensationRatio: (compensationExpense / totalRev) * 100,
    effectiveTaxRate: taxRate * 100,
    timeSeries: generateTimeSeries(12, totalRev / 4, 0.045, 0.06).map((d, i) => {
      const qtrRev = d.value
      const qtrExp = qtrRev * 0.678
      const qtrPreTax = qtrRev - qtrExp
      const qtrNet = qtrPreTax * (1 - taxRate)
      const qtrEPS = qtrNet / sharesOutstanding
      return {
        date: d.date,
        revenue: qtrRev,
        expenses: qtrExp,
        preTaxIncome: qtrPreTax,
        netIncome: qtrNet,
        eps: qtrEPS,
      }
    }),
  }
}

// Risk & Compliance Data
export const getRiskMetrics = (): RiskMetrics => {
  return {
    operationalEvents: generateRiskEvents(20),
    settlementFailRate: 0.08, // Northern Trust has excellent operational performance
    capitalRatios: {
      tier1: 15.2,
      total: 17.1,
      tier1Threshold: 10.5,
      totalThreshold: 12.5,
    },
    liquidityRatios: {
      lcr: 132.5,
      nsfr: 124.8,
    },
  }
}

// Client Metrics Data
export const getClientMetrics = (): ClientMetricsData => {
  return {
    retentionRate: 97.8, // Northern Trust has excellent client retention
    churnRate: 2.2,
    newClients: 32,
    lostClients: 10,
    averageRevenuePerClient: totalRevenue / clients.length,
    clientGrowth: generateTimeSeries(24, clients.length, 0.025, 0.04).map(d => ({
      ...d,
      value: Math.round(d.value)
    })),
  }
}

// Market Position Data
export const getMarketPositionData = (): MarketPositionData => {
  return {
    marketShare: {
      overall: 5.8, // Northern Trust is #4-5 globally
      byRegion: [
        { region: 'Americas', share: 8.2 },
        { region: 'EMEA', share: 4.5 },
        { region: 'APAC', share: 3.8 },
      ],
    },
    ranking: 4, // Northern Trust ranks 4th globally by AUC
    competitiveFees: [
      { competitor: 'BNY Mellon', averageFee: 0.048 },
      { competitor: 'State Street', averageFee: 0.046 },
      { competitor: 'JPMorgan', averageFee: 0.045 },
      { competitor: 'Northern Trust', averageFee: 0.045 },
      { competitor: 'Citibank', averageFee: 0.044 },
    ],
  }
}

// Strategic Targets Data
export const getStrategicTargetsData = (): StrategicTargetsData => {
  return {
    summary: {
      overallScore: 83,
      onTrack: 7,
      atRisk: 2,
      total: 9,
      lastUpdated: new Date().toISOString(),
    },
    targets: [
      {
        id: 'efficiency-ratio',
        category: 'Financial',
        metric: 'Efficiency Ratio',
        current: 67.8,
        target: 65.0,
        targetYear: '2026',
        unit: 'percentage',
        onTrack: true,
        owner: 'CFO',
        priority: 'Critical',
        progress: [
          { quarter: 'Q1 2024', value: 69.5 },
          { quarter: 'Q2 2024', value: 68.9 },
          { quarter: 'Q3 2024', value: 68.2 },
          { quarter: 'Q4 2024', value: 67.8 },
        ],
        drivers: [
          { name: 'Technology automation investments', impact: 'positive', description: 'Reduced manual processing costs by $45M annually' },
          { name: 'Wage inflation', impact: 'negative', description: 'Personnel costs increased 3.2% YoY' },
          { name: 'Scale benefits from AUC growth', impact: 'positive', description: 'Operating leverage from 8.2% AUC growth' },
        ],
        initiatives: [
          { name: 'Intelligent Automation Platform', status: 'in-progress', completionPercent: 72 },
          { name: 'Vendor Consolidation Program', status: 'completed', completionPercent: 100 },
          { name: 'Global Process Standardization', status: 'in-progress', completionPercent: 58 },
        ],
        risks: [
          { description: 'Higher than expected technology spend', severity: 'medium', mitigation: 'Phased implementation approach' },
          { description: 'Compensation pressure in key markets', severity: 'medium', mitigation: 'Offshore strategy for non-client facing roles' },
        ],
        commentary: 'Efficiency ratio improved 170 bps YoY driven by automation and scale. On track to achieve 65% target by 2026.',
      },
      {
        id: 'roe',
        category: 'Financial',
        metric: 'Return on Equity',
        current: 13.8,
        target: 15.0,
        targetYear: '2026',
        unit: 'percentage',
        onTrack: false,
        owner: 'CFO',
        priority: 'Critical',
        progress: [
          { quarter: 'Q1 2024', value: 13.2 },
          { quarter: 'Q2 2024', value: 13.5 },
          { quarter: 'Q3 2024', value: 13.6 },
          { quarter: 'Q4 2024', value: 13.8 },
        ],
        drivers: [
          { name: 'Revenue growth acceleration', impact: 'positive', description: 'Non-interest income up 4.5% YoY' },
          { name: 'Capital requirements increase', impact: 'negative', description: 'Regulatory capital buffers expanded' },
          { name: 'Market volatility impact on fee income', impact: 'negative', description: 'Transaction volumes down in Q1' },
        ],
        initiatives: [
          { name: 'Fee Rate Optimization', status: 'in-progress', completionPercent: 45 },
          { name: 'Capital Deployment Strategy', status: 'planned', completionPercent: 15 },
          { name: 'Product Mix Enhancement', status: 'in-progress', completionPercent: 62 },
        ],
        risks: [
          { description: 'Market downturn reducing asset values', severity: 'high', mitigation: 'Diversified revenue streams and fee structures' },
          { description: 'Increased competition compressing margins', severity: 'medium', mitigation: 'Value-added service differentiation' },
        ],
        commentary: 'ROE gap to target primarily driven by capital requirements. Revenue initiatives and efficiency improvements expected to close gap.',
      },
      {
        id: 'revenue-growth',
        category: 'Financial',
        metric: 'Revenue Growth (YoY)',
        current: 4.5,
        target: 5.0,
        targetYear: 'Annual',
        unit: 'percentage',
        onTrack: true,
        owner: 'CEO',
        priority: 'High',
        progress: [
          { quarter: 'Q1 2024', value: 3.8 },
          { quarter: 'Q2 2024', value: 4.2 },
          { quarter: 'Q3 2024', value: 4.6 },
          { quarter: 'Q4 2024', value: 4.5 },
        ],
        drivers: [
          { name: 'New client wins', impact: 'positive', description: '$127B in net new AUC from 32 new clients' },
          { name: 'Fee rate pressure', impact: 'negative', description: 'Competitive pricing on large mandates' },
          { name: 'Cross-sell success', impact: 'positive', description: 'Fund admin and FX revenue up 6.2%' },
        ],
        initiatives: [
          { name: 'Alternative Assets Expansion', status: 'in-progress', completionPercent: 68 },
          { name: 'Private Markets Capability Build', status: 'in-progress', completionPercent: 42 },
          { name: 'APAC Growth Strategy', status: 'in-progress', completionPercent: 55 },
        ],
        risks: [
          { description: 'Client consolidation reducing wallet share', severity: 'medium', mitigation: 'Deepen relationships with strategic products' },
        ],
        commentary: 'Strong organic growth driven by new client wins and cross-sell. Alternative assets and APAC providing growth upside.',
      },
      {
        id: 'auc-growth',
        category: 'Operational',
        metric: 'AUC Growth (YoY)',
        current: 8.2,
        target: 7.0,
        targetYear: 'Annual',
        unit: 'percentage',
        onTrack: true,
        owner: 'COO',
        priority: 'High',
        progress: [
          { quarter: 'Q1 2024', value: 6.8 },
          { quarter: 'Q2 2024', value: 7.5 },
          { quarter: 'Q3 2024', value: 8.0 },
          { quarter: 'Q4 2024', value: 8.2 },
        ],
        drivers: [
          { name: 'Market appreciation', impact: 'positive', description: 'Equity markets up 18% YoY' },
          { name: 'Net new business', impact: 'positive', description: '$127B in net flows' },
          { name: 'Client transitions', impact: 'neutral', description: 'Minimal churn offset by conversions' },
        ],
        initiatives: [
          { name: 'Win Rate Improvement Program', status: 'in-progress', completionPercent: 75 },
          { name: 'Client Experience Enhancement', status: 'in-progress', completionPercent: 65 },
        ],
        risks: [
          { description: 'Market correction reducing AUC', severity: 'high', mitigation: 'Focus on net new business and sticky clients' },
        ],
        commentary: 'Exceeding target with strong market performance and successful new business pipeline. Win rate improved to 42%.',
      },
      {
        id: 'client-retention',
        category: 'Client',
        metric: 'Client Retention Rate',
        current: 97.8,
        target: 97.0,
        targetYear: 'Annual',
        unit: 'percentage',
        onTrack: true,
        owner: 'Chief Client Officer',
        priority: 'Critical',
        progress: [
          { quarter: 'Q1 2024', value: 97.5 },
          { quarter: 'Q2 2024', value: 97.6 },
          { quarter: 'Q3 2024', value: 97.7 },
          { quarter: 'Q4 2024', value: 97.8 },
        ],
        drivers: [
          { name: 'Service quality improvements', impact: 'positive', description: 'NPS score increased to 72' },
          { name: 'Digital client portal adoption', impact: 'positive', description: '89% of clients actively using portal' },
          { name: 'Relationship manager continuity', impact: 'positive', description: 'Turnover reduced to 8%' },
        ],
        initiatives: [
          { name: 'Client Advisory Program', status: 'completed', completionPercent: 100 },
          { name: 'Proactive Service Monitoring', status: 'in-progress', completionPercent: 82 },
        ],
        risks: [
          { description: 'Aggressive competitor poaching attempts', severity: 'medium', mitigation: 'Enhanced value proposition and pricing flexibility' },
        ],
        commentary: 'Industry-leading retention driven by service excellence and digital innovation. Lost only 10 clients vs. 32 new wins.',
      },
      {
        id: 'digital-adoption',
        category: 'Digital',
        metric: 'Digital Adoption Rate',
        current: 72.0,
        target: 85.0,
        targetYear: '2025',
        unit: 'percentage',
        onTrack: true,
        owner: 'CTO',
        priority: 'High',
        progress: [
          { quarter: 'Q1 2024', value: 64.0 },
          { quarter: 'Q2 2024', value: 68.0 },
          { quarter: 'Q3 2024', value: 70.0 },
          { quarter: 'Q4 2024', value: 72.0 },
        ],
        drivers: [
          { name: 'Portal enhancements', impact: 'positive', description: 'New features driving 15% more engagement' },
          { name: 'Mobile app launch', impact: 'positive', description: '12,000+ downloads, 4.7 star rating' },
          { name: 'Legacy client conversion', impact: 'neutral', description: 'Older clients slower to adopt' },
        ],
        initiatives: [
          { name: 'Client Portal Redesign', status: 'completed', completionPercent: 100 },
          { name: 'API Integration Platform', status: 'in-progress', completionPercent: 78 },
          { name: 'Mobile App v2.0', status: 'planned', completionPercent: 25 },
        ],
        risks: [
          { description: 'Technology adoption barriers for legacy clients', severity: 'medium', mitigation: 'White-glove onboarding and training programs' },
        ],
        commentary: 'Strong momentum with 8 ppt increase YoY. On track for 85% by 2025 with continued platform investments.',
      },
      {
        id: 'stp-rate',
        category: 'Operational',
        metric: 'Straight-Through Processing Rate',
        current: 95.8,
        target: 97.0,
        targetYear: '2025',
        unit: 'percentage',
        onTrack: true,
        owner: 'COO',
        priority: 'High',
        progress: [
          { quarter: 'Q1 2024', value: 94.8 },
          { quarter: 'Q2 2024', value: 95.2 },
          { quarter: 'Q3 2024', value: 95.5 },
          { quarter: 'Q4 2024', value: 95.8 },
        ],
        drivers: [
          { name: 'Automation investments', impact: 'positive', description: 'RPA reducing manual touches by 35%' },
          { name: 'Data quality improvements', impact: 'positive', description: 'Error rates down 42%' },
          { name: 'Complex transaction growth', impact: 'negative', description: 'Alternatives requiring more manual review' },
        ],
        initiatives: [
          { name: 'End-to-End Automation', status: 'in-progress', completionPercent: 85 },
          { name: 'Exception Management AI', status: 'in-progress', completionPercent: 60 },
        ],
        risks: [
          { description: 'Increasing transaction complexity', severity: 'low', mitigation: 'Continuous automation enhancement' },
        ],
        commentary: 'Industry-leading STP rate improving operational efficiency and reducing errors. Automation roadmap supports 97% target.',
      },
      {
        id: 'nps',
        category: 'Client',
        metric: 'Net Promoter Score',
        current: 72.0,
        target: 75.0,
        targetYear: '2025',
        unit: 'number',
        onTrack: true,
        owner: 'Chief Client Officer',
        priority: 'Medium',
        progress: [
          { quarter: 'Q1 2024', value: 68.0 },
          { quarter: 'Q2 2024', value: 70.0 },
          { quarter: 'Q3 2024', value: 71.0 },
          { quarter: 'Q4 2024', value: 72.0 },
        ],
        drivers: [
          { name: 'Service responsiveness', impact: 'positive', description: 'Response time reduced by 28%' },
          { name: 'Technology improvements', impact: 'positive', description: 'Digital experience rated 4.6/5' },
          { name: 'Relationship manager training', impact: 'positive', description: 'Proactive advisory approach' },
        ],
        initiatives: [
          { name: 'Voice of Client Program', status: 'in-progress', completionPercent: 90 },
          { name: 'Service Recovery Process', status: 'completed', completionPercent: 100 },
        ],
        risks: [
          { description: 'Service disruptions during technology upgrades', severity: 'low', mitigation: 'Robust testing and phased rollouts' },
        ],
        commentary: 'Strong NPS improvement reflecting client satisfaction gains. Well-positioned to achieve 75+ target.',
      },
      {
        id: 'cyber-readiness',
        category: 'Operational',
        metric: 'Cybersecurity Readiness Score',
        current: 88.0,
        target: 95.0,
        targetYear: '2025',
        unit: 'number',
        onTrack: false,
        owner: 'CISO',
        priority: 'Critical',
        progress: [
          { quarter: 'Q1 2024', value: 85.0 },
          { quarter: 'Q2 2024', value: 86.0 },
          { quarter: 'Q3 2024', value: 87.0 },
          { quarter: 'Q4 2024', value: 88.0 },
        ],
        drivers: [
          { name: 'Enhanced monitoring systems', impact: 'positive', description: 'SOC 2.0 platform deployed' },
          { name: 'Evolving threat landscape', impact: 'negative', description: 'Sophisticated attacks increasing' },
          { name: 'Staff training completion', impact: 'positive', description: '98% completion rate on security training' },
        ],
        initiatives: [
          { name: 'Zero Trust Architecture', status: 'in-progress', completionPercent: 52 },
          { name: 'Threat Intelligence Platform', status: 'in-progress', completionPercent: 68 },
          { name: 'Incident Response Automation', status: 'planned', completionPercent: 30 },
        ],
        risks: [
          { description: 'Accelerating pace of cyber threats', severity: 'high', mitigation: 'Increased security budget and continuous monitoring' },
          { description: 'Third-party vendor vulnerabilities', severity: 'medium', mitigation: 'Enhanced vendor risk management' },
        ],
        commentary: 'Steady progress but pace needs to accelerate. Increased investment approved for 2025 to reach 95 target.',
      },
    ],
    boardHighlights: [
      {
        type: 'success',
        message: 'AUC growth of 8.2% exceeds target, driven by $127B net new business and strong market performance',
      },
      {
        type: 'success',
        message: 'Client retention at 97.8% continues to lead industry, with NPS improving to 72',
      },
      {
        type: 'concern',
        message: 'ROE at 13.8% remains below 15% target; strategic initiatives underway to close gap through revenue growth and efficiency gains',
      },
      {
        type: 'concern',
        message: 'Cybersecurity readiness at 88 requires accelerated investment to reach 95 target by 2025',
      },
      {
        type: 'info',
        message: 'Digital adoption reaching 72% with strong momentum; on track for 85% target by year-end 2025',
      },
    ],
  }
}

// Peer Comparison Data
export const getPeerComparisonData = (): PeerComparisonData => {
  return {
    peers: [
      {
        name: 'BNY Mellon',
        auc: 48_500_000_000_000, // $48.5T
        revenue: 17_200_000_000, // $17.2B
        roe: 10.2,
        efficiencyRatio: 72.5,
        preTaxMargin: 25.8,
        marketCap: 43_000_000_000, // $43B
        priceToTangibleBook: 1.35,
      },
      {
        name: 'State Street',
        auc: 43_700_000_000_000, // $43.7T
        revenue: 12_800_000_000, // $12.8B
        roe: 9.8,
        efficiencyRatio: 70.2,
        preTaxMargin: 27.1,
        marketCap: 24_500_000_000, // $24.5B
        priceToTangibleBook: 1.12,
      },
      {
        name: 'JPMorgan (Asset & Wealth)',
        auc: 35_200_000_000_000, // $35.2T
        revenue: 21_500_000_000, // $21.5B (Asset & Wealth segment)
        roe: 18.5,
        efficiencyRatio: 62.8,
        preTaxMargin: 35.2,
        marketCap: 580_000_000_000, // $580B (full bank)
        priceToTangibleBook: 2.15,
      },
      {
        name: 'Northern Trust',
        auc: BASE_AUC,
        revenue: BASE_REVENUE,
        roe: 13.8,
        efficiencyRatio: 67.8,
        preTaxMargin: 28.2,
        marketCap: 18_500_000_000, // $18.5B
        priceToTangibleBook: 0.68,
      },
      {
        name: 'Citibank (Securities Services)',
        auc: 26_800_000_000_000, // $26.8T
        revenue: 9_400_000_000, // $9.4B
        roe: 11.2,
        efficiencyRatio: 68.5,
        preTaxMargin: 29.5,
        marketCap: 126_000_000_000, // $126B (full bank)
        priceToTangibleBook: 0.85,
      },
    ],
    rankings: {
      byAUC: 4, // 4th by AUC
      byRevenue: 4, // 4th by revenue
      byROE: 2, // 2nd among custody banks (ex-JPM)
      byEfficiency: 2, // 2nd best efficiency ratio
    },
  }
}

// Balance Sheet Data
export const getBalanceSheetData = (): BalanceSheetData => {
  const totalAssets = 175_000_000_000 // $175B total assets
  const totalLoans = 32_500_000_000 // $32.5B loans
  const totalSecurities = 52_000_000_000 // $52B securities
  const totalDeposits = 130_000_000_000 // $130B deposits
  const totalEquity = 14_800_000_000 // $14.8B equity

  return {
    totalAssets,
    loans: {
      total: totalLoans,
      percentage: (totalLoans / totalAssets) * 100,
      nonPerforming: 95_000_000, // $95M NPL
      nplRatio: (95_000_000 / totalLoans) * 100,
    },
    securities: {
      total: totalSecurities,
      htm: totalSecurities * 0.42, // 42% held-to-maturity
      afs: totalSecurities * 0.58, // 58% available-for-sale
      averageYield: 2.85, // 2.85% average yield
    },
    deposits: {
      total: totalDeposits,
      dda: totalDeposits * 0.65, // 65% demand deposits
      savings: totalDeposits * 0.22, // 22% savings
      timeDeposits: totalDeposits * 0.13, // 13% time deposits
      costOfFunds: 1.45, // 1.45% cost of funds
    },
    equity: {
      total: totalEquity,
      commonEquity: totalEquity * 0.92,
      retainedEarnings: totalEquity * 0.65,
      aoci: -850_000_000, // -$850M AOCI (unrealized losses on AFS securities)
    },
    leverageRatio: totalAssets / totalEquity, // ~11.8x
    rwa: 88_000_000_000, // $88B risk-weighted assets
    capitalAllocation: {
      dividends: 420_000_000, // $420M dividends YTD
      buybacks: 185_000_000, // $185M buybacks YTD
      organicGrowth: 245_000_000, // $245M retained for growth
      payoutRatio: 52.5, // 52.5% payout ratio
    },
  }
}

// Employee Productivity Data
export const getEmployeeProductivityData = (): EmployeeProductivityData => {
  const totalEmployees = 19_500 // Northern Trust ~19,500 employees globally
  const revenuePerEmployee = totalRevenue / totalEmployees
  const aucPerEmployee = totalAUC / totalEmployees
  const opExpenses = totalRevenue * 0.678
  const expensePerEmployee = opExpenses / totalEmployees

  return {
    totalEmployees,
    revenuePerEmployee,
    aucPerEmployee,
    expensePerEmployee,
    byDepartment: [
      {
        department: 'Asset Servicing',
        employees: 8_200,
        revenue: totalRevenue * 0.58,
        revenuePerFTE: (totalRevenue * 0.58) / 8_200,
      },
      {
        department: 'Wealth Management',
        employees: 4_800,
        revenue: totalRevenue * 0.28,
        revenuePerFTE: (totalRevenue * 0.28) / 4_800,
      },
      {
        department: 'Technology',
        employees: 3_100,
        revenue: 0, // Cost center
        revenuePerFTE: 0,
      },
      {
        department: 'Operations',
        employees: 1_900,
        revenue: 0, // Cost center
        revenuePerFTE: 0,
      },
      {
        department: 'Corporate',
        employees: 1_500,
        revenue: totalRevenue * 0.14,
        revenuePerFTE: (totalRevenue * 0.14) / 1_500,
      },
    ],
    turnoverRate: 8.5, // 8.5% annual turnover
    avgTenure: 7.2, // 7.2 years average tenure
    vacancyRate: 2.8, // 2.8% vacancy rate
  }
}

// Segment P&L Data
export const getSegmentPnLData = (): SegmentPnLData => {
  const totalRev = totalRevenue
  const totalExp = totalRev * 0.678

  return {
    segments: [
      {
        name: 'C&IS (Corporate & Institutional Services)',
        revenue: totalRev * 0.58, // 58% of revenue
        expenses: totalExp * 0.52,
        preTaxIncome: (totalRev * 0.58) - (totalExp * 0.52),
        assets: 102_000_000_000, // $102B allocated
        roe: 15.2,
        efficiencyRatio: 64.5,
        headcount: 8_200,
        revenueGrowth: 5.2,
      },
      {
        name: 'Wealth Management',
        revenue: totalRev * 0.28, // 28% of revenue
        expenses: totalExp * 0.30,
        preTaxIncome: (totalRev * 0.28) - (totalExp * 0.30),
        assets: 48_000_000_000, // $48B allocated
        roe: 11.8,
        efficiencyRatio: 75.2,
        headcount: 4_800,
        revenueGrowth: 3.8,
      },
      {
        name: 'Asset Management',
        revenue: totalRev * 0.14, // 14% of revenue
        expenses: totalExp * 0.18,
        preTaxIncome: (totalRev * 0.14) - (totalExp * 0.18),
        assets: 25_000_000_000, // $25B allocated
        roe: 8.5,
        efficiencyRatio: 92.8,
        headcount: 1_500,
        revenueGrowth: 2.1,
      },
    ],
  }
}

// Technology ROI Data
export const getTechnologyROIData = (): TechnologyROIData => {
  const totalTechSpend = totalRevenue * 0.16 // 16% of revenue on technology

  return {
    totalTechSpend,
    techSpendAsPercentRevenue: 16.0,
    investments: [
      {
        initiative: 'Intelligent Automation Platform',
        investment: 125_000_000,
        annualSavings: 45_000_000,
        roi: 36.0,
        paybackPeriod: 2.8,
        status: 'in-progress',
      },
      {
        initiative: 'Cloud Migration (AWS)',
        investment: 85_000_000,
        annualSavings: 22_000_000,
        roi: 25.9,
        paybackPeriod: 3.9,
        status: 'in-progress',
      },
      {
        initiative: 'Data Analytics Platform',
        investment: 62_000_000,
        annualSavings: 18_000_000,
        roi: 29.0,
        paybackPeriod: 3.4,
        status: 'in-progress',
      },
      {
        initiative: 'Cybersecurity Enhancement',
        investment: 48_000_000,
        annualSavings: 8_000_000, // Risk reduction value
        roi: 16.7,
        paybackPeriod: 6.0,
        status: 'completed',
      },
      {
        initiative: 'Digital Client Portal',
        investment: 35_000_000,
        annualSavings: 12_000_000,
        roi: 34.3,
        paybackPeriod: 2.9,
        status: 'completed',
      },
      {
        initiative: 'AI-Powered Risk Analytics',
        investment: 28_000_000,
        annualSavings: 15_000_000,
        roi: 53.6,
        paybackPeriod: 1.9,
        status: 'planned',
      },
    ],
    automationSavings: 45_000_000, // $45M annual savings from automation
    cloudMigrationProgress: 68, // 68% complete
  }
}

// Regulatory Examination Data
export const getRegulatoryExaminationData = (): RegulatoryExaminationData => {
  return {
    examinations: [
      {
        regulator: 'Federal Reserve',
        type: 'Comprehensive Capital Analysis',
        date: '2024-06-15',
        status: 'completed',
        findings: 3,
        criticalFindings: 0,
        remediationStatus: 'All findings remediated',
      },
      {
        regulator: 'OCC',
        type: 'Safety & Soundness Examination',
        date: '2024-09-20',
        status: 'in-progress',
        findings: 5,
        criticalFindings: 1,
        remediationStatus: '2 of 5 remediated',
      },
      {
        regulator: 'FDIC',
        type: 'Consumer Compliance',
        date: '2024-11-05',
        status: 'scheduled',
        findings: 0,
        criticalFindings: 0,
        remediationStatus: 'N/A',
      },
      {
        regulator: 'SEC',
        type: 'Investment Adviser Examination',
        date: '2024-08-10',
        status: 'completed',
        findings: 2,
        criticalFindings: 0,
        remediationStatus: 'All findings remediated',
      },
      {
        regulator: 'Federal Reserve',
        type: 'CCAR Stress Testing',
        date: '2024-03-31',
        status: 'completed',
        findings: 1,
        criticalFindings: 0,
        remediationStatus: 'Finding remediated',
      },
    ],
    openFindings: 5,
    overdueRemediation: 1,
    camelRating: '2', // CAMELS rating: 1 (best) to 5 (worst)
  }
}

// Cybersecurity Metrics Data
export const getCybersecurityMetricsData = (): CybersecurityMetricsData => {
  return {
    securityScore: 88, // Out of 100
    incidents: [
      {
        date: '2024-11-15',
        type: 'Phishing Attempt',
        severity: 'low',
        status: 'resolved',
        mttr: 45, // minutes
      },
      {
        date: '2024-11-08',
        type: 'Unauthorized Access Attempt',
        severity: 'medium',
        status: 'resolved',
        mttr: 180,
      },
      {
        date: '2024-10-22',
        type: 'DDoS Attack',
        severity: 'high',
        status: 'resolved',
        mttr: 320,
      },
      {
        date: '2024-10-10',
        type: 'Malware Detection',
        severity: 'medium',
        status: 'resolved',
        mttr: 120,
      },
      {
        date: '2024-09-28',
        type: 'Data Exfiltration Attempt',
        severity: 'critical',
        status: 'resolved',
        mttr: 480,
      },
    ],
    threatsPrevented: 12_450, // Last 90 days
    vulnerabilities: {
      critical: 2,
      high: 15,
      medium: 48,
      low: 132,
    },
    phishingTestResults: {
      testsSent: 8_500,
      clicked: 425,
      reported: 6_800,
      clickRate: 5.0, // 5% click rate
    },
    patchCompliance: 94.5, // 94.5% systems patched within SLA
    mfaAdoption: 98.2, // 98.2% of users using MFA
  }
}

// Credit Risk Detail Data
export const getCreditRiskDetailData = (): CreditRiskDetailData => {
  const totalLoans = 32_500_000_000

  return {
    loanPortfolio: [
      {
        segment: 'Commercial Real Estate',
        outstanding: totalLoans * 0.35,
        nonPerforming: (totalLoans * 0.35) * 0.0028,
        nplRatio: 0.28,
        allowance: (totalLoans * 0.35) * 0.012,
        coverageRatio: 428.6,
        avgCreditScore: 725,
      },
      {
        segment: 'C&I Loans',
        outstanding: totalLoans * 0.28,
        nonPerforming: (totalLoans * 0.28) * 0.0032,
        nplRatio: 0.32,
        allowance: (totalLoans * 0.28) * 0.015,
        coverageRatio: 468.8,
        avgCreditScore: 738,
      },
      {
        segment: 'Securities-Based Lending',
        outstanding: totalLoans * 0.22,
        nonPerforming: (totalLoans * 0.22) * 0.0015,
        nplRatio: 0.15,
        allowance: (totalLoans * 0.22) * 0.008,
        coverageRatio: 533.3,
        avgCreditScore: 785,
      },
      {
        segment: 'Personal Trust & Custody',
        outstanding: totalLoans * 0.10,
        nonPerforming: (totalLoans * 0.10) * 0.0018,
        nplRatio: 0.18,
        allowance: (totalLoans * 0.10) * 0.010,
        coverageRatio: 555.6,
        avgCreditScore: 765,
      },
      {
        segment: 'Other',
        outstanding: totalLoans * 0.05,
        nonPerforming: (totalLoans * 0.05) * 0.0042,
        nplRatio: 0.42,
        allowance: (totalLoans * 0.05) * 0.020,
        coverageRatio: 476.2,
        avgCreditScore: 695,
      },
    ],
    concentrations: [
      {
        type: 'Single Borrower',
        exposure: 1_250_000_000,
        percentage: 3.85,
        limit: 5.0, // 5% limit
      },
      {
        type: 'Real Estate',
        exposure: 11_375_000_000,
        percentage: 35.0,
        limit: 40.0,
      },
      {
        type: 'Financial Institutions',
        exposure: 4_225_000_000,
        percentage: 13.0,
        limit: 20.0,
      },
    ],
    riskRating: {
      pass: 94.2, // 94.2% of portfolio
      specialMention: 3.5,
      substandard: 1.8,
      doubtful: 0.4,
      loss: 0.1,
    },
    netChargeOffs: 28_500_000, // $28.5M YTD
    netChargeOffRate: 0.088, // 0.088% annualized
  }
}

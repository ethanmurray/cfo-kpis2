// Time series data point
export interface TimeSeriesDataPoint {
  date: string
  value: number
  label?: string
}

// Revenue breakdown
export interface RevenueCategory {
  category: string
  actual: number
  budget: number
  priorYear: number
}

export interface RevenueData {
  timeSeries: TimeSeriesDataPoint[]
  byCategory: RevenueCategory[]
  topClients: Array<{
    clientName: string
    revenue: number
    percentage: number
  }>
}

// Assets Under Custody
export interface AUCData {
  total: number
  feeEarningAUC: number
  feeEarningPercentage: number
  change: {
    daily: number
    monthly: number
    yearly: number
  }
  netNewBusiness: {
    aucWon: number
    aucLost: number
    netChange: number
    quarterly: Array<{
      quarter: string
      won: number
      lost: number
      net: number
    }>
  }
  feeMargin: {
    basisPoints: number
    revenuePerBillionAUC: number
    target: number
  }
  byAssetClass: Array<{
    class: string
    value: number
    percentage: number
  }>
  byRegion: Array<{
    region: string
    value: number
    percentage: number
  }>
  byClientSegment: Array<{
    segment: string
    value: number
    percentage: number
  }>
  topClients: Array<{
    clientName: string
    auc: number
    percentage: number
  }>
  timeSeries: TimeSeriesDataPoint[]
}

// Client data
export interface Client {
  id: string
  name: string
  auc: number
  revenue: number
  segment: string
  region: string
  onboardingDate: string
}

// Operational efficiency
export interface OperationalMetrics {
  costToIncome: {
    current: number
    trend: TimeSeriesDataPoint[]
    benchmark: number
  }
  costPerTransaction: number
  stpRate: number
  automationRate: number
  expensesByCategory: Array<{
    category: string
    actual: number
    budget: number
  }>
}

// Profitability
export interface ProfitabilityData {
  netInterestIncome: number
  nonInterestIncome: number
  totalRevenue: number
  operatingExpenses: number
  preTaxIncome: number
  netIncome: number
  roe: number
  roa: number
  margins: {
    preTaxMargin: number
    operatingMargin: number
    netMargin: number
  }
  eps: {
    gaap: number
    adjusted: number
    diluted: number
    consensusEstimate: number
    surprise: number
  }
  bookValue: {
    totalBookValue: number
    tangibleBookValue: number
    bookValuePerShare: number
    tangibleBookValuePerShare: number
  }
  sharesOutstanding: number
  compensationRatio: number
  effectiveTaxRate: number
  timeSeries: Array<{
    date: string
    revenue: number
    expenses: number
    preTaxIncome: number
    netIncome: number
    eps: number
  }>
}

// Risk metrics
export interface RiskMetrics {
  operationalEvents: Array<{
    date: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    impact: number
    description: string
  }>
  settlementFailRate: number
  capitalRatios: {
    tier1: number
    total: number
    tier1Threshold: number
    totalThreshold: number
  }
  liquidityRatios: {
    lcr: number
    nsfr: number
  }
}

// Client metrics
export interface ClientMetricsData {
  retentionRate: number
  churnRate: number
  newClients: number
  lostClients: number
  averageRevenuePerClient: number
  clientGrowth: TimeSeriesDataPoint[]
}

// Market position
export interface MarketPositionData {
  marketShare: {
    overall: number
    byRegion: Array<{
      region: string
      share: number
    }>
  }
  ranking: number
  competitiveFees: Array<{
    competitor: string
    averageFee: number
  }>
}

// Executive summary
export interface ExecutiveSummaryData {
  auc: {
    value: number
    yoyGrowth: number
  }
  revenue: {
    qtd: number
    ytd: number
    qtdVsBudget: number
    ytdVsBudget: number
  }
  costToIncome: {
    value: number
    trend: 'up' | 'down' | 'flat'
  }
  preTaxMargin: {
    value: number
    periodOverPeriod: number
  }
  eps: {
    current: number
    consensusEstimate: number
    surprise: number
  }
  tangibleBookValuePerShare: number
  marketCap: number
  dividendYield: number
  alerts: Array<{
    id: string
    type: 'info' | 'warning' | 'critical'
    message: string
    timestamp: string
  }>
  strategicTargets: {
    overallScore: number
    onTrack: number
    atRisk: number
    total: number
  }
}

// Strategic Targets Detail
export interface StrategicTarget {
  id: string
  category: 'Financial' | 'Operational' | 'Client' | 'Digital'
  metric: string
  current: number
  target: number
  targetYear: string
  unit: 'percentage' | 'currency' | 'number' | 'bps'
  onTrack: boolean
  owner: string
  priority: 'Critical' | 'High' | 'Medium'
  progress: Array<{
    quarter: string
    value: number
  }>
  drivers: Array<{
    name: string
    impact: 'positive' | 'negative' | 'neutral'
    description: string
  }>
  initiatives: Array<{
    name: string
    status: 'completed' | 'in-progress' | 'planned'
    completionPercent: number
  }>
  risks: Array<{
    description: string
    severity: 'low' | 'medium' | 'high'
    mitigation: string
  }>
  commentary: string
}

export interface StrategicTargetsData {
  summary: {
    overallScore: number
    onTrack: number
    atRisk: number
    total: number
    lastUpdated: string
  }
  targets: StrategicTarget[]
  boardHighlights: Array<{
    type: 'success' | 'concern' | 'info'
    message: string
  }>
}

// Peer Comparison Data
export interface PeerComparisonData {
  peers: Array<{
    name: string
    auc: number
    revenue: number
    roe: number
    efficiencyRatio: number
    preTaxMargin: number
    marketCap: number
    priceToTangibleBook: number
  }>
  rankings: {
    byAUC: number
    byRevenue: number
    byROE: number
    byEfficiency: number
  }
}

// Balance Sheet Data
export interface BalanceSheetData {
  totalAssets: number
  loans: {
    total: number
    percentage: number
    nonPerforming: number
    nplRatio: number
  }
  securities: {
    total: number
    htm: number
    afs: number
    averageYield: number
  }
  deposits: {
    total: number
    dda: number
    savings: number
    timeDeposits: number
    costOfFunds: number
  }
  equity: {
    total: number
    commonEquity: number
    retainedEarnings: number
    aoci: number
  }
  leverageRatio: number
  rwa: number
  capitalAllocation: {
    dividends: number
    buybacks: number
    organicGrowth: number
    payoutRatio: number
  }
}

// Employee Productivity Data
export interface EmployeeProductivityData {
  totalEmployees: number
  revenuePerEmployee: number
  aucPerEmployee: number
  expensePerEmployee: number
  byDepartment: Array<{
    department: string
    employees: number
    revenue: number
    revenuePerFTE: number
  }>
  turnoverRate: number
  avgTenure: number
  vacancyRate: number
}

// Segment P&L Data
export interface SegmentPnLData {
  segments: Array<{
    name: string
    revenue: number
    expenses: number
    preTaxIncome: number
    assets: number
    roe: number
    efficiencyRatio: number
    headcount: number
    revenueGrowth: number
  }>
}

// Technology ROI Data
export interface TechnologyROIData {
  totalTechSpend: number
  techSpendAsPercentRevenue: number
  investments: Array<{
    initiative: string
    investment: number
    annualSavings: number
    roi: number
    paybackPeriod: number
    status: 'completed' | 'in-progress' | 'planned'
  }>
  automationSavings: number
  cloudMigrationProgress: number
}

// Regulatory Examination Data
export interface RegulatoryExaminationData {
  examinations: Array<{
    regulator: string
    type: string
    date: string
    status: 'scheduled' | 'in-progress' | 'completed'
    findings: number
    criticalFindings: number
    remediationStatus: string
  }>
  openFindings: number
  overdueRemediation: number
  camelRating: string
}

// Cybersecurity Metrics Data
export interface CybersecurityMetricsData {
  securityScore: number
  incidents: Array<{
    date: string
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    status: 'contained' | 'investigating' | 'resolved'
    mttr: number
  }>
  threatsPrevented: number
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  phishingTestResults: {
    testsSent: number
    clicked: number
    reported: number
    clickRate: number
  }
  patchCompliance: number
  mfaAdoption: number
}

// Credit Risk Detail Data
export interface CreditRiskDetailData {
  loanPortfolio: Array<{
    segment: string
    outstanding: number
    nonPerforming: number
    nplRatio: number
    allowance: number
    coverageRatio: number
    avgCreditScore: number
  }>
  concentrations: Array<{
    type: string
    exposure: number
    percentage: number
    limit: number
  }>
  riskRating: {
    pass: number
    specialMention: number
    substandard: number
    doubtful: number
    loss: number
  }
  netChargeOffs: number
  netChargeOffRate: number
}

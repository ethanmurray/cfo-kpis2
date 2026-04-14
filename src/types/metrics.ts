// Core metric type definitions for CFO Dashboard

export interface RAGThreshold {
  red: number
  amber: number
  green: number
}

export interface MetricChange {
  DoD?: number  // Day over Day
  WoW?: number  // Week over Week
  MoM?: number  // Month over Month
  QoQ?: number  // Quarter over Quarter
  YoY?: number  // Year over Year
}

export interface TimeSeriesPoint {
  date: string
  value: number
  label?: string
}

// ============ LIQUIDITY METRICS ============

export interface HQLAComposition {
  level1: number
  level2A: number
  level2B: number
  total: number
}

export interface CashFlows {
  total: number
  categories: { [key: string]: number }
}

export interface LiquidityMetrics {
  asOfDate: Date
  lcr: {
    value: number
    hqla: HQLAComposition
    netCashOutflows: {
      total: number
      outflows: CashFlows
      inflows: CashFlows
    }
    threshold: RAGThreshold
  }
  nsfr: {
    value: number
    availableStableFunding: number
    requiredStableFunding: number
  }
  liquidityBuffer: number
  unencumberedAssets: {
    cash: number
    securities: number
    total: number
    encumbrancePercent: number
  }
  wholesaleFunding: {
    reliance: number
    shortTermRatio: number
  }
  depositStability: {
    insuredPercent: number
    uninsuredPercent: number
    outflowRate: number
  }
  intradayUsage: {
    peakDebit: number
    overdraftUsage: number
  }
}

// ============ CAPITAL METRICS ============

export interface RWAComponents {
  credit: number
  market: number
  operational: number
  total: number
}

export interface CapitalMetrics {
  asOfDate: Date
  cet1: {
    ratio: number
    capital: number
    rwa: RWAComponents
    headroom: {
      toTarget: number
      toMinimum: number
    }
    threshold: RAGThreshold
  }
  tier1: {
    ratio: number
    capital: number
  }
  totalCapital: {
    ratio: number
    capital: number
  }
  slr: {
    ratio: number
    tier1Capital: number
    totalLeverageExposure: number
  }
  aoci: {
    unrealizedGainLoss: number
    capitalSensitivity: number
  }
}

// ============ ORDER/FLOW METRICS ============

export interface DepositFlows {
  netFlow: {
    today: number
    week: number
    mtd: number
  }
  grossInflows: { [segment: string]: number }
  grossOutflows: { [segment: string]: number }
}

export interface LoanPipeline {
  submitted: number
  approved: number
  committed: number
  funded: number
}

export interface OrderFlowMetrics {
  asOfDate: Date
  depositFlows: DepositFlows
  loanPipeline: LoanPipeline
  commitments: {
    newUnderwriting: number
    expectedFees: number
    utilization: number
    undrawn: number
  }
  paymentsVolume: {
    daily: number
    weekly: number
  }
  securitiesFlow: {
    purchases: number
    sales: number
    net: number
  }
}

// ============ INTEREST RATE METRICS ============

export interface NIISensitivity {
  plus100bp: number
  minus100bp: number
}

export interface EVESensitivity {
  plus100bp: number
  minus100bp: number
}

export interface RepricingGap {
  bucket: string
  assets: number
  liabilities: number
  gap: number
}

export interface InterestRateMetrics {
  asOfDate: Date
  nii: {
    mtd: number
    qtd: number
    ytd: number
    runRate: number
  }
  nim: number
  sensitivity: {
    nii: NIISensitivity
    eve: EVESensitivity
  }
  depositBeta: {
    overall: number
    bySegment: { [key: string]: number }
    lag: number
  }
  duration: {
    assets: number
    liabilities: number
  }
  repricingGaps: RepricingGap[]
  hedgeCoverage: {
    ratio: number
    hedgePnL: number
  }
}

// ============ BALANCE SHEET METRICS ============

export interface BalanceSheetMetrics {
  asOfDate: Date
  totalAssets: number
  totalLiabilities: number
  loans: {
    total: number
    bySegment: { [key: string]: number }
    fixedFloating: {
      fixed: number
      floating: number
    }
  }
  deposits: {
    total: number
    bySegment: { [key: string]: number }
    insuredVsUninsured: {
      insured: number
      uninsured: number
    }
  }
  securities: {
    afs: number
    htm: number
    duration: number
  }
  cashAndReserves: number
  costMetrics: {
    costOfDeposits: number
    costOfFunds: number
  }
  ratios: {
    loanToDeposit: number
  }
  fundingMix: {
    deposits: number
    secured: number
    unsecured: number
    longTermDebt: number
  }
  qualityProxies: {
    nplRatio: number
    ncoRatio: number
    aclRatio: number
  }
}

// ============ PEER COMPARISON METRICS ============

export interface MarketPerformance {
  price: number
  volume: number
  dailyReturn: number
  returns: {
    '1D': number
    '5D': number
    '1M': number
    'YTD': number
    '1Y': number
  }
  marketCap: number
  volatility: {
    '30D': number
    '90D': number
  }
  beta: number
  shortInterest: number
}

export interface Valuation {
  peTTM: number
  peForward: number
  pb: number
  ptbv: number
  dividendYield: number
  payoutRatio: number
}

export interface Fundamentals {
  roe: number
  roa?: number
  rotce: number
  efficiencyRatio: number
  nim: number
  cet1Ratio: number
  loanGrowth: number
  depositGrowth: number
}

export interface NewsItem {
  id: string
  timestamp: Date
  headline: string
  entity: string
  topicTags: string[]
  sentimentScore: number  // -1 to +1
  relevanceScore: number  // 0 to 1
  eventFlag: boolean
  summary?: string
}

export interface PeerData {
  ticker: string
  name: string
  marketData: MarketPerformance
  valuation: Valuation
  fundamentals: Fundamentals
  creditMarket: {
    cdsSpread: number
    bondSpread: number
    spreadChange: number
  }
  news: NewsItem[]
}

// ============ BUSINESS FLOW METRICS ============

export interface ClientActivity {
  clientId: string
  clientName: string
  depositBalance: number
  depositChange: {
    '1D': number
    '7D': number
  }
  paymentsVolume: number
  paymentsValue: number
  custodyAUA: number
  custodyChange: number
  creditLineUtilization: number
  creditLineChange: number
  concentrationMetrics: {
    shareOfDeposits: number
    shareOfOutflows: number
  }
  alerts: AlertFlag[]
}

export interface AlertFlag {
  type: 'material_move' | 'zscore_anomaly' | 'repeated_outflows' | 'limit_breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
}

export interface CustodyMetrics {
  aua: number
  auc: number
  changes: {
    '1D': number
    '1W': number
  }
  netFlows: number
  settlementVolume: number
  failsRate: number
  intradayOverdraft: number
}

export interface CommitmentDraw {
  clientId: string
  facilityId: string
  amount: number
  timestamp: Date
  utilization: number
}

export interface BusinessFlowMetrics {
  asOfDate: Date
  topClients: ClientActivity[]
  custody: CustodyMetrics
  depositActivity: {
    grossInflows: number
    grossOutflows: number
    netFlows: number
    bySegment: { [key: string]: number }
    uninsuredPercent: number
    costOfDeposits: number
  }
  commitmentDraws: {
    committed: number
    outstanding: number
    undrawn: number
    utilization: number
    draws: CommitmentDraw[]
    bySector: { [key: string]: number }
  }
  newUnderwritings: NewUnderwriting[]
}

export interface NewUnderwriting {
  dealId: string
  stage: 'submitted' | 'approved' | 'committed' | 'funded'
  committedAmount: number
  expectedCloseDate: Date
  expectedRWA: number
  expectedRevenue: number
  liquidityImpact: number
}

// ============ FORECAST METRICS ============

export interface ForecastPoint {
  date: string
  base: number
  stress?: number
  custom?: number
}

export interface ScenarioAssumptions {
  rateShock: number  // basis points
  depositRunoff: number  // percent
  loanGrowth: number  // percent
  fundingSpreadWidening: number  // basis points
  capitalActions: {
    dividends: boolean
    buybacks: boolean
    issuance: boolean
  }
}

export interface DriverContribution {
  driver: string
  contribution: number
  percentage: number
}

export interface Sensitivity {
  parameter: string
  impact: number
  impactPercent: number
}

export interface ForecastMetrics {
  metric: string
  horizon: '7D' | '12W' | '8Q'
  forecast: ForecastPoint[]
  scenarios: {
    base: ScenarioAssumptions
    stress: ScenarioAssumptions
    custom?: ScenarioAssumptions
  }
  drivers: DriverContribution[]
  sensitivities: Sensitivity[]
  modelMetadata: {
    type: string
    trainingWindow: string
    version: string
    lastUpdated: Date
  }
}

// ============ AGGREGATE TYPES ============

export interface KeyMetricsData {
  liquidity: LiquidityMetrics
  capital: CapitalMetrics
  orderFlow: OrderFlowMetrics
  interestRate: InterestRateMetrics
  balanceSheet: BalanceSheetMetrics
}

export interface DashboardData {
  keyMetrics: KeyMetricsData
  peerComparison: PeerData[]
  businessFlow: BusinessFlowMetrics
  forecasts: ForecastMetrics[]
}

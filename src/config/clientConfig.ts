// Client configuration system for multi-client demo support
// Each client config defines branding, financial parameters, and data generation settings
//
// Additional clients can be defined in clients.private.ts (gitignored).
// That file imports registerClient() and calls it for each private config.

export interface ClientColors {
  primary: string
  primaryDark: string
  primaryDarkest: string
  accent: string
  accentLight: string
  /** Override for headings/metric text when primary is too alarming (e.g. red) */
  textPrimary?: string
  textPrimaryRGB?: string
  /** RGB triplet for rgba() usage, e.g. "0, 103, 71" */
  primaryRGB: string
  primaryDarkRGB: string
  accentRGB: string
  chartColors: string[]
}

export interface ClientLogo {
  /** Two-letter monogram (e.g. "AB") */
  monogram: string
  /** Lines of text below the monogram */
  textLines: string[]
}

export interface ClientSegment {
  name: string
  revenueShare: number // 0-1
  expenseShare: number // 0-1
  assets: number
  roe: number
  efficiencyRatio: number
  headcount: number
  revenueGrowth: number
}

export interface ClientRevenueCategory {
  category: string
  share: number // 0-1
}

export interface ClientDepartment {
  department: string
  employees: number
  revenueShare: number // 0-1 (0 for cost centers)
}

export interface ClientAUCDistribution {
  byAssetClass: { class: string; percentage: number }[]
  byRegion: { region: string; percentage: number }[]
  byClientSegment: { segment: string; percentage: number }[]
}

export interface ClientPeer {
  ticker: string
  name: string
  isOwn?: boolean
}

export interface ClientAIContext {
  companyDescription: string
  companyBulletPoints: string[]
  chartColorsCSS: string
}

export interface ClientConfig {
  id: string
  name: string
  shortName: string
  ticker: string
  headquarters: string
  colors: ClientColors
  logo: ClientLogo

  // Financial parameters
  baseAUC: number
  baseRevenue: number
  clientCount: number
  marketCap: number
  dividendYield: number
  efficiencyRatio: number
  totalEmployees: number
  sharesOutstanding: number
  totalBookValue: number
  intangibles: number
  taxRate: number
  roe: number
  roa: number
  nonInterestIncomeShare: number // 0-1 (e.g. 0.92 = 92% fee-based)

  // Business structure
  segments: ClientSegment[]
  revenueCategories: ClientRevenueCategory[]
  departments: ClientDepartment[]
  aucDistribution: ClientAUCDistribution

  // Market & peers
  peers: ClientPeer[]
  globalRanking: number

  // AI prompt context
  aiContext: ClientAIContext
}

// ---------------------------------------------------------------------------
// Acme Bank Configuration (generic demo client)
// ---------------------------------------------------------------------------
const ACME_BANK_COLORS: ClientColors = {
  primary: '#006747',
  primaryDark: '#004d35',
  primaryDarkest: '#003829',
  accent: '#D4AF37',
  accentLight: '#e8d48b',
  primaryRGB: '0, 103, 71',
  primaryDarkRGB: '0, 77, 53',
  accentRGB: '212, 175, 55',
  chartColors: ['#006747', '#D4AF37', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
}

export const ACME_BANK_CONFIG: ClientConfig = {
  id: 'acme',
  name: 'Acme Bank Corporation',
  shortName: 'Acme Bank',
  ticker: 'ACME',
  headquarters: 'New York, New York',
  colors: { ...ACME_BANK_COLORS },
  logo: {
    monogram: 'AB',
    textLines: ['ACME', 'BANK'],
  },

  baseAUC: 8_500_000_000_000,
  baseRevenue: 12_000_000_000,
  clientCount: 1_200,
  marketCap: 32_000_000_000,
  dividendYield: 2.8,
  efficiencyRatio: 61.5,
  totalEmployees: 35_000,
  sharesOutstanding: 420_000_000,
  totalBookValue: 28_000_000_000,
  intangibles: 5_200_000_000,
  taxRate: 0.21,
  roe: 12.4,
  roa: 0.95,
  nonInterestIncomeShare: 0.65,

  segments: [
    {
      name: 'Commercial Banking',
      revenueShare: 0.35,
      expenseShare: 0.32,
      assets: 180_000_000_000,
      roe: 14.2,
      efficiencyRatio: 58.5,
      headcount: 12_000,
      revenueGrowth: 4.8,
    },
    {
      name: 'Wealth & Asset Management',
      revenueShare: 0.30,
      expenseShare: 0.28,
      assets: 95_000_000_000,
      roe: 13.1,
      efficiencyRatio: 62.3,
      headcount: 8_500,
      revenueGrowth: 5.5,
    },
    {
      name: 'Capital Markets',
      revenueShare: 0.20,
      expenseShare: 0.22,
      assets: 120_000_000_000,
      roe: 10.8,
      efficiencyRatio: 66.8,
      headcount: 6_500,
      revenueGrowth: 3.2,
    },
    {
      name: 'Retail Banking',
      revenueShare: 0.15,
      expenseShare: 0.18,
      assets: 85_000_000_000,
      roe: 9.5,
      efficiencyRatio: 72.1,
      headcount: 8_000,
      revenueGrowth: 2.1,
    },
  ],

  revenueCategories: [
    { category: 'Net Interest Income', share: 0.35 },
    { category: 'Asset Management Fees', share: 0.22 },
    { category: 'Transaction & Advisory', share: 0.18 },
    { category: 'Lending Fees', share: 0.12 },
    { category: 'Trading Revenue', share: 0.08 },
    { category: 'Other Income', share: 0.05 },
  ],

  departments: [
    { department: 'Commercial Banking', employees: 12_000, revenueShare: 0.35 },
    { department: 'Wealth & Asset Management', employees: 8_500, revenueShare: 0.30 },
    { department: 'Capital Markets', employees: 6_500, revenueShare: 0.20 },
    { department: 'Retail Banking', employees: 8_000, revenueShare: 0.15 },
  ],

  aucDistribution: {
    byAssetClass: [
      { class: 'Equities', percentage: 42 },
      { class: 'Fixed Income', percentage: 30 },
      { class: 'Alternatives', percentage: 16 },
      { class: 'Cash & Money Market', percentage: 12 },
    ],
    byRegion: [
      { region: 'North America', percentage: 60 },
      { region: 'Europe', percentage: 22 },
      { region: 'Asia-Pacific', percentage: 13 },
      { region: 'Other', percentage: 5 },
    ],
    byClientSegment: [
      { segment: 'Institutional', percentage: 35 },
      { segment: 'High Net Worth', percentage: 25 },
      { segment: 'Corporate', percentage: 20 },
      { segment: 'Retail', percentage: 15 },
      { segment: 'Government', percentage: 5 },
    ],
  },

  peers: [
    { ticker: 'ACME', name: 'Acme Bank Corporation', isOwn: true },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
    { ticker: 'BAC', name: 'Bank of America Corp.' },
    { ticker: 'WFC', name: 'Wells Fargo & Company' },
    { ticker: 'C', name: 'Citigroup Inc.' },
    { ticker: 'USB', name: 'U.S. Bancorp' },
    { ticker: 'PNC', name: 'PNC Financial Services' },
    { ticker: 'TFC', name: 'Truist Financial Corp.' },
    { ticker: 'STT', name: 'State Street Corporation' },
    { ticker: 'BK', name: 'Bank of New York Mellon' },
    { ticker: 'SCHW', name: 'Charles Schwab Corp.' },
    { ticker: 'KEY', name: 'KeyCorp' },
  ],
  globalRanking: 8,

  aiContext: {
    companyDescription: 'Acme Bank Corporation, a diversified financial services company',
    companyBulletPoints: [
      'Assets Under Custody/Administration: $8.5 trillion',
      'Annual Revenue: ~$12 billion',
      '~35,000 employees globally',
      'Diversified across commercial, wealth, capital markets, and retail banking',
      'Headquarters: New York, New York',
    ],
    chartColorsCSS: '#006747 (green), #D4AF37 (gold), #10b981, #3b82f6, #f59e0b, #ef4444, #8b5cf6',
  },
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const CLIENT_CONFIGS: Record<string, ClientConfig> = {
  acme: ACME_BANK_CONFIG,
}

/** Register an additional client config at runtime (used by clients.private.ts). */
export function registerClient(config: ClientConfig) {
  CLIENT_CONFIGS[config.id] = config
}

// Auto-load private client configs if the file exists (Vite only).
// import.meta.glob resolves at build time; absent file = empty object, no error.
// For Node scripts (e.g. generateData.ts), import clients.private.ts explicitly.
if (typeof import.meta !== 'undefined' && typeof (import.meta as any).glob === 'function') {
  const privateModules = (import.meta as any).glob('./clients.private.ts', { eager: true })
  void privateModules // side-effect: registerClient() calls run on import
}

export const DEFAULT_CLIENT_ID = Object.keys(CLIENT_CONFIGS)[0] ?? 'acme'

export function getClientConfig(clientId: string): ClientConfig {
  return CLIENT_CONFIGS[clientId] ?? CLIENT_CONFIGS[DEFAULT_CLIENT_ID] ?? ACME_BANK_CONFIG
}

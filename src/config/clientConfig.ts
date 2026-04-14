// Client configuration system for multi-client demo support
// Each client config defines branding, financial parameters, and data generation settings

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
  /** Two-letter monogram (e.g. "NT") */
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
// Northern Trust Configuration
// ---------------------------------------------------------------------------
export const NORTHERN_TRUST_CONFIG: ClientConfig = {
  id: 'ntrs',
  name: 'Northern Trust Corporation',
  shortName: 'Northern Trust',
  ticker: 'NTRS',
  headquarters: 'Chicago, Illinois',
  colors: {
    primary: '#006747',
    primaryDark: '#004d35',
    primaryDarkest: '#003829',
    accent: '#D4AF37',
    accentLight: '#e8d48b',
    primaryRGB: '0, 103, 71',
    primaryDarkRGB: '0, 77, 53',
    accentRGB: '212, 175, 55',
    chartColors: ['#006747', '#D4AF37', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
  },
  logo: {
    monogram: 'NT',
    textLines: ['NORTHERN', 'TRUST'],
  },

  baseAUC: 15_800_000_000_000,
  baseRevenue: 7_100_000_000,
  clientCount: 450,
  marketCap: 18_500_000_000,
  dividendYield: 3.45,
  efficiencyRatio: 67.8,
  totalEmployees: 19_500,
  sharesOutstanding: 207_000_000,
  totalBookValue: 14_800_000_000,
  intangibles: 2_500_000_000,
  taxRate: 0.19,
  roe: 13.8,
  roa: 1.02,
  nonInterestIncomeShare: 0.92,

  segments: [
    {
      name: 'C&IS (Corporate & Institutional Services)',
      revenueShare: 0.58,
      expenseShare: 0.52,
      assets: 102_000_000_000,
      roe: 15.2,
      efficiencyRatio: 64.5,
      headcount: 8_200,
      revenueGrowth: 5.2,
    },
    {
      name: 'Wealth Management',
      revenueShare: 0.28,
      expenseShare: 0.30,
      assets: 48_000_000_000,
      roe: 11.8,
      efficiencyRatio: 75.2,
      headcount: 4_800,
      revenueGrowth: 3.8,
    },
    {
      name: 'Asset Management',
      revenueShare: 0.14,
      expenseShare: 0.18,
      assets: 25_000_000_000,
      roe: 8.5,
      efficiencyRatio: 92.8,
      headcount: 1_500,
      revenueGrowth: 2.1,
    },
  ],

  revenueCategories: [
    { category: 'Custody Fees', share: 0.42 },
    { category: 'Transaction Fees', share: 0.22 },
    { category: 'Securities Lending', share: 0.12 },
    { category: 'Fund Administration', share: 0.14 },
    { category: 'FX Revenue', share: 0.06 },
    { category: 'Other Services', share: 0.04 },
  ],

  departments: [
    { department: 'Asset Servicing', employees: 8_200, revenueShare: 0.58 },
    { department: 'Wealth Management', employees: 4_800, revenueShare: 0.28 },
    { department: 'Technology', employees: 3_100, revenueShare: 0 },
    { department: 'Operations', employees: 1_900, revenueShare: 0 },
    { department: 'Corporate', employees: 1_500, revenueShare: 0.14 },
  ],

  aucDistribution: {
    byAssetClass: [
      { class: 'Equities', percentage: 48 },
      { class: 'Fixed Income', percentage: 32 },
      { class: 'Alternatives', percentage: 12 },
      { class: 'Cash & Other', percentage: 8 },
    ],
    byRegion: [
      { region: 'Americas', percentage: 55 },
      { region: 'EMEA', percentage: 30 },
      { region: 'APAC', percentage: 15 },
    ],
    byClientSegment: [
      { segment: 'Pension Funds', percentage: 38 },
      { segment: 'Asset Managers', percentage: 28 },
      { segment: 'Insurance Companies', percentage: 18 },
      { segment: 'Endowments & Foundations', percentage: 10 },
      { segment: 'Sovereign Wealth', percentage: 6 },
    ],
  },

  peers: [
    { ticker: 'NTRS', name: 'Northern Trust Corporation', isOwn: true },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
    { ticker: 'BAC', name: 'Bank of America Corp.' },
    { ticker: 'WFC', name: 'Wells Fargo & Company' },
    { ticker: 'C', name: 'Citigroup Inc.' },
    { ticker: 'USB', name: 'U.S. Bancorp' },
    { ticker: 'PNC', name: 'PNC Financial Services' },
    { ticker: 'TFC', name: 'Truist Financial Corp.' },
    { ticker: 'STT', name: 'State Street Corporation' },
    { ticker: 'BK', name: 'Bank of New York Mellon' },
    { ticker: 'COF', name: 'Capital One Financial' },
    { ticker: 'SCHW', name: 'Charles Schwab Corp.' },
  ],
  globalRanking: 4,

  aiContext: {
    companyDescription: 'Northern Trust Corporation, one of the world\'s leading custody banks',
    companyBulletPoints: [
      'Assets Under Custody/Administration: $15.8 trillion',
      'Annual Revenue: ~$7.1 billion',
      '~19,500 employees globally',
      'Ranked 4th globally by AUC among custody banks',
      'Headquarters: Chicago, Illinois',
    ],
    chartColorsCSS: '#006747 (green), #D4AF37 (gold), #10b981, #3b82f6, #f59e0b, #ef4444, #8b5cf6',
  },
}

// ---------------------------------------------------------------------------
// Scotiabank Configuration
// ---------------------------------------------------------------------------
export const SCOTIABANK_CONFIG: ClientConfig = {
  id: 'bns',
  name: 'Bank of Nova Scotia',
  shortName: 'Scotiabank',
  ticker: 'BNS',
  headquarters: 'Toronto, Ontario',
  colors: {
    primary: '#C8102E',
    primaryDark: '#4A1525',
    primaryDarkest: '#2E0C17',
    accent: '#E8B84B',
    accentLight: '#F0D078',
    textPrimary: '#1A2B4A',
    textPrimaryRGB: '26, 43, 74',
    primaryRGB: '200, 16, 46',
    primaryDarkRGB: '74, 21, 37',
    accentRGB: '232, 184, 75',
    chartColors: ['#C8102E', '#003B5C', '#E8B84B', '#2D6A4F', '#6366F1', '#E67E22', '#8B5CF6'],
  },
  logo: {
    monogram: 'BNS',
    textLines: ['SCOTIABANK'],
  },

  baseAUC: 600_000_000_000,
  baseRevenue: 24_000_000_000,
  clientCount: 26_000_000,
  marketCap: 72_000_000_000,
  dividendYield: 5.8,
  efficiencyRatio: 54.2,
  totalEmployees: 90_000,
  sharesOutstanding: 1_215_000_000,
  totalBookValue: 62_000_000_000,
  intangibles: 12_500_000_000,
  taxRate: 0.22,
  roe: 11.5,
  roa: 0.72,
  nonInterestIncomeShare: 0.42,

  segments: [
    {
      name: 'Canadian Banking',
      revenueShare: 0.38,
      expenseShare: 0.34,
      assets: 340_000_000_000,
      roe: 14.8,
      efficiencyRatio: 48.5,
      headcount: 28_000,
      revenueGrowth: 3.2,
    },
    {
      name: 'International Banking',
      revenueShare: 0.28,
      expenseShare: 0.30,
      assets: 210_000_000_000,
      roe: 10.2,
      efficiencyRatio: 56.8,
      headcount: 35_000,
      revenueGrowth: 4.5,
    },
    {
      name: 'Global Wealth Management',
      revenueShare: 0.18,
      expenseShare: 0.18,
      assets: 120_000_000_000,
      roe: 12.1,
      efficiencyRatio: 62.3,
      headcount: 12_000,
      revenueGrowth: 5.8,
    },
    {
      name: 'Global Banking & Markets',
      revenueShare: 0.16,
      expenseShare: 0.18,
      assets: 180_000_000_000,
      roe: 9.8,
      efficiencyRatio: 58.4,
      headcount: 15_000,
      revenueGrowth: 2.1,
    },
  ],

  revenueCategories: [
    { category: 'Net Interest Income', share: 0.58 },
    { category: 'Wealth Management Fees', share: 0.12 },
    { category: 'Capital Markets Revenue', share: 0.11 },
    { category: 'Banking Fees & Commissions', share: 0.09 },
    { category: 'Insurance Revenue', share: 0.05 },
    { category: 'Other Non-Interest Income', share: 0.05 },
  ],

  departments: [
    { department: 'Canadian Banking', employees: 28_000, revenueShare: 0.38 },
    { department: 'International Banking', employees: 35_000, revenueShare: 0.28 },
    { department: 'Global Wealth Management', employees: 12_000, revenueShare: 0.18 },
    { department: 'Global Banking & Markets', employees: 15_000, revenueShare: 0.16 },
  ],

  aucDistribution: {
    byAssetClass: [
      { class: 'Equities', percentage: 38 },
      { class: 'Fixed Income', percentage: 35 },
      { class: 'Real Estate & Alternatives', percentage: 15 },
      { class: 'Cash & Money Market', percentage: 12 },
    ],
    byRegion: [
      { region: 'Canada', percentage: 45 },
      { region: 'Latin America & Caribbean', percentage: 25 },
      { region: 'United States', percentage: 20 },
      { region: 'Asia-Pacific', percentage: 10 },
    ],
    byClientSegment: [
      { segment: 'Retail & Mass Affluent', percentage: 35 },
      { segment: 'High Net Worth', percentage: 25 },
      { segment: 'Institutional', percentage: 22 },
      { segment: 'Corporate', percentage: 12 },
      { segment: 'Government & Public Sector', percentage: 6 },
    ],
  },

  peers: [
    { ticker: 'BNS', name: 'Bank of Nova Scotia', isOwn: true },
    { ticker: 'TD', name: 'Toronto-Dominion Bank' },
    { ticker: 'RY', name: 'Royal Bank of Canada' },
    { ticker: 'BMO', name: 'Bank of Montreal' },
    { ticker: 'CM', name: 'Canadian Imperial Bank of Commerce' },
    { ticker: 'NA', name: 'National Bank of Canada' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
    { ticker: 'BAC', name: 'Bank of America Corp.' },
    { ticker: 'WFC', name: 'Wells Fargo & Company' },
    { ticker: 'C', name: 'Citigroup Inc.' },
    { ticker: 'BBVA', name: 'Banco Bilbao Vizcaya Argentaria' },
    { ticker: 'SAN', name: 'Banco Santander' },
  ],
  globalRanking: 15,

  aiContext: {
    companyDescription: 'Bank of Nova Scotia (Scotiabank), one of Canada\'s Big Five banks and a leading international bank',
    companyBulletPoints: [
      'Total Assets Under Management: ~$600 billion',
      'Annual Revenue: ~$24 billion USD',
      '~90,000 employees globally',
      'Strong presence in Canada, Latin America & Caribbean',
      'Headquarters: Toronto, Ontario',
    ],
    chartColorsCSS: '#C8102E (red), #003B5C (navy), #E8B84B (gold), #2D6A4F (green), #6366F1 (indigo), #E67E22 (orange), #8B5CF6 (purple)',
  },
}

// ---------------------------------------------------------------------------
// Acme Bank Configuration (generic demo client, reuses Northern Trust colors)
// ---------------------------------------------------------------------------
export const ACME_BANK_CONFIG: ClientConfig = {
  id: 'acme',
  name: 'Acme Bank Corporation',
  shortName: 'Acme Bank',
  ticker: 'ACME',
  headquarters: 'New York, New York',
  colors: { ...NORTHERN_TRUST_CONFIG.colors },
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
// In public mode (VITE_PUBLIC_CLIENTS=acme), Vite injects boolean constants
// (__INCLUDE_NTRS__, etc.) that let Rollup/terser eliminate entire config
// objects as dead code, so no proprietary client names appear in the bundle.

declare const __INCLUDE_NTRS__: boolean
declare const __INCLUDE_BNS__: boolean
declare const __INCLUDE_ACME__: boolean

export const CLIENT_CONFIGS: Record<string, ClientConfig> = {}
if (typeof __INCLUDE_NTRS__ === 'undefined' || __INCLUDE_NTRS__) CLIENT_CONFIGS.ntrs = NORTHERN_TRUST_CONFIG
if (typeof __INCLUDE_BNS__ === 'undefined' || __INCLUDE_BNS__) CLIENT_CONFIGS.bns = SCOTIABANK_CONFIG
if (typeof __INCLUDE_ACME__ === 'undefined' || __INCLUDE_ACME__) CLIENT_CONFIGS.acme = ACME_BANK_CONFIG

export const DEFAULT_CLIENT_ID = Object.keys(CLIENT_CONFIGS)[0] ?? 'acme'

export function getClientConfig(clientId: string): ClientConfig {
  return CLIENT_CONFIGS[clientId] ?? CLIENT_CONFIGS[DEFAULT_CLIENT_ID] ?? ACME_BANK_CONFIG
}

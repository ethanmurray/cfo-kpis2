import { format, subMonths, subDays } from 'date-fns'

// Utility to generate random number within range
export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

// Utility to format currency
export const formatCurrency = (value: number, decimals = 0): string => {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(decimals)}T`
  } else if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(decimals)}B`
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(decimals)}M`
  }
  return `$${value.toFixed(decimals)}`
}

// Utility to format percentage
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`
}

// Alias for consistency
export const formatPercent = formatPercentage

// Utility to format basis points
export const formatBps = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)} bps`
}

// Generate time series data with seasonal patterns
export const generateTimeSeries = (
  months: number,
  baseValue: number,
  growthRate: number,
  volatility: number = 0.05
): Array<{ date: string; value: number }> => {
  const data = []
  let currentValue = baseValue

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i)

    // Add seasonal component (Q4 higher, Q1 lower)
    const month = date.getMonth()
    let seasonal = 1.0
    if (month >= 9) seasonal = 1.08 // Q4
    else if (month <= 2) seasonal = 0.95 // Q1
    else seasonal = 1.0 // Q2/Q3

    // Add growth trend
    const growth = Math.pow(1 + growthRate / 12, months - i)

    // Add random volatility
    const randomFactor = 1 + (Math.random() - 0.5) * volatility

    currentValue = baseValue * growth * seasonal * randomFactor

    data.push({
      date: format(date, 'yyyy-MM'),
      value: currentValue,
    })
  }

  return data
}

// Generate client names
const clientPrefixes = [
  'Global', 'National', 'International', 'United', 'First', 'Capital',
  'Strategic', 'Premier', 'Advanced', 'Dynamic', 'Sovereign', 'Atlantic',
  'Pacific', 'Continental', 'Metropolitan', 'Regional', 'Federal'
]

const clientSuffixes = [
  'Pension Fund', 'Asset Management', 'Investment Trust', 'Sovereign Wealth',
  'Insurance Company', 'Endowment Fund', 'Mutual Fund', 'Hedge Fund',
  'Private Equity', 'Retirement Fund', 'Foundation', 'Trust Company'
]

export const generateClientName = (): string => {
  const prefix = clientPrefixes[Math.floor(Math.random() * clientPrefixes.length)]
  const suffix = clientSuffixes[Math.floor(Math.random() * clientSuffixes.length)]
  return `${prefix} ${suffix}`
}

// Generate clients
export const generateClients = (count: number) => {
  const segments = ['Pension Funds', 'Asset Managers', 'Insurance Companies', 'Sovereign Wealth']
  const regions = ['Americas', 'EMEA', 'APAC']

  const clients = []

  for (let i = 0; i < count; i++) {
    const auc = randomInRange(100_000_000, 50_000_000_000)
    const revenue = auc * randomInRange(0.0008, 0.0025) // 8-25 bps

    clients.push({
      id: `client-${i}`,
      name: generateClientName(),
      auc,
      revenue,
      segment: segments[Math.floor(Math.random() * segments.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      onboardingDate: format(
        subMonths(new Date(), Math.floor(Math.random() * 120)),
        'yyyy-MM-dd'
      ),
    })
  }

  return clients.sort((a, b) => b.auc - a.auc)
}

// Generate risk events
export const generateRiskEvents = (count: number) => {
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']
  const descriptions = [
    'Settlement delay in APAC region',
    'System outage - trade processing',
    'Failed reconciliation - custody account',
    'Pricing error - fixed income securities',
    'Corporate action missed deadline',
    'Client complaint - service delay',
    'Regulatory reporting late filing',
    'Operational error - cash movement',
    'Third-party vendor outage',
    'Fraud attempt detected and prevented',
  ]

  const events = []

  for (let i = 0; i < count; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const impactMultiplier = severity === 'critical' ? 1000000 :
                            severity === 'high' ? 500000 :
                            severity === 'medium' ? 100000 : 10000

    events.push({
      date: format(subDays(new Date(), Math.floor(Math.random() * 90)), 'yyyy-MM-dd'),
      severity,
      impact: randomInRange(impactMultiplier * 0.5, impactMultiplier * 2),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
    })
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

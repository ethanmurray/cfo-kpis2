import { ForecastMetrics, ForecastPoint, ScenarioAssumptions, DriverContribution, Sensitivity } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { addDays, addWeeks, addQuarters, format } from 'date-fns'

// Simple linear regression for forecasting
function linearRegression(points: number[]): { slope: number; intercept: number } {
  const n = points.length
  const sumX = points.reduce((sum, _, i) => sum + i, 0)
  const sumY = points.reduce((sum, y) => sum + y, 0)
  const sumXY = points.reduce((sum, y, i) => sum + i * y, 0)
  const sumXX = points.reduce((sum, _, i) => sum + i * i, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

// Generate historical data for training
function generateHistoricalData(baseValue: number, periods: number, trend: number, volatility: number): number[] {
  const data: number[] = []
  let current = baseValue

  for (let i = 0; i < periods; i++) {
    const trendComponent = current * trend
    const noise = current * (Math.random() - 0.5) * volatility
    current = current + trendComponent + noise
    data.push(current)
  }

  return data
}

// Generate base forecast using linear regression
function generateBaseForecast(
  historical: number[],
  periods: number,
  volatility: number = 0.01
): number[] {
  const { slope, intercept } = linearRegression(historical)
  const forecast: number[] = []
  const n = historical.length

  for (let i = 0; i < periods; i++) {
    const predicted = slope * (n + i) + intercept
    const noise = predicted * (Math.random() - 0.5) * volatility
    forecast.push(predicted + noise)
  }

  return forecast
}

// Apply scenario adjustments
function applyScenario(
  baseForecast: number[],
  scenario: ScenarioAssumptions,
  metric: string
): number[] {
  return baseForecast.map((value, index) => {
    let adjusted = value

    // Rate shock impact (increases over time)
    if (metric === 'nii' || metric === 'nim') {
      const rateImpact = (scenario.rateShock / 10000) * value * (index / baseForecast.length)
      adjusted += rateImpact
    }

    // Deposit runoff impact
    if (metric === 'deposits') {
      const runoffImpact = -(scenario.depositRunoff / 100) * value * (index / baseForecast.length)
      adjusted += runoffImpact
    }

    // Loan growth impact
    if (metric === 'loans') {
      const growthImpact = (scenario.loanGrowth / 100) * value * (index / baseForecast.length)
      adjusted += growthImpact
    }

    // Funding spread impact on LCR
    if (metric === 'lcr') {
      const spreadImpact = -(scenario.fundingSpreadWidening / 1000) * value
      adjusted += spreadImpact
    }

    // Capital actions impact on CET1
    if (metric === 'cet1') {
      if (!scenario.capitalActions.dividends && !scenario.capitalActions.buybacks) {
        adjusted += 0.1 * (index / baseForecast.length)  // Capital accumulation
      }
      if (scenario.capitalActions.issuance) {
        adjusted += 0.15  // Immediate boost
      }
    }

    return adjusted
  })
}

export function generateForecastMetrics(
  metric: 'deposits' | 'loans' | 'nii' | 'lcr' | 'cet1',
  horizon: '7D' | '12W' | '8Q'
): ForecastMetrics {
  // Base values
  const baseValues = {
    deposits: 410000,
    loans: 330000,
    nii: 2800,
    lcr: 120,
    cet1: 11.5
  }

  const baseValue = baseValues[metric]

  // Generate historical data for training
  const historicalPeriods = horizon === '7D' ? 30 : horizon === '12W' ? 52 : 12
  const historical = generateHistoricalData(baseValue, historicalPeriods, 0.002, 0.02)

  // Forecast periods
  const forecastPeriods = horizon === '7D' ? 7 : horizon === '12W' ? 12 : 8

  // Base scenario
  const baseForecast = generateBaseForecast(historical, forecastPeriods, 0.015)

  // Scenario assumptions
  const baseScenario: ScenarioAssumptions = {
    rateShock: 0,
    depositRunoff: 0,
    loanGrowth: 5,
    fundingSpreadWidening: 0,
    capitalActions: {
      dividends: true,
      buybacks: true,
      issuance: false
    }
  }

  const stressScenario: ScenarioAssumptions = {
    rateShock: -100,
    depositRunoff: 15,
    loanGrowth: -5,
    fundingSpreadWidening: 50,
    capitalActions: {
      dividends: false,
      buybacks: false,
      issuance: false
    }
  }

  const customScenario: ScenarioAssumptions = {
    rateShock: 50,
    depositRunoff: 5,
    loanGrowth: 8,
    fundingSpreadWidening: 10,
    capitalActions: {
      dividends: true,
      buybacks: false,
      issuance: true
    }
  }

  // Apply scenarios
  const stressForecast = applyScenario(baseForecast, stressScenario, metric)
  const customForecast = applyScenario(baseForecast, customScenario, metric)

  // Generate dates
  let currentDate = new Date()
  const forecastPoints: ForecastPoint[] = []

  for (let i = 0; i < forecastPeriods; i++) {
    if (horizon === '7D') {
      currentDate = addDays(currentDate, 1)
    } else if (horizon === '12W') {
      currentDate = addWeeks(currentDate, 1)
    } else {
      currentDate = addQuarters(currentDate, 1)
    }

    forecastPoints.push({
      date: format(currentDate, horizon === '7D' ? 'yyyy-MM-dd' : horizon === '12W' ? 'yyyy-MM-dd' : 'yyyy-MM'),
      base: baseForecast[i],
      stress: stressForecast[i],
      custom: customForecast[i]
    })
  }

  // Driver contributions
  const drivers = generateDriverContributions(metric, baseForecast[forecastPeriods - 1], baseForecast[0])

  // Sensitivities
  const sensitivities = generateSensitivities(metric, baseValue)

  return {
    metric: metric.toUpperCase(),
    horizon,
    forecast: forecastPoints,
    scenarios: {
      base: baseScenario,
      stress: stressScenario,
      custom: customScenario
    },
    drivers,
    sensitivities,
    modelMetadata: {
      type: 'Linear Regression',
      trainingWindow: `${historicalPeriods} ${horizon === '7D' ? 'days' : horizon === '12W' ? 'weeks' : 'quarters'}`,
      version: '1.0.0',
      lastUpdated: new Date()
    }
  }
}

function generateDriverContributions(
  metric: string,
  endValue: number,
  startValue: number
): DriverContribution[] {
  const totalChange = endValue - startValue

  const drivers: { [key: string]: string[] } = {
    deposits: ['Retail Growth', 'Commercial Growth', 'Institutional Flows', 'Rate Environment', 'Seasonal Effects'],
    loans: ['Originations', 'Prepayments', 'Charge-offs', 'Portfolio Mix', 'Economic Conditions'],
    nii: ['Volume Growth', 'Margin Expansion', 'Rate Changes', 'Mix Shift', 'Hedge Impact'],
    lcr: ['HQLA Changes', 'Outflow Dynamics', 'Inflow Dynamics', 'Regulatory Changes', 'Market Conditions'],
    cet1: ['Net Income', 'RWA Growth', 'Dividends', 'AOCI Impact', 'Regulatory Changes']
  }

  const metricDrivers = drivers[metric] || ['Driver 1', 'Driver 2', 'Driver 3', 'Driver 4', 'Driver 5']

  // Distribute the change across drivers
  const contributions = metricDrivers.map((driver, index) => {
    const weight = Math.random()
    return { driver, weight }
  })

  const totalWeight = contributions.reduce((sum, c) => sum + c.weight, 0)

  return contributions.map(c => ({
    driver: c.driver,
    contribution: (c.weight / totalWeight) * totalChange,
    percentage: (c.weight / totalWeight) * 100
  }))
}

function generateSensitivities(metric: string, baseValue: number): Sensitivity[] {
  const sensitivities: { [key: string]: { parameter: string; impact: number }[] } = {
    deposits: [
      { parameter: 'Rate +25bp', impact: baseValue * -0.02 },
      { parameter: 'Rate -25bp', impact: baseValue * 0.015 },
      { parameter: 'Economic Growth +1%', impact: baseValue * 0.03 },
      { parameter: 'Competitor Action', impact: baseValue * -0.015 },
      { parameter: 'Seasonal Factors', impact: baseValue * 0.01 }
    ],
    loans: [
      { parameter: 'Rate +25bp', impact: baseValue * -0.025 },
      { parameter: 'Rate -25bp', impact: baseValue * 0.02 },
      { parameter: 'Credit Standards Tightening', impact: baseValue * -0.04 },
      { parameter: 'Economic Growth +1%', impact: baseValue * 0.05 },
      { parameter: 'Prepayment Speed +10%', impact: baseValue * -0.015 }
    ],
    nii: [
      { parameter: 'Rate +25bp', impact: baseValue * 0.08 },
      { parameter: 'Rate -25bp', impact: baseValue * -0.06 },
      { parameter: 'Deposit Beta +10%', impact: baseValue * -0.03 },
      { parameter: 'Volume Growth +5%', impact: baseValue * 0.05 },
      { parameter: 'Mix Shift to Higher Margin', impact: baseValue * 0.025 }
    ],
    lcr: [
      { parameter: 'HQLA +$10B', impact: 5 },
      { parameter: 'HQLA -$10B', impact: -5 },
      { parameter: 'Outflows +10%', impact: -8 },
      { parameter: 'Outflows -10%', impact: 8 },
      { parameter: 'Market Stress Event', impact: -12 }
    ],
    cet1: [
      { parameter: 'ROA +25bp', impact: 0.4 },
      { parameter: 'RWA Growth +10%', impact: -1.2 },
      { parameter: 'Dividend Suspension', impact: 0.3 },
      { parameter: 'AOCI Loss $5B', impact: -0.5 },
      { parameter: 'Capital Issuance $3B', impact: 0.8 }
    ]
  }

  const metricSensitivities = sensitivities[metric] || []

  return metricSensitivities.map(s => ({
    parameter: s.parameter,
    impact: s.impact,
    impactPercent: (s.impact / baseValue) * 100
  }))
}

export function getAllForecasts(): {
  deposits7D: ForecastMetrics
  deposits12W: ForecastMetrics
  loans12W: ForecastMetrics
  nii8Q: ForecastMetrics
  lcr7D: ForecastMetrics
  cet18Q: ForecastMetrics
} {
  return {
    deposits7D: generateForecastMetrics('deposits', '7D'),
    deposits12W: generateForecastMetrics('deposits', '12W'),
    loans12W: generateForecastMetrics('loans', '12W'),
    nii8Q: generateForecastMetrics('nii', '8Q'),
    lcr7D: generateForecastMetrics('lcr', '7D'),
    cet18Q: generateForecastMetrics('cet1', '8Q')
  }
}

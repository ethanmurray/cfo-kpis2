import { CapitalMetrics, TimeSeriesPoint } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { subMonths, format } from 'date-fns'

export function generateCapitalMetrics(asOfDate: Date = new Date()): CapitalMetrics {
  // RWA Components (in billions)
  const creditRWA = randomInRange(280, 350)
  const marketRWA = randomInRange(40, 60)
  const operationalRWA = randomInRange(45, 65)
  const totalRWA = creditRWA + marketRWA + operationalRWA

  // CET1 Capital (in billions)
  const cet1Capital = randomInRange(45, 55)
  const cet1Ratio = (cet1Capital / totalRWA) * 100

  // Tier 1 Capital (CET1 + Additional Tier 1)
  const additionalTier1 = randomInRange(3, 6)
  const tier1Capital = cet1Capital + additionalTier1
  const tier1Ratio = (tier1Capital / totalRWA) * 100

  // Total Capital (Tier 1 + Tier 2)
  const tier2Capital = randomInRange(8, 12)
  const totalCapital = tier1Capital + tier2Capital
  const totalCapitalRatio = (totalCapital / totalRWA) * 100

  // Regulatory minimums and targets
  const cet1Minimum = 4.5
  const cet1Buffer = 2.5  // Conservation buffer
  const cet1GSIB = 1.0    // G-SIB surcharge
  const cet1Target = cet1Minimum + cet1Buffer + cet1GSIB + 1.5  // Internal buffer

  const headroomToTarget = cet1Ratio - cet1Target
  const headroomToMinimum = cet1Ratio - (cet1Minimum + cet1Buffer + cet1GSIB)

  // SLR (Supplementary Leverage Ratio)
  const totalLeverageExposure = randomInRange(550, 650)
  const slrRatio = (tier1Capital / totalLeverageExposure) * 100

  // AOCI (Accumulated Other Comprehensive Income) - unrealized gains/losses on AFS securities
  const unrealizedGainLoss = randomInRange(-8, 2)  // Typically negative in rising rate environment
  const capitalSensitivity = randomInRange(0.15, 0.25)  // Impact on CET1 ratio per $1B change

  return {
    asOfDate,
    cet1: {
      ratio: cet1Ratio,
      capital: cet1Capital,
      rwa: {
        credit: creditRWA,
        market: marketRWA,
        operational: operationalRWA,
        total: totalRWA
      },
      headroom: {
        toTarget: headroomToTarget,
        toMinimum: headroomToMinimum
      },
      threshold: {
        red: cet1Minimum + cet1Buffer + cet1GSIB,
        amber: cet1Target - 0.5,
        green: cet1Target
      }
    },
    tier1: {
      ratio: tier1Ratio,
      capital: tier1Capital
    },
    totalCapital: {
      ratio: totalCapitalRatio,
      capital: totalCapital
    },
    slr: {
      ratio: slrRatio,
      tier1Capital,
      totalLeverageExposure
    },
    aoci: {
      unrealizedGainLoss,
      capitalSensitivity
    }
  }
}

export function generateCapitalTimeSeries(
  metric: 'cet1' | 'tier1' | 'slr' | 'rwa',
  quarters: number = 12
): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  const baseValues = {
    cet1: 11.5,
    tier1: 13.2,
    slr: 6.8,
    rwa: 400
  }

  const trends = {
    cet1: 0.002,   // Gradual improvement
    tier1: 0.002,
    slr: 0.001,
    rwa: 0.005     // Gradual growth
  }

  let currentValue = baseValues[metric]

  for (let i = quarters - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i * 3)

    // Add trend
    currentValue = currentValue * (1 + trends[metric])

    // Add some volatility
    const volatility = 1 + (Math.random() - 0.5) * 0.01

    currentValue = currentValue * volatility

    data.push({
      date: format(date, 'yyyy-MM'),
      value: currentValue,
      label: format(date, 'QQQ yyyy')
    })
  }

  return data
}

export function generateRWAComposition() {
  const creditRWA = randomInRange(280, 350)
  const marketRWA = randomInRange(40, 60)
  const operationalRWA = randomInRange(45, 65)
  const total = creditRWA + marketRWA + operationalRWA

  return [
    { name: 'Credit Risk', value: creditRWA, percentage: (creditRWA / total) * 100 },
    { name: 'Market Risk', value: marketRWA, percentage: (marketRWA / total) * 100 },
    { name: 'Operational Risk', value: operationalRWA, percentage: (operationalRWA / total) * 100 }
  ]
}

export function generateCET1Waterfall(currentCET1: number, previousCET1: number) {
  const delta = currentCET1 - previousCET1

  // Decompose the change into drivers
  const earnings = randomInRange(0.3, 0.6)
  const dividends = randomInRange(-0.2, -0.15)
  const rwaGrowth = randomInRange(-0.2, 0.1)
  const aociImpact = randomInRange(-0.15, 0.05)
  const other = delta - earnings - dividends - rwaGrowth - aociImpact

  return [
    { name: 'Prior Quarter CET1', value: previousCET1, isTotal: true },
    { name: 'Net Income', value: earnings },
    { name: 'Dividends', value: dividends },
    { name: 'RWA Growth', value: rwaGrowth },
    { name: 'AOCI Impact', value: aociImpact },
    { name: 'Other', value: other },
    { name: 'Current Quarter CET1', value: currentCET1, isTotal: true }
  ]
}

export function generateCapitalStressScenario() {
  const base = generateCapitalMetrics()

  // Adverse scenario: severe recession
  const stressCET1 = base.cet1.ratio - randomInRange(2.0, 3.5)
  const stressRWA = base.cet1.rwa.total * randomInRange(1.15, 1.25)

  // Severely adverse scenario
  const severelyAdverseCET1 = base.cet1.ratio - randomInRange(3.5, 5.0)
  const severelyAdverseRWA = base.cet1.rwa.total * randomInRange(1.25, 1.40)

  return {
    base: {
      cet1Ratio: base.cet1.ratio,
      rwa: base.cet1.rwa.total,
      capital: base.cet1.capital
    },
    adverse: {
      cet1Ratio: stressCET1,
      rwa: stressRWA,
      capital: (stressCET1 / 100) * stressRWA
    },
    severelyAdverse: {
      cet1Ratio: severelyAdverseCET1,
      rwa: severelyAdverseRWA,
      capital: (severelyAdverseCET1 / 100) * severelyAdverseRWA
    }
  }
}

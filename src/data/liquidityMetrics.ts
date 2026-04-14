import { LiquidityMetrics, TimeSeriesPoint } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { subDays, format } from 'date-fns'

export function generateLiquidityMetrics(asOfDate: Date = new Date()): LiquidityMetrics {
  // HQLA Components (in billions)
  const hqlaLevel1 = randomInRange(120, 150)  // Cash, reserves, treasuries
  const hqlaLevel2A = randomInRange(40, 60)   // Agency MBS, high-quality corporates
  const hqlaLevel2B = randomInRange(15, 25)   // Lower-rated corporates, equities
  const hqlaTotal = hqlaLevel1 + hqlaLevel2A * 0.85 + hqlaLevel2B * 0.50  // Apply haircuts

  // Cash Outflows (30-day stress scenario, in billions)
  const outflowsRetail = randomInRange(20, 30)
  const outflowsWholesale = randomInRange(40, 60)
  const outflowsSecured = randomInRange(15, 25)
  const outflowsOther = randomInRange(10, 15)
  const totalOutflows = outflowsRetail + outflowsWholesale + outflowsSecured + outflowsOther

  // Cash Inflows (30-day, in billions)
  const inflowsRetail = randomInRange(5, 10)
  const inflowsWholesale = randomInRange(10, 20)
  const inflowsSecurities = randomInRange(8, 15)
  const totalInflows = Math.min(totalOutflows * 0.75, inflowsRetail + inflowsWholesale + inflowsSecurities)  // Capped at 75% of outflows

  const netCashOutflows = totalOutflows - totalInflows

  // LCR Calculation: HQLA / Net Cash Outflows
  const lcrValue = (hqlaTotal / netCashOutflows) * 100

  // NSFR Components (in billions)
  const availableStableFunding = randomInRange(400, 500)
  const requiredStableFunding = randomInRange(350, 450)
  const nsfrValue = (availableStableFunding / requiredStableFunding) * 100

  // Unencumbered Assets
  const unencumberedCash = randomInRange(80, 100)
  const unencumberedSecurities = randomInRange(60, 80)
  const totalAssets = randomInRange(600, 700)
  const encumbrancePercent = ((totalAssets - unencumberedCash - unencumberedSecurities) / totalAssets) * 100

  // Liquidity Buffer (HQLA + contingent capacity)
  const liquidityBuffer = hqlaTotal + randomInRange(20, 40)

  // Wholesale Funding Metrics
  const wholesaleFundingReliance = randomInRange(25, 35)
  const shortTermFundingRatio = randomInRange(15, 25)

  // Deposit Stability
  const insuredPercent = randomInRange(55, 65)
  const uninsuredPercent = 100 - insuredPercent
  const outflowRate = randomInRange(8, 15)

  // Intraday Liquidity Usage
  const peakDebit = randomInRange(5, 15)
  const overdraftUsage = randomInRange(2, 8)

  return {
    asOfDate,
    lcr: {
      value: lcrValue,
      hqla: {
        level1: hqlaLevel1,
        level2A: hqlaLevel2A,
        level2B: hqlaLevel2B,
        total: hqlaTotal
      },
      netCashOutflows: {
        total: netCashOutflows,
        outflows: {
          total: totalOutflows,
          categories: {
            'Retail Deposits': outflowsRetail,
            'Wholesale Funding': outflowsWholesale,
            'Secured Funding': outflowsSecured,
            'Other Outflows': outflowsOther
          }
        },
        inflows: {
          total: totalInflows,
          categories: {
            'Retail Inflows': inflowsRetail,
            'Wholesale Inflows': inflowsWholesale,
            'Securities Maturing': inflowsSecurities
          }
        }
      },
      threshold: {
        red: 100,
        amber: 110,
        green: 115
      }
    },
    nsfr: {
      value: nsfrValue,
      availableStableFunding,
      requiredStableFunding
    },
    liquidityBuffer,
    unencumberedAssets: {
      cash: unencumberedCash,
      securities: unencumberedSecurities,
      total: unencumberedCash + unencumberedSecurities,
      encumbrancePercent
    },
    wholesaleFunding: {
      reliance: wholesaleFundingReliance,
      shortTermRatio: shortTermFundingRatio
    },
    depositStability: {
      insuredPercent,
      uninsuredPercent,
      outflowRate
    },
    intradayUsage: {
      peakDebit,
      overdraftUsage
    }
  }
}

export function generateLiquidityTimeSeries(
  metric: 'lcr' | 'hqla' | 'nsfr' | 'buffer',
  days: number = 90
): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  const baseValues = {
    lcr: 120,
    hqla: 170,
    nsfr: 115,
    buffer: 190
  }

  const volatilities = {
    lcr: 0.02,
    hqla: 0.03,
    nsfr: 0.015,
    buffer: 0.025
  }

  let currentValue = baseValues[metric]

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)

    // Add trend and volatility
    const trend = 1 + (Math.random() - 0.48) * 0.001  // Slight upward trend
    const volatility = 1 + (Math.random() - 0.5) * volatilities[metric]

    currentValue = currentValue * trend * volatility

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: currentValue
    })
  }

  return data
}

export function generateHQLAComposition() {
  const level1 = randomInRange(120, 150)
  const level2A = randomInRange(40, 60)
  const level2B = randomInRange(15, 25)

  return {
    name: 'HQLA Composition',
    data: [
      { name: 'Level 1 (Cash, Reserves, Treasuries)', value: level1, percentage: 0 },
      { name: 'Level 2A (Agency MBS, High Quality)', value: level2A * 0.85, percentage: 0 },
      { name: 'Level 2B (Corporates, Equities)', value: level2B * 0.50, percentage: 0 }
    ].map(item => ({
      ...item,
      percentage: (item.value / (level1 + level2A * 0.85 + level2B * 0.50)) * 100
    }))
  }
}

export function generateLCRWaterfall(currentLCR: number, previousLCR: number) {
  const delta = currentLCR - previousLCR

  // Decompose the change into drivers
  const hqlaChange = randomInRange(-2, 4)
  const outflowsChange = randomInRange(-3, 1)
  const inflowsChange = randomInRange(-1, 2)
  const otherChange = delta - hqlaChange - outflowsChange - inflowsChange

  return [
    { name: 'Prior LCR', value: previousLCR, isTotal: true },
    { name: 'HQLA Change', value: hqlaChange },
    { name: 'Outflows Change', value: outflowsChange },
    { name: 'Inflows Change', value: inflowsChange },
    { name: 'Other Changes', value: otherChange },
    { name: 'Current LCR', value: currentLCR, isTotal: true }
  ]
}

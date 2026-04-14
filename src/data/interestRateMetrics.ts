import { InterestRateMetrics, TimeSeriesPoint } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { subMonths, format } from 'date-fns'

export function generateInterestRateMetrics(asOfDate: Date = new Date()): InterestRateMetrics {
  // NII (Net Interest Income, in millions)
  const annualNII = randomInRange(8000, 12000)
  const monthsInYear = 12
  const monthsInQuarter = 3

  // Assume we're mid-month
  const daysInMonth = 30
  const daysPassed = 15
  const mtdNII = (annualNII / monthsInYear) * (daysPassed / daysInMonth)
  const qtdNII = (annualNII / 4) * randomInRange(0.4, 0.6)
  const ytdNII = annualNII * randomInRange(0.7, 0.85)
  const runRate = annualNII

  // NIM (Net Interest Margin, in %)
  const nim = randomInRange(2.4, 3.2)

  // NII Sensitivity (in millions for parallel 100bp shift)
  const niiPlus100bp = randomInRange(800, 1500)
  const niiMinus100bp = randomInRange(-600, -300)

  // EVE Sensitivity (Economic Value of Equity, in millions)
  const evePlus100bp = randomInRange(-2000, -800)
  const eveMinus100bp = randomInRange(800, 2000)

  // Deposit Beta (%)
  const retailBeta = randomInRange(45, 65)
  const commercialBeta = randomInRange(65, 85)
  const institutionalBeta = randomInRange(80, 95)
  const overallBeta = (retailBeta + commercialBeta + institutionalBeta) / 3
  const lag = randomInRange(2, 4)  // months

  // Duration (in years)
  const assetDuration = randomInRange(3.5, 5.0)
  const liabilityDuration = randomInRange(1.5, 2.5)

  // Repricing Gaps (in billions)
  const repricingGaps = [
    { bucket: '0-3 months', assets: randomInRange(120, 160), liabilities: randomInRange(200, 250), gap: 0 },
    { bucket: '3-6 months', assets: randomInRange(60, 90), liabilities: randomInRange(40, 70), gap: 0 },
    { bucket: '6-12 months', assets: randomInRange(80, 110), liabilities: randomInRange(50, 80), gap: 0 },
    { bucket: '1-3 years', assets: randomInRange(100, 140), liabilities: randomInRange(60, 90), gap: 0 },
    { bucket: '3-5 years', assets: randomInRange(70, 100), liabilities: randomInRange(30, 50), gap: 0 },
    { bucket: '>5 years', assets: randomInRange(90, 130), liabilities: randomInRange(40, 70), gap: 0 }
  ].map(item => ({
    ...item,
    gap: item.assets - item.liabilities
  }))

  // Hedge Coverage
  const hedgeCoverage = randomInRange(65, 85)
  const hedgePnL = randomInRange(-150, 50)

  return {
    asOfDate,
    nii: {
      mtd: mtdNII,
      qtd: qtdNII,
      ytd: ytdNII,
      runRate
    },
    nim,
    sensitivity: {
      nii: {
        plus100bp: niiPlus100bp,
        minus100bp: niiMinus100bp
      },
      eve: {
        plus100bp: evePlus100bp,
        minus100bp: eveMinus100bp
      }
    },
    depositBeta: {
      overall: overallBeta,
      bySegment: {
        'Retail': retailBeta,
        'Commercial': commercialBeta,
        'Institutional': institutionalBeta
      },
      lag
    },
    duration: {
      assets: assetDuration,
      liabilities: liabilityDuration
    },
    repricingGaps,
    hedgeCoverage: {
      ratio: hedgeCoverage,
      hedgePnL
    }
  }
}

export function generateNIITimeSeries(quarters: number = 12): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []
  let currentValue = randomInRange(2200, 2800)

  for (let i = quarters - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i * 3)

    // Upward trend reflecting rising rates
    currentValue = currentValue * randomInRange(1.02, 1.08)

    data.push({
      date: format(date, 'yyyy-MM'),
      value: currentValue,
      label: format(date, 'QQQ yyyy')
    })
  }

  return data
}

export function generateNIMTimeSeries(quarters: number = 12): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []
  let currentValue = randomInRange(2.5, 2.8)

  for (let i = quarters - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i * 3)

    // Slight upward trend
    currentValue = currentValue * randomInRange(1.0, 1.03)

    data.push({
      date: format(date, 'yyyy-MM'),
      value: currentValue,
      label: format(date, 'QQQ yyyy')
    })
  }

  return data
}

export function generateRepricingGapChart() {
  return [
    { bucket: '0-3M', assets: randomInRange(120, 160), liabilities: randomInRange(200, 250) },
    { bucket: '3-6M', assets: randomInRange(60, 90), liabilities: randomInRange(40, 70) },
    { bucket: '6-12M', assets: randomInRange(80, 110), liabilities: randomInRange(50, 80) },
    { bucket: '1-3Y', assets: randomInRange(100, 140), liabilities: randomInRange(60, 90) },
    { bucket: '3-5Y', assets: randomInRange(70, 100), liabilities: randomInRange(30, 50) },
    { bucket: '>5Y', assets: randomInRange(90, 130), liabilities: randomInRange(40, 70) }
  ].map(item => ({
    ...item,
    gap: item.assets - item.liabilities
  }))
}

export function generateSensitivityTornado() {
  const baseNII = 10000

  return [
    { parameter: 'Parallel Rate +100bp', low: baseNII, high: baseNII + randomInRange(800, 1500) },
    { parameter: 'Parallel Rate -100bp', low: baseNII + randomInRange(-600, -300), high: baseNII },
    { parameter: 'Deposit Beta +10%', low: baseNII + randomInRange(-400, -200), high: baseNII },
    { parameter: 'Loan Repricing Speed +3mo', low: baseNII, high: baseNII + randomInRange(200, 400) },
    { parameter: 'Prepayment Speed +20%', low: baseNII + randomInRange(-300, -150), high: baseNII }
  ]
}

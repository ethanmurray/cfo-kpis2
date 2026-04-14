import { OrderFlowMetrics, TimeSeriesPoint } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { subDays, format } from 'date-fns'

export function generateOrderFlowMetrics(asOfDate: Date = new Date()): OrderFlowMetrics {
  // Deposit Flows (in millions)
  const todayNetFlow = randomInRange(-500, 1500)
  const weekNetFlow = randomInRange(-2000, 5000)
  const mtdNetFlow = randomInRange(-3000, 8000)

  // Gross flows by segment (in millions)
  const retailInflows = randomInRange(800, 1500)
  const commercialInflows = randomInRange(1200, 2000)
  const institutionalInflows = randomInRange(500, 1000)

  const retailOutflows = randomInRange(700, 1400)
  const commercialOutflows = randomInRange(1000, 1800)
  const institutionalOutflows = randomInRange(600, 1200)

  // Loan Pipeline (in millions)
  const submitted = randomInRange(5000, 8000)
  const approved = randomInRange(3000, 5000)
  const committed = randomInRange(2000, 3500)
  const funded = randomInRange(1500, 2500)

  // Commitments (in millions)
  const newUnderwriting = randomInRange(2000, 4000)
  const expectedFees = newUnderwriting * randomInRange(0.003, 0.008)
  const totalCommitted = randomInRange(80000, 100000)
  const outstanding = randomInRange(45000, 60000)
  const undrawn = totalCommitted - outstanding
  const utilization = (outstanding / totalCommitted) * 100

  // Payments Volume (in millions)
  const dailyPayments = randomInRange(25000, 40000)
  const weeklyPayments = dailyPayments * randomInRange(4.8, 5.2)

  // Securities Flow (in millions)
  const purchases = randomInRange(1000, 3000)
  const sales = randomInRange(800, 2500)
  const net = purchases - sales

  return {
    asOfDate,
    depositFlows: {
      netFlow: {
        today: todayNetFlow,
        week: weekNetFlow,
        mtd: mtdNetFlow
      },
      grossInflows: {
        'Retail': retailInflows,
        'Commercial': commercialInflows,
        'Institutional': institutionalInflows
      },
      grossOutflows: {
        'Retail': retailOutflows,
        'Commercial': commercialOutflows,
        'Institutional': institutionalOutflows
      }
    },
    loanPipeline: {
      submitted,
      approved,
      committed,
      funded
    },
    commitments: {
      newUnderwriting,
      expectedFees,
      utilization,
      undrawn
    },
    paymentsVolume: {
      daily: dailyPayments,
      weekly: weeklyPayments
    },
    securitiesFlow: {
      purchases,
      sales,
      net
    }
  }
}

export function generateDepositFlowTimeSeries(days: number = 30): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    // Lower activity on weekends
    const baseMean = isWeekend ? 200 : 500
    const baseStd = isWeekend ? 300 : 800

    const value = baseMean + (Math.random() - 0.5) * baseStd

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value,
      label: format(date, 'MMM dd')
    })
  }

  return data
}

export function generateLoanPipelineFunnel() {
  const submitted = randomInRange(5000, 8000)
  const approved = submitted * randomInRange(0.6, 0.75)
  const committed = approved * randomInRange(0.65, 0.80)
  const funded = committed * randomInRange(0.70, 0.85)

  return [
    { stage: 'Submitted', value: submitted, conversion: 100 },
    { stage: 'Approved', value: approved, conversion: (approved / submitted) * 100 },
    { stage: 'Committed', value: committed, conversion: (committed / submitted) * 100 },
    { stage: 'Funded', value: funded, conversion: (funded / submitted) * 100 }
  ]
}

export function generateCommitmentUtilizationBySector() {
  const sectors = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Energy',
    'Manufacturing',
    'Real Estate',
    'Consumer Goods',
    'Other'
  ]

  return sectors.map(sector => ({
    sector,
    committed: randomInRange(5000, 15000),
    outstanding: randomInRange(3000, 10000),
    utilization: randomInRange(50, 85)
  }))
}

export function generatePaymentsVolumeTimeSeries(days: number = 30): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    // Much lower on weekends
    const value = isWeekend
      ? randomInRange(5000, 10000)
      : randomInRange(25000, 40000)

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value,
      label: format(date, 'MMM dd')
    })
  }

  return data
}

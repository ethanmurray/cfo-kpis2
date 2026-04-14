import { BalanceSheetMetrics, TimeSeriesPoint } from '../types/metrics'
import { randomInRange } from '../utils/dataGenerators'
import { subMonths, format } from 'date-fns'

export function generateBalanceSheetMetrics(asOfDate: Date = new Date()): BalanceSheetMetrics {
  // Total Assets (in billions)
  const totalAssets = randomInRange(550, 650)

  // Loans by Segment (in billions)
  const commercialLoans = randomInRange(120, 160)
  const consumerLoans = randomInRange(80, 110)
  const realEstateLoans = randomInRange(90, 120)
  const otherLoans = randomInRange(20, 35)
  const totalLoans = commercialLoans + consumerLoans + realEstateLoans + otherLoans

  // Fixed vs Floating
  const fixedLoans = totalLoans * randomInRange(0.35, 0.45)
  const floatingLoans = totalLoans - fixedLoans

  // Deposits by Segment (in billions)
  const retailDeposits = randomInRange(200, 250)
  const commercialDeposits = randomInRange(120, 160)
  const institutionalDeposits = randomInRange(80, 110)
  const totalDeposits = retailDeposits + commercialDeposits + institutionalDeposits

  // Insured vs Uninsured
  const insuredDeposits = totalDeposits * randomInRange(0.55, 0.65)
  const uninsuredDeposits = totalDeposits - insuredDeposits

  // Securities (in billions)
  const afsSecurities = randomInRange(80, 120)
  const htmSecurities = randomInRange(40, 70)
  const securitiesDuration = randomInRange(4.5, 6.5)

  // Cash and Reserves
  const cashAndReserves = randomInRange(60, 90)

  // Total Liabilities
  const totalLiabilities = totalAssets - randomInRange(50, 70)  // Equity = Assets - Liabilities

  // Cost Metrics (in basis points)
  const costOfDeposits = randomInRange(1.8, 3.2)
  const costOfFunds = randomInRange(2.2, 3.8)

  // Loan to Deposit Ratio
  const loanToDeposit = (totalLoans / totalDeposits) * 100

  // Funding Mix (in billions)
  const securedFunding = randomInRange(40, 60)
  const unsecuredFunding = randomInRange(30, 50)
  const longTermDebt = randomInRange(50, 80)

  // Quality Proxies (in %)
  const nplRatio = randomInRange(0.3, 0.8)
  const ncoRatio = randomInRange(0.15, 0.35)
  const aclRatio = randomInRange(1.2, 1.8)

  return {
    asOfDate,
    totalAssets,
    totalLiabilities,
    loans: {
      total: totalLoans,
      bySegment: {
        'Commercial & Industrial': commercialLoans,
        'Consumer': consumerLoans,
        'Real Estate': realEstateLoans,
        'Other': otherLoans
      },
      fixedFloating: {
        fixed: fixedLoans,
        floating: floatingLoans
      }
    },
    deposits: {
      total: totalDeposits,
      bySegment: {
        'Retail': retailDeposits,
        'Commercial': commercialDeposits,
        'Institutional': institutionalDeposits
      },
      insuredVsUninsured: {
        insured: insuredDeposits,
        uninsured: uninsuredDeposits
      }
    },
    securities: {
      afs: afsSecurities,
      htm: htmSecurities,
      duration: securitiesDuration
    },
    cashAndReserves,
    costMetrics: {
      costOfDeposits,
      costOfFunds
    },
    ratios: {
      loanToDeposit
    },
    fundingMix: {
      deposits: totalDeposits,
      secured: securedFunding,
      unsecured: unsecuredFunding,
      longTermDebt
    },
    qualityProxies: {
      nplRatio,
      ncoRatio,
      aclRatio
    }
  }
}

export function generateBalanceSheetTimeSeries(
  metric: 'assets' | 'loans' | 'deposits' | 'ldr',
  quarters: number = 12
): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []

  const baseValues = {
    assets: 600,
    loans: 330,
    deposits: 410,
    ldr: 80
  }

  const trends = {
    assets: 0.01,
    loans: 0.012,
    deposits: 0.008,
    ldr: 0.003
  }

  let currentValue = baseValues[metric]

  for (let i = quarters - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i * 3)

    currentValue = currentValue * (1 + trends[metric])
    const volatility = 1 + (Math.random() - 0.5) * 0.015

    currentValue = currentValue * volatility

    data.push({
      date: format(date, 'yyyy-MM'),
      value: currentValue,
      label: format(date, 'QQQ yyyy')
    })
  }

  return data
}

export function generateFundingMixData() {
  const deposits = randomInRange(400, 450)
  const secured = randomInRange(40, 60)
  const unsecured = randomInRange(30, 50)
  const longTermDebt = randomInRange(50, 80)
  const total = deposits + secured + unsecured + longTermDebt

  return [
    { name: 'Deposits', value: deposits, percentage: (deposits / total) * 100 },
    { name: 'Secured Funding', value: secured, percentage: (secured / total) * 100 },
    { name: 'Unsecured Funding', value: unsecured, percentage: (unsecured / total) * 100 },
    { name: 'Long-term Debt', value: longTermDebt, percentage: (longTermDebt / total) * 100 }
  ]
}

export function generateLoanComposition() {
  const commercial = randomInRange(120, 160)
  const consumer = randomInRange(80, 110)
  const realEstate = randomInRange(90, 120)
  const other = randomInRange(20, 35)
  const total = commercial + consumer + realEstate + other

  return [
    { name: 'Commercial & Industrial', value: commercial, percentage: (commercial / total) * 100 },
    { name: 'Consumer', value: consumer, percentage: (consumer / total) * 100 },
    { name: 'Real Estate', value: realEstate, percentage: (realEstate / total) * 100 },
    { name: 'Other', value: other, percentage: (other / total) * 100 }
  ]
}

export function generateDepositComposition() {
  const retail = randomInRange(200, 250)
  const commercial = randomInRange(120, 160)
  const institutional = randomInRange(80, 110)
  const total = retail + commercial + institutional

  return [
    { name: 'Retail', value: retail, percentage: (retail / total) * 100 },
    { name: 'Commercial', value: commercial, percentage: (commercial / total) * 100 },
    { name: 'Institutional', value: institutional, percentage: (institutional / total) * 100 }
  ]
}

import { BusinessFlowMetrics, ClientActivity, AlertFlag, CustodyMetrics, CommitmentDraw, NewUnderwriting, TimeSeriesPoint } from '../types/metrics'
import { randomInRange, generateClientName } from '../utils/dataGenerators'
import { subDays, subHours, format } from 'date-fns'

export function generateBusinessFlowMetrics(asOfDate: Date = new Date()): BusinessFlowMetrics {
  // Top clients with activity
  const topClients = generateTopClients(50)

  // Custody metrics
  const custody: CustodyMetrics = {
    aua: randomInRange(10000, 15000),
    auc: randomInRange(8000, 12000),
    changes: {
      '1D': randomInRange(-200, 300),
      '1W': randomInRange(-500, 800)
    },
    netFlows: randomInRange(-150, 250),
    settlementVolume: randomInRange(25000, 40000),
    failsRate: randomInRange(0.05, 0.25),
    intradayOverdraft: randomInRange(2, 8)
  }

  // Deposit activity
  const depositActivity = {
    grossInflows: randomInRange(2000, 4000),
    grossOutflows: randomInRange(1800, 3500),
    netFlows: 0,
    bySegment: {
      'Retail': randomInRange(500, 1000),
      'Commercial': randomInRange(800, 1500),
      'Institutional': randomInRange(400, 900)
    },
    uninsuredPercent: randomInRange(35, 45),
    costOfDeposits: randomInRange(2.2, 3.5)
  }
  depositActivity.netFlows = depositActivity.grossInflows - depositActivity.grossOutflows

  // Commitment draws
  const committedTotal = randomInRange(80000, 100000)
  const outstandingTotal = randomInRange(45000, 60000)
  const undrawn = committedTotal - outstandingTotal
  const utilization = (outstandingTotal / committedTotal) * 100

  const draws = generateCommitmentDraws(20)

  const commitmentDraws = {
    committed: committedTotal,
    outstanding: outstandingTotal,
    undrawn,
    utilization,
    draws,
    bySector: {
      'Technology': randomInRange(8000, 12000),
      'Healthcare': randomInRange(6000, 10000),
      'Financial Services': randomInRange(10000, 15000),
      'Energy': randomInRange(5000, 8000),
      'Manufacturing': randomInRange(7000, 11000),
      'Real Estate': randomInRange(9000, 13000)
    }
  }

  // New underwritings
  const newUnderwritings = generateNewUnderwritings(10)

  return {
    asOfDate,
    topClients,
    custody,
    depositActivity,
    commitmentDraws,
    newUnderwritings
  }
}

function generateTopClients(count: number): ClientActivity[] {
  const clients: ClientActivity[] = []

  for (let i = 0; i < count; i++) {
    const depositBalance = randomInRange(1000, 10000)
    const deposit1D = randomInRange(-500, 800)
    const deposit7D = randomInRange(-1500, 2000)

    // Detect material moves and anomalies
    const alerts: AlertFlag[] = []
    const zScore1D = Math.abs(deposit1D / 300)  // Simplified z-score
    const changePercent1D = Math.abs(deposit1D / depositBalance) * 100

    if (changePercent1D > 10) {
      alerts.push({
        type: 'material_move',
        severity: changePercent1D > 20 ? 'high' : 'medium',
        message: `${changePercent1D.toFixed(1)}% deposit change in 1 day`,
        timestamp: new Date()
      })
    }

    if (zScore1D > 2.5) {
      alerts.push({
        type: 'zscore_anomaly',
        severity: zScore1D > 3 ? 'high' : 'medium',
        message: `Unusual activity: ${zScore1D.toFixed(1)} standard deviations from mean`,
        timestamp: new Date()
      })
    }

    if (deposit1D < 0 && deposit7D < 0) {
      alerts.push({
        type: 'repeated_outflows',
        severity: 'medium',
        message: 'Consecutive outflows detected (1D and 7D both negative)',
        timestamp: new Date()
      })
    }

    const custodyAUA = randomInRange(500, 5000)
    const custodyChange = randomInRange(-200, 300)
    const utilization = randomInRange(40, 90)

    // Check for utilization breach
    if (utilization > 85) {
      alerts.push({
        type: 'limit_breach',
        severity: utilization > 90 ? 'critical' : 'high',
        message: `Credit line utilization at ${utilization.toFixed(0)}%`,
        timestamp: new Date()
      })
    }

    clients.push({
      clientId: `CLT-${String(i + 1).padStart(5, '0')}`,
      clientName: generateClientName(),
      depositBalance,
      depositChange: {
        '1D': deposit1D,
        '7D': deposit7D
      },
      paymentsVolume: randomInRange(500, 5000),
      paymentsValue: randomInRange(100, 2000),
      custodyAUA,
      custodyChange,
      creditLineUtilization: utilization,
      creditLineChange: randomInRange(-5, 10),
      concentrationMetrics: {
        shareOfDeposits: (depositBalance / 200000) * 100,
        shareOfOutflows: randomInRange(0.5, 3.0)
      },
      alerts
    })
  }

  return clients.sort((a, b) => b.depositBalance - a.depositBalance)
}

function generateCommitmentDraws(count: number): CommitmentDraw[] {
  const draws: CommitmentDraw[] = []

  for (let i = 0; i < count; i++) {
    draws.push({
      clientId: `CLT-${String(Math.floor(Math.random() * 50) + 1).padStart(5, '0')}`,
      facilityId: `FAC-${String(Math.floor(Math.random() * 100) + 1).padStart(4, '0')}`,
      amount: randomInRange(10, 500),
      timestamp: subHours(new Date(), Math.floor(Math.random() * 48)),
      utilization: randomInRange(50, 95)
    })
  }

  return draws.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

function generateNewUnderwritings(count: number): NewUnderwriting[] {
  const stages: ('submitted' | 'approved' | 'committed' | 'funded')[] = ['submitted', 'approved', 'committed', 'funded']
  const underwritings: NewUnderwriting[] = []

  for (let i = 0; i < count; i++) {
    const committedAmount = randomInRange(50, 1000)
    const expectedRWA = committedAmount * randomInRange(0.5, 1.0)
    const expectedRevenue = committedAmount * randomInRange(0.002, 0.008)
    const liquidityImpact = committedAmount * randomInRange(0.6, 0.9) * (Math.random() > 0.5 ? 1 : -1)

    underwritings.push({
      dealId: `DEAL-${String(i + 1).padStart(4, '0')}`,
      stage: stages[Math.floor(Math.random() * stages.length)],
      committedAmount,
      expectedCloseDate: subDays(new Date(), -Math.floor(Math.random() * 90)),
      expectedRWA,
      expectedRevenue,
      liquidityImpact
    })
  }

  return underwritings.sort((a, b) => b.committedAmount - a.committedAmount)
}

export function generateClientActivityTimeSeries(clientId: string, days: number = 7): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []
  let currentBalance = randomInRange(3000, 8000)

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6

    // Less activity on weekends
    const dailyChange = isWeekend
      ? randomInRange(-50, 50)
      : randomInRange(-300, 400)

    currentBalance += dailyChange

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: currentBalance,
      label: format(date, 'EEE')
    })
  }

  return data
}

export function generateDailyPulseData() {
  const categories = [
    'Deposits - Retail',
    'Deposits - Commercial',
    'Deposits - Institutional',
    'Loans - Originations',
    'Commitments - Draws',
    'Custody - AUA',
    'Payments - Volume',
    'Securities - Purchases'
  ]

  return categories.map(category => {
    const today = randomInRange(-1000, 1500)
    const yesterday = randomInRange(-800, 1200)
    const change = today - yesterday
    const changePercent = yesterday !== 0 ? (change / Math.abs(yesterday)) * 100 : 0

    return {
      category,
      today,
      yesterday,
      change,
      changePercent,
      isMaterial: Math.abs(changePercent) > 15
    }
  }).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
}

export function generateExceptionsList() {
  const businessFlow = generateBusinessFlowMetrics()

  const exceptions: any[] = []

  // Add client exceptions
  businessFlow.topClients.forEach(client => {
    if (client.alerts.length > 0) {
      client.alerts.forEach(alert => {
        exceptions.push({
          type: 'Client Activity',
          entity: client.clientName,
          metric: 'Deposits / Credit Utilization',
          severity: alert.severity,
          description: alert.message,
          timestamp: alert.timestamp
        })
      })
    }
  })

  // Add other exceptions
  if (businessFlow.custody.failsRate > 0.20) {
    exceptions.push({
      type: 'Custody',
      entity: 'Settlement Operations',
      metric: 'Fails Rate',
      severity: 'high' as const,
      description: `Fails rate elevated at ${businessFlow.custody.failsRate.toFixed(2)}%`,
      timestamp: new Date()
    })
  }

  if (businessFlow.custody.intradayOverdraft > 7) {
    exceptions.push({
      type: 'Liquidity',
      entity: 'Intraday Facility',
      metric: 'Overdraft Usage',
      severity: 'medium' as const,
      description: `Intraday overdraft usage at $${businessFlow.custody.intradayOverdraft.toFixed(1)}B`,
      timestamp: new Date()
    })
  }

  return exceptions.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder]
  })
}

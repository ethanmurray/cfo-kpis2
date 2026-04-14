import { CheckCircle, Clock, AlertCircle, TrendingUp, DollarSign, Users, Target } from 'lucide-react'

export default function StrategicInitiativesTracker() {
  const initiatives = [
    {
      id: 1,
      name: 'Client Acquisition Program',
      owner: 'Sales Leadership',
      status: 'On Track',
      progress: 78,
      investment: 45,
      expectedReturn: 189,
      actualReturn: 147,
      timeline: 'Q4 2024',
      kpi: '+23 new clients',
      risk: 'Low',
      priority: 'Critical',
      dependencies: ['Technology Platform', 'Sales Training'],
      nextMilestone: 'Pipeline review - 2 weeks',
      lastUpdate: '3 days ago'
    },
    {
      id: 2,
      name: 'Pricing Optimization Initiative',
      owner: 'Product Management',
      status: 'On Track',
      progress: 65,
      investment: 12,
      expectedReturn: 307,
      actualReturn: 185,
      timeline: 'Q2 2025',
      kpi: '+5 bps average fee rate',
      risk: 'Medium',
      priority: 'Critical',
      dependencies: ['Market Analysis', 'Client Communications'],
      nextMilestone: 'Pricing committee approval - 1 week',
      lastUpdate: '1 day ago'
    },
    {
      id: 3,
      name: 'STP Rate Enhancement',
      owner: 'Operations',
      status: 'On Track',
      progress: 68,
      investment: 25,
      expectedReturn: 82,
      actualReturn: 56,
      timeline: 'Q1 2025',
      kpi: 'STP rate from 87.5% to 95%',
      risk: 'Low',
      priority: 'High',
      dependencies: ['Technology Investment', 'Process Redesign'],
      nextMilestone: 'Phase 2 deployment - 3 weeks',
      lastUpdate: '2 days ago'
    },
    {
      id: 4,
      name: 'Cross-Sell Acceleration',
      owner: 'Relationship Management',
      status: 'At Risk',
      progress: 42,
      investment: 18,
      expectedReturn: 588,
      actualReturn: 185,
      timeline: 'Q3 2025',
      kpi: 'Wallet share from 30% to 45%',
      risk: 'High',
      priority: 'Critical',
      dependencies: ['Product Training', 'Incentive Alignment'],
      nextMilestone: 'Training completion - overdue 1 week',
      lastUpdate: '5 days ago'
    },
    {
      id: 5,
      name: 'Capital Optimization Program',
      owner: 'Treasury',
      status: 'On Track',
      progress: 85,
      investment: 8,
      expectedReturn: 198,
      actualReturn: 168,
      timeline: 'Q4 2024',
      kpi: '-10% capital allocation',
      risk: 'Low',
      priority: 'High',
      dependencies: ['Regulatory Approval', 'Risk Modeling'],
      nextMilestone: 'Final regulatory sign-off - 1 week',
      lastUpdate: '1 day ago'
    },
    {
      id: 6,
      name: 'Cost Reduction Initiative',
      owner: 'Finance',
      status: 'On Track',
      progress: 72,
      investment: 15,
      expectedReturn: 285,
      actualReturn: 205,
      timeline: 'Q2 2025',
      kpi: '-$1K cost per client',
      risk: 'Medium',
      priority: 'High',
      dependencies: ['Vendor Renegotiation', 'Automation'],
      nextMilestone: 'Vendor contracts finalized - 2 weeks',
      lastUpdate: '4 days ago'
    },
  ]

  const summary = {
    totalInitiatives: initiatives.length,
    onTrack: initiatives.filter(i => i.status === 'On Track').length,
    atRisk: initiatives.filter(i => i.status === 'At Risk').length,
    totalInvestment: initiatives.reduce((sum, i) => sum + i.investment, 0),
    totalExpectedReturn: initiatives.reduce((sum, i) => sum + i.expectedReturn, 0),
    totalActualReturn: initiatives.reduce((sum, i) => sum + i.actualReturn, 0),
    avgProgress: Math.round(initiatives.reduce((sum, i) => sum + i.progress, 0) / initiatives.length)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'On Track': return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }
      case 'At Risk': return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' }
      case 'Delayed': return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' }
      default: return { bg: '#6b7280', light: 'rgba(107, 114, 128, 0.1)' }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'var(--client-accent)'
      case 'High': return '#3b82f6'
      case 'Medium': return '#6b7280'
      default: return '#9ca3af'
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return '#10b981'
      case 'Medium': return '#f59e0b'
      case 'High': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, rgba(var(--client-accent-rgb), 0.1) 0%, rgba(var(--client-accent-rgb), 0.05) 100%)',
          border: '1px solid rgba(var(--client-accent-rgb), 0.2)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5" style={{ color: 'var(--client-accent)' }} />
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Total Initiatives
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--client-text)' }}>{summary.totalInitiatives}</div>
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
            {summary.onTrack} on track • {summary.atRisk} at risk
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
          border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5" style={{ color: '#3b82f6' }} />
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Total Investment
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--client-text)' }}>${summary.totalInvestment}M</div>
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
            Across {summary.totalInitiatives} programs
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" style={{ color: '#10b981' }} />
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Expected Return
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">${summary.totalExpectedReturn}M</div>
          <div className="text-xs mt-1 text-green-600 font-semibold">
            {(summary.totalExpectedReturn / summary.totalInvestment).toFixed(1)}x ROI
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
          border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5" style={{ color: '#10b981' }} />
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Actual Return (YTD)
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--client-text)' }}>${summary.totalActualReturn}M</div>
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
            {Math.round((summary.totalActualReturn / summary.totalExpectedReturn) * 100)}% of target
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
          border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5" style={{ color: '#3b82f6' }} />
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Avg Progress
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--client-text)' }}>{summary.avgProgress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${summary.avgProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Initiatives List */}
      <div className="rounded-2xl shadow-lg overflow-hidden" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(var(--client-primary-rgb), 0.08)'
      }}>
        <div className="p-6 border-b" style={{ borderColor: 'rgba(var(--client-primary-rgb), 0.08)' }}>
          <h3 className="text-lg font-bold" style={{ color: 'var(--client-text)' }}>Strategic Initiatives Detail</h3>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Real-time tracking of key strategic programs</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.02)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>Initiative</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>Progress</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>Investment</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>Return</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>ROI</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--client-text)' }}>Next Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(var(--client-primary-rgb), 0.05)' }}>
              {initiatives.map((initiative) => {
                const statusColor = getStatusColor(initiative.status)
                const roi = ((initiative.expectedReturn / initiative.investment) * 100).toFixed(0)

                return (
                  <tr key={initiative.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-1 h-12 rounded-full" style={{ backgroundColor: getPriorityColor(initiative.priority) }} />
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--client-text)' }}>{initiative.name}</div>
                          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
                            <span className="font-medium">{initiative.owner}</span>
                            <span className="mx-2">•</span>
                            <span>{initiative.kpi}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                              backgroundColor: `${getRiskColor(initiative.risk)}15`,
                              color: getRiskColor(initiative.risk)
                            }}>
                              {initiative.risk} Risk
                            </span>
                            <span className="text-xs" style={{ color: '#9ca3af' }}>Updated {initiative.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusColor.bg }} />
                        <span className="text-sm font-semibold" style={{ color: statusColor.bg }}>
                          {initiative.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-right">
                        <div className="text-sm font-bold mb-1" style={{ color: 'var(--client-text)' }}>{initiative.progress}%</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 ml-auto">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${initiative.progress}%`,
                              backgroundColor: initiative.progress >= 70 ? '#10b981' : initiative.progress >= 50 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-semibold" style={{ color: '#6b7280' }}>${initiative.investment}M</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-green-600">${initiative.expectedReturn}M</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>
                        (${initiative.actualReturn}M realized)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-lg font-bold" style={{ color: 'var(--client-accent)' }}>{roi}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium" style={{ color: 'var(--client-text)' }}>
                        {initiative.nextMilestone}
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>
                        Due: {initiative.timeline}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items */}
      <div className="rounded-xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6" style={{ color: '#ef4444' }} />
          <h3 className="text-lg font-bold" style={{ color: '#ef4444' }}>Action Required</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white">
            <div className="font-semibold text-sm mb-2" style={{ color: '#ef4444' }}>Cross-Sell Acceleration - At Risk</div>
            <ul className="space-y-1 text-xs" style={{ color: '#6b7280' }}>
              <li>• Training completion overdue by 1 week - expedite immediately</li>
              <li>• Only 42% progress vs 65% target for this stage</li>
              <li>• $588M opportunity at stake - highest return initiative</li>
              <li>• Recommended: Executive steering committee meeting this week</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white">
            <div className="font-semibold text-sm mb-2" style={{ color: '#10b981' }}>Quick Wins Available</div>
            <ul className="space-y-1 text-xs" style={{ color: '#6b7280' }}>
              <li>• Capital Optimization 85% complete - push for Q4 finish</li>
              <li>• Cost Reduction ahead of schedule - $205M realized vs $285M target</li>
              <li>• Client Acquisition on track - consider accelerating investment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

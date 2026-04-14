import { useState, useMemo } from 'react'
import { generateLiquidityMetrics } from '../data/liquidityMetrics'
import { generateCapitalMetrics } from '../data/capitalMetrics'
import { generateBalanceSheetMetrics } from '../data/balanceSheetMetrics'
import { generateBusinessFlowMetrics } from '../data/businessFlowData'
import { generatePeerData } from '../data/peerData'
import { formatCurrency, formatPercent } from '../utils/dataGenerators'
import { TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ExecutiveSummary() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D')

  const liquidity = useMemo(() => generateLiquidityMetrics(), [])
  const capital = useMemo(() => generateCapitalMetrics(), [])
  const balanceSheet = useMemo(() => generateBalanceSheetMetrics(), [])
  const businessFlow = useMemo(() => generateBusinessFlowMetrics(), [])
  const peers = useMemo(() => generatePeerData(), [])

  // Calculate changes based on timeframe
  const getChange = (metric: string) => {
    const changes = {
      lcr: { '1D': -0.8, '1W': 1.2, '1M': -2.1 },
      cet1: { '1D': 0.05, '1W': 0.12, '1M': 0.31 },
      deposits: { '1D': -1.2, '1W': 0.8, '1M': 2.4 },
      nii: { '1D': 0.3, '1W': 1.1, '1M': 4.2 }
    }
    return changes[metric]?.[timeframe] || 0
  }

  // Generate AI insights
  const cet1Target = 9.5 // 4.5% min + 2.5% buffer + 1.0% GSIB + 1.5% internal
  const insights = [
    {
      type: 'positive',
      priority: 'high',
      title: 'Capital Position Strengthening',
      message: `CET1 ratio improved ${formatPercent(getChange('cet1'))} to ${formatPercent(capital.cet1.ratio)}, exceeding internal target by ${formatPercent(capital.cet1.ratio - cet1Target)}. Strong retained earnings and optimized RWA management driving improvement.`,
      action: 'Review capital deployment opportunities',
      link: '/keymetrics?tab=capital'
    },
    {
      type: 'alert',
      priority: 'high',
      title: 'LCR Trending Below Comfort Zone',
      message: `LCR at ${formatPercent(liquidity.lcr.value)} declined ${Math.abs(getChange('lcr'))}% over ${timeframe}. HQLA composition shift toward Level 2 assets reducing buffer. Net cash outflows elevated due to institutional deposit volatility.`,
      action: 'Assess HQLA optimization strategy',
      link: '/keymetrics?tab=liquidity'
    },
    {
      type: 'neutral',
      priority: 'medium',
      title: 'Peer Performance Divergence',
      message: `ROE at ${formatPercent(12.8)} ranks in 42nd percentile vs custody peers. Universal banks showing stronger momentum (+${formatPercent(2.1)} avg) driven by investment banking. Our custody franchise remains resilient with stable fee income.`,
      action: 'Review peer positioning strategy',
      link: '/peer?tab=scoreboard'
    },
    {
      type: 'positive',
      priority: 'medium',
      title: 'Deposit Flows Stabilizing',
      message: `Net deposit flows ${getChange('deposits') > 0 ? 'positive' : 'negative'} ${formatCurrency(Math.abs(balanceSheet.deposits.total * getChange('deposits') / 100), 0)} (${formatPercent(Math.abs(getChange('deposits')))}). Top 20 clients showing improved retention. Non-interest bearing mix at ${formatPercent(45.2)} holding steady.`,
      action: 'Monitor client-level trends',
      link: '/businessflow?tab=clients'
    }
  ]

  // High priority alerts - extract from all clients
  const allAlerts = businessFlow.topClients.flatMap(client =>
    client.alerts.map(alert => ({ ...alert, client: client.clientName }))
  )
  const priorityAlerts = allAlerts
    .filter(a => a.severity === 'high')
    .slice(0, 5)

  // Key metrics summary
  const keyMetrics = [
    {
      category: 'Liquidity',
      metrics: [
        { label: 'LCR', value: formatPercent(liquidity.lcr.value), change: getChange('lcr'), threshold: 'amber' },
        { label: 'NSFR', value: formatPercent(liquidity.nsfr.value), change: 0.3, threshold: 'green' },
        { label: 'Liquidity Buffer', value: formatCurrency(liquidity.liquidityBuffer, 0), change: -2.1, threshold: 'green' }
      ]
    },
    {
      category: 'Capital',
      metrics: [
        { label: 'CET1 Ratio', value: formatPercent(capital.cet1.ratio), change: getChange('cet1'), threshold: 'green' },
        { label: 'Tier 1 Leverage', value: formatPercent(capital.slr.ratio), change: 0.08, threshold: 'green' },
        { label: 'Total RWA', value: formatCurrency(capital.cet1.rwa.total, 0), change: -0.5, threshold: 'green' }
      ]
    },
    {
      category: 'Balance Sheet',
      metrics: [
        { label: 'Total Assets', value: formatCurrency(balanceSheet.totalAssets, 0), change: 0.4, threshold: 'green' },
        { label: 'Total Deposits', value: formatCurrency(balanceSheet.deposits.total, 0), change: getChange('deposits'), threshold: 'amber' },
        { label: 'Total Loans', value: formatCurrency(balanceSheet.loans.total, 0), change: 1.2, threshold: 'green' }
      ]
    },
    {
      category: 'Performance',
      metrics: [
        { label: 'ROE', value: formatPercent(12.8), change: 0.2, threshold: 'amber' },
        { label: 'ROA', value: formatPercent(0.92), change: 0.01, threshold: 'green' },
        { label: 'Efficiency Ratio', value: formatPercent(68.5), change: -0.3, threshold: 'green' }
      ]
    }
  ]

  const getThresholdColor = (threshold: string) => {
    switch (threshold) {
      case 'green': return 'border-green-500 bg-green-50'
      case 'amber': return 'border-amber-500 bg-amber-50'
      case 'red': return 'border-red-500 bg-red-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'alert': return <AlertTriangle className="w-5 h-5 text-amber-600" />
      default: return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200'
      case 'alert': return 'bg-amber-50 border-amber-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Summary</h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          {(['1D', '1W', '1M'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights & Recommendations</h2>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getInsightBg(insight.type)}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      insight.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {insight.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                  <Link
                    to={insight.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {insight.action} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Alerts Dashboard */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Priority Alerts ({priorityAlerts.length})</h2>
          <Link
            to="/businessflow?tab=alerts"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>
        </div>
        {priorityAlerts.length > 0 ? (
          <div className="space-y-2">
            {priorityAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">{alert.client}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                  {alert.type.toUpperCase().replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No high priority alerts</p>
          </div>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {keyMetrics.map((category, index) => (
          <div key={index} className="metric-card">
            <h3 className="text-base font-semibold text-gray-900 mb-4">{category.category}</h3>
            <div className="space-y-3">
              {category.metrics.map((metric, mIndex) => (
                <div key={mIndex} className={`p-3 rounded-lg border-l-4 ${getThresholdColor(metric.threshold)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {Math.abs(metric.change).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/keymetrics?tab=snapshot" className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors">
            <div className="text-2xl font-bold text-blue-900">📊</div>
            <div className="font-semibold text-gray-900 mt-2">Key Metrics</div>
            <div className="text-sm text-gray-600">Executive snapshot</div>
          </Link>
          <Link to="/peer?tab=scoreboard" className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors">
            <div className="text-2xl font-bold text-purple-900">🏆</div>
            <div className="font-semibold text-gray-900 mt-2">Peer Analysis</div>
            <div className="text-sm text-gray-600">Rankings & trends</div>
          </Link>
          <Link to="/businessflow?tab=pulse" className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors">
            <div className="text-2xl font-bold text-green-900">📈</div>
            <div className="font-semibold text-gray-900 mt-2">Business Flow</div>
            <div className="text-sm text-gray-600">Client activity</div>
          </Link>
          <Link to="/forward?tab=forecasts" className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg hover:from-amber-100 hover:to-amber-200 transition-colors">
            <div className="text-2xl font-bold text-amber-900">🔮</div>
            <div className="font-semibold text-gray-900 mt-2">Forecasts</div>
            <div className="text-sm text-gray-600">Scenarios & drivers</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

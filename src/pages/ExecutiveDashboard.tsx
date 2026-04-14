import CompactMetricCard from '../components/CompactMetricCard'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, DollarSign, Users, Package, Zap, Shield, Award, Clock, Activity, ArrowRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function ExecutiveDashboard() {
  // Generate trend data
  const generateTrend = (base: number, variance: number, points: number = 12) => {
    return Array.from({ length: points }, (_, i) => base + (Math.random() - 0.5) * variance + (i * variance / points))
  }

  const alerts = [
    { type: 'critical', message: '8 at-risk clients ($215M revenue)', action: 'Review relationship plans' },
    { type: 'warning', message: 'NII compression 15bps below forecast', action: 'Adjust rate mix' },
    { type: 'info', message: 'Q1 expense run-rate 3% below budget', action: 'Continue monitoring' },
  ]

  const recentActivity = [
    { client: 'Global Pension Fund A', event: 'New custody mandate', value: '$42B AUM', time: '2h ago', status: 'positive' },
    { client: 'Insurance Co B', event: 'Fee negotiation', value: '-15 bps', time: '5h ago', status: 'negative' },
    { client: 'Endowment C', event: 'Cross-sell: Securities Lending', value: '+$2.8M revenue', time: '1d ago', status: 'positive' },
    { client: 'Corporate Plan D', event: 'Churn risk escalated', value: '$28M at risk', time: '1d ago', status: 'warning' },
  ]

  // 2025 Target Trajectory Data
  const rarocTrajectory = [
    { month: 'Jan 24', actual: 9.0, forecast: 9.0, target: 9.3 },
    { month: 'Apr 24', actual: 9.3, forecast: 9.3, target: 9.9 },
    { month: 'Jul 24', actual: 9.5, forecast: 9.5, target: 10.5 },
    { month: 'Oct 24', actual: 9.6, forecast: 9.6, target: 11.1 },
    { month: 'Jan 25', actual: 9.8, forecast: 9.8, target: 11.7 },
    { month: 'Apr 25', actual: null, forecast: 10.2, target: 12.1 },
    { month: 'Jul 25', actual: null, forecast: 10.8, target: 12.3 },
    { month: 'Oct 25', actual: null, forecast: 11.5, target: 12.4 },
    { month: 'Dec 25', actual: null, forecast: 12.2, target: 12.5 },
  ]

  const costIncomeTrajectory = [
    { month: 'Jan 24', actual: 64.2, forecast: 64.2, target: 63.5 },
    { month: 'Apr 24', actual: 63.8, forecast: 63.8, target: 62.5 },
    { month: 'Jul 24', actual: 63.1, forecast: 63.1, target: 61.5 },
    { month: 'Oct 24', actual: 62.8, forecast: 62.8, target: 60.5 },
    { month: 'Jan 25', actual: 62.5, forecast: 62.5, target: 59.5 },
    { month: 'Apr 25', actual: null, forecast: 61.8, target: 59.2 },
    { month: 'Jul 25', actual: null, forecast: 60.5, target: 58.9 },
    { month: 'Oct 25', actual: null, forecast: 59.2, target: 58.7 },
    { month: 'Dec 25', actual: null, forecast: 58.5, target: 58.5 },
  ]

  const keyTargetMetrics = [
    {
      metric: 'RAROC',
      current: 9.8,
      target2025: 12.5,
      forecastEOY: 12.2,
      gap: -0.3,
      status: 'warning',
      requiresAction: 'Need +$85M revenue or -$120M costs',
      initiatives: ['Cross-sell program ($588M)', 'Pricing optimization ($45M)', 'Efficiency gains ($638M)'],
      probability: 82
    },
    {
      metric: 'Cost/Income Ratio',
      current: 62.5,
      target2025: 58.5,
      forecastEOY: 58.5,
      gap: 0,
      status: 'good',
      requiresAction: 'On track - maintain automation pace',
      initiatives: ['RPA deployment (Q2)', 'Vendor consolidation ($485M)', 'Offshore expansion (15%)'],
      probability: 92
    },
    {
      metric: 'Client Count',
      current: 285,
      target2025: 308,
      forecastEOY: 306,
      gap: -2,
      status: 'warning',
      requiresAction: 'Need 2 more wins in pipeline',
      initiatives: ['New business pipeline (23 prospects)', 'Client retention program', 'M&A targets (3)'],
      probability: 88
    },
    {
      metric: 'AUM ($T)',
      current: 6.1,
      target2025: 6.5,
      forecastEOY: 6.48,
      gap: -0.02,
      status: 'good',
      requiresAction: 'On track - monitor market conditions',
      initiatives: ['Organic growth', 'Market recovery', 'Net new mandates ($143B YTD)'],
      probability: 95
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--client-text)' }}>Executive Dashboard</h1>
          <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Real-time view of critical metrics and alerts</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--client-accent)' }}>
            Live Data
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: 'var(--client-text)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs" style={{ color: '#9ca3af' }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Consolidated Executive Summaries */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(0, 77, 53, 0.05) 0%, rgba(0, 77, 53, 0.02) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.15)'
      }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
            <TrendingUp className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--client-text)' }}>Enterprise Overview</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Financials */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>Financials</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Revenue $5.4B (+8.2% YoY)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Economic profit $1.85B (+12.3%)</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Efficiency 60.1% vs 58.5% target</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Deploy $3.2B excess capital</span>
              </div>
            </div>
          </div>

          {/* Client Economics */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>Client Economics</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>285 clients, 97.8% retention</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Top 20: $3.8B (70% revenue)</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Wallet share 30% vs 45% target</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>$588M cross-sell opportunity</span>
              </div>
            </div>
          </div>

          {/* Product Economics */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>Product Economics</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Custody $2.85B, 11.2% RAROC</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Top 3 products: 73% of revenue</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>$45M repricing opportunity</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>$638M cost savings target</span>
              </div>
            </div>
          </div>

          {/* Operations */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>Operations</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>STP 87.5%, fail rate 0.08%</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Month-end close D+3 on track</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>23 recon items aging &gt; 5 days</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Deploy RPA for matching (Q2)</span>
              </div>
            </div>
          </div>

          {/* Planning & Strategy */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>Planning & Strategy</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>5 of 6 initiatives on track</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>$946M realized vs $1.65B target</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Cross-sell 42% vs 65% target</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>RAROC 9.8% → 12.5% by 2025</span>
              </div>
            </div>
          </div>

          {/* External Positioning */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>External Positioning</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>#3 market position (18.8%)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Win rate 69%, NPS #2 ranked</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Innovation gap vs peers</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Digital transformation focus</span>
              </div>
            </div>
          </div>

          {/* Risk & Compliance */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5" style={{ color: 'var(--client-text)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-text)' }}>Risk & Compliance</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>All metrics within appetite</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Zero compliance breaches</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>Op risk 84% of limit</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#6b7280' }}>CCAR due Mar 31 (on track)</span>
              </div>
            </div>
          </div>

          {/* Strategic Priorities */}
          <div className="p-4 rounded-xl bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5" style={{ color: 'var(--client-accent)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--client-accent)' }}>Top Priorities</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--client-accent)' }}>1.</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>Execute capital deployment strategy</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--client-accent)' }}>2.</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>Accelerate cross-sell program</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--client-accent)' }}>3.</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>Improve efficiency ratio to 58.5%</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--client-accent)' }}>4.</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>Automation & digital initiatives</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2025 Target Trajectory & Interventions */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.25)'
      }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)' }}>
            <Activity className="h-6 w-6" style={{ color: 'var(--client-accent)' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--client-text)' }}>2025 Target Trajectory & Required Interventions</h2>
            <p className="text-xs" style={{ color: '#6b7280' }}>Forecast vs. plan analysis with strategic initiative impact</p>
          </div>
        </div>

        {/* Key Metrics Trajectory Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {keyTargetMetrics.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border" style={{
              borderColor: item.status === 'good' ? '#10b981' : item.status === 'warning' ? '#f59e0b' : '#ef4444',
              borderWidth: '2px'
            }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: 'var(--client-text)' }}>{item.metric}</span>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'good' ? 'bg-green-100 text-green-700' :
                  item.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.probability}% confidence
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs" style={{ color: '#6b7280' }}>Current:</span>
                  <span className="text-lg font-bold" style={{ color: '#1f2937' }}>
                    {typeof item.current === 'number' && item.current < 100 ? item.current.toFixed(1) : item.current}
                    {item.metric.includes('Ratio') ? '%' : item.metric.includes('$T') ? 'T' : ''}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs" style={{ color: '#6b7280' }}>Forecast EOY:</span>
                  <span className="text-base font-bold" style={{ color: item.status === 'good' ? '#10b981' : '#f59e0b' }}>
                    {typeof item.forecastEOY === 'number' && item.forecastEOY < 100 ? item.forecastEOY.toFixed(1) : item.forecastEOY}
                    {item.metric.includes('Ratio') ? '%' : item.metric.includes('$T') ? 'T' : ''}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs" style={{ color: '#6b7280' }}>Target:</span>
                  <span className="text-base font-bold" style={{ color: 'var(--client-accent)' }}>
                    {typeof item.target2025 === 'number' && item.target2025 < 100 ? item.target2025.toFixed(1) : item.target2025}
                    {item.metric.includes('Ratio') ? '%' : item.metric.includes('$T') ? 'T' : ''}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#6b7280' }}>
                  Required Action
                </div>
                <div className="text-xs font-medium mb-2" style={{ color: '#1f2937' }}>
                  {item.requiresAction}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: '#6b7280' }}>
                  Key Initiatives
                </div>
                <ul className="space-y-0.5">
                  {item.initiatives.map((initiative, i) => (
                    <li key={i} className="text-xs flex items-start gap-1" style={{ color: '#6b7280' }}>
                      <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--client-accent)' }} />
                      <span>{initiative}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Trajectory Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* RAROC Trajectory */}
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--client-text)' }}>RAROC Trajectory to 12.5% Target</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rarocTrajectory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[8, 13]}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'RAROC (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <ReferenceLine y={12.5} stroke="#D4AF37" strokeDasharray="5 5" label={{ value: 'Target', fontSize: 10, fill: '#D4AF37' }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#1f2937"
                  strokeWidth={3}
                  name="Actual"
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Current Trajectory"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Required Path"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <div className="text-xs font-semibold text-amber-800 mb-1">Gap Analysis</div>
              <div className="text-xs text-amber-700">
                Current trajectory: 12.2% by EOY (0.3pp short) • Need +2.8% revenue growth or +4.5% cost reduction by Q3 to hit target
              </div>
            </div>
          </div>

          {/* Cost/Income Trajectory */}
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--client-text)' }}>Cost/Income Ratio to 58.5% Target</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={costIncomeTrajectory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[57, 65]}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'C/I Ratio (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <ReferenceLine y={58.5} stroke="#D4AF37" strokeDasharray="5 5" label={{ value: 'Target', fontSize: 10, fill: '#D4AF37' }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#1f2937"
                  strokeWidth={3}
                  name="Actual"
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Current Trajectory"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Required Path"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <div className="text-xs font-semibold text-green-800 mb-1">On Track</div>
              <div className="text-xs text-green-700">
                Current trajectory: 58.5% by EOY (on target) • Automation and efficiency initiatives delivering as planned
              </div>
            </div>
          </div>
        </div>

        {/* Decision Triggers */}
        <div className="mt-6 p-4 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-bold text-red-900">Critical Decision Triggers - Q2 2025</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-white">
              <div className="font-semibold text-red-900 mb-1">If RAROC &lt; 10.5% by Apr 30:</div>
              <div className="text-red-800">• Accelerate M&A evaluation • Consider capital deployment alternatives • Repricing review for bottom quartile clients</div>
            </div>
            <div className="p-3 rounded-lg bg-white">
              <div className="font-semibold text-red-900 mb-1">If Client wins &lt; 5 in Q2:</div>
              <div className="text-red-800">• Executive engagement on top 10 prospects • Competitive pricing review • Consider strategic partnerships</div>
            </div>
            <div className="p-3 rounded-lg bg-white">
              <div className="font-semibold text-red-900 mb-1">If Cost/Income &gt; 60% by Jun 30:</div>
              <div className="text-red-800">• Accelerate RPA deployment • Vendor renegotiation sprint • Re-evaluate discretionary spend</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <AlertTriangle className="h-5 w-5" style={{ color: '#ef4444' }} />
          </div>
          <h2 className="text-lg font-bold tracking-tight" style={{ color: '#ef4444' }}>Critical Alerts & Actions</h2>
        </div>
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  alert.type === 'critical' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="font-medium" style={{ color: '#1f2937' }}>{alert.message}</span>
              </div>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{
                color: 'var(--client-accent)',
                backgroundColor: 'rgba(212, 175, 55, 0.1)'
              }}>{alert.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Financial Metrics - 6 columns */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
          Financial Performance (YTD)
        </h2>
        <div className="grid grid-cols-6 gap-3">
          <CompactMetricCard
            label="Total Revenue"
            value="$5,390"
            unit="M"
            change={8.2}
            trend={generateTrend(5000, 200)}
            status="good"
            target="$5,500"
          />
          <CompactMetricCard
            label="Economic Profit"
            value="$1,854"
            unit="M"
            change={12.3}
            trend={generateTrend(1700, 100)}
            status="good"
            target="$2,100"
          />
          <CompactMetricCard
            label="RAROC"
            value="9.8"
            unit="%"
            change={1.6}
            trend={generateTrend(9.5, 0.5)}
            status="warning"
            target="12.5"
          />
          <CompactMetricCard
            label="NII"
            value="$892"
            unit="M"
            change={-2.3}
            trend={generateTrend(900, 30)}
            status="warning"
            target="$950"
          />
          <CompactMetricCard
            label="NIM"
            value="1.42"
            unit="%"
            change={-0.15}
            trend={generateTrend(1.45, 0.05)}
            status="bad"
            target="1.55"
          />
          <CompactMetricCard
            label="Cost/Income"
            value="62.5"
            unit="%"
            change={-3.2}
            trend={generateTrend(65, 2)}
            status="good"
            target="58.5"
          />
        </div>
      </div>

      {/* Balance Sheet & Capital - 6 columns */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
          Balance Sheet & Capital
        </h2>
        <div className="grid grid-cols-6 gap-3">
          <CompactMetricCard
            label="Total Assets"
            value="$142.8"
            unit="B"
            change={3.5}
            trend={generateTrend(140, 2)}
            status="neutral"
          />
          <CompactMetricCard
            label="Total AUM"
            value="$6.1"
            unit="T"
            change={6.8}
            trend={generateTrend(5.8, 0.2)}
            status="good"
          />
          <CompactMetricCard
            label="CET1 Ratio"
            value="11.2"
            unit="%"
            change={0.3}
            trend={generateTrend(11, 0.2)}
            status="good"
            target="10.5"
          />
          <CompactMetricCard
            label="LCR"
            value="142"
            unit="%"
            change={2.1}
            trend={generateTrend(138, 3)}
            status="good"
            target="110"
          />
          <CompactMetricCard
            label="NSFR"
            value="118"
            unit="%"
            change={1.2}
            trend={generateTrend(116, 2)}
            status="good"
            target="100"
          />
          <CompactMetricCard
            label="Leverage Ratio"
            value="6.8"
            unit="%"
            change={0.2}
            trend={generateTrend(6.7, 0.1)}
            status="good"
            target="5.0"
          />
        </div>
      </div>

      {/* Client & Business Metrics - 6 columns */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
          Client & Business Metrics
        </h2>
        <div className="grid grid-cols-6 gap-3">
          <CompactMetricCard
            label="Total Clients"
            value="285"
            change={5.2}
            trend={generateTrend(270, 5)}
            status="good"
            target="308"
          />
          <CompactMetricCard
            label="Rev/Client"
            value="$18.9"
            unit="M"
            change={2.8}
            trend={generateTrend(18, 0.5)}
            status="neutral"
          />
          <CompactMetricCard
            label="Avg Fee Rate"
            value="8.8"
            unit="bps"
            change={-0.7}
            trend={generateTrend(9, 0.3)}
            status="warning"
          />
          <CompactMetricCard
            label="Client RAROC"
            value="9.8"
            unit="%"
            change={1.2}
            trend={generateTrend(9.5, 0.3)}
            status="neutral"
          />
          <CompactMetricCard
            label="Wallet Share"
            value="30"
            unit="%"
            change={2.5}
            trend={generateTrend(29, 1)}
            status="warning"
            target="45"
          />
          <CompactMetricCard
            label="Churn Rate"
            value="3.2"
            unit="%"
            change={0.5}
            trend={generateTrend(3, 0.2)}
            status="warning"
            target="2.0"
          />
        </div>
      </div>

      {/* Operations & Efficiency - 6 columns */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
          Operations & Efficiency
        </h2>
        <div className="grid grid-cols-6 gap-3">
          <CompactMetricCard
            label="STP Rate"
            value="87.5"
            unit="%"
            change={2.3}
            trend={generateTrend(85, 2)}
            status="good"
            target="95.0"
          />
          <CompactMetricCard
            label="Cost/Txn"
            value="$1.60"
            change={-13.5}
            trend={generateTrend(1.85, 0.1)}
            status="good"
            target="$1.45"
          />
          <CompactMetricCard
            label="Cost/Client"
            value="$25.5"
            unit="K"
            change={-10.5}
            trend={generateTrend(28, 1)}
            status="good"
            target="$23.4"
          />
          <CompactMetricCard
            label="Rev/FTE"
            value="$485"
            unit="K"
            change={6.2}
            trend={generateTrend(460, 10)}
            status="good"
          />
          <CompactMetricCard
            label="Automation Rate"
            value="22"
            unit="%"
            change={3.8}
            trend={generateTrend(20, 1)}
            status="warning"
            target="32"
          />
          <CompactMetricCard
            label="NPS Score"
            value="68"
            change={4.2}
            trend={generateTrend(65, 2)}
            status="good"
            target="75"
          />
        </div>
      </div>

      {/* Recent Client Activity */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm tracking-wide uppercase" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
            Recent Client Activity (Last 24h)
          </h2>
          <button className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:shadow-md" style={{
            color: 'var(--client-accent)',
            backgroundColor: 'rgba(212, 175, 55, 0.1)'
          }}>View All →</button>
        </div>
        <div className="space-y-2">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:shadow-md" style={{
              backgroundColor: 'rgba(248, 249, 250, 0.5)',
              border: '1px solid rgba(0, 77, 53, 0.05)',
              borderLeft: `3px solid ${
                activity.status === 'positive' ? '#10b981' :
                activity.status === 'negative' ? '#ef4444' : '#f59e0b'
              }`
            }}>
              <div className="flex items-center gap-3 flex-1">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  activity.status === 'positive' ? 'bg-green-500' :
                  activity.status === 'negative' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                <span className="font-semibold w-36" style={{ color: 'var(--client-text)' }}>{activity.client}</span>
                <span className="text-xs" style={{ color: '#6b7280' }}>{activity.event}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold text-sm ${
                  activity.status === 'positive' ? 'text-green-600' :
                  activity.status === 'negative' ? 'text-red-600' : 'text-amber-600'
                }`}>{activity.value}</span>
                <span className="text-xs w-16 text-right" style={{ color: '#9ca3af' }}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Targets Progress */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
          2025 Strategic Targets Progress
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: '#6b7280' }}>RAROC Target: 12.5%</span>
              <span className="font-bold" style={{ color: 'var(--client-text)' }}>9.8% (78%)</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
              <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: '78%', backgroundColor: 'var(--client-accent)' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: '#6b7280' }}>Client Growth: 308</span>
              <span className="font-bold" style={{ color: 'var(--client-text)' }}>285 (93%)</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '93%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: '#6b7280' }}>Cost/Income: 58.5%</span>
              <span className="font-bold" style={{ color: 'var(--client-text)' }}>62.5% (88%)</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <div className="bg-amber-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '88%' }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: '#6b7280' }}>AUM: $6.5T</span>
              <span className="font-bold" style={{ color: 'var(--client-text)' }}>$6.1T (94%)</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
              <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: '94%', backgroundColor: 'var(--client-accent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Peer Comparison Snapshot */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="font-bold text-sm tracking-wide uppercase mb-4" style={{ color: 'var(--client-text)', letterSpacing: '0.05em' }}>
          Peer Comparison (Percentile Ranking)
        </h2>
        <div className="grid grid-cols-8 gap-3 text-xs">
          {[
            { label: 'RAROC', value: '72nd', color: '#10b981' },
            { label: 'ROE', value: '68th', color: '#3b82f6' },
            { label: 'CIR', value: '76th', color: '#10b981' },
            { label: 'NIM', value: '45th', color: '#f59e0b' },
            { label: 'CET1', value: '81st', color: '#10b981' },
            { label: 'LCR', value: '88th', color: '#3b82f6' },
            { label: 'Fee Rate', value: '52nd', color: '#f59e0b' },
            { label: 'Efficiency', value: '79th', color: '#10b981' }
          ].map((item, idx) => (
            <div key={idx} className="text-center p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md" style={{
              backgroundColor: `${item.color}10`,
              border: `1px solid ${item.color}20`
            }}>
              <div className="font-medium mb-1" style={{ color: '#6b7280' }}>{item.label}</div>
              <div className="text-2xl font-bold tracking-tight" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

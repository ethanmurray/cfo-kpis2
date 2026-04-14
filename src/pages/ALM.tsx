import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import CompactMetricCard from '../components/CompactMetricCard'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Activity, Shield, TrendingDown, AlertTriangle, Target } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart, Cell, ReferenceLine } from 'recharts'

export default function ALM() {
  // Repricing Gap Analysis
  const repricingGap = [
    { bucket: '0-3M', assets: 45200, liabilities: 32800, gap: 12400, cumGap: 12400, gapRatio: 37.8 },
    { bucket: '3-6M', assets: 18500, liabilities: 22100, gap: -3600, cumGap: 8800, gapRatio: -16.3 },
    { bucket: '6-12M', assets: 22300, liabilities: 28400, gap: -6100, cumGap: 2700, gapRatio: -21.5 },
    { bucket: '1-2Y', assets: 15800, liabilities: 18200, gap: -2400, cumGap: 300, gapRatio: -13.2 },
    { bucket: '2-5Y', assets: 28900, liabilities: 24500, gap: 4400, cumGap: 4700, gapRatio: 17.9 },
    { bucket: '5Y+', assets: 12100, liabilities: 3800, gap: 8300, cumGap: 13000, gapRatio: 68.6 },
  ]

  // NII Sensitivity Analysis
  const niiSensitivity = [
    { scenario: 'Base Case', m1: 0, m3: 0, m6: 0, m9: 0, m12: 0 },
    { scenario: '+100bp Parallel', m1: 18, m3: 52, m6: 95, m9: 142, m12: 187 },
    { scenario: '+200bp Parallel', m1: 35, m3: 102, m6: 185, m9: 275, m12: 365 },
    { scenario: '-100bp Parallel', m1: -22, m3: -68, m6: -125, m9: -185, m12: -248 },
    { scenario: '+100bp Steepener', m1: 12, m3: 38, m6: 72, m9: 108, m12: 145 },
    { scenario: '+100bp Flattener', m1: 25, m3: 68, m6: 118, m9: 172, m12: 225 },
  ]

  // Economic Value of Equity Sensitivity
  const eveSensitivity = [
    { scenario: '+200bp Parallel', eveImpact: -425, eveChange: -3.3, withinLimit: true },
    { scenario: '+100bp Parallel', eveImpact: -198, eveChange: -1.5, withinLimit: true },
    { scenario: 'Base Case', eveImpact: 0, eveChange: 0, withinLimit: true },
    { scenario: '-100bp Parallel', eveImpact: 285, eveChange: 2.2, withinLimit: true },
    { scenario: '+100bp Steepener', eveImpact: -152, eveChange: -1.2, withinLimit: true },
    { scenario: '+100bp Flattener', eveImpact: -242, eveChange: -1.9, withinLimit: true },
  ]

  // Maturity Ladder
  const maturityLadder = [
    { bucket: '0-1M', assets: 28500, liabilities: 15200, gap: 13300, liquidity: 28500 },
    { bucket: '1-3M', assets: 16700, liabilities: 17600, gap: -900, liquidity: 44300 },
    { bucket: '3-6M', assets: 18500, liabilities: 22100, gap: -3600, liquidity: 59200 },
    { bucket: '6-12M', assets: 22300, liabilities: 28400, gap: -6100, liquidity: 75400 },
    { bucket: '1-2Y', assets: 15800, liabilities: 18200, gap: -2400, liquidity: 89800 },
    { bucket: '2-5Y', assets: 28900, liabilities: 24500, gap: 4400, liquidity: 115300 },
    { bucket: '5Y+', assets: 12100, liabilities: 3800, gap: 8300, liquidity: 127400 },
  ]

  // Liquidity Stress Test Scenarios
  const stressScenarios = [
    {
      scenario: 'Name Crisis',
      horizon: 45,
      outflowRate: 15,
      totalOutflow: 14775,
      hqlaBuffer: 45500,
      survivalDays: 138,
      status: 'pass'
    },
    {
      scenario: 'Systemic Crisis',
      horizon: 30,
      outflowRate: 22,
      totalOutflow: 21670,
      hqlaBuffer: 45500,
      survivalDays: 63,
      status: 'pass'
    },
    {
      scenario: 'Combined Crisis',
      horizon: 30,
      outflowRate: 28,
      totalOutflow: 27580,
      hqlaBuffer: 45500,
      survivalDays: 49,
      status: 'pass'
    },
  ]

  // Funding Mix
  const fundingMix = [
    { category: 'Retail Deposits', balance: 58200, rate: 1.85, stability: 95, runoffRate: 5 },
    { category: 'Operational Deposits', balance: 28500, rate: 0.45, stability: 98, runoffRate: 2 },
    { category: 'Wholesale Deposits', balance: 11800, rate: 4.25, stability: 75, runoffRate: 25 },
    { category: 'Short-term Borrowings', balance: 12400, rate: 4.85, stability: 50, runoffRate: 50 },
    { category: 'Long-term Debt', balance: 10000, rate: 3.95, stability: 100, runoffRate: 0 },
  ]

  // Duration Gap
  const durationData = {
    assetDuration: 3.8,
    liabilityDuration: 2.1,
    durationGap: 1.7,
    totalAssets: 142800,
    totalLiabilities: 129800,
    equity: 13000,
    eveAt100bp: -198,
  }

  // Rate Shock Waterfall (12-month NII impact)
  const rateShockWaterfall = [
    { category: 'Base NII', value: 892, cumulative: 892 },
    { category: 'Asset Repricing', value: 142, cumulative: 1034 },
    { category: 'Liability Repricing', value: -58, cumulative: 976 },
    { category: 'New Business', value: 35, cumulative: 1011 },
    { category: 'Basis Risk', value: -12, cumulative: 999 },
    { category: 'Deposit Beta', value: 28, cumulative: 1027 },
    { category: 'Hedge Impact', value: 15, cumulative: 1042 },
  ]

  // Deposit Beta Analysis
  const depositBeta = [
    { cycle: 'Current (2023-24)', fedFundsChange: 100, depositRateChange: 48, beta: 48 },
    { cycle: '2015-19 Tightening', fedFundsChange: 225, depositRateChange: 115, beta: 51 },
    { cycle: '2004-06 Tightening', fedFundsChange: 425, depositRateChange: 285, beta: 67 },
    { cycle: 'Average', fedFundsChange: 100, depositRateChange: 55, beta: 55 },
  ]

  // Hedge Portfolio
  const hedgePortfolio = [
    { instrument: 'Interest Rate Swaps', notional: 15000, pv01: -42, dv01: -38, effectivity: 94 },
    { instrument: 'Treasury Futures', notional: 8500, pv01: -18, dv01: -17, effectivity: 96 },
    { instrument: 'Interest Rate Options', notional: 5000, pv01: -8, dv01: -7, effectivity: 89 },
    { instrument: 'Total Hedge Program', notional: 28500, pv01: -68, dv01: -62, effectivity: 93 },
  ]

  // Liquidity Buffer Over Time
  const liquidityTrend = [
    { month: 'Jul', hqla: 42800, minRequired: 32100, buffer: 10700, lcr: 133 },
    { month: 'Aug', hqla: 43500, minRequired: 32300, buffer: 11200, lcr: 135 },
    { month: 'Sep', hqla: 44100, minRequired: 32450, buffer: 11650, lcr: 136 },
    { month: 'Oct', hqla: 44800, minRequired: 32600, buffer: 12200, lcr: 137 },
    { month: 'Nov', hqla: 45200, minRequired: 32750, buffer: 12450, lcr: 138 },
    { month: 'Dec', hqla: 45500, minRequired: 32850, buffer: 12650, lcr: 139 },
    { month: 'Jan', hqla: 45500, minRequired: 32100, buffer: 13400, lcr: 142 },
  ]

  const getStatusColor = (status: string) => {
    return status === 'pass' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Asset-Liability Management</h1>
          <p className="text-xs mt-1 text-gray-600">
            Interest rate risk, liquidity management, balance sheet positioning, and stress testing
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <Shield className="h-5 w-5" style={{ color: '#10b981' }} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Duration Gap</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold" style={{ color: '#10b981' }}>1.7 years</div>
              <div className="text-[10px] font-semibold text-green-600">-0.2y</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="executive-summary">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="p-1.5 rounded-lg bg-nt-gold bg-opacity-20">
            <TrendingUp className="h-5 w-5 text-nt-gold" />
          </div>
          <h2 className="text-base font-bold text-nt-forest">Executive Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-xs text-nt-forest">Interest Rate Position</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Asset-sensitive position: $12.4B gap in 0-3M bucket</li>
              <li>• NII uplift +$187M in +100bp scenario (12-month)</li>
              <li>• EVE at risk: -$198M (-1.5%) in +100bp shock (within limit)</li>
              <li>• Hedge program: $28.5B notional, 93% effective</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Risk Exposures</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Negative gap in 6-12M bucket (-$6.1B, -21.5%)</li>
              <li>• Wholesale funding concentration: 19% of deposits</li>
              <li>• Deposit beta assumption: 48% (below historical 55%)</li>
              <li>• Rate down scenario: -$248M NII impact (-28%)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Liquidity Position</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• LCR 142% (42pp above minimum)</li>
              <li>• HQLA buffer: $45.5B, covers 49 days in combined stress</li>
              <li>• Stable funding: 87% retail/operational deposits</li>
              <li>• All stress tests pass with significant buffer</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <CompactMetricCard label="Duration Gap" value="1.7" unit="Y" change={-11.8} status="good" target="2.0Y" />
        <CompactMetricCard label="LCR" value="142" unit="%" change={2.1} status="good" target="110%" />
        <CompactMetricCard label="NSFR" value="118" unit="%" change={1.2} status="good" target="100%" />
        <CompactMetricCard label="HQLA" value="$45.5" unit="B" change={1.1} status="good" />
        <CompactMetricCard label="NII @+100bp" value="+$187" unit="M" change={5.2} status="good" />
        <CompactMetricCard label="Deposit Beta" value="48" unit="%" status="warning" target="55%" />
      </div>

      <Tabs defaultValue="irr">
        <TabsList>
          <TabsTrigger value="irr">Interest Rate Risk</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Management</TabsTrigger>
          <TabsTrigger value="funding">Funding & Maturity</TabsTrigger>
          <TabsTrigger value="hedging">Hedge Program</TabsTrigger>
        </TabsList>

        {/* Interest Rate Risk Tab */}
        <TabsContent value="irr">
          <div className="space-y-6">
            {/* Repricing Gap Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Repricing Gap Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Time Bucket</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Assets</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Liabilities</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Gap</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Cumulative Gap</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Gap Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {repricingGap.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.bucket}</td>
                        <td className="px-4 py-3 text-right text-gray-900">${row.assets.toLocaleString()}M</td>
                        <td className="px-4 py-3 text-right text-gray-900">${row.liabilities.toLocaleString()}M</td>
                        <td className={`px-4 py-3 text-right font-bold ${row.gap > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${row.gap.toLocaleString()}M
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${row.cumGap > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${row.cumGap.toLocaleString()}M
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${row.gapRatio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {row.gapRatio > 0 ? '+' : ''}{row.gapRatio.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="text-sm font-bold text-green-900 mb-2">Asset-Sensitive Position</div>
                  <div className="text-xs text-green-800 space-y-1">
                    <div>• Short-term positive gap (+$12.4B in 0-3M) benefits from rate increases</div>
                    <div>• Cumulative gap +$13.0B = rising rates increase NII</div>
                    <div>• Well-positioned for Fed pause/hold scenario</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50">
                  <div className="text-sm font-bold text-amber-900 mb-2">Risk Areas</div>
                  <div className="text-xs text-amber-800 space-y-1">
                    <div>• Negative gap in 6-12M bucket (-$6.1B) creates vulnerability</div>
                    <div>• Long-term rates declining would compress margin</div>
                    <div>• Monitor deposit beta assumptions closely</div>
                  </div>
                </div>
              </div>
            </div>

            {/* NII Sensitivity Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Net Interest Income Sensitivity (12-Month Horizon)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={niiSensitivity[0].m1 !== undefined ?
                  [1, 3, 6, 9, 12].map(month => ({
                    month: `Month ${month}`,
                    ...Object.fromEntries(niiSensitivity.map(s => [
                      s.scenario,
                      s[`m${month}` as keyof typeof s]
                    ]))
                  })) : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'NII Impact ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="+100bp Parallel" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="+200bp Parallel" stroke="#059669" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="-100bp Parallel" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="+100bp Steepener" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="+100bp Flattener" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">+100bp Parallel Shift</div>
                  <div className="text-green-800">NII increases $187M (+21%) over 12 months. Asset repricing outpaces liability repricing.</div>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <div className="font-bold text-red-900 mb-1">-100bp Parallel Shift</div>
                  <div className="text-red-800">NII decreases $248M (-28%) over 12 months. Downside asymmetry due to deposit floor.</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">Curve Scenarios</div>
                  <div className="text-blue-800">Flattener more beneficial (+$225M) vs steepener (+$145M). Long-end exposure limited.</div>
                </div>
              </div>
            </div>

            {/* EVE Sensitivity */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Economic Value of Equity (EVE) Sensitivity</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={eveSensitivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="scenario" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
                      <YAxis tick={{ fontSize: 11 }} label={{ value: 'EVE Change (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                      <Tooltip />
                      <ReferenceLine y={0} stroke="#6b7280" />
                      <ReferenceLine y={-5} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Limit: -5%', fontSize: 10, fill: '#ef4444' }} />
                      <ReferenceLine y={5} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Limit: +5%', fontSize: 10, fill: '#10b981' }} />
                      <Bar dataKey="eveChange" radius={[8, 8, 0, 0]}>
                        {eveSensitivity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.eveChange > 0 ? '#10b981' : entry.eveChange > -3 ? '#3b82f6' : '#f59e0b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                    <div className="text-sm font-bold mb-2" style={{ color: 'var(--client-text)' }}>EVE Risk Summary</div>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span>Current Equity (Book Value):</span>
                        <span className="font-semibold">$13,000M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration Gap:</span>
                        <span className="font-semibold">{durationData.durationGap.toFixed(1)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EVE at +100bp:</span>
                        <span className="font-semibold text-amber-600">-$198M (-1.5%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EVE at +200bp:</span>
                        <span className="font-semibold text-amber-600">-$425M (-3.3%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Regulatory Limit:</span>
                        <span className="font-semibold">±5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <div className="text-xs font-semibold text-green-900 mb-1">Within Risk Appetite</div>
                    <div className="text-xs text-green-800">All scenarios within ±5% EVE limit. Duration gap of 1.7 years is manageable and well-hedged.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Duration Gap Analysis</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-blue-50 border-2 border-blue-200">
                  <div className="text-xs text-blue-700 mb-1">Asset Duration</div>
                  <div className="text-3xl font-bold text-blue-900">{durationData.assetDuration.toFixed(1)}</div>
                  <div className="text-xs text-blue-700 mt-1">years</div>
                </div>
                <div className="p-5 rounded-xl bg-green-50 border-2 border-green-200">
                  <div className="text-xs text-green-700 mb-1">Liability Duration</div>
                  <div className="text-3xl font-bold text-green-900">{durationData.liabilityDuration.toFixed(1)}</div>
                  <div className="text-xs text-green-700 mt-1">years</div>
                </div>
                <div className="p-5 rounded-xl bg-amber-50 border-2 border-amber-200">
                  <div className="text-xs text-amber-700 mb-1">Duration Gap</div>
                  <div className="text-3xl font-bold text-amber-900">{durationData.durationGap.toFixed(1)}</div>
                  <div className="text-xs text-amber-700 mt-1">years</div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                <div className="text-sm font-bold mb-2" style={{ color: 'var(--client-text)' }}>Interpretation</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>• Positive duration gap (1.7 years) means assets reprice slower than liabilities</div>
                  <div>• In rising rate environment: liabilities reprice first → NII margin expansion</div>
                  <div>• In falling rate environment: liabilities reprice down first → NII margin compression</div>
                  <div>• EVE decreases in rising rate scenario (-$198M at +100bp) but within acceptable limits</div>
                  <div>• Target range: 1.5-2.5 years duration gap. Current position: OPTIMAL</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Liquidity Management Tab */}
        <TabsContent value="liquidity">
          <div className="space-y-6">
            {/* Liquidity Coverage Trend */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Liquidity Coverage Ratio (LCR) Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={liquidityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Balance ($B)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'LCR (%)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="hqla" fill="#10b981" name="HQLA" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="minRequired" fill="#d1d5db" name="Minimum Required" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="lcr" stroke="#3b82f6" strokeWidth={3} name="LCR %" dot={{ r: 4 }} />
                  <ReferenceLine yAxisId="right" y={110} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Reg Min: 110%', fontSize: 10 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 rounded-lg bg-green-50">
                <div className="text-sm font-bold text-green-900 mb-2">Strong Liquidity Buffer</div>
                <div className="grid grid-cols-3 gap-4 text-xs text-green-800">
                  <div>
                    <div className="font-semibold">Current LCR: 142%</div>
                    <div>32pp above 110% minimum</div>
                  </div>
                  <div>
                    <div className="font-semibold">HQLA: $45.5B</div>
                    <div>+$1.1B MoM increase</div>
                  </div>
                  <div>
                    <div className="font-semibold">Buffer: $13.4B</div>
                    <div>42% excess over minimum</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stress Test Results */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Liquidity Stress Test Results</h3>
              <div className="space-y-3">
                {stressScenarios.map((scenario, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border-2" style={{
                    borderColor: getStatusColor(scenario.status)
                  }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{scenario.scenario}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {scenario.outflowRate}% deposit runoff over {scenario.horizon} days
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        scenario.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {scenario.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-gray-600">Total Outflow</div>
                        <div className="font-bold text-gray-900">${scenario.totalOutflow.toLocaleString()}M</div>
                      </div>
                      <div>
                        <div className="text-gray-600">HQLA Buffer</div>
                        <div className="font-bold text-green-600">${scenario.hqlaBuffer.toLocaleString()}M</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Survival Days</div>
                        <div className="font-bold text-blue-600">{scenario.survivalDays} days</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Coverage</div>
                        <div className="font-bold text-gray-900">{(scenario.hqlaBuffer / scenario.totalOutflow * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <div className="text-sm font-bold text-green-900 mb-2">All Stress Tests Pass</div>
                <div className="text-xs text-green-800 space-y-1">
                  <div>• Name crisis: 138 days survival (target: 30 days) - 4.6x buffer</div>
                  <div>• Systemic crisis: 63 days survival (target: 30 days) - 2.1x buffer</div>
                  <div>• Combined crisis: 49 days survival (target: 30 days) - 1.6x buffer</div>
                  <div>• Contingency funding plan remains effective across all scenarios</div>
                </div>
              </div>
            </div>

            {/* HQLA Composition */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>High-Quality Liquid Assets (HQLA) Composition</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-green-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-green-900">Level 1 Assets</span>
                      <span className="text-lg font-bold text-green-900">$35.2B</span>
                    </div>
                    <div className="text-xs text-green-800 mb-2">100% eligible haircut • 77% of total HQLA</div>
                    <ul className="text-xs text-green-800 space-y-1">
                      <li>• Cash & reserves: $18.5B</li>
                      <li>• U.S. Treasuries: $12.8B</li>
                      <li>• Agency securities: $3.9B</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-blue-900">Level 2A Assets</span>
                      <span className="text-lg font-bold text-blue-900">$8.5B</span>
                    </div>
                    <div className="text-xs text-blue-800 mb-2">85% eligible haircut • 19% of total HQLA</div>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• GSE MBS: $5.2B</li>
                      <li>• High-quality corporate bonds: $3.3B</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-amber-900">Level 2B Assets</span>
                      <span className="text-lg font-bold text-amber-900">$1.8B</span>
                    </div>
                    <div className="text-xs text-amber-800 mb-2">50% eligible haircut • 4% of total HQLA</div>
                    <ul className="text-xs text-amber-800 space-y-1">
                      <li>• Investment-grade corporates: $1.8B</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                    <div className="text-sm font-semibold mb-3" style={{ color: 'var(--client-text)' }}>HQLA Quality Metrics</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total HQLA (after haircuts):</span>
                        <span className="font-bold">$45.5B</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level 1 concentration:</span>
                        <span className="font-bold text-green-600">77%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level 2 cap (40% limit):</span>
                        <span className="font-bold text-blue-600">23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level 2B cap (15% limit):</span>
                        <span className="font-bold text-amber-600">4%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                    <div className="text-xs font-semibold mb-1" style={{ color: 'var(--client-accent)' }}>Optimal HQLA Mix</div>
                    <div className="text-xs text-gray-700">
                      77% Level 1 assets provides maximum liquidity and monetization capability. Well within regulatory limits for Level 2 assets.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Funding & Maturity Tab */}
        <TabsContent value="funding">
          <div className="space-y-6">
            {/* Funding Mix */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Funding Mix & Stability Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Funding Category</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Balance</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">% of Total</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Avg Rate</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Stability Score</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Runoff Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fundingMix.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.category}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">${row.balance.toLocaleString()}M</td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {(row.balance / fundingMix.reduce((sum, r) => sum + r.balance, 0) * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">{row.rate.toFixed(2)}%</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold ${
                            row.stability >= 95 ? 'text-green-600' : row.stability >= 80 ? 'text-blue-600' : 'text-amber-600'
                          }`}>
                            {row.stability}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold ${
                            row.runoffRate <= 5 ? 'text-green-600' : row.runoffRate <= 25 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {row.runoffRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">Core Deposit Base</div>
                  <div className="text-green-800">87% retail and operational deposits with 95-98% stability. Extremely low runoff risk.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-bold text-amber-900 mb-1">Wholesale Funding</div>
                  <div className="text-amber-800">19% wholesale/borrowed funds. Monitor concentration and rollover risk. Within acceptable limits.</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">Funding Cost</div>
                  <div className="text-blue-800">Blended rate 2.46%. Retail deposits (1.85%) offset by higher wholesale rates (4.25%).</div>
                </div>
              </div>
            </div>

            {/* Maturity Ladder */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Contractual Maturity Ladder</h3>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={maturityLadder}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Balance ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assets" fill="#3b82f6" name="Assets" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="liabilities" fill="#ef4444" name="Liabilities" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="liquidity" stroke="#10b981" strokeWidth={3} name="Cumulative Liquidity" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <div className="text-sm font-bold text-blue-900 mb-2">Maturity Profile Analysis</div>
                <div className="grid grid-cols-2 gap-4 text-xs text-blue-800">
                  <div>
                    <div className="font-semibold mb-1">Short-term position (0-3M):</div>
                    <div>+$13.3B surplus. High liquidity. Strong position for immediate needs.</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Medium-term mismatch (3-12M):</div>
                    <div>-$10.6B cumulative deficit. Normal for banking operations. Covered by new business flow.</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Long-term position (2Y+):</div>
                    <div>+$12.7B surplus. Assets extend beyond liabilities. Positive carry but duration risk.</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Cumulative liquidity:</div>
                    <div>$127.4B available through all time buckets. No rollover cliffs identified.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deposit Beta Analysis */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Deposit Beta Analysis</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={depositBeta}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="cycle" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Rate Change (bps)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fedFundsChange" fill="#3b82f6" name="Fed Funds Change" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="depositRateChange" fill="#10b981" name="Deposit Rate Change" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-amber-50">
                  <div className="text-sm font-bold text-amber-900 mb-2">Current Cycle Beta: 48%</div>
                  <div className="text-xs text-amber-800 space-y-1">
                    <div>• Below historical average of 55%</div>
                    <div>• Reflects competitive pressures and deposit migration</div>
                    <div>• Assumption may be optimistic in further rate hikes</div>
                    <div>• Monitor actual beta vs. assumption closely</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="text-sm font-bold text-blue-900 mb-2">Sensitivity to Beta Assumption</div>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>• If beta increases to 55%: -$45M NII impact</div>
                    <div>• If beta increases to 60%: -$78M NII impact</div>
                    <div>• Each 1% beta increase = -$6.5M quarterly NII</div>
                    <div>• Key driver of NII sensitivity in rate scenarios</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Hedge Program Tab */}
        <TabsContent value="hedging">
          <div className="space-y-6">
            {/* Hedge Portfolio Overview */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-text)' }}>Interest Rate Hedge Portfolio</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Instrument</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Notional</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">PV01</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">DV01</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Hedge Effectiveness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hedgePortfolio.map((row, idx) => (
                      <tr key={idx} className={`hover:bg-gray-50 ${idx === hedgePortfolio.length - 1 ? 'bg-gray-100 font-bold' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.instrument}</td>
                        <td className="px-4 py-3 text-right text-gray-900">${row.notional.toLocaleString()}M</td>
                        <td className="px-4 py-3 text-right text-gray-900">${row.pv01.toLocaleString()}K</td>
                        <td className="px-4 py-3 text-right text-gray-900">${row.dv01.toLocaleString()}K</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold ${
                            row.effectivity >= 95 ? 'text-green-600' : row.effectivity >= 90 ? 'text-blue-600' : 'text-amber-600'
                          }`}>
                            {row.effectivity}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">Overall Effectiveness: 93%</div>
                  <div className="text-green-800">Hedge program highly effective. Tight correlation between hedged positions and underlying exposures.</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">Notional: $28.5B</div>
                  <div className="text-blue-800">Hedges 20% of interest-sensitive balance sheet. Appropriate for current risk profile.</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <div className="font-bold mb-1" style={{ color: 'var(--client-accent)' }}>DV01: -$62K per bp</div>
                  <div className="text-gray-700">Every 1bp rate move = $62K daily P&L volatility from hedge portfolio.</div>
                </div>
              </div>
            </div>

            {/* Strategic Positioning Recommendations */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.25)'
            }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5" style={{ color: 'var(--client-accent)' }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--client-text)' }}>Strategic ALM Recommendations</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-bold text-green-900">Maintain Current Position</span>
                  </div>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>• Asset-sensitive position well-suited for rate pause/hold</li>
                    <li>• +$187M NII upside if rates rise another 100bp</li>
                    <li>• Duration gap of 1.7 years within optimal range</li>
                    <li>• Liquidity buffers exceed stress test requirements</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-white border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-900">Monitor Closely</span>
                  </div>
                  <ul className="space-y-1 text-xs text-amber-800">
                    <li>• Deposit beta assumption (48%) may be optimistic</li>
                    <li>• Negative repricing gap in 6-12M bucket creates vulnerability</li>
                    <li>• Rate down scenario: -$248M NII impact (-28%)</li>
                    <li>• Wholesale funding 19% - watch for concentration risk</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-white border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Tactical Actions (Q2 2025)</span>
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• Add $2-3B in 3-5Y fixed-rate assets if curve steepens</li>
                    <li>• Consider extending liability duration via term debt issuance</li>
                    <li>• Increase hedge notional to $32B if EVE volatility rises</li>
                    <li>• Lock in deposit pricing ahead of potential Fed cuts</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-white border" style={{ borderColor: 'var(--client-accent)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" style={{ color: 'var(--client-accent)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--client-accent)' }}>Strategic Optimization</span>
                  </div>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li>• Target 55% deposit beta vs current 48% for conservative NII planning</li>
                    <li>• Optimize HQLA mix: increase Level 1 to 80%+ for maximum liquidity</li>
                    <li>• Reduce duration gap from 1.7Y to 1.4Y to lower EVE sensitivity</li>
                    <li>• Diversify wholesale funding sources to reduce concentration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

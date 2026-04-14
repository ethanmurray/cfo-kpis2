import { useState, useMemo } from 'react'
import { generateCapitalMetrics } from '../../data/capitalMetrics'
import { formatPercent, formatCurrency } from '../../utils/dataGenerators'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine, Area, AreaChart, ComposedChart } from 'recharts'
import { AlertTriangle, CheckCircle, Shield, TrendingDown, TrendingUp } from 'lucide-react'

export default function StressTestView() {
  const [selectedScenario, setSelectedScenario] = useState<'severely_adverse' | 'adverse' | 'baseline'>('severely_adverse')

  const capital = useMemo(() => generateCapitalMetrics(), [])

  // Regulatory stress test scenarios (CCAR/DFAST-style)
  const regulatoryScenarios = {
    severely_adverse: {
      name: 'Severely Adverse',
      description: 'Deep recession with significant market stress',
      assumptions: {
        gdpGrowth: [-3.5, -2.1, 1.2, 2.8],
        unemploymentRate: [10.2, 9.8, 8.5, 7.2],
        equityMarketDecline: -55,
        realEstateDecline: -32,
        bbwSpread: 570,
        vix: 65
      },
      results: {
        cet1Ratio: { start: capital.cet1.actual, trough: 8.2, end: 9.1 },
        totalLosses: 12.5,
        preProvisionNetRevenue: 8.2,
        provisions: 15.8,
        tradingLosses: 2.1,
        capitalActions: {
          dividends: 2.1,
          buybacks: 0,
          issuance: 0
        }
      }
    },
    adverse: {
      name: 'Adverse',
      description: 'Moderate recession with elevated market volatility',
      assumptions: {
        gdpGrowth: [-1.2, 0.3, 1.8, 2.5],
        unemploymentRate: [7.8, 7.2, 6.5, 5.8],
        equityMarketDecline: -25,
        realEstateDecline: -15,
        bbwSpread: 325,
        vix: 45
      },
      results: {
        cet1Ratio: { start: capital.cet1.actual, trough: 9.8, end: 10.5 },
        totalLosses: 6.8,
        preProvisionNetRevenue: 9.5,
        provisions: 8.2,
        tradingLosses: 0.8,
        capitalActions: {
          dividends: 2.1,
          buybacks: 0.5,
          issuance: 0
        }
      }
    },
    baseline: {
      name: 'Baseline',
      description: 'Consensus economic outlook with stable growth',
      assumptions: {
        gdpGrowth: [2.4, 2.1, 2.3, 2.5],
        unemploymentRate: [4.2, 4.0, 3.9, 3.8],
        equityMarketDecline: 8,
        realEstateDecline: -2,
        bbwSpread: 125,
        vix: 18
      },
      results: {
        cet1Ratio: { start: capital.cet1.actual, trough: capital.cet1.actual - 0.3, end: capital.cet1.actual + 0.8 },
        totalLosses: 2.1,
        preProvisionNetRevenue: 11.2,
        provisions: 2.8,
        tradingLosses: 0.2,
        capitalActions: {
          dividends: 2.1,
          buybacks: 2.5,
          issuance: 0
        }
      }
    }
  }

  const scenario = regulatoryScenarios[selectedScenario]

  // CET1 trajectory chart data
  const cet1TrajectoryData = [
    { quarter: 'Q0', actual: scenario.results.cet1Ratio.start, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q1', actual: scenario.results.cet1Ratio.start - 1.2, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q2', actual: scenario.results.cet1Ratio.start - 2.1, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q3', actual: scenario.results.cet1Ratio.trough, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q4', actual: scenario.results.cet1Ratio.trough + 0.3, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q5', actual: scenario.results.cet1Ratio.trough + 0.5, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q6', actual: scenario.results.cet1Ratio.trough + 0.7, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q7', actual: scenario.results.cet1Ratio.trough + 0.9, minimum: 4.5, target: capital.cet1.target },
    { quarter: 'Q8', actual: scenario.results.cet1Ratio.end, minimum: 4.5, target: capital.cet1.target }
  ]

  // P&L decomposition
  const plData = [
    { category: 'Pre-Provision Net Revenue', value: scenario.results.preProvisionNetRevenue, type: 'positive' },
    { category: 'Provisions for Credit Losses', value: -scenario.results.provisions, type: 'negative' },
    { category: 'Trading & Counterparty Losses', value: -scenario.results.tradingLosses, type: 'negative' },
    { category: 'Other Losses', value: -(scenario.results.totalLosses - scenario.results.provisions - scenario.results.tradingLosses - scenario.results.preProvisionNetRevenue), type: 'negative' }
  ]

  // Capital actions waterfall
  const capitalActionsData = [
    { category: 'Starting CET1', value: scenario.results.cet1Ratio.start, isTotal: true },
    { category: 'Net Income (Loss)', value: scenario.results.preProvisionNetRevenue - scenario.results.totalLosses },
    { category: 'Dividends', value: -scenario.results.capitalActions.dividends },
    { category: 'Buybacks', value: -scenario.results.capitalActions.buybacks },
    { category: 'Issuance', value: scenario.results.capitalActions.issuance },
    { category: 'RWA Growth', value: -0.8 },
    { category: 'Other Changes', value: 0.3 },
    { category: 'Ending CET1', value: scenario.results.cet1Ratio.end, isTotal: true }
  ]

  // Compare to internal scenarios
  const internalScenarios = [
    { name: 'Internal Base', cet1Trough: capital.cet1.actual - 0.5, pass: true },
    { name: 'Internal Stress', cet1Trough: 9.2, pass: true },
    { name: 'Regulatory Severely Adverse', cet1Trough: scenario.results.cet1Ratio.trough, pass: scenario.results.cet1Ratio.trough >= 4.5 }
  ]

  const bufferAnalysis = [
    {
      buffer: 'CET1 Minimum (4.5%)',
      trough: scenario.results.cet1Ratio.trough,
      excess: scenario.results.cet1Ratio.trough - 4.5,
      sufficient: scenario.results.cet1Ratio.trough >= 4.5
    },
    {
      buffer: 'CET1 + CCB (7.0%)',
      trough: scenario.results.cet1Ratio.trough,
      excess: scenario.results.cet1Ratio.trough - 7.0,
      sufficient: scenario.results.cet1Ratio.trough >= 7.0
    },
    {
      buffer: 'Internal Target',
      trough: scenario.results.cet1Ratio.trough,
      excess: scenario.results.cet1Ratio.trough - capital.cet1.target,
      sufficient: scenario.results.cet1Ratio.trough >= capital.cet1.target
    }
  ]

  const getSeverityColor = (scenario: string) => {
    switch(scenario) {
      case 'severely_adverse': return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' }
      case 'adverse': return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' }
      case 'baseline': return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' }
      default: return { bg: '#6b7280', light: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)' }
    }
  }

  const currentColor = getSeverityColor(selectedScenario)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(0, 77, 53, 0.05) 0%, rgba(0, 77, 53, 0.02) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.15)'
      }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <Shield className="h-6 w-6" style={{ color: '#ef4444' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#006747' }}>Regulatory Stress Testing</h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>CCAR/DFAST-style capital adequacy analysis</p>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>
            Select Stress Scenario
          </label>
          <div className="flex gap-3">
            {(['severely_adverse', 'adverse', 'baseline'] as const).map(sc => {
              const color = getSeverityColor(sc)
              const isSelected = selectedScenario === sc
              return (
                <button
                  key={sc}
                  onClick={() => setSelectedScenario(sc)}
                  className="flex-1 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: isSelected ? color.bg : color.light,
                    color: isSelected ? '#ffffff' : color.bg,
                    border: `2px solid ${isSelected ? color.bg : color.border}`,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg">{regulatoryScenarios[sc].name}</div>
                    {isSelected && (
                      <div className="text-xs mt-1 opacity-90">{regulatoryScenarios[sc].description}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Test Result Banner */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: scenario.results.cet1Ratio.trough >= 4.5
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
        border: scenario.results.cet1Ratio.trough >= 4.5
          ? '2px solid rgba(16, 185, 129, 0.3)'
          : '2px solid rgba(239, 68, 68, 0.3)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {scenario.results.cet1Ratio.trough >= 4.5 ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-red-600" />
            )}
            <div>
              <div className="text-sm font-bold uppercase tracking-wide" style={{
                color: scenario.results.cet1Ratio.trough >= 4.5 ? '#10b981' : '#ef4444'
              }}>
                {scenario.results.cet1Ratio.trough >= 4.5 ? 'STRESS TEST: PASS' : 'STRESS TEST: FAIL'}
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#006747' }}>
                CET1 Trough: {formatPercent(scenario.results.cet1Ratio.trough)}
              </div>
              <div className="text-sm mt-1" style={{ color: '#6b7280' }}>
                {scenario.results.cet1Ratio.trough >= 7.0
                  ? `Exceeds internal target by ${formatPercent(scenario.results.cet1Ratio.trough - 7.0)}`
                  : scenario.results.cet1Ratio.trough >= 4.5
                  ? `${formatPercent(scenario.results.cet1Ratio.trough - 4.5)} buffer above regulatory minimum`
                  : `Below regulatory minimum by ${formatPercent(4.5 - scenario.results.cet1Ratio.trough)}`
                }
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Total Losses (9Q)
            </div>
            <div className="text-3xl font-bold text-red-600">
              ${scenario.results.totalLosses.toFixed(1)}B
            </div>
            <div className="text-sm" style={{ color: '#6b7280' }}>
              {formatPercent((scenario.results.totalLosses / capital.totalCapital) * 100)} of capital
            </div>
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
          border: '1px solid rgba(0, 77, 53, 0.08)'
        }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Starting CET1
          </div>
          <div className="text-3xl font-bold" style={{ color: '#006747' }}>
            {formatPercent(scenario.results.cet1Ratio.start)}
          </div>
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0, 77, 53, 0.08)' }}>
            <div className="text-xs" style={{ color: '#10b981' }}>Well-capitalized</div>
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: `linear-gradient(135deg, ${currentColor.light} 0%, ${currentColor.light} 100%)`,
          border: `2px solid ${currentColor.border}`
        }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            CET1 Trough (Q3)
          </div>
          <div className="text-3xl font-bold" style={{
            color: scenario.results.cet1Ratio.trough >= 7.0 ? '#10b981' :
                   scenario.results.cet1Ratio.trough >= 4.5 ? '#f59e0b' : '#ef4444'
          }}>
            {formatPercent(scenario.results.cet1Ratio.trough)}
          </div>
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <div className="text-xs font-semibold" style={{
              color: scenario.results.cet1Ratio.trough >= 4.5 ? '#10b981' : '#ef4444'
            }}>
              {formatPercent(Math.abs(scenario.results.cet1Ratio.trough - 4.5))} {scenario.results.cet1Ratio.trough >= 4.5 ? 'above' : 'below'} minimum
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Ending CET1 (Q9)
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {formatPercent(scenario.results.cet1Ratio.end)}
          </div>
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div className="flex items-center gap-1 text-xs font-semibold" style={{
              color: scenario.results.cet1Ratio.end >= scenario.results.cet1Ratio.start ? '#10b981' : '#ef4444'
            }}>
              {scenario.results.cet1Ratio.end >= scenario.results.cet1Ratio.start ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {scenario.results.cet1Ratio.end >= scenario.results.cet1Ratio.start ? '+' : ''}{formatPercent(scenario.results.cet1Ratio.end - scenario.results.cet1Ratio.start)}
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 shadow-lg" style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Pre-Prov Net Revenue
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${scenario.results.preProvisionNetRevenue.toFixed(1)}B
          </div>
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div className="text-xs text-red-600 font-semibold">
              vs ${scenario.results.totalLosses.toFixed(1)}B losses
            </div>
          </div>
        </div>
      </div>

      {/* CET1 Trajectory */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#006747' }}>CET1 Ratio Trajectory (9 Quarters)</h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
              <span style={{ color: '#6b7280' }}>Below Minimum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
              <span style={{ color: '#6b7280' }}>Above Min, Below Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#0ea5e9' }} />
              <span style={{ color: '#6b7280' }}>Above Target</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={cet1TrajectoryData}>
            <defs>
              <linearGradient id="colorCET1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
            <XAxis dataKey="quarter" style={{ fontSize: '12px', fill: '#6b7280' }} />
            <YAxis domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} style={{ fontSize: '12px', fill: '#6b7280' }} />
            <Tooltip
              formatter={(v: number) => `${v.toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 77, 53, 0.2)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <ReferenceLine y={4.5} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5">
              <Label value="Regulatory Minimum" position="insideTopRight" style={{ fill: '#ef4444', fontSize: '12px', fontWeight: 'bold' }} />
            </ReferenceLine>
            <ReferenceLine y={7.0} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5">
              <Label value="CET1 + CCB" position="insideTopRight" style={{ fill: '#f59e0b', fontSize: '12px', fontWeight: 'bold' }} />
            </ReferenceLine>
            <ReferenceLine y={capital.cet1.target} stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5">
              <Label value="Internal Target" position="insideTopRight" style={{ fill: '#D4AF37', fontSize: '12px', fontWeight: 'bold' }} />
            </ReferenceLine>
            <Area type="monotone" dataKey="actual" fill="url(#colorCET1)" stroke="none" />
            <Bar dataKey="actual" name="CET1 Ratio" radius={[8, 8, 0, 0]}>
              {cet1TrajectoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.actual < 4.5 ? '#ef4444' : entry.actual < 7.0 ? '#f59e0b' : '#0ea5e9'} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(0, 77, 53, 0.02)' }}>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <div style={{ color: '#6b7280' }}>Peak to Trough</div>
              <div className="text-lg font-bold text-red-600">
                {formatPercent(scenario.results.cet1Ratio.start - scenario.results.cet1Ratio.trough)}
              </div>
            </div>
            <div>
              <div style={{ color: '#6b7280' }}>Trough Quarter</div>
              <div className="text-lg font-bold" style={{ color: '#006747' }}>Q3</div>
            </div>
            <div>
              <div style={{ color: '#6b7280' }}>Recovery by Q9</div>
              <div className="text-lg font-bold text-blue-600">
                {formatPercent(scenario.results.cet1Ratio.end - scenario.results.cet1Ratio.trough)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* P&L Decomposition */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#006747' }}>P&L Components (9 Quarter Cumulative)</h2>
          <div className="text-right">
            <div className="text-xs" style={{ color: '#6b7280' }}>Net Loss</div>
            <div className="text-xl font-bold text-red-600">
              ${(scenario.results.totalLosses - scenario.results.preProvisionNetRevenue).toFixed(1)}B
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={plData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
            <XAxis type="number" tickFormatter={(v) => `$${v}B`} style={{ fontSize: '12px', fill: '#6b7280' }} />
            <YAxis dataKey="category" type="category" width={220} style={{ fontSize: '12px', fill: '#6b7280' }} />
            <Tooltip
              formatter={(v: number) => `$${v.toFixed(1)}B`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 77, 53, 0.2)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {plData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'positive' ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Buffer Analysis */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Regulatory Buffer Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={{ backgroundColor: 'rgba(0, 77, 53, 0.02)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Buffer Level</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Trough CET1</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Excess / (Shortfall)</th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: '#006747' }}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'rgba(0, 77, 53, 0.05)' }}>
              {bufferAnalysis.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#006747' }}>{item.buffer}</td>
                  <td className="px-6 py-4 text-sm text-right font-bold" style={{ color: '#006747' }}>
                    {formatPercent(item.trough)}
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${
                    item.excess >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.excess >= 0 ? '+' : ''}{formatPercent(item.excess)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                      item.sufficient
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {item.sufficient ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Assumptions */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 shadow-lg" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
          border: '1px solid rgba(0, 77, 53, 0.08)'
        }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Macroeconomic Assumptions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Real GDP Growth (Y1-Y4)</span>
              <span className="font-medium text-gray-900">
                {scenario.assumptions.gdpGrowth.map(g => `${g > 0 ? '+' : ''}${g}%`).join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unemployment Rate (Peak)</span>
              <span className="font-medium text-gray-900">{scenario.assumptions.unemploymentRate[0]}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Equity Market Decline</span>
              <span className="font-medium text-red-600">{scenario.assumptions.equityMarketDecline}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Real Estate Decline</span>
              <span className="font-medium text-red-600">{scenario.assumptions.realEstateDecline}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">BBB Spread (Peak)</span>
              <span className="font-medium text-gray-900">{scenario.assumptions.bbwSpread} bps</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">VIX (Peak)</span>
              <span className="font-medium text-gray-900">{scenario.assumptions.vix}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
          border: '1px solid rgba(0, 77, 53, 0.08)'
        }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Capital Actions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Common Dividends (9Q)</span>
              <span className="font-medium text-gray-900">{formatCurrency(scenario.results.capitalActions.dividends, 1)}B</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Share Buybacks (9Q)</span>
              <span className="font-medium text-gray-900">{formatCurrency(scenario.results.capitalActions.buybacks, 1)}B</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Capital Issuance (9Q)</span>
              <span className="font-medium text-gray-900">{formatCurrency(scenario.results.capitalActions.issuance, 1)}B</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Net Capital Distribution</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(scenario.results.capitalActions.dividends + scenario.results.capitalActions.buybacks - scenario.results.capitalActions.issuance, 1)}B
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="rounded-2xl p-6 shadow-lg" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
        border: '1px solid rgba(0, 77, 53, 0.08)'
      }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Stress Test Assessment</h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl" style={{
            background: scenario.results.cet1Ratio.trough >= capital.cet1.target
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
              : scenario.results.cet1Ratio.trough >= 4.5
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            borderLeft: `4px solid ${
              scenario.results.cet1Ratio.trough >= capital.cet1.target ? '#10b981' :
              scenario.results.cet1Ratio.trough >= 4.5 ? '#f59e0b' : '#ef4444'
            }`
          }}>
            <div className="font-bold text-sm mb-2" style={{ color: '#006747' }}>Overall Result</div>
            <div className="text-sm" style={{ color: '#1f2937' }}>
              {scenario.results.cet1Ratio.trough >= capital.cet1.target
                ? `✓ Strong pass. CET1 remains above internal target throughout stress period. Comfortable buffer of ${formatPercent(scenario.results.cet1Ratio.trough - 4.5)} above regulatory minimum.`
                : scenario.results.cet1Ratio.trough >= 4.5
                ? `⚠ Pass with conditions. CET1 remains above regulatory minimum with ${formatPercent(scenario.results.cet1Ratio.trough - 4.5)} buffer, but falls below internal target. Consider capital preservation actions.`
                : `✗ Fail. CET1 falls below regulatory minimum. Immediate capital action required.`
              }
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div className="font-bold text-sm mb-2" style={{ color: '#006747' }}>Loss Absorption Capacity</div>
            <div className="text-sm" style={{ color: '#1f2937' }}>
              Pre-provision net revenue of ${scenario.results.preProvisionNetRevenue.toFixed(1)}B partially offsets total losses of ${scenario.results.totalLosses.toFixed(1)}B over 9 quarters. Net loss of ${(scenario.results.totalLosses - scenario.results.preProvisionNetRevenue).toFixed(1)}B represents {formatPercent((scenario.results.totalLosses - scenario.results.preProvisionNetRevenue) / capital.totalCapital * 100)} of current capital.
            </div>
          </div>

          <div className="p-5 rounded-xl" style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
            borderLeft: '4px solid #a855f7'
          }}>
            <div className="font-bold text-sm mb-2" style={{ color: '#006747' }}>Capital Recovery</div>
            <div className="text-sm" style={{ color: '#1f2937' }}>
              CET1 ratio recovers from trough of {formatPercent(scenario.results.cet1Ratio.trough)} to {formatPercent(scenario.results.cet1Ratio.end)} by end of projection period. Recovery driven by return to profitability and RWA stabilization.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

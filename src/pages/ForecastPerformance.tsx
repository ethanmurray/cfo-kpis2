import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'
import CompactMetricCard from '../components/CompactMetricCard'
import { TrendingUp, CheckCircle2, AlertCircle, Clock, Target, TrendingDown } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, ReferenceLine, ScatterChart, Scatter, Cell } from 'recharts'

export default function ForecastPerformance() {
  // Forecast vs Actual Trending
  const forecastAccuracy = [
    { month: 'Jul', actual: 445, forecast3MoPrior: 438, forecast2MoPrior: 442, forecast1MoPrior: 447, budget: 440 },
    { month: 'Aug', actual: 458, forecast3MoPrior: 445, forecast2MoPrior: 452, forecast1MoPrior: 456, budget: 448 },
    { month: 'Sep', actual: 463, forecast3MoPrior: 450, forecast2MoPrior: 458, forecast1MoPrior: 465, budget: 455 },
    { month: 'Oct', actual: 456, forecast3MoPrior: 455, forecast2MoPrior: 459, forecast1MoPrior: 458, budget: 452 },
    { month: 'Nov', actual: 461, forecast3MoPrior: 458, forecast2MoPrior: 462, forecast1MoPrior: 463, budget: 456 },
    { month: 'Dec', actual: 468, forecast3MoPrior: 462, forecast2MoPrior: 466, forecast1MoPrior: 470, budget: 460 },
    { month: 'Jan', actual: 452, forecast3MoPrior: 465, forecast2MoPrior: 468, forecast1MoPrior: 455, budget: 458 },
  ]

  // Budget vs Actual vs Forecast by Segment
  const segmentPerformance = [
    {
      segment: 'C&IS',
      budget: 3180,
      forecast: 3245,
      actual: 3250,
      budgetVar: 70,
      budgetVarPct: 2.2,
      forecastVar: 5,
      forecastVarPct: 0.2,
      forecastAccuracy: 99.8
    },
    {
      segment: 'WM',
      budget: 2095,
      forecast: 2125,
      actual: 2140,
      budgetVar: 45,
      budgetVarPct: 2.1,
      forecastVar: 15,
      forecastVarPct: 0.7,
      forecastAccuracy: 99.3
    },
  ]

  // Forecast Accuracy Metrics by Dimension
  const accuracyByDimension = [
    { dimension: 'Revenue', budget: 5275, forecast: 5370, actual: 5390, accuracy: 99.6, bias: 0.4 },
    { dimension: 'NII', budget: 910, forecast: 885, actual: 892, accuracy: 99.2, bias: -0.8 },
    { dimension: 'Fee Income', budget: 3450, forecast: 3475, actual: 3483, accuracy: 99.8, bias: 0.2 },
    { dimension: 'OpEx', budget: 3430, forecast: 3355, actual: 3367, accuracy: 99.6, bias: 0.4 },
    { dimension: 'Econ Profit', budget: 1745, forecast: 1830, actual: 1854, accuracy: 98.7, bias: 1.3 },
    { dimension: 'Client Count', budget: 280, forecast: 283, actual: 285, accuracy: 99.3, bias: 0.7 },
  ]

  // Forecast Bias Analysis
  const biasAnalysis = [
    { metric: 'Revenue', q1Bias: 1.2, q2Bias: 0.8, q3Bias: 0.5, q4Bias: 0.4, avgBias: 0.7, direction: 'Optimistic' },
    { metric: 'NII', q1Bias: -2.1, q2Bias: -1.5, q3Bias: -1.2, q4Bias: -0.8, avgBias: -1.4, direction: 'Conservative' },
    { metric: 'Expenses', q1Bias: -0.5, q2Bias: 0.2, q3Bias: 0.8, q4Bias: 0.4, avgBias: 0.2, direction: 'Neutral' },
    { metric: 'Client Growth', q1Bias: -1.8, q2Bias: -1.2, q3Bias: 0.5, q4Bias: 0.7, avgBias: -0.5, direction: 'Conservative' },
  ]

  // Budget Performance YTD
  const budgetPerformanceYTD = {
    revenue: { budget: 5275, actual: 5390, variance: 115, variancePct: 2.2, status: 'favorable' },
    nii: { budget: 910, actual: 892, variance: -18, variancePct: -2.0, status: 'unfavorable' },
    feeIncome: { budget: 3450, actual: 3483, variance: 33, variancePct: 1.0, status: 'favorable' },
    opex: { budget: 3430, actual: 3367, variance: -63, variancePct: -1.8, status: 'favorable' },
    econProfit: { budget: 1745, actual: 1854, variance: 109, variancePct: 6.2, status: 'favorable' },
    raroc: { budget: 9.5, actual: 9.8, variance: 0.3, variancePct: 3.2, status: 'favorable' },
  }

  // Forecast vs Actual Scatter (to show bias patterns)
  const forecastVsActualScatter = [
    { forecast: 438, actual: 445, month: 'Jul' },
    { forecast: 452, actual: 458, month: 'Aug' },
    { forecast: 458, actual: 463, month: 'Sep' },
    { forecast: 459, actual: 456, month: 'Oct' },
    { forecast: 462, actual: 461, month: 'Nov' },
    { forecast: 466, actual: 468, month: 'Dec' },
    { forecast: 468, actual: 452, month: 'Jan' },
  ]

  // Rolling Forecast Accuracy by Horizon
  const accuracyByHorizon = [
    { horizon: '1 Month', accuracy: 99.2, avgError: 3.5, maxError: 8, minError: 1 },
    { horizon: '2 Months', accuracy: 98.5, avgError: 6.8, maxError: 15, minError: 2 },
    { horizon: '3 Months', accuracy: 97.1, avgError: 12.5, maxError: 25, minError: 3 },
    { horizon: '6 Months', accuracy: 94.8, avgError: 22.8, maxError: 45, minError: 8 },
    { horizon: '12 Months', accuracy: 91.5, avgError: 38.2, maxError: 75, minError: 12 },
  ]

  // Top Forecast Misses
  const topMisses = [
    { item: 'NII - January', forecast: 78, actual: 68, miss: -10, missPct: -12.8, reason: 'Rate cuts happened faster than expected' },
    { item: 'Client Count - Q4', forecast: 288, actual: 285, miss: -3, missPct: -1.0, reason: 'Two large client wins delayed to Q1' },
    { item: 'OpEx - October', forecast: 268, actual: 276, miss: 8, missPct: 3.0, reason: 'Unplanned litigation settlement' },
    { item: 'Fee Income - September', forecast: 288, actual: 297, miss: 9, missPct: 3.1, reason: 'Market outperformance drove AUM fees' },
  ]

  // Full Year Outlook
  const fullYearOutlook = [
    {
      metric: 'Revenue',
      budget: 5450,
      latestForecast: 5525,
      priorForecast: 5485,
      implied: 5570,
      status: 'Beat'
    },
    {
      metric: 'NII',
      budget: 945,
      latestForecast: 920,
      priorForecast: 930,
      implied: 915,
      status: 'Miss'
    },
    {
      metric: 'OpEx',
      budget: 3540,
      latestForecast: 3475,
      priorForecast: 3490,
      implied: 3465,
      status: 'Beat'
    },
    {
      metric: 'Econ Profit',
      budget: 1810,
      latestForecast: 1920,
      priorForecast: 1880,
      implied: 1965,
      status: 'Beat'
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nt-forest">Forecast Performance & Budget Analysis</h1>
          <p className="text-xs mt-1 text-gray-600">
            Forecast accuracy, budget variance, bias analysis, and predictive performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-md" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <Target className="h-5 w-5" style={{ color: '#10b981' }} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-600">Forecast Accuracy</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-lg font-bold" style={{ color: '#10b981' }}>99.2%</div>
              <div className="text-[10px] font-semibold text-green-600">+0.3pp</div>
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
              <span className="font-semibold text-xs text-nt-forest">Strong Forecast Accuracy</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Overall forecast accuracy: 99.2% (1-month horizon)</li>
              <li>• Revenue forecast within 0.4% of actual</li>
              <li>• Budget beat: +$115M revenue (+2.2%)</li>
              <li>• Economic profit +$109M vs budget (+6.2%)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-nt-forest">Forecast Biases</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• NII: -1.4% conservative bias (consistent underforecasting)</li>
              <li>• Revenue: +0.7% optimistic bias (slight overforecasting)</li>
              <li>• Accuracy degrades beyond 3-month horizon (97.1% → 91.5%)</li>
              <li>• Largest miss: NII -12.8% in January (rate shock)</li>
            </ul>
          </div>

          <div className="summary-card">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-nt-forest">Full Year Outlook</span>
            </div>
            <ul className="space-y-0.5 text-xs text-gray-600 leading-tight">
              <li>• Revenue forecast: $5,525M vs budget $5,450M (+1.4%)</li>
              <li>• NII risk: $920M forecast vs $945M budget (-2.6%)</li>
              <li>• OpEx savings: $3,475M vs $3,540M budget (-1.8%)</li>
              <li>• Economic profit upside: +$110M vs budget</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3">
        <CompactMetricCard label="1M Forecast Accuracy" value="99.2" unit="%" change={0.3} status="good" />
        <CompactMetricCard label="3M Forecast Accuracy" value="97.1" unit="%" change={-0.5} status="good" />
        <CompactMetricCard label="Budget vs Actual" value="+$115" unit="M" change={2.2} status="good" />
        <CompactMetricCard label="Revenue Bias" value="+0.7" unit="%" status="warning" />
        <CompactMetricCard label="NII Bias" value="-1.4" unit="%" status="warning" />
        <CompactMetricCard label="Forecast Revisions" value="3" status="neutral" />
      </div>

      <Tabs defaultValue="accuracy">
        <TabsList>
          <TabsTrigger value="accuracy">Forecast Accuracy</TabsTrigger>
          <TabsTrigger value="budget">Budget Performance</TabsTrigger>
          <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
          <TabsTrigger value="outlook">Full Year Outlook</TabsTrigger>
        </TabsList>

        {/* Forecast Accuracy Tab */}
        <TabsContent value="accuracy">
          <div className="space-y-6">
            {/* Forecast vs Actual Trending */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Revenue Forecast vs Actual (Rolling 7 Months)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={forecastAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#1f2937" strokeWidth={4} name="Actual" dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="forecast1MoPrior" stroke="#10b981" strokeWidth={2} name="1M Forecast" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forecast2MoPrior" stroke="#3b82f6" strokeWidth={2} name="2M Forecast" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forecast3MoPrior" stroke="#f59e0b" strokeWidth={2} name="3M Forecast" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="budget" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Budget" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">1-Month Forecast: 99.2% Accurate</div>
                  <div className="text-green-800">Avg error: $3.5M (0.8%). Highly predictive with minimal bias.</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-bold text-blue-900 mb-1">3-Month Forecast: 97.1% Accurate</div>
                  <div className="text-blue-800">Avg error: $12.5M (2.8%). Still strong but more volatility.</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-50">
                  <div className="font-bold text-amber-900 mb-1">January Anomaly</div>
                  <div className="text-amber-800">Actual $452M vs forecast $468M (-$16M). Rate environment shifted rapidly.</div>
                </div>
              </div>
            </div>

            {/* Accuracy by Horizon */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Forecast Accuracy by Time Horizon</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Forecast Horizon</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Accuracy</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Avg Error ($M)</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Max Error ($M)</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700">Min Error ($M)</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700">Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accuracyByHorizon.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-900">{row.horizon}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold ${
                            row.accuracy >= 99 ? 'text-green-600' :
                            row.accuracy >= 95 ? 'text-blue-600' :
                            'text-amber-600'
                          }`}>
                            {row.accuracy.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">{row.avgError.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-red-600">{row.maxError}</td>
                        <td className="px-4 py-3 text-right text-green-600">{row.minError}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${row.accuracy}%`,
                                  backgroundColor: row.accuracy >= 99 ? '#10b981' : row.accuracy >= 95 ? '#3b82f6' : '#f59e0b'
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                <div className="text-sm font-bold mb-2" style={{ color: '#006747' }}>Interpretation</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>• Excellent short-term accuracy (1-3 months): &gt;97% accuracy suitable for operational planning</div>
                  <div>• Medium-term accuracy (6 months): 94.8% accuracy sufficient for quarterly reforecasting</div>
                  <div>• Long-term accuracy (12 months): 91.5% accuracy typical for annual budgeting - significant uncertainty remains</div>
                  <div>• Recommendation: Increase reforecasting frequency. Move from quarterly to monthly rolling forecasts.</div>
                </div>
              </div>
            </div>

            {/* Forecast vs Actual Scatter */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Forecast vs Actual Scatter (Bias Detection)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" dataKey="forecast" name="Forecast" tick={{ fontSize: 11 }} label={{ value: 'Forecast ($M)', position: 'insideBottom', offset: -5, style: { fontSize: 11 } }} />
                  <YAxis type="number" dataKey="actual" name="Actual" tick={{ fontSize: 11 }} label={{ value: 'Actual ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <ReferenceLine stroke="#6b7280" strokeDasharray="3 3" segment={[{ x: 430, y: 430 }, { x: 480, y: 480 }]} />
                  <Scatter name="Forecast vs Actual" data={forecastVsActualScatter} fill="#3b82f6">
                    {forecastVsActualScatter.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.actual > entry.forecast ? '#10b981' : '#ef4444'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-1">Above Line = Actual Beat Forecast</div>
                  <div className="text-green-800">5 of 7 months (71%) came in above forecast. Indicates slight conservative bias in forecasting.</div>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <div className="font-bold text-red-900 mb-1">Below Line = Actual Miss Forecast</div>
                  <div className="text-red-800">January miss (-$16M) was largest variance. Points cluster near 45° line showing strong accuracy.</div>
                </div>
              </div>
            </div>

            {/* Top Forecast Misses */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Top Forecast Misses (Root Cause Analysis)</h3>
              <div className="space-y-3">
                {topMisses.map((miss, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border-l-4" style={{
                    borderLeftColor: Math.abs(miss.missPct) > 5 ? '#ef4444' : Math.abs(miss.missPct) > 2 ? '#f59e0b' : '#3b82f6'
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{miss.item}</div>
                        <div className="text-xs text-gray-600 mt-1">{miss.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600">Miss</div>
                        <div className={`text-lg font-bold ${miss.miss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {miss.miss > 0 ? '+' : ''}{miss.miss}M ({miss.missPct > 0 ? '+' : ''}{miss.missPct.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                      <div>Forecast: ${miss.forecast}M</div>
                      <div>Actual: ${miss.actual}M</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Budget Performance Tab */}
        <TabsContent value="budget">
          <div className="space-y-6">
            {/* Budget vs Actual Summary */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>YTD Budget Performance (Through January 2025)</h3>
              <div className="space-y-3">
                {Object.entries(budgetPerformanceYTD).map(([key, data]) => (
                  <div key={key} className="p-4 rounded-xl bg-white border-l-4" style={{
                    borderLeftColor: data.status === 'favorable' ? '#10b981' : '#ef4444'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                          <div>
                            <span className="text-gray-600">Budget:</span>{' '}
                            <span className="font-semibold text-gray-900">
                              {typeof data.budget === 'number' && data.budget > 100 ? `$${data.budget.toLocaleString()}M` : `${data.budget}%`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Actual:</span>{' '}
                            <span className="font-semibold text-gray-900">
                              {typeof data.actual === 'number' && data.actual > 100 ? `$${data.actual.toLocaleString()}M` : `${data.actual}%`}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Variance:</span>{' '}
                            <span className={`font-bold ${data.status === 'favorable' ? 'text-green-600' : 'text-red-600'}`}>
                              {data.variance > 0 ? '+' : ''}{typeof data.variance === 'number' && Math.abs(data.variance) > 10 ? `$${data.variance.toLocaleString()}M` : `${data.variance.toFixed(1)}pp`} ({data.variancePct > 0 ? '+' : ''}{data.variancePct.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-xs font-bold ml-4 ${
                        data.status === 'favorable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {data.status === 'favorable' ? '✓ Favorable' : '⚠ Unfavorable'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-2">Budget Beats</div>
                  <ul className="space-y-1 text-green-800">
                    <li>• Revenue: +$115M (+2.2%) driven by strong client wins</li>
                    <li>• Operating Expenses: -$63M (-1.8%) from efficiency initiatives</li>
                    <li>• Economic Profit: +$109M (+6.2%) exceeding target significantly</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-red-50">
                  <div className="font-bold text-red-900 mb-2">Budget Misses</div>
                  <ul className="space-y-1 text-red-800">
                    <li>• NII: -$18M (-2.0%) from faster rate cuts than budgeted</li>
                    <li>• Need to offset NII shortfall with fee income growth or cost actions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Budget Performance by Segment */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Budget & Forecast Accuracy by Segment</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Segment</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Budget</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Latest Forecast</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Actual</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Budget Var</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Forecast Var</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Forecast Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {segmentPerformance.map((seg, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{seg.segment}</td>
                      <td className="px-4 py-3 text-right text-gray-900">${seg.budget}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">${seg.forecast}M</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${seg.actual}M</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        +${seg.budgetVar}M (+{seg.budgetVarPct}%)
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        +${seg.forecastVar}M (+{seg.forecastVarPct}%)
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">
                        {seg.forecastAccuracy}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Bias Analysis Tab */}
        <TabsContent value="bias">
          <div className="space-y-6">
            {/* Forecast Bias by Metric */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Systematic Forecast Bias by Metric</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Metric</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Q1 Bias %</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Q2 Bias %</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Q3 Bias %</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Q4 Bias %</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Avg Bias %</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {biasAnalysis.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.metric}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${row.q1Bias > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {row.q1Bias > 0 ? '+' : ''}{row.q1Bias}%
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${row.q2Bias > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {row.q2Bias > 0 ? '+' : ''}{row.q2Bias}%
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${row.q3Bias > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {row.q3Bias > 0 ? '+' : ''}{row.q3Bias}%
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${row.q4Bias > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {row.q4Bias > 0 ? '+' : ''}{row.q4Bias}%
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${Math.abs(row.avgBias) > 1 ? (row.avgBias > 0 ? 'text-amber-600' : 'text-blue-600') : 'text-green-600'}`}>
                        {row.avgBias > 0 ? '+' : ''}{row.avgBias}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          row.direction === 'Optimistic' ? 'bg-amber-100 text-amber-700' :
                          row.direction === 'Conservative' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {row.direction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                <div className="text-sm font-bold mb-2" style={{ color: '#006747' }}>Bias Interpretation</div>
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-700">
                  <div>
                    <div className="font-semibold text-amber-800 mb-1">Optimistic Bias (Overforecasting)</div>
                    <div>Revenue: +0.7% avg bias. Consistently forecasting slightly higher than actual. Consider tempering growth assumptions.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Conservative Bias (Underforecasting)</div>
                    <div>NII: -1.4% avg bias. Systematically conservative on interest income. May be missing upside opportunities.</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-800 mb-1">Neutral/Improving</div>
                    <div>Expenses: +0.2% avg bias (neutral). Client Growth improving from conservative to optimistic (trend improving).</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accuracy by Dimension */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Forecast Accuracy by Dimension (Latest Period)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={accuracyByDimension}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="dimension" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} domain={[95, 100]} />
                  <Tooltip />
                  <ReferenceLine y={99} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Target: 99%', fontSize: 10, fill: '#10b981' }} />
                  <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                    {accuracyByDimension.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.accuracy >= 99 ? '#10b981' : entry.accuracy >= 98 ? '#3b82f6' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Full Year Outlook Tab */}
        <TabsContent value="outlook">
          <div className="space-y-6">
            {/* Full Year Forecast */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>2025 Full Year Outlook</h3>
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Metric</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Budget</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Latest Forecast</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Prior Forecast</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">Implied Run Rate</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-700">vs Budget</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fullYearOutlook.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.metric}</td>
                      <td className="px-4 py-3 text-right text-gray-900">${row.budget}M</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600">${row.latestForecast}M</td>
                      <td className="px-4 py-3 text-right text-gray-600">${row.priorForecast}M</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">${row.implied}M</td>
                      <td className="px-4 py-3 text-right font-semibold" style={{
                        color: row.latestForecast > row.budget ? '#10b981' : '#ef4444'
                      }}>
                        {row.latestForecast > row.budget ? '+' : ''}{row.latestForecast - row.budget}M
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.status === 'Beat' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="font-bold text-green-900 mb-2 text-sm">Upside to Budget</div>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>• Revenue: +$75M upside driven by client wins momentum</li>
                    <li>• OpEx: -$65M savings from efficiency and automation</li>
                    <li>• Economic Profit: +$110M ahead of budget plan</li>
                    <li>• Confidence: High - based on strong YTD performance</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-red-50">
                  <div className="font-bold text-red-900 mb-2 text-sm">Risks to Forecast</div>
                  <ul className="space-y-1 text-xs text-red-800">
                    <li>• NII: -$25M shortfall risk from rate environment</li>
                    <li>• Market volatility could impact AUM-based fees</li>
                    <li>• Client retention risk in competitive environment</li>
                    <li>• Regulatory changes may impact costs (Basel III)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Forecast Revisions History */}
            <div className="rounded-2xl p-6 shadow-lg" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
              border: '1px solid rgba(0, 77, 53, 0.08)'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#006747' }}>Forecast Revision History (2025)</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">January 2025 Revision</span>
                    <span className="text-xs text-gray-600">Most Recent</span>
                  </div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div>• Revenue: Increased from $5,485M to $5,525M (+$40M) due to strong client pipeline</div>
                    <div>• NII: Decreased from $930M to $920M (-$10M) due to faster rate cuts</div>
                    <div>• OpEx: Improved from $3,490M to $3,475M (-$15M) from automation benefits</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">October 2024 Revision</span>
                    <span className="text-xs text-gray-600">Q4 2024</span>
                  </div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div>• Revenue: Increased from $5,450M to $5,485M (+$35M)</div>
                    <div>• Expenses: Decreased from $3,525M to $3,490M (-$35M)</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">July 2024 Revision</span>
                    <span className="text-xs text-gray-600">Q3 2024</span>
                  </div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div>• Initial full-year forecast established</div>
                    <div>• Revenue: $5,450M | Expenses: $3,525M | Econ Profit: $1,825M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState } from 'react'
import { getAUCData, getClientMetrics } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import { useTimePeriod } from '../contexts/TimePeriodContext'
import MetricCard from '../components/MetricCard'
import VarianceCard from '../components/VarianceCard'
import TimePeriodSelector from '../components/TimePeriodSelector'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/DataTable'

export default function BusinessPerformance() {
  const aucData = getAUCData()
  const clientData = getClientMetrics()
  const [activeTab, setActiveTab] = useState<'auc' | 'clients' | 'pipeline'>('auc')
  const { comparisonPeriod } = useTimePeriod()

  const getComparisonLabel = () => {
    if (comparisonPeriod === 'Budget') return 'Budget'
    if (comparisonPeriod === 'PY') return 'Prior Year'
    if (comparisonPeriod === 'PP') return 'Prior Period'
    return 'Budget'
  }

  const getComparisonValue = (actual: number, budgetMultiplier: number = 0.98) => {
    if (comparisonPeriod === 'Budget') return actual * budgetMultiplier
    if (comparisonPeriod === 'PY') return actual * 0.92 // 8% growth YoY
    if (comparisonPeriod === 'PP') return actual * 0.95 // 5% growth from prior period
    return actual * budgetMultiplier
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Business Performance</h1>

      {/* Key Metrics with Variance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <VarianceCard
          title="Total AUC"
          actual={aucData.total}
          comparison={getComparisonValue(aucData.total, 0.92)}
          comparisonLabel={getComparisonLabel()}
          format="currency"
          decimals={1}
          favorable="higher"
        />
        <VarianceCard
          title="Net New Business (YTD)"
          actual={aucData.netNewBusiness.netChange}
          comparison={getComparisonValue(aucData.netNewBusiness.netChange, 0.85)}
          comparisonLabel={getComparisonLabel()}
          format="currency"
          decimals={1}
          favorable="higher"
          subtitle={`Won: $${(aucData.netNewBusiness.aucWon / 1_000_000_000).toFixed(0)}B`}
        />
        <VarianceCard
          title="Fee Margin (bps)"
          actual={aucData.feeMargin.basisPoints}
          comparison={comparisonPeriod === 'Budget' ? aucData.feeMargin.target / 1_000_000 : aucData.feeMargin.basisPoints * 0.98}
          comparisonLabel={getComparisonLabel()}
          format="number"
          decimals={1}
          favorable="higher"
          subtitle="Per $1B AUC"
        />
        <VarianceCard
          title="Client Retention Rate"
          actual={clientData.retentionRate}
          comparison={comparisonPeriod === 'Budget' ? 95.0 : clientData.retentionRate * 0.99}
          comparisonLabel={getComparisonLabel()}
          format="percentage"
          decimals={1}
          favorable="higher"
          subtitle="Target: 95%"
        />
      </div>

      {/* Tabs */}
      <div className="metric-card mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('auc')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'auc'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assets Under Custody
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Client Metrics
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pipeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pipeline & Wins
            </button>
          </nav>
        </div>

        {/* AUC Tab */}
        {activeTab === 'auc' && (
          <div className="pt-6">
            {/* Net New Business Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Net New Business Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="text-xs text-green-700 mb-1">AUC Won (YTD)</div>
                  <div className="text-2xl font-bold text-green-900">
                    ${(aucData.netNewBusiness.aucWon / 1_000_000_000).toFixed(0)}B
                  </div>
                </div>
                <div className="metric-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <div className="text-xs text-red-700 mb-1">AUC Lost (YTD)</div>
                  <div className="text-2xl font-bold text-red-900">
                    ${(aucData.netNewBusiness.aucLost / 1_000_000_000).toFixed(0)}B
                  </div>
                </div>
                <div className="metric-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="text-xs text-blue-700 mb-1">Net New (YTD)</div>
                  <div className="text-2xl font-bold text-blue-900">
                    ${(aucData.netNewBusiness.netChange / 1_000_000_000).toFixed(0)}B
                  </div>
                  <div className="text-xs text-blue-700 mt-1">Target: $300-500B</div>
                </div>
                <div className="metric-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="text-xs text-purple-700 mb-1">Win Rate</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {((aucData.netNewBusiness.aucWon / (aucData.netNewBusiness.aucWon + aucData.netNewBusiness.aucLost)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Quarterly NNB Trend */}
              <div className="mt-4">
                <div className="grid grid-cols-4 gap-4">
                  {aucData.netNewBusiness.quarterly.map((q) => (
                    <div key={q.quarter} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-600 mb-2">{q.quarter}</div>
                      <div className="text-sm text-gray-700">
                        <div>Won: ${(q.won / 1_000_000_000).toFixed(0)}B</div>
                        <div>Lost: ${(q.lost / 1_000_000_000).toFixed(0)}B</div>
                        <div className="font-bold text-blue-600 mt-1">
                          Net: ${(q.net / 1_000_000_000).toFixed(0)}B
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AUC Growth Metrics */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">AUC Growth Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                  title="YoY Growth"
                  value={aucData.change.yearly}
                  format="percentage"
                  decimals={1}
                  subtitle="Year-over-year growth"
                />
                <MetricCard
                  title="Monthly Change"
                  value={aucData.change.monthly}
                  format="percentage"
                  decimals={2}
                  subtitle="Month-over-month"
                />
                <MetricCard
                  title="Fee Margin (bps)"
                  value={aucData.feeMargin.basisPoints}
                  format="number"
                  decimals={1}
                  subtitle="Revenue per $1B AUC"
                />
                <MetricCard
                  title="Revenue per $1B AUC"
                  value={aucData.feeMargin.revenuePerBillionAUC}
                  format="currency"
                  decimals={2}
                  subtitle={`Target: $${(aucData.feeMargin.target / 1_000_000).toFixed(1)}M`}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">AUC Trend</h3>
                <TimePeriodSelector compact showComparison={false} />
              </div>
              <LineChart
                data={aucData.timeSeries}
                lines={[{ dataKey: 'value', name: 'AUC', color: '#14b8a6' }]}
                xAxisKey="date"
                height={300}
                valueFormatter={(value) => formatCurrency(value, 2)}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">AUC by Asset Class</h3>
                <BarChart
                  data={aucData.byAssetClass}
                  bars={[{ dataKey: 'value', name: 'AUC', color: '#0ea5e9' }]}
                  xAxisKey="class"
                  height={300}
                  valueFormatter={(value) => formatCurrency(value, 1)}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">AUC by Region</h3>
                <BarChart
                  data={aucData.byRegion}
                  bars={[{ dataKey: 'value', name: 'AUC', color: '#06b6d4' }]}
                  xAxisKey="region"
                  height={300}
                  valueFormatter={(value) => formatCurrency(value, 1)}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">AUC by Client Segment</h3>
              <BarChart
                data={aucData.byClientSegment}
                bars={[{ dataKey: 'value', name: 'AUC', color: '#10b981' }]}
                xAxisKey="segment"
                height={300}
                valueFormatter={(value) => formatCurrency(value, 1)}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Top 20 Clients by AUC</h3>
              <DataTable
                columns={[
                  { header: '#', accessor: 'rank', format: (_, __, idx) => String((idx || 0) + 1) },
                  { header: 'Client', accessor: 'clientName' },
                  {
                    header: 'AUC',
                    accessor: 'auc',
                    format: (v: number) => formatCurrency(v, 2),
                  },
                  {
                    header: '% of Total',
                    accessor: 'percentage',
                    format: (v: number) => `${v.toFixed(2)}%`,
                  },
                ]}
                data={aucData.topClients}
              />
            </div>
          </div>
        )}

        {/* Client Metrics Tab */}
        {activeTab === 'clients' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <MetricCard
                title="Client Retention Rate"
                value={clientData.retentionRate}
                format="percentage"
                decimals={1}
                subtitle="12-month retention"
              />
              <MetricCard
                title="Client Churn Rate"
                value={clientData.churnRate}
                format="percentage"
                decimals={1}
                subtitle="12-month churn"
              />
              <MetricCard
                title="New Clients (YTD)"
                value={clientData.newClients}
                format="number"
                decimals={0}
              />
              <MetricCard
                title="Lost Clients (YTD)"
                value={clientData.lostClients}
                format="number"
                decimals={0}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Client Growth Trend
                  </h3>
                  <TimePeriodSelector compact showComparison={false} />
                </div>
                <LineChart
                  data={clientData.clientGrowth}
                  lines={[{ dataKey: 'value', name: 'Total Clients', color: '#0ea5e9' }]}
                  xAxisKey="date"
                  height={300}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Client Economics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Average Revenue per Client</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(clientData.averageRevenuePerClient, 2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Annual basis</div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-3">Client Acquisition</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">New Clients (YTD)</span>
                        <span className="text-lg font-bold text-green-600">+{clientData.newClients}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lost Clients (YTD)</span>
                        <span className="text-lg font-bold text-red-600">-{clientData.lostClients}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-900">Net Change</span>
                        <span className="text-lg font-bold text-blue-600">
                          +{clientData.newClients - clientData.lostClients}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Retention Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="text-lg font-bold text-green-600">{clientData.retentionRate}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${clientData.retentionRate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Industry benchmark: 94%</div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-3">Key Insights</div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Retention rate 3.8 percentage points above industry average</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>Strong net client growth of {clientData.newClients - clientData.lostClients} YTD</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Focus on high-value client segments driving AUC growth</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Client Satisfaction Metrics</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">72</div>
                    <div className="text-sm text-gray-600">Net Promoter Score</div>
                    <div className="text-xs text-gray-500 mt-1">Out of 100</div>
                  </div>

                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 mb-2">97.8%</div>
                    <div className="text-sm text-gray-600">Client Retention</div>
                    <div className="text-xs text-gray-500 mt-1">Industry leading</div>
                  </div>

                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-4xl font-bold text-purple-600 mb-2">4.2</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                    <div className="text-xs text-gray-500 mt-1">Hours for inquiries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="pt-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pipeline & Wins</h3>
              <p className="text-gray-600 max-w-lg mx-auto">
                Sales pipeline tracking, win/loss analysis, and new business opportunities.
                Connect to CRM and sales systems for real-time pipeline visibility.
              </p>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-lg mx-auto">
                <div className="text-sm text-blue-800">
                  <strong>Coming Soon:</strong> Track $250B+ pipeline across 85 opportunities with win rate analytics
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

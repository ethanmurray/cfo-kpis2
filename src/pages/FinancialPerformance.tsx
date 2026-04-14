import { useState } from 'react'
import { getRevenueData, getProfitabilityData, getSegmentPnLData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import { useTimePeriod } from '../contexts/TimePeriodContext'
import LineChart from '../components/charts/LineChart'
import PieChart from '../components/charts/PieChart'
import DataTable from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import VarianceCard from '../components/VarianceCard'
import VarianceAnalysisTable from '../components/VarianceAnalysisTable'
import TimePeriodSelector from '../components/TimePeriodSelector'

export default function FinancialPerformance() {
  const revenueData = getRevenueData()
  const profitData = getProfitabilityData()
  const segmentData = getSegmentPnLData()
  const [activeTab, setActiveTab] = useState<'income' | 'profitability' | 'revenue' | 'segments'>('income')
  const { comparisonPeriod } = useTimePeriod()

  const pieData = revenueData.byCategory.map((cat) => ({
    name: cat.category,
    value: cat.actual,
  }))

  // Calculate budget values (8% higher for revenue, 10% higher for expenses as targets)
  const revenueBudget = profitData.totalRevenue * 0.98 // Budget was 2% higher than actual
  const netIncomeBudget = profitData.netIncome * 1.05 // Budget was 5% lower than actual (favorable)
  const roeBudget = 15.0 // Target ROE
  const compRatioBudget = 43.5 // Target compensation ratio midpoint

  const getComparisonLabel = () => {
    if (comparisonPeriod === 'Budget') return 'Budget'
    if (comparisonPeriod === 'PY') return 'Prior Year'
    if (comparisonPeriod === 'PP') return 'Prior Period'
    return 'Budget'
  }

  const getComparisonValue = (actual: number, budgetMultiplier: number = 0.98) => {
    if (comparisonPeriod === 'Budget') return actual * budgetMultiplier
    if (comparisonPeriod === 'PY') return actual * 0.95 // Assume 5% growth YoY
    if (comparisonPeriod === 'PP') return actual * 0.97 // Assume 3% growth from prior period
    return actual * budgetMultiplier
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Performance</h1>

      {/* Variance Analysis - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <VarianceCard
          title="Total Revenue (YTD)"
          actual={profitData.totalRevenue}
          comparison={getComparisonValue(profitData.totalRevenue, 0.98)}
          comparisonLabel={getComparisonLabel()}
          format="currency"
          decimals={1}
          favorable="higher"
        />
        <VarianceCard
          title="Net Income"
          actual={profitData.netIncome}
          comparison={getComparisonValue(profitData.netIncome, 0.95)}
          comparisonLabel={getComparisonLabel()}
          format="currency"
          decimals={1}
          favorable="higher"
        />
        <VarianceCard
          title="ROE"
          actual={profitData.roe}
          comparison={comparisonPeriod === 'Budget' ? roeBudget : profitData.roe * 0.96}
          comparisonLabel={getComparisonLabel()}
          format="percentage"
          decimals={1}
          favorable="higher"
          subtitle="Target: 15.0%"
        />
        <VarianceCard
          title="Compensation Ratio"
          actual={profitData.compensationRatio}
          comparison={comparisonPeriod === 'Budget' ? compRatioBudget : profitData.compensationRatio * 1.02}
          comparisonLabel={getComparisonLabel()}
          format="percentage"
          decimals={1}
          favorable="lower"
          subtitle="Target: 42-44%"
        />
      </div>

      {/* Tabs */}
      <div className="metric-card mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('income')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'income'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Income Statement
            </button>
            <button
              onClick={() => setActiveTab('profitability')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profitability'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profitability Metrics
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Revenue Detail
            </button>
            <button
              onClick={() => setActiveTab('segments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'segments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Segment P&L
            </button>
          </nav>
        </div>

        {/* Income Statement Tab */}
        {activeTab === 'income' && (
          <div className="pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quarterly P&L Trend
                </h2>
                <TimePeriodSelector compact showComparison={false} />
              </div>
              <LineChart
                data={profitData.timeSeries}
                lines={[
                  { dataKey: 'revenue', name: 'Revenue', color: '#10b981' },
                  { dataKey: 'expenses', name: 'Expenses', color: '#ef4444' },
                  { dataKey: 'preTaxIncome', name: 'Pre-Tax Income', color: '#0ea5e9' },
                ]}
                xAxisKey="date"
                height={350}
                valueFormatter={(value) => formatCurrency(value, 1)}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Income Statement Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(profitData.totalRevenue, 2)}
                  </span>
                </div>
                <div className="pl-4 space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Net Interest Income</span>
                    <span className="text-sm text-gray-900">
                      {formatCurrency(profitData.netInterestIncome, 2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Non-Interest Income</span>
                    <span className="text-sm text-gray-900">
                      {formatCurrency(profitData.nonInterestIncome, 2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Operating Expenses</span>
                  <span className="text-sm font-bold text-red-600">
                    ({formatCurrency(profitData.operatingExpenses, 2)})
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 bg-blue-50 px-4 rounded-lg">
                  <span className="text-base font-semibold text-gray-900">Pre-Tax Income</span>
                  <span className="text-base font-bold text-blue-600">
                    {formatCurrency(profitData.preTaxIncome, 2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profitability Metrics Tab */}
        {activeTab === 'profitability' && (
          <div className="pt-6">
            {/* Shareholder Metrics */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Shareholder Value Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="metric-card">
                  <div className="text-xs text-gray-500 mb-1">Adjusted EPS (TTM)</div>
                  <div className="text-2xl font-bold text-gray-900">${profitData.eps.adjusted.toFixed(2)}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Consensus: ${profitData.eps.consensusEstimate.toFixed(2)}
                  </div>
                  <div className={`text-xs mt-1 ${profitData.eps.surprise > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitData.eps.surprise > 0 ? '+' : ''}{profitData.eps.surprise.toFixed(1)}% surprise
                  </div>
                </div>
                <div className="metric-card">
                  <div className="text-xs text-gray-500 mb-1">Tangible Book Value/Share</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${profitData.bookValue.tangibleBookValuePerShare.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Price/TBV: 0.68x
                  </div>
                </div>
                <div className="metric-card">
                  <div className="text-xs text-gray-500 mb-1">Effective Tax Rate</div>
                  <div className="text-2xl font-bold text-gray-900">{profitData.effectiveTaxRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Statutory: 21.0%
                  </div>
                </div>
                <div className="metric-card">
                  <div className="text-xs text-gray-500 mb-1">Shares Outstanding</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(profitData.sharesOutstanding / 1_000_000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Diluted basis
                  </div>
                </div>
              </div>
            </div>

            {/* Return Metrics */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Return Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Return on Equity (ROE)"
                  value={profitData.roe}
                  format="percentage"
                  decimals={1}
                  subtitle="Target: 15.0%"
                />
                <MetricCard
                  title="Return on Assets (ROA)"
                  value={profitData.roa}
                  format="percentage"
                  decimals={2}
                  subtitle="Target: 1.0%"
                />
                <MetricCard
                  title="Pre-Tax Margin"
                  value={profitData.margins.preTaxMargin}
                  format="percentage"
                  decimals={1}
                />
                <MetricCard
                  title="Net Margin"
                  value={profitData.margins.netMargin}
                  format="percentage"
                  decimals={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Key Ratios</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Pre-Tax Margin</span>
                      <span className="text-lg font-bold text-gray-900">
                        {profitData.margins.preTaxMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${profitData.margins.preTaxMargin}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Return on Equity (ROE)</span>
                      <span className="text-lg font-bold text-gray-900">{profitData.roe}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(profitData.roe / 20) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Target: 15%</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Return on Assets (ROA)</span>
                      <span className="text-lg font-bold text-gray-900">{profitData.roa}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(profitData.roa / 2) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Target: 1.0%</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Strong Revenue Growth</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Non-interest income up 4.5% YoY driven by custody fees
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Margin Improvement</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Pre-tax margin improved 80 bps quarter-over-quarter
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="mt-0.5">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">ROE Below Target</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Current 13.8% vs target 15%, focus on revenue optimization
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Detail Tab */}
        {activeTab === 'revenue' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Revenue Trend</h3>
                  <TimePeriodSelector compact showComparison={false} />
                </div>
                <LineChart
                  data={revenueData.timeSeries}
                  lines={[{ dataKey: 'value', name: 'Revenue', color: '#0ea5e9' }]}
                  xAxisKey="date"
                  height={300}
                  valueFormatter={(value) => formatCurrency(value, 1)}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                <PieChart
                  data={pieData}
                  height={300}
                  valueFormatter={(value) => formatCurrency(value, 1)}
                />
              </div>
            </div>

            {/* Variance Analysis Table */}
            <div className="mb-6">
              <VarianceAnalysisTable
                title="Revenue Variance Analysis by Category"
                comparisonLabel={getComparisonLabel()}
                rows={revenueData.byCategory.map(cat => ({
                  category: cat.category,
                  actual: cat.actual,
                  comparison: comparisonPeriod === 'Budget' ? cat.budget :
                             comparisonPeriod === 'PY' ? cat.priorYear :
                             cat.actual * 0.97,
                  favorable: 'higher' as const,
                }))}
                format="currency"
                decimals={1}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Revenue Performance by Category
              </h3>
              <DataTable
                columns={[
                  { header: 'Category', accessor: 'category' },
                  { header: 'Actual', accessor: 'actual', format: (v: number) => formatCurrency(v, 1) },
                  { header: 'Budget', accessor: 'budget', format: (v: number) => formatCurrency(v, 1) },
                  { header: 'Prior Year', accessor: 'priorYear', format: (v: number) => formatCurrency(v, 1) },
                  {
                    header: 'vs Budget',
                    accessor: 'budget',
                    format: (v: number, row: any) => {
                      const variance = ((row.actual - v) / v) * 100
                      return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`
                    },
                  },
                ]}
                data={revenueData.byCategory}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Top 10 Clients by Revenue</h3>
              <DataTable
                columns={[
                  { header: 'Client', accessor: 'clientName' },
                  {
                    header: 'Revenue',
                    accessor: 'revenue',
                    format: (v: number) => formatCurrency(v, 2),
                  },
                  {
                    header: '% of Total',
                    accessor: 'percentage',
                    format: (v: number) => `${v.toFixed(2)}%`,
                  },
                ]}
                data={revenueData.topClients}
              />
            </div>
          </div>
        )}

        {/* Segment P&L Tab */}
        {activeTab === 'segments' && (
          <div className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Segment Performance</h2>

            {/* Segment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {segmentData.segments.map((segment, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{segment.name}</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(segment.revenue, 1)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Expenses</span>
                      <span className="text-sm text-red-600">({formatCurrency(segment.expenses, 1)})</span>
                    </div>

                    <div className="flex justify-between items-center py-2 bg-blue-50 px-3 rounded">
                      <span className="text-sm font-semibold text-gray-900">Pre-Tax Income</span>
                      <span className="text-sm font-bold text-blue-600">{formatCurrency(segment.preTaxIncome, 1)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">ROE</div>
                      <div className={`text-lg font-bold ${segment.roe >= 13 ? 'text-green-600' : 'text-gray-900'}`}>
                        {segment.roe.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Efficiency Ratio</div>
                      <div className={`text-lg font-bold ${segment.efficiencyRatio < 70 ? 'text-green-600' : 'text-gray-900'}`}>
                        {segment.efficiencyRatio.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Headcount</div>
                      <div className="text-lg font-bold text-gray-900">{segment.headcount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Revenue Growth</div>
                      <div className={`text-lg font-bold ${segment.revenueGrowth > 4 ? 'text-green-600' : 'text-gray-900'}`}>
                        {segment.revenueGrowth.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Segment Comparison Table */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Segment Comparison</h3>
              <DataTable
                columns={[
                  { header: 'Segment', accessor: 'name' },
                  {
                    header: 'Revenue',
                    accessor: 'revenue',
                    format: (v: number) => formatCurrency(v, 1),
                  },
                  {
                    header: 'Pre-Tax Income',
                    accessor: 'preTaxIncome',
                    format: (v: number) => formatCurrency(v, 1),
                  },
                  {
                    header: 'Pre-Tax Margin',
                    accessor: 'preTaxIncome',
                    format: (v: number, row: any) => `${((v / row.revenue) * 100).toFixed(1)}%`,
                  },
                  {
                    header: 'ROE',
                    accessor: 'roe',
                    format: (v: number) => `${v.toFixed(1)}%`,
                  },
                  {
                    header: 'Efficiency Ratio',
                    accessor: 'efficiencyRatio',
                    format: (v: number) => `${v.toFixed(1)}%`,
                  },
                  {
                    header: 'Revenue Growth',
                    accessor: 'revenueGrowth',
                    format: (v: number) => `${v.toFixed(1)}%`,
                  },
                ]}
                data={segmentData.segments}
              />
            </div>

            {/* Segment Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Top Performing Segment</h3>
                <p className="text-sm text-green-800">
                  <strong>C&IS (Corporate & Institutional Services)</strong> leads with 15.2% ROE and 64.5% efficiency ratio.
                  Strong revenue growth of 5.2% driven by new client wins and market appreciation. Generates 58% of total revenue
                  with best-in-class operating leverage.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">Areas for Improvement</h3>
                <p className="text-sm text-yellow-800">
                  <strong>Asset Management</strong> segment showing 8.5% ROE and 92.8% efficiency ratio. Focus needed on
                  expense management and revenue growth (currently 2.1% vs. 5.2% for C&IS). Consider strategic alternatives
                  or operational restructuring to improve returns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

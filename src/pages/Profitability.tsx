import { getProfitabilityData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/charts/LineChart'

export default function Profitability() {
  const data = getProfitabilityData()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profitability & Financial Health</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Revenue"
          value={data.totalRevenue}
          format="currency"
          decimals={2}
        />
        <MetricCard
          title="Operating Expenses"
          value={data.operatingExpenses}
          format="currency"
          decimals={2}
        />
        <MetricCard
          title="Pre-Tax Income"
          value={data.preTaxIncome}
          format="currency"
          decimals={2}
        />
        <MetricCard
          title="Pre-Tax Margin"
          value={data.margins.preTaxMargin}
          format="percentage"
          decimals={1}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Net Interest Income"
          value={data.netInterestIncome}
          format="currency"
          decimals={2}
        />
        <MetricCard
          title="Non-Interest Income"
          value={data.nonInterestIncome}
          format="currency"
          decimals={2}
        />
        <MetricCard
          title="Return on Equity (ROE)"
          value={data.roe}
          format="percentage"
          decimals={1}
        />
        <MetricCard
          title="Return on Assets (ROA)"
          value={data.roa}
          format="percentage"
          decimals={2}
        />
      </div>

      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quarterly Profitability Trend
        </h2>
        <LineChart
          data={data.timeSeries}
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

      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Income Statement Summary</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total Revenue</span>
            <span className="text-sm font-bold text-gray-900">
              {formatCurrency(data.totalRevenue, 2)}
            </span>
          </div>
          <div className="pl-4 space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Net Interest Income</span>
              <span className="text-sm text-gray-900">
                {formatCurrency(data.netInterestIncome, 2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Non-Interest Income</span>
              <span className="text-sm text-gray-900">
                {formatCurrency(data.nonInterestIncome, 2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Operating Expenses</span>
            <span className="text-sm font-bold text-red-600">
              ({formatCurrency(data.operatingExpenses, 2)})
            </span>
          </div>

          <div className="flex items-center justify-between py-3 bg-blue-50 px-4 rounded-lg">
            <span className="text-base font-semibold text-gray-900">Pre-Tax Income</span>
            <span className="text-base font-bold text-blue-600">
              {formatCurrency(data.preTaxIncome, 2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Ratios</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pre-Tax Margin</span>
                <span className="text-lg font-bold text-gray-900">
                  {data.margins.preTaxMargin.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${data.margins.preTaxMargin}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Return on Equity (ROE)</span>
                <span className="text-lg font-bold text-gray-900">{data.roe}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(data.roe / 20) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: 15%</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Return on Assets (ROA)</span>
                <span className="text-lg font-bold text-gray-900">{data.roa}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${(data.roa / 2) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Target: 1.0%</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Strong Revenue Growth</div>
                <div className="text-xs text-gray-600 mt-1">
                  Non-interest income up 4.2% YoY driven by custody fees
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
                  Pre-tax margin improved 120 bps quarter-over-quarter
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
                  Current 14.2% vs target 15%, focus on revenue optimization
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

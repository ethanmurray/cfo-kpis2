import { getClientMetrics } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/charts/LineChart'

export default function ClientMetrics() {
  const data = getClientMetrics()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Client Metrics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Client Retention Rate"
          value={data.retentionRate}
          format="percentage"
          decimals={1}
          subtitle="12-month retention"
        />
        <MetricCard
          title="Client Churn Rate"
          value={data.churnRate}
          format="percentage"
          decimals={1}
          subtitle="12-month churn"
        />
        <MetricCard
          title="New Clients (YTD)"
          value={data.newClients}
          format="number"
          decimals={0}
        />
        <MetricCard
          title="Lost Clients (YTD)"
          value={data.lostClients}
          format="number"
          decimals={0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Client Growth Trend (24 Months)
          </h2>
          <LineChart
            data={data.clientGrowth}
            lines={[{ dataKey: 'value', name: 'Total Clients', color: '#0ea5e9' }]}
            xAxisKey="date"
            height={300}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Economics</h2>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Average Revenue per Client</div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(data.averageRevenuePerClient, 2)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Annual basis</div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">Client Acquisition</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Clients (YTD)</span>
                  <span className="text-lg font-bold text-green-600">+{data.newClients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lost Clients (YTD)</span>
                  <span className="text-lg font-bold text-red-600">-{data.lostClients}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Net Change</span>
                  <span className="text-lg font-bold text-blue-600">
                    +{data.newClients - data.lostClients}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Retention Analysis</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="text-lg font-bold text-green-600">{data.retentionRate}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${data.retentionRate}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Industry benchmark: 94%</div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">Key Insights</div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Retention rate 2.5 percentage points above industry average</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Strong net client growth of {data.newClients - data.lostClients} YTD</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Focus on high-value client segments driving AUC growth</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Segments</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Pension Funds</span>
                <span className="text-sm font-bold text-blue-600">40%</span>
              </div>
              <div className="text-xs text-gray-600">
                Largest segment by AUC, strong retention at 98%
              </div>
            </div>

            <div className="p-4 bg-cyan-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Asset Managers</span>
                <span className="text-sm font-bold text-cyan-600">30%</span>
              </div>
              <div className="text-xs text-gray-600">
                Growing segment, 12 new clients YTD
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Insurance Companies</span>
                <span className="text-sm font-bold text-teal-600">20%</span>
              </div>
              <div className="text-xs text-gray-600">
                Stable base with long-term relationships
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Sovereign Wealth</span>
                <span className="text-sm font-bold text-emerald-600">10%</span>
              </div>
              <div className="text-xs text-gray-600">
                High-value segment, focus on service excellence
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Satisfaction Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">8.7</div>
            <div className="text-sm text-gray-600">Net Promoter Score</div>
            <div className="text-xs text-gray-500 mt-1">Out of 10</div>
          </div>

          <div className="text-center p-4 border-l border-r border-gray-200">
            <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Service Quality Rating</div>
            <div className="text-xs text-gray-500 mt-1">Client surveys</div>
          </div>

          <div className="text-center p-4">
            <div className="text-4xl font-bold text-purple-600 mb-2">4.2</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
            <div className="text-xs text-gray-500 mt-1">Hours for inquiries</div>
          </div>
        </div>
      </div>
    </div>
  )
}

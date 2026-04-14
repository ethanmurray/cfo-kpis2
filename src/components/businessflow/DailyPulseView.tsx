import { useMemo } from 'react'
import { generateDailyPulseData } from '../../data/businessFlowData'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../../utils/dataGenerators'

export default function DailyPulseView() {
  const pulseData = useMemo(() => generateDailyPulseData(), [])

  const materialMovers = pulseData.filter(item => item.isMaterial)
  const positiveMovers = pulseData.filter(item => item.changePercent > 0)
  const negativeMovers = pulseData.filter(item => item.changePercent < 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Material Movers</div>
          <div className="text-2xl font-bold text-gray-900">{materialMovers.length}</div>
          <div className="text-xs text-gray-500 mt-1">Change &gt; 15%</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Positive Changes</div>
          <div className="text-2xl font-bold text-green-600">{positiveMovers.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Negative Changes</div>
          <div className="text-2xl font-bold text-red-600">{negativeMovers.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Avg Change</div>
          <div className={`text-2xl font-bold ${
            pulseData.reduce((sum, item) => sum + item.changePercent, 0) / pulseData.length > 0
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {(pulseData.reduce((sum, item) => sum + item.changePercent, 0) / pulseData.length).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Today vs Yesterday Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Pulse: Today vs Yesterday (Ranked by Change %)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yesterday
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change ($)
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change (%)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pulseData.map((item, index) => (
                <tr
                  key={index}
                  className={`${item.isMaterial ? 'bg-amber-50' : ''} hover:bg-gray-50`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {item.isMaterial && (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                      {item.category}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(item.yesterday, 0)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.today, 0)}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? '+' : ''}{formatCurrency(item.change, 0)}
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold text-right ${
                    item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {item.changePercent > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : item.changePercent < 0 ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : null}
                      {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.isMaterial ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                        Material
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Movers Detail */}
      {materialMovers.length > 0 && (
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Material Movers Detail
          </h2>
          <div className="space-y-3">
            {materialMovers.map((item, index) => (
              <div
                key={index}
                className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Moved from {formatCurrency(item.yesterday, 0)} to {formatCurrency(item.today, 0)}
                    </div>
                  </div>
                  <div className={`text-right ${
                    item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="text-2xl font-bold">
                      {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                    </div>
                    <div className="text-sm">
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change, 0)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• {materialMovers.length} categories showing material changes (&gt;15% day-over-day)</li>
          <li>• {positiveMovers.length} positive movements vs {negativeMovers.length} negative movements</li>
          <li>• Monitor material movers for operational issues or client-driven changes</li>
          <li>• Cross-reference with client activity alerts for root cause analysis</li>
        </ul>
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { generateForecastMetrics } from '../../data/forecastData'
import WaterfallChart from '../charts/WaterfallChart'
import { formatCurrency } from '../../utils/dataGenerators'

export default function DriversView() {
  const [selectedMetric, setSelectedMetric] = useState<'deposits' | 'loans' | 'nii' | 'lcr' | 'cet1'>('nii')

  const forecast = useMemo(() => generateForecastMetrics(selectedMetric, '12W'), [selectedMetric])

  const startValue = forecast.forecast[0].base
  const endValue = forecast.forecast[forecast.forecast.length - 1].base
  const totalChange = endValue - startValue

  // Build waterfall data
  const waterfallData = [
    { name: 'Starting Value', value: startValue, isTotal: true },
    ...forecast.drivers.map(d => ({
      name: d.driver,
      value: d.contribution
    })),
    { name: 'Ending Value', value: endValue, isTotal: true }
  ]

  const valueFormatter = (v: number) => {
    if (selectedMetric === 'lcr' || selectedMetric === 'cet1') {
      return `${v.toFixed(2)}%`
    }
    return formatCurrency(v, 0)
  }

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <div className="metric-card">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
        <div className="flex gap-2 flex-wrap">
          {(['deposits', 'loans', 'nii', 'lcr', 'cet1'] as const).map(metric => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metric.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Starting Value</div>
          <div className="text-2xl font-bold text-gray-900">
            {valueFormatter(startValue)}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Ending Value (12W)</div>
          <div className="text-2xl font-bold text-blue-600">
            {valueFormatter(endValue)}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Change</div>
          <div className={`text-2xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalChange >= 0 ? '+' : ''}{valueFormatter(totalChange)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((totalChange / startValue) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Decomposition (Waterfall)</h2>
        <WaterfallChart
          data={waterfallData}
          height={450}
          valueFormatter={valueFormatter}
        />
      </div>

      {/* Driver Details Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Contributions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Contribution</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total Change</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Start Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forecast.drivers
                .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
                .map((driver, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{driver.driver}</td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${
                      driver.contribution >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {driver.contribution >= 0 ? '+' : ''}{valueFormatter(driver.contribution)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {driver.percentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {((driver.contribution / startValue) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3 text-sm text-gray-900">Total</td>
                <td className={`px-4 py-3 text-sm text-right ${
                  totalChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalChange >= 0 ? '+' : ''}{valueFormatter(totalChange)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">100.0%</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {((totalChange / startValue) * 100).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Assumptions */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Assumptions (Base Case)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Rate Environment</div>
            <div className="font-medium text-gray-900">Stable (0 bps shock)</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Deposit Dynamics</div>
            <div className="font-medium text-gray-900">Normal (0% runoff)</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Loan Growth</div>
            <div className="font-medium text-gray-900">5% annual</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Market Conditions</div>
            <div className="font-medium text-gray-900">Stable spreads</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Top driver contributes {Math.abs(forecast.drivers[0].percentage).toFixed(0)}% of total change</li>
            <li>• {forecast.drivers.filter(d => d.contribution > 0).length} positive drivers, {forecast.drivers.filter(d => d.contribution < 0).length} negative drivers</li>
            <li>• Forecast based on {forecast.modelMetadata.type} with {forecast.modelMetadata.trainingWindow} training window</li>
            <li>• Drivers are estimated based on historical relationships and current trends</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

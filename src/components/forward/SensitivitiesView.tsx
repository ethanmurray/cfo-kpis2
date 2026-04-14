import { useState, useMemo } from 'react'
import { generateForecastMetrics } from '../../data/forecastData'
import TornadoChart from '../charts/TornadoChart'
import { formatCurrency } from '../../utils/dataGenerators'

export default function SensitivitiesView() {
  const [selectedMetric, setSelectedMetric] = useState<'deposits' | 'loans' | 'nii' | 'lcr' | 'cet1'>('nii')

  const forecast = useMemo(() => generateForecastMetrics(selectedMetric, '12W'), [selectedMetric])

  const baseCase = forecast.forecast[forecast.forecast.length - 1].base

  // Transform sensitivities for tornado chart
  const tornadoData = forecast.sensitivities.map(s => ({
    parameter: s.parameter,
    low: baseCase - Math.abs(s.impact < 0 ? s.impact : 0),
    high: baseCase + Math.abs(s.impact > 0 ? s.impact : 0),
    impact: Math.abs(s.impact)
  }))

  const valueFormatter = (v: number) => {
    if (selectedMetric === 'lcr' || selectedMetric === 'cet1') {
      return `${v.toFixed(1)}%`
    }
    return formatCurrency(v, 0)
  }

  // Calculate overall risk metrics
  const maxDownside = Math.min(...forecast.sensitivities.map(s => s.impact))
  const maxUpside = Math.max(...forecast.sensitivities.map(s => s.impact))
  const totalRange = maxUpside - maxDownside

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Base Case (12W)</div>
          <div className="text-2xl font-bold text-gray-900">
            {valueFormatter(baseCase)}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Maximum Upside</div>
          <div className="text-2xl font-bold text-green-600">
            +{valueFormatter(Math.abs(maxUpside))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((maxUpside / baseCase) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Maximum Downside</div>
          <div className="text-2xl font-bold text-red-600">
            {valueFormatter(maxDownside)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((maxDownside / baseCase) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Range</div>
          <div className="text-2xl font-bold text-gray-900">
            {valueFormatter(Math.abs(totalRange))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {((Math.abs(totalRange) / baseCase) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Tornado Chart */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sensitivity Analysis (Tornado Chart)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Impact on {selectedMetric.toUpperCase()} from key parameter changes. Sorted by magnitude of impact.
        </p>
        <TornadoChart
          data={tornadoData}
          baseCase={baseCase}
          height={450}
          valueFormatter={valueFormatter}
        />
      </div>

      {/* Sensitivity Details Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sensitivity Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Impact</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Impact</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Low Scenario</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">High Scenario</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forecast.sensitivities
                .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                .map((sensitivity, index) => {
                  const riskLevel = Math.abs(sensitivity.impactPercent)
                  const riskCategory = riskLevel > 8 ? 'high' : riskLevel > 4 ? 'medium' : 'low'

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {sensitivity.parameter}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium text-right ${
                        sensitivity.impact >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sensitivity.impact >= 0 ? '+' : ''}{valueFormatter(sensitivity.impact)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {sensitivity.impactPercent.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {valueFormatter(baseCase - Math.abs(sensitivity.impact < 0 ? sensitivity.impact : 0))}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {valueFormatter(baseCase + Math.abs(sensitivity.impact > 0 ? sensitivity.impact : 0))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          riskCategory === 'high'
                            ? 'bg-red-100 text-red-800'
                            : riskCategory === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {riskCategory.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Takeaways</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-1">Most Sensitive Parameter</div>
            <div className="text-sm text-gray-700">
              {forecast.sensitivities.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))[0].parameter} has the largest impact
              with {Math.abs(forecast.sensitivities.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))[0].impactPercent).toFixed(1)}%
              potential change
            </div>
          </div>

          <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-1">Upside Potential</div>
            <div className="text-sm text-gray-700">
              Best case scenario could increase {selectedMetric.toUpperCase()} by up to {valueFormatter(Math.abs(maxUpside))}
              ({((Math.abs(maxUpside) / baseCase) * 100).toFixed(1)}%)
            </div>
          </div>

          <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-1">Downside Risk</div>
            <div className="text-sm text-gray-700">
              Worst case scenario could decrease {selectedMetric.toUpperCase()} by up to {valueFormatter(Math.abs(maxDownside))}
              ({((Math.abs(maxDownside) / baseCase) * 100).toFixed(1)}%)
            </div>
          </div>

          <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded-r-lg">
            <div className="font-medium text-gray-900 mb-1">Risk Management</div>
            <div className="text-sm text-gray-700">
              Monitor high-impact parameters closely and consider hedging strategies for material sensitivities.
              Total range of outcomes: {valueFormatter(Math.abs(totalRange))} ({((Math.abs(totalRange) / baseCase) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Model Type</div>
            <div className="font-medium text-gray-900">{forecast.modelMetadata.type}</div>
          </div>
          <div>
            <div className="text-gray-600">Training Window</div>
            <div className="font-medium text-gray-900">{forecast.modelMetadata.trainingWindow}</div>
          </div>
          <div>
            <div className="text-gray-600">Version</div>
            <div className="font-medium text-gray-900">{forecast.modelMetadata.version}</div>
          </div>
          <div>
            <div className="text-gray-600">Last Updated</div>
            <div className="font-medium text-gray-900">
              {forecast.modelMetadata.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <p>
            Sensitivities are calculated using historical relationships and current market conditions.
            Actual outcomes may vary based on correlation effects and non-linear relationships not captured in the model.
          </p>
        </div>
      </div>
    </div>
  )
}

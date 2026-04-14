import { useState, useMemo } from 'react'
import { generateForecastMetrics } from '../../data/forecastData'
import { ScenarioAssumptions } from '../../types/metrics'
import LineChart from '../charts/LineChart'
import { formatCurrency } from '../../utils/dataGenerators'

export default function ScenariosView() {
  const [selectedMetric, setSelectedMetric] = useState<'deposits' | 'loans' | 'nii' | 'lcr' | 'cet1'>('nii')
  const [customScenario, setCustomScenario] = useState<ScenarioAssumptions>({
    rateShock: 0,
    depositRunoff: 0,
    loanGrowth: 5,
    fundingSpreadWidening: 0,
    capitalActions: {
      dividends: true,
      buybacks: true,
      issuance: false
    }
  })

  // Generate forecast with custom scenario
  const forecast = useMemo(() => {
    const f = generateForecastMetrics(selectedMetric, '12W')
    // Update custom scenario in the forecast
    f.scenarios.custom = customScenario
    return f
  }, [selectedMetric, customScenario])

  const valueFormatter = (v: number) => {
    if (selectedMetric === 'lcr' || selectedMetric === 'cet1') {
      return `${v.toFixed(1)}%`
    }
    return formatCurrency(v, 0)
  }

  const handleSliderChange = (key: keyof ScenarioAssumptions, value: number) => {
    setCustomScenario(prev => ({ ...prev, [key]: value }))
  }

  const handleCapitalActionToggle = (action: 'dividends' | 'buybacks' | 'issuance') => {
    setCustomScenario(prev => ({
      ...prev,
      capitalActions: {
        ...prev.capitalActions,
        [action]: !prev.capitalActions[action]
      }
    }))
  }

  const lines = [
    { dataKey: 'base', name: 'Base Case', color: '#0ea5e9' },
    { dataKey: 'stress', name: 'Stress', color: '#ef4444' },
    { dataKey: 'custom', name: 'Custom', color: '#10b981' }
  ]

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

      {/* Scenario Builder */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Scenario Builder</h2>
        <div className="space-y-6">
          {/* Rate Shock */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Rate Shock (bps)</label>
              <span className="text-sm font-bold text-blue-600">{customScenario.rateShock} bps</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="25"
              value={customScenario.rateShock}
              onChange={(e) => handleSliderChange('rateShock', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-200 bps</span>
              <span>0 bps</span>
              <span>+200 bps</span>
            </div>
          </div>

          {/* Deposit Runoff */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Deposit Runoff (%)</label>
              <span className="text-sm font-bold text-blue-600">{customScenario.depositRunoff}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={customScenario.depositRunoff}
              onChange={(e) => handleSliderChange('depositRunoff', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Loan Growth */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Loan Growth (%)</label>
              <span className="text-sm font-bold text-blue-600">{customScenario.loanGrowth}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="15"
              step="1"
              value={customScenario.loanGrowth}
              onChange={(e) => handleSliderChange('loanGrowth', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-10%</span>
              <span>2.5%</span>
              <span>+15%</span>
            </div>
          </div>

          {/* Funding Spread Widening */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Funding Spread Widening (bps)</label>
              <span className="text-sm font-bold text-blue-600">{customScenario.fundingSpreadWidening} bps</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={customScenario.fundingSpreadWidening}
              onChange={(e) => handleSliderChange('fundingSpreadWidening', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 bps</span>
              <span>50 bps</span>
              <span>100 bps</span>
            </div>
          </div>

          {/* Capital Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Capital Actions</label>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleCapitalActionToggle('dividends')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  customScenario.capitalActions.dividends
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dividends {customScenario.capitalActions.dividends ? '✓' : ''}
              </button>
              <button
                onClick={() => handleCapitalActionToggle('buybacks')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  customScenario.capitalActions.buybacks
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Buybacks {customScenario.capitalActions.buybacks ? '✓' : ''}
              </button>
              <button
                onClick={() => handleCapitalActionToggle('issuance')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  customScenario.capitalActions.issuance
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Issuance {customScenario.capitalActions.issuance ? '✓' : ''}
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setCustomScenario({
                rateShock: 0,
                depositRunoff: 0,
                loanGrowth: 5,
                fundingSpreadWidening: 0,
                capitalActions: { dividends: true, buybacks: true, issuance: false }
              })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Reset to Base
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedMetric.toUpperCase()} - Scenario Comparison (12 Weeks)
        </h2>
        <LineChart
          data={forecast.forecast}
          lines={lines}
          xAxisKey="date"
          height={400}
          valueFormatter={valueFormatter}
        />
      </div>

      {/* Comparison Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scenario Comparison</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Base Case</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stress</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">End Value</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {valueFormatter(forecast.forecast[forecast.forecast.length - 1].base)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {valueFormatter(forecast.forecast[forecast.forecast.length - 1].stress!)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {valueFormatter(forecast.forecast[forecast.forecast.length - 1].custom!)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Change from Start</td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-medium ${
                    ((forecast.forecast[forecast.forecast.length - 1].base - forecast.forecast[0].base) / forecast.forecast[0].base) * 100 >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {((forecast.forecast[forecast.forecast.length - 1].base - forecast.forecast[0].base) / forecast.forecast[0].base * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-medium ${
                    ((forecast.forecast[forecast.forecast.length - 1].stress! - forecast.forecast[0].base) / forecast.forecast[0].base) * 100 >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {((forecast.forecast[forecast.forecast.length - 1].stress! - forecast.forecast[0].base) / forecast.forecast[0].base * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-medium ${
                    ((forecast.forecast[forecast.forecast.length - 1].custom! - forecast.forecast[0].base) / forecast.forecast[0].base) * 100 >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {((forecast.forecast[forecast.forecast.length - 1].custom! - forecast.forecast[0].base) / forecast.forecast[0].base * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">vs Base Case</td>
                <td className="px-4 py-3 text-sm text-gray-500 text-right">—</td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-medium ${
                    (forecast.forecast[forecast.forecast.length - 1].stress! - forecast.forecast[forecast.forecast.length - 1].base) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {valueFormatter(forecast.forecast[forecast.forecast.length - 1].stress! - forecast.forecast[forecast.forecast.length - 1].base)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-medium ${
                    (forecast.forecast[forecast.forecast.length - 1].custom! - forecast.forecast[forecast.forecast.length - 1].base) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {valueFormatter(forecast.forecast[forecast.forecast.length - 1].custom! - forecast.forecast[forecast.forecast.length - 1].base)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

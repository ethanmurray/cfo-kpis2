import { useState, useMemo } from 'react'
import { getAllForecasts } from '../../data/forecastData'
import LineChart from '../charts/LineChart'
import { formatCurrency } from '../../utils/dataGenerators'

type ForecastKey = 'deposits7D' | 'deposits12W' | 'loans12W' | 'nii8Q' | 'lcr7D' | 'cet18Q'

export default function ForecastsView() {
  const [selectedForecast, setSelectedForecast] = useState<ForecastKey>('deposits12W')
  const [showScenarios, setShowScenarios] = useState<('base' | 'stress' | 'custom')[]>(['base', 'stress'])

  const forecasts = useMemo(() => getAllForecasts(), [])
  const currentForecast = forecasts[selectedForecast]

  const forecastOptions: { key: ForecastKey; label: string }[] = [
    { key: 'deposits7D', label: 'Deposits (7 Days)' },
    { key: 'deposits12W', label: 'Deposits (12 Weeks)' },
    { key: 'loans12W', label: 'Loans (12 Weeks)' },
    { key: 'nii8Q', label: 'NII (8 Quarters)' },
    { key: 'lcr7D', label: 'LCR (7 Days)' },
    { key: 'cet18Q', label: 'CET1 Ratio (8 Quarters)' }
  ]

  const toggleScenario = (scenario: 'base' | 'stress' | 'custom') => {
    if (showScenarios.includes(scenario)) {
      setShowScenarios(showScenarios.filter(s => s !== scenario))
    } else {
      setShowScenarios([...showScenarios, scenario])
    }
  }

  const lines = []
  if (showScenarios.includes('base')) {
    lines.push({ dataKey: 'base', name: 'Base Case', color: '#0ea5e9' })
  }
  if (showScenarios.includes('stress')) {
    lines.push({ dataKey: 'stress', name: 'Stress', color: '#ef4444' })
  }
  if (showScenarios.includes('custom')) {
    lines.push({ dataKey: 'custom', name: 'Custom', color: '#10b981' })
  }

  const valueFormatter = (v: number) => {
    if (currentForecast.metric === 'LCR' || currentForecast.metric === 'CET1') {
      return `${v.toFixed(1)}%`
    }
    return formatCurrency(v, 0)
  }

  // Calculate summary stats
  const baseEnd = currentForecast.forecast[currentForecast.forecast.length - 1].base
  const baseStart = currentForecast.forecast[0].base
  const baseGrowth = ((baseEnd - baseStart) / baseStart) * 100

  const stressEnd = currentForecast.forecast[currentForecast.forecast.length - 1].stress!
  const stressGrowth = ((stressEnd - baseStart) / baseStart) * 100

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="metric-card">
        <div className="space-y-4">
          {/* Metric Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric & Horizon</label>
            <div className="flex gap-2 flex-wrap">
              {forecastOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => setSelectedForecast(option.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedForecast === option.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Scenarios</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleScenario('base')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showScenarios.includes('base')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Base Case
              </button>
              <button
                onClick={() => toggleScenario('stress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showScenarios.includes('stress')
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Stress
              </button>
              <button
                onClick={() => toggleScenario('custom')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showScenarios.includes('custom')
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Starting Value</div>
          <div className="text-2xl font-bold text-gray-900">
            {valueFormatter(baseStart)}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Base Case End</div>
          <div className="text-2xl font-bold text-blue-600">
            {valueFormatter(baseEnd)}
          </div>
          <div className={`text-sm mt-1 ${baseGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {baseGrowth >= 0 ? '+' : ''}{baseGrowth.toFixed(1)}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Stress End</div>
          <div className="text-2xl font-bold text-red-600">
            {valueFormatter(stressEnd)}
          </div>
          <div className={`text-sm mt-1 ${stressGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stressGrowth >= 0 ? '+' : ''}{stressGrowth.toFixed(1)}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Stress Impact</div>
          <div className={`text-2xl font-bold ${(stressEnd - baseEnd) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {valueFormatter(stressEnd - baseEnd)}
          </div>
          <div className="text-sm text-gray-500 mt-1">vs Base</div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {currentForecast.metric} Forecast - {currentForecast.horizon}
        </h2>
        <LineChart
          data={currentForecast.forecast}
          lines={lines}
          xAxisKey="date"
          height={400}
          valueFormatter={valueFormatter}
        />
      </div>

      {/* Model Metadata */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Model Type</div>
            <div className="font-medium text-gray-900">{currentForecast.modelMetadata.type}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Training Window</div>
            <div className="font-medium text-gray-900">{currentForecast.modelMetadata.trainingWindow}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Version</div>
            <div className="font-medium text-gray-900">{currentForecast.modelMetadata.version}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Last Updated</div>
            <div className="font-medium text-gray-900">
              {currentForecast.modelMetadata.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showScenarios.map(scenario => (
          <div key={scenario} className="metric-card">
            <h3 className="text-base font-semibold text-gray-900 mb-3 capitalize">
              {scenario} Scenario Assumptions
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate Shock:</span>
                <span className="font-medium">{currentForecast.scenarios[scenario].rateShock} bps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Runoff:</span>
                <span className="font-medium">{currentForecast.scenarios[scenario].depositRunoff}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Growth:</span>
                <span className="font-medium">{currentForecast.scenarios[scenario].loanGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spread Widening:</span>
                <span className="font-medium">{currentForecast.scenarios[scenario].fundingSpreadWidening} bps</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-1">Capital Actions:</div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    currentForecast.scenarios[scenario].capitalActions.dividends
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    Dividends
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    currentForecast.scenarios[scenario].capitalActions.buybacks
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    Buybacks
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    currentForecast.scenarios[scenario].capitalActions.issuance
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    Issuance
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

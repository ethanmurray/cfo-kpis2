import { useState } from 'react'
import { getStrategicTargetsData } from '../data/mockData'
import { CheckCircle, AlertTriangle, TrendingUp, Users, Target } from 'lucide-react'
import LineChart from '../components/charts/LineChart'

export default function StrategicTargets() {
  const data = getStrategicTargetsData()
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)

  const selectedTargetData = selectedTarget
    ? data.targets.find((t) => t.id === selectedTarget)
    : null

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial':
        return TrendingUp
      case 'Client':
        return Users
      case 'Operational':
      case 'Digital':
        return Target
      default:
        return Target
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Strategic Targets</h1>
        <div className="text-sm text-gray-500">
          Last Updated: {new Date(data.summary.lastUpdated).toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="metric-card">
          <div className="card-title">Overall Score</div>
          <div className="metric-value">{data.summary.overallScore}</div>
          <div className="text-sm text-gray-500 mt-2">Out of 100</div>
        </div>
        <div className="metric-card">
          <div className="card-title">On Track</div>
          <div className="metric-value text-green-600">{data.summary.onTrack}</div>
          <div className="text-sm text-gray-500 mt-2">Targets achieving goals</div>
        </div>
        <div className="metric-card">
          <div className="card-title">At Risk</div>
          <div className="metric-value text-yellow-600">{data.summary.atRisk}</div>
          <div className="text-sm text-gray-500 mt-2">Targets need attention</div>
        </div>
        <div className="metric-card">
          <div className="card-title">Total Targets</div>
          <div className="metric-value">{data.summary.total}</div>
          <div className="text-sm text-gray-500 mt-2">Strategic priorities</div>
        </div>
      </div>

      {/* Board Highlights */}
      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Board Highlights</h2>
        <div className="space-y-3">
          {data.boardHighlights.map((highlight, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg ${
                highlight.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : highlight.type === 'concern'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {highlight.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : highlight.type === 'concern' ? (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              )}
              <p className="text-sm text-gray-700">{highlight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Targets Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {data.targets.map((target) => {
          const Icon = getCategoryIcon(target.category)
          const progress = (target.current / target.target) * 100
          const progressCapped = Math.min(progress, 100)

          return (
            <div
              key={target.id}
              onClick={() => setSelectedTarget(target.id)}
              className={`metric-card cursor-pointer transition-all hover:shadow-md ${
                selectedTarget === target.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">{target.category}</span>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${
                    target.priority === 'Critical'
                      ? 'text-red-700 bg-red-100'
                      : target.priority === 'High'
                      ? 'text-orange-700 bg-orange-100'
                      : 'text-blue-700 bg-blue-100'
                  }`}
                >
                  {target.priority}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{target.metric}</h3>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-gray-900">
                  {target.unit === 'percentage'
                    ? `${target.current.toFixed(1)}%`
                    : target.unit === 'currency'
                    ? `$${(target.current / 1_000_000_000).toFixed(1)}B`
                    : target.unit === 'bps'
                    ? `${target.current.toFixed(0)} bps`
                    : target.current.toFixed(0)}
                </span>
                <span className="text-sm text-gray-500">
                  /{' '}
                  {target.unit === 'percentage'
                    ? `${target.target.toFixed(1)}%`
                    : target.unit === 'currency'
                    ? `$${(target.target / 1_000_000_000).toFixed(1)}B`
                    : target.unit === 'bps'
                    ? `${target.target.toFixed(0)} bps`
                    : target.target.toFixed(0)}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progressCapped.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${target.onTrack ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${progressCapped}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Target: {target.targetYear}</span>
                {target.onTrack ? (
                  <span className="text-green-600 font-medium">✓ On Track</span>
                ) : (
                  <span className="text-yellow-600 font-medium">⚠ At Risk</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed View */}
      {selectedTargetData && (
        <div className="metric-card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedTargetData.metric}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Owner: {selectedTargetData.owner}</span>
                <span>•</span>
                <span>Category: {selectedTargetData.category}</span>
                <span>•</span>
                <span>Target: {selectedTargetData.targetYear}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedTarget(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Progress Chart */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quarterly Progress</h3>
            <LineChart
              data={selectedTargetData.progress}
              lines={[
                { dataKey: 'value', name: selectedTargetData.metric, color: '#0ea5e9' },
              ]}
              xAxisKey="quarter"
              height={200}
              valueFormatter={(value) =>
                selectedTargetData.unit === 'percentage'
                  ? `${value.toFixed(1)}%`
                  : value.toFixed(1)
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Drivers */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Drivers</h3>
              <div className="space-y-2">
                {selectedTargetData.drivers.map((driver, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span
                      className={`mt-0.5 ${
                        driver.impact === 'positive'
                          ? 'text-green-600'
                          : driver.impact === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {driver.impact === 'positive' ? '↑' : driver.impact === 'negative' ? '↓' : '→'}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{driver.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Initiatives */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Initiatives</h3>
              <div className="space-y-3">
                {selectedTargetData.initiatives.map((initiative, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{initiative.name}</span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          initiative.status === 'completed'
                            ? 'text-green-700 bg-green-100'
                            : initiative.status === 'in-progress'
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-gray-700 bg-gray-200'
                        }`}
                      >
                        {initiative.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${initiative.completionPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{initiative.completionPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risks */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Risks & Mitigation</h3>
            <div className="space-y-3">
              {selectedTargetData.risks.map((risk, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    risk.severity === 'high'
                      ? 'bg-red-50 border-red-200'
                      : risk.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded mt-0.5 ${
                        risk.severity === 'high'
                          ? 'text-red-700 bg-red-100'
                          : risk.severity === 'medium'
                          ? 'text-yellow-700 bg-yellow-100'
                          : 'text-gray-700 bg-gray-200'
                      }`}
                    >
                      {risk.severity.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {risk.description}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Mitigation:</span> {risk.mitigation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commentary */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Executive Commentary</h3>
            <p className="text-sm text-gray-700">{selectedTargetData.commentary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

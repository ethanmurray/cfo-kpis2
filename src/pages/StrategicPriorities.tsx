import { useState } from 'react'
import { getStrategicTargetsData, getMarketPositionData, getPeerComparisonData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import { CheckCircle, AlertTriangle, TrendingUp, Users, Target, Rocket } from 'lucide-react'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/DataTable'
import { useClientStore } from '../stores/clientStore'

export default function StrategicPriorities() {
  const config = useClientStore((s) => s.config)
  const strategicData = getStrategicTargetsData()
  const marketData = getMarketPositionData()
  const peerData = getPeerComparisonData()
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'targets' | 'market' | 'initiatives' | 'peers'>('targets')

  const selectedTargetData = selectedTarget
    ? strategicData.targets.find((t) => t.id === selectedTarget)
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
        <h1 className="text-3xl font-bold text-gray-900">Strategic Priorities</h1>
        <div className="text-sm text-gray-500">
          Last Updated: {new Date(strategicData.summary.lastUpdated).toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="metric-card">
          <div className="card-title">Overall Score</div>
          <div className="metric-value">{strategicData.summary.overallScore}</div>
          <div className="text-sm text-gray-500 mt-2">Out of 100</div>
        </div>
        <div className="metric-card">
          <div className="card-title">On Track</div>
          <div className="metric-value text-green-600">{strategicData.summary.onTrack}</div>
          <div className="text-sm text-gray-500 mt-2">Targets achieving goals</div>
        </div>
        <div className="metric-card">
          <div className="card-title">Global Ranking</div>
          <div className="metric-value">#{marketData.ranking}</div>
          <div className="text-sm text-gray-500 mt-2">By AUC globally</div>
        </div>
        <div className="metric-card">
          <div className="card-title">Market Share</div>
          <div className="metric-value">{marketData.marketShare.overall}%</div>
          <div className="text-sm text-gray-500 mt-2">Global custody market</div>
        </div>
      </div>

      {/* Board Highlights */}
      <div className="metric-card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Board Highlights</h2>
        <div className="space-y-3">
          {strategicData.boardHighlights.map((highlight, index) => (
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

      {/* Tabs */}
      <div className="metric-card mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('targets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'targets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Strategic Targets ({strategicData.summary.total})
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'market'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Market Position
            </button>
            <button
              onClick={() => setActiveTab('initiatives')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'initiatives'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Key Initiatives
            </button>
            <button
              onClick={() => setActiveTab('peers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'peers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Peer Benchmarking
            </button>
          </nav>
        </div>

        {/* Strategic Targets Tab */}
        {activeTab === 'targets' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {strategicData.targets.map((target) => {
                const Icon = getCategoryIcon(target.category)
                const progress = (target.current / target.target) * 100
                const progressCapped = Math.min(progress, 100)

                return (
                  <div
                    key={target.id}
                    onClick={() => setSelectedTarget(target.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTarget === target.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
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
              <div className="mt-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedTargetData.metric}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Owner: {selectedTargetData.owner}</span>
                      <span>•</span>
                      <span>Category: {selectedTargetData.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTarget(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quarterly Progress</h4>
                  <LineChart
                    data={selectedTargetData.progress}
                    lines={[
                      { dataKey: 'value', name: selectedTargetData.metric, color: '#0ea5e9' },
                    ]}
                    xAxisKey="quarter"
                    height={180}
                    valueFormatter={(value) =>
                      selectedTargetData.unit === 'percentage'
                        ? `${value.toFixed(1)}%`
                        : value.toFixed(1)
                    }
                  />
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-700"><strong>Commentary:</strong> {selectedTargetData.commentary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Market Position Tab */}
        {activeTab === 'market' && (
          <div className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Market Share by Region</h3>
                <BarChart
                  data={marketData.marketShare.byRegion}
                  bars={[{ dataKey: 'share', name: 'Market Share (%)', color: '#0ea5e9' }]}
                  xAxisKey="region"
                  height={250}
                  valueFormatter={(value) => `${value}%`}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Competitive Fee Comparison</h3>
                <BarChart
                  data={marketData.competitiveFees}
                  bars={[{ dataKey: 'averageFee', name: 'Average Fee (bps)', color: '#10b981' }]}
                  xAxisKey="competitor"
                  height={250}
                  valueFormatter={(value) => `${(value * 100).toFixed(2)} bps`}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Competitive Positioning</h3>
              <DataTable
                columns={[
                  { header: 'Competitor', accessor: 'competitor' },
                  {
                    header: 'Average Fee (bps)',
                    accessor: 'averageFee',
                    format: (v: number) => (v * 100).toFixed(2),
                  },
                  {
                    header: `Position vs ${config.shortName}`,
                    accessor: 'averageFee',
                    format: (v: number) => {
                      const ourFee = marketData.competitiveFees.find(c => c.competitor === config.shortName)?.averageFee || 0
                      const diff = ((v - ourFee) / ourFee) * 100
                      if (Math.abs(diff) < 1) return 'Similar'
                      return diff > 0 ? `${diff.toFixed(1)}% higher` : `${Math.abs(diff).toFixed(1)}% lower`
                    },
                  },
                ]}
                data={marketData.competitiveFees}
              />
            </div>
          </div>
        )}

        {/* Key Initiatives Tab */}
        {activeTab === 'initiatives' && (
          <div className="pt-6">
            <div className="space-y-6">
              {strategicData.targets.map((target) => (
                <div key={target.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Rocket className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{target.metric}</h3>
                  </div>
                  <div className="space-y-3">
                    {target.initiatives.map((initiative, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
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
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${initiative.completionPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12 text-right">{initiative.completionPercent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Peer Benchmarking Tab */}
        {activeTab === 'peers' && (
          <div className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Competitive Benchmarking</h2>

            {/* Rankings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700 mb-1">Ranking by AUC</div>
                <div className="text-3xl font-bold text-blue-900">#{peerData.rankings.byAUC}</div>
                <div className="text-xs text-blue-700 mt-1">Among custody banks</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-700 mb-1">Ranking by ROE</div>
                <div className="text-3xl font-bold text-green-900">#{peerData.rankings.byROE}</div>
                <div className="text-xs text-green-700 mt-1">Ex-JPMorgan</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-700 mb-1">Ranking by Efficiency</div>
                <div className="text-3xl font-bold text-purple-900">#{peerData.rankings.byEfficiency}</div>
                <div className="text-xs text-purple-700 mt-1">2nd best ratio</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-xs text-orange-700 mb-1">Ranking by Revenue</div>
                <div className="text-3xl font-bold text-orange-900">#{peerData.rankings.byRevenue}</div>
                <div className="text-xs text-orange-700 mt-1">Global custody market</div>
              </div>
            </div>

            {/* Peer Comparison Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Institution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      AUC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      ROE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Efficiency Ratio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Pre-Tax Margin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Market Cap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      P/TBV
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {peerData.peers.map((peer, index) => {
                    const isOwnCompany = peer.name === config.shortName
                    return (
                      <tr key={index} className={isOwnCompany ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className={`whitespace-nowrap px-6 py-4 text-sm ${isOwnCompany ? 'font-bold text-blue-900' : 'text-gray-900'}`}>
                          {peer.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(peer.auc, 1)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(peer.revenue, 1)}
                        </td>
                        <td className={`whitespace-nowrap px-6 py-4 text-sm ${peer.roe >= 13 ? 'text-green-600 font-semibold' : 'text-gray-900'}`}>
                          {peer.roe.toFixed(1)}%
                        </td>
                        <td className={`whitespace-nowrap px-6 py-4 text-sm ${peer.efficiencyRatio < 68 ? 'text-green-600 font-semibold' : 'text-gray-900'}`}>
                          {peer.efficiencyRatio.toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {peer.preTaxMargin.toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(peer.marketCap, 1)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {peer.priceToTangibleBook.toFixed(2)}x
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Competitive Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Competitive Strengths</h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>2nd Best Efficiency Ratio (67.8%)</strong> - Only JPM AWM better among peers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Strong ROE (13.8%)</strong> - 2nd among pure custody banks, above BNY and State Street</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Valuation Opportunity</strong> - P/TBV of 0.68x lowest among peers</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">Areas for Improvement</h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Scale Gap</strong> - AUC of $15.8T vs $48.5T (BNY) and $43.7T (State Street)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>ROE Gap to Target</strong> - Need 120 bps improvement to reach 15% target</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Market Valuation</strong> - Low P/TBV suggests market skepticism on growth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

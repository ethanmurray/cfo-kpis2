import { useState, useMemo } from 'react'
import { generatePeerData, generatePeerTimeSeries } from '../../data/peerData'
import LineChart from '../charts/LineChart'
import { useClientStore } from '../../stores/clientStore'

export default function TrendsView() {
  const config = useClientStore((s) => s.config)
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'roe' | 'cet1' | 'nim'>('roe')
  const [selectedPeers, setSelectedPeers] = useState<string[]>([config.ticker, 'JPM', 'STT', 'BK'])
  const [isIndexed, setIsIndexed] = useState(false)

  const peers = useMemo(() => generatePeerData(), [])

  const togglePeer = (ticker: string) => {
    if (selectedPeers.includes(ticker)) {
      setSelectedPeers(selectedPeers.filter(t => t !== ticker))
    } else {
      setSelectedPeers([...selectedPeers, ticker])
    }
  }

  const timeSeriesData = useMemo(() => {
    if (selectedPeers.length === 0) return []

    // Generate time series for each selected peer
    const allSeries = selectedPeers.map(ticker =>
      generatePeerTimeSeries(ticker, selectedMetric, 12)
    )

    // Combine into single array with all tickers as separate keys
    const combinedData = allSeries[0].map((point, index) => {
      const dataPoint: any = { date: point.date }

      selectedPeers.forEach((ticker, peerIndex) => {
        let value = allSeries[peerIndex][index].value

        // If indexed, normalize to 100 at start
        if (isIndexed) {
          const baseValue = allSeries[peerIndex][0].value
          value = (value / baseValue) * 100
        }

        dataPoint[ticker] = value
      })

      return dataPoint
    })

    return combinedData
  }, [selectedPeers, selectedMetric, isIndexed])

  const lines = selectedPeers.map(ticker => {
    const peer = peers.find(p => p.ticker === ticker)
    const colors: { [key: string]: string } = {
      [config.ticker]: '#f59e0b',
      'JPM': '#3b82f6',
      'BAC': '#10b981',
      'WFC': '#ef4444',
      'C': '#8b5cf6',
      'USB': '#06b6d4',
      'PNC': '#ec4899',
      'TFC': '#84cc16',
      'STT': '#f97316',
      'BK': '#14b8a6',
      'COF': '#6366f1',
      'SCHW': '#a855f7'
    }

    return {
      dataKey: ticker,
      name: ticker,
      color: colors[ticker] || '#6b7280'
    }
  })

  const metricLabels = {
    price: 'Stock Price',
    roe: 'Return on Equity',
    cet1: 'CET1 Ratio',
    nim: 'Net Interest Margin'
  }

  const valueFormatters = {
    price: (v: number) => isIndexed ? v.toFixed(0) : `$${v.toFixed(2)}`,
    roe: (v: number) => isIndexed ? v.toFixed(0) : `${v.toFixed(1)}%`,
    cet1: (v: number) => isIndexed ? v.toFixed(0) : `${v.toFixed(1)}%`,
    nim: (v: number) => isIndexed ? v.toFixed(0) : `${v.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="metric-card">
        <div className="space-y-4">
          {/* Metric Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
            <div className="flex gap-2 flex-wrap">
              {(['price', 'roe', 'cet1', 'nim'] as const).map(metric => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {metricLabels[metric]}
                </button>
              ))}
            </div>
          </div>

          {/* Indexed Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="indexed"
              checked={isIndexed}
              onChange={(e) => setIsIndexed(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="indexed" className="text-sm text-gray-700">
              Show as Indexed (Base = 100)
            </label>
          </div>

          {/* Peer Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Peers to Compare ({selectedPeers.length} selected)
            </label>
            <div className="flex gap-2 flex-wrap">
              {peers.map(peer => {
                const isSelected = selectedPeers.includes(peer.ticker)
                const isOwn = peer.ticker === config.ticker

                return (
                  <button
                    key={peer.ticker}
                    onClick={() => togglePeer(peer.ticker)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isSelected
                        ? isOwn
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {peer.ticker}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {metricLabels[selectedMetric]} - {isIndexed ? 'Indexed Comparison' : 'Absolute Values'}
        </h2>
        {selectedPeers.length > 0 ? (
          <LineChart
            data={timeSeriesData}
            lines={lines}
            xAxisKey="date"
            height={400}
            valueFormatter={valueFormatters[selectedMetric]}
          />
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Select at least one peer to display trends
          </div>
        )}
      </div>

      {/* Relative Performance Table */}
      {!isIndexed && selectedPeers.length > 0 && (
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Relative Performance vs {config.shortName}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peer
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Value
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {config.ticker} Delta
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    12Q Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedPeers.map(ticker => {
                  const series = generatePeerTimeSeries(ticker, selectedMetric, 12)
                  const latestValue = series[series.length - 1].value
                  const firstValue = series[0].value
                  const change = ((latestValue - firstValue) / firstValue) * 100

                  const ownSeries = generatePeerTimeSeries(config.ticker, selectedMetric, 12)
                  const ownLatest = ownSeries[ownSeries.length - 1].value
                  const delta = latestValue - ownLatest
                  const deltaPercent = (delta / ownLatest) * 100

                  return (
                    <tr key={ticker} className={ticker === config.ticker ? 'bg-amber-50' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{ticker}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {valueFormatters[selectedMetric](latestValue)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${
                        ticker === config.ticker
                          ? 'text-gray-500'
                          : delta >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {ticker === config.ticker
                          ? '—'
                          : `${delta >= 0 ? '+' : ''}${deltaPercent.toFixed(1)}%`
                        }
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${
                        change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

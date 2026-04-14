import { useState, useMemo } from 'react'
import { generatePeerData } from '../../data/peerData'
import ScatterPlot from '../charts/ScatterPlot'

type ChartType = 'pe-roe' | 'ptbv-roe' | 'ptbv-rotce' | 'pb-roe'

export default function ValuationView() {
  const [selectedChart, setSelectedChart] = useState<ChartType>('ptbv-roe')

  const peers = useMemo(() => generatePeerData(), [])

  const chartConfigs: {
    [key in ChartType]: {
      title: string
      xLabel: string
      yLabel: string
      xKey: keyof typeof peers[0]['fundamentals'] | keyof typeof peers[0]['valuation']
      yKey: keyof typeof peers[0]['valuation']
      xFormatter: (v: number) => string
      yFormatter: (v: number) => string
    }
  } = {
    'pe-roe': {
      title: 'P/E vs ROE',
      xLabel: 'ROE (%)',
      yLabel: 'P/E Ratio (TTM)',
      xKey: 'roe',
      yKey: 'peTTM',
      xFormatter: (v) => `${v.toFixed(1)}%`,
      yFormatter: (v) => `${v.toFixed(1)}x`
    },
    'ptbv-roe': {
      title: 'P/TBV vs ROE',
      xLabel: 'ROE (%)',
      yLabel: 'P/TBV Ratio',
      xKey: 'roe',
      yKey: 'ptbv',
      xFormatter: (v) => `${v.toFixed(1)}%`,
      yFormatter: (v) => `${v.toFixed(2)}x`
    },
    'ptbv-rotce': {
      title: 'P/TBV vs ROTCE',
      xLabel: 'ROTCE (%)',
      yLabel: 'P/TBV Ratio',
      xKey: 'rotce',
      yKey: 'ptbv',
      xFormatter: (v) => `${v.toFixed(1)}%`,
      yFormatter: (v) => `${v.toFixed(2)}x`
    },
    'pb-roe': {
      title: 'P/B vs ROE',
      xLabel: 'ROE (%)',
      yLabel: 'P/B Ratio',
      xKey: 'roe',
      yKey: 'pb',
      xFormatter: (v) => `${v.toFixed(1)}%`,
      yFormatter: (v) => `${v.toFixed(2)}x`
    }
  }

  const config = chartConfigs[selectedChart]

  const scatterData = peers.map(peer => {
    const xValue = config.xKey in peer.fundamentals
      ? peer.fundamentals[config.xKey as keyof typeof peer.fundamentals] as number
      : peer.valuation[config.xKey as keyof typeof peer.valuation] as number

    const yValue = peer.valuation[config.yKey] as number

    return {
      x: xValue,
      y: yValue,
      z: peer.marketData.marketCap,
      name: peer.ticker,
      isOwn: peer.ticker === 'NTRS'
    }
  })

  const ntrsData = peers.find(p => p.ticker === 'NTRS')

  return (
    <div className="space-y-6">
      {/* Chart Selector */}
      <div className="metric-card">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Chart</label>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(chartConfigs) as ChartType[]).map(chartType => (
            <button
              key={chartType}
              onClick={() => setSelectedChart(chartType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedChart === chartType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {chartConfigs[chartType].title}
            </button>
          ))}
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{config.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Bubble size represents market capitalization. Northern Trust highlighted in amber.
        </p>
        <ScatterPlot
          data={scatterData}
          xAxisLabel={config.xLabel}
          yAxisLabel={config.yLabel}
          xFormatter={config.xFormatter}
          yFormatter={config.yFormatter}
          height={500}
        />
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Valuation Summary */}
        <div className="metric-card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Valuation Summary (NTRS)</h3>
          {ntrsData && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">P/E (TTM):</span>
                <span className="font-medium">{ntrsData.valuation.peTTM.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">P/E (Forward):</span>
                <span className="font-medium">{ntrsData.valuation.peForward.toFixed(1)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">P/B:</span>
                <span className="font-medium">{ntrsData.valuation.pb.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">P/TBV:</span>
                <span className="font-medium">{ntrsData.valuation.ptbv.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dividend Yield:</span>
                <span className="font-medium">{ntrsData.valuation.dividendYield.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Peer Comparison */}
        <div className="metric-card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Peer Group Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Median P/E:</span>
              <span className="font-medium">
                {peers.map(p => p.valuation.peTTM).sort((a, b) => a - b)[Math.floor(peers.length / 2)].toFixed(1)}x
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Median P/TBV:</span>
              <span className="font-medium">
                {peers.map(p => p.valuation.ptbv).sort((a, b) => a - b)[Math.floor(peers.length / 2)].toFixed(2)}x
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Median ROE:</span>
              <span className="font-medium">
                {peers.map(p => p.fundamentals.roe).sort((a, b) => a - b)[Math.floor(peers.length / 2)].toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Median ROTCE:</span>
              <span className="font-medium">
                {peers.map(p => p.fundamentals.rotce).sort((a, b) => a - b)[Math.floor(peers.length / 2)].toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Relative Position */}
        <div className="metric-card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Relative Position (NTRS)</h3>
          {ntrsData && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">P/TBV vs Median:</span>
                <span className={`font-medium ${
                  ntrsData.valuation.ptbv > peers.map(p => p.valuation.ptbv).sort((a, b) => a - b)[Math.floor(peers.length / 2)]
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}>
                  {((ntrsData.valuation.ptbv / peers.map(p => p.valuation.ptbv).sort((a, b) => a - b)[Math.floor(peers.length / 2)] - 1) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ROE vs Median:</span>
                <span className={`font-medium ${
                  ntrsData.fundamentals.roe > peers.map(p => p.fundamentals.roe).sort((a, b) => a - b)[Math.floor(peers.length / 2)]
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {((ntrsData.fundamentals.roe / peers.map(p => p.fundamentals.roe).sort((a, b) => a - b)[Math.floor(peers.length / 2)] - 1) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Div Yield vs Median:</span>
                <span className={`font-medium ${
                  ntrsData.valuation.dividendYield > peers.map(p => p.valuation.dividendYield).sort((a, b) => a - b)[Math.floor(peers.length / 2)]
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {((ntrsData.valuation.dividendYield / peers.map(p => p.valuation.dividendYield).sort((a, b) => a - b)[Math.floor(peers.length / 2)] - 1) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Valuation & Performance Detail</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/E (TTM)
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/TBV
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROE
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROTCE
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Div Yield
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mkt Cap
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {peers.map(peer => (
                <tr key={peer.ticker} className={peer.ticker === 'NTRS' ? 'bg-amber-50' : ''}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {peer.ticker}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {peer.valuation.peTTM.toFixed(1)}x
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {peer.valuation.ptbv.toFixed(2)}x
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {peer.fundamentals.roe.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {peer.fundamentals.rotce.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {peer.valuation.dividendYield.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    ${peer.marketData.marketCap.toFixed(0)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

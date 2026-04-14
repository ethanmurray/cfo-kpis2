import { useState, useMemo } from 'react'
import { generatePeerData, calculatePeerRankings } from '../../data/peerData'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { useClientStore } from '../../stores/clientStore'

export default function ScoreboardView() {
  const config = useClientStore((s) => s.config)
  const [sortColumn, setSortColumn] = useState<string>('roe')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const peers = useMemo(() => generatePeerData(), [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const sortedPeers = useMemo(() => {
    return [...peers].sort((a, b) => {
      let aVal: number, bVal: number

      switch (sortColumn) {
        case 'price':
          aVal = a.marketData.price
          bVal = b.marketData.price
          break
        case 'ytd':
          aVal = a.marketData.returns.YTD
          bVal = b.marketData.returns.YTD
          break
        case 'marketCap':
          aVal = a.marketData.marketCap
          bVal = b.marketData.marketCap
          break
        case 'pe':
          aVal = a.valuation.peTTM
          bVal = b.valuation.peTTM
          break
        case 'pb':
          aVal = a.valuation.pb
          bVal = b.valuation.pb
          break
        case 'ptbv':
          aVal = a.valuation.ptbv
          bVal = b.valuation.ptbv
          break
        case 'roe':
          aVal = a.fundamentals.roe
          bVal = b.fundamentals.roe
          break
        case 'rotce':
          aVal = a.fundamentals.rotce
          bVal = b.fundamentals.rotce
          break
        case 'nim':
          aVal = a.fundamentals.nim
          bVal = b.fundamentals.nim
          break
        case 'cet1':
          aVal = a.fundamentals.cet1Ratio
          bVal = b.fundamentals.cet1Ratio
          break
        case 'efficiency':
          aVal = a.fundamentals.efficiencyRatio
          bVal = b.fundamentals.efficiencyRatio
          break
        default:
          return 0
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [peers, sortColumn, sortDirection])

  const getPercentile = (value: number, allValues: number[], inverse: boolean = false) => {
    const sorted = [...allValues].sort((a, b) => a - b)
    const rank = sorted.indexOf(value)
    const percentile = ((rank + 1) / sorted.length) * 100
    return inverse ? 100 - percentile : percentile
  }

  const allROE = peers.map(p => p.fundamentals.roe)
  const allROTCE = peers.map(p => p.fundamentals.rotce)
  const allNIM = peers.map(p => p.fundamentals.nim)
  const allCET1 = peers.map(p => p.fundamentals.cet1Ratio)
  const allEfficiency = peers.map(p => p.fundamentals.efficiencyRatio)

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600 bg-green-50'
    if (percentile >= 50) return 'text-blue-600 bg-blue-50'
    if (percentile >= 25) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Peers Tracked</div>
          <div className="text-2xl font-bold text-gray-900">{peers.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Median ROE</div>
          <div className="text-2xl font-bold text-gray-900">
            {(allROE.sort((a, b) => a - b)[Math.floor(allROE.length / 2)]).toFixed(1)}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Median P/TBV</div>
          <div className="text-2xl font-bold text-gray-900">
            {peers.map(p => p.valuation.ptbv).sort((a, b) => a - b)[Math.floor(peers.length / 2)].toFixed(2)}x
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Avg CET1 Ratio</div>
          <div className="text-2xl font-bold text-gray-900">
            {(allCET1.reduce((a, b) => a + b, 0) / allCET1.length).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Peer Scoreboard Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Peer Scoreboard</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50"
                >
                  Bank
                </th>
                <SortableHeader label="Price" column="price" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="YTD Return" column="ytd" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="Mkt Cap" column="marketCap" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="P/E" column="pe" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="P/B" column="pb" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="P/TBV" column="ptbv" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="ROE" column="roe" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="ROTCE" column="rotce" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="NIM" column="nim" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="CET1" column="cet1" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                <SortableHeader label="Efficiency" column="efficiency" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPeers.map((peer, index) => {
                const isOwn = peer.ticker === config.ticker
                const roePercentile = getPercentile(peer.fundamentals.roe, allROE)
                const rotcePercentile = getPercentile(peer.fundamentals.rotce, allROTCE)
                const nimPercentile = getPercentile(peer.fundamentals.nim, allNIM)
                const cet1Percentile = getPercentile(peer.fundamentals.cet1Ratio, allCET1)
                const efficiencyPercentile = getPercentile(peer.fundamentals.efficiencyRatio, allEfficiency, true)

                return (
                  <tr key={peer.ticker} className={isOwn ? 'bg-amber-50' : ''}>
                    <td className="px-4 py-3 text-sm sticky left-0 bg-white">
                      <div className={`font-medium ${isOwn ? 'text-amber-600' : 'text-gray-900'}`}>
                        {peer.ticker}
                      </div>
                      <div className="text-xs text-gray-500">{peer.name.split(' ')[0]}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      ${peer.marketData.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={peer.marketData.returns.YTD >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {peer.marketData.returns.YTD >= 0 ? '+' : ''}{peer.marketData.returns.YTD.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      ${peer.marketData.marketCap.toFixed(0)}B
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {peer.valuation.peTTM.toFixed(1)}x
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {peer.valuation.pb.toFixed(2)}x
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {peer.valuation.ptbv.toFixed(2)}x
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-900">{peer.fundamentals.roe.toFixed(1)}%</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPercentileColor(roePercentile)}`}>
                          {roePercentile.toFixed(0)}th
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-900">{peer.fundamentals.rotce.toFixed(1)}%</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPercentileColor(rotcePercentile)}`}>
                          {rotcePercentile.toFixed(0)}th
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-900">{peer.fundamentals.nim.toFixed(2)}%</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPercentileColor(nimPercentile)}`}>
                          {nimPercentile.toFixed(0)}th
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-900">{peer.fundamentals.cet1Ratio.toFixed(1)}%</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPercentileColor(cet1Percentile)}`}>
                          {cet1Percentile.toFixed(0)}th
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium text-gray-900">{peer.fundamentals.efficiencyRatio.toFixed(0)}%</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPercentileColor(efficiencyPercentile)}`}>
                          {efficiencyPercentile.toFixed(0)}th
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>{config.shortName} highlighted in amber. Percentile rankings shown relative to peer group.</p>
          <p>Green = Top quartile, Blue = 2nd quartile, Amber = 3rd quartile, Red = Bottom quartile</p>
        </div>
      </div>
    </div>
  )
}

function SortableHeader({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort
}: {
  label: string
  column: string
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
}) {
  const isActive = sortColumn === column

  return (
    <th
      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center justify-end gap-1">
        {label}
        {isActive && (
          sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
        )}
      </div>
    </th>
  )
}

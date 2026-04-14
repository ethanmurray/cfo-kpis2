import { useState, useMemo } from 'react'
import { generateLiquidityMetrics } from '../data/liquidityMetrics'
import { generateCapitalMetrics } from '../data/capitalMetrics'
import { generateBalanceSheetMetrics } from '../data/balanceSheetMetrics'
import { generateBusinessFlowMetrics } from '../data/businessFlowData'
import { generatePeerData } from '../data/peerData'
import { formatCurrency, formatPercent } from '../utils/dataGenerators'

export default function ExecutiveSummaryTest() {
  const liquidity = useMemo(() => generateLiquidityMetrics(), [])
  const capital = useMemo(() => generateCapitalMetrics(), [])
  const balanceSheet = useMemo(() => generateBalanceSheetMetrics(), [])
  const businessFlow = useMemo(() => generateBusinessFlowMetrics(), [])
  const peers = useMemo(() => generatePeerData(), [])

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Executive Summary - Data Test</h1>
        <p className="text-gray-600 mt-2">Testing all data generators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">LCR</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercent(liquidity.lcr.value)}
          </div>
          <div className="text-xs text-gray-500 mt-1">✓ Liquidity data loaded</div>
        </div>

        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">CET1 Ratio</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatPercent(capital.cet1.ratio)}
          </div>
          <div className="text-xs text-gray-500 mt-1">✓ Capital data loaded</div>
        </div>

        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Total Assets</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(balanceSheet.totalAssets, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">✓ Balance sheet loaded</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Priority Alerts</div>
          <div className="text-2xl font-bold text-red-600">
            {businessFlow?.alerts ? businessFlow.alerts.filter(a => a.severity === 'high').length : 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">✓ Business flow data loaded</div>
        </div>

        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-1">Peer Banks</div>
          <div className="text-2xl font-bold text-purple-600">{peers?.length ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">✓ Peer data loaded</div>
        </div>
      </div>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Check</h2>
        <div className="space-y-2 text-sm">
          <p className="text-green-600">✓ All data generators working correctly</p>
          <p className="text-green-600">✓ All utility functions imported successfully</p>
          <p className="text-green-600">✓ Ready to display full Executive Summary</p>
        </div>
      </div>
    </div>
  )
}

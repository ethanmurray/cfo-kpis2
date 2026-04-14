import { useMemo } from 'react'
import { generateBusinessFlowMetrics } from '../../data/businessFlowData'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import { formatCurrency } from '../../utils/dataGenerators'

export default function CustodyView() {
  const businessFlow = useMemo(() => generateBusinessFlowMetrics(), [])
  const { custody } = businessFlow

  return (
    <div className="space-y-6">
      <MetricGroup title="Custody Metrics" columns={4}>
        <MetricTile
          title="Assets Under Administration"
          value={custody.aua}
          format="currency"
          decimals={1}
          size="lg"
        />
        <MetricTile
          title="Assets Under Custody"
          value={custody.auc}
          format="currency"
          decimals={1}
          size="lg"
        />
        <MetricTile
          title="Net Flows"
          value={custody.netFlows}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Settlement Volume"
          value={custody.settlementVolume}
          format="currency"
          decimals={1}
          size="lg"
        />
      </MetricGroup>

      <MetricGroup title="Operational Metrics" columns={3}>
        <MetricTile
          title="Fails Rate"
          value={custody.failsRate}
          format="percentage"
          decimals={2}
          threshold={{ red: 0.25, amber: 0.15, green: 0.10 }}
          inverse={true}
        />
        <MetricTile
          title="Intraday Overdraft"
          value={custody.intradayOverdraft}
          format="currency"
          decimals={1}
          threshold={{ red: 7, amber: 5, green: 3 }}
          inverse={true}
        />
        <MetricTile
          title="AUA Change (1D)"
          value={custody.changes['1D']}
          format="currency"
          decimals={0}
        />
      </MetricGroup>

      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Total AUA at {formatCurrency(custody.aua, 1)} with {custody.changes['1D'] >= 0 ? 'positive' : 'negative'} day-over-day change</li>
          <li>• Settlement volume processing {formatCurrency(custody.settlementVolume, 1)} daily</li>
          <li>• Fails rate at {custody.failsRate.toFixed(2)}% {custody.failsRate > 0.15 ? '(elevated - monitor)' : '(within normal range)'}</li>
          <li>• Intraday overdraft usage at {formatCurrency(custody.intradayOverdraft, 1)}</li>
        </ul>
      </div>
    </div>
  )
}

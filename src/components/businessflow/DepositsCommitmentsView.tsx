import { useMemo } from 'react'
import { generateBusinessFlowMetrics } from '../../data/businessFlowData'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import { formatCurrency } from '../../utils/dataGenerators'
import { format } from 'date-fns'

export default function DepositsCommitmentsView() {
  const businessFlow = useMemo(() => generateBusinessFlowMetrics(), [])
  const { depositActivity, commitmentDraws, newUnderwritings } = businessFlow

  return (
    <div className="space-y-6">
      <MetricGroup title="Deposit Activity" columns={4}>
        <MetricTile
          title="Gross Inflows"
          value={depositActivity.grossInflows}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Gross Outflows"
          value={depositActivity.grossOutflows}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Net Flows"
          value={depositActivity.netFlows}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Uninsured %"
          value={depositActivity.uninsuredPercent}
          format="percentage"
          decimals={1}
          threshold={{ red: 50, amber: 42, green: 35 }}
          inverse={true}
        />
      </MetricGroup>

      <MetricGroup title="Commitment Utilization" columns={4}>
        <MetricTile
          title="Committed"
          value={commitmentDraws.committed}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Outstanding"
          value={commitmentDraws.outstanding}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Undrawn"
          value={commitmentDraws.undrawn}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Utilization"
          value={commitmentDraws.utilization}
          format="percentage"
          decimals={1}
          threshold={{ red: 85, amber: 75, green: 65 }}
          inverse={true}
        />
      </MetricGroup>

      {/* Recent Draws */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Commitment Draws</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility ID</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commitmentDraws.draws.slice(0, 10).map((draw, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {format(draw.timestamp, 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{draw.clientId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{draw.facilityId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(draw.amount, 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      draw.utilization > 85 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {draw.utilization.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Underwritings */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Underwritings Pipeline</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expected RWA</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Expected Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Liquidity Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {newUnderwritings.map(deal => (
                <tr key={deal.dealId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{deal.dealId}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deal.stage === 'funded' ? 'bg-green-100 text-green-800' :
                      deal.stage === 'committed' ? 'bg-blue-100 text-blue-800' :
                      deal.stage === 'approved' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(deal.committedAmount, 0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(deal.expectedRWA, 0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(deal.expectedRevenue, 1)}</td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${
                    deal.liquidityImpact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {deal.liquidityImpact >= 0 ? '+' : ''}{formatCurrency(deal.liquidityImpact, 0)}
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

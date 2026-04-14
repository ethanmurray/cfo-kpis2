import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import { generateOrderFlowMetrics, generateDepositFlowTimeSeries, generateLoanPipelineFunnel, generateCommitmentUtilizationBySector } from '../../data/orderFlowMetrics'
import { formatCurrency } from '../../utils/dataGenerators'

export default function OrderFlowView() {
  const orderFlow = generateOrderFlowMetrics()
  const depositFlows = generateDepositFlowTimeSeries(30)
  const loanPipeline = generateLoanPipelineFunnel()
  const commitmentsBySector = generateCommitmentUtilizationBySector()

  const depositFlowsBySegment = Object.entries(orderFlow.depositFlows.grossInflows).map(
    ([name, inflows]) => ({
      segment: name,
      inflows,
      outflows: orderFlow.depositFlows.grossOutflows[name] || 0,
      netFlow: inflows - (orderFlow.depositFlows.grossOutflows[name] || 0)
    })
  )

  return (
    <div className="space-y-8">
      {/* Deposit Flows */}
      <MetricGroup title="Deposit Flows" columns={4}>
        <MetricTile
          title="Net Flow (Today)"
          value={orderFlow.depositFlows.netFlow.today}
          format="currency"
          decimals={0}
          changes={{ DoD: 0 }}
          size="lg"
        />
        <MetricTile
          title="Net Flow (7 Days)"
          value={orderFlow.depositFlows.netFlow.week}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Net Flow (MTD)"
          value={orderFlow.depositFlows.netFlow.mtd}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Gross Inflows (Today)"
          value={Object.values(orderFlow.depositFlows.grossInflows).reduce((a, b) => a + b, 0)}
          format="currency"
          decimals={0}
        />
      </MetricGroup>

      {/* Loan Pipeline */}
      <MetricGroup title="Loan Pipeline" columns={4}>
        <MetricTile
          title="Submitted"
          value={orderFlow.loanPipeline.submitted}
          format="currency"
          decimals={1}
          changes={{ WoW: 3.2 }}
        />
        <MetricTile
          title="Approved"
          value={orderFlow.loanPipeline.approved}
          format="currency"
          decimals={1}
          changes={{ WoW: 2.8 }}
        />
        <MetricTile
          title="Committed"
          value={orderFlow.loanPipeline.committed}
          format="currency"
          decimals={1}
          changes={{ WoW: 5.2 }}
        />
        <MetricTile
          title="Funded"
          value={orderFlow.loanPipeline.funded}
          format="currency"
          decimals={1}
          changes={{ WoW: 4.1 }}
        />
      </MetricGroup>

      {/* Commitments & Activity */}
      <MetricGroup title="Commitments & Activity" columns={4}>
        <MetricTile
          title="New Underwriting"
          value={orderFlow.commitments.newUnderwriting}
          format="currency"
          decimals={1}
          subtitle="This period"
        />
        <MetricTile
          title="Expected Fees"
          value={orderFlow.commitments.expectedFees}
          format="currency"
          decimals={1}
          subtitle="From new underwriting"
        />
        <MetricTile
          title="Utilization Rate"
          value={orderFlow.commitments.utilization}
          format="percentage"
          decimals={1}
          threshold={{ red: 90, amber: 80, green: 70 }}
          inverse={true}
          changes={{ DoD: -0.3, WoW: 1.1 }}
        />
        <MetricTile
          title="Payments Volume (Daily)"
          value={orderFlow.paymentsVolume.daily}
          format="currency"
          decimals={1}
          changes={{ DoD: -2.1 }}
        />
      </MetricGroup>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Flows Time Series */}
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Net Deposit Flows (30 Days)</h2>
          <LineChart
            data={depositFlows}
            lines={[{ dataKey: 'value', name: 'Net Flow', color: '#0ea5e9' }]}
            xAxisKey="date"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
        </div>

        {/* Loan Pipeline Funnel */}
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Pipeline Funnel</h2>
          <BarChart
            data={loanPipeline}
            bars={[{ dataKey: 'value', name: 'Amount', color: '#10b981' }]}
            xAxisKey="stage"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 text-center text-sm text-gray-600">
            Conversion: Submitted → Funded = {loanPipeline[3].conversion.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Deposit Flows by Segment */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Flows by Segment</h2>
        <BarChart
          data={depositFlowsBySegment}
          bars={[
            { dataKey: 'inflows', name: 'Inflows', color: '#10b981' },
            { dataKey: 'outflows', name: 'Outflows', color: '#ef4444' }
          ]}
          xAxisKey="segment"
          height={300}
          valueFormatter={(value) => formatCurrency(value, 0)}
        />
      </div>

      {/* Commitment Utilization by Sector */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commitment Utilization by Sector</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Committed
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {commitmentsBySector.map((sector, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{sector.sector}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(sector.committed, 1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(sector.outstanding, 1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sector.utilization > 85
                          ? 'bg-red-100 text-red-800'
                          : sector.utilization > 75
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {sector.utilization.toFixed(1)}%
                    </span>
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

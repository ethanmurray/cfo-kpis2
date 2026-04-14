import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import LineChart from '../charts/LineChart'
import BarChart from '../charts/BarChart'
import { generateInterestRateMetrics, generateNIITimeSeries, generateNIMTimeSeries, generateRepricingGapChart } from '../../data/interestRateMetrics'
import { formatCurrency } from '../../utils/dataGenerators'

export default function InterestRateView() {
  const interestRate = generateInterestRateMetrics()
  const niiTimeSeries = generateNIITimeSeries(12)
  const nimTimeSeries = generateNIMTimeSeries(12)
  const repricingGaps = generateRepricingGapChart()

  const depositBetaData = Object.entries(interestRate.depositBeta.bySegment).map(
    ([name, value]) => ({ segment: name, beta: value })
  )

  return (
    <div className="space-y-8">
      {/* NII & NIM */}
      <MetricGroup title="Net Interest Income & Margin" columns={4}>
        <MetricTile
          title="NII (Run Rate)"
          value={interestRate.nii.runRate}
          format="currency"
          decimals={1}
          subtitle="Annual"
          changes={{ QoQ: 8.5, YoY: 22.3 }}
          size="lg"
        />
        <MetricTile
          title="NII (MTD)"
          value={interestRate.nii.mtd}
          format="currency"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="NII (QTD)"
          value={interestRate.nii.qtd}
          format="currency"
          decimals={1}
          size="lg"
        />
        <MetricTile
          title="NIM"
          value={interestRate.nim}
          format="percentage"
          decimals={2}
          threshold={{ red: 2.2, amber: 2.6, green: 2.8 }}
          changes={{ QoQ: 0.12, YoY: 0.45 }}
          size="lg"
        />
      </MetricGroup>

      {/* Rate Sensitivity */}
      <MetricGroup title="Interest Rate Sensitivity" columns={4}>
        <MetricTile
          title="NII Sensitivity (+100bp)"
          value={interestRate.sensitivity.nii.plus100bp}
          format="currency"
          decimals={0}
          subtitle="12-month impact"
        />
        <MetricTile
          title="NII Sensitivity (-100bp)"
          value={interestRate.sensitivity.nii.minus100bp}
          format="currency"
          decimals={0}
          subtitle="12-month impact"
        />
        <MetricTile
          title="EVE Sensitivity (+100bp)"
          value={interestRate.sensitivity.eve.plus100bp}
          format="currency"
          decimals={0}
          subtitle="Economic Value of Equity"
        />
        <MetricTile
          title="EVE Sensitivity (-100bp)"
          value={interestRate.sensitivity.eve.minus100bp}
          format="currency"
          decimals={0}
          subtitle="Economic Value of Equity"
        />
      </MetricGroup>

      {/* Duration & Hedging */}
      <MetricGroup title="Duration & Hedging" columns={4}>
        <MetricTile
          title="Asset Duration"
          value={interestRate.duration.assets}
          format="number"
          decimals={1}
          subtitle="Years"
        />
        <MetricTile
          title="Liability Duration"
          value={interestRate.duration.liabilities}
          format="number"
          decimals={1}
          subtitle="Years"
        />
        <MetricTile
          title="Duration Gap"
          value={interestRate.duration.assets - interestRate.duration.liabilities}
          format="number"
          decimals={1}
          subtitle="Assets - Liabilities"
        />
        <MetricTile
          title="Hedge Coverage"
          value={interestRate.hedgeCoverage.ratio}
          format="percentage"
          decimals={0}
          threshold={{ red: 60, amber: 70, green: 75 }}
        />
      </MetricGroup>

      {/* Deposit Beta */}
      <MetricGroup title="Deposit Beta" columns={4}>
        <MetricTile
          title="Overall Beta"
          value={interestRate.depositBeta.overall}
          format="percentage"
          decimals={0}
          size="lg"
        />
        <MetricTile
          title="Retail Beta"
          value={interestRate.depositBeta.bySegment['Retail']}
          format="percentage"
          decimals={0}
        />
        <MetricTile
          title="Commercial Beta"
          value={interestRate.depositBeta.bySegment['Commercial']}
          format="percentage"
          decimals={0}
        />
        <MetricTile
          title="Institutional Beta"
          value={interestRate.depositBeta.bySegment['Institutional']}
          format="percentage"
          decimals={0}
        />
      </MetricGroup>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">NII Trend (12 Quarters)</h2>
          <LineChart
            data={niiTimeSeries}
            lines={[{ dataKey: 'value', name: 'NII', color: '#10b981' }]}
            xAxisKey="date"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">NIM Trend (12 Quarters)</h2>
          <LineChart
            data={nimTimeSeries}
            lines={[{ dataKey: 'value', name: 'NIM', color: '#0ea5e9' }]}
            xAxisKey="date"
            height={300}
            valueFormatter={(value) => `${value.toFixed(2)}%`}
          />
        </div>
      </div>

      {/* Repricing Gap Analysis */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Repricing Gap Analysis</h2>
        <BarChart
          data={repricingGaps}
          bars={[
            { dataKey: 'assets', name: 'Assets', color: '#10b981' },
            { dataKey: 'liabilities', name: 'Liabilities', color: '#ef4444' }
          ]}
          xAxisKey="bucket"
          height={350}
          valueFormatter={(value) => formatCurrency(value, 0)}
        />
      </div>

      {/* Repricing Gap Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Repricing Gap Detail</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Bucket
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assets
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liabilities
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gap
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cumulative Gap
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repricingGaps.map((row, index) => {
                const cumulativeGap = repricingGaps
                  .slice(0, index + 1)
                  .reduce((sum, r) => sum + r.gap, 0)

                return (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.bucket}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(row.assets, 1)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(row.liabilities, 1)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${
                      row.gap > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {row.gap > 0 ? '+' : ''}{formatCurrency(row.gap, 1)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium text-right ${
                      cumulativeGap > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cumulativeGap > 0 ? '+' : ''}{formatCurrency(cumulativeGap, 1)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>• Positive gap = Asset sensitive (benefits from rate increases)</p>
          <p>• Negative gap = Liability sensitive (benefits from rate decreases)</p>
        </div>
      </div>
    </div>
  )
}

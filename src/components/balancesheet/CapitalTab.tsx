import { useState } from 'react'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import WaterfallChart from '../charts/WaterfallChart'
import { generateCapitalMetrics, generateCapitalTimeSeries, generateRWAComposition } from '../../data/capitalMetrics'
import { formatCurrency } from '../../utils/dataGenerators'

export default function CapitalTab() {
  const [selectedMetric, setSelectedMetric] = useState<'cet1' | 'tier1' | 'total' | 'rwa'>('cet1')

  const capital = generateCapitalMetrics()
  const timeSeries = generateCapitalTimeSeries(selectedMetric, 12)
  const rwaComposition = generateRWAComposition()

  // Capital waterfall data
  const capitalWaterfall = [
    { name: 'Common Equity', value: capital.cet1.capital, isTotal: false },
    { name: 'Retained Earnings', value: capital.cet1.capital * 0.15, isTotal: false },
    { name: 'Regulatory Adjustments', value: -capital.cet1.capital * 0.05, isTotal: false },
    { name: 'CET1 Capital', value: capital.cet1.capital, isTotal: true },
    { name: 'Additional Tier 1', value: capital.tier1.capital - capital.cet1.capital, isTotal: false },
    { name: 'Tier 1 Capital', value: capital.tier1.capital, isTotal: true },
    { name: 'Tier 2 Capital', value: capital.totalCapital.capital - capital.tier1.capital, isTotal: false },
    { name: 'Total Capital', value: capital.totalCapital.capital, isTotal: true }
  ]

  return (
    <div className="space-y-8">
      {/* Key Capital Ratios */}
      <MetricGroup title="Capital Ratios" columns={4}>
        <MetricTile
          title="CET1 Ratio"
          value={capital.cet1.ratio}
          format="percentage"
          decimals={2}
          threshold={capital.cet1.threshold}
          changes={{ QoQ: 0.15, YoY: 0.8 }}
          size="lg"
        />
        <MetricTile
          title="Tier 1 Ratio"
          value={capital.tier1.ratio}
          format="percentage"
          decimals={2}
          threshold={{ red: 8.0, amber: 9.0, green: 10.0 }}
          changes={{ QoQ: 0.12, YoY: 0.65 }}
          size="lg"
        />
        <MetricTile
          title="Total Capital Ratio"
          value={capital.totalCapital.ratio}
          format="percentage"
          decimals={2}
          threshold={{ red: 10.5, amber: 12.0, green: 13.5 }}
          changes={{ QoQ: 0.18, YoY: 0.92 }}
          size="lg"
        />
        <MetricTile
          title="SLR"
          value={capital.slr.ratio}
          format="percentage"
          decimals={2}
          subtitle="Supplementary Leverage Ratio"
          threshold={{ red: 5.0, amber: 5.5, green: 6.0 }}
          changes={{ QoQ: 0.1 }}
          size="lg"
        />
      </MetricGroup>

      {/* Capital & RWA Amounts */}
      <MetricGroup title="Capital & RWA" columns={4}>
        <MetricTile
          title="CET1 Capital"
          value={capital.cet1.capital}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.1, YoY: 8.5 }}
        />
        <MetricTile
          title="Tier 1 Capital"
          value={capital.tier1.capital}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.9, YoY: 7.8 }}
        />
        <MetricTile
          title="Total Capital"
          value={capital.totalCapital.capital}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.5, YoY: 9.2 }}
        />
        <MetricTile
          title="Risk Weighted Assets"
          value={capital.cet1.rwa.total}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.8, YoY: 6.3 }}
        />
      </MetricGroup>

      {/* RWA Components */}
      <MetricGroup title="RWA Components" columns={4}>
        <MetricTile
          title="Credit Risk RWA"
          value={capital.cet1.rwa.credit}
          format="currency"
          decimals={1}
          subtitle={`${((capital.cet1.rwa.credit / capital.cet1.rwa.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="Market Risk RWA"
          value={capital.cet1.rwa.market}
          format="currency"
          decimals={1}
          subtitle={`${((capital.cet1.rwa.market / capital.cet1.rwa.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="Operational Risk RWA"
          value={capital.cet1.rwa.operational}
          format="currency"
          decimals={1}
          subtitle={`${((capital.cet1.rwa.operational / capital.cet1.rwa.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="RWA Growth"
          value={6.3}
          format="percentage"
          decimals={1}
          subtitle="Year-over-Year"
        />
      </MetricGroup>

      {/* Headroom & Sensitivities */}
      <MetricGroup title="Headroom & Sensitivities" columns={4}>
        <MetricTile
          title="Headroom to Target"
          value={capital.cet1.headroom.toTarget}
          format="percentage"
          decimals={2}
          subtitle={`Target: ${capital.cet1.threshold.green.toFixed(2)}%`}
        />
        <MetricTile
          title="Headroom to Minimum"
          value={capital.cet1.headroom.toMinimum}
          format="percentage"
          decimals={2}
          subtitle={`Min + Buffers: ${capital.cet1.threshold.red.toFixed(2)}%`}
        />
        <MetricTile
          title="AOCI Impact"
          value={capital.aoci.unrealizedGainLoss}
          format="currency"
          decimals={1}
          subtitle="Unrealized Gain/(Loss)"
        />
        <MetricTile
          title="Capital Sensitivity"
          value={capital.aoci.capitalSensitivity}
          format="percentage"
          decimals={2}
          subtitle="per $1B AOCI change"
        />
      </MetricGroup>

      {/* Capital Composition Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Capital Stack</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-600">CET1 Capital</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(capital.cet1.capital, 1)}
              </div>
              <div className="text-sm text-green-600 mt-1">
                {capital.cet1.ratio.toFixed(2)}% of RWA
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-600">Additional Tier 1</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(capital.tier1.capital - capital.cet1.capital, 1)}
              </div>
              <div className="text-sm text-blue-600 mt-1">
                {((capital.tier1.ratio - capital.cet1.ratio)).toFixed(2)}% of RWA
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm text-gray-600">Tier 2 Capital</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(capital.totalCapital.capital - capital.tier1.capital, 1)}
              </div>
              <div className="text-sm text-purple-600 mt-1">
                {((capital.totalCapital.ratio - capital.tier1.ratio)).toFixed(2)}% of RWA
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-4 mt-4">
              <div className="text-sm text-gray-600">Total Capital</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(capital.totalCapital.capital, 1)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {capital.totalCapital.ratio.toFixed(2)}% ratio
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">RWA Composition</h2>
          <PieChart
            data={rwaComposition}
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {rwaComposition.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}:</span>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(item.value, 1)}</div>
                  <div className="text-gray-500 text-xs">{item.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capital Waterfall */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capital Composition Waterfall ($B)</h2>
        <WaterfallChart
          data={capitalWaterfall}
          height={350}
          valueFormatter={(value) => formatCurrency(value, 1)}
        />
      </div>

      {/* Regulatory Requirements */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Requirements & Buffers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requirement
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level (%)
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Headroom
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">CET1 Minimum</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">4.50%</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                  {capital.cet1.ratio.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                  +{(capital.cet1.ratio - 4.5).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">Conservation Buffer</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">2.50%</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                  {capital.cet1.ratio.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                  +{(capital.cet1.ratio - 7.0).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">G-SIB Surcharge</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">1.00%</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                  {capital.cet1.ratio.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                  +{(capital.cet1.ratio - 8.0).toFixed(2)}%
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  Total Regulatory Requirement
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  {capital.cet1.threshold.red.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  {capital.cet1.ratio.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-bold">
                  +{capital.cet1.headroom.toMinimum.toFixed(2)}%
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">Internal Target</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  {capital.cet1.threshold.green.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  {capital.cet1.ratio.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-green-600 text-right font-bold">
                  +{capital.cet1.headroom.toTarget.toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Capital Trends (12 Quarters)</h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="cet1">CET1 Ratio (%)</option>
            <option value="tier1">Tier 1 Ratio (%)</option>
            <option value="total">Total Capital Ratio (%)</option>
            <option value="rwa">RWA ($B)</option>
          </select>
        </div>
        <LineChart
          data={timeSeries}
          lines={[{ dataKey: 'value', name: selectedMetric.toUpperCase(), color: '#10b981' }]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) =>
            selectedMetric === 'rwa' ? formatCurrency(value, 0) : `${value.toFixed(2)}%`
          }
        />
      </div>

      {/* Capital Generation & Usage */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Capital Generation & Usage (YTD)</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Net Income</div>
            <div className="text-xl font-bold text-green-600">+{formatCurrency(2.8, 1)}</div>
            <div className="text-xs text-gray-500 mt-1">Capital generation</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Dividends</div>
            <div className="text-xl font-bold text-red-600">-{formatCurrency(0.95, 2)}</div>
            <div className="text-xs text-gray-500 mt-1">Capital distribution</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Share Buybacks</div>
            <div className="text-xl font-bold text-red-600">-{formatCurrency(0.65, 2)}</div>
            <div className="text-xs text-gray-500 mt-1">Capital distribution</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Net Impact</div>
            <div className="text-xl font-bold text-blue-600">+{formatCurrency(1.2, 1)}</div>
            <div className="text-xs text-gray-500 mt-1">Net capital build</div>
          </div>
        </div>
      </div>
    </div>
  )
}

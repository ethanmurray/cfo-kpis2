import { useState } from 'react'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import { generateLiquidityMetrics, generateLiquidityTimeSeries, generateHQLAComposition } from '../../data/liquidityMetrics'
import { formatCurrency, formatPercentage } from '../../utils/dataGenerators'

export default function LiquidityView() {
  const [selectedMetric, setSelectedMetric] = useState<'lcr' | 'hqla' | 'nsfr' | 'buffer'>('lcr')

  const liquidity = generateLiquidityMetrics()
  const timeSeries = generateLiquidityTimeSeries(selectedMetric, 90)
  const hqlaComposition = generateHQLAComposition()

  const outflowsData = Object.entries(liquidity.lcr.netCashOutflows.outflows.categories).map(
    ([name, value]) => ({ name, value })
  )

  const inflowsData = Object.entries(liquidity.lcr.netCashOutflows.inflows.categories).map(
    ([name, value]) => ({ name, value })
  )

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <MetricGroup title="Key Liquidity Metrics" columns={4}>
        <MetricTile
          title="LCR"
          value={liquidity.lcr.value}
          format="percentage"
          decimals={1}
          threshold={liquidity.lcr.threshold}
          changes={{ DoD: -0.8, WoW: 1.2, MoM: 2.1 }}
          size="lg"
        />
        <MetricTile
          title="HQLA"
          value={liquidity.lcr.hqla.total}
          format="currency"
          decimals={1}
          subtitle="Total HQLA"
          changes={{ DoD: 0.5, WoW: -0.3 }}
          size="lg"
        />
        <MetricTile
          title="Net Cash Outflows (30d)"
          value={liquidity.lcr.netCashOutflows.total}
          format="currency"
          decimals={1}
          changes={{ DoD: -1.2, WoW: 0.8 }}
          size="lg"
        />
        <MetricTile
          title="NSFR"
          value={liquidity.nsfr.value}
          format="percentage"
          decimals={1}
          threshold={{ red: 100, amber: 105, green: 110 }}
          changes={{ MoM: 0.4, QoQ: 0.7 }}
          size="lg"
        />
      </MetricGroup>

      {/* Secondary Metrics */}
      <MetricGroup title="Supporting Metrics" columns={4}>
        <MetricTile
          title="Liquidity Buffer"
          value={liquidity.liquidityBuffer}
          format="currency"
          decimals={1}
          subtitle="HQLA + Contingent Capacity"
          changes={{ DoD: 1.2 }}
        />
        <MetricTile
          title="Unencumbered Assets"
          value={liquidity.unencumberedAssets.total}
          format="currency"
          decimals={1}
          subtitle={`${liquidity.unencumberedAssets.encumbrancePercent.toFixed(1)}% encumbered`}
        />
        <MetricTile
          title="Wholesale Funding Reliance"
          value={liquidity.wholesaleFunding.reliance}
          format="percentage"
          decimals={1}
          threshold={{ red: 40, amber: 32, green: 25 }}
          inverse={true}
        />
        <MetricTile
          title="Deposit Stability"
          value={liquidity.depositStability.insuredPercent}
          format="percentage"
          decimals={1}
          subtitle="Insured Deposits"
          threshold={{ red: 50, amber: 55, green: 60 }}
        />
      </MetricGroup>

      {/* Trend Chart */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Liquidity Trends (90 Days)</h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="lcr">LCR (%)</option>
            <option value="hqla">HQLA ($B)</option>
            <option value="nsfr">NSFR (%)</option>
            <option value="buffer">Liquidity Buffer ($B)</option>
          </select>
        </div>
        <LineChart
          data={timeSeries}
          lines={[{ dataKey: 'value', name: selectedMetric.toUpperCase(), color: '#0ea5e9' }]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) =>
            selectedMetric === 'lcr' || selectedMetric === 'nsfr'
              ? `${value.toFixed(1)}%`
              : formatCurrency(value, 1)
          }
        />
      </div>

      {/* Composition Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HQLA Composition */}
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">HQLA Composition</h2>
          <PieChart
            data={hqlaComposition.data}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {hqlaComposition.data.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}:</span>
                <span className="font-medium">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Outflows */}
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash Outflows (30d)</h2>
          <PieChart
            data={outflowsData}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(liquidity.lcr.netCashOutflows.outflows.total, 1)}
            </div>
            <div className="text-sm text-gray-600">Total Outflows</div>
          </div>
        </div>

        {/* Cash Inflows */}
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash Inflows (30d)</h2>
          <PieChart
            data={inflowsData}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(liquidity.lcr.netCashOutflows.inflows.total, 1)}
            </div>
            <div className="text-sm text-gray-600">Total Inflows</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">LCR Calculation Detail</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-blue-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">HQLA (Numerator)</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(liquidity.lcr.hqla.total, 1)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700 pl-8">Level 1</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {formatCurrency(liquidity.lcr.hqla.level1, 1)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700 pl-8">Level 2A (85% haircut)</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {formatCurrency(liquidity.lcr.hqla.level2A * 0.85, 1)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700 pl-8">Level 2B (50% haircut)</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {formatCurrency(liquidity.lcr.hqla.level2B * 0.50, 1)}
                </td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  Net Cash Outflows (Denominator)
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(liquidity.lcr.netCashOutflows.total, 1)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700 pl-8">Total Outflows</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {formatCurrency(liquidity.lcr.netCashOutflows.outflows.total, 1)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700 pl-8">Total Inflows (capped)</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  ({formatCurrency(liquidity.lcr.netCashOutflows.inflows.total, 1)})
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">LCR Ratio</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  {liquidity.lcr.value.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

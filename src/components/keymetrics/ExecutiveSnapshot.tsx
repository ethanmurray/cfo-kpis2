import { useState } from 'react'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import DrilldownPanel from '../DrilldownPanel'
import WaterfallChart from '../charts/WaterfallChart'
import { generateLiquidityMetrics, generateLCRWaterfall } from '../../data/liquidityMetrics'
import { generateCapitalMetrics, generateCET1Waterfall } from '../../data/capitalMetrics'
import { generateOrderFlowMetrics } from '../../data/orderFlowMetrics'
import { generateInterestRateMetrics } from '../../data/interestRateMetrics'
import { generateBalanceSheetMetrics } from '../../data/balanceSheetMetrics'
import { formatCurrency } from '../../utils/dataGenerators'

export default function ExecutiveSnapshot() {
  const [drilldownOpen, setDrilldownOpen] = useState(false)
  const [drilldownData, setDrilldownData] = useState<any>(null)

  const liquidity = generateLiquidityMetrics()
  const capital = generateCapitalMetrics()
  const orderFlow = generateOrderFlowMetrics()
  const interestRate = generateInterestRateMetrics()
  const balanceSheet = generateBalanceSheetMetrics()

  const handleDrilldown = (title: string, data: any) => {
    setDrilldownData({ title, ...data })
    setDrilldownOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Liquidity Metrics */}
      <MetricGroup title="Liquidity" description="Daily liquidity and funding metrics" columns={4}>
        <MetricTile
          title="LCR"
          value={liquidity.lcr.value}
          format="percentage"
          decimals={1}
          threshold={liquidity.lcr.threshold}
          changes={{
            DoD: -0.8,
            WoW: 1.2
          }}
          onClick={() => handleDrilldown('LCR Analysis', {
            waterfall: generateLCRWaterfall(liquidity.lcr.value, liquidity.lcr.value - 1.2),
            metric: 'LCR',
            current: liquidity.lcr.value,
            prior: liquidity.lcr.value - 1.2
          })}
        />
        <MetricTile
          title="HQLA"
          value={liquidity.lcr.hqla.total}
          format="currency"
          decimals={1}
          subtitle="High Quality Liquid Assets"
          changes={{
            DoD: 0.5,
            WoW: -0.3
          }}
        />
        <MetricTile
          title="NSFR"
          value={liquidity.nsfr.value}
          format="percentage"
          decimals={1}
          threshold={{ red: 100, amber: 105, green: 110 }}
          changes={{
            MoM: 0.4
          }}
        />
        <MetricTile
          title="Liquidity Buffer"
          value={liquidity.liquidityBuffer}
          format="currency"
          decimals={1}
          changes={{
            DoD: 1.2,
            WoW: 0.8
          }}
        />
      </MetricGroup>

      {/* Capital Metrics */}
      <MetricGroup title="Capital" description="Regulatory capital ratios and RWA" columns={4}>
        <MetricTile
          title="CET1 Ratio"
          value={capital.cet1.ratio}
          format="percentage"
          decimals={2}
          threshold={capital.cet1.threshold}
          changes={{
            QoQ: 0.15,
            YoY: 0.8
          }}
          onClick={() => handleDrilldown('CET1 Analysis', {
            waterfall: generateCET1Waterfall(capital.cet1.ratio, capital.cet1.ratio - 0.15),
            metric: 'CET1 Ratio',
            current: capital.cet1.ratio,
            prior: capital.cet1.ratio - 0.15
          })}
        />
        <MetricTile
          title="CET1 Capital"
          value={capital.cet1.capital}
          format="currency"
          decimals={1}
          subtitle="Common Equity Tier 1"
          changes={{
            QoQ: 2.1
          }}
        />
        <MetricTile
          title="RWA"
          value={capital.cet1.rwa.total}
          format="currency"
          decimals={1}
          subtitle="Risk Weighted Assets"
          changes={{
            QoQ: 1.8
          }}
        />
        <MetricTile
          title="SLR"
          value={capital.slr.ratio}
          format="percentage"
          decimals={2}
          subtitle="Supplementary Leverage Ratio"
          threshold={{ red: 5.0, amber: 5.5, green: 6.0 }}
          changes={{
            QoQ: 0.1
          }}
        />
      </MetricGroup>

      {/* Order / Flow Metrics */}
      <MetricGroup title="Order / Flow" description="Pipeline and volume indicators" columns={4}>
        <MetricTile
          title="Net Deposit Flow (Today)"
          value={orderFlow.depositFlows.netFlow.today}
          format="currency"
          decimals={0}
          changes={{
            DoD: ((orderFlow.depositFlows.netFlow.today - 500) / 500) * 100
          }}
        />
        <MetricTile
          title="Loan Pipeline"
          value={orderFlow.loanPipeline.committed}
          format="currency"
          decimals={1}
          subtitle="Committed"
          changes={{
            WoW: 5.2
          }}
        />
        <MetricTile
          title="Commitment Utilization"
          value={orderFlow.commitments.utilization}
          format="percentage"
          decimals={1}
          changes={{
            DoD: -0.3,
            WoW: 1.1
          }}
        />
        <MetricTile
          title="Payments Volume (Daily)"
          value={orderFlow.paymentsVolume.daily}
          format="currency"
          decimals={1}
          changes={{
            DoD: -2.1
          }}
        />
      </MetricGroup>

      {/* Interest Rate Metrics */}
      <MetricGroup title="Interest Rate Disposition" description="NII sensitivity and margin" columns={4}>
        <MetricTile
          title="NII (Run Rate)"
          value={interestRate.nii.runRate}
          format="currency"
          decimals={1}
          subtitle="Annual"
          changes={{
            QoQ: 8.5,
            YoY: 22.3
          }}
        />
        <MetricTile
          title="NIM"
          value={interestRate.nim}
          format="percentage"
          decimals={2}
          subtitle="Net Interest Margin"
          threshold={{ red: 2.2, amber: 2.6, green: 2.8 }}
          changes={{
            QoQ: 0.12,
            YoY: 0.45
          }}
        />
        <MetricTile
          title="NII Sensitivity (+100bp)"
          value={interestRate.sensitivity.nii.plus100bp}
          format="currency"
          decimals={0}
          subtitle="Parallel rate shock"
        />
        <MetricTile
          title="Deposit Beta"
          value={interestRate.depositBeta.overall}
          format="percentage"
          decimals={0}
          subtitle="Average across segments"
        />
      </MetricGroup>

      {/* Balance Sheet Metrics */}
      <MetricGroup title="Balance Sheet" description="Size, mix, and quality" columns={4}>
        <MetricTile
          title="Total Assets"
          value={balanceSheet.totalAssets}
          format="currency"
          decimals={1}
          changes={{
            QoQ: 1.2,
            YoY: 4.5
          }}
        />
        <MetricTile
          title="Total Loans"
          value={balanceSheet.loans.total}
          format="currency"
          decimals={1}
          changes={{
            QoQ: 2.1
          }}
        />
        <MetricTile
          title="Total Deposits"
          value={balanceSheet.deposits.total}
          format="currency"
          decimals={1}
          changes={{
            QoQ: 1.8
          }}
        />
        <MetricTile
          title="Loan-to-Deposit Ratio"
          value={balanceSheet.ratios.loanToDeposit}
          format="percentage"
          decimals={1}
          threshold={{ red: 95, amber: 85, green: 80 }}
          inverse={true}
          changes={{
            QoQ: 0.3
          }}
        />
      </MetricGroup>

      {/* Drilldown Panel */}
      <DrilldownPanel
        isOpen={drilldownOpen}
        onClose={() => setDrilldownOpen(false)}
        title={drilldownData?.title || ''}
        width="lg"
      >
        {drilldownData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="metric-card">
                <div className="text-sm text-gray-600">Current Value</div>
                <div className="text-2xl font-bold text-gray-900">
                  {drilldownData.current?.toFixed(2)}%
                </div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-600">Prior Period</div>
                <div className="text-2xl font-bold text-gray-900">
                  {drilldownData.prior?.toFixed(2)}%
                </div>
              </div>
            </div>

            {drilldownData.waterfall && (
              <div className="metric-card">
                <WaterfallChart
                  data={drilldownData.waterfall}
                  title="Driver Analysis"
                  valueFormatter={(v) => `${v.toFixed(2)}%`}
                  height={400}
                />
              </div>
            )}

            <div className="metric-card">
              <h3 className="font-semibold text-gray-900 mb-3">Key Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Metric remains above regulatory minimum with adequate buffer</li>
                <li>• Primary drivers are HQLA composition changes and net cash flow dynamics</li>
                <li>• Monitor wholesale funding reliance and deposit stability trends</li>
                <li>• Consider contingent liquidity capacity in stress scenarios</li>
              </ul>
            </div>
          </div>
        )}
      </DrilldownPanel>
    </div>
  )
}

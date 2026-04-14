import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import { generateBalanceSheetMetrics, generateBalanceSheetTimeSeries } from '../../data/balanceSheetMetrics'
import { generateCapitalMetrics } from '../../data/capitalMetrics'
import { formatCurrency } from '../../utils/dataGenerators'

export default function OverviewTab() {
  const balanceSheet = generateBalanceSheetMetrics()
  const capital = generateCapitalMetrics()

  const totalEquity = balanceSheet.totalAssets - balanceSheet.totalLiabilities
  const leverageRatio = balanceSheet.totalAssets / totalEquity

  const assetsTrend = generateBalanceSheetTimeSeries('assets', 12)
  const loansTrend = generateBalanceSheetTimeSeries('loans', 12)
  const depositsTrend = generateBalanceSheetTimeSeries('deposits', 12)

  // Asset composition
  const assetComposition = [
    { name: 'Loans', value: balanceSheet.loans.total, percentage: (balanceSheet.loans.total / balanceSheet.totalAssets) * 100 },
    { name: 'Securities', value: balanceSheet.securities.afs + balanceSheet.securities.htm, percentage: ((balanceSheet.securities.afs + balanceSheet.securities.htm) / balanceSheet.totalAssets) * 100 },
    { name: 'Cash & Reserves', value: balanceSheet.cashAndReserves, percentage: (balanceSheet.cashAndReserves / balanceSheet.totalAssets) * 100 },
    { name: 'Other Assets', value: balanceSheet.totalAssets - balanceSheet.loans.total - balanceSheet.securities.afs - balanceSheet.securities.htm - balanceSheet.cashAndReserves, percentage: ((balanceSheet.totalAssets - balanceSheet.loans.total - balanceSheet.securities.afs - balanceSheet.securities.htm - balanceSheet.cashAndReserves) / balanceSheet.totalAssets) * 100 }
  ]

  // Liability composition
  const liabilityComposition = [
    { name: 'Deposits', value: balanceSheet.deposits.total, percentage: (balanceSheet.deposits.total / balanceSheet.totalLiabilities) * 100 },
    { name: 'Secured Funding', value: balanceSheet.fundingMix.secured, percentage: (balanceSheet.fundingMix.secured / balanceSheet.totalLiabilities) * 100 },
    { name: 'Unsecured Funding', value: balanceSheet.fundingMix.unsecured, percentage: (balanceSheet.fundingMix.unsecured / balanceSheet.totalLiabilities) * 100 },
    { name: 'Long-term Debt', value: balanceSheet.fundingMix.longTermDebt, percentage: (balanceSheet.fundingMix.longTermDebt / balanceSheet.totalLiabilities) * 100 },
    { name: 'Other Liabilities', value: balanceSheet.totalLiabilities - balanceSheet.deposits.total - balanceSheet.fundingMix.secured - balanceSheet.fundingMix.unsecured - balanceSheet.fundingMix.longTermDebt, percentage: ((balanceSheet.totalLiabilities - balanceSheet.deposits.total - balanceSheet.fundingMix.secured - balanceSheet.fundingMix.unsecured - balanceSheet.fundingMix.longTermDebt) / balanceSheet.totalLiabilities) * 100 }
  ]

  return (
    <div className="space-y-8">
      {/* Size Metrics */}
      <MetricGroup title="Balance Sheet Size" columns={4}>
        <MetricTile
          title="Total Assets"
          value={balanceSheet.totalAssets}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.2, YoY: 4.5 }}
          size="lg"
        />
        <MetricTile
          title="Total Liabilities"
          value={balanceSheet.totalLiabilities}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.1, YoY: 4.2 }}
          size="lg"
        />
        <MetricTile
          title="Total Equity"
          value={totalEquity}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.1, YoY: 8.5 }}
          size="lg"
        />
        <MetricTile
          title="Leverage Ratio"
          value={leverageRatio}
          format="number"
          decimals={1}
          subtitle={`${leverageRatio.toFixed(1)}x`}
          size="lg"
        />
      </MetricGroup>

      {/* Key Metrics */}
      <MetricGroup title="Key Metrics" columns={4}>
        <MetricTile
          title="Cash & Reserves"
          value={balanceSheet.cashAndReserves}
          format="currency"
          decimals={1}
          changes={{ QoQ: -2.5, YoY: 3.2 }}
        />
        <MetricTile
          title="Loan-to-Deposit Ratio"
          value={balanceSheet.ratios.loanToDeposit}
          format="percentage"
          decimals={1}
          threshold={{ red: 95, amber: 85, green: 80 }}
          inverse={true}
          changes={{ QoQ: 0.3 }}
        />
        <MetricTile
          title="Risk Weighted Assets"
          value={capital.cet1.rwa.total}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.8, YoY: 6.3 }}
        />
        <MetricTile
          title="RWA Density"
          value={(capital.cet1.rwa.total / balanceSheet.totalAssets) * 100}
          format="percentage"
          decimals={1}
          subtitle="RWA / Total Assets"
        />
      </MetricGroup>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Assets (12Q)</h2>
          <LineChart
            data={assetsTrend}
            lines={[{ dataKey: 'value', name: 'Assets', color: '#0ea5e9' }]}
            xAxisKey="date"
            height={250}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Loans (12Q)</h2>
          <LineChart
            data={loansTrend}
            lines={[{ dataKey: 'value', name: 'Loans', color: '#10b981' }]}
            xAxisKey="date"
            height={250}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Deposits (12Q)</h2>
          <LineChart
            data={depositsTrend}
            lines={[{ dataKey: 'value', name: 'Deposits', color: '#f59e0b' }]}
            xAxisKey="date"
            height={250}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
        </div>
      </div>

      {/* Composition Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Composition</h2>
          <PieChart
            data={assetComposition}
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {assetComposition.map((item, index) => (
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

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Liability Composition</h2>
          <PieChart
            data={liabilityComposition}
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {liabilityComposition.map((item, index) => (
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
    </div>
  )
}

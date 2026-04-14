import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import { generateBalanceSheetMetrics, generateBalanceSheetTimeSeries, generateFundingMixData, generateLoanComposition, generateDepositComposition } from '../../data/balanceSheetMetrics'
import { formatCurrency } from '../../utils/dataGenerators'

export default function BalanceSheetView() {
  const balanceSheet = generateBalanceSheetMetrics()
  const assetsTrend = generateBalanceSheetTimeSeries('assets', 12)
  const loansTrend = generateBalanceSheetTimeSeries('loans', 12)
  const depositsTrend = generateBalanceSheetTimeSeries('deposits', 12)
  const fundingMix = generateFundingMixData()
  const loanComposition = generateLoanComposition()
  const depositComposition = generateDepositComposition()

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
          value={balanceSheet.totalAssets - balanceSheet.totalLiabilities}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.1, YoY: 8.5 }}
          size="lg"
        />
        <MetricTile
          title="Loan-to-Deposit Ratio"
          value={balanceSheet.ratios.loanToDeposit}
          format="percentage"
          decimals={1}
          threshold={{ red: 95, amber: 85, green: 80 }}
          inverse={true}
          changes={{ QoQ: 0.3 }}
          size="lg"
        />
      </MetricGroup>

      {/* Loans */}
      <MetricGroup title="Loans" columns={4}>
        <MetricTile
          title="Total Loans"
          value={balanceSheet.loans.total}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.1, YoY: 8.3 }}
        />
        <MetricTile
          title="Commercial & Industrial"
          value={balanceSheet.loans.bySegment['Commercial & Industrial']}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Consumer Loans"
          value={balanceSheet.loans.bySegment['Consumer']}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Real Estate Loans"
          value={balanceSheet.loans.bySegment['Real Estate']}
          format="currency"
          decimals={1}
        />
      </MetricGroup>

      {/* Deposits */}
      <MetricGroup title="Deposits" columns={4}>
        <MetricTile
          title="Total Deposits"
          value={balanceSheet.deposits.total}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.8, YoY: 6.2 }}
        />
        <MetricTile
          title="Retail Deposits"
          value={balanceSheet.deposits.bySegment['Retail']}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Commercial Deposits"
          value={balanceSheet.deposits.bySegment['Commercial']}
          format="currency"
          decimals={1}
        />
        <MetricTile
          title="Institutional Deposits"
          value={balanceSheet.deposits.bySegment['Institutional']}
          format="currency"
          decimals={1}
        />
      </MetricGroup>

      {/* Cost & Quality Metrics */}
      <MetricGroup title="Cost & Quality" columns={4}>
        <MetricTile
          title="Cost of Deposits"
          value={balanceSheet.costMetrics.costOfDeposits}
          format="percentage"
          decimals={2}
          threshold={{ red: 3.5, amber: 2.8, green: 2.2 }}
          inverse={true}
          changes={{ QoQ: 0.45 }}
        />
        <MetricTile
          title="Cost of Funds"
          value={balanceSheet.costMetrics.costOfFunds}
          format="percentage"
          decimals={2}
          threshold={{ red: 4.0, amber: 3.2, green: 2.6 }}
          inverse={true}
          changes={{ QoQ: 0.52 }}
        />
        <MetricTile
          title="NPL Ratio"
          value={balanceSheet.qualityProxies.nplRatio}
          format="percentage"
          decimals={2}
          threshold={{ red: 1.0, amber: 0.6, green: 0.4 }}
          inverse={true}
        />
        <MetricTile
          title="ACL Ratio"
          value={balanceSheet.qualityProxies.aclRatio}
          format="percentage"
          decimals={2}
          subtitle="Allowance for Credit Losses"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Funding Mix</h2>
          <PieChart
            data={fundingMix}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
          <div className="mt-4 space-y-2">
            {fundingMix.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}:</span>
                <span className="font-medium">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Composition</h2>
          <PieChart
            data={loanComposition}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
          <div className="mt-4 space-y-2">
            {loanComposition.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}:</span>
                <span className="font-medium">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Composition</h2>
          <PieChart
            data={depositComposition}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 0)}
          />
          <div className="mt-4 space-y-2">
            {depositComposition.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}:</span>
                <span className="font-medium">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Mix Detail</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Fixed Rate Loans</span>
              <span className="font-medium">{formatCurrency(balanceSheet.loans.fixedFloating.fixed, 1)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Floating Rate Loans</span>
              <span className="font-medium">{formatCurrency(balanceSheet.loans.fixedFloating.floating, 1)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-semibold text-gray-900">Fixed %</span>
              <span className="font-bold">
                {((balanceSheet.loans.fixedFloating.fixed / balanceSheet.loans.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Mix Detail</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Insured Deposits</span>
              <span className="font-medium">{formatCurrency(balanceSheet.deposits.insuredVsUninsured.insured, 1)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Uninsured Deposits</span>
              <span className="font-medium">{formatCurrency(balanceSheet.deposits.insuredVsUninsured.uninsured, 1)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-semibold text-gray-900">Insured %</span>
              <span className="font-bold">
                {((balanceSheet.deposits.insuredVsUninsured.insured / balanceSheet.deposits.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

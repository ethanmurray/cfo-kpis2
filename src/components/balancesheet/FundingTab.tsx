import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import DataTable from '../DataTable'
import { generateBalanceSheetMetrics, generateBalanceSheetTimeSeries, generateFundingMixData, generateDepositComposition } from '../../data/balanceSheetMetrics'
import { formatCurrency } from '../../utils/dataGenerators'
import { subMonths, format } from 'date-fns'

export default function FundingTab() {
  const balanceSheet = generateBalanceSheetMetrics()
  const fundingMix = generateFundingMixData()
  const depositComposition = generateDepositComposition()
  const depositsTrend = generateBalanceSheetTimeSeries('deposits', 12)

  // Generate deposit types breakdown
  const depositTypes = [
    { type: 'Demand Deposits', value: balanceSheet.deposits.total * 0.42, rate: 0.15, percentage: 42 },
    { type: 'Savings Deposits', value: balanceSheet.deposits.total * 0.31, rate: 2.45, percentage: 31 },
    { type: 'Time Deposits', value: balanceSheet.deposits.total * 0.27, rate: 4.25, percentage: 27 }
  ]

  // Debt maturity ladder
  const debtMaturity = [
    { maturity: '< 1 Year', secured: 12, unsecured: 8, longTerm: 5 },
    { maturity: '1-3 Years', secured: 15, unsecured: 12, longTerm: 15 },
    { maturity: '3-5 Years', secured: 10, unsecured: 8, longTerm: 25 },
    { maturity: '5-10 Years', secured: 8, unsecured: 5, longTerm: 30 },
    { maturity: '> 10 Years', secured: 5, unsecured: 2, longTerm: 25 }
  ]

  // Cost of funds trend
  const costTrend = []
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    costTrend.push({
      date: format(date, 'MMM yy'),
      deposits: 1.8 + (i * 0.15) + (Math.random() - 0.5) * 0.2,
      wholesale: 2.5 + (i * 0.18) + (Math.random() - 0.5) * 0.25,
      total: 2.1 + (i * 0.16) + (Math.random() - 0.5) * 0.22
    })
  }

  return (
    <div className="space-y-8">
      {/* Funding Summary */}
      <MetricGroup title="Funding Summary" columns={4}>
        <MetricTile
          title="Total Deposits"
          value={balanceSheet.deposits.total}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.8, YoY: 6.2 }}
          size="lg"
        />
        <MetricTile
          title="Wholesale Funding"
          value={balanceSheet.fundingMix.secured + balanceSheet.fundingMix.unsecured}
          format="currency"
          decimals={1}
          changes={{ QoQ: -2.5, YoY: -5.8 }}
          size="lg"
        />
        <MetricTile
          title="Long-term Debt"
          value={balanceSheet.fundingMix.longTermDebt}
          format="currency"
          decimals={1}
          changes={{ QoQ: 3.2, YoY: 12.5 }}
          size="lg"
        />
        <MetricTile
          title="Cost of Funds"
          value={balanceSheet.costMetrics.costOfFunds}
          format="percentage"
          decimals={2}
          threshold={{ red: 4.0, amber: 3.2, green: 2.6 }}
          inverse={true}
          changes={{ QoQ: 0.52 }}
          size="lg"
        />
      </MetricGroup>

      {/* Deposit Metrics */}
      <MetricGroup title="Deposit Metrics" columns={4}>
        <MetricTile
          title="Retail Deposits"
          value={balanceSheet.deposits.bySegment['Retail']}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.1, YoY: 8.5 }}
        />
        <MetricTile
          title="Commercial Deposits"
          value={balanceSheet.deposits.bySegment['Commercial']}
          format="currency"
          decimals={1}
          changes={{ QoQ: 1.5, YoY: 5.2 }}
        />
        <MetricTile
          title="Institutional Deposits"
          value={balanceSheet.deposits.bySegment['Institutional']}
          format="currency"
          decimals={1}
          changes={{ QoQ: 0.8, YoY: 3.8 }}
        />
        <MetricTile
          title="Cost of Deposits"
          value={balanceSheet.costMetrics.costOfDeposits}
          format="percentage"
          decimals={2}
          threshold={{ red: 3.5, amber: 2.8, green: 2.2 }}
          inverse={true}
          changes={{ QoQ: 0.45 }}
        />
      </MetricGroup>

      {/* Deposit Stability */}
      <MetricGroup title="Deposit Stability" columns={4}>
        <MetricTile
          title="Insured Deposits"
          value={balanceSheet.deposits.insuredVsUninsured.insured}
          format="currency"
          decimals={1}
          subtitle={`${((balanceSheet.deposits.insuredVsUninsured.insured / balanceSheet.deposits.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="Uninsured Deposits"
          value={balanceSheet.deposits.insuredVsUninsured.uninsured}
          format="currency"
          decimals={1}
          subtitle={`${((balanceSheet.deposits.insuredVsUninsured.uninsured / balanceSheet.deposits.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="Operational Deposits"
          value={balanceSheet.deposits.total * 0.68}
          format="currency"
          decimals={1}
          subtitle="68% of total deposits"
        />
        <MetricTile
          title="Excess Deposits"
          value={balanceSheet.deposits.total * 0.32}
          format="currency"
          decimals={1}
          subtitle="32% of total deposits"
        />
      </MetricGroup>

      {/* Composition Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Funding Mix</h2>
          <PieChart
            data={fundingMix}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {fundingMix.map((item, index) => (
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposits by Segment</h2>
          <PieChart
            data={depositComposition}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {depositComposition.map((item, index) => (
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

      {/* Deposit Types */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Types by Product</h2>
        <DataTable
          columns={[
            { header: 'Type', accessor: 'type' },
            { header: 'Balance', accessor: 'value', format: (v: number) => formatCurrency(v, 1) },
            { header: '% of Total', accessor: 'percentage', format: (v: number) => `${v.toFixed(1)}%` },
            { header: 'Avg Rate', accessor: 'rate', format: (v: number) => `${v.toFixed(2)}%` }
          ]}
          data={depositTypes}
        />
      </div>

      {/* Debt Maturity Ladder */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Debt Maturity Profile ($B)</h2>
        <BarChart
          data={debtMaturity}
          bars={[
            { dataKey: 'secured', name: 'Secured', color: '#10b981' },
            { dataKey: 'unsecured', name: 'Unsecured', color: '#f59e0b' },
            { dataKey: 'longTerm', name: 'Long-term Debt', color: '#3b82f6' }
          ]}
          xAxisKey="maturity"
          height={300}
          stacked={true}
          valueFormatter={(value) => formatCurrency(value, 0)}
        />
      </div>

      {/* Cost Trends */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost of Funds Trend (12 Months)</h2>
        <LineChart
          data={costTrend}
          lines={[
            { dataKey: 'deposits', name: 'Deposits', color: '#10b981' },
            { dataKey: 'wholesale', name: 'Wholesale', color: '#f59e0b' },
            { dataKey: 'total', name: 'Total CoF', color: '#3b82f6' }
          ]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) => `${value.toFixed(2)}%`}
        />
      </div>

      {/* Deposits Trend */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Deposits Trend (12Q)</h2>
        <LineChart
          data={depositsTrend}
          lines={[{ dataKey: 'value', name: 'Deposits', color: '#0ea5e9' }]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) => formatCurrency(value, 0)}
        />
      </div>
    </div>
  )
}

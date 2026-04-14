import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import DataTable from '../DataTable'
import { generateBalanceSheetMetrics, generateBalanceSheetTimeSeries, generateLoanComposition } from '../../data/balanceSheetMetrics'
import { formatCurrency } from '../../utils/dataGenerators'
import { subMonths, format } from 'date-fns'

export default function AssetsTab() {
  const balanceSheet = generateBalanceSheetMetrics()
  const loanComposition = generateLoanComposition()
  const loansTrend = generateBalanceSheetTimeSeries('loans', 12)

  // Loan quality by segment
  const loanQuality = [
    { segment: 'Commercial & Industrial', outstanding: balanceSheet.loans.bySegment['Commercial & Industrial'], npl: 0.32, ncr: 0.18, acl: 1.5 },
    { segment: 'Consumer', outstanding: balanceSheet.loans.bySegment['Consumer'], npl: 0.65, ncr: 0.42, acl: 2.1 },
    { segment: 'Real Estate', outstanding: balanceSheet.loans.bySegment['Real Estate'], npl: 0.28, ncr: 0.15, acl: 1.2 },
    { segment: 'Other', outstanding: balanceSheet.loans.bySegment['Other'], npl: 0.48, ncr: 0.25, acl: 1.8 }
  ]

  // NPL trend
  const nplTrend = []
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    nplTrend.push({
      date: format(date, 'MMM yy'),
      npl: 0.45 + (Math.random() - 0.5) * 0.15,
      nco: 0.22 + (Math.random() - 0.5) * 0.08,
      acl: 1.45 + (Math.random() - 0.5) * 0.2
    })
  }

  // Securities portfolio
  const securitiesData = [
    { type: 'US Treasuries', afs: 35, htm: 15, yield: 3.25, duration: 4.2 },
    { type: 'Agency MBS', afs: 25, htm: 18, yield: 3.85, duration: 5.8 },
    { type: 'Corporate Bonds', afs: 15, htm: 8, yield: 4.45, duration: 6.2 },
    { type: 'Municipal Bonds', afs: 10, htm: 4, yield: 3.65, duration: 7.5 },
    { type: 'Other', afs: 5, htm: 3, yield: 3.95, duration: 3.8 }
  ]

  // Unrealized gains/losses trend
  const aociTrend = []
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    aociTrend.push({
      date: format(date, 'MMM yy'),
      afs: -850 + (i * 50) + (Math.random() - 0.5) * 100,
      htm: -420 + (i * 25) + (Math.random() - 0.5) * 50
    })
  }

  return (
    <div className="space-y-8">
      {/* Loan Summary */}
      <MetricGroup title="Loan Portfolio" columns={4}>
        <MetricTile
          title="Total Loans"
          value={balanceSheet.loans.total}
          format="currency"
          decimals={1}
          changes={{ QoQ: 2.1, YoY: 8.3 }}
          size="lg"
        />
        <MetricTile
          title="Fixed Rate Loans"
          value={balanceSheet.loans.fixedFloating.fixed}
          format="currency"
          decimals={1}
          subtitle={`${((balanceSheet.loans.fixedFloating.fixed / balanceSheet.loans.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="Floating Rate Loans"
          value={balanceSheet.loans.fixedFloating.floating}
          format="currency"
          decimals={1}
          subtitle={`${((balanceSheet.loans.fixedFloating.floating / balanceSheet.loans.total) * 100).toFixed(1)}% of total`}
        />
        <MetricTile
          title="Loan-to-Deposit"
          value={balanceSheet.ratios.loanToDeposit}
          format="percentage"
          decimals={1}
          threshold={{ red: 95, amber: 85, green: 80 }}
          inverse={true}
          changes={{ QoQ: 0.3 }}
          size="lg"
        />
      </MetricGroup>

      {/* Credit Quality */}
      <MetricGroup title="Credit Quality" columns={4}>
        <MetricTile
          title="NPL Ratio"
          value={balanceSheet.qualityProxies.nplRatio}
          format="percentage"
          decimals={2}
          threshold={{ red: 1.0, amber: 0.6, green: 0.4 }}
          inverse={true}
          changes={{ QoQ: -0.05, YoY: -0.12 }}
          size="lg"
        />
        <MetricTile
          title="NCO Ratio"
          value={balanceSheet.qualityProxies.ncoRatio}
          format="percentage"
          decimals={2}
          subtitle="Net Charge-offs"
          threshold={{ red: 0.5, amber: 0.3, green: 0.2 }}
          inverse={true}
          changes={{ QoQ: -0.03 }}
          size="lg"
        />
        <MetricTile
          title="ACL Ratio"
          value={balanceSheet.qualityProxies.aclRatio}
          format="percentage"
          decimals={2}
          subtitle="Allowance for Credit Losses"
          changes={{ QoQ: 0.08 }}
          size="lg"
        />
        <MetricTile
          title="Coverage Ratio"
          value={(balanceSheet.qualityProxies.aclRatio / balanceSheet.qualityProxies.nplRatio) * 100}
          format="percentage"
          decimals={0}
          subtitle="ACL / NPL"
          size="lg"
        />
      </MetricGroup>

      {/* Securities Portfolio */}
      <MetricGroup title="Investment Securities" columns={4}>
        <MetricTile
          title="AFS Securities"
          value={balanceSheet.securities.afs}
          format="currency"
          decimals={1}
          subtitle="Available-for-Sale"
          changes={{ QoQ: -1.2, YoY: -5.8 }}
        />
        <MetricTile
          title="HTM Securities"
          value={balanceSheet.securities.htm}
          format="currency"
          decimals={1}
          subtitle="Held-to-Maturity"
          changes={{ QoQ: 0.5, YoY: 2.1 }}
        />
        <MetricTile
          title="Portfolio Duration"
          value={balanceSheet.securities.duration}
          format="number"
          decimals={1}
          subtitle="Years"
        />
        <MetricTile
          title="Portfolio Yield"
          value={2.85}
          format="percentage"
          decimals={2}
          changes={{ QoQ: 0.15 }}
        />
      </MetricGroup>

      {/* Composition Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Composition</h2>
          <PieChart
            data={loanComposition}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            {loanComposition.map((item, index) => (
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fixed vs Floating Rate</h2>
          <PieChart
            data={[
              { name: 'Fixed Rate', value: balanceSheet.loans.fixedFloating.fixed, percentage: (balanceSheet.loans.fixedFloating.fixed / balanceSheet.loans.total) * 100 },
              { name: 'Floating Rate', value: balanceSheet.loans.fixedFloating.floating, percentage: (balanceSheet.loans.fixedFloating.floating / balanceSheet.loans.total) * 100 }
            ]}
            height={250}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fixed Rate:</span>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(balanceSheet.loans.fixedFloating.fixed, 1)}</div>
                <div className="text-gray-500 text-xs">{((balanceSheet.loans.fixedFloating.fixed / balanceSheet.loans.total) * 100).toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Floating Rate:</span>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(balanceSheet.loans.fixedFloating.floating, 1)}</div>
                <div className="text-gray-500 text-xs">{((balanceSheet.loans.fixedFloating.floating / balanceSheet.loans.total) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Quality by Segment */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Credit Quality by Segment</h2>
        <DataTable
          columns={[
            { header: 'Segment', accessor: 'segment' },
            { header: 'Outstanding', accessor: 'outstanding', format: (v: number) => formatCurrency(v, 1) },
            { header: 'NPL Ratio', accessor: 'npl', format: (v: number) => `${v.toFixed(2)}%` },
            { header: 'NCO Ratio', accessor: 'ncr', format: (v: number) => `${v.toFixed(2)}%` },
            { header: 'ACL Ratio', accessor: 'acl', format: (v: number) => `${v.toFixed(2)}%` }
          ]}
          data={loanQuality}
        />
      </div>

      {/* Securities Detail */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Securities Portfolio Detail ($B)</h2>
        <DataTable
          columns={[
            { header: 'Type', accessor: 'type' },
            { header: 'AFS', accessor: 'afs', format: (v: number) => formatCurrency(v, 1) },
            { header: 'HTM', accessor: 'htm', format: (v: number) => formatCurrency(v, 1) },
            { header: 'Avg Yield', accessor: 'yield', format: (v: number) => `${v.toFixed(2)}%` },
            { header: 'Duration', accessor: 'duration', format: (v: number) => `${v.toFixed(1)} yrs` }
          ]}
          data={securitiesData}
        />
      </div>

      {/* Credit Quality Trends */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Credit Quality Trends (12 Months)</h2>
        <LineChart
          data={nplTrend}
          lines={[
            { dataKey: 'npl', name: 'NPL Ratio', color: '#dc2626' },
            { dataKey: 'nco', name: 'NCO Ratio', color: '#f59e0b' },
            { dataKey: 'acl', name: 'ACL Ratio', color: '#10b981' }
          ]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) => `${value.toFixed(2)}%`}
        />
      </div>

      {/* AOCI Trend */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Unrealized Gains/(Losses) Trend ($M)</h2>
        <LineChart
          data={aociTrend}
          lines={[
            { dataKey: 'afs', name: 'AFS Securities', color: '#3b82f6' },
            { dataKey: 'htm', name: 'HTM Securities', color: '#8b5cf6' }
          ]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) => formatCurrency(value, 0)}
        />
      </div>

      {/* Loans Trend */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Loans Trend (12Q)</h2>
        <LineChart
          data={loansTrend}
          lines={[{ dataKey: 'value', name: 'Loans', color: '#10b981' }]}
          xAxisKey="date"
          height={300}
          valueFormatter={(value) => formatCurrency(value, 0)}
        />
      </div>
    </div>
  )
}

import { useState } from 'react'
import { getOperationalMetrics, getRiskMetrics, getEmployeeProductivityData, getTechnologyROIData } from '../data/mockData'
import { formatCurrency } from '../utils/dataGenerators'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/charts/LineChart'
import BarChart from '../components/charts/BarChart'
import DataTable from '../components/DataTable'

export default function OperationalExcellence() {
  const data = getOperationalMetrics()
  const riskData = getRiskMetrics()
  const productivityData = getEmployeeProductivityData()
  const techROIData = getTechnologyROIData()
  const [activeTab, setActiveTab] = useState<'efficiency' | 'incidents' | 'digital' | 'productivity' | 'technology'>('efficiency')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Operational Excellence</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Cost-to-Income Ratio"
          value={data.costToIncome.current}
          format="percentage"
          decimals={1}
          subtitle={`Benchmark: ${data.costToIncome.benchmark}%`}
        />
        <MetricCard
          title="Cost per Transaction"
          value={data.costPerTransaction}
          format="currency"
          decimals={2}
          subtitle="Average processing cost"
        />
        <MetricCard
          title="STP Rate"
          value={data.stpRate}
          format="percentage"
          decimals={1}
          subtitle="Straight-through processing"
        />
        <MetricCard
          title="Automation Rate"
          value={data.automationRate}
          format="percentage"
          decimals={1}
          subtitle="Process automation level"
        />
      </div>

      {/* Tabs */}
      <div className="metric-card mb-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('efficiency')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'efficiency'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Efficiency Metrics
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'incidents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Incidents & Issues
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'digital'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Digital & Technology
            </button>
            <button
              onClick={() => setActiveTab('productivity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'productivity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employee Productivity
            </button>
            <button
              onClick={() => setActiveTab('technology')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'technology'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Technology ROI
            </button>
          </nav>
        </div>

        {activeTab === 'efficiency' && (
          <>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Cost-to-Income Ratio Trend (24 Months)
              </h2>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span className="text-sm text-gray-600">Industry Benchmark: {data.costToIncome.benchmark}%</span>
                </div>
              </div>
              <LineChart
                data={data.costToIncome.trend}
                lines={[{ dataKey: 'value', name: 'Cost-to-Income Ratio', color: '#0ea5e9' }]}
                xAxisKey="date"
                height={300}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h2>
          <BarChart
            data={data.expensesByCategory}
            bars={[
              { dataKey: 'actual', name: 'Actual', color: '#ef4444' },
              { dataKey: 'budget', name: 'Budget', color: '#94a3b8' },
            ]}
            xAxisKey="category"
            height={300}
            valueFormatter={(value) => formatCurrency(value, 1)}
          />
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Process Efficiency Metrics
          </h2>
          <div className="space-y-6 mt-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">STP Rate</span>
                <span className="text-sm font-bold text-gray-900">{data.stpRate}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${data.stpRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Automation Rate</span>
                <span className="text-sm font-bold text-gray-900">{data.automationRate}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${data.automationRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Key Observations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>STP rate exceeds industry average of 92%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>Automation initiatives reducing manual processing by 15%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">•</span>
                  <span>Opportunity to improve cost per transaction through scale</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Operating Expenses: Actual vs Budget
        </h2>
        <DataTable
          columns={[
            { header: 'Category', accessor: 'category' },
            {
              header: 'Actual',
              accessor: 'actual',
              format: (v: number) => formatCurrency(v, 1),
            },
            {
              header: 'Budget',
              accessor: 'budget',
              format: (v: number) => formatCurrency(v, 1),
            },
            {
              header: 'Variance',
              accessor: 'actual',
              format: (v: number, row: any) => formatCurrency(v - row.budget, 1),
            },
            {
              header: 'Variance %',
              accessor: 'actual',
              format: (v: number, row: any) => {
                const variance = ((v - row.budget) / row.budget) * 100
                return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`
              },
            },
          ]}
          data={data.expensesByCategory}
        />
      </div>
          </>
        )}

  {activeTab === 'incidents' && (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Operational Incidents (Last 90 Days)
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Financial Impact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {riskData.operationalEvents.slice(0, 15).map((event, index) => {
              const severityColors = {
                low: 'text-gray-600 bg-gray-100',
                medium: 'text-yellow-700 bg-yellow-100',
                high: 'text-orange-700 bg-orange-100',
                critical: 'text-red-700 bg-red-100',
              }
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {event.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[event.severity]}`}>
                      {event.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.description}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(event.impact, 0)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {activeTab === 'digital' && (
    <div>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💻</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital & Technology</h3>
        <p className="text-gray-600 max-w-lg mx-auto">
          Platform uptime, digital adoption rates, automation metrics, and technology ROI tracking.
        </p>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-lg mx-auto">
          <div className="text-sm text-blue-800">
            <strong>Digital Adoption:</strong> 72% of clients using digital platforms (Target: 85% by 2025)
          </div>
        </div>
      </div>
    </div>
  )}

  {activeTab === 'productivity' && (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Productivity Metrics</h2>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Employees"
          value={productivityData.totalEmployees}
          format="number"
          decimals={0}
        />
        <MetricCard
          title="Revenue per Employee"
          value={productivityData.revenuePerEmployee}
          format="currency"
          decimals={0}
          subtitle="Target: $170K+"
        />
        <MetricCard
          title="AUC per Employee"
          value={productivityData.aucPerEmployee}
          format="currency"
          decimals={1}
          subtitle={`$${(productivityData.aucPerEmployee / 1_000_000_000).toFixed(1)}B per FTE`}
        />
        <MetricCard
          title="Turnover Rate"
          value={productivityData.turnoverRate}
          format="percentage"
          decimals={1}
          subtitle="Industry: 12%"
        />
      </div>

      {/* Department Breakdown */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Productivity by Department</h3>
        <DataTable
          columns={[
            { header: 'Department', accessor: 'department' },
            {
              header: 'Employees',
              accessor: 'employees',
              format: (v: number) => v.toLocaleString()
            },
            {
              header: 'Revenue',
              accessor: 'revenue',
              format: (v: number) => v > 0 ? formatCurrency(v, 1) : 'Cost Center'
            },
            {
              header: 'Revenue per FTE',
              accessor: 'revenuePerFTE',
              format: (v: number) => v > 0 ? formatCurrency(v, 0) : 'N/A'
            },
          ]}
          data={productivityData.byDepartment}
        />
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-2">Average Tenure</div>
          <div className="text-3xl font-bold text-gray-900">{productivityData.avgTenure} years</div>
          <div className="text-xs text-gray-500 mt-1">Higher than industry avg</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-2">Vacancy Rate</div>
          <div className="text-3xl font-bold text-gray-900">{productivityData.vacancyRate}%</div>
          <div className="text-xs text-green-600 mt-1">Within target range</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600 mb-2">Expense per Employee</div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(productivityData.expensePerEmployee, 0)}</div>
          <div className="text-xs text-gray-500 mt-1">All-in cost per FTE</div>
        </div>
      </div>
    </div>
  )}

  {activeTab === 'technology' && (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Technology Investment & ROI</h2>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="Total Tech Spend (YTD)"
          value={techROIData.totalTechSpend}
          format="currency"
          decimals={1}
          subtitle={`${techROIData.techSpendAsPercentRevenue}% of revenue`}
        />
        <MetricCard
          title="Automation Savings (Annual)"
          value={techROIData.automationSavings}
          format="currency"
          decimals={1}
          subtitle="From intelligent automation"
        />
        <MetricCard
          title="Cloud Migration Progress"
          value={techROIData.cloudMigrationProgress}
          format="percentage"
          decimals={0}
          subtitle="Target: 85% by 2025"
        />
      </div>

      {/* Technology Investments Table */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Major Technology Investments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Initiative
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Annual Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Payback Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {techROIData.investments.map((inv, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {inv.initiative}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(inv.investment, 0)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(inv.annualSavings, 0)}
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${inv.roi > 30 ? 'text-green-600' : inv.roi > 20 ? 'text-blue-600' : 'text-gray-900'}`}>
                    {inv.roi.toFixed(1)}%
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {inv.paybackPeriod.toFixed(1)} years
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inv.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : inv.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {inv.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-green-900 mb-2">High ROI Initiatives</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• <strong>AI-Powered Risk Analytics</strong> - 53.6% ROI, 1.9 year payback</li>
            <li>• <strong>Intelligent Automation</strong> - 36.0% ROI, $45M annual savings</li>
            <li>• <strong>Digital Client Portal</strong> - 34.3% ROI, completed and delivering value</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Technology Strategy</h3>
          <p className="text-sm text-blue-800">
            Focus on automation, cloud migration, and AI/ML capabilities to drive efficiency gains.
            Target 20-30% ROI on major initiatives with 2-4 year payback periods. Cloud migration 68% complete,
            delivering infrastructure cost savings and scalability.
          </p>
        </div>
      </div>
    </div>
  )}
      </div>
    </div>
  )
}

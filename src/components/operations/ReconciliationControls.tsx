import { useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts'
import { Shield, CheckCircle2, AlertTriangle, XCircle, TrendingDown } from 'lucide-react'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import { formatCurrency } from '../../utils/dataGenerators'

export default function ReconciliationControls() {
  // Nostro/Vostro Reconciliation Status
  const nostroVostroRecon = useMemo(() => [
    { bank: 'JPMorgan - USD', balance: 8450, unmatchedItems: 8, totalValue: 24.5, oldestDays: 3, status: 'good' },
    { bank: 'Citi - EUR', balance: 3280, unmatchedItems: 5, totalValue: 12.3, oldestDays: 2, status: 'good' },
    { bank: 'BNY Mellon - USD', balance: 5620, unmatchedItems: 12, totalValue: 45.8, oldestDays: 7, status: 'review' },
    { bank: 'HSBC - GBP', balance: 2150, unmatchedItems: 3, totalValue: 8.2, oldestDays: 1, status: 'good' },
    { bank: 'Deutsche Bank - EUR', balance: 1840, unmatchedItems: 18, totalValue: 68.4, oldestDays: 12, status: 'escalated' },
    { bank: 'State Street - USD', balance: 4320, unmatchedItems: 6, totalValue: 18.7, oldestDays: 4, status: 'good' },
    { bank: 'Credit Suisse - CHF', balance: 890, unmatchedItems: 9, totalValue: 32.1, oldestDays: 9, status: 'review' },
  ], [])

  const totalUnmatchedItems = nostroVostroRecon.reduce((sum, item) => sum + item.unmatchedItems, 0)
  const totalUnmatchedValue = nostroVostroRecon.reduce((sum, item) => sum + item.totalValue, 0)
  const accountsEscalated = nostroVostroRecon.filter(item => item.status === 'escalated').length

  // GL Account Reconciliation Status
  const glReconStatus = useMemo(() => [
    { category: 'Cash & Equivalents', total: 24, completed: 24, inProgress: 0, notStarted: 0, breaks: 0, completion: 100 },
    { category: 'Securities', total: 18, completed: 16, inProgress: 2, notStarted: 0, breaks: 2, completion: 89 },
    { category: 'Receivables', total: 32, completed: 28, inProgress: 3, notStarted: 1, breaks: 4, completion: 88 },
    { category: 'Payables', total: 28, completed: 26, inProgress: 2, notStarted: 0, breaks: 3, completion: 93 },
    { category: 'Revenue', total: 15, completed: 13, inProgress: 2, notStarted: 0, breaks: 1, completion: 87 },
    { category: 'Expenses', total: 42, completed: 38, inProgress: 3, notStarted: 1, breaks: 5, completion: 90 },
    { category: 'Equity', total: 8, completed: 8, inProgress: 0, notStarted: 0, breaks: 0, completion: 100 },
  ], [])

  const totalGLAccounts = glReconStatus.reduce((sum, item) => sum + item.total, 0)
  const totalCompleted = glReconStatus.reduce((sum, item) => sum + item.completed, 0)
  const totalBreaks = glReconStatus.reduce((sum, item) => sum + item.breaks, 0)
  const overallCompletion = (totalCompleted / totalGLAccounts) * 100

  // Suspense Account Aging
  const suspenseAging = useMemo(() => [
    { bucket: '0-7 Days', items: 45, value: 12.8, percentage: 32 },
    { bucket: '8-30 Days', items: 28, value: 18.5, percentage: 47 },
    { bucket: '31-60 Days', items: 12, value: 5.4, percentage: 14 },
    { bucket: '61-90 Days', items: 5, value: 2.1, percentage: 5 },
    { bucket: '90+ Days', items: 3, value: 0.8, percentage: 2 },
  ], [])

  const totalSuspenseValue = suspenseAging.reduce((sum, item) => sum + item.value, 0)
  const totalSuspenseItems = suspenseAging.reduce((sum, item) => sum + item.items, 0)
  const aged90Plus = suspenseAging.find(item => item.bucket === '90+ Days')

  // Break Rate Trends
  const breakRateTrends = useMemo(() => [
    { month: 'Jul', cash: 0.2, securities: 1.8, receivables: 2.4, payables: 1.6 },
    { month: 'Aug', cash: 0.1, securities: 1.5, receivables: 2.1, payables: 1.4 },
    { month: 'Sep', cash: 0.3, securities: 1.9, receivables: 2.6, payables: 1.8 },
    { month: 'Oct', cash: 0.2, securities: 1.6, receivables: 2.2, payables: 1.5 },
    { month: 'Nov', cash: 0.1, securities: 1.4, receivables: 2.0, payables: 1.3 },
    { month: 'Dec', cash: 0.2, securities: 1.7, receivables: 2.3, payables: 1.6 },
  ], [])

  // Control Testing Results
  const controlTestResults = useMemo(() => [
    { control: 'Access Controls - ERP', tests: 24, passed: 24, failed: 0, passRate: 100, severity: 'Critical', owner: 'IT Security' },
    { control: 'Journal Entry Approvals', tests: 156, passed: 152, failed: 4, passRate: 97, severity: 'High', owner: 'Controllers' },
    { control: 'Reconciliation Reviews', tests: 89, passed: 86, failed: 3, passRate: 97, severity: 'High', owner: 'Accounting' },
    { control: 'Payment Authorizations', tests: 342, passed: 338, failed: 4, passRate: 99, severity: 'Critical', owner: 'Treasury' },
    { control: 'Segregation of Duties', tests: 45, passed: 43, failed: 2, passRate: 96, severity: 'Critical', owner: 'Compliance' },
    { control: 'Data Backups & Recovery', tests: 12, passed: 12, failed: 0, passRate: 100, severity: 'Critical', owner: 'IT Operations' },
    { control: 'Expense Report Reviews', tests: 287, passed: 280, failed: 7, passRate: 98, severity: 'Medium', owner: 'AP' },
    { control: 'Revenue Recognition', tests: 68, passed: 65, failed: 3, passRate: 96, severity: 'High', owner: 'Revenue Team' },
  ], [])

  const totalTests = controlTestResults.reduce((sum, item) => sum + item.tests, 0)
  const totalPassed = controlTestResults.reduce((sum, item) => sum + item.passed, 0)
  const overallPassRate = (totalPassed / totalTests) * 100
  const criticalFailures = controlTestResults.filter(item => item.severity === 'Critical' && item.failed > 0).length

  // Sub-ledger to GL Tie-outs
  const subLedgerTieouts = useMemo(() => [
    { subLedger: 'Custody Assets', glBalance: 485620, slBalance: 485620, variance: 0, status: 'tied', lastRecon: '12/03/2026' },
    { subLedger: 'Loan Portfolio', glBalance: 28450, slBalance: 28448, variance: 2, status: 'variance', lastRecon: '12/03/2026' },
    { subLedger: 'Deposits', glBalance: 92340, slBalance: 92340, variance: 0, status: 'tied', lastRecon: '12/03/2026' },
    { subLedger: 'Investment Securities', glBalance: 35680, slBalance: 35682, variance: -2, status: 'variance', lastRecon: '12/03/2026' },
    { subLedger: 'Trade Receivables', glBalance: 4850, slBalance: 4865, variance: -15, status: 'investigating', lastRecon: '12/02/2026' },
    { subLedger: 'Accrued Revenue', glBalance: 2340, slBalance: 2340, variance: 0, status: 'tied', lastRecon: '12/03/2026' },
  ], [])

  const totalVariance = Math.abs(subLedgerTieouts.reduce((sum, item) => sum + item.variance, 0))
  const tiedSystems = subLedgerTieouts.filter(item => item.status === 'tied').length
  const tiedPercentage = (tiedSystems / subLedgerTieouts.length) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
      case 'review': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
      case 'escalated': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  const getTieoutStatusColor = (status: string) => {
    switch (status) {
      case 'tied': return { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 }
      case 'variance': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle }
      case 'investigating': return { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle }
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', icon: AlertTriangle }
    }
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <MetricGroup title="Reconciliation & Control Status" columns={5}>
        <MetricTile
          title="GL Recon Completion"
          value={overallCompletion}
          format="percentage"
          decimals={0}
          threshold={{ red: 90, amber: 95, green: 98 }}
        />
        <MetricTile
          title="Unmatched Nostro Items"
          value={totalUnmatchedItems}
          threshold={{ red: 50, amber: 30, green: 20 }}
          inverse={true}
        />
        <MetricTile
          title="Suspense Items 90+ Days"
          value={aged90Plus?.items || 0}
          threshold={{ red: 5, amber: 3, green: 0 }}
          inverse={true}
        />
        <MetricTile
          title="Control Test Pass Rate"
          value={overallPassRate}
          format="percentage"
          decimals={1}
          threshold={{ red: 95, amber: 97, green: 99 }}
        />
        <MetricTile
          title="Sub-ledger Tied %"
          value={tiedPercentage}
          format="percentage"
          decimals={0}
          threshold={{ red: 80, amber: 90, green: 95 }}
        />
      </MetricGroup>

      {/* Nostro/Vostro Reconciliation */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nostro/Vostro Reconciliation Status</h2>
            <p className="text-sm text-gray-600">Bank account reconciliation by correspondent bank ($M)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Account</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unmatched Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Oldest (Days)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nostroVostroRecon.map((item, index) => {
                const colors = getStatusColor(item.status)
                return (
                  <tr key={index} className={`hover:bg-gray-50 ${item.status === 'escalated' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.bank}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.balance, 0)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">
                      <span className={item.unmatchedItems > 10 ? 'text-red-600' : 'text-amber-600'}>
                        {item.unmatchedItems}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.totalValue, 1)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`font-semibold ${item.oldestDays > 7 ? 'text-red-600' : item.oldestDays > 3 ? 'text-amber-600' : 'text-green-600'}`}>
                        {item.oldestDays}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  {formatCurrency(nostroVostroRecon.reduce((sum, item) => sum + item.balance, 0), 0)}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">{totalUnmatchedItems}</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">{formatCurrency(totalUnmatchedValue, 1)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* GL Account Reconciliation Status */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">GL Account Reconciliation Status</h2>
            <p className="text-sm text-gray-600">Completion status by account category</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={glReconStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#10b981" stackId="a" />
                <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" stackId="a" />
                <Bar dataKey="notStarted" name="Not Started" fill="#6b7280" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {glReconStatus.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{item.category}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    item.completion === 100 ? 'bg-green-100 text-green-700' :
                    item.completion >= 90 ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {item.completion}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div>
                    <div className="text-gray-600">Total</div>
                    <div className="font-semibold text-gray-900">{item.total}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Completed</div>
                    <div className="font-semibold text-green-600">{item.completed}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Breaks</div>
                    <div className={`font-semibold ${item.breaks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.breaks}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${item.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suspense Account & Break Rates */}
      <div className="grid grid-cols-2 gap-6">
        {/* Suspense Account Aging */}
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-md font-semibold text-gray-900">Suspense Account Aging</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={suspenseAging}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bucket" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Items', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'Value ($M)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="items" name="Item Count" fill="#3b82f6">
                {suspenseAging.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="value" name="Value ($M)" stroke="#ef4444" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600">Total Items</div>
              <div className="text-lg font-bold text-blue-600">{totalSuspenseItems}</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-xs text-gray-600">Total Value</div>
              <div className="text-lg font-bold text-red-600">{formatCurrency(totalSuspenseValue, 1)}</div>
            </div>
          </div>
        </div>

        {/* Break Rate Trends */}
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-md font-semibold text-gray-900">Break Rate Trends (%)</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={breakRateTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'Break Rate (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cash" name="Cash" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="securities" name="Securities" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="receivables" name="Receivables" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="payables" name="Payables" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Overall trend: </span>
              <span className="font-semibold text-green-600">Improving</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Testing Results */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Control Testing Results (Current Period)</h2>
            <p className="text-sm text-gray-600">Pass/fail rates by control category</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Control</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tests</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Passed</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Failed</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {controlTestResults.map((item, index) => (
                <tr key={index} className={`hover:bg-gray-50 ${item.failed > 0 && item.severity === 'Critical' ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.control}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      item.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.owner}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.tests}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600 text-right">{item.passed}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-right">
                    {item.failed > 0 ? (
                      <span className="text-red-600">{item.failed}</span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-right">
                    <span className={item.passRate >= 99 ? 'text-green-600' : item.passRate >= 95 ? 'text-blue-600' : 'text-amber-600'}>
                      {item.passRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{totalTests}</td>
                <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">{totalPassed}</td>
                <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">{totalTests - totalPassed}</td>
                <td className="px-4 py-3 text-sm font-bold text-blue-600 text-right">{overallPassRate.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {criticalFailures > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-900">
                {criticalFailures} Critical Control{criticalFailures > 1 ? 's' : ''} with Failures - Immediate Action Required
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-ledger to GL Tie-outs */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <CheckCircle2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sub-ledger to GL Tie-outs</h2>
            <p className="text-sm text-gray-600">System balance reconciliation ($M)</p>
          </div>
        </div>

        <div className="space-y-3">
          {subLedgerTieouts.map((item, idx) => {
            const colors = getTieoutStatusColor(item.status)
            const Icon = colors.icon
            return (
              <div key={idx} className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                    <span className="text-sm font-bold text-gray-900">{item.subLedger}</span>
                  </div>
                  <span className="text-xs text-gray-600">Last Recon: {item.lastRecon}</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-600">GL Balance</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(item.glBalance, 0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Sub-ledger Balance</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(item.slBalance, 0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Variance</div>
                    <div className={`font-semibold ${item.variance === 0 ? 'text-green-600' : Math.abs(item.variance) > 10 ? 'text-red-600' : 'text-amber-600'}`}>
                      {item.variance === 0 ? '✓ Tied' : formatCurrency(item.variance, 1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Status</div>
                    <div className={`font-semibold ${colors.text}`}>
                      {item.status === 'tied' ? 'Reconciled' : item.status === 'variance' ? 'Minor Var' : 'Investigating'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Systems Fully Tied:</span>
            <span className="text-lg font-bold text-blue-600">{tiedSystems}/{subLedgerTieouts.length} ({tiedPercentage.toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

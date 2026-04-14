import { useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Calendar, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react'
import MetricTile from '../MetricTile'
import MetricGroup from '../MetricGroup'
import { formatCurrency } from '../../utils/dataGenerators'

export default function MonthEndClose() {
  // Current close status (simulating Day 3 of close)
  const currentCloseDay = 3
  const targetCloseDay = 5

  // Close timeline tracking
  const closeTimeline = useMemo(() => [
    {
      day: 'D+1',
      status: 'completed',
      tasks: [
        { name: 'Cash & Treasury Recon', owner: 'Treasury', status: 'completed', priority: 'critical' },
        { name: 'Trade Settlement Recon', owner: 'Operations', status: 'completed', priority: 'critical' },
        { name: 'FX Rate Updates', owner: 'Treasury', status: 'completed', priority: 'high' },
        { name: 'Intercompany Recon', owner: 'Corporate', status: 'completed', priority: 'high' },
      ],
      completion: 100
    },
    {
      day: 'D+2',
      status: 'completed',
      tasks: [
        { name: 'Revenue Recognition', owner: 'Accounting', status: 'completed', priority: 'critical' },
        { name: 'Expense Accruals', owner: 'Accounting', status: 'completed', priority: 'critical' },
        { name: 'Custody Fee Accruals', owner: 'Product Finance', status: 'completed', priority: 'high' },
        { name: 'Sub-ledger to GL Ties', owner: 'Accounting', status: 'completed', priority: 'critical' },
        { name: 'Nostro Recon', owner: 'Treasury', status: 'completed', priority: 'critical' },
      ],
      completion: 100
    },
    {
      day: 'D+3',
      status: 'in-progress',
      tasks: [
        { name: 'GL Account Recon', owner: 'Accounting', status: 'completed', priority: 'critical' },
        { name: 'P&L Variance Analysis', owner: 'FP&A', status: 'in-progress', priority: 'critical' },
        { name: 'Balance Sheet Review', owner: 'Accounting', status: 'in-progress', priority: 'critical' },
        { name: 'Tax Provision', owner: 'Tax', status: 'completed', priority: 'high' },
        { name: 'Reserves Review', owner: 'Risk', status: 'in-progress', priority: 'high' },
      ],
      completion: 60
    },
    {
      day: 'D+4',
      status: 'pending',
      tasks: [
        { name: 'Management Reporting', owner: 'FP&A', status: 'pending', priority: 'critical' },
        { name: 'Regulatory Reporting', owner: 'Regulatory', status: 'pending', priority: 'critical' },
        { name: 'Final Variance Sign-off', owner: 'Controllers', status: 'pending', priority: 'critical' },
        { name: 'Audit Support Docs', owner: 'Accounting', status: 'pending', priority: 'high' },
      ],
      completion: 0
    },
    {
      day: 'D+5',
      status: 'pending',
      tasks: [
        { name: 'CFO Review', owner: 'CFO Office', status: 'pending', priority: 'critical' },
        { name: 'Board Pack Finalization', owner: 'FP&A', status: 'pending', priority: 'critical' },
        { name: 'Period Lock', owner: 'Accounting', status: 'pending', priority: 'critical' },
      ],
      completion: 0
    },
  ], [])

  // Days to close trend
  const daysToCloseTrend = useMemo(() => [
    { period: 'Jan 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Feb 2026', actual: 6, target: 5, variance: 1 },
    { period: 'Mar 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Apr 2026', actual: 7, target: 5, variance: 2 },
    { period: 'May 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Jun 2026', actual: 6, target: 5, variance: 1 },
    { period: 'Jul 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Aug 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Sep 2026', actual: 6, target: 5, variance: 1 },
    { period: 'Oct 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Nov 2026', actual: 5, target: 5, variance: 0 },
    { period: 'Dec 2026', actual: 3, target: 5, variance: -2, note: 'In Progress' },
  ], [])

  // Outstanding reconciliations
  const outstandingRecons = useMemo(() => [
    { account: 'Cash - USD Main', balance: 12450, unrecItems: 3, oldestItem: 2, status: 'review', owner: 'Treasury' },
    { account: 'Securities Inventory', balance: 8920, unrecItems: 12, oldestItem: 5, status: 'working', owner: 'Operations' },
    { account: 'Client Payables', balance: 4560, unrecItems: 8, oldestItem: 3, status: 'working', owner: 'Operations' },
    { account: 'Accrued Revenue', balance: 2840, unrecItems: 0, oldestItem: 0, status: 'complete', owner: 'Accounting' },
    { account: 'Deferred Revenue', balance: 1920, unrecItems: 0, oldestItem: 0, status: 'complete', owner: 'Accounting' },
    { account: 'Intercompany', balance: 3280, unrecItems: 5, oldestItem: 8, status: 'escalated', owner: 'Corporate' },
    { account: 'AP Accruals', balance: 1450, unrecItems: 2, oldestItem: 1, status: 'review', owner: 'Accounting' },
    { account: 'Suspense Account', balance: 340, unrecItems: 18, oldestItem: 12, status: 'escalated', owner: 'Operations' },
  ], [])

  const totalUnrecItems = outstandingRecons.reduce((sum, item) => sum + item.unrecItems, 0)
  const criticalRecons = outstandingRecons.filter(item => item.oldestItem > 5).length
  const completedRecons = outstandingRecons.filter(item => item.status === 'complete').length
  const reconCompletionPct = (completedRecons / outstandingRecons.length) * 100

  // Journal entry metrics
  const journalMetrics = useMemo(() => [
    { period: 'Jan', total: 1842, manual: 325, automated: 1517, late: 12, avgTime: 3.2 },
    { period: 'Feb', total: 1765, manual: 298, automated: 1467, late: 8, avgTime: 3.0 },
    { period: 'Mar', total: 1923, manual: 342, automated: 1581, late: 15, avgTime: 3.4 },
    { period: 'Apr', total: 1798, manual: 312, automated: 1486, late: 9, avgTime: 3.1 },
    { period: 'May', total: 1856, manual: 328, automated: 1528, late: 11, avgTime: 3.3 },
    { period: 'Jun', total: 2124, manual: 378, automated: 1746, late: 18, avgTime: 3.7 },
  ], [])

  const currentJournals = journalMetrics[journalMetrics.length - 1]
  const manualJournalPct = (currentJournals.manual / currentJournals.total) * 100

  // P&L variances requiring investigation
  const plVariances = useMemo(() => [
    { lineItem: 'Custody Fees', actual: 342.5, budget: 328.0, variance: 14.5, variancePct: 4.4, status: 'investigating', priority: 'medium' },
    { lineItem: 'Investment Management Fees', actual: 185.2, budget: 192.0, variance: -6.8, variancePct: -3.5, status: 'explained', priority: 'low' },
    { lineItem: 'FX Trading Revenue', actual: 78.5, budget: 65.0, variance: 13.5, variancePct: 20.8, status: 'investigating', priority: 'high' },
    { lineItem: 'Net Interest Income', actual: 124.8, budget: 118.0, variance: 6.8, variancePct: 5.8, status: 'explained', priority: 'low' },
    { lineItem: 'Technology Expense', actual: 95.3, budget: 88.0, variance: 7.3, variancePct: 8.3, status: 'investigating', priority: 'high' },
    { lineItem: 'Compensation Expense', actual: 245.6, budget: 250.0, variance: -4.4, variancePct: -1.8, status: 'explained', priority: 'low' },
    { lineItem: 'Professional Services', actual: 42.8, budget: 38.0, variance: 4.8, variancePct: 12.6, status: 'investigating', priority: 'medium' },
  ], [])

  const variancesUnderInvestigation = plVariances.filter(v => v.status === 'investigating').length
  const highPriorityVariances = plVariances.filter(v => v.priority === 'high' && v.status === 'investigating').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in-progress': return 'text-blue-600 bg-blue-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getReconStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
      case 'review': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
      case 'working': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
      case 'escalated': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <MetricGroup title="Close Status" columns={5}>
        <MetricTile
          title="Current Close Day"
          value={currentCloseDay}
          size="lg"
          threshold={{ red: 6, amber: 5, green: 4 }}
          inverse={true}
        />
        <MetricTile
          title="Target Days to Close"
          value={targetCloseDay}
          size="lg"
        />
        <MetricTile
          title="Recon Completion"
          value={reconCompletionPct}
          format="percentage"
          decimals={0}
          threshold={{ red: 70, amber: 85, green: 95 }}
        />
        <MetricTile
          title="Outstanding Recon Items"
          value={totalUnrecItems}
          threshold={{ red: 30, amber: 20, green: 10 }}
          inverse={true}
        />
        <MetricTile
          title="P&L Variances Open"
          value={variancesUnderInvestigation}
          threshold={{ red: 5, amber: 3, green: 0 }}
          inverse={true}
        />
      </MetricGroup>

      {/* Close Timeline */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Close Timeline - December 2026</h2>
            <p className="text-sm text-gray-600">Day-by-day task tracking and completion status</p>
          </div>
        </div>

        <div className="space-y-4">
          {closeTimeline.map((day, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${
              day.status === 'completed' ? 'bg-green-50 border-green-200' :
              day.status === 'in-progress' ? 'bg-blue-50 border-blue-300' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold px-3 py-1 rounded-lg ${getStatusColor(day.status)}`}>
                    {day.day}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          day.completion === 100 ? 'bg-green-500' :
                          day.completion > 0 ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${day.completion}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{day.completion}%</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  day.status === 'completed' ? 'bg-green-100 text-green-700' :
                  day.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {day.status === 'completed' ? 'Completed' : day.status === 'in-progress' ? 'In Progress' : 'Pending'}
                </span>
              </div>

              <div className="space-y-2">
                {day.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <div className="flex items-center gap-3">
                      {getTaskStatusIcon(task.status)}
                      <span className="text-sm font-medium text-gray-900">{task.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        task.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{task.owner}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Days to Close Trend */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Days to Close Trend (Last 12 Months)</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daysToCloseTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="target" name="Target" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Outstanding Reconciliations */}
      <div className="metric-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-100">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Outstanding Reconciliations</h2>
            <p className="text-sm text-gray-600">Accounts requiring reconciliation review or completion</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unrec Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Oldest (Days)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {outstandingRecons.map((item, index) => {
                const colors = getReconStatusColor(item.status)
                return (
                  <tr key={index} className={`hover:bg-gray-50 ${item.status === 'escalated' ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.account}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.balance, 0)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      {item.unrecItems > 0 ? (
                        <span className="text-amber-600">{item.unrecItems}</span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.oldestItem > 0 ? (
                        <span className={`font-semibold ${item.oldestItem > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                          {item.oldestItem}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.owner}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal Entry Metrics & P&L Variances */}
      <div className="grid grid-cols-2 gap-6">
        {/* Journal Entry Metrics */}
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-md font-semibold text-gray-900">Journal Entry Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={journalMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="automated" name="Automated" fill="#10b981" stackId="a" />
              <Bar dataKey="manual" name="Manual" fill="#f59e0b" stackId="a" />
              <Bar dataKey="late" name="Late Entries" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-600">Total JEs</div>
              <div className="text-lg font-bold text-blue-600">{currentJournals.total}</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <div className="text-xs text-gray-600">Manual %</div>
              <div className="text-lg font-bold text-amber-600">{manualJournalPct.toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-xs text-gray-600">Late Entries</div>
              <div className="text-lg font-bold text-red-600">{currentJournals.late}</div>
            </div>
          </div>
        </div>

        {/* P&L Variances */}
        <div className="metric-card">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-md font-semibold text-gray-900">P&L Variance Analysis</h3>
          </div>
          <div className="space-y-2 mb-4 max-h-[280px] overflow-y-auto">
            {plVariances.map((item, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                item.priority === 'high' && item.status === 'investigating' ? 'bg-red-50 border-red-200' :
                item.status === 'investigating' ? 'bg-amber-50 border-amber-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{item.lineItem}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.status === 'explained' ? 'bg-green-100 text-green-700' :
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'explained' ? '✓ Explained' : '● Investigating'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-600">Variance</div>
                    <div className={`font-semibold ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance, 1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Variance %</div>
                    <div className={`font-semibold ${item.variancePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.variancePct >= 0 ? '+' : ''}{item.variancePct.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Priority</div>
                    <div className="font-semibold text-gray-900">{item.priority}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">High Priority Open:</span>
              <span className="font-bold text-red-600">{highPriorityVariances}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

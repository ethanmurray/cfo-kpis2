import { useState, useMemo } from 'react'
import { generateBusinessFlowMetrics, generateClientActivityTimeSeries } from '../../data/businessFlowData'
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../../utils/dataGenerators'
import DrilldownPanel from '../DrilldownPanel'
import LineChart from '../charts/LineChart'

export default function ClientActivityView() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('depositBalance')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterAlerts, setFilterAlerts] = useState(false)

  const businessFlow = useMemo(() => generateBusinessFlowMetrics(), [])

  const sortedClients = useMemo(() => {
    let clients = [...businessFlow.topClients]

    if (filterAlerts) {
      clients = clients.filter(c => c.alerts.length > 0)
    }

    return clients.sort((a, b) => {
      let aVal: number, bVal: number

      switch (sortColumn) {
        case 'depositBalance':
          aVal = a.depositBalance
          bVal = b.depositBalance
          break
        case 'deposit1D':
          aVal = a.depositChange['1D']
          bVal = b.depositChange['1D']
          break
        case 'deposit7D':
          aVal = a.depositChange['7D']
          bVal = b.depositChange['7D']
          break
        case 'custodyAUA':
          aVal = a.custodyAUA
          bVal = b.custodyAUA
          break
        case 'utilization':
          aVal = a.creditLineUtilization
          bVal = b.creditLineUtilization
          break
        case 'alerts':
          aVal = a.alerts.length
          bVal = b.alerts.length
          break
        default:
          return 0
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [businessFlow.topClients, sortColumn, sortDirection, filterAlerts])

  const selectedClientData = selectedClient
    ? businessFlow.topClients.find(c => c.clientId === selectedClient)
    : null

  const clientTimeSeries = selectedClient
    ? generateClientActivityTimeSeries(selectedClient, 7)
    : []

  const totalAlerts = businessFlow.topClients.reduce((sum, c) => sum + c.alerts.length, 0)
  const clientsWithAlerts = businessFlow.topClients.filter(c => c.alerts.length > 0).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Clients Tracked</div>
          <div className="text-2xl font-bold text-gray-900">{businessFlow.topClients.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Clients with Alerts</div>
          <div className="text-2xl font-bold text-amber-600">{clientsWithAlerts}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Alerts</div>
          <div className="text-2xl font-bold text-red-600">{totalAlerts}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Avg Deposit Balance</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(
              businessFlow.topClients.reduce((sum, c) => sum + c.depositBalance, 0) / businessFlow.topClients.length,
              1
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="metric-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="filterAlerts"
                checked={filterAlerts}
                onChange={(e) => setFilterAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="filterAlerts" className="text-sm text-gray-700">
                Show only clients with alerts
              </label>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {sortedClients.length} clients
          </div>
        </div>
      </div>

      {/* Client Activity Table */}
      <div className="metric-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Client Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('depositBalance')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Client
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('depositBalance')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Deposit Balance
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('deposit1D')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Change (1D)
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('deposit7D')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Change (7D)
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('custodyAUA')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Custody AUA
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('utilization')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Credit Util.
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSortColumn('alerts')
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  }}
                >
                  Alerts
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedClients.map(client => (
                <tr
                  key={client.clientId}
                  className={`hover:bg-gray-50 ${client.alerts.length > 0 ? 'bg-amber-50' : ''}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {client.clientName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(client.depositBalance, 1)}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${
                    client.depositChange['1D'] >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {client.depositChange['1D'] > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : client.depositChange['1D'] < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      {client.depositChange['1D'] >= 0 ? '+' : ''}{formatCurrency(client.depositChange['1D'], 0)}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${
                    client.depositChange['7D'] >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {client.depositChange['7D'] >= 0 ? '+' : ''}{formatCurrency(client.depositChange['7D'], 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatCurrency(client.custodyAUA, 1)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.creditLineUtilization > 85
                        ? 'bg-red-100 text-red-800'
                        : client.creditLineUtilization > 75
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {client.creditLineUtilization.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {client.alerts.length > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        {client.alerts.length}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedClient(client.clientId)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Drilldown Panel */}
      <DrilldownPanel
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        title={selectedClientData?.clientName || 'Client Details'}
        width="xl"
      >
        {selectedClientData && (
          <div className="space-y-6">
            {/* Client Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="metric-card">
                <div className="text-sm text-gray-600">Deposit Balance</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(selectedClientData.depositBalance, 1)}
                </div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-600">Custody AUA</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(selectedClientData.custodyAUA, 1)}
                </div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-600">Credit Utilization</div>
                <div className={`text-xl font-bold ${
                  selectedClientData.creditLineUtilization > 85 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {selectedClientData.creditLineUtilization.toFixed(0)}%
                </div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-600">Payments Volume</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedClientData.paymentsVolume}
                </div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-600">Share of Deposits</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedClientData.concentrationMetrics.shareOfDeposits.toFixed(2)}%
                </div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-600">Share of Outflows</div>
                <div className="text-xl font-bold text-gray-900">
                  {selectedClientData.concentrationMetrics.shareOfOutflows.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Deposit Trend */}
            <div className="metric-card">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Deposit Balance (7 Days)</h3>
              <LineChart
                data={clientTimeSeries}
                lines={[{ dataKey: 'value', name: 'Balance', color: '#0ea5e9' }]}
                xAxisKey="date"
                height={250}
                valueFormatter={(v) => formatCurrency(v, 0)}
              />
            </div>

            {/* Alerts */}
            {selectedClientData.alerts.length > 0 && (
              <div className="metric-card">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Active Alerts</h3>
                <div className="space-y-3">
                  {selectedClientData.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`border-l-4 p-3 rounded-r-lg ${
                        alert.severity === 'critical'
                          ? 'border-red-600 bg-red-50'
                          : alert.severity === 'high'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-blue-600 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className={`w-4 h-4 mt-0.5 ${
                          alert.severity === 'critical' || alert.severity === 'high'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`} />
                        <div>
                          <div className="font-medium text-gray-900">
                            {alert.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">{alert.message}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DrilldownPanel>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { generateExceptionsList } from '../../data/businessFlowData'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { format } from 'date-fns'

export default function AlertsView() {
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const exceptions = useMemo(() => generateExceptionsList(), [])

  const filteredExceptions = exceptions.filter(ex => {
    if (severityFilter !== 'all' && ex.severity !== severityFilter) return false
    if (typeFilter !== 'all' && ex.type !== typeFilter) return false
    return true
  })

  const types = ['all', ...Array.from(new Set(exceptions.map(e => e.type)))]
  const criticalCount = exceptions.filter(e => e.severity === 'critical').length
  const highCount = exceptions.filter(e => e.severity === 'high').length
  const mediumCount = exceptions.filter(e => e.severity === 'medium').length

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-600 bg-red-50'
      case 'high':
        return 'border-amber-600 bg-amber-50'
      case 'medium':
        return 'border-blue-600 bg-blue-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Exceptions</div>
          <div className="text-2xl font-bold text-gray-900">{exceptions.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Critical</div>
          <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">High</div>
          <div className="text-2xl font-bold text-amber-600">{highCount}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Medium</div>
          <div className="text-2xl font-bold text-blue-600">{mediumCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="metric-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'critical', 'high', 'medium', 'low'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    severityFilter === sev
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exceptions List */}
      <div className="space-y-3">
        {filteredExceptions.length === 0 ? (
          <div className="metric-card text-center py-8 text-gray-500">
            No exceptions match the selected filters
          </div>
        ) : (
          filteredExceptions.map((exception, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(exception.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(exception.severity)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{exception.entity}</span>
                        <span className="px-2 py-0.5 bg-white bg-opacity-60 text-xs font-medium rounded-full">
                          {exception.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        {exception.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        Metric: {exception.metric} • {format(exception.timestamp, 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      exception.severity === 'critical'
                        ? 'bg-red-200 text-red-900'
                        : exception.severity === 'high'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-blue-200 text-blue-900'
                    }`}>
                      {exception.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

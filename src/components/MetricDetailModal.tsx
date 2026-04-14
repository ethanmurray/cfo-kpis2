import { X, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricDetail {
  label: string
  value: string
  unit?: string
  change?: number
  status?: 'good' | 'warning' | 'critical' | 'neutral'
  description?: string
  historicalData?: Array<{ period: string; value: number; comparison?: number }>
  breakdown?: Array<{ category: string; value: number; percentage: number }>
}

interface MetricDetailModalProps {
  isOpen: boolean
  onClose: () => void
  metric: MetricDetail | null
}

export default function MetricDetailModal({ isOpen, onClose, metric }: MetricDetailModalProps) {
  if (!isOpen || !metric) return null

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good':
        return { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' }
      case 'warning':
        return { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' }
      case 'critical':
        return { bg: '#ef4444', light: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' }
      default:
        return { bg: '#6b7280', light: 'rgba(107, 114, 128, 0.1)', border: 'rgba(107, 114, 128, 0.3)' }
    }
  }

  const colors = getStatusColor(metric.status)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        style={{ backdropFilter: 'blur(4px)' }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-6 border-b flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${colors.light} 0%, rgba(255, 255, 255, 0.5) 100%)`,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: colors.light, border: `2px solid ${colors.border}` }}
              >
                <Info className="h-6 w-6" style={{ color: colors.bg }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--client-primary)' }}>
                  {metric.label}
                </h2>
                {metric.description && (
                  <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                    {metric.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: '#6b7280' }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Current Value Card */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{
                background: `linear-gradient(135deg, ${colors.light} 0%, rgba(255, 255, 255, 0.3) 100%)`,
                border: `2px solid ${colors.border}`,
              }}
            >
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-bold" style={{ color: colors.bg }}>
                  {metric.value}
                  {metric.unit && <span className="text-3xl ml-1">{metric.unit}</span>}
                </div>
                {metric.change !== undefined && (
                  <div className="flex items-center gap-1">
                    {metric.change >= 0 ? (
                      <TrendingUp className={`h-5 w-5 ${metric.change > 0 ? 'text-green-600' : 'text-gray-500'}`} />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`text-lg font-semibold ${
                        metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      {metric.change > 0 ? '+' : ''}
                      {metric.change.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Historical Trend */}
            {metric.historicalData && metric.historicalData.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>
                  Historical Trend
                </h3>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(var(--client-primary-rgb), 0.03) 0%, rgba(255, 255, 255, 0.5) 100%)',
                    border: '1px solid rgba(var(--client-primary-rgb), 0.1)',
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metric.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Actual"
                        stroke="var(--client-primary)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--client-primary)', r: 4 }}
                      />
                      {metric.historicalData[0].comparison !== undefined && (
                        <Line
                          type="monotone"
                          dataKey="comparison"
                          name="Comparison"
                          stroke="var(--client-accent)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: 'var(--client-accent)', r: 3 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Breakdown by Category */}
            {metric.breakdown && metric.breakdown.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--client-primary)' }}>
                  Breakdown by Category
                </h3>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(var(--client-primary-rgb), 0.03) 0%, rgba(255, 255, 255, 0.5) 100%)',
                    border: '1px solid rgba(var(--client-primary-rgb), 0.1)',
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metric.breakdown} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill="var(--client-primary)" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-4 space-y-2">
                    {metric.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: 'rgba(var(--client-primary-rgb), 0.05)' }}
                      >
                        <span className="text-sm font-medium" style={{ color: 'var(--client-primary)' }}>
                          {item.category}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold" style={{ color: '#1f2937' }}>
                            {item.value.toLocaleString()}
                          </span>
                          <span className="text-xs" style={{ color: '#6b7280' }}>
                            ({item.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights */}
            <div
              className="rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(var(--client-accent-rgb), 0.1) 0%, rgba(var(--client-accent-rgb), 0.05) 100%)',
                border: '1px solid rgba(var(--client-accent-rgb), 0.3)',
              }}
            >
              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--client-accent)' }}>
                💡 Key Insights
              </h3>
              <ul className="space-y-1 text-sm" style={{ color: '#6b7280' }}>
                {metric.change && metric.change > 0 && (
                  <li>• Metric trending positively with {metric.change.toFixed(1)}% growth</li>
                )}
                {metric.change && metric.change < 0 && (
                  <li>• Metric declining by {Math.abs(metric.change).toFixed(1)}% - review drivers</li>
                )}
                {metric.breakdown && (
                  <li>
                    • Largest contributor: {metric.breakdown[0]?.category} (
                    {metric.breakdown[0]?.percentage.toFixed(1)}%)
                  </li>
                )}
                <li>• Click on related metrics to drill deeper into underlying factors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

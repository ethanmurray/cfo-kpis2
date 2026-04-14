import { useState } from 'react'

export interface Insight {
  type: 'attention' | 'positive' | 'context' | 'recommendation'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  metrics?: { label: string; value: string; change?: string }[]
  actions?: string[]
}

interface ExecutiveInsightsProps {
  insights: Insight[]
  period?: string
}

export default function ExecutiveInsights({ insights, period = 'December 2026' }: ExecutiveInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<string>('all')

  const toggleInsight = (insightId: string) => {
    const newExpanded = new Set(expandedInsights)
    if (newExpanded.has(insightId)) {
      newExpanded.delete(insightId)
    } else {
      newExpanded.add(insightId)
    }
    setExpandedInsights(newExpanded)
  }

  // Merge attention and recommendation into alert category
  const alertCount = insights.filter(i => i.type === 'attention' || i.type === 'recommendation').length
  const positiveCount = insights.filter(i => i.type === 'positive').length
  const contextCount = insights.filter(i => i.type === 'context').length

  const filteredInsights = filterType === 'all'
    ? insights
    : filterType === 'alert'
    ? insights.filter(i => i.type === 'attention' || i.type === 'recommendation')
    : insights.filter(i => i.type === filterType)

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'attention': return {
        label: 'ALERT',
        color: '#dc2626'
      }
      case 'positive': return {
        label: 'WIN',
        color: '#059669'
      }
      case 'recommendation': return {
        label: 'ACTION',
        color: 'var(--client-accent)'
      }
      case 'context': return {
        label: 'INFO',
        color: '#2563eb'
      }
      default: return {
        label: 'DATA',
        color: '#6b7280'
      }
    }
  }


  return (
    <div className="mb-6">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: '#ffffff',
          border: '2px solid var(--client-primary)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 cursor-pointer border-b"
          style={{
            background: 'linear-gradient(135deg, var(--client-primary) 0%, var(--client-primary-dark) 100%)',
            borderColor: 'var(--client-accent)'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--client-accent)' }}>
                [AI]
              </span>
              <span className="text-sm font-bold tracking-wide" style={{ color: '#FFFFFF' }}>
                INTELLIGENCE
              </span>
              <div className="h-3 w-px" style={{ background: 'var(--client-accent)', opacity: 0.4 }} />
              <span className="text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {period}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                •
              </span>
              <span className="text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {alertCount} ALERT{alertCount !== 1 ? 'S' : ''} • {positiveCount} WIN{positiveCount !== 1 ? 'S' : ''} • {contextCount} INFO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: 'var(--client-accent)' }}>
                {isExpanded ? '[-]' : '[+]'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div style={{ background: '#f9fafb' }}>
            {/* Filter Tabs */}
            <div
              className="px-4 py-2"
              style={{
                borderBottom: '1px solid #e5e7eb',
                background: '#ffffff'
              }}
            >
              <div className="flex gap-1 overflow-x-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className="px-3 py-1 text-xs font-bold tracking-wide whitespace-nowrap transition-all"
                  style={{
                    background: filterType === 'all' ? 'var(--client-primary)' : 'transparent',
                    color: filterType === 'all' ? '#ffffff' : '#6b7280',
                    border: filterType === 'all' ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  ALL ({insights.length})
                </button>
                <button
                  onClick={() => setFilterType('alert')}
                  className="px-3 py-1 text-xs font-bold tracking-wide whitespace-nowrap transition-all"
                  style={{
                    background: filterType === 'alert' ? '#dc2626' : 'transparent',
                    color: filterType === 'alert' ? '#ffffff' : '#6b7280',
                    border: filterType === 'alert' ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  ALERTS ({alertCount})
                </button>
                <button
                  onClick={() => setFilterType('positive')}
                  className="px-3 py-1 text-xs font-bold tracking-wide whitespace-nowrap transition-all"
                  style={{
                    background: filterType === 'positive' ? '#059669' : 'transparent',
                    color: filterType === 'positive' ? '#ffffff' : '#6b7280',
                    border: filterType === 'positive' ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  WINS ({positiveCount})
                </button>
                <button
                  onClick={() => setFilterType('context')}
                  className="px-3 py-1 text-xs font-bold tracking-wide whitespace-nowrap transition-all"
                  style={{
                    background: filterType === 'context' ? '#2563eb' : 'transparent',
                    color: filterType === 'context' ? '#ffffff' : '#6b7280',
                    border: filterType === 'context' ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  INFO ({contextCount})
                </button>
              </div>
            </div>

            {/* Insights List */}
            <div className="max-h-96 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {filteredInsights.map((insight, idx) => {
                const insightId = `${insight.type}-${idx}`
                const isInsightExpanded = expandedInsights.has(insightId)
                const badge = getTypeBadge(insight.type)

                return (
                  <div
                    key={idx}
                    className="border-b transition-all"
                    style={{
                      borderColor: '#e5e7eb',
                      background: isInsightExpanded ? '#ffffff' : '#f9fafb'
                    }}
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white transition-colors"
                      onClick={() => toggleInsight(insightId)}
                    >
                      <span
                        className="text-xs font-bold tracking-wider flex-shrink-0"
                        style={{ color: badge.color }}
                      >
                        [{badge.label}]
                      </span>
                      <span className="text-xs flex-1 min-w-0 truncate font-medium" style={{ color: '#111827' }}>
                        {insight.title}
                      </span>
                      {!isInsightExpanded && insight.metrics && insight.metrics.length > 0 && (
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--client-primary)' }}>
                          {insight.metrics[0].value}
                        </span>
                      )}
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--client-accent)' }}>
                        {isInsightExpanded ? '[-]' : '[+]'}
                      </span>
                    </div>

                    {isInsightExpanded && (
                      <div
                        className="px-3 py-2 border-t"
                        style={{
                          background: '#ffffff',
                          borderColor: '#e5e7eb'
                        }}
                      >
                        <p className="text-xs leading-tight mb-2" style={{ color: '#4b5563', lineHeight: '1.5' }}>
                          {insight.description}
                        </p>

                        {insight.metrics && insight.metrics.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            {insight.metrics.map((metric, metricIdx) => (
                              <div
                                key={metricIdx}
                                className="p-2 border"
                                style={{
                                  background: '#f9fafb',
                                  borderColor: '#e5e7eb'
                                }}
                              >
                                <div className="text-xs font-bold tracking-wide mb-0.5" style={{ color: '#6b7280' }}>
                                  {metric.label.toUpperCase()}
                                </div>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-bold" style={{ color: '#111827' }}>
                                    {metric.value}
                                  </span>
                                  {metric.change && (
                                    <span
                                      className="text-xs font-bold"
                                      style={{
                                        color: metric.change.startsWith('+')
                                          ? '#059669'
                                          : metric.change.startsWith('-')
                                          ? '#dc2626'
                                          : '#6b7280'
                                      }}
                                    >
                                      {metric.change}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {insight.actions && insight.actions.length > 0 && (
                          <div
                            className="p-2 border-t"
                            style={{
                              borderColor: '#e5e7eb'
                            }}
                          >
                            <div className="text-xs font-bold tracking-wider mb-1.5" style={{ color: 'var(--client-primary)' }}>
                              ACTIONS:
                            </div>
                            <ul className="space-y-1">
                              {insight.actions.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-start gap-2 text-xs" style={{ color: '#4b5563', lineHeight: '1.5' }}>
                                  <span style={{ color: 'var(--client-accent)' }}>•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

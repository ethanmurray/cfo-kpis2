interface CompactMetricCardProps {
  label: string
  value: string | number
  change?: number
  trend?: number[]
  status?: 'good' | 'warning' | 'bad' | 'neutral'
  target?: string | number
  unit?: string
  onClick?: () => void
  description?: string
}

export default function CompactMetricCard({
  label,
  value,
  change,
  trend,
  status = 'neutral',
  target,
  unit = '',
  onClick,
  description
}: CompactMetricCardProps) {
  const statusStyles = {
    good: {
      bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
      border: 'rgba(16, 185, 129, 0.2)',
      accent: '#10b981'
    },
    warning: {
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)',
      border: 'rgba(245, 158, 11, 0.2)',
      accent: '#f59e0b'
    },
    bad: {
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
      border: 'rgba(239, 68, 68, 0.2)',
      accent: '#ef4444'
    },
    neutral: {
      bg: 'linear-gradient(135deg, #ffffff 0%, rgba(248, 249, 250, 0.5) 100%)',
      border: 'rgba(0, 77, 53, 0.08)',
      accent: '#006747'
    }
  }

  const style = statusStyles[status]
  const changeColor = change && change > 0 ? '#10b981' : change && change < 0 ? '#ef4444' : '#6b7280'

  return (
    <div
      className={`p-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
      onClick={onClick}
      title={onClick ? `Click to view ${label} details` : undefined}
    >
      <div className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: '#6b7280', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-2xl font-bold tracking-tight" style={{ color: style.accent }}>
          {value}{unit}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{
            color: changeColor,
            backgroundColor: `${changeColor}15`
          }}>
            {change > 0 ? '↑' : change < 0 ? '↓' : '→'}{Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      {target && (
        <div className="text-xs font-medium" style={{ color: '#9ca3af' }}>
          Target: <span style={{ color: '#D4AF37' }}>{target}{unit}</span>
        </div>
      )}
      {trend && trend.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(0, 77, 53, 0.05)' }}>
          <svg width="100%" height="24" className="overflow-visible">
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={style.accent} stopOpacity="0.3" />
                <stop offset="100%" stopColor={style.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={(() => {
                const minVal = Math.min(...trend)
                const maxVal = Math.max(...trend)
                const range = maxVal - minVal || 1
                const points = trend.map((val, idx) => {
                  const x = (idx / (trend.length - 1)) * 100
                  const y = 24 - ((val - minVal) / range) * 20
                  return `${x},${y}`
                }).join(' ')
                return `M 0,24 L ${points} L 100,24 Z`
              })()}
              fill={`url(#gradient-${label})`}
            />
            {/* Line */}
            {trend.map((val, idx) => {
              if (idx >= trend.length - 1) return null
              const x = (idx / (trend.length - 1)) * 100
              const nextX = ((idx + 1) / (trend.length - 1)) * 100
              const minVal = Math.min(...trend)
              const maxVal = Math.max(...trend)
              const range = maxVal - minVal || 1
              const y = 24 - ((val - minVal) / range) * 20
              const nextY = 24 - ((trend[idx + 1] - minVal) / range) * 20

              return (
                <line
                  key={idx}
                  x1={`${x}%`}
                  y1={y}
                  x2={`${nextX}%`}
                  y2={nextY}
                  stroke={style.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>
        </div>
      )}
    </div>
  )
}

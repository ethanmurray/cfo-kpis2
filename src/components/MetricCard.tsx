import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../utils/dataGenerators'

interface MetricCardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  format?: 'currency' | 'percentage' | 'number'
  decimals?: number
  subtitle?: string
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel,
  format = 'number',
  decimals = 0,
  subtitle,
}: MetricCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val

    switch (format) {
      case 'currency':
        return formatCurrency(val, decimals)
      case 'percentage':
        return formatPercentage(val, decimals)
      default:
        return val.toLocaleString(undefined, { maximumFractionDigits: decimals })
    }
  }

  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change !== undefined && change === 0

  return (
    <div className="metric-card">
      <div className="card-title">{title}</div>
      <div className="metric-value">{formatValue(value)}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
          {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
          {isNeutral && <Minus className="h-4 w-4 text-gray-600" />}
          <span
            className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {change > 0 && '+'}{change.toFixed(2)}%
          </span>
          {changeLabel && <span className="text-sm text-gray-500">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}

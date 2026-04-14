import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '../utils/dataGenerators'

interface VarianceCardProps {
  title: string
  actual: number
  comparison: number
  comparisonLabel: string
  format?: 'currency' | 'percentage' | 'number' | 'bps'
  decimals?: number
  favorable?: 'higher' | 'lower' // Is higher or lower variance favorable?
  subtitle?: string
}

export default function VarianceCard({
  title,
  actual,
  comparison,
  comparisonLabel,
  format = 'currency',
  decimals = 1,
  favorable = 'higher',
  subtitle,
}: VarianceCardProps) {
  const variance = actual - comparison
  const variancePercent = comparison !== 0 ? (variance / Math.abs(comparison)) * 100 : 0

  const isFavorable = favorable === 'higher' ? variance > 0 : variance < 0
  const isNeutral = Math.abs(variancePercent) < 0.5

  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value, decimals)
      case 'percentage':
        return `${value.toFixed(decimals)}%`
      case 'bps':
        return `${value.toFixed(0)} bps`
      case 'number':
        return value.toLocaleString(undefined, { maximumFractionDigits: decimals })
      default:
        return value.toString()
    }
  }

  return (
    <div className="metric-card">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mb-3">
        {formatValue(actual)}
      </div>

      {/* Comparison Row */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
        <span className="text-xs text-gray-500">{comparisonLabel}</span>
        <span className="text-sm font-medium text-gray-700">{formatValue(comparison)}</span>
      </div>

      {/* Variance */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Variance</span>
        <div className="flex items-center gap-2">
          {isNeutral ? (
            <Minus className="w-4 h-4 text-gray-400" />
          ) : isFavorable ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span
            className={`text-sm font-semibold ${
              isNeutral
                ? 'text-gray-600'
                : isFavorable
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {variance > 0 && '+'}
            {formatValue(variance)}
          </span>
          <span
            className={`text-xs ${
              isNeutral
                ? 'text-gray-500'
                : isFavorable
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            ({variancePercent > 0 && '+'}{variancePercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      {subtitle && (
        <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
      )}
    </div>
  )
}

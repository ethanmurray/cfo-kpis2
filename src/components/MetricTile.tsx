import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../utils/dataGenerators'
import { RAGThreshold, MetricChange } from '../types/metrics'

interface MetricTileProps {
  title: string
  value: number | string
  format?: 'currency' | 'percentage' | 'number' | 'basis-points'
  decimals?: number
  subtitle?: string
  changes?: MetricChange
  threshold?: RAGThreshold
  inverse?: boolean  // If true, lower is better (e.g., cost metrics)
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function MetricTile({
  title,
  value,
  format = 'number',
  decimals = 2,
  subtitle,
  changes,
  threshold,
  inverse = false,
  onClick,
  size = 'md'
}: MetricTileProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val

    switch (format) {
      case 'currency':
        return formatCurrency(val, decimals)
      case 'percentage':
        return formatPercentage(val, decimals)
      case 'basis-points':
        return `${val.toFixed(decimals)} bps`
      default:
        return val.toLocaleString(undefined, { maximumFractionDigits: decimals })
    }
  }

  const getRAGStatus = (val: number): 'red' | 'amber' | 'green' | 'none' => {
    if (!threshold) return 'none'

    if (inverse) {
      // Lower is better (e.g., cost metrics)
      if (val <= threshold.green) return 'green'
      if (val <= threshold.amber) return 'amber'
      return 'red'
    } else {
      // Higher is better (e.g., capital ratios)
      if (val >= threshold.green) return 'green'
      if (val >= threshold.amber) return 'amber'
      return 'red'
    }
  }

  const numericValue = typeof value === 'number' ? value : 0
  const ragStatus = getRAGStatus(numericValue)

  const ragColors = {
    red: 'bg-red-50 border-red-200',
    amber: 'bg-amber-50 border-amber-200',
    green: 'bg-green-50 border-green-200',
    none: 'bg-white border-gray-200'
  }

  const ragIndicatorColors = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    none: 'bg-gray-300'
  }

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const titleSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div
      className={`${ragColors[ragStatus]} ${sizeClasses[size]} rounded-lg border-2 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={`${titleSizeClasses[size]} font-medium text-gray-700`}>
          {title}
        </div>
        {ragStatus !== 'none' && (
          <div
            className={`${ragIndicatorColors[ragStatus]} w-3 h-3 rounded-full flex-shrink-0`}
            title={`Status: ${ragStatus.toUpperCase()}`}
          />
        )}
      </div>

      <div className={`${valueSizeClasses[size]} font-bold text-gray-900 mt-2`}>
        {formatValue(value)}
      </div>

      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}

      {changes && (
        <div className="mt-3 space-y-1">
          {changes.DoD !== undefined && (
            <ChangeIndicator value={changes.DoD} label="DoD" />
          )}
          {changes.WoW !== undefined && (
            <ChangeIndicator value={changes.WoW} label="WoW" />
          )}
          {changes.MoM !== undefined && (
            <ChangeIndicator value={changes.MoM} label="MoM" />
          )}
          {changes.QoQ !== undefined && (
            <ChangeIndicator value={changes.QoQ} label="QoQ" />
          )}
          {changes.YoY !== undefined && (
            <ChangeIndicator value={changes.YoY} label="YoY" />
          )}
        </div>
      )}

      {threshold && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Target:</span>
              <span className="font-medium">{threshold.green}{format === 'percentage' ? '%' : ''}</span>
            </div>
            {ragStatus !== 'green' && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">
                  {inverse
                    ? `${(numericValue - threshold.green).toFixed(1)} above target`
                    : `${(threshold.green - numericValue).toFixed(1)} below target`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ChangeIndicator({ value, label }: { value: number; label: string }) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  return (
    <div className="flex items-center gap-1">
      {isPositive && <TrendingUp className="h-3 w-3 text-green-600" />}
      {isNegative && <TrendingDown className="h-3 w-3 text-red-600" />}
      {isNeutral && <Minus className="h-3 w-3 text-gray-600" />}
      <span
        className={`text-xs font-medium ${
          isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
        }`}
      >
        {value > 0 && '+'}{value.toFixed(2)}%
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '../utils/dataGenerators'

export interface VarianceRow {
  category: string
  actual: number
  comparison: number
  favorable?: 'higher' | 'lower'
}

interface VarianceAnalysisTableProps {
  title: string
  comparisonLabel: string
  rows: VarianceRow[]
  format?: 'currency' | 'percentage' | 'number'
  decimals?: number
}

export default function VarianceAnalysisTable({
  title,
  comparisonLabel,
  rows,
  format = 'currency',
  decimals = 1,
}: VarianceAnalysisTableProps) {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value, decimals)
      case 'percentage':
        return `${value.toFixed(decimals)}%`
      case 'number':
        return value.toLocaleString(undefined, { maximumFractionDigits: decimals })
      default:
        return value.toString()
    }
  }

  const calculateVariance = (row: VarianceRow) => {
    const variance = row.actual - row.comparison
    const variancePercent = row.comparison !== 0 ? (variance / Math.abs(row.comparison)) * 100 : 0
    const isFavorable = row.favorable === 'higher' ? variance > 0 : variance < 0
    const isNeutral = Math.abs(variancePercent) < 0.5

    return { variance, variancePercent, isFavorable, isNeutral }
  }

  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actual
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                {comparisonLabel}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Variance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Variance %
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((row, index) => {
              const { variance, variancePercent, isFavorable, isNeutral } = calculateVariance(row)

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {row.category}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-900">
                    {formatValue(row.actual)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-right text-gray-700">
                    {formatValue(row.comparison)}
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-sm text-right font-semibold ${
                    isNeutral ? 'text-gray-600' : isFavorable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {variance > 0 && '+'}
                    {formatValue(variance)}
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-sm text-right font-semibold ${
                    isNeutral ? 'text-gray-600' : isFavorable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {variancePercent > 0 && '+'}
                    {variancePercent.toFixed(1)}%
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {isNeutral ? (
                      <Minus className="w-5 h-5 text-gray-400 mx-auto" />
                    ) : isFavorable ? (
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
          {/* Total Row */}
          <tfoot className="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                {formatValue(rows.reduce((sum, row) => sum + row.actual, 0))}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-700">
                {formatValue(rows.reduce((sum, row) => sum + row.comparison, 0))}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                {formatValue(rows.reduce((sum, row) => sum + (row.actual - row.comparison), 0))}
              </td>
              <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                {(
                  ((rows.reduce((sum, row) => sum + row.actual, 0) - rows.reduce((sum, row) => sum + row.comparison, 0)) /
                  rows.reduce((sum, row) => sum + row.comparison, 0)) * 100
                ).toFixed(1)}%
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

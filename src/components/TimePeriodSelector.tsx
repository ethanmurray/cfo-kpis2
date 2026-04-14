import { useTimePeriod, TimePeriodType } from '../contexts/TimePeriodContext'

interface TimePeriodSelectorProps {
  showComparison?: boolean
  compact?: boolean
}

export default function TimePeriodSelector({ showComparison = true, compact = false }: TimePeriodSelectorProps) {
  const { periodType, setPeriodType, comparisonPeriod, setComparisonPeriod } = useTimePeriod()

  const periods: TimePeriodType[] = ['QTD', 'YTD', '1Y', '3Y', '5Y']

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="inline-flex rounded-md shadow-sm">
          {periods.map((period, index) => (
            <button
              key={period}
              onClick={() => setPeriodType(period)}
              className={`
                px-3 py-1.5 text-xs font-medium
                ${index === 0 ? 'rounded-l-md' : ''}
                ${index === periods.length - 1 ? 'rounded-r-md' : ''}
                ${
                  periodType === period
                    ? 'bg-blue-600 text-white z-10'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }
                ${index > 0 && periodType !== period && periodType !== periods[index - 1] ? '-ml-px' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              {period}
            </button>
          ))}
        </div>

        {showComparison && (
          <select
            value={comparisonPeriod || ''}
            onChange={(e) => setComparisonPeriod(e.target.value as 'PY' | 'PP' | 'Budget' | null)}
            className="block w-32 rounded-md border-gray-300 py-1.5 pl-2 pr-8 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="Budget">vs Budget</option>
            <option value="PY">vs Prior Year</option>
            <option value="PP">vs Prior Period</option>
            <option value="">No Comparison</option>
          </select>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Time Period Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Period:</span>
          <div className="inline-flex rounded-md shadow-sm">
            {periods.map((period, index) => (
              <button
                key={period}
                onClick={() => setPeriodType(period)}
                className={`
                  px-4 py-2 text-sm font-medium
                  ${index === 0 ? 'rounded-l-md' : ''}
                  ${index === periods.length - 1 ? 'rounded-r-md' : ''}
                  ${
                    periodType === period
                      ? 'bg-blue-600 text-white z-10'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }
                  ${index > 0 && periodType !== period && periodType !== periods[index - 1] ? '-ml-px' : ''}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Selector */}
        {showComparison && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Compare to:</span>
            <select
              value={comparisonPeriod || ''}
              onChange={(e) => setComparisonPeriod(e.target.value as 'PY' | 'PP' | 'Budget' | null)}
              className="block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Budget">Budget</option>
              <option value="PY">Prior Year</option>
              <option value="PP">Prior Period</option>
              <option value="">None</option>
            </select>
          </div>
        )}
      </div>

      {/* Period Info */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Current period: <span className="font-medium text-gray-700">{periodType}</span>
          </span>
          {showComparison && comparisonPeriod && (
            <span>
              Comparing to: <span className="font-medium text-gray-700">
                {comparisonPeriod === 'PY' && 'Prior Year'}
                {comparisonPeriod === 'PP' && 'Prior Period'}
                {comparisonPeriod === 'Budget' && 'Budget'}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

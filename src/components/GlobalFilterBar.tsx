import { useTimePeriod } from '../contexts/TimePeriodContext'
import type { TimePeriodType, ComparisonMode, BusinessUnit, Geography, ClientSegment } from '../contexts/TimePeriodContext'
import { Calendar, TrendingUp, Building2, Globe, Users, X } from 'lucide-react'
import { useState } from 'react'

export default function GlobalFilterBar() {
  const {
    periodType,
    setPeriodType,
    comparisonMode,
    setComparisonMode,
    businessUnit,
    setBusinessUnit,
    geography,
    setGeography,
    clientSegment,
    setClientSegment,
  } = useTimePeriod()

  const [isExpanded, setIsExpanded] = useState(false)

  const periods: { value: TimePeriodType; label: string }[] = [
    { value: 'QTD', label: 'QTD' },
    { value: 'YTD', label: 'YTD' },
    { value: '1Y', label: 'Last 12M' },
    { value: '3Y', label: '3 Years' },
    { value: '5Y', label: '5 Years' },
  ]

  const comparisons: { value: ComparisonMode; label: string }[] = [
    { value: null, label: 'No Compare' },
    { value: 'PY', label: 'vs Prior Year' },
    { value: 'Budget', label: 'vs Budget' },
    { value: 'Forecast', label: 'vs Forecast' },
    { value: 'Peer', label: 'vs Peer Avg' },
  ]

  const businessUnits: BusinessUnit[] = [
    'All',
    'Wealth Management',
    'Asset Management',
    'Asset Servicing',
    'Corporate & Institutional',
  ]

  const geographies: Geography[] = ['All', 'North America', 'EMEA', 'APAC', 'Latin America']

  const clientSegments: ClientSegment[] = [
    'All',
    'Ultra HNW',
    'Family Office',
    'Institutional',
    'Corporate',
    'Endowments & Foundations',
  ]

  const hasActiveFilters =
    businessUnit !== 'All' || geography !== 'All' || clientSegment !== 'All'

  const clearAllFilters = () => {
    setBusinessUnit('All')
    setGeography('All')
    setClientSegment('All')
  }

  return (
    <div
      className="sticky top-0 z-40 shadow-md"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 77, 53, 0.97) 0%, rgba(0, 56, 41, 0.97) 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="px-6 py-3">
        {/* Primary Row - Always Visible */}
        <div className="flex items-center gap-4">
          {/* Time Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" style={{ color: '#D4AF37' }} />
            <div className="flex gap-1">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setPeriodType(period.value)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor:
                      periodType === period.value
                        ? 'rgba(212, 175, 55, 0.25)'
                        : 'rgba(255, 255, 255, 0.05)',
                    color: periodType === period.value ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                    border:
                      periodType === period.value
                        ? '1px solid rgba(212, 175, 55, 0.5)'
                        : '1px solid transparent',
                  }}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />

          {/* Comparison Mode Selector */}
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: '#D4AF37' }} />
            <select
              value={comparisonMode || ''}
              onChange={(e) => setComparisonMode((e.target.value || null) as ComparisonMode)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
              style={{
                backgroundColor: comparisonMode ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: comparisonMode ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                borderColor: comparisonMode ? 'rgba(212, 175, 55, 0.5)' : 'transparent',
              }}
            >
              {comparisons.map((comp) => (
                <option key={comp.label} value={comp.value || ''} style={{ backgroundColor: '#004d35', color: '#fff' }}>
                  {comp.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }} />

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{
              backgroundColor: hasActiveFilters || isExpanded ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: hasActiveFilters || isExpanded ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
              border: hasActiveFilters || isExpanded ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid transparent',
            }}
          >
            <span>{isExpanded ? 'Hide Filters' : 'More Filters'}</span>
            {hasActiveFilters && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#D4AF37' }}
              />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all hover:bg-red-500/20"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <X className="h-3 w-3" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Expanded Filters Row */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Business Unit Filter */}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" style={{ color: '#D4AF37' }} />
                <select
                  value={businessUnit}
                  onChange={(e) => setBusinessUnit(e.target.value as BusinessUnit)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
                  style={{
                    backgroundColor: businessUnit !== 'All' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: businessUnit !== 'All' ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: businessUnit !== 'All' ? 'rgba(212, 175, 55, 0.5)' : 'transparent',
                  }}
                >
                  {businessUnits.map((unit) => (
                    <option key={unit} value={unit} style={{ backgroundColor: '#004d35', color: '#fff' }}>
                      {unit === 'All' ? 'All Business Units' : unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Geography Filter */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" style={{ color: '#D4AF37' }} />
                <select
                  value={geography}
                  onChange={(e) => setGeography(e.target.value as Geography)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
                  style={{
                    backgroundColor: geography !== 'All' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: geography !== 'All' ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: geography !== 'All' ? 'rgba(212, 175, 55, 0.5)' : 'transparent',
                  }}
                >
                  {geographies.map((geo) => (
                    <option key={geo} value={geo} style={{ backgroundColor: '#004d35', color: '#fff' }}>
                      {geo === 'All' ? 'All Regions' : geo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Segment Filter */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: '#D4AF37' }} />
                <select
                  value={clientSegment}
                  onChange={(e) => setClientSegment(e.target.value as ClientSegment)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
                  style={{
                    backgroundColor: clientSegment !== 'All' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: clientSegment !== 'All' ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: clientSegment !== 'All' ? 'rgba(212, 175, 55, 0.5)' : 'transparent',
                  }}
                >
                  {clientSegments.map((segment) => (
                    <option key={segment} value={segment} style={{ backgroundColor: '#004d35', color: '#fff' }}>
                      {segment === 'All' ? 'All Client Segments' : segment}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

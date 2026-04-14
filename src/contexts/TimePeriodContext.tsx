import { createContext, useContext, useState, ReactNode } from 'react'

export type TimePeriodType = 'QTD' | 'YTD' | '1Y' | '3Y' | '5Y' | 'Custom'
export type ComparisonMode = 'PY' | 'Budget' | 'Forecast' | 'Peer' | null
export type BusinessUnit = 'All' | 'Wealth Management' | 'Asset Management' | 'Asset Servicing' | 'Corporate & Institutional'
export type Geography = 'All' | 'North America' | 'EMEA' | 'APAC' | 'Latin America'
export type ClientSegment = 'All' | 'Ultra HNW' | 'Family Office' | 'Institutional' | 'Corporate' | 'Endowments & Foundations'

export interface DateRange {
  startDate: Date
  endDate: Date
}

interface TimePeriodContextType {
  periodType: TimePeriodType
  setPeriodType: (period: TimePeriodType) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  comparisonMode: ComparisonMode
  setComparisonMode: (comparison: ComparisonMode) => void
  businessUnit: BusinessUnit
  setBusinessUnit: (unit: BusinessUnit) => void
  geography: Geography
  setGeography: (geo: Geography) => void
  clientSegment: ClientSegment
  setClientSegment: (segment: ClientSegment) => void
  // Legacy support
  comparisonPeriod: 'PY' | 'PP' | 'Budget' | null
  setComparisonPeriod: (comparison: 'PY' | 'PP' | 'Budget' | null) => void
}

const TimePeriodContext = createContext<TimePeriodContextType | undefined>(undefined)

export function TimePeriodProvider({ children }: { children: ReactNode }) {
  const [periodType, setPeriodTypeState] = useState<TimePeriodType>('YTD')
  const [comparisonPeriod, setComparisonPeriod] = useState<'PY' | 'PP' | 'Budget' | null>('Budget')
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('Budget')
  const [businessUnit, setBusinessUnit] = useState<BusinessUnit>('All')
  const [geography, setGeography] = useState<Geography>('All')
  const [clientSegment, setClientSegment] = useState<ClientSegment>('All')

  // Calculate date range based on period type
  const calculateDateRange = (period: TimePeriodType): DateRange => {
    const now = new Date()
    const endDate = now
    let startDate: Date

    switch (period) {
      case 'QTD':
        // Start of current quarter
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        break
      case 'YTD':
        // Start of current year
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case '1Y':
        // Last 12 months
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case '3Y':
        // Last 3 years
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 3)
        break
      case '5Y':
        // Last 5 years
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 5)
        break
      case 'Custom':
        // Default to YTD for custom (will be overridden)
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), 0, 1)
    }

    return { startDate, endDate }
  }

  const [dateRange, setDateRangeState] = useState<DateRange>(calculateDateRange('YTD'))

  const setPeriodType = (period: TimePeriodType) => {
    setPeriodTypeState(period)
    if (period !== 'Custom') {
      setDateRangeState(calculateDateRange(period))
    }
  }

  const setDateRange = (range: DateRange) => {
    setDateRangeState(range)
    setPeriodTypeState('Custom')
  }

  return (
    <TimePeriodContext.Provider
      value={{
        periodType,
        setPeriodType,
        dateRange,
        setDateRange,
        comparisonMode,
        setComparisonMode,
        businessUnit,
        setBusinessUnit,
        geography,
        setGeography,
        clientSegment,
        setClientSegment,
        comparisonPeriod,
        setComparisonPeriod,
      }}
    >
      {children}
    </TimePeriodContext.Provider>
  )
}

export function useTimePeriod() {
  const context = useContext(TimePeriodContext)
  if (context === undefined) {
    throw new Error('useTimePeriod must be used within a TimePeriodProvider')
  }
  return context
}

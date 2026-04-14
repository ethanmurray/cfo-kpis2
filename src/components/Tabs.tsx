import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  registerTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || defaultValue)
  const knownTabs = useRef(new Set<string>())
  const validated = useRef(false)

  const registerTab = useCallback((value: string) => {
    knownTabs.current.add(value)
  }, [])

  // After children mount and register, validate the active tab
  useEffect(() => {
    if (validated.current) return
    validated.current = true

    if (tabParam) {
      // If the ?tab= param doesn't match any registered tab, fall back
      if (knownTabs.current.size > 0 && !knownTabs.current.has(tabParam)) {
        setActiveTab(defaultValue)
      }
      // Clear the param from the URL either way
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('tab')
        return next
      }, { replace: true })
    }
  }) // runs after every render until validated

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, registerTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex gap-2 mb-6 overflow-x-auto ${className}`} style={{
      borderBottom: '2px solid rgba(var(--client-primary-rgb), 0.08)'
    }}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { activeTab, setActiveTab, registerTab } = context

  // Register this tab value so Tabs can validate ?tab= params
  useEffect(() => { registerTab(value) }, [value, registerTab])
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-5 py-3 font-semibold text-sm whitespace-nowrap transition-all duration-200 relative rounded-t-lg ${className}`}
      style={{
        color: isActive ? 'var(--client-text)' : '#6b7280',
        backgroundColor: isActive ? 'rgba(var(--client-accent-rgb), 0.08)' : 'transparent',
        borderBottom: isActive ? '3px solid var(--client-accent)' : '3px solid transparent',
        transform: isActive ? 'translateY(2px)' : 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--client-text)'
          e.currentTarget.style.backgroundColor = 'rgba(var(--client-accent-rgb), 0.04)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = '#6b7280'
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { activeTab } = context

  if (activeTab !== value) return null

  return <div className={className}>{children}</div>
}

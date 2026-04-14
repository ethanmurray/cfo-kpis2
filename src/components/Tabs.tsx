import { createContext, useContext, useState, ReactNode } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
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

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-5 py-3 font-semibold text-sm whitespace-nowrap transition-all duration-200 relative rounded-t-lg ${className}`}
      style={{
        color: isActive ? 'var(--client-primary)' : '#6b7280',
        backgroundColor: isActive ? 'rgba(var(--client-accent-rgb), 0.08)' : 'transparent',
        borderBottom: isActive ? '3px solid var(--client-accent)' : '3px solid transparent',
        transform: isActive ? 'translateY(2px)' : 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--client-primary)'
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

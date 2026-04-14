import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1600px] p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

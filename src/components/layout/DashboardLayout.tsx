import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import AskButton from '../ai/AskButton'
import AskPanel from '../ai/AskPanel'
import DeckButton from '../deck/DeckButton'
import DeckGeneratorModal from '../deck/DeckGeneratorModal'

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
      <DeckButton />
      <AskButton />
      <AskPanel />
      <DeckGeneratorModal />
    </div>
  )
}

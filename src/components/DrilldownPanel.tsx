import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface DrilldownPanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: 'md' | 'lg' | 'xl'
}

export default function DrilldownPanel({
  isOpen,
  onClose,
  title,
  children,
  width = 'lg'
}: DrilldownPanelProps) {
  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full ${widthClasses[width]} w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          {children}
        </div>
      </div>
    </>
  )
}

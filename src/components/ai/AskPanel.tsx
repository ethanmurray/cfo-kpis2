import { useEffect, useRef } from 'react'
import { X, ArrowLeft, Sparkles } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'
import SearchBar from './SearchBar'
import QuestionLibrary from './QuestionLibrary'
import NavigateResult from './NavigateResult'
import ReportView from './ReportView'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'

export default function AskPanel() {
  const { isOpen, close, isLoading, currentReport, error, goBack } = useAIStore()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  if (!isOpen) return null

  const hasResult = currentReport && !isLoading && !error

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={close}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 z-50 flex h-full w-[520px] max-w-[90vw] flex-col bg-[#f8f9fa] shadow-2xl"
        style={{ animation: 'slideIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            {hasResult && (
              <button
                onClick={goBack}
                className="rounded-md p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <Sparkles size={18} style={{ color: 'var(--client-text)' }} />
            <span className="text-sm font-semibold text-gray-800">
              AI Assistant
            </span>
          </div>
          <button
            onClick={close}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <SearchBar />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto px-4 py-4">
          {isLoading && <LoadingState />}

          {error && !isLoading && <ErrorState />}

          {hasResult && currentReport.tier === 'navigate' && currentReport.navigateTo && (
            <NavigateResult
              target={currentReport.navigateTo}
              question={currentReport.question}
            />
          )}

          {hasResult && currentReport.tier === 'dynamic' && currentReport.dynamicReport && (
            <ReportView
              report={currentReport.dynamicReport}
              question={currentReport.question}
            />
          )}

          {!isLoading && !error && !currentReport && <QuestionLibrary />}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-4 py-2">
          <div className="text-center text-[10px] text-gray-400">
            Powered by Claude &middot; Ctrl+K to toggle
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

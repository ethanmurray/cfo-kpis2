import { useEffect, useState } from 'react'
import { X, Presentation, FileInput } from 'lucide-react'
import { useDeckStore } from '../../stores/deckStore'
import CustomDeckForm from './CustomDeckForm'
import TemplateUploader from './TemplateUploader'

type Tab = 'custom' | 'template'

export default function DeckGeneratorModal() {
  const { isOpen, closeModal, isGenerating } = useDeckStore()
  const [activeTab, setActiveTab] = useState<Tab>('custom')

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isGenerating, closeModal])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={isGenerating ? undefined : closeModal}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-[480px] max-w-[90vw] flex-col bg-[#f8f9fa] shadow-2xl"
        style={{ animation: 'slideIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Presentation size={18} style={{ color: 'var(--client-text)' }} />
            <span className="text-sm font-semibold text-gray-800">
              Generate Presentation
            </span>
          </div>
          <button
            onClick={closeModal}
            disabled={isGenerating}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'border-b-2 text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'custom' ? { borderBottomColor: 'var(--client-primary)' } : {}}
            disabled={isGenerating}
          >
            <Presentation size={14} />
            Custom Deck
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'template'
                ? 'border-b-2 text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'template' ? { borderBottomColor: 'var(--client-primary)' } : {}}
            disabled={isGenerating}
          >
            <FileInput size={14} />
            From Template
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'custom' ? <CustomDeckForm /> : <TemplateUploader />}
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-200 bg-white px-4 py-2">
          <p className="text-center text-xs text-gray-400">
            {isGenerating
              ? 'AI is planning and building your slides. This may take 15-20 seconds...'
              : 'The AI will select data, write narratives, and build branded slides.'}
          </p>
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

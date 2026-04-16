import { Presentation } from 'lucide-react'
import { useDeckStore } from '../../stores/deckStore'

export default function DeckButton() {
  const { isOpen, openModal } = useDeckStore()

  if (isOpen) return null

  return (
    <button
      onClick={openModal}
      className="fixed bottom-6 right-44 z-40 flex items-center gap-2 rounded-full bg-white px-4 py-3 text-gray-700 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
      title="Generate Presentation"
    >
      <Presentation size={18} style={{ color: 'var(--client-primary)' }} />
      <span className="text-sm font-medium">Deck</span>
    </button>
  )
}

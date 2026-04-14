import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'

export default function AskButton() {
  const { isOpen, toggle } = useAIStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggle])

  if (isOpen) return null

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
      style={{ backgroundColor: '#006747' }}
      title="Ask AI (Ctrl+K)"
    >
      <Sparkles size={20} />
      <span className="text-sm font-medium">Ask AI</span>
    </button>
  )
}

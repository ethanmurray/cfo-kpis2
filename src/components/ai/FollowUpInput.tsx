import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'

export default function FollowUpInput() {
  const [text, setText] = useState('')
  const { submitQuestion, isLoading } = useAIStore()

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return
    submitQuestion(text.trim())
    setText('')
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Ask a follow-up question..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="rounded-md p-1.5 text-gray-400 hover:text-[var(--client-primary)] transition-colors disabled:opacity-40"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </div>
  )
}

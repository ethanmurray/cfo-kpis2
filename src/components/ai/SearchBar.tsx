import { useState, useRef, useEffect } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'
import { searchQuestions } from '../../ai/searchIndex'
import type { QuestionItem } from '../../types/ai.types'

export default function SearchBar() {
  const { query, setQuery, isLoading, submitQuestion } = useAIStore()
  const [suggestions, setSuggestions] = useState<QuestionItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.trim().length >= 2) {
      const results = searchQuestions(query)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  const handleSubmit = (text?: string) => {
    const q = text || query
    if (!q.trim() || isLoading) return
    setShowSuggestions(false)
    submitQuestion(q.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 focus-within:border-[var(--client-primary)] focus-within:ring-1 focus-within:ring-[var(--client-primary)]">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Ask about financials, capital, risk, clients..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={!query.trim() || isLoading}
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-40"
          style={{ backgroundColor: 'var(--client-primary)' }}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowRight size={14} />
          )}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setQuery(q.text)
                setShowSuggestions(false)
                handleSubmit(q.text)
              }}
              className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
            >
              <Search size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
              <div>
                <div className="text-gray-700">{q.text}</div>
                {q.route && (
                  <div className="mt-0.5 text-xs text-gray-400">
                    {q.pageName}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

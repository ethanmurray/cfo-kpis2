import { useState } from 'react'
import { Presentation, Loader2 } from 'lucide-react'
import { useDeckStore } from '../../stores/deckStore'

const AUDIENCES = [
  { value: 'board', label: 'Board of Directors' },
  { value: 'cfo', label: 'CFO / Finance Leadership' },
  { value: 'investors', label: 'Investors' },
  { value: 'regulators', label: 'Regulators' },
]

const FOCUS_AREAS = [
  'Capital', 'Liquidity', 'Revenue', 'Profitability',
  'Peer Comparison', 'Risk', 'Balance Sheet', 'Forecasts',
  'Client Economics', 'Workforce',
]

export default function CustomDeckForm() {
  const { isGenerating, error, generateDeck } = useDeckStore()
  const [prompt, setPrompt] = useState('')
  const [audience, setAudience] = useState('board')
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [slideCount, setSlideCount] = useState(5)

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const handleGenerate = () => {
    generateDeck({
      mode: 'custom',
      prompt: prompt || 'Create a comprehensive executive overview of current financial performance.',
      audience,
      focusAreas: selectedAreas.length > 0 ? selectedAreas : undefined,
      slideCount,
    })
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Story Prompt */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          What story should this deck tell?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a board presentation covering Q1 capital strength, revenue growth momentum, and peer positioning..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--client-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--client-primary)]"
          rows={4}
          disabled={isGenerating}
        />
      </div>

      {/* Audience */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Audience
        </label>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--client-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--client-primary)]"
          disabled={isGenerating}
        >
          {AUDIENCES.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* Focus Areas */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Focus Areas <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map((area) => (
            <button
              key={area}
              onClick={() => toggleArea(area)}
              disabled={isGenerating}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedAreas.includes(area)
                  ? 'text-white'
                  : 'border border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
              style={selectedAreas.includes(area) ? { backgroundColor: 'var(--client-primary)' } : {}}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Count */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Target Slides: {slideCount}
        </label>
        <input
          type="range"
          min={2}
          max={20}
          value={slideCount}
          onChange={(e) => setSlideCount(Number(e.target.value))}
          className="w-full accent-[var(--client-primary)]"
          disabled={isGenerating}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>2</span>
          <span>20</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--client-primary)' }}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating Presentation...
          </>
        ) : (
          <>
            <Presentation size={16} />
            Generate Presentation
          </>
        )}
      </button>
    </div>
  )
}

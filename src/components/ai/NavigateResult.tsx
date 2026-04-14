import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import type { NavigateTarget } from '../../types/ai.types'
import { useAIStore } from '../../stores/aiStore'

interface Props {
  target: NavigateTarget
  question: string
}

export default function NavigateResult({ target, question }: Props) {
  const navigate = useNavigate()
  const { close, forceAnalysis } = useAIStore()

  const handleNavigate = () => {
    close()
    const path = target.tab ? `${target.path}?tab=${target.tab}` : target.path
    navigate(path)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[rgba(var(--client-primary-rgb),0.05)] border border-[rgba(var(--client-primary-rgb),0.1)] p-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--client-text)' }} />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {target.pageName}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {target.description || `This page has the data you need to answer: "${question}"`}
            </p>
            {target.tab && (
              <p className="mt-1 text-xs text-gray-400">
                Look for the "{target.tab}" tab
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleNavigate}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: 'var(--client-primary)' }}
        >
          Go to {target.pageName}
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => forceAnalysis(question)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
          style={{
            color: 'var(--client-text)',
            backgroundColor: 'rgba(var(--client-accent-rgb), 0.12)',
            border: '1px solid rgba(var(--client-accent-rgb), 0.3)',
          }}
        >
          <Sparkles size={14} />
          Custom Analysis
        </button>
      </div>
    </div>
  )
}

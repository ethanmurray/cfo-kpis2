import { Loader2 } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'

export default function LoadingState() {
  const { isClassifying } = useAIStore()

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 size={32} className="animate-spin mb-4" style={{ color: 'var(--client-text)' }} />
      <div className="text-sm font-medium text-gray-700">
        {isClassifying ? 'Understanding your question...' : 'Generating analysis...'}
      </div>
      <div className="mt-1 text-xs text-gray-400">
        {isClassifying
          ? 'Classifying intent'
          : 'Writing code, executing analysis, creating charts'}
      </div>
    </div>
  )
}

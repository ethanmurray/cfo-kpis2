import { AlertCircle, RotateCcw } from 'lucide-react'
import { useAIStore } from '../../stores/aiStore'

export default function ErrorState() {
  const { error, query, submitQuestion, setError } = useAIStore()

  const handleRetry = () => {
    setError(null)
    if (query) submitQuestion(query)
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle size={32} className="mb-4 text-red-400" />
      <div className="text-sm font-medium text-gray-700">Something went wrong</div>
      <p className="mt-1 max-w-xs text-center text-xs text-gray-400">
        {error || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={handleRetry}
        className="mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: '#006747' }}
      >
        <RotateCcw size={14} />
        Try Again
      </button>
    </div>
  )
}

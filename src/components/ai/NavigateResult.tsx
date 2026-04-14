import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import type { NavigateTarget } from '../../types/ai.types'
import { useAIStore } from '../../stores/aiStore'

interface Props {
  target: NavigateTarget
  question: string
}

export default function NavigateResult({ target, question }: Props) {
  const navigate = useNavigate()
  const { close } = useAIStore()

  const handleNavigate = () => {
    close()
    navigate(target.path)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[#006747]/5 border border-[#006747]/10 p-4">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#006747' }} />
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

      <button
        onClick={handleNavigate}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: '#006747' }}
      >
        Go to {target.pageName}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

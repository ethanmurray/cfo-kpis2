import { useState } from 'react'
import {
  TrendingUp, Shield, Users, Settings,
  AlertTriangle, BarChart3, Compass, ChevronDown, ChevronRight,
} from 'lucide-react'
import { questionCategories } from '../../ai/questionRegistry'
import { useAIStore } from '../../stores/aiStore'

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={16} />,
  Shield: <Shield size={16} />,
  Users: <Users size={16} />,
  Settings: <Settings size={16} />,
  AlertTriangle: <AlertTriangle size={16} />,
  BarChart3: <BarChart3 size={16} />,
  Compass: <Compass size={16} />,
}

export default function QuestionLibrary() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('financial')
  const { submitQuestion, setQuery, isLoading } = useAIStore()

  const handleQuestionClick = (text: string) => {
    if (isLoading) return
    setQuery(text)
    submitQuestion(text)
  }

  return (
    <div className="space-y-1">
      <div className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
        Suggested Questions
      </div>
      {questionCategories.map((cat) => (
        <div key={cat.id}>
          <button
            onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-400">{iconMap[cat.icon]}</span>
            <span className="flex-1 text-left">{cat.label}</span>
            {expandedCategory === cat.id ? (
              <ChevronDown size={14} className="text-gray-400" />
            ) : (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </button>

          {expandedCategory === cat.id && (
            <div className="ml-6 space-y-0.5 pb-1">
              {cat.questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionClick(q.text)}
                  disabled={isLoading}
                  className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-[rgba(var(--client-primary-rgb),0.05)] hover:text-[var(--client-primary)] transition-colors disabled:opacity-50"
                >
                  {q.text}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

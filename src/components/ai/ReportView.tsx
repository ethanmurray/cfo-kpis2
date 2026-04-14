import { useState } from 'react'
import { ChevronDown, ChevronRight, Code, BarChart3, FileText, AlertCircle } from 'lucide-react'
import type { DynamicReport } from '../../types/ai.types'
import FollowUpInput from './FollowUpInput'

interface Props {
  report: DynamicReport
  question: string
}

export default function ReportView({ report, question }: Props) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="space-y-4">
      {/* Executive Narrative */}
      {report.narrative && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <FileText size={14} />
            Executive Summary
          </div>
          <p className="text-sm leading-relaxed text-gray-700">
            {report.narrative}
          </p>
        </div>
      )}

      {/* Charts */}
      {report.images.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <BarChart3 size={14} />
            Visualizations
          </div>
          <div className="space-y-3">
            {report.images.map((img, i) => (
              <img
                key={i}
                src={`data:image/png;base64,${img}`}
                alt={`Chart ${i + 1}`}
                className="w-full rounded-md border border-gray-100"
                style={{ maxHeight: 400 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Analysis Output */}
      {report.stdout && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <FileText size={14} />
            Analysis Detail
          </div>
          <pre className="max-h-60 overflow-auto rounded-md bg-gray-50 p-3 text-xs text-gray-700 font-mono">
            {report.stdout}
          </pre>
        </div>
      )}

      {/* Error */}
      {report.error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
            <div>
              <div className="text-xs font-medium text-amber-800">Analysis Note</div>
              <pre className="mt-1 max-h-32 overflow-auto text-xs text-amber-700 whitespace-pre-wrap">
                {report.error}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Code Block */}
      {report.pythonCode && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showCode ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Code size={14} />
            <span>View generated code</span>
          </button>
          {showCode && (
            <div className="border-t border-gray-100 p-4">
              <pre className="max-h-72 overflow-auto rounded-md bg-gray-900 p-3 text-xs text-gray-100 font-mono">
                {report.pythonCode}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Follow-up */}
      <FollowUpInput />
    </div>
  )
}

import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { useDeckStore } from '../../stores/deckStore'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function TemplateUploader() {
  const { isGenerating, error, generateDeck } = useDeckStore()
  const [templateFile, setTemplateFile] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError(null)

    if (!file) return

    if (!file.name.endsWith('.pptx')) {
      setFileError('Please upload a .pptx file')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File must be under 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setTemplateFile(base64)
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const clearFile = () => {
    setTemplateFile(null)
    setFileName(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleGenerate = () => {
    if (!templateFile) {
      setFileError('Please upload a template first')
      return
    }
    generateDeck({
      mode: 'template',
      prompt: prompt || 'Update the template with current financial data.',
      templateFile,
    })
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* File Upload */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          PowerPoint Template
        </label>

        {fileName ? (
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
            <FileText size={16} className="text-gray-500" />
            <span className="flex-1 truncate text-sm text-gray-700">{fileName}</span>
            <button
              onClick={clearFile}
              className="rounded p-0.5 text-gray-400 hover:text-gray-600"
              disabled={isGenerating}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload .pptx template</span>
            <span className="text-xs text-gray-400">Max 10MB</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pptx"
          onChange={handleFileChange}
          className="hidden"
        />

        {fileError && (
          <p className="mt-1 text-xs text-red-500">{fileError}</p>
        )}
      </div>

      {/* Guidance Prompt */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Update Guidance
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Update with current quarter data, focus on capital improvements and NII growth story..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--client-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--client-primary)]"
          rows={4}
          disabled={isGenerating}
        />
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
        disabled={isGenerating || !templateFile}
        className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--client-primary)' }}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Updating Template...
          </>
        ) : (
          <>
            <Upload size={16} />
            Generate from Template
          </>
        )}
      </button>
    </div>
  )
}

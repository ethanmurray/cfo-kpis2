import { create } from 'zustand'
import type { AIReport, AskResponse, ClassifyResponse } from '../types/ai.types'
import { useClientStore } from './clientStore'

interface AIState {
  isOpen: boolean
  query: string
  isLoading: boolean
  isClassifying: boolean
  currentReport: AIReport | null
  history: AIReport[]
  error: string | null

  // Actions
  open: () => void
  close: () => void
  toggle: () => void
  setQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setClassifying: (classifying: boolean) => void
  setError: (error: string | null) => void
  setCurrentReport: (report: AIReport | null) => void
  addToHistory: (report: AIReport) => void
  clearHistory: () => void
  goBack: () => void

  // Async actions
  submitQuestion: (question: string, filters?: Record<string, string>) => Promise<void>
  forceAnalysis: (question: string, filters?: Record<string, string>) => Promise<void>
}

export const useAIStore = create<AIState>((set, get) => ({
  isOpen: false,
  query: '',
  isLoading: false,
  isClassifying: false,
  currentReport: null,
  history: [],
  error: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setQuery: (query) => set({ query }),
  setLoading: (isLoading) => set({ isLoading }),
  setClassifying: (isClassifying) => set({ isClassifying }),
  setError: (error) => set({ error }),
  setCurrentReport: (currentReport) => set({ currentReport }),
  addToHistory: (report) => set((s) => ({ history: [...s.history, report] })),
  clearHistory: () => set({ history: [], currentReport: null }),
  goBack: () => set({ currentReport: null, error: null }),

  submitQuestion: async (question, filters) => {
    const state = get()
    const clientId = useClientStore.getState().clientId
    set({ isLoading: true, isClassifying: true, error: null })

    try {
      // Step 1: Classify the question
      const classifyRes = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, clientId }),
      })

      if (!classifyRes.ok) throw new Error('Classification failed')

      const classification: ClassifyResponse = await classifyRes.json()
      set({ isClassifying: false })

      if (classification.tier === 'navigate' && classification.route) {
        // Navigate tier — show the route link
        const report: AIReport = {
          question,
          tier: 'navigate',
          navigateTo: {
            path: classification.route,
            tab: classification.tab,
            pageName: classification.pageName || '',
            description: classification.description || '',
          },
          timestamp: new Date().toISOString(),
        }
        set({ currentReport: report, isLoading: false })
        state.addToHistory(report)
        return
      }

      // Dynamic tier — generate analysis
      // Build conversation history from recent reports for follow-ups
      const conversationHistory = state.currentReport?.dynamicReport
        ? [
            { role: 'user' as const, content: state.currentReport.question },
            { role: 'assistant' as const, content: state.currentReport.dynamicReport.narrative },
          ]
        : undefined

      const askRes = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, filters, conversationHistory, clientId }),
      })

      if (!askRes.ok) throw new Error('Analysis failed')

      const askData: AskResponse = await askRes.json()

      const report: AIReport = {
        question,
        tier: 'dynamic',
        dynamicReport: {
          narrative: askData.narrative,
          pythonCode: askData.pythonCode,
          stdout: askData.stdout,
          images: askData.images,
          error: askData.error,
        },
        timestamp: new Date().toISOString(),
      }

      set({ currentReport: report, isLoading: false })
      state.addToHistory(report)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      set({ error: message, isLoading: false, isClassifying: false })
    }
  },

  forceAnalysis: async (question, filters) => {
    const state = get()
    const clientId = useClientStore.getState().clientId
    set({ isLoading: true, isClassifying: false, error: null, currentReport: null })

    try {
      const conversationHistory = state.currentReport?.dynamicReport
        ? [
            { role: 'user' as const, content: state.currentReport.question },
            { role: 'assistant' as const, content: state.currentReport.dynamicReport.narrative },
          ]
        : undefined

      const askRes = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, filters, conversationHistory, clientId }),
      })

      if (!askRes.ok) throw new Error('Analysis failed')

      const askData: AskResponse = await askRes.json()

      const report: AIReport = {
        question,
        tier: 'dynamic',
        dynamicReport: {
          narrative: askData.narrative,
          pythonCode: askData.pythonCode,
          stdout: askData.stdout,
          images: askData.images,
          error: askData.error,
        },
        timestamp: new Date().toISOString(),
      }

      set({ currentReport: report, isLoading: false })
      state.addToHistory(report)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      set({ error: message, isLoading: false })
    }
  },
}))

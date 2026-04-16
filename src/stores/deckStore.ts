import { create } from 'zustand'
import type { DeckRequest, DeckResponse } from '../types/deck.types'
import { useClientStore } from './clientStore'

interface DeckState {
  isOpen: boolean
  isGenerating: boolean
  error: string | null
  lastFilename: string | null

  openModal: () => void
  closeModal: () => void
  generateDeck: (request: Omit<DeckRequest, 'clientId'>) => Promise<void>
}

export const useDeckStore = create<DeckState>((set) => ({
  isOpen: false,
  isGenerating: false,
  error: null,
  lastFilename: null,

  openModal: () => set({ isOpen: true, error: null }),
  closeModal: () => set({ isOpen: false, error: null }),

  generateDeck: async (request) => {
    set({ isGenerating: true, error: null })

    try {
      const clientId = useClientStore.getState().clientId

      const response = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...request, clientId }),
      })

      const result: DeckResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate presentation')
      }

      // Convert base64 to blob and trigger download
      const byteCharacters = atob(result.data)
      const byteArray = new Uint8Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i)
      }
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      set({ isGenerating: false, lastFilename: result.filename, isOpen: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      set({ isGenerating: false, error: message })
    }
  },
}))

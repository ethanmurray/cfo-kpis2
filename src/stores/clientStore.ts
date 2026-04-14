import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CLIENT_CONFIGS,
  DEFAULT_CLIENT_ID,
  getClientConfig,
  type ClientConfig,
} from '../config/clientConfig'
import { setActiveClientConfig } from '../data/mockData'

interface ClientState {
  clientId: string
  config: ClientConfig

  setClient: (clientId: string) => void
}

/** Apply client theme as CSS custom properties on :root */
export function applyClientTheme(config: ClientConfig) {
  const root = document.documentElement
  root.style.setProperty('--client-primary', config.colors.primary)
  root.style.setProperty('--client-primary-dark', config.colors.primaryDark)
  root.style.setProperty('--client-primary-darkest', config.colors.primaryDarkest)
  root.style.setProperty('--client-accent', config.colors.accent)
  root.style.setProperty('--client-accent-light', config.colors.accentLight)
  root.style.setProperty('--client-primary-rgb', config.colors.primaryRGB)
  root.style.setProperty('--client-primary-dark-rgb', config.colors.primaryDarkRGB)
  root.style.setProperty('--client-accent-rgb', config.colors.accentRGB)
  // Text color override: falls back to primary when not set (e.g. Northern Trust green is fine for text)
  root.style.setProperty('--client-text', config.colors.textPrimary ?? config.colors.primary)
  root.style.setProperty('--client-text-rgb', config.colors.textPrimaryRGB ?? config.colors.primaryRGB)
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      clientId: DEFAULT_CLIENT_ID,
      config: getClientConfig(DEFAULT_CLIENT_ID),

      setClient: (clientId: string) => {
        const config = getClientConfig(clientId)
        applyClientTheme(config)
        setActiveClientConfig(config)
        set({ clientId, config })
      },
    }),
    {
      name: 'cfo-dashboard-client',
      // Only persist the clientId, rehydrate config from the registry
      partialize: (state) => ({ clientId: state.clientId }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const config = getClientConfig(state.clientId)
          state.config = config
          applyClientTheme(config)
          setActiveClientConfig(config)
        }
      },
    }
  )
)

/** Get all available client IDs and names for the switcher dropdown */
export function getAvailableClients() {
  return Object.values(CLIENT_CONFIGS).map((c) => ({
    id: c.id,
    shortName: c.shortName,
    name: c.name,
    primaryColor: c.colors.primary,
  }))
}

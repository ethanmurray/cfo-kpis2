import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getClientConfig } from './config/clientConfig'
import { applyClientTheme } from './stores/clientStore'

// Apply client theme before first render to prevent color flash.
// Read persisted clientId from localStorage (matches zustand persist key).
let initialClientId = 'ntrs'
try {
  const stored = localStorage.getItem('cfo-dashboard-client')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed?.state?.clientId) {
      initialClientId = parsed.state.clientId
    }
  }
} catch { /* use default */ }
applyClientTheme(getClientConfig(initialClientId))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

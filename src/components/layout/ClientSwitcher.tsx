import { useClientStore, getAvailableClients } from '../../stores/clientStore'

export default function ClientSwitcher() {
  const { clientId, setClient } = useClientStore()
  const clients = getAvailableClients()

  // Hide switcher when there's only one client
  if (clients.length <= 1) return null

  return (
    <div className="relative">
      <select
        value={clientId}
        onChange={(e) => setClient(e.target.value)}
        className="w-full appearance-none rounded-lg px-3 py-2 pr-8 text-xs font-semibold tracking-wide cursor-pointer border-0 focus:outline-none focus:ring-1"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'var(--client-accent)',
        }}
      >
        {clients.map((c) => (
          <option key={c.id} value={c.id} style={{ color: '#1f2937', backgroundColor: '#ffffff' }}>
            {c.shortName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg className="h-3 w-3" style={{ color: 'var(--client-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

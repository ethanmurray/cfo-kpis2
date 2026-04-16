import { getDataJson } from '../src/server/lib/dataContext'
import { CLIENT_CONFIGS } from '../src/config/clientConfig'
import { writeFileSync } from 'fs'

// Load private client configs if present (gitignored file)
try { await import('../src/config/clients.private') } catch { /* file absent */ }

// Generate a data snapshot for each client
for (const [id, config] of Object.entries(CLIENT_CONFIGS)) {
  const data = getDataJson(id)
  const filename = `./api/data-${id}.json`
  writeFileSync(filename, data)
  console.log(`Wrote ${(data.length / 1024).toFixed(0)} KB to ${filename} (${config.shortName})`)
}

// Also write default (acme) as data.json for backward compatibility
const defaultData = getDataJson('acme')
writeFileSync('./api/data.json', defaultData)
console.log(`Wrote ${(defaultData.length / 1024).toFixed(0)} KB to api/data.json (default)`)

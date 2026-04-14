import { getDataJson } from '../src/server/lib/dataContext'
import { writeFileSync } from 'fs'

const data = getDataJson()
writeFileSync('./api/data.json', data)
console.log(`Wrote ${(data.length / 1024).toFixed(0)} KB to api/data.json`)

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleAsk } from '../src/server/api/ask'
import type { AskRequest } from '../src/types/ai.types'

export const maxDuration = 60

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body as AskRequest
    if (!body.question || typeof body.question !== 'string') {
      return res.status(400).json({ error: 'Missing question parameter' })
    }

    const result = await handleAsk(body)
    return res.status(200).json(result)
  } catch (err: unknown) {
    console.error('Ask error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}

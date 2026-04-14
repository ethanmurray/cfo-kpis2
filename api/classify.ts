import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleClassify } from '../src/server/api/classify'

export const maxDuration = 30

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { question } = req.body
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Missing question parameter' })
    }

    const result = await handleClassify(question)
    return res.status(200).json(result)
  } catch (err: unknown) {
    console.error('Classify error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ error: message })
  }
}

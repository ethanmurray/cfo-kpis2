import { classify } from '../lib/claude'
import { CLASSIFY_SYSTEM_PROMPT } from '../lib/prompts'
import type { ClassifyResponse } from '../../types/ai.types'

export async function handleClassify(question: string): Promise<ClassifyResponse> {
  const rawResponse = await classify(CLASSIFY_SYSTEM_PROMPT, question)

  try {
    // Extract JSON from the response (may be wrapped in markdown fences)
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { tier: 'dynamic' }
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (parsed.tier === 'navigate' && parsed.route) {
      return {
        tier: 'navigate',
        route: parsed.route,
        tab: parsed.tab || undefined,
        pageName: parsed.pageName || '',
        description: parsed.description || '',
      }
    }

    return { tier: 'dynamic' }
  } catch {
    // If parsing fails, default to dynamic
    return { tier: 'dynamic' }
  }
}

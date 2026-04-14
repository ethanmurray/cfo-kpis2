import Fuse from 'fuse.js'
import { allQuestions } from './questionRegistry'
import type { QuestionItem } from '../types/ai.types'

const fuse = new Fuse(allQuestions, {
  keys: [
    { name: 'text', weight: 0.6 },
    { name: 'keywords', weight: 0.3 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
})

export function searchQuestions(query: string): QuestionItem[] {
  if (!query.trim()) return []
  const results = fuse.search(query, { limit: 8 })
  return results.map((r) => r.item)
}

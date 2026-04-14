export interface NavigateTarget {
  path: string
  tab?: string
  pageName: string
  description: string
}

export interface DynamicReport {
  narrative: string
  pythonCode: string
  stdout: string
  images: string[] // base64 PNGs
  error: string | null
}

export interface AIReport {
  question: string
  tier: 'navigate' | 'dynamic'
  navigateTo?: NavigateTarget
  dynamicReport?: DynamicReport
  timestamp: string
}

export interface ClassifyResponse {
  tier: 'navigate' | 'dynamic'
  route?: string
  tab?: string
  pageName?: string
  description?: string
}

export interface AskRequest {
  question: string
  filters?: {
    periodType?: string
    businessUnit?: string
    geography?: string
    clientSegment?: string
  }
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface AskResponse {
  narrative: string
  pythonCode: string
  stdout: string
  images: string[]
  error: string | null
}

export interface QuestionItem {
  id: string
  text: string
  category: string
  keywords: string[]
  route?: string
  tab?: string
  pageName?: string
  decisionType?: 'monitor' | 'optimize' | 'compare' | 'forecast' | 'diagnose'
}

export interface QuestionCategory {
  id: string
  label: string
  icon: string
  questions: QuestionItem[]
}

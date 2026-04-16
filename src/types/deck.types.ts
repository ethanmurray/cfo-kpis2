export interface DeckRequest {
  mode: 'template' | 'custom'
  prompt: string
  clientId?: string
  templateFile?: string    // base64 .pptx (template mode only)
  focusAreas?: string[]    // e.g. ['capital', 'liquidity', 'peer']
  audience?: string        // 'board' | 'cfo' | 'investors' | 'regulators'
  slideCount?: number      // 5-20, default 10
}

export interface DeckResponse {
  success: boolean
  filename: string
  data: string             // base64 PPTX
  slideCount: number
  error?: string
}

export interface SlidePlan {
  title: string
  subtitle: string
  slides: SlideSpec[]
}

export interface SlideSpec {
  layout: 'title' | 'section-divider' | 'kpi-grid' | 'chart-narrative'
         | 'two-column' | 'table' | 'title-content'
  title: string
  subtitle?: string
  content: SlideContent
}

export interface SlideContent {
  textBlocks?: Array<{
    text: string
    style: 'heading' | 'body' | 'bullet' | 'callout'
    position?: 'left' | 'right' | 'full'
  }>
  charts?: Array<{
    type: 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter'
    title: string
    data: { labels: string[]; series: Array<{ name: string; values: number[] }> }
    position?: 'left' | 'right' | 'full'
  }>
  tables?: Array<{
    headers: string[]
    rows: string[][]
    position?: 'left' | 'right' | 'full'
  }>
  kpis?: Array<{
    label: string
    value: string
    change?: string
    status?: 'positive' | 'negative' | 'neutral'
  }>
  narrative?: string
  speakerNotes?: string
}

export interface TemplatePlaceholder {
  name: string
  text?: string
  type: 'text' | 'table' | 'chart'
  rows?: number
  cols?: number
}

export interface TemplateSlideInfo {
  index: number
  title?: string
  placeholders: TemplatePlaceholder[]
}

export interface TemplateFillPlan {
  slides: Array<{
    index: number
    fills: Array<{ placeholderName: string; newContent: string }>
    tableFills?: Array<{ placeholderName: string; headers?: string[]; rows: string[][] }>
  }>
}

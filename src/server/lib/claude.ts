import Anthropic from '@anthropic-ai/sdk'
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'

// Use direct Anthropic API if key is available, otherwise fall back to Bedrock
const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
// Both SDKs share the same messages.create() interface
const anthropic: { messages: { create: (params: any) => Promise<any> } } = apiKey
  ? new Anthropic({ apiKey })
  : new AnthropicBedrock({ awsRegion: process.env.AWS_REGION || 'us-west-2' })

// Model IDs differ between direct API and Bedrock
const SONNET_MODEL = apiKey ? 'claude-sonnet-4-20250514' : 'us.anthropic.claude-sonnet-4-20250514-v1:0'
const HAIKU_MODEL = apiKey ? 'claude-haiku-4-5-20251001' : 'us.anthropic.claude-haiku-4-5-20251001-v1:0'

function extractText(content: Array<{ type: string; text?: string }>): string {
  return content
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text!)
    .join('\n')
}

export async function generateCode(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = extractText(response.content)

  // Extract Python code from markdown fences if present
  const codeMatch = text.match(/```python\n([\s\S]*?)```/)
  return codeMatch ? codeMatch[1].trim() : text.trim()
}

export async function generateNarrative(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  return extractText(response.content).trim()
}

export async function generateDirectAnalysis(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  return extractText(response.content).trim()
}

export async function generateDeckPlan(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 16384,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  if (!response.content) {
    console.error('Deck plan response missing content:', JSON.stringify(response).slice(0, 500))
    throw new Error(`Claude returned no content. Stop reason: ${response.stop_reason || 'unknown'}`)
  }

  return extractText(response.content).trim()
}

export async function classify(
  systemPrompt: string,
  question: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: question }],
  })

  return extractText(response.content).trim()
}

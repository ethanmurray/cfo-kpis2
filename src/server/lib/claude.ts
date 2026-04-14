import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'

const anthropic = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION || 'us-west-2',
})

// Bedrock model IDs
const SONNET_MODEL = 'us.anthropic.claude-sonnet-4-20250514-v1:0'
const HAIKU_MODEL = 'us.anthropic.claude-haiku-4-5-20251001-v1:0'

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

import { Sandbox } from '@e2b/code-interpreter'

interface ExecutionResult {
  stdout: string
  images: string[] // base64 PNGs
  error: string | null
}

export async function executeCode(
  code: string,
  dataJson: string
): Promise<ExecutionResult> {
  const sandbox = await Sandbox.create({
    apiKey: process.env.E2B_API_KEY,
  })

  try {
    // Write the data file to the sandbox
    await sandbox.files.write('/tmp/data.json', dataJson)

    // Execute the Python code
    const execution = await sandbox.runCode(code)

    // Collect stdout
    const stdout = execution.logs.stdout.join('\n')
    const stderr = execution.logs.stderr.join('\n')

    // Collect images from execution results
    const images: string[] = []

    // Get inline results (charts returned directly by the execution)
    for (const result of execution.results) {
      if (result.png) {
        images.push(result.png)
      }
    }

    // Also check for saved chart files
    for (let i = 1; i <= 5; i++) {
      try {
        const chartPath = `/tmp/chart_${i}.png`
        const chartBytes = await sandbox.files.read(chartPath)
        if (chartBytes) {
          // chartBytes is already a string (base64) or Uint8Array
          if (typeof chartBytes === 'string') {
            // If it's already a string, it might be raw content
            const base64 = Buffer.from(chartBytes).toString('base64')
            images.push(base64)
          } else {
            const base64 = Buffer.from(chartBytes).toString('base64')
            images.push(base64)
          }
        }
      } catch {
        // No more chart files
        break
      }
    }

    const error = execution.error
      ? `${execution.error.name}: ${execution.error.value}\n${execution.error.traceback}`
      : stderr
        ? stderr
        : null

    return { stdout, images, error }
  } finally {
    await sandbox.kill()
  }
}

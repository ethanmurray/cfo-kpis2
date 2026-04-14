import type { Plugin, ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'
import type { Connect } from 'vite'
import dotenv from 'dotenv'

export function apiPlugin(): Plugin {
  return {
    name: 'vite-api-plugin',
    configureServer(server: ViteDevServer) {
      // Load .env for server-side code (Vite only exposes VITE_* to client)
      dotenv.config()
      server.middlewares.use(async (
        req: IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
      ) => {
        if (!req.url?.startsWith('/api/')) {
          return next()
        }

        // Parse request body for POST requests
        let body: Record<string, unknown> = {}
        if (req.method === 'POST') {
          body = await new Promise((resolve) => {
            let data = ''
            req.on('data', (chunk: Buffer) => {
              data += chunk.toString()
            })
            req.on('end', () => {
              try {
                resolve(JSON.parse(data))
              } catch {
                resolve({})
              }
            })
          })
        }

        // Set JSON response headers
        res.setHeader('Content-Type', 'application/json')

        try {
          if (req.url === '/api/ask' && req.method === 'POST') {
            const { handleAsk } = await import('./api/ask')
            const result = await handleAsk(body as any)
            res.statusCode = 200
            res.end(JSON.stringify(result))
          } else if (req.url === '/api/classify' && req.method === 'POST') {
            const { handleClassify } = await import('./api/classify')
            const result = await handleClassify(body.question as string)
            res.statusCode = 200
            res.end(JSON.stringify(result))
          } else {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'Not found' }))
          }
        } catch (err: unknown) {
          console.error('API error:', err)
          res.statusCode = 500
          const message = err instanceof Error ? err.message : 'Internal server error'
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}

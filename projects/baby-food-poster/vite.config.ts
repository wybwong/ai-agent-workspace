import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

function dbPlugin() {
  const dbDir = path.resolve(process.cwd(), 'data')
  const dbPath = path.join(dbDir, 'database.sqlite')

  return {
    name: 'db-plugin',
    configureServer(server) {
      fs.mkdirSync(dbDir, { recursive: true })

      server.middlewares.use((req, res, next) => {
        // Serve sql.js WASM
        if (req.url === '/sql-wasm.wasm') {
          const wasmPath = path.resolve(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm')
          if (fs.existsSync(wasmPath)) {
            res.setHeader('Content-Type', 'application/wasm')
            fs.createReadStream(wasmPath).pipe(res as any)
          } else {
            res.statusCode = 404
            res.end()
          }
          return
        }

        // Export DB → client reads existing sqlite file
        if (req.method === 'GET' && req.url === '/api/db/export') {
          if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath)
            res.setHeader('Content-Type', 'application/octet-stream')
            res.end(data)
          } else {
            res.statusCode = 404
            res.end()
          }
          return
        }

        // Import DB → client persists in-memory DB to disk
        if (req.method === 'POST' && req.url === '/api/db/import') {
          const chunks: Buffer[] = []
          req.on('data', (chunk: Buffer) => chunks.push(chunk))
          req.on('end', () => {
            try {
              fs.writeFileSync(dbPath, Buffer.concat(chunks))
              res.writeHead(200, { 'Content-Type': 'text/plain' })
              res.end('ok')
            } catch {
              res.writeHead(500)
              res.end('error')
            }
          })
          return
        }

        next()
      })
    },

    generateBundle() {
      // Copy WASM files to dist for production.
      // sql.js browser build requests sql-wasm-browser.wasm; also copy sql-wasm.wasm as fallback.
      const wasmFiles = ['sql-wasm-browser.wasm', 'sql-wasm.wasm']
      for (const name of wasmFiles) {
        const wasmSrc = path.resolve(process.cwd(), `node_modules/sql.js/dist/${name}`)
        if (fs.existsSync(wasmSrc)) {
          this.emitFile({
            type: 'asset',
            fileName: name,
            source: fs.readFileSync(wasmSrc),
          })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), dbPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    assetsInlineLimit: 0,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(dirname, './src') },
  },
  // Sourcemaps ship in production deliberately — this is a public prototype,
  // not proprietary code, and a readable stack trace was the only thing that
  // made the App.tsx crash (see git history) findable at all.
  build: { sourcemap: true },
})

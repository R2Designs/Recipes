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
  // Two deploy targets share this repo while the real Instamart backend is
  // pending: Vercel (serves from the domain root — needs '/') and GitHub
  // Pages (serves this project at r2designs.github.io/Recipes/ — needs the
  // subpath). Only the GH Pages Actions workflow sets GH_PAGES; every other
  // build (Vercel, local dev) falls through to '/'.
  base: process.env.GH_PAGES === 'true' ? '/Recipes/' : '/',
  // Sourcemaps ship in production deliberately — this is a public prototype,
  // not proprietary code, and a readable stack trace was the only thing that
  // made the App.tsx crash (see git history) findable at all.
  build: { sourcemap: true },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(dirname, './src') },
  },
  // Served as a GitHub Pages project site (r2designs.github.io/Recipes/),
  // not at the domain root — only matters for the production build; the
  // local dev server still serves from '/'.
  base: command === 'build' ? '/Recipes/' : '/',
}))

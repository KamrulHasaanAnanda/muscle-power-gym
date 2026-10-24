import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hosts without rewrite rules (e.g. GitHub Pages) serve 404.html for
// unknown paths; making it a copy of the app lets /rules, /weight-gain
// etc. load when opened or reloaded directly.
const spaFallback = {
  name: 'spa-fallback',
  apply: 'build',
  writeBundle(options) {
    const dir = options.dir || 'dist'
    copyFileSync(resolve(dir, 'index.html'), resolve(dir, '404.html'))
  },
}

export default defineConfig({
  plugins: [react(), spaFallback],
})

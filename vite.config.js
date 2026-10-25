import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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

const icon192 = { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' }
const icon512 = { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' }

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon-64.png', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Muscle Power Gym',
        short_name: 'Muscle Power',
        description:
          'Muscle Power Gym on Port Connecting Road, Halishahar, Chattogram. Strength, cardio, and ladies’ hours. Open 7:00 AM to 11:00 PM, closed Friday.',
        lang: 'en',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'any',
        background_color: '#15120f',
        theme_color: '#0b0b0b',
        categories: ['health', 'fitness', 'sports'],
        prefer_related_applications: false,
        handle_links: 'preferred',
        launch_handler: { client_mode: ['navigate-existing', 'auto'] },
        icons: [
          { ...icon192, purpose: 'any' },
          { ...icon512, purpose: 'any' },
          {
            src: '/pwa-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Rules & regulations',
            short_name: 'Rules',
            url: '/rules',
            icons: [icon192],
          },
          {
            name: 'Dress code',
            short_name: 'Dress',
            url: '/dress-code',
            icons: [icon192],
          },
          {
            name: 'Weight loss plan',
            short_name: 'Loss',
            url: '/weight-loss',
            icons: [icon192],
          },
          {
            name: 'Weight gain plan',
            short_name: 'Gain',
            url: '/weight-gain',
            icons: [icon192],
          },
        ],
        screenshots: [
          {
            src: '/images/hero-group.jpg',
            sizes: '1516x1034',
            type: 'image/jpeg',
            form_factor: 'wide',
            label: 'Members training at Muscle Power Gym',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\.\w+$/, /^\/api(?:\/|$)/],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
    spaFallback,
  ],
})

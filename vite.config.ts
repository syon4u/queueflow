import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      // Update strategy: a new deploy takes effect on the next navigation.
      // src/main.tsx registers the worker (virtual:pwa-register) and reloads
      // the page once when a new worker takes control.
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'pwa-192.png', 'pwa-512.png'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Resolved against the worker scope, so it follows `base`.
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        // Deliberately no runtimeCaching: only the precached build output is
        // served by the worker. Cross-origin requests (Supabase REST, auth,
        // realtime, storage on *.supabase.co) go straight to the network.
        runtimeCaching: [],
      },
      manifest: {
        name: 'QueueFlow',
        short_name: 'QueueFlow',
        description: 'Virtual queue and appointment management for service businesses.',
        // Relative to the manifest URL, so the install works under a sub-path
        // deploy (e.g. /queueflow-demo/) and from a domain root.
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        lang: 'en',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Keep console.error/warn; strip debug logging from production bundles.
    pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
  },
}));

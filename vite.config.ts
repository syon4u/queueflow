
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
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192.png', 'pwa-512.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB (increased from 3 MB)
      },
      manifest: {
        name: 'QUEUE FLOW',
        short_name: 'QUEUE FLOW',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        // Relative paths so the manifest works under a sub-path deploy (e.g. /queueflow-demo/).
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
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

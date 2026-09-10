import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFile } from "fs/promises";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

/**
 * GitHub Pages SPA fallback.
 *
 * Pages serves `404.html` for any path it has no file for, so a deep link such
 * as `/queueflow-demo/check-in` must load the app. Copying the built
 * `index.html` (asset URLs already carry `base`) does that without a redirect
 * and without guessing the base from the URL, so it works for a sub-path deploy
 * and for a domain-root deploy alike. Runs in `writeBundle`, i.e. before
 * vite-plugin-pwa's `closeBundle`, so the copy is precached with its real hash.
 */
function spaFallback(): Plugin {
  let outDir = "dist";
  return {
    name: "queueflow:spa-fallback",
    apply: "build",
    configResolved(config: ResolvedConfig) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async writeBundle() {
      await copyFile(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
    },
  };
}

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
    spaFallback(),
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
        // Precache = app shell + landing route + fonts + icons (icons come
        // from `includeAssets`). The default `**/*.{js,css,html}` pulled every
        // lazy route chunk (~130 entries, ~2.3 MB) through the network on the
        // first visit, competing with the page itself. Chunk names come from
        // the source file names, so the patterns below stay valid across
        // rebuilds; `assets/index-*` also matches a handful of small shared
        // `index.js` chunks from node_modules, which is fine.
        globPatterns: [
          'index.html',
          '404.html',
          'assets/index-*.{js,css}',
          'assets/workbox-window*.js',
          'assets/FlickeringGrid-*.js',
          'fonts/*.woff2',
        ],
        // Everything else under /assets/ (route chunks, locale bundles) is
        // cached the first time it is used, so a staff page visited once keeps
        // working offline. Same-origin only: Supabase REST, auth, realtime and
        // storage on *.supabase.co go straight to the network, always.
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin, url }) => sameOrigin && /\/assets\/[^/]+\.(?:js|css)$/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'qf-route-assets',
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 150, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true },
            },
          },
        ],
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

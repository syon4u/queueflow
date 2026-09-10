/// <reference types="vite-plugin-pwa/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { I18nextProvider } from 'react-i18next';
import i18n, { i18nReady } from './i18n/i18n';
import { MinimalAuthContext } from './context/AuthContext';

// --- Service worker update strategy ----------------------------------------
// sw.js is built with skipWaiting + clientsClaim (vite.config.ts), so a new
// deploy activates as soon as the browser re-fetches sw.js, which it does on
// every navigation. Once the new worker takes control, the bundle this page is
// running is gone from the cache (hashed chunk names), so reload exactly once.
//
// Loop guard: at most one reload per page lifetime, and at most
// MAX_AUTO_RELOADS within RELOAD_WINDOW_MS across page loads (sessionStorage).
// A broken deploy therefore surfaces its error instead of spinning.
const RELOAD_KEY = 'qf:sw-reload';
const RELOAD_WINDOW_MS = 30_000;
const MAX_AUTO_RELOADS = 3;
let reloadedThisPage = false;

function readReloadLog(): number[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(RELOAD_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((t): t is number => typeof t === 'number') : [];
  } catch {
    return [];
  }
}

/** Reload the page for a new deploy; returns false when the loop guard refused. */
function reloadForNewDeploy(): boolean {
  if (reloadedThisPage) return false;
  const now = Date.now();
  const recent = readReloadLog().filter((t) => now - t < RELOAD_WINDOW_MS);
  if (recent.length >= MAX_AUTO_RELOADS) return false;
  reloadedThisPage = true;
  try {
    sessionStorage.setItem(RELOAD_KEY, JSON.stringify([...recent, now]));
  } catch {
    // Storage unavailable (private mode / quota): the per-page flag still applies.
  }
  window.location.reload();
  return true;
}

if ('serviceWorker' in navigator) {
  // On first install clientsClaim also fires controllerchange, but the page is
  // already running the newest bundle, so only reload when replacing a worker.
  let wasControlled = navigator.serviceWorker.controller !== null;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wasControlled) reloadForNewDeploy();
    wasControlled = true;
  });

  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // Kiosk and signage screens stay open for days: poll for a new deploy.
      setInterval(() => {
        registration.update().catch(() => {
          /* offline; the next navigation checks again */
        });
      }, 60 * 60 * 1000);
    },
  });
}

// A lazy route chunk from a previous deploy that no longer exists on the
// server (e.g. an old tab opening /admin after a deploy): reload to pick up
// the current bundle instead of rendering a blank page.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForNewDeploy()) event.preventDefault();
});

// Create a container for the app
const container = document.getElementById('root');

// Ensure the container exists
if (!container) {
  throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.');
}

// Create root and render app. Only English is bundled; when the detected
// language is another one, wait for its chunk so the first frame is already
// translated (for English `i18nReady` is resolved synchronously).
const root = createRoot(container);
// A locale chunk that fails to load must not blank the page: render in English.
i18nReady.catch(() => undefined).then(() => {
  root.render(
    <React.StrictMode>
      {/* AuthProvider lives in App.tsx (inside the Router). A second instance
          here used to shadow it and double every auth/session request. */}
      <MinimalAuthContext.Provider value={{ user: null, role: null }}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MinimalAuthContext.Provider>
    </React.StrictMode>
  );
});



import i18n, { type BackendModule, type ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English ships in the main bundle; the other languages are fetched on demand
// (one chunk each) the first time they are needed, so a visitor in English
// never downloads es/pt/ht (~135 kB raw). The JSON files themselves are
// unchanged, so the locale tooling and tests keep importing them as before.
import enTranslation from './locales/en';

type Translation = Record<string, unknown>;

const loaders: Record<string, () => Promise<{ default: Translation }>> = {
  es: () => import('./locales/es.json'),
  ht: () => import('./locales/ht.json'),
  pt: () => import('./locales/pt.json'),
};

/**
 * i18next backend that resolves a language to its lazy chunk. Region
 * variants ("es-MX") share the base language's file; unknown languages
 * resolve to an empty bundle so lookups fall through to `fallbackLng`
 * without i18next retrying a "failed" load.
 */
const lazyBackend: BackendModule = {
  type: 'backend',
  init: () => {},
  read(language: string, _namespace: string, callback: ReadCallback) {
    const load = loaders[language.toLowerCase().split('-')[0]];
    if (!load) {
      callback(null, {});
      return;
    }
    load().then(
      (module) => callback(null, module.default),
      (error) => callback(error as Error, null)
    );
  },
};

/**
 * Resolves once the detected language's resources are loaded (immediately
 * for English). `main.tsx` awaits it before the first render so a non-English
 * visitor never sees untranslated keys; `changeLanguage` likewise resolves
 * only after the target language has loaded, so switching never flashes.
 */
export const i18nReady: Promise<unknown> = i18n
  // Detect user language
  .use(LanguageDetector)
  // Load the non-English bundles on demand
  .use(lazyBackend)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      }
    },
    // `resources` holds English only; other languages come from the backend.
    partialBundledLanguages: true,
    fallbackLng: 'en',
    // Initialise synchronously when everything needed is already bundled
    // (English), instead of deferring to a macrotask.
    initImmediate: false,
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

/** Keep <html lang> in sync so screen readers and hyphenation follow the UI language. */
const syncDocumentLang = (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
};
syncDocumentLang(i18n.language);
i18n.on('languageChanged', syncDocumentLang);

export default i18n;

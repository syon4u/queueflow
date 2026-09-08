
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en';
import esTranslation from './locales/es.json';
import htTranslation from './locales/ht.json';
import ptTranslation from './locales/pt.json';

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      },
      ht: {
        translation: htTranslation
      },
      pt: {
        translation: ptTranslation
      }
    },
    fallbackLng: 'en',
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

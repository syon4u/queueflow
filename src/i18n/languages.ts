/** UI languages offered by the language switcher, in menu order. */
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ht', name: 'Kreyòl Ayisyen' },
  { code: 'pt', name: 'Português' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

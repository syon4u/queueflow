
import { useTranslation } from 'react-i18next';

export const useLocale = () => {
  const { i18n } = useTranslation();

  const setLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  const getCurrentLanguage = () => {
    return i18n.language || 'en';
  };

  return {
    currentLanguage: getCurrentLanguage(),
    setLanguage,
    availableLanguages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ]
  };
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
// Add more imports for other languages as needed

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    // Add other languages here
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

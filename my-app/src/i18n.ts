// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: ['welcome','home', 'auth', 'login', 'signup', 'header', 'headers', 'recipe', 'about', 'footer', 'addRecipe', 'profile', 'feed', 'privacy'], 
    interpolation: {
      escapeValue: false,
    },

    
    resources: {
      en: {
        welcome: require('../public/locales/en/welcome.json'),
        home: require('../public/locales/en/home.json'),
        auth: require('../public/locales/en/auth.json'),
        footer: require('../public/locales/en/footer.json'),
        login: require('../public/locales/en/login.json'),
        signup: require('../public/locales/en/signup.json'),
        addRecipe: require('../public/locales/en/addRecipe.json'),
        profile: require('../public/locales/en/profile.json'),
        header: require('../public/locales/en/header.json'),
        about: require('../public/locales/en/about.json'),
        headers: require('../public/locales/en/headers.json'),
        feed: require('../public/locales/en/feed.json'),
        privacy: require('../public/locales/en/privacy.json'),
      },
      fr: {
        welcome: require('../public/locales/fr/welcome.json'),
        home: require('../public/locales/fr/home.json'),
        auth: require('../public/locales/fr/auth.json'),
        footer: require('../public/locales/fr/footer.json'),
        login: require('../public/locales/fr/login.json'),
        signup: require('../public/locales/fr/signup.json'),
        addRecipe: require('../public/locales/fr/addRecipe.json'),
        profile: require('../public/locales/fr/profile.json'),
        header: require('../public/locales/fr/header.json'),
        about: require('../public/locales/fr/about.json'),
        headers: require('../public/locales/fr/headers.json'), 
        feed: require('../public/locales/fr/feed.json'), 
        privacy: require('../public/locales/fr/privacy.json'),
      },
    },

    
  });

export default i18n;

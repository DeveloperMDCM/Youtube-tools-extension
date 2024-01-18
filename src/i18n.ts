// i18n.ts
import es from './_locales/es/messages.json';
import en from './_locales/en/messages.json';

type Messages = Record<string, string>;

type Locales = {
  [key: string]: Messages;
};

const locales: Locales = {
  es,
  en,
};

let currentLocale: string = 'en';

// Obtener el idioma seleccionado desde chrome.storage.local al inicio
chrome.storage.local.get(['selectedLanguage'], (result) => {
  currentLocale = result.selectedLanguage || currentLocale;
});

// Detectar cambios en chrome.storage.local
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.selectedLanguage) {
    currentLocale = changes.selectedLanguage.newValue || currentLocale;
    console.log(`Selected language changed to: ${currentLocale}`);
  }
});

export const setLocale = (locale: string) => {
  if (locales[locale]) {
    currentLocale = locale;
 
    chrome.storage.local.set({ selectedLanguage: locale });
  } else {
    console.warn(`Locale ${locale} not found. Using default locale: ${currentLocale}`);
  }
};

export const getMessage = (key: string): string => {
  const messages = locales[currentLocale];
  return messages[key] || key;
};

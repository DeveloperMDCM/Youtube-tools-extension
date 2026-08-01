import es from './locales/es.json';
import en from './locales/en.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import pl from './locales/pl.json';
import tr from './locales/tr.json';
import nl from './locales/nl.json';
import id from './locales/id.json';
import { extStorage } from './storage';
import { POPUP_LANGUAGES } from './languages';

type Messages = Record<string, string>;
const locales: Record<string, Messages> = {
  es,
  en,
  pt,
  fr,
  de,
  it,
  ja,
  ko,
  zh,
  ru,
  ar,
  hi,
  pl,
  tr,
  nl,
  id,
};

let currentLocale = 'en';

extStorage.get<{ selectedLanguage?: string }>(['selectedLanguage'], (result) => {
  if (result.selectedLanguage && locales[result.selectedLanguage]) {
    currentLocale = result.selectedLanguage;
  }
});

extStorage.onChanged.addListener((changes) => {
  if (changes.selectedLanguage?.newValue) {
    const next = String(changes.selectedLanguage.newValue);
    if (locales[next]) currentLocale = next;
  }
});

export const setLocale = (locale: string) => {
  if (!locales[locale]) return;
  currentLocale = locale;
  extStorage.set({ selectedLanguage: locale });
};

export const getMessage = (key: string): string =>
  locales[currentLocale]?.[key] || locales.en[key] || key;

export const getLocale = () => currentLocale;

export const getSupportedLocales = () => POPUP_LANGUAGES.map((l) => l.code);

import { Language } from './config';
import { Translations } from './types';
import { arTranslations } from './ar';
import { deTranslations } from './de';
import { enTranslations } from './en';
import { esTranslations } from './es';
import { frTranslations } from './fr';
import { itTranslations } from './it';
import { plTranslations } from './pl';
import { ptTranslations } from './pt';
import { roTranslations } from './ro';
import { ruTranslations } from './ru';
import { trTranslations } from './tr';

// Translations object
const translations: Record<Language, Translations> = {
  en: enTranslations,
  ar: arTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
  pl: plTranslations,
  pt: ptTranslations,
  ro: roTranslations,
  ru: ruTranslations,
  tr: trTranslations
};

export function getTranslation(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key;
        }
      }
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  if (params) {
    return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
      return result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    }, value);
  }

  return value;
} 
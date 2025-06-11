export type Language = 'en' | 'tr' | 'es' | 'pt' | 'de' | 'fr' | 'ru' | 'ro' | 'it' | 'pl' | 'ar';

export const defaultLanguage: Language = 'en';

export const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    dir: 'ltr' as const,
  },
  {
    code: 'tr',
    name: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr' as const,
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr' as const,
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    dir: 'ltr' as const,
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr' as const,
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    dir: 'ltr' as const,
  },
  {
    code: 'ru',
    name: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr' as const,
  },
  {
    code: 'ro',
    name: 'Română',
    flag: '🇷🇴',
    dir: 'ltr' as const,
  },
  {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr' as const,
  },
  {
    code: 'pl',
    name: 'Polski',
    flag: '🇵🇱',
    dir: 'ltr' as const,
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl' as const,
  },
];

export function isValidLanguage(lang: string): lang is Language {
  return languages.some((l) => l.code === lang);
}

export function getLanguageDirection(lang: Language): 'ltr' | 'rtl' {
  return languages.find((l) => l.code === lang)?.dir || 'ltr';
} 
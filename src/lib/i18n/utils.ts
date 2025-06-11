import { Language, defaultLanguage, languages } from './config';

export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage;

  // Get browser language
  const browserLang = navigator.language.split('-')[0];

  // Check if browser language is supported
  if (languages.some(lang => lang.code === browserLang)) {
    return browserLang as Language;
  }

  return defaultLanguage;
}

export function getLanguageDirection(lang: Language): 'ltr' | 'rtl' {
  const language = languages.find(l => l.code === lang);
  return language?.dir || 'ltr';
}

export function formatTranslationKey(key: string): string {
  // Convert spaces to dots and make lowercase
  return key.trim().toLowerCase().replace(/\s+/g, '.');
}

export function validateTranslationKey(key: string): boolean {
  // Key should only contain letters, numbers, dots, and underscores
  const validKeyRegex = /^[a-z0-9._]+$/;
  return validKeyRegex.test(key);
}

export function interpolateTranslation(
  translation: string,
  params?: Record<string, string | number>
): string {
  if (!params) return translation;

  return Object.entries(params).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, String(value));
  }, translation);
}

export function getLanguageName(code: Language): string {
  return languages.find(lang => lang.code === code)?.name || code;
}

export function getLanguageFlag(code: Language): string {
  return languages.find(lang => lang.code === code)?.flag || '';
}

// Function to ensure text is properly displayed in RTL languages
export function bidiText(text: string, lang: Language): string {
  const dir = getLanguageDirection(lang);
  if (dir === 'rtl') {
    return `\u202B${text}\u202C`; // Add RTL marks
  }
  return text;
} 
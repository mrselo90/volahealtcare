import { Language } from './config';

// Get language from browser headers
export function getLanguageFromHeaders(acceptLanguage: string): Language {
  if (!acceptLanguage) return 'en'; // Default to English
  
  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = '1'] = lang.trim().split(';q=');
      return { code: code.toLowerCase().split('-')[0], quality: parseFloat(q) };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // Find first supported language
  for (const lang of languages) {
    switch (lang.code) {
      case 'en': return 'en';
      case 'tr': return 'tr';
      case 'es': return 'es';
      case 'pt': return 'pt';
      case 'de': return 'de';
      case 'fr': return 'fr';
      case 'it': return 'it';
      case 'ru': return 'ru';
      case 'ro': return 'ro';
      case 'pl': return 'pl';
      case 'ar': return 'ar';
    }
  }
  
  return 'en'; // Default to English
}

// Simplified detection function - only cookie and browser language
export async function detectLanguage(ip: string, acceptLanguage: string, cookieLanguage?: string): Promise<Language> {
  // 1. Check user's saved preference first (Cookie)
  if (cookieLanguage && isValidLanguage(cookieLanguage)) {
    console.log(`Cookie-based language preference: ${cookieLanguage}`);
    return cookieLanguage as Language;
  }
  
  // 2. Use browser language detection
  const browserLanguage = getLanguageFromHeaders(acceptLanguage);
  console.log(`Browser-based language detection: ${browserLanguage}`);
  
  // 3. Return browser language or default to English
  return browserLanguage;
}

// Helper function to check if language is valid
function isValidLanguage(lang: string): boolean {
  const validLanguages = ['en', 'tr', 'es', 'pt', 'de', 'fr', 'ru', 'ro', 'it', 'pl', 'ar'];
  return validLanguages.includes(lang);
} 
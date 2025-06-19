import { ServiceTranslation, FAQTranslation, TestimonialTranslation } from '@prisma/client';

export interface TranslationMap {
  [language: string]: string;
}

export interface BaseTranslation {
  language: string;
  [key: string]: any;
}

/**
 * Get translation value by language with fallbacks
 */
export const getTranslation = (translations: BaseTranslation[], field: string, language: string = 'en'): string => {
  if (!translations || !Array.isArray(translations)) return '';
  
  // Try to find exact language match
  const exactMatch = translations.find(t => t.language === language);
  if (exactMatch && exactMatch[field]) return exactMatch[field];
  
  // Fallback to English
  if (language !== 'en') {
    const englishMatch = translations.find(t => t.language === 'en');
    if (englishMatch && englishMatch[field]) return englishMatch[field];
  }
  
  // Fallback to first available translation
  const firstAvailable = translations.find(t => t[field] && t[field].trim());
  if (firstAvailable) return firstAvailable[field];
  
  return '';
};

/**
 * Get service title with language fallback
 */
export const getServiceTitle = (service: { title?: string; translations?: ServiceTranslation[] }, language: string = 'en'): string => {
  if (service.translations && service.translations.length > 0) {
    const translatedTitle = getTranslation(service.translations, 'title', language);
    if (translatedTitle) return translatedTitle;
  }
  
  return service.title || '';
};

/**
 * Get service description with language fallback
 */
export const getServiceDescription = (service: { description?: string; translations?: ServiceTranslation[] }, language: string = 'en'): string => {
  if (service.translations && service.translations.length > 0) {
    // Try content field first, then description field
    const translatedContent = getTranslation(service.translations, 'content', language);
    if (translatedContent) return translatedContent;
    
    const translatedDesc = getTranslation(service.translations, 'description', language);
    if (translatedDesc) return translatedDesc;
  }
  
  return service.description || '';
};

/**
 * Get FAQ text with language fallback
 */
export const getFAQTranslation = (faq: { question?: string; answer?: string; translations?: FAQTranslation[] }, field: 'question' | 'answer', language: string = 'en'): string => {
  if (faq.translations && faq.translations.length > 0) {
    const translatedText = getTranslation(faq.translations, field, language);
    if (translatedText) return translatedText;
  }
  
  return faq[field] || '';
};

/**
 * Create translation objects for multiple languages
 */
export const createTranslations = (data: TranslationMap, serviceId?: string, faqId?: string): Array<{
  language: string;
  title?: string;
  description?: string;
  question?: string;
  answer?: string;
  serviceId?: string;
  faqId?: string;
}> => {
  return Object.entries(data).map(([language, value]) => {
    const translation: any = { language };
    
    if (serviceId) {
      translation.serviceId = serviceId;
      // Determine if it's title or description based on content length
      if (value.length < 100) {
        translation.title = value;
      } else {
        translation.description = value;
      }
    }
    
    if (faqId) {
      translation.faqId = faqId;
      // You would need to specify question vs answer in the input
      translation.question = value; // This needs to be more specific in real usage
    }
    
    return translation;
  });
};

/**
 * Validate translation data
 */
export const validateTranslationData = (translations: Array<{
  language?: string;
  title?: string;
  description?: string;
}>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!translations || !Array.isArray(translations) || translations.length === 0) {
    errors.push('At least one translation is required');
    return { isValid: false, errors };
  }
  
  // Check for English translation
  const hasEnglish = translations.some(t => t.language === 'en');
  if (!hasEnglish) {
    errors.push('English translation is required');
  }
  
  // Validate each translation
  translations.forEach((translation, index) => {
    if (!translation.language) {
      errors.push(`Translation ${index + 1}: Language is required`);
    }
    
    if (!translation.title && !translation.description) {
      errors.push(`Translation ${index + 1}: Either title or description is required`);
    }
  });
  
  // Check for duplicate languages
  const languages = translations.map(t => t.language).filter(Boolean);
  const uniqueLanguages = new Set(languages);
  if (languages.length !== uniqueLanguages.size) {
    errors.push('Duplicate languages found in translations');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get available languages from translations
 */
export const getAvailableLanguages = (translations: BaseTranslation[]): string[] => {
  if (!translations || !Array.isArray(translations)) return [];
  
  const languages = translations.map(t => t.language).filter(Boolean);
  return Array.from(new Set(languages)).sort();
};

/**
 * Convert translations array to map for easier access
 */
export const translationsToMap = (translations: BaseTranslation[], field: string): TranslationMap => {
  if (!translations || !Array.isArray(translations)) return {};
  
  const map: TranslationMap = {};
  translations.forEach(translation => {
    if (translation.language && translation[field]) {
      map[translation.language] = translation[field];
    }
  });
  
  return map;
};

/**
 * Check if translations exist for a specific language
 */
export const hasTranslation = (translations: BaseTranslation[], language: string): boolean => {
  if (!translations || !Array.isArray(translations)) return false;
  return translations.some(t => t.language === language);
};

/**
 * Get supported languages from the system
 */
export const getSupportedLanguages = (): Array<{ code: string; name: string; nativeName: string }> => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' }
  ];
}; 
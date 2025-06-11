import { Category } from '@prisma/client';

export interface ParsedCategoryName {
  en: string;
  tr?: string;
  [key: string]: string | undefined;
}

/**
 * Parse category name from JSON string or return as-is
 */
export const parseCategoryName = (nameJson: string): ParsedCategoryName => {
  try {
    const parsed = JSON.parse(nameJson);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        en: parsed.en || '',
        tr: parsed.tr,
        ...parsed
      };
    }
    // If it's not an object, treat as English name
    return { en: String(parsed) };
  } catch {
    // If parsing fails, treat as English name
    return { en: nameJson || '' };
  }
};

/**
 * Get category name in specified language with fallbacks
 */
export const getCategoryName = (category: Category, lang: string = 'en'): string => {
  if (!category?.name) return category?.slug || '';
  
  const parsed = parseCategoryName(category.name);
  
  // Try requested language first
  if (parsed[lang]) return parsed[lang];
  
  // Fallback to English
  if (parsed.en) return parsed.en;
  
  // Fallback to first available value
  const firstValue = Object.values(parsed).find(v => v && v.trim());
  if (firstValue) return firstValue;
  
  // Final fallback to slug
  return category.slug || '';
};

/**
 * Create category name JSON string for database storage
 */
export const createCategoryNameJson = (names: Partial<ParsedCategoryName>): string => {
  const cleanedNames: ParsedCategoryName = {
    en: names.en || '',
    ...(names.tr && { tr: names.tr })
  };
  
  // Add any other language keys
  Object.keys(names).forEach(key => {
    if (key !== 'en' && key !== 'tr' && names[key]) {
      cleanedNames[key] = names[key];
    }
  });
  
  return JSON.stringify(cleanedNames);
};

/**
 * Validate category data before saving
 */
export const validateCategoryData = (data: {
  name?: string | ParsedCategoryName;
  slug?: string;
  description?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.slug || data.slug.trim() === '') {
    errors.push('Slug is required');
  }
  
  if (!data.name) {
    errors.push('Name is required');
  } else {
    const parsed = typeof data.name === 'string' 
      ? parseCategoryName(data.name) 
      : data.name;
    
    if (!parsed.en || parsed.en.trim() === '') {
      errors.push('English name is required');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 
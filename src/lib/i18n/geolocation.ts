import { Language } from './config';

// Country to language mapping
export const countryToLanguage: Record<string, Language> = {
  // Turkish
  'TR': 'tr',
  
  // Spanish
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'PE': 'es',
  'VE': 'es',
  'CL': 'es',
  'EC': 'es',
  'BO': 'es',
  'PY': 'es',
  'UY': 'es',
  'CR': 'es',
  'PA': 'es',
  'GT': 'es',
  'HN': 'es',
  'SV': 'es',
  'NI': 'es',
  'DO': 'es',
  'CU': 'es',
  
  // Portuguese
  'PT': 'pt',
  'BR': 'pt',
  'AO': 'pt',
  'MZ': 'pt',
  
  // German
  'DE': 'de',
  'AT': 'de',
  'CH': 'de',
  'LI': 'de',
  'LU': 'de',
  
  // French
  'FR': 'fr',
  'BE': 'fr',
  'CA': 'fr',
  'CH': 'fr',
  'LU': 'fr',
  'MC': 'fr',
  'SN': 'fr',
  'CI': 'fr',
  'MA': 'fr',
  'TN': 'fr',
  'DZ': 'fr',
  
  // Italian
  'IT': 'it',
  'SM': 'it',
  'VA': 'it',
  'CH': 'it',
  
  // Russian
  'RU': 'ru',
  'BY': 'ru',
  'KZ': 'ru',
  'KG': 'ru',
  'TJ': 'ru',
  'UZ': 'ru',
  'AM': 'ru',
  'AZ': 'ru',
  'GE': 'ru',
  'MD': 'ru',
  'UA': 'ru',
  
  // Romanian
  'RO': 'ro',
  'MD': 'ro',
  
  // Polish
  'PL': 'pl',
  
  // Arabic
  'SA': 'ar',
  'AE': 'ar',
  'EG': 'ar',
  'JO': 'ar',
  'LB': 'ar',
  'SY': 'ar',
  'IQ': 'ar',
  'KW': 'ar',
  'QA': 'ar',
  'BH': 'ar',
  'OM': 'ar',
  'YE': 'ar',
  'LY': 'ar',
  'TN': 'ar',
  'DZ': 'ar',
  'MA': 'ar',
  'SD': 'ar',
  'PS': 'ar',
  
  // Default to English for other countries
};

// Medical tourism priority countries (countries that commonly seek medical tourism in Turkey)
export const medicalTourismCountries: Record<string, Language> = {
  'DE': 'de',
  'NL': 'de', // Netherlands -> German (common in medical tourism)
  'BE': 'fr',
  'FR': 'fr',
  'IT': 'it',
  'ES': 'es',
  'PT': 'pt',
  'RU': 'ru',
  'PL': 'pl',
  'RO': 'ro',
  'UK': 'en',
  'GB': 'en',
  'US': 'en',
  'CA': 'en',
  'AU': 'en',
  'NZ': 'en',
  'IE': 'en',
  'SA': 'ar',
  'AE': 'ar',
  'QA': 'ar',
  'KW': 'ar',
  'BH': 'ar',
  'OM': 'ar',
};

// Get language from country code
export function getLanguageFromCountry(countryCode: string): Language {
  // First check medical tourism priority
  if (medicalTourismCountries[countryCode]) {
    return medicalTourismCountries[countryCode];
  }
  
  // Then check general country mapping
  if (countryToLanguage[countryCode]) {
    return countryToLanguage[countryCode];
  }
  
  // Default to Turkish for Turkey and neighboring countries
  if (['TR', 'CY', 'GR', 'BG', 'GE', 'AM', 'AZ', 'SY', 'IQ', 'IR'].includes(countryCode)) {
    return 'tr';
  }
  
  // Default to Turkish for unknown countries (medical tourism site)
  return 'tr';
}

// Get country from IP (server-side)
export async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // Skip IPv6 localhost and invalid IPs
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::')) {
      return null;
    }
    
    // Try multiple IP geolocation services with proper timeout
    const services = [
      `https://ipinfo.io/${ip}/country`,
      `https://api.country.is/${ip}`,
      `https://ipapi.co/${ip}/country/`,
    ];
    
    for (const service of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const response = await fetch(service, { 
          headers: { 
            'User-Agent': 'Vola Health Website',
            'Accept': 'text/plain, application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.text();
          const countryCode = data.trim().toUpperCase();
          
          if (countryCode && countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode)) {
            console.log(`Successfully detected country ${countryCode} from ${service}`);
            return countryCode;
          }
        }
      } catch (error) {
        console.warn(`IP service ${service} failed:`, error.message || error);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting country from IP:', error);
    return null;
  }
}

// Get language from browser headers
export function getLanguageFromHeaders(acceptLanguage: string): Language {
  if (!acceptLanguage) return 'tr'; // Default to Turkish
  
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
      case 'tr': return 'tr';
      case 'en': return 'en';
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
  
  return 'tr'; // Default to Turkish instead of English
}

// Combined detection function
export async function detectLanguage(ip: string, acceptLanguage: string, cookieLanguage?: string): Promise<Language> {
  // 1. Check user's saved preference first
  if (cookieLanguage && isValidLanguage(cookieLanguage)) {
    console.log(`Cookie-based language preference: ${cookieLanguage}`);
    return cookieLanguage as Language;
  }
  
  // 2. Try IP-based detection (more accurate for medical tourism)
  try {
    const country = await getCountryFromIP(ip);
    if (country) {
      const ipLanguage = getLanguageFromCountry(country);
      console.log(`IP-based language detection: ${country} -> ${ipLanguage}`);
      return ipLanguage;
    }
  } catch (error) {
    console.warn('IP-based detection failed:', error);
  }
  
  // 3. Fallback to browser language
  const browserLanguage = getLanguageFromHeaders(acceptLanguage);
  console.log(`Browser-based language detection: ${browserLanguage}`);
  
  // 4. Final fallback to Turkish (since it's a Turkish medical tourism site)
  return browserLanguage || 'tr';
}

// Helper function to check if language is valid (imported from config)
function isValidLanguage(lang: string): boolean {
  const validLanguages = ['en', 'tr', 'es', 'pt', 'de', 'fr', 'ru', 'ro', 'it', 'pl', 'ar'];
  return validLanguages.includes(lang);
} 
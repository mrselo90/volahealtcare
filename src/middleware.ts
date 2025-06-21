import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { languages, defaultLanguage, isValidLanguage } from './lib/i18n/config';
import { detectLanguage } from './lib/i18n/geolocation';

// Multi-language category slug mapping to English slugs
const categorySlugMapping: Record<string, string> = {
  // Turkish slugs
  'sac-ekimi': 'hair-transplant',
  'dis-tedavileri': 'dental-treatments',
  'plastik-cerrahi': 'plastic-surgery',
  
  // Spanish slugs (corrected)
  'trasplante-de-cabello': 'hair-transplant',
  'tratamientos-dentales': 'dental-treatments',
  'cirugia-plastica': 'plastic-surgery',
  
  // Portuguese slugs
  'transplante-capilar': 'hair-transplant',
  'tratamentos-dentarios': 'dental-treatments',
  'cirurgia-plastica': 'plastic-surgery',
  
  // German slugs
  'haartransplantation': 'hair-transplant',
  'zahnbehandlungen': 'dental-treatments',
  'plastische-chirurgie': 'plastic-surgery',
  
  // French slugs
  'greffe-de-cheveux': 'hair-transplant',
  'traitements-dentaires': 'dental-treatments',
  'chirurgie-plastique': 'plastic-surgery',
  
  // Italian slugs
  'trapianto-capelli': 'hair-transplant',
  'trattamenti-dentali': 'dental-treatments',
  'chirurgia-plastica': 'plastic-surgery',
  
  // Russian slugs
  'peresadka-volos': 'hair-transplant',
  'stomatologicheskie-uslugi': 'dental-treatments',
  'plasticheskaya-khirurgiya': 'plastic-surgery',
  
  // Romanian slugs
  'transplant-par': 'hair-transplant',
  'tratamente-dentare': 'dental-treatments',
  'chirurgie-plastica': 'plastic-surgery',
  
  // Polish slugs
  'przeszczep-wlosow': 'hair-transplant',
  'zabiegi-stomatologiczne': 'dental-treatments',
  'chirurgia-plastyczna': 'plastic-surgery',
  
  // Arabic slugs
  'zraaat-alshaar': 'hair-transplant',
  'eelajat-alasnan': 'dental-treatments',
  'jerahat-altajmeel': 'plastic-surgery',
  
  // Alternative English slugs
  'aesthetic': 'plastic-surgery',
  'aesthetics': 'plastic-surgery',
  'cosmetic': 'plastic-surgery',
  'cosmetic-surgery': 'plastic-surgery',
  'hair': 'hair-transplant',
  'dental': 'dental-treatments',
  'plastic': 'plastic-surgery'
};

// Helper function to get language from pathname
function getLanguageFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  const potentialLang = segments[1];
  
  if (potentialLang && isValidLanguage(potentialLang)) {
    return potentialLang;
  }
  
  return null;
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return request.ip || '127.0.0.1';
}

// Helper function to handle category slug redirects
function handleCategorySlugs(pathname: string): string | null {
  // Check for category slugs in /services/ path (without language prefix)
  const servicesMatch = pathname.match(/^\/services\/([^\/]+)(?:\/(.+))?$/);
  if (servicesMatch) {
    const [, categorySlug, serviceSlug] = servicesMatch;
    const englishCategorySlug = categorySlugMapping[categorySlug];
    
    if (englishCategorySlug) {
      // Redirect category slug to English equivalent
      return serviceSlug 
        ? `/services/${englishCategorySlug}/${serviceSlug}`
        : `/services/${englishCategorySlug}`;
    }
  }
  
  // Check for category slugs in /{lang}/services/ path (with language prefix)
  const langServicesMatch = pathname.match(/^\/([a-z]{2})\/services\/([^\/]+)(?:\/(.+))?$/);
  if (langServicesMatch) {
    const [, lang, categorySlug, serviceSlug] = langServicesMatch;
    const englishCategorySlug = categorySlugMapping[categorySlug];
    
    if (englishCategorySlug && isValidLanguage(lang)) {
      // Redirect category slug to English equivalent with language prefix
      return serviceSlug 
        ? `/${lang}/services/${englishCategorySlug}/${serviceSlug}`
        : `/${lang}/services/${englishCategorySlug}`;
    }
  }
  
  return null;
}

// Main middleware function
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for admin routes - handle them with auth
  if (pathname.startsWith('/admin')) {
    return withAuth(
      function middleware(req) {
        return NextResponse.next();
      },
      {
        callbacks: {
          authorized: ({ token }) => token?.role === 'admin',
        },
        pages: {
          signIn: '/auth/signin',
        },
      }
    )(request as any);
  }
  
  // Skip middleware for API routes, static files, and special paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/videos/') ||
    pathname.startsWith('/uploads/') ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle category slug redirects first
  const redirectPath = handleCategorySlugs(pathname);
  if (redirectPath) {
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }
  
  // Check if pathname already has a language prefix
  const currentLanguage = getLanguageFromPathname(pathname);
  
  // If URL has default language prefix, allow it to continue normally
  // Note: We don't redirect default language URLs to clean URLs anymore
  // This allows /tr/services to work properly
  
  // If no language in URL, treat as default language (Turkish)
  if (!currentLanguage) {
    // For non-default languages, detect and redirect
    try {
      const clientIP = getClientIP(request);
      const acceptLanguage = request.headers.get('accept-language') || '';
      const cookieLanguage = request.cookies.get('vola-language')?.value;
      
      const detectedLanguage = await detectLanguage(clientIP, acceptLanguage, cookieLanguage);
      
      // If detected language is not default, redirect to language-prefixed URL
      if (detectedLanguage !== defaultLanguage) {
        const url = request.nextUrl.clone();
        url.pathname = `/${detectedLanguage}${pathname}`;
        
        const response = NextResponse.redirect(url);
        response.headers.set('X-Detected-Language', detectedLanguage);
        response.headers.set('X-Client-IP', clientIP);
        
        return response;
      }
      
      // If detected language is default, rewrite to default language folder
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLanguage}${pathname}`;
      return NextResponse.rewrite(url);
      
    } catch (error) {
      console.error('Language detection failed:', error);
      // Fallback: rewrite to default language
      const url = request.nextUrl.clone();
      url.pathname = `/${defaultLanguage}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }
  
  // If language is valid and not default, continue normally
  if (isValidLanguage(currentLanguage)) {
    return NextResponse.next();
  }
  
  // If invalid language, redirect to clean URL (default language)
  const url = request.nextUrl.clone();
  url.pathname = pathname.replace(`/${currentLanguage}`, '') || '/';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, videos, uploads (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|videos|uploads).*)',
  ],
}; 
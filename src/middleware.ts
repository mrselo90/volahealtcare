import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { languages, defaultLanguage, isValidLanguage } from './lib/i18n/config';
import { detectLanguage } from './lib/i18n/geolocation';

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
  
  // Check if pathname already has a language prefix
  const currentLanguage = getLanguageFromPathname(pathname);
  
  // If URL has default language prefix, redirect to clean URL
  if (currentLanguage === defaultLanguage) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(`/${defaultLanguage}`, '') || '/';
    return NextResponse.redirect(url);
  }
  
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
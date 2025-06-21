'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/hooks';
import { languages } from '@/lib/i18n/config';
import { useState, useEffect } from 'react';

interface SocialMediaUrls {
  instagram: string;
  facebook: string;
  trustpilot: string;
  googlemaps: string;
  linkedin: string;
  youtube: string;
  pinterest: string;
  twitter: string;
}

export function Footer() {
  const { t, language } = useTranslation();
  const pathname = usePathname();
  const [socialUrls, setSocialUrls] = useState<SocialMediaUrls>({
    instagram: '',
    facebook: '',
    trustpilot: '',
    googlemaps: '',
    linkedin: '',
    youtube: '',
    pinterest: '',
    twitter: '',
  });
  
  useEffect(() => {
    const fetchSocialUrls = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSocialUrls(data.socialMedia);
        }
      } catch (error) {
        console.error('Error fetching social media URLs:', error);
      }
    };

    fetchSocialUrls();
  }, []);

  // Get current language from URL
  const pathSegments = pathname.split('/');
  const currentLangInPath = pathSegments[1];
  const hasLanguagePrefix = languages.some(lang => lang.code === currentLangInPath);
  const currentLang = hasLanguagePrefix ? currentLangInPath : language;
  
  // Helper function to create language-aware links
  const createLink = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return href;
    }
    return hasLanguagePrefix ? `/${currentLang}${href}` : `/${language}${href}`;
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="mx-auto max-w-7xl section-padding-mobile lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-3 sm:mb-4">Vola Health Istanbul</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">
              {t('footer.companyDesc')}
            </p>
            
            {/* Social Media Links - Mobile Optimized */}
            <div className="flex gap-3 sm:gap-4 mt-4">
              {socialUrls.instagram && (
                <a 
                  href={socialUrls.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {socialUrls.facebook && (
                <a
                  href={socialUrls.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {socialUrls.trustpilot && (
                <a 
                  href={socialUrls.trustpilot} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="View our Trustpilot reviews"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0l3.708 7.514 8.292 1.207-6 5.849 1.416 8.259L12 18.902l-7.416 3.927L6 14.57 0 8.721l8.292-1.207L12 0z"/>
                  </svg>
                </a>
              )}
              {socialUrls.googlemaps && (
                <a 
                  href={socialUrls.googlemaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label="Find us on Google Maps"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-base text-professional-bold text-white mb-3 sm:mb-4 tracking-wide">
              {t('common.quickLinks') || 'QUICK LINKS'}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href={createLink('/services')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('nav.services') || 'Services'}
                </Link>
              </li>
              <li>
                <Link href={createLink('/about')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('nav.about') || 'About Us'}
                </Link>
              </li>
              <li>
                <Link href={createLink('/gallery')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('nav.gallery') || 'Gallery'}
                </Link>
              </li>
              <li>
                <Link href={createLink('/testimonials')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('nav.testimonials') || 'View All Testimonials'}
                </Link>
              </li>
              <li>
                <Link href={createLink('/contact')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('nav.contact') || 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-base text-professional-bold text-white mb-3 sm:mb-4 tracking-wide">
              {t('nav.services') || 'SERVICES'}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href={createLink('/services/hair-transplant')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('services.categories.hair') || 'Hair Transplant'}
                </Link>
              </li>
              <li>
                <Link href={createLink('/services/dental-treatments')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('services.categories.dental') || 'Dental Services'}
                </Link>
              </li>
              <li>
                <Link href={createLink('/services/plastic-surgery')} className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform inline-block">
                  {t('services.categories.plastic') || 'Plastic Surgery'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-base text-professional-bold text-white mb-3 sm:mb-4 tracking-wide">
              {t('nav.contact') || 'CONTACT'}
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm sm:text-base">{t('footer.istanbul')}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/905444749881" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:text-blue-400 transition-colors">
                  +90 544 474 98 81
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@volahealthistanbul.com" className="text-sm sm:text-base hover:text-blue-400 transition-colors break-all">
                  info@volahealthistanbul.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Mobile Responsive */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Vola Health Istanbul. {t('footer.allRightsReserved')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center sm:text-left">
              <Link href={createLink('/privacy')} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link href={createLink('/terms')} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors">
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
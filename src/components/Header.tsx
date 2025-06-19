'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/lib/i18n/hooks';
import { languages } from '@/lib/i18n/config';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { t, language } = useTranslation();
  const pathname = usePathname();
  
  // Client-side hydration protection
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get current language from URL
  const pathSegments = pathname.split('/');
  const currentLangInPath = pathSegments[1];
  const hasLanguagePrefix = languages.some(lang => lang.code === currentLangInPath);
  const currentLang = hasLanguagePrefix ? currentLangInPath : 'tr'; // Default to Turkish
  
  // Helper function to create language-aware links
  const createLink = (href: string) => {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return href;
    }
    
    // For default language (Turkish), use clean URLs without prefix
    if (currentLang === 'tr') {
      return href;
    }
    
    // For other languages, use language prefix
    return `/${currentLang}${href}`;
  };

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Use static text during SSR to prevent hydration mismatch
  const navigation = [
    { name: isClient ? (t('nav.home') || 'Home') : 'Home', href: createLink('/') },
    { name: isClient ? (t('nav.services') || 'Services') : 'Services', href: createLink('/services') },
    { name: isClient ? (t('nav.about') || 'About') : 'About', href: createLink('/about') },
    { name: isClient ? (t('nav.whyChooseUs') || 'Why Choose Us?') : 'Why Choose Us?', href: createLink('/why-choose-us') },
    { name: isClient ? (t('nav.results') || 'Results') : 'Results', href: createLink('/gallery') },
    { name: isClient ? (t('nav.testimonials') || 'Testimonials') : 'Testimonials', href: createLink('/testimonials') },
    { name: isClient ? (t('nav.contact') || 'Contact') : 'Contact', href: createLink('/contact') },
  ];

  const whatsappMessage = encodeURIComponent(isClient ? (t('whatsapp.defaultMessage') || 'Hello! I am interested in your services.') : 'Hello! I am interested in your services.');
  const whatsappUrl = `https://wa.me/905444749881?text=${whatsappMessage}`;

  return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-full xl:max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <nav className="flex items-center h-14 sm:h-16 lg:h-20 gap-2 sm:gap-3 md:gap-4 lg:gap-8" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link 
              href={createLink('/')} 
              className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 group focus:outline-none rounded-lg p-0.5 sm:p-1 min-w-0"
              aria-label="Vola Health - Home"
            >
              <div className="relative flex-shrink-0">
                <Image 
                  src="/Vola_edited.jpg" 
                  alt="Vola Health Logo" 
                  width={28}
                  height={28}
                  className="rounded-lg w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  Vola Health
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Flexible center */}
          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0">
            <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-6 overflow-x-auto scrollbar-hide">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs lg:text-xs xl:text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 px-2 lg:px-3 xl:px-4 py-1 lg:py-1.5 rounded-md hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side actions - Flexible */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 flex-shrink-0 min-w-0">
            {/* Desktop CTA Buttons - Responsive */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4 flex-shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 md:px-4 lg:px-5 xl:px-6 py-2 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-xs xl:text-sm font-medium rounded-md lg:rounded-lg transition-colors duration-200 shadow-sm hover:shadow whitespace-nowrap"
                aria-label="Contact us via WhatsApp"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1 lg:mr-1.5" aria-hidden="true" />
                <span className="hidden lg:inline">{isClient ? (t('common.messageNow') || 'Message Now') : 'Message Now'}</span>
                <span className="lg:hidden">{isClient ? (t('common.messageNow') || 'Message') : 'Message'}</span>
              </a>
              <Link
                href={createLink('/consultation')}
                className="inline-flex items-center px-3 md:px-4 lg:px-5 xl:px-6 py-2 md:py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs lg:text-xs xl:text-sm font-medium rounded-md lg:rounded-lg transition-colors duration-200 shadow-sm hover:shadow whitespace-nowrap"
              >
                <SparklesIcon className="w-4 h-4 mr-1 lg:mr-1.5" aria-hidden="true" />
                <span className="hidden lg:inline">{isClient ? (t('nav.consultation') || 'Free Consultation') : 'Free Consultation'}</span>
                <span className="lg:hidden">{isClient ? (t('nav.consultation') || 'Consult') : 'Consult'}</span>
              </Link>
            </div>

            {/* Language Selector - Flexible */}
            <div className="hidden md:block flex-shrink-0">
              <LanguageSelector />
            </div>

            {/* Mobile Actions - Flexible */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md sm:rounded-lg transition-colors duration-200 flex-shrink-0"
                aria-label="Contact us via WhatsApp"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </a>
              
              <button
                type="button"
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors duration-200 flex-shrink-0"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open main menu"
                aria-expanded={mobileMenuOpen}
              >
                <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div 
            className="absolute inset-0" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />
          
          <div className="absolute top-14 sm:top-16 lg:top-20 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1">
              {/* Navigation Links */}
              <nav className="space-y-0.5 sm:space-y-1" role="navigation" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md sm:rounded-lg font-medium transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* CTA Buttons */}
              <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 border-t border-gray-200">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-colors duration-200"
                  aria-label="Contact us via WhatsApp"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                  {isClient ? (t('common.messageNow') || 'Message Now') : 'Message Now'}
                </a>
                <Link
                  href={createLink('/consultation')}
                  className="flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  <SparklesIcon className="w-4 h-4 mr-1.5 sm:mr-2" aria-hidden="true" />
                  {isClient ? (t('nav.consultation') || 'Free Consultation') : 'Free Consultation'}
                </Link>
              </div>
              
              {/* Language Selector */}
              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <div className="px-3 sm:px-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
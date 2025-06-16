'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { LanguageSelector } from './LanguageSelector';

import { useTranslation } from '@/lib/i18n/hooks';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const navigation = [
    { name: t('nav.home') || 'Home', href: '/' },
    { name: t('nav.services') || 'Services', href: '/services' },
    { name: t('nav.about') || 'About', href: '/about' },
    { name: t('nav.whyChooseUs') || 'Why Choose Us', href: '/why-choose-us' },
    { name: t('nav.results') || 'Results', href: '/gallery' },
    { name: t('nav.contact') || 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100/30'
    }`}>
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 min-h-[64px] sm:min-h-[72px] transition-all duration-300">
        {/* Logo - Enhanced with mobile-first responsive design */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <Image 
                src="/Vola_edited.jpg" 
                alt="Vola Health Logo" 
                width={36}
                height={36}
                className="relative rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 sm:w-11 sm:h-11"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-serif font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent whitespace-nowrap">
                Vola Health
              </span>
              <span className="text-[10px] sm:text-xs text-professional-light tracking-wide">
                Medical Tourism
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Enhanced with hover effects */}
        <div className="hidden xl:flex flex-1 justify-center">
          <div className="flex space-x-1 bg-gray-50/50 rounded-2xl p-2 backdrop-blur-sm">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm text-professional text-gray-700 hover:text-blue-600 transition-all duration-300 whitespace-nowrap px-4 py-2.5 rounded-xl hover:bg-white hover:shadow-md group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section - Mobile optimized */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Desktop CTA Buttons - Enhanced with gradients */}
          <div className="hidden xl:flex items-center space-x-3">
            <a
              href="tel:+905444749881"
              className="group relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-professional-bold text-sm transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 flex-shrink-0 group-hover:animate-pulse" />
              <span>{t('common.messageNow') || 'Message Now'}</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <Link
              href="/consultation"
              className="group relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-professional-bold text-sm transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <SparklesIcon className="w-4 h-4 flex-shrink-0 group-hover:animate-pulse" />
              <span>{t('nav.consultation') || 'Free Consultation'}</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Language Selector - Enhanced styling */}
          <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-gray-200/50">
            <div className="flex items-center bg-gray-50/50 rounded-xl p-1">
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile CTA Button - Visible on mobile/tablet */}
          <div className="flex xl:hidden">
            <a
              href="tel:+905444749881"
              className="group relative flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[44px] min-h-[44px]"
              aria-label="Call Now"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 flex-shrink-0" />
            </a>
          </div>

          {/* Mobile Menu Button - Enhanced with better touch target */}
          <div className="flex xl:hidden">
            <button
              type="button"
              className="relative p-2.5 sm:p-3 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50 group min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Simple Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="xl:hidden fixed inset-0 z-40" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="xl:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="p-4 space-y-2">
              {/* Close button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Language</span>
                  <LanguageSelector />
                </div>
                
                <div className="space-y-2">
                  <a
                    href="tel:+905444749881"
                    className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors duration-200"
                  >
                    {t('common.messageNow') || 'Message Now'}
                  </a>
                  
                  <Link
                    href="/consultation"
                    className="block w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg font-medium transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.consultation') || 'Free Consultation'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.whyChooseUs'), href: '/why-choose-us' },
    { name: t('nav.results'), href: '/gallery' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100/30'
    }`}>
      {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      
      <nav className="mx-auto flex max-w-7xl items-center px-4 lg:px-6 xl:px-8 py-4 min-h-[72px] transition-all duration-300">
        {/* Logo - Enhanced with glow effect */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <Image 
                src="/Vola_edited.jpg" 
                alt="Vola Health Logo" 
                width={44}
                height={44}
                className="relative rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent whitespace-nowrap">
                Vola Health
              </span>
              <span className="text-xs text-professional-light tracking-wide">
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

        {/* Right Section - Enhanced buttons */}
        <div className="flex items-center space-x-3 ml-auto">
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
          <div className="hidden xl:flex items-center space-x-2 pl-4 border-l border-gray-200/50">
            <div className="flex items-center bg-gray-50/50 rounded-xl p-1">
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <div className="flex xl:hidden">
            <button
              type="button"
              className="relative p-3 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-gray-50 group"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Enhanced with better animations */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[9999]">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white backdrop-blur-xl shadow-2xl transform transition-transform duration-300 z-[10000]">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <div className="flex items-center space-x-3">
                <Image 
                  src="/Vola_edited.jpg" 
                  alt="Vola Health Logo" 
                  width={32}
                  height={32}
                  className="rounded-lg shadow-md"
                />
                <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t('nav.menu') || 'Menu'}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white/50 transition-all duration-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Navigation links */}
              <div className="space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-base font-medium text-gray-900 hover:text-blue-600 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:translate-x-1"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* CTA buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200/50">
                <a
                  href="tel:+905444749881"
                                      className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>{t('common.messageNow') || 'Message Now'}</span>
                </a>
                <Link
                  href="/consultation"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>{t('nav.consultation') || 'Free Consultation'}</span>
                </Link>
              </div>
              
              {/* Language section */}
              <div className="pt-6 border-t border-gray-200/50">
                <div className="bg-gray-50/50 rounded-xl p-4">
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
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

      {/* Enhanced Mobile Menu - Web Consistent Design */}
      {mobileMenuOpen && (
        <div className="xl:hidden">
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl z-50">
            {/* Gradient accent bar */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            
            <div className="p-6 space-y-1">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25"></div>
                    <Image 
                      src="/Vola_edited.jpg" 
                      alt="Vola Health Logo" 
                      width={32}
                      height={32}
                      className="relative rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-serif font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Menu
                    </span>
                    <span className="text-xs text-gray-500">Vola Health Istanbul</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative p-2.5 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 group min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-6 w-6 transition-transform duration-200 group-active:scale-95" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
              
              {/* Navigation Links */}
              <div className="space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative block text-base font-medium text-gray-900 hover:text-blue-600 active:text-blue-700 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 active:from-blue-100 active:to-purple-100 transition-all duration-300 transform hover:translate-x-1 active:translate-x-0 min-h-[56px] flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Touch feedback ripple */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 bg-blue-500 transition-opacity duration-100"></div>
                  </Link>
                ))}
              </div>
              
              {/* Language Selector */}
              <div className="pt-4 mt-6 border-t border-gray-200/50">
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Language / Dil</span>
                    <div className="bg-white rounded-lg p-1 shadow-sm">
                      <LanguageSelector />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="pt-6 space-y-3">
                <a
                  href="tel:+905444749881"
                  className="group relative flex items-center justify-center space-x-2 w-full px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl active:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 min-h-[56px]"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 group-active:scale-95 transition-transform duration-100" />
                  <span>{t('common.messageNow') || 'Message Now'}</span>
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-100"></div>
                </a>
                
                <Link
                  href="/consultation"
                  className="group relative flex items-center justify-center space-x-2 w-full px-4 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl active:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 min-h-[56px]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SparklesIcon className="w-5 h-5 group-active:scale-95 transition-transform duration-100" />
                  <span>{t('nav.consultation') || 'Free Consultation'}</span>
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-100"></div>
                </Link>
              </div>
              
              {/* Contact Info */}
              <div className="pt-4 mt-4 border-t border-gray-200/30">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Premium Medical Tourism</p>
                  <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Istanbul, Turkey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 
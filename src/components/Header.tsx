'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { LanguageSelector } from './LanguageSelector';
import { SearchBar } from './SearchBar';
import { NotificationBell } from './NotificationBell';
import { useTranslation } from '@/lib/i18n/hooks';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.whyChooseUs'), href: '/why-choose-us' },
    { name: t('nav.results'), href: '/gallery' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-sm border-b border-gray-200 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center pl-0 pr-4 py-3 lg:pr-6 xl:pr-8 min-h-[64px] transition-all duration-300">
        {/* Logo - Left aligned */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/Vola_edited.jpg" 
              alt="Vola Health Logo" 
              width={40}
              height={40}
              className="rounded-lg flex-shrink-0"
            />
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
              Vola Health
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden xl:flex flex-1 justify-center">
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 whitespace-nowrap px-2 py-1 rounded-md hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section - Right aligned */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Desktop CTA Buttons */}
          <div className="hidden xl:flex items-center space-x-3">
            <a
              href="tel:+905444749881"
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap"
            >
              <PhoneIcon className="w-4 h-4 flex-shrink-0" />
              <span>{t('common.callNow') || 'Call Now'}</span>
            </a>
            <Link
              href="/consultation"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap"
            >
              {t('nav.consultation') || 'Free Consultation'}
            </Link>
          </div>

          {/* Utility Icons */}
          <div className="hidden xl:flex items-center space-x-2 pl-3 border-l border-gray-200">
            <SearchBar />
            <NotificationBell />
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <span className="text-lg font-bold text-gray-900">{t('nav.menu') || 'Menu'}</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-base font-medium text-gray-900 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <a
                  href="tel:+905444749881"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span>{t('common.callNow') || 'Call Now'}</span>
                </a>
                <Link
                  href="/consultation"
                  className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.consultation') || 'Free Consultation'}
                </Link>
              </div>
              
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <SearchBar />
                <div className="flex items-center justify-between">
                  <NotificationBell />
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
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { languages, type Language } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  className?: string;
}

export default function LanguageSwitcher({ currentLanguage, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setIsOpen(false);
    
    // Get current path without language prefix
    const pathSegments = pathname.split('/');
    const currentLangInPath = pathSegments[1];
    
    // Check if current path has language prefix
    const hasLanguagePrefix = languages.some(lang => lang.code === currentLangInPath);
    
    let newPath;
    if (hasLanguagePrefix) {
      // Replace existing language with new one
      pathSegments[1] = newLanguage;
      newPath = pathSegments.join('/');
    } else {
      // Add language prefix to current path
      newPath = `/${newLanguage}${pathname}`;
    }
    
    router.push(newPath);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        aria-label="Select language"
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            Select Language
          </div>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-blue-50 transition-colors duration-200 ${
                currentLanguage === language.code 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1 text-left">{language.name}</span>
              {currentLanguage === language.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 
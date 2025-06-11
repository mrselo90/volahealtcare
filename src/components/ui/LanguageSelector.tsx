'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { languages } from '@/lib/i18n/config';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === currentLanguage);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg" aria-hidden="true">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.name}</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 ${
                  language.code === currentLanguage ? 'bg-gray-50 text-primary' : 'text-gray-700'
                }`}
                onClick={() => {
                  setLanguage(language.code);
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <span className="text-lg" aria-hidden="true">{language.flag}</span>
                <span>{language.name}</span>
                {language.code === currentLanguage && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
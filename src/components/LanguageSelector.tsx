'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';
import { languages, Language } from '@/lib/i18n/config';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useTranslation();

  const selectedLang = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-1">{selectedLang.flag}</span>
        {selectedLang.name}
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  lang.code === language ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                }`}
                onClick={() => handleLanguageChange(lang.code as Language)}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
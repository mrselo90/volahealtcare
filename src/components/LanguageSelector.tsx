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
    <div className="relative flex-shrink-0">
      <button
        type="button"
        className="inline-flex items-center gap-x-0.5 text-xs leading-5 text-gray-900 hover:text-blue-600 transition-colors duration-200 px-1.5 py-1 rounded-md hover:bg-gray-100 min-w-0 max-w-[80px] xl:max-w-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm flex-shrink-0">{selectedLang.flag}</span>
        <span className="hidden md:inline lg:hidden font-medium uppercase text-xs truncate">
          {selectedLang.code}
        </span>
        <span className="hidden lg:inline xl:hidden font-medium text-xs truncate max-w-[60px]">
          {selectedLang.name.length > 7 ? selectedLang.code.toUpperCase() : selectedLang.name}
        </span>
        <span className="hidden xl:inline font-medium text-xs truncate max-w-[80px]">
          {selectedLang.name}
        </span>
        <ChevronDownIcon className="h-3 w-3 ml-0.5 flex-shrink-0" aria-hidden="true" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[105]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-44 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 max-h-64 overflow-y-auto z-[110]">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors duration-200 ${
                    lang.code === language ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => handleLanguageChange(lang.code as Language)}
                >
                  <span className="text-sm mr-2 flex-shrink-0">{lang.flag}</span>
                  <span className="font-medium truncate">{lang.name}</span>
                  {lang.code === language && (
                    <span className="ml-auto text-blue-600 flex-shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 
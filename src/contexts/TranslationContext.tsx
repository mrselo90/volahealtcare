'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages, defaultLanguage, type Language } from '@/lib/i18n/config';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
  isLoading: boolean;
}

interface TranslationProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
  isLoading: true,
});

export function TranslationProvider({ children, initialLanguage = defaultLanguage }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Load translations for current language
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/translations/${currentLanguage}`);
        if (!response.ok) throw new Error('Failed to load translations');
        const data = await response.json();
        setTranslations(data);
        
        // Set direction based on language
        const langConfig = languages.find(l => l.code === currentLanguage);
        setDir(langConfig?.dir || 'ltr');
        
        // Store language preference
        localStorage.setItem('preferredLanguage', currentLanguage);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    if (languages.some(l => l.code === lang)) {
      setCurrentLanguage(lang);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key] || key;
    
    // Replace parameters in translation if they exist
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), value);
      });
    }
    
    return translation;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t, dir, isLoading }}>
      <div dir={dir} lang={currentLanguage}>
        {children}
      </div>
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, defaultLanguage } from './config';
import { getTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isClient: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || defaultLanguage);
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration protection
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && savedLanguage !== language) {
      setLanguageState(savedLanguage);
    }
  }, [language, isClient]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isClient) {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  const contextValue = {
    language,
    setLanguage,
    t,
    isClient
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return { 
    language: context.language, 
    setLanguage: context.setLanguage,
    isClient: context.isClient
  };
} 
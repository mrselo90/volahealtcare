'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { defaultLanguage, type Language } from '@/lib/i18n/config';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage;

  // Check stored preference
  const stored = localStorage.getItem('preferredLanguage') as Language;
  if (stored) return stored;

  // Check browser language
  const browserLang = navigator.language.split('-')[0] as Language;
  if (browserLang) return browserLang;

  // Fallback to default
  return defaultLanguage;
}

export function TranslationLoader({ children }: { children: React.ReactNode }) {
  const { setLanguage, isLoading } = useTranslation();

  useEffect(() => {
    const initialLang = getInitialLanguage();
    setLanguage(initialLang);
  }, [setLanguage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
} 
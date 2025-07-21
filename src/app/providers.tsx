'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Settings context and provider
export interface Settings {
  siteName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: Record<string, string>;
}

const SettingsContext = createContext<Settings | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  if (!settings) return null; // Optionally: loading spinner
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </SettingsProvider>
    </SessionProvider>
  );
} 
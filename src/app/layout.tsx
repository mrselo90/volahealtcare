import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Chatbot from '@/components/ui/Chatbot';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { TranslationProvider } from '@/contexts/TranslationContext';
import CookieConsent from '@/components/ui/CookieConsent';
import { Providers } from './providers';
import { TranslationLoader } from '@/components/TranslationLoader';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: 'Aesthetic Care Istanbul - Premium Medical Tourism',
  description: 'Experience world-class aesthetic procedures in Istanbul. 31 services including dental aesthetics, facial procedures, and body contouring. Expert surgeons, affordable prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow pt-24">
            <TranslationProvider>
              <TranslationLoader>
                {children}
              </TranslationLoader>
            </TranslationProvider>
          </main>
          <Footer />
          <Chatbot />
          <WhatsAppButton phoneNumber="905551234567" />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
} 
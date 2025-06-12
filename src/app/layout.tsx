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
import PerformanceMonitor from '@/components/PerformanceMonitor';

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
  keywords: 'medical tourism, aesthetic surgery, dental tourism, Istanbul, Turkey, cosmetic procedures, plastic surgery, dental veneers, rhinoplasty, hair transplant',
  authors: [{ name: 'Aesthetic Care Istanbul' }],
  creator: 'Aesthetic Care Istanbul',
  publisher: 'Aesthetic Care Istanbul',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aestheticcare-istanbul.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'tr-TR': '/tr',
    },
  },
  openGraph: {
    title: 'Aesthetic Care Istanbul - Premium Medical Tourism',
    description: 'Experience world-class aesthetic procedures in Istanbul. Expert surgeons, modern facilities, affordable prices.',
    url: 'https://aestheticcare-istanbul.com',
    siteName: 'Aesthetic Care Istanbul',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aesthetic Care Istanbul - Medical Tourism',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aesthetic Care Istanbul - Premium Medical Tourism',
    description: 'Experience world-class aesthetic procedures in Istanbul. Expert surgeons, modern facilities, affordable prices.',
    images: ['/images/twitter-image.jpg'],
    creator: '@aestheticcare_ist',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
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
          <PerformanceMonitor />
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
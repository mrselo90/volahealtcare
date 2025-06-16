import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Chatbot from '@/components/ui/Chatbot';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { LanguageProvider } from '@/lib/i18n/hooks';
import CookieConsent from '@/components/ui/CookieConsent';
import { Providers } from './providers';
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
  title: 'Vola Health Istanbul - Premium Medical Tourism',
  description: 'Experience world-class medical treatments in Istanbul, Turkey. Premium medical tourism services offering dental, aesthetic, and cosmetic procedures with exceptional care.',
  keywords: 'medical tourism, aesthetic surgery, dental tourism, Istanbul, Turkey, cosmetic procedures, plastic surgery, dental veneers, rhinoplasty, hair transplant, Vola Health',
  authors: [{ name: 'Vola Health Istanbul' }],
  creator: 'Vola Health Istanbul',
  publisher: 'Vola Health Istanbul',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://volahealthistanbul.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vola Health Istanbul - Premium Medical Tourism',
    description: 'Experience world-class medical treatments in Istanbul, Turkey. Premium medical tourism services offering dental, aesthetic, and cosmetic procedures.',
    url: 'https://volahealthistanbul.com',
    siteName: 'Vola Health Istanbul',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vola Health Istanbul - Medical Tourism',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vola Health Istanbul - Premium Medical Tourism',
    description: 'Experience world-class medical treatments in Istanbul, Turkey.',
    images: ['/images/twitter-image.jpg'],
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
          <LanguageProvider>
            <PerformanceMonitor />
            <Header />
            <main className="flex-grow pt-20 sm:pt-24">
              {children}
            </main>
            <Footer />
            <Chatbot />
            <WhatsAppButton phoneNumber="905444749881" />
            <CookieConsent />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
} 
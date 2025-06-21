import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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
    languages: {
      'en': '/en',
      'tr': '/tr',
      'es': '/es',
      'de': '/de',
      'fr': '/fr',
      'it': '/it',
      'pt': '/pt',
      'ru': '/ru',
      'ro': '/ro',
      'pl': '/pl',
      'ar': '/ar'
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
    <html suppressHydrationWarning>
      <body 
        className={`${montserrat.variable} ${playfairDisplay.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 
import { languages } from '../i18n/config';

interface MetadataProps {
  title: string;
  description: string;
  path: string;
  language: string;
}

export function generateMetadata({
  title,
  description,
  path,
  language,
}: MetadataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: Object.fromEntries(
        languages.map((lang) => [
          lang.code,
          `${baseUrl}/${lang.code}${path}`,
        ])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: 'Vola Health Istanbul',
      locale: language,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateStructuredData(type: string, data: any) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(baseStructure);
}

export const siteConfig = {
  name: 'Vola Health Istanbul',
  description: 'Premium medical tourism services in Istanbul, Turkey. World-class dental, aesthetic, and cosmetic procedures with exceptional care.',
  url: 'https://volahealthistanbul.com',
  ogImage: 'https://volahealthistanbul.com/images/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/volahealth',
    github: 'https://github.com/volahealth',
    instagram: 'https://www.instagram.com/volahealth/',
    facebook: 'https://www.facebook.com/VolaHealth/',
  },
};

export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'medical tourism',
    'Istanbul',
    'Turkey',
    'dental tourism',
    'aesthetic surgery',
    'cosmetic procedures',
    'plastic surgery',
    'dental veneers',
    'rhinoplasty',
    'hair transplant',
    'Vola Health',
  ],
  authors: [
    {
      name: 'Vola Health Istanbul',
      url: 'https://volahealthistanbul.com',
    },
  ],
  creator: 'Vola Health Istanbul',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: 'Vola Health Istanbul',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@volahealth',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}; 
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
      siteName: 'Medical Tourism',
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
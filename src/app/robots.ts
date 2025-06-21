import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://volahealthistanbul.com'
  
  return {
    rules: [
      // Allow all bots to crawl the site
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/uploads/',
          '/_next/',
          '/private/'
        ],
      },
      // Special rules for search engines
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/uploads/',
          '/_next/',
          '/private/'
        ],
        crawlDelay: 1,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
} 
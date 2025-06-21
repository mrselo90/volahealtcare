import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { languages } from '@/lib/i18n/config'

const baseUrl = 'https://volahealthistanbul.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all categories and services from database
  const [categories, services] = await Promise.all([
    prisma.category.findMany({
      select: { slug: true, updatedAt: true }
    }),
    prisma.service.findMany({
      select: { 
        slug: true, 
        categoryId: true, 
        updatedAt: true,
        category: {
          select: { slug: true }
        }
      }
    })
  ])

  const sitemap: MetadataRoute.Sitemap = []

  // Static pages for each language
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/gallery',
    '/services',
    '/testimonials',
    '/why-choose-us',
    '/results/aesthetic',
    '/results/dental', 
    '/results/hair',
    '/consultation',
    '/privacy',
    '/terms'
  ]

  // Add static pages for each language
  languages.forEach(language => {
    staticPages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}/${language.code}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            languages.map(lang => [
              lang.code,
              `${baseUrl}/${lang.code}${page}`
            ])
          )
        }
      })
    })
  })

  // Add category pages for each language
  categories.forEach(category => {
    languages.forEach(language => {
      sitemap.push({
        url: `${baseUrl}/${language.code}/services/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            languages.map(lang => [
              lang.code,
              `${baseUrl}/${lang.code}/services/${category.slug}`
            ])
          )
        }
      })
    })
  })

  // Add service pages for each language
  services.forEach(service => {
    if (service.category) {
      languages.forEach(language => {
        sitemap.push({
          url: `${baseUrl}/${language.code}/services/${service.category.slug}/${service.slug}`,
          lastModified: service.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              languages.map(lang => [
                lang.code,
                `${baseUrl}/${lang.code}/services/${service.category.slug}/${service.slug}`
              ])
            )
          }
        })
      })
    }
  })

  return sitemap
} 
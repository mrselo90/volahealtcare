'use client'

import { useEffect } from 'react'

interface OrganizationSchemaProps {
  name: string
  description: string
  url: string
  telephone: string
  address: {
    streetAddress: string
    addressLocality: string
    addressCountry: string
    postalCode: string
  }
  geo: {
    latitude: number
    longitude: number
  }
  openingHours: string[]
}

interface ServiceSchemaProps {
  name: string
  description: string
  provider: string
  areaServed: string
  serviceType: string
  url: string
}

interface ReviewSchemaProps {
  itemReviewed: string
  author: string
  reviewRating: number
  reviewBody: string
  datePublished: string
}

export function OrganizationSchema(props: OrganizationSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: props.name,
      description: props.description,
      url: props.url,
      telephone: props.telephone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: props.address.streetAddress,
        addressLocality: props.address.addressLocality,
        addressCountry: props.address.addressCountry,
        postalCode: props.address.postalCode
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: props.geo.latitude,
        longitude: props.geo.longitude
      },
      openingHours: props.openingHours,
      medicalSpecialty: [
        'Dentistry',
        'Plastic Surgery', 
        'Hair Restoration',
        'Cosmetic Surgery'
      ],
      priceRange: '$$-$$$',
      currenciesAccepted: ['USD', 'EUR', 'GBP', 'TRY'],
      paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer']
    })
    
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [props])

  return null
}

export function ServiceSchema(props: ServiceSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MedicalProcedure',
      name: props.name,
      description: props.description,
      provider: {
        '@type': 'MedicalOrganization',
        name: props.provider
      },
      areaServed: props.areaServed,
      serviceType: props.serviceType,
      url: props.url,
      medicalSpecialty: props.serviceType,
      procedureType: 'Therapeutic'
    })
    
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [props])

  return null
}

export function ReviewSchema(props: ReviewSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'MedicalOrganization',
        name: props.itemReviewed
      },
      author: {
        '@type': 'Person',
        name: props.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: props.reviewRating,
        bestRating: 5
      },
      reviewBody: props.reviewBody,
      datePublished: props.datePublished
    })
    
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [props])

  return null
}

export function WebsiteSchema() {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vola Health Istanbul',
      url: 'https://volahealthistanbul.com',
      description: 'Premium medical tourism services in Istanbul, Turkey',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://volahealthistanbul.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@type': 'MedicalOrganization',
        name: 'Vola Health Istanbul'
      }
    })
    
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
} 
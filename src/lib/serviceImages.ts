export interface ServiceImage {
  id: string;
  url: string;
  alt: string | null;
  type: 'gallery' | 'before-after' | 'featured';
}

// Server-side function to fetch service images from the database
export async function getServiceImages(serviceSlug: string): Promise<ServiceImage[]> {
  try {
    if (typeof window === 'undefined') {
      // Server-side: Fetch from database
      const { prisma } = await import('./prisma');
      const service = await prisma.service.findUnique({
        where: { slug: serviceSlug },
        include: { 
          images: true,
          beforeAfterImages: true
        }
      });
      
      if (!service) return [];
      
      // Map regular images
      const regularImages = service.images.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        type: (img as any).type || 'gallery' as const // Fallback to 'gallery' if type is missing
      }));
      
      // Map before/after images - create two entries for each before/after pair
      const beforeAfterImages = service.beforeAfterImages.flatMap(img => [
        {
          id: `${img.id}-before`,
          url: img.beforeImage,
          alt: `Before ${serviceSlug}`,
          type: 'before-after' as const
        },
        {
          id: `${img.id}-after`,
          url: img.afterImage,
          alt: `After ${serviceSlug}`,
          type: 'before-after' as const
        }
      ]);
      
      return [...regularImages, ...beforeAfterImages];
    } else {
      // Client-side: Fetch from API
      const response = await fetch(`/api/services/${serviceSlug}/images`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((img: any) => ({
        ...img,
        type: img.type || 'gallery' // Fallback to 'gallery' if type is missing
      }));
    }
  } catch (error) {
    console.error('Error fetching service images:', error);
    return [];
  }
}

// Client-side hook to get service images
import { useState, useEffect } from 'react';

export function useServiceImages(serviceSlug: string) {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/services/${serviceSlug}/images`);
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load images'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [serviceSlug]);

  const getImagesByType = (type: 'gallery' | 'before-after' | 'featured') => {
    return images.filter(img => img.type === type);
  };

  return {
    images,
    featuredImage: images.find(img => img.type === 'featured'),
    galleryImages: getImagesByType('gallery'),
    beforeAfterImages: getImagesByType('before-after'),
    isLoading,
    error,
    refetch: () => {
      // Re-fetch images
      const fetchImages = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/services/${serviceSlug}/images`);
          if (!response.ok) throw new Error('Failed to fetch images');
          const data = await response.json();
          setImages(data);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load images'));
        } finally {
          setIsLoading(false);
        }
      };
      return fetchImages();
    }
  };
}

// Helper to get featured image only
export async function getFeaturedImage(serviceSlug: string): Promise<string | null> {
  const images = await getServiceImages(serviceSlug);
  const featured = images.find(img => img.type === 'featured');
  return featured?.url || null;
}

// Helper to get gallery images
export async function getGalleryImages(serviceSlug: string): Promise<ServiceImage[]> {
  const images = await getServiceImages(serviceSlug);
  return images.filter(img => img.type === 'gallery');
}

// Helper to get before/after images
export async function getBeforeAfterImages(serviceSlug: string): Promise<ServiceImage[]> {
  const images = await getServiceImages(serviceSlug);
  return images.filter(img => img.type === 'before-after');
}

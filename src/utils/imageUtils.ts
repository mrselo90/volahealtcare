import { Image } from '@prisma/client';

export interface ServiceWithImages {
  images?: Image[];
}

/**
 * Validate if a URL is a proper image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    // Check if it's a relative path
    return url.startsWith('/');
  }
};

/**
 * Get fallback image URL
 */
export const getFallbackImageUrl = (): string => '/images/placeholder.svg';

/**
 * Fix or replace invalid image URLs
 */
export const fixImageUrl = (url: string): string => {
  if (!url) return getFallbackImageUrl();
  
  // Validate the URL
  if (!isValidImageUrl(url)) {
    console.warn('Invalid image URL detected, using fallback:', url);
    return getFallbackImageUrl();
  }
  
  return url;
};

/**
 * Safely get first image from service with null checks
 */
export const getServiceImage = (service: ServiceWithImages, index: number = 0): Image | null => {
  if (!service?.images || !Array.isArray(service.images) || service.images.length === 0) {
    return null;
  }
  
  if (index < 0 || index >= service.images.length) {
    return null;
  }
  
  return service.images[index];
};

/**
 * Get service image URL with fallback
 */
export const getServiceImageUrl = (service: ServiceWithImages, index: number = 0): string => {
  const image = getServiceImage(service, index);
  if (!image?.url) return getFallbackImageUrl();
  
  return fixImageUrl(image.url);
};

/**
 * Get service image alt text with fallback
 */
export const getServiceImageAlt = (service: ServiceWithImages, fallbackTitle: string = '', index: number = 0): string => {
  const image = getServiceImage(service, index);
  return image?.alt || fallbackTitle || 'Service image';
};

/**
 * Validate image data before saving
 */
export const validateImageData = (imageData: {
  url?: string;
  alt?: string;
  type?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!imageData.url || imageData.url.trim() === '') {
    errors.push('Image URL is required');
  } else if (!isValidImageUrl(imageData.url)) {
    errors.push('Invalid image URL format');
  }
  
  if (imageData.type && !['gallery', 'before-after', 'featured'].includes(imageData.type)) {
    errors.push('Invalid image type. Must be gallery, before-after, or featured');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Process multiple images with validation and fixing
 */
export const processImages = (images: Array<{ url: string; alt?: string; type?: string }>): Array<{ url: string; alt: string; type: string }> => {
  return images
    .filter(img => img.url && img.url.trim()) // Remove empty URLs
    .map(img => ({
      url: fixImageUrl(img.url),
      alt: img.alt || '',
      type: img.type || 'gallery'
    }));
};

/**
 * Check if service has valid images
 */
export const hasValidImages = (service: ServiceWithImages): boolean => {
  return !!(service?.images && service.images.length > 0 && service.images.some(img => isValidImageUrl(img.url)));
}; 
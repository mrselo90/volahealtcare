'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholders';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallbackType?: 'before' | 'after';
  fallbackIndex?: number;
  onError?: () => void;
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
  fallbackType = 'before',
  fallbackIndex = 1,
  onError
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Update currentSrc when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false); // Reset error state when src changes
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallbackSrc = getPlaceholderImage(fallbackType, fallbackIndex);
      setCurrentSrc(fallbackSrc);
      onError?.();
    }
  };

  // If no source, show fallback
  if (!currentSrc) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm">No image available</p>
        </div>
      </div>
    );
  }

  // If it's a data URL, render it directly with <img>
  if (currentSrc.startsWith('data:')) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg ${className}`}
        onError={handleError}
      />
    );
  }

  // For real URLs, use Next.js Image component
  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        className={`object-cover rounded-lg ${className}`}
        priority={priority}
        onError={handleError}
      />
    );
  }

  // For non-fill images, use fixed dimensions
  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={600}
      height={600}
      className={`w-full h-full object-cover rounded-lg ${className}`}
      priority={priority}
      onError={handleError}
    />
  );
} 
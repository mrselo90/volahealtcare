'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from '@heroicons/react/24/outline';

interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageLightboxProps {
  images: ImageData[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function ImageLightbox({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (hasMultipleImages && onPrevious) {
          event.preventDefault();
          onPrevious();
        }
        break;
      case 'ArrowRight':
        if (hasMultipleImages && onNext) {
          event.preventDefault();
          onNext();
        }
        break;
      case '+':
      case '=':
        event.preventDefault();
        setIsZoomed(true);
        break;
      case '-':
        event.preventDefault();
        setIsZoomed(false);
        break;
    }
  }, [isOpen, hasMultipleImages, onClose, onNext, onPrevious]);

  // Setup keyboard listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Reset zoom when image changes
  useEffect(() => {
    setIsZoomed(false);
    setImageLoaded(false);
  }, [currentIndex]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        aria-describedby="lightbox-description"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Content Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            aria-label="Close lightbox"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {hasMultipleImages && (
            <>
              <button
                onClick={onPrevious}
                disabled={!onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={onNext}
                disabled={!onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? (
                <MagnifyingGlassMinusIcon className="w-5 h-5" />
              ) : (
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Main Image Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative max-w-[90vw] max-h-[90vh] ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* Loading Spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Main Image */}
            <motion.div
              animate={{ 
                scale: isZoomed ? 1.5 : 1,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              className="relative"
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={800}
                height={600}
                className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                priority
                quality={95}
              />
            </motion.div>
          </motion.div>

          {/* Image Info */}
          {(currentImage.title || currentImage.description) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute bottom-4 right-4 max-w-sm p-4 rounded-lg bg-black/50 text-white backdrop-blur-sm"
            >
              {currentImage.title && (
                <h3 id="lightbox-title" className="font-semibold text-lg mb-1">
                  {currentImage.title}
                </h3>
              )}
              {currentImage.description && (
                <p id="lightbox-description" className="text-sm text-gray-200">
                  {currentImage.description}
                </p>
              )}
            </motion.div>
          )}

          {/* Keyboard Shortcuts Info */}
          <div className="absolute bottom-4 left-4 text-xs text-white/70 space-y-1">
            <div>ESC: Close</div>
            {hasMultipleImages && (
              <>
                <div>← →: Navigate</div>
              </>
            )}
            <div>Click: Zoom</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 
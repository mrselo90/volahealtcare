'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, PanInfo } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ImageLightbox from './ImageLightbox';
import { useTranslation } from '@/lib/i18n/hooks';

interface BeforeAfterCase {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
  patientAge?: number;
  patientGender?: string;
  timeframe?: string;
}

interface CategoryBeforeAfterSectionProps {
  title: string;
  categoryId: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function CategoryBeforeAfterSection({
  title,
  categoryId,
  description,
  gradientFrom,
  gradientTo,
}: CategoryBeforeAfterSectionProps) {
  const { t } = useTranslation();
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // New state for drag/scroll functionality
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchCases();
  }, [categoryId]);

  const fetchCases = async () => {
    try {
      const response = await fetch(`/api/before-after?category=${categoryId}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  // New scroll utility functions
  const updateScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      // Mobile: scroll 1 card, Desktop: scroll 2 cards
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 312 : 392; // Mobile: 288px + 24px gap, Desktop: 368px + 24px gap
      const scrollAmount = isMobile ? cardWidth : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      // Mobile: scroll 1 card, Desktop: scroll 2 cards
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 312 : 392; // Mobile: 288px + 24px gap, Desktop: 368px + 24px gap
      const scrollAmount = isMobile ? cardWidth : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle drag end for navigation
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Prevent click events when dragging
    if (Math.abs(info.offset.x) > 10) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0) {
        scrollToLeft();
      } else {
        scrollToRight();
      }
    }
  };

  // Update scroll buttons on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => updateScrollButtons();
      container.addEventListener('scroll', handleScroll);
      updateScrollButtons(); // Initial check
      
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [updateScrollButtons]);

  // Mock data for demonstration if API doesn't return data
  const mockCases = [
    {
      id: '1',
      title: 'Patient Transformation 1',
      beforeImage: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Before',
      afterImage: 'https://via.placeholder.com/400x400/dcfce7/16a34a?text=After',
      description: 'Amazing transformation results',
      patientAge: 28,
      patientGender: 'Female',
      timeframe: '3 months'
    },
    {
      id: '2',
      title: 'Patient Transformation 2',
      beforeImage: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Before',
      afterImage: 'https://via.placeholder.com/400x400/dbeafe/2563eb?text=After',
      description: 'Excellent results achieved',
      patientAge: 35,
      patientGender: 'Male',
      timeframe: '6 months'
    },
    {
      id: '3',
      title: 'Patient Transformation 3',
      beforeImage: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Before',
      afterImage: 'https://via.placeholder.com/400x400/fce7f3/be185d?text=After',
      description: 'Professional procedure completed',
      patientAge: 42,
      patientGender: 'Female',
      timeframe: '4 months'
    },
    {
      id: '4',
      title: 'Patient Transformation 4',
      beforeImage: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Before',
      afterImage: 'https://via.placeholder.com/400x400/f3e8ff/7c3aed?text=After',
      description: 'Outstanding transformation',
      patientAge: 31,
      patientGender: 'Female',
      timeframe: '5 months'
    },
    {
      id: '5',
      title: 'Patient Transformation 5',
      beforeImage: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Before',
      afterImage: 'https://via.placeholder.com/400x400/ecfdf5/059669?text=After',
      description: 'Natural-looking results',
      patientAge: 29,
      patientGender: 'Male',
      timeframe: '2 months'
    },
    {
      id: '6',
      title: 'Patient Transformation 6',
      beforeImage: 'https://via.placeholder.com/400x400/e5e7eb/6b7280?text=Before',
      afterImage: 'https://via.placeholder.com/400x400/fef3c7/d97706?text=After',
      description: 'Perfect aesthetic results',
      patientAge: 38,
      patientGender: 'Female',
      timeframe: '4 months'
    },
  ];

  const displayCases = cases.length > 0 ? cases : mockCases;

  // Prepare images for lightbox
  const lightboxImages = displayCases.map((caseItem, index) => ({
    id: caseItem.id,
    src: caseItem.afterImage || '/images/placeholder.svg',
    alt: `Case image - ${caseItem.title}`,
    title: caseItem.title,
    description: caseItem.description || `${caseItem.patientAge ? `Age: ${caseItem.patientAge}` : ''} ${caseItem.timeframe ? `• ${caseItem.timeframe}` : ''}`.trim(),
  }));

  // Lightbox handlers
  const openLightbox = (index: number) => {
    if (!isDragging) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const getRouteFromCategoryId = (categoryId: string) => {
    // Map category IDs to the correct existing routes
    const routeMap: Record<string, string> = {
      'cmc2g9jq400017kw78mx3v07k': 'dental',     // Dental category ID
      'cmc2g9jq500027kw73m9vh455': 'hair',      // Hair category ID  
      'cmc2g9jq200007kw7t4b2pi3d': 'aesthetic', // Aesthetic category ID
    };
    
    return routeMap[categoryId] || 'dental'; // Default to dental if not found
  };

  // Get the correct route for this category
  const resultRoute = getRouteFromCategoryId(categoryId);

  return (
    <section className="relative py-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-block bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white px-8 py-3 rounded-full text-lg text-professional-bold mb-6`}
        >
          {title}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <Link
            href={`/results/${resultRoute}`}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white px-6 py-3 rounded-xl text-professional-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
          >
            {t('results.cta.viewAllResults')}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Horizontal Scrollable Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Buttons - Positioned above gallery */}
        <div className="hidden md:flex justify-end mb-4">
          <div className="flex gap-2 gallery-indicators">
            <button
              onClick={scrollToLeft}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border-2 transition-all duration-200 touch-target ${
                canScrollLeft 
                  ? 'border-white/50 text-white hover:bg-white/10 hover:border-white/70' 
                  : 'border-gray-500 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={scrollToRight}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border-2 transition-all duration-200 touch-target ${
                canScrollRight 
                  ? 'border-white/50 text-white hover:bg-white/10 hover:border-white/70' 
                  : 'border-gray-500 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          {loading ? (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                             {Array.from({ length: 8 }).map((_, index) => (
                 <div key={index} className="flex-shrink-0 w-72 md:w-80 lg:w-[23rem] bg-white/10 rounded-xl overflow-hidden animate-pulse">
                   <div className="aspect-square bg-gray-600"></div>
                 </div>
               ))}
            </div>
          ) : (
            <motion.div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide swipeable-gallery drag-cursor"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              dragElastic={0.1}
            >
              {displayCases.map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                                     className="flex-shrink-0 w-72 md:w-80 lg:w-[23rem] bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer gallery-card border border-white/10"
                  onClick={() => openLightbox(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  drag={false} // Prevent individual card drag
                >
                  <div className="relative aspect-square">
                                         <img
                       src={caseItem.afterImage || '/images/placeholder.svg'}
                       alt="Case image"
                       className="w-full h-full object-contain bg-gray-100"
                       onError={(e) => {
                         console.error('Grid image failed to load:', caseItem.afterImage);
                         const target = e.currentTarget as HTMLImageElement;
                         target.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=No+Image';
                       }}
                     />
                    
                                         {/* Enhanced overlay gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Case details overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {caseItem.title && (
                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 drop-shadow-lg">
                          {caseItem.title}
                        </h3>
                      )}

                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="text-white text-center">
                        <div className="text-2xl mb-2">👁️</div>
                        <div className="text-sm font-medium">View Details</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Gradient Fade Edges */}
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-gray-800 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-gray-800 to-transparent pointer-events-none z-10" />
        </div>

        {/* Mobile Swipe Hint */}
        <div className="text-center mt-4 md:hidden">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2 swipe-hint">
            <span>👆 Swipe to see more results</span>
          </p>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </section>
  );
} 
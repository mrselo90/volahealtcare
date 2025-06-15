'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Mock data for demonstration if API doesn't return data
  const mockCases = [
    {
      id: '1',
      title: `${t('mockData.patient')} 1`,
      beforeImage: '/images/placeholder-before.jpg',
      afterImage: '/images/placeholder-result.jpg',
      description: t('mockData.transformation'),
      patientAge: 28,
      patientGender: t('mockData.female'),
      timeframe: `3 ${t('mockData.months')}`
    },
    {
      id: '2',
      title: `${t('mockData.patient')} 2`,
      beforeImage: '/images/placeholder-before.jpg',
      afterImage: '/images/placeholder-result.jpg',
      description: t('mockData.results'),
      patientAge: 35,
      patientGender: t('mockData.male'),
      timeframe: `6 ${t('mockData.months')}`
    },
    {
      id: '3',
      title: `${t('mockData.patient')} 3`,
      beforeImage: '/images/placeholder-before.jpg',
      afterImage: '/images/placeholder-result.jpg',
      description: t('mockData.procedure'),
      patientAge: 42,
      patientGender: t('mockData.female'),
      timeframe: `4 ${t('mockData.months')}`
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
    setCurrentImageIndex(index);
    setLightboxOpen(true);
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
      'cmbxi8jym00006qsy4b8dagzk': 'dental',     // Dental category ID
      'cmbxiawkb0000uxvzc1in2i7v': 'hair',      // Hair category ID  
      'cmbxi8jzv001j6qsyv769abfx': 'aesthetic', // Aesthetic category ID
    };
    
    return routeMap[categoryId] || 'dental'; // Default to dental if not found
  };

  // Get the correct route for this category
  const resultRoute = getRouteFromCategoryId(categoryId);

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-block bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white px-8 py-3 rounded-full text-lg font-semibold mb-6`}
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
        >
          <Link
            href={`/results/${resultRoute}`}
            className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
          >
            {t('results.cta.viewAllResults')}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative px-4">
        {/* Scroll Buttons */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-white/30 flex items-center justify-center transition-all duration-300 ${
            canScrollLeft 
              ? 'hover:bg-white hover:shadow-2xl text-gray-800 hover:scale-105' 
              : 'opacity-30 cursor-not-allowed text-gray-500'
          }`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-white/30 flex items-center justify-center transition-all duration-300 ${
            canScrollRight 
              ? 'hover:bg-white hover:shadow-2xl text-gray-800 hover:scale-105' 
              : 'opacity-30 cursor-not-allowed text-gray-500'
          }`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            displayCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-80"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Case Image */}
                  <div 
                    className="relative h-48 bg-gray-100 cursor-pointer group"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={caseItem.afterImage || '/images/placeholder.svg'}
                      alt="Case image"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {caseItem.title}
                    </h3>
                    
                    {caseItem.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {caseItem.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {caseItem.patientAge && (
                        <span>{caseItem.patientAge} {t('results.beforeAfter.age')}</span>
                      )}
                      {caseItem.timeframe && (
                        <span>{caseItem.timeframe}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>



      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

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
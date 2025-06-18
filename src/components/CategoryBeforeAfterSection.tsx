'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
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

      {/* Grid Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square">
                  <img
                    src={caseItem.afterImage || '/images/placeholder.svg'}
                    alt="Case image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Grid image failed to load:', caseItem.afterImage);
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=No+Image';
                    }}
                  />
                  
                  {/* Minimal hover effect */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
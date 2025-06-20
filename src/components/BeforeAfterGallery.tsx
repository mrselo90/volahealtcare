'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { getPlaceholderImage } from '@/lib/placeholders';
import SafeImage from './SafeImage';
import { useTranslation } from '@/lib/i18n/hooks';

interface BeforeAfterCase {
  id: string;
  title: string;
  patientAge?: number;
  patientGender?: string;
  patientCountry?: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
  treatmentDetails?: string;
  results?: string;
  timeframe?: string;
  categoryId?: string;
  serviceId?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  tags?: string[];
  beforeImageAlt?: string;
  afterImageAlt?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface BeforeAfterGalleryProps {
  categoryFilter?: string;
  serviceFilter?: string;
  featuredOnly?: boolean;
  limit?: number;
  showFilters?: boolean;
  gridCols?: 2 | 3 | 4;
  className?: string;
}

export default function BeforeAfterGallery({
  categoryFilter,
  serviceFilter,
  featuredOnly = false,
  limit,
  showFilters = true,
  gridCols = 3,
  className = '',
}: BeforeAfterGalleryProps) {
  const { t } = useTranslation();
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<BeforeAfterCase | null>(null);
  const [showBeforeImage, setShowBeforeImage] = useState(true);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [retryCount, setRetryCount] = useState(0);
  
  // New state for drag/scroll functionality
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Memoize expensive operations
  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      if (selectedCategory !== 'all' && caseItem.categoryId !== selectedCategory) return false;
      if (selectedService !== 'all' && caseItem.serviceId !== selectedService) return false;
      return true;
    });
  }, [cases, selectedCategory, selectedService]);

  // Debounced fetch to prevent excessive API calls
  const fetchCases = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (serviceFilter) params.append('service', serviceFilter);
      if (featuredOnly) params.append('featured', 'true');
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/before-after?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cases: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setCases(data);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error fetching cases:', error);
      setError(error instanceof Error ? error.message : 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, serviceFilter, featuredOnly, limit]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setLoading(true);
      fetchCases();
    }
  }, [retryCount, fetchCases]);

  useEffect(() => {
    fetchCases();
    if (showFilters) {
      fetchCategories();
    }
  }, [categoryFilter, serviceFilter, featuredOnly, limit]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.map((cat: any) => {
          let categoryName = cat.name;
          
          // Handle different name formats
          if (typeof cat.name === 'string') {
            try {
              // Try to parse as JSON first
              const parsed = JSON.parse(cat.name);
              categoryName = parsed.en || parsed.tr || cat.name;
            } catch (e) {
              // If parsing fails, use the string as is
              categoryName = cat.name;
            }
          }
          
          return {
            id: cat.id,
            name: categoryName
          };
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openModal = (caseItem: BeforeAfterCase) => {
    setSelectedCase(caseItem);
    setShowBeforeImage(true);
  };

  const closeModal = () => {
    setSelectedCase(null);
  };

  const nextCase = () => {
    if (!selectedCase) return;
    const currentIndex = filteredCases.findIndex(c => c.id === selectedCase.id);
    const nextIndex = (currentIndex + 1) % filteredCases.length;
    setSelectedCase(filteredCases[nextIndex]);
    setShowBeforeImage(true);
  };

  const prevCase = () => {
    if (!selectedCase) return;
    const currentIndex = filteredCases.findIndex(c => c.id === selectedCase.id);
    const prevIndex = currentIndex === 0 ? filteredCases.length - 1 : currentIndex - 1;
    setSelectedCase(filteredCases[prevIndex]);
    setShowBeforeImage(true);
  };

  const getGridClass = () => {
    switch (gridCols) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Add minimal badge styles
  const badgeStyle = {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.8em',
    fontWeight: 600,
    marginRight: '6px',
  };
  const featuredBadge = { ...badgeStyle, background: '#facc15', color: '#fff' };
  const publishedBadge = { ...badgeStyle, background: '#22c55e', color: '#fff' };

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
      const cardWidth = isMobile ? 312 : 400; // Mobile: 288px + 24px gap, Desktop: 376px + 24px gap
      const scrollAmount = isMobile ? cardWidth : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: window.innerWidth < 768 ? 'auto' : 'smooth' });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      // Mobile: scroll 1 card, Desktop: scroll 2 cards
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 312 : 400; // Mobile: 288px + 24px gap, Desktop: 376px + 24px gap
      const scrollAmount = isMobile ? cardWidth : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: window.innerWidth < 768 ? 'auto' : 'smooth' });
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

  // Modal navigation with swipe
  const handleModalSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        prevCase();
      } else {
        nextCase();
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg text-professional">Loading transformations...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we fetch the latest results</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg p-8">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Unable to Load Cases</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            disabled={retryCount >= 3}
            className={`px-6 py-2 rounded-lg text-professional transition-colors ${
              retryCount >= 3
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {retryCount >= 3 ? 'Max Retries Reached' : `Retry ${retryCount > 0 ? `(${retryCount}/3)` : ''}`}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-professional hover:bg-gray-50 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`before-after-gallery ${className}`}>
      {/* Enhanced Filters */}
      {showFilters && categories.length > 0 && !featuredOnly && (
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900">Filter Cases</h3>
                  <p className="text-sm text-gray-500">Find specific transformations</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 flex-1">
                <div className="min-w-[200px]">
                  <label className="block text-sm text-professional text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Results counter */}
                <div className="flex items-end">
                  <div className="bg-gray-50 px-4 py-2.5 rounded-lg border">
                    <span className="text-sm text-professional text-gray-600">
                      {filteredCases.length} {filteredCases.length === 1 ? 'Case' : 'Cases'} Found
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick filter chips */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-professional text-gray-500 mr-2">Quick filters:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm text-professional transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 4).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm text-professional transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Gallery Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Transformation Gallery
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Swipe or drag to explore more results
          </p>
        </div>
        
                 {/* Scroll Navigation Buttons */}
         <div className="hidden md:flex gap-2 gallery-indicators">
           <button
             onClick={scrollToLeft}
             disabled={!canScrollLeft}
             className={`p-2 rounded-full border-2 transition-all duration-200 touch-target ${
               canScrollLeft 
                 ? 'border-blue-500 text-blue-500 hover:bg-blue-50' 
                 : 'border-gray-300 text-gray-300 cursor-not-allowed'
             }`}
           >
             <ChevronLeftIcon className="h-5 w-5" />
           </button>
           <button
             onClick={scrollToRight}
             disabled={!canScrollRight}
             className={`p-2 rounded-full border-2 transition-all duration-200 touch-target ${
               canScrollRight 
                 ? 'border-blue-500 text-blue-500 hover:bg-blue-50' 
                 : 'border-gray-300 text-gray-300 cursor-not-allowed'
             }`}
           >
             <ChevronRightIcon className="h-5 w-5" />
           </button>
         </div>
      </div>

      {/* Horizontal Scrollable Gallery */}
      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide swipeable-gallery drag-cursor"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
        >
          {filteredCases.map((caseItem, index) => (
                         <motion.div 
               key={caseItem.id} 
               className="flex-shrink-0 w-80 md:w-96 lg:w-[23rem] bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer gallery-card"
               onClick={(e) => {
                 if (!isDragging) {
                   openModal(caseItem);
                 }
               }}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               drag={false} // Prevent individual card drag
             >
              <div className="relative aspect-square">
                                 <SafeImage
                   src={caseItem.beforeImage}
                   alt={caseItem.beforeImageAlt || `Before treatment for ${caseItem.title}`}
                   fill
                   className="object-contain bg-gray-100"
                   fallbackType="before"
                   fallbackIndex={1}
                 />
                
                                 {/* Enhanced overlay gradient */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Category badge */}
                {caseItem.category && (
                  <div className="absolute top-4 left-4">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white shadow-lg backdrop-blur-sm"
                      role="tag"
                      aria-label={`Category: ${caseItem.category.name}`}
                    >
                      {caseItem.category.name}
                    </span>
                  </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-serif font-bold text-xl mb-2 line-clamp-2 drop-shadow-lg">
                    {caseItem.title}
                  </h3>

                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-2">👁️</div>
                    <div className="text-sm font-medium">View Details</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Scroll Indicators */}
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(filteredCases.length / 2) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
              />
            ))}
          </div>
        </div>

        {/* Gradient Fade Edges */}
        <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>

             {/* Mobile Swipe Hint */}
       <div className="text-center mt-4 md:hidden">
         <p className="text-sm text-gray-500 flex items-center justify-center gap-2 swipe-hint">
           <span>👆 Swipe to see more cases</span>
         </p>
       </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No Cases Found</h3>
            <p className="text-gray-500">No before & after cases match your current filters. Try adjusting your search criteria.</p>
          </div>
        </div>
      )}

      {/* Enhanced Modal with Swipe */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative modal-container"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleModalSwipe}
              dragElastic={0.2}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h2 className="text-2xl font-serif font-bold">{selectedCase.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Swipe left/right to navigate between cases
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Navigation Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={prevCase}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextCase}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Swipe Indicator */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 z-10 md:hidden modal-swipe-indicator">
                <ChevronLeftIcon className="h-8 w-8 opacity-50" />
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 z-10 md:hidden modal-swipe-indicator">
                <ChevronRightIcon className="h-8 w-8 opacity-50" />
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Image Section */}
                  <div className="space-y-6">
                    {/* Main Image Container */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-lg" style={{ minHeight: 300, minWidth: 300 }}>
                      <SafeImage
                        src={showBeforeImage ? selectedCase.beforeImage : selectedCase.afterImage}
                        alt={showBeforeImage ? (selectedCase.beforeImageAlt || 'Before treatment') : (selectedCase.afterImageAlt || 'After treatment')}
                        fill
                        className="object-contain bg-gray-100"
                        fallbackType={showBeforeImage ? 'before' : 'after'}
                        fallbackIndex={1}
                        priority={true}
                      />
                      
                      {/* Image Overlay Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm text-professional shadow-lg ${
                          showBeforeImage 
                            ? 'bg-red-500 text-white' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {showBeforeImage ? '📷 Before' : '✨ After'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enhanced Toggle Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowBeforeImage(true)}
                        className={`flex-1 py-4 px-6 rounded-xl text-professional-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                          showBeforeImage 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        📷 Before Treatment
                      </button>
                      <button
                        onClick={() => setShowBeforeImage(false)}
                        className={`flex-1 py-4 px-6 rounded-xl text-professional-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                          !showBeforeImage 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        ✨ After Treatment
                      </button>
                    </div>


                  </div>

                  {/* Details Section */}
                  <div className="space-y-8">
                    {/* Case Information */}
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Case Details</h3>
                      <div className="space-y-4">
                        {selectedCase.patientGender && (
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-purple-500 text-xl">⚥</span>
                            <div>
                              <span className="text-sm text-professional text-gray-600">Gender</span>
                              <p className="font-medium text-gray-900">{selectedCase.patientGender}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedCase.patientCountry && (
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-blue-500 text-xl">🌍</span>
                            <div>
                              <span className="text-sm text-professional text-gray-600">Country</span>
                              <p className="font-medium text-gray-900">{selectedCase.patientCountry}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedCase.category && (
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <span className="text-indigo-500 text-xl">🏷️</span>
                            <div>
                              <span className="text-sm text-professional text-gray-600">Category</span>
                              <p className="font-medium text-gray-900">{selectedCase.category.name}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Treatment Details */}
                    {selectedCase.treatmentDetails && (
                      <div>
                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-blue-500">🏥</span> Treatment Details
                        </h4>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-gray-700">{selectedCase.treatmentDetails}</p>
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {selectedCase.results && (
                      <div>
                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-green-500">✨</span> Results Achieved
                        </h4>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-gray-700">{selectedCase.results}</p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {selectedCase.description && (
                      <div>
                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-purple-500">📝</span> Additional Notes
                        </h4>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-gray-700">{selectedCase.description}</p>
                        </div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {selectedCase.isFeatured && (
                      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <StarIcon className="h-6 w-6 text-yellow-500" />
                        <span className="font-medium text-yellow-800">Featured Case</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Navigation Footer */}
                <div className="flex justify-between items-center p-6 bg-gray-50 border-t mt-8 -mx-8 -mb-8 rounded-b-lg">
                  <button
                    onClick={prevCase}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                    Previous Case
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-medium">
                      {filteredCases.findIndex(c => c.id === selectedCase.id) + 1} of {filteredCases.length}
                    </span>
                    <div className="flex gap-2">
                      {filteredCases.slice(0, 5).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === filteredCases.findIndex(c => c.id === selectedCase.id)
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                      {filteredCases.length > 5 && (
                        <span className="text-gray-400 text-sm">...</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={nextCase}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
                  >
                    Next Case
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm text-professional shadow-lg ${
                          showBeforeImage 
                            ? 'bg-red-500 text-white' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {showBeforeImage ? '📷 Before' : '✨ After'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Enhanced Toggle Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowBeforeImage(true)}
                        className={`flex-1 py-4 px-6 rounded-xl text-professional-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                          showBeforeImage 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        📷 Before Treatment
                      </button>
                      <button
                        onClick={() => setShowBeforeImage(false)}
                        className={`flex-1 py-4 px-6 rounded-xl text-professional-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                          !showBeforeImage 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        ✨ After Treatment
                      </button>
                    </div>


                  </div>

                  {/* Enhanced Details Section */}
                  <div className="space-y-8">
                    {/* Patient Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center">
                        <span className="bg-blue-500 text-white p-2 rounded-lg mr-3">👤</span>
                        Patient Information
                      </h3>
                      <div className="grid grid-cols-1 gap-3">

                        {selectedCase.patientGender && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Gender:</span>
                            <span className="text-gray-800 font-semibold capitalize">{selectedCase.patientGender}</span>
                          </div>
                        )}
                        {selectedCase.patientCountry && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Country:</span>
                            <span className="text-gray-800 font-semibold">{selectedCase.patientCountry}</span>
                          </div>
                        )}
                        {selectedCase.timeframe && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Timeline:</span>
                            <span className="text-green-600 font-semibold">{selectedCase.timeframe}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description Card */}
                    {selectedCase.description && (
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                        <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center">
                          <span className="bg-amber-500 text-white p-2 rounded-lg mr-3">📝</span>
                          {t('results.description') || 'Description'}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{selectedCase.description}</p>
                      </div>
                    )}

                    {/* Treatment Details Card */}
                    {selectedCase.treatmentDetails && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                        <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center">
                          <span className="bg-purple-500 text-white p-2 rounded-lg mr-3">🏥</span>
                          Treatment Details
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{selectedCase.treatmentDetails}</p>
                      </div>
                    )}

                    {/* Results Card */}
                    {selectedCase.results && (
                      <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center">
                          <span className="bg-green-500 text-white p-2 rounded-lg mr-3">🎯</span>
                          Results
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{selectedCase.results}</p>
                      </div>
                    )}

                    {/* Category & Service Tags */}
                    <div className="flex flex-wrap gap-3">
                      {selectedCase.category && (
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          🏷️ {selectedCase.category.name}
                        </span>
                      )}
                      {selectedCase.service && (
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          🔧 {selectedCase.service.title}
                        </span>
                      )}
                      {selectedCase.isFeatured && (
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured Case
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
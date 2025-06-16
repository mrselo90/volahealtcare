'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { getPlaceholderImage } from '@/lib/placeholders';
import SafeImage from './SafeImage';

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
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<BeforeAfterCase | null>(null);
  const [showBeforeImage, setShowBeforeImage] = useState(true);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [retryCount, setRetryCount] = useState(0);

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
        setCategories(data.map((cat: any) => ({
          id: cat.id,
          name: typeof cat.name === 'string' ? JSON.parse(cat.name).en || cat.name : cat.name
        })));
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

      {/* Gallery Grid */}
      <div className={`grid ${getGridClass()} gap-6`} role="grid" aria-label="Before and after transformation gallery">
        {filteredCases.map((caseItem, index) => (
          <div 
            key={caseItem.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            role="gridcell"
            aria-rowindex={Math.floor(index / gridCols) + 1}
            aria-colindex={(index % gridCols) + 1}
          >
            <div className="relative">
              <div className="relative aspect-square">
                <SafeImage
                  src={caseItem.beforeImage}
                  alt={caseItem.beforeImageAlt || `Before treatment for ${caseItem.title}`}
                  fill
                  className="object-cover"
                  fallbackType="before"
                  fallbackIndex={1}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Status badges */}
                <div className="absolute top-4 left-4 flex gap-2" role="group" aria-label="Case status">
                  {caseItem.isFeatured && (
                    <span style={featuredBadge} role="status" aria-label="Featured case">Featured</span>
                  )}
                  {caseItem.isPublished && (
                    <span style={publishedBadge} role="status" aria-label="Published case">Published</span>
                  )}
                </div>
                
                {/* Category badge */}
                {caseItem.category && (
                  <div className="absolute top-4 right-4">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs text-professional bg-blue-500 text-white shadow-lg"
                      role="tag"
                      aria-label={`Category: ${caseItem.category.name}`}
                    >
                      {caseItem.category.name}
                    </span>
                  </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-serif font-bold text-lg mb-1 line-clamp-2">
                    {caseItem.title}
                  </h3>
                  {caseItem.patientAge && caseItem.patientCountry && (
                    <p className="text-white/90 text-sm" aria-label={`Patient details: ${caseItem.patientAge} years old from ${caseItem.patientCountry}`}>
                      {caseItem.patientAge} years • {caseItem.patientCountry}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Case badges">
                {caseItem.isFeatured && (
                  <span style={featuredBadge} role="status">Featured</span>
                )}
                {caseItem.isPublished && (
                  <span style={publishedBadge} role="status">Published</span>
                )}
              </div>
              <div className="mb-1 text-sm text-gray-700">
                <span>Age: {caseItem.patientAge}</span>
                {caseItem.patientCountry && <> | <span>{caseItem.patientCountry}</span></>}
              </div>
              <div className="mb-1 text-sm text-gray-700">
                <span>
                  Category: {(() => {
                    try {
                      const name = typeof caseItem.category?.name === 'string'
                        ? JSON.parse(caseItem.category.name).en
                        : caseItem.category?.name?.en;
                      return name || caseItem.category?.name;
                    } catch {
                      return caseItem.category?.name;
                    }
                  })()}
                </span>
              </div>
              <div className="mb-1 text-sm text-gray-700">
                <span>Timeline: {caseItem.timeframe || '-'}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mt-2">
                {caseItem.description && <p>{caseItem.description}</p>}
                {caseItem.service && (
                  <p className="flex items-center gap-1">
                    <span role="img" aria-label="service">🦷</span> {caseItem.service.title}
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => openModal(caseItem)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                  title="View Details"
                  aria-label={`View detailed information for ${caseItem.title}`}
                >
                  View Details
                </button>
                <span className="text-xs text-gray-500" aria-label={`Created on ${new Date(caseItem.createdAt).toLocaleDateString()}`}>
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
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

      {/* Modal */}
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
              className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-serif font-bold">{selectedCase.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
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
                        className="object-cover"
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

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-serif font-bold text-blue-600">{selectedCase.patientAge || 'N/A'}</div>
                        <div className="text-sm text-blue-800">Years Old</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-serif font-bold text-green-600">{selectedCase.timeframe || 'N/A'}</div>
                        <div className="text-sm text-green-800">Results Time</div>
                      </div>
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
                        {selectedCase.patientAge && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Age:</span>
                            <span className="text-gray-800 font-semibold">{selectedCase.patientAge} years</span>
                          </div>
                        )}
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
                          Description
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

              {/* Enhanced Navigation */}
              <div className="flex justify-between items-center p-8 bg-gray-50 border-t">
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
                    {filteredCases.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === filteredCases.findIndex(c => c.id === selectedCase.id)
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
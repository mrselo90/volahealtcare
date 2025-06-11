'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';

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
  const [selectedCase, setSelectedCase] = useState<BeforeAfterCase | null>(null);
  const [showBeforeImage, setShowBeforeImage] = useState(true);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');

  useEffect(() => {
    fetchCases();
    if (showFilters) {
      fetchCategories();
    }
  }, [categoryFilter, serviceFilter, featuredOnly, limit]);

  const fetchCases = async () => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (serviceFilter) params.append('service', serviceFilter);
      if (featuredOnly) params.append('featured', 'true');
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/before-after?${params.toString()}`);
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

  const filteredCases = cases.filter(caseItem => {
    if (selectedCategory !== 'all' && caseItem.categoryId !== selectedCategory) return false;
    if (selectedService !== 'all' && caseItem.serviceId !== selectedService) return false;
    return true;
  });

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`before-after-gallery ${className}`}>
      {/* Filters */}
      {showFilters && categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className={`grid ${getGridClass()} gap-6`}>
        {filteredCases.map((caseItem) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            onClick={() => openModal(caseItem)}
          >
            <div className="relative">
              <div className="grid grid-cols-2 gap-0">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={caseItem.beforeImage || '/images/placeholder.svg'}
                    alt={caseItem.beforeImageAlt || 'Before'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                    Before
                  </div>
                </div>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={caseItem.afterImage || '/images/placeholder.svg'}
                    alt={caseItem.afterImageAlt || 'After'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                    After
                  </div>
                </div>
              </div>
              
              {caseItem.isFeatured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                  <StarIcon className="h-4 w-4" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {caseItem.title}
              </h3>
              
              <div className="space-y-1 text-sm text-gray-600">
                {caseItem.patientAge && caseItem.patientCountry && (
                  <p>{caseItem.patientAge} years old, {caseItem.patientCountry}</p>
                )}
                {caseItem.timeframe && (
                  <p className="text-blue-600 font-medium">Results in {caseItem.timeframe}</p>
                )}
                {caseItem.category && (
                  <p className="text-gray-500">{caseItem.category.name}</p>
                )}
              </div>
              
              {caseItem.tags && caseItem.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {caseItem.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cases found matching your criteria.</p>
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
                <h2 className="text-2xl font-bold">{selectedCase.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Section */}
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={showBeforeImage ? selectedCase.beforeImage : selectedCase.afterImage}
                        alt={showBeforeImage ? 'Before' : 'After'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowBeforeImage(true)}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                          showBeforeImage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => setShowBeforeImage(false)}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                          !showBeforeImage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        After
                      </button>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    {/* Patient Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Patient Information</h3>
                      <div className="space-y-2 text-gray-600">
                        {selectedCase.patientAge && (
                          <p><span className="font-medium">Age:</span> {selectedCase.patientAge} years</p>
                        )}
                        {selectedCase.patientGender && (
                          <p><span className="font-medium">Gender:</span> {selectedCase.patientGender}</p>
                        )}
                        {selectedCase.patientCountry && (
                          <p><span className="font-medium">Country:</span> {selectedCase.patientCountry}</p>
                        )}
                        {selectedCase.timeframe && (
                          <p><span className="font-medium">Timeframe:</span> {selectedCase.timeframe}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {selectedCase.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedCase.description}</p>
                      </div>
                    )}

                    {/* Treatment Details */}
                    {selectedCase.treatmentDetails && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Treatment Details</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedCase.treatmentDetails}</p>
                      </div>
                    )}

                    {/* Results */}
                    {selectedCase.results && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Results</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedCase.results}</p>
                      </div>
                    )}

                    {/* Tags */}
                    {selectedCase.tags && selectedCase.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCase.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Category & Service */}
                    <div className="flex gap-4">
                      {selectedCase.category && (
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-500">Category:</span>
                          <p className="text-gray-900">{selectedCase.category.name}</p>
                        </div>
                      )}
                      {selectedCase.service && (
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-500">Service:</span>
                          <p className="text-gray-900">{selectedCase.service.title}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                {filteredCases.length > 1 && (
                  <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    <button
                      onClick={prevCase}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">
                      {filteredCases.findIndex(c => c.id === selectedCase.id) + 1} of {filteredCases.length}
                    </span>
                    <button
                      onClick={nextCase}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Next
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
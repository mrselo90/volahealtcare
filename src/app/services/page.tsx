'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, PlusIcon, MagnifyingGlassIcon, StarIcon, ClockIcon, CurrencyDollarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState, useEffect, useMemo } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState, ServiceCardSkeleton, CategorySkeleton } from '@/components/LoadingState';
import { getCategoryName } from '@/utils/categoryUtils';
import { getServiceImageUrl, getServiceImageAlt } from '@/utils/imageUtils';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    featured: boolean;
    images: any[];
  };
  categorySlug: string;
  onCompare?: (service: any) => void;
  isInComparison?: boolean;
  onToggleFavorite?: (service: any) => void;
  isFavorited?: boolean;
}

// Enhanced Service Card Component
const ServiceCard = ({ service, categorySlug, onCompare, isInComparison = false, onToggleFavorite, isFavorited = false }: ServiceCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
    >
      {/* Featured Badge */}
      {service.featured && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ⭐ Featured
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(service);
            }}
            className={`p-2 rounded-full backdrop-blur-sm ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            } shadow-lg transition-all duration-300 hover:scale-105`}
          >
            {isFavorited ? (
              <StarIconSolid className="h-4 w-4" />
            ) : (
              <StarIcon className="h-4 w-4" />
            )}
          </button>
        )}
        
        {onCompare && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onCompare(service);
            }}
            className={`p-2 rounded-full backdrop-blur-sm ${
              isInComparison 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
            } shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <Link href={`/services/${categorySlug}/${service.slug}`} className="block">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          
            <Image
            src={getServiceImageUrl(service)}
            alt={getServiceImageAlt(service, service.title)}
              fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoadingComplete={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {service.title}
          </h3>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {service.description || 'Professional medical service with expert care and attention.'}
          </p>

          {/* Service Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 text-blue-500" />
              <span>{service.duration || 'Consult for timing'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-gray-900">
                {service.price ? `${service.price} ${service.currency || 'USD'}` : 'Contact for pricing'}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
              <span>Learn More</span>
              <ArrowRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
            
            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              View Details
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Search and Filter Component
const SearchAndFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories,
  sortBy,
  setSortBy 
}: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
      </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category: any) => (
              <option key={category.slug} value={category.slug}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
          >
            <option value="featured">Featured First</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Main Services Page Component
export default function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  // User interaction states
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparisonServices, setComparisonServices] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
    setIsLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
        setCategories(data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
        setIsLoading(false);
    }
  };

  // Filter and sort services
  const filteredCategories = useMemo(() => {
    let filtered = categories.map(category => ({
      ...category,
      services: category.services?.filter((service: any) => {
        const matchesSearch = !searchTerm || 
          service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
      }) || []
    })).filter(category => 
      !selectedCategory || category.slug === selectedCategory
    );

    // Sort services within each category
    filtered.forEach(category => {
      category.services.sort((a: any, b: any) => {
        switch (sortBy) {
          case 'name':
            return a.title?.localeCompare(b.title) || 0;
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'featured':
          default:
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.title?.localeCompare(b.title) || 0;
        }
      });
    });

    return filtered.filter(category => category.services.length > 0);
  }, [categories, searchTerm, selectedCategory, sortBy]);

  const handleToggleFavorite = (service: any) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(service.id)) {
      newFavorites.delete(service.id);
    } else {
      newFavorites.add(service.id);
    }
    setFavorites(newFavorites);
  };

  const handleToggleComparison = (service: any) => {
    if (comparisonServices.find(s => s.id === service.id)) {
      setComparisonServices(comparisonServices.filter(s => s.id !== service.id));
    } else if (comparisonServices.length < 3) {
      setComparisonServices([...comparisonServices, service]);
    }
  };

  const totalServices = categories.reduce((total, cat) => total + (cat.services?.length || 0), 0);
  const filteredTotal = filteredCategories.reduce((total, cat) => total + cat.services.length, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCategories}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Our Medical Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover world-class medical treatments and procedures designed to enhance your health, beauty, and confidence. 
            Expert care with cutting-edge technology.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {totalServices} Total Services
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {filteredTotal} Showing
            </span>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.div>

        {/* Services Grid */}
        {filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.map((category, categoryIndex) => (
              <motion.section
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="relative"
              >
                {/* Category Header */}
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {getCategoryName(category)}
                  </h2>
                  {category.description && (
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      {typeof category.description === 'object' 
                        ? (category.description.en || category.description.tr) 
                        : category.description}
                    </p>
                )}
                  <div className="mt-4 flex items-center justify-center">
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
              </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.services.map((service: any, serviceIndex: number) => (
                    <motion.div
                      key={service.slug}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: (categoryIndex * 0.1) + (serviceIndex * 0.05) 
                      }}
                    >
                      <ErrorBoundary>
                        <ServiceCard
                          service={service}
                          categorySlug={category.slug}
                          onCompare={handleToggleComparison}
                          isInComparison={comparisonServices.some(s => s.id === service.id)}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorited={favorites.has(service.id)}
                        />
                      </ErrorBoundary>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
                      </div>
        )}

        {/* Comparison Bar */}
        {comparisonServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Compare Services ({comparisonServices.length}/3)</h4>
              <button
                onClick={() => setComparisonServices([])}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
                      </div>
            <div className="flex gap-2 mb-3">
              {comparisonServices.map((service) => (
                <div key={service.id} className="flex-1 text-xs bg-blue-50 p-2 rounded text-blue-700 truncate">
                  {service.title}
              </div>
          ))}
        </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold">
              Compare Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
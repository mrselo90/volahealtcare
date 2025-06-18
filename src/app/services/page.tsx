'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, PlusIcon, MagnifyingGlassIcon, StarIcon, CurrencyDollarIcon, AdjustmentsHorizontalIcon, HeartIcon, CalendarDaysIcon, ChatBubbleLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState, useEffect, useMemo } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState, ServiceCardSkeleton, CategorySkeleton } from '@/components/LoadingState';
import { getCategoryName } from '@/utils/categoryUtils';
import { getServiceImageUrl, getServiceImageAlt } from '@/utils/imageUtils';
import { useTranslation } from '../../lib/i18n/hooks';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: string;
    featured: boolean;
    images: any[];
    category?: {
      slug: string;
    };
  };
  categorySlug: string;
  onToggleFavorite?: (service: any) => void;
  isFavorited?: boolean;
}

// Service Card Component
const ServiceCard = ({ service, onToggleFavorite, isFavorited, t }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="aspect-[4/3] relative">
          <Image
            src={getServiceImageUrl(service) || '/images/services/default-service.jpg'}
            alt={getServiceImageAlt(service, service.title)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {service.featured && (
            <div className="absolute top-4 left-4">
                              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <button
              onClick={() => onToggleFavorite(service.id)}
              className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white border-red-500 shadow-lg' 
                  : 'bg-white/90 text-gray-600 border-white/20 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <HeartIcon className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {service.title}
            </h3>
            {service.category && (
              <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
                {getCategoryName(service.category)}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Service Details */}
        <div className="space-y-3 mb-6">
          {/* Recovery Time */}
          {service.recoveryTime && (
            <div className="flex items-center text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <CalendarDaysIcon className="h-4 w-4" />
                <span>{service.recoveryTime} recovery</span>
              </div>
            </div>
          )}

          {/* Key Benefits */}
          {service.keyBenefits && service.keyBenefits.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">{t('services.keyBenefits') || 'Key Benefits'}</p>
              <div className="flex flex-wrap gap-1">
                {service.keyBenefits.slice(0, 3).map((benefit: string, index: number) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {benefit}
                  </span>
                ))}
                {service.keyBenefits.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{service.keyBenefits.length - 3} {t('services.more') || 'more'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            href={`/services/${service.category?.slug || 'general'}/${service.slug}`}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t('services.learnMore') || 'Learn More'}
          </Link>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
  setSortBy,
  t 
}: any) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
      {/* Main Filter Bar */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search - Full width on mobile */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('services.searchPlaceholder') || 'Search treatments, procedures...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 min-h-[48px]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter - Mobile optimized */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-gray-700 min-h-[48px]"
            >
              <option value="">{t('services.allCategories') || 'All Categories'}</option>
              {categories.map((category: any) => (
                <option key={category.slug} value={category.slug}>
                  {getCategoryName(category)} ({category.services?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-gray-700"
            >
              <option value="name">{t('services.sortByName') || 'Sort by Name'}</option>
              <option value="featured">{t('services.sortByFeatured') || 'Featured First'}</option>
              <option value="duration">{t('services.sortByDuration') || 'Duration'}</option>
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-700 font-medium"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              {showFilters ? (t('services.hideFilters') || 'Hide Filters') : (t('services.moreFilters') || 'More Filters')}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-100 bg-gray-50 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('services.duration') || 'Duration'}</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">{t('services.anyDuration') || 'Any Duration'}</option>
                <option value="1-2-hours">{t('services.oneTwoHours') || '1-2 Hours'}</option>
                <option value="half-day">{t('services.halfDay') || 'Half Day'}</option>
                <option value="full-day">{t('services.fullDay') || 'Full Day'}</option>
                <option value="multiple-days">{t('services.multipleDays') || 'Multiple Days'}</option>
              </select>
            </div>

            {/* Featured Only */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-700">{t('services.featuredOnly') || 'Featured Services Only'}</span>
              </label>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">{t('services.quickFilters') || 'Quick Filters:'}</p>
            <div className="flex flex-wrap gap-2">
              {[t('services.mostPopular') || 'Most Popular', t('services.quickProcedures') || 'Quick Procedures', t('services.premiumServices') || 'Premium Services', t('services.nonInvasive') || 'Non-Invasive'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Main Services Page Component
export default function ServicesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error instanceof Error ? error.message : 'Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions - using imported getCategoryName from utils
  const getCategoryDescription = (category: any, lang: string = 'en') => {
    if (!category?.description) return '';
    
    // If it's already an object, use it directly
    if (typeof category.description === 'object') {
      return category.description[lang] || category.description.en || category.description.tr || '';
    }
    
    // If it's a JSON string, parse it
    if (typeof category.description === 'string') {
      try {
        const parsed = JSON.parse(category.description);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed[lang] || parsed.en || parsed.tr || '';
        }
        return category.description; // If not a valid JSON object, return as-is
      } catch {
        return category.description; // If parsing fails, return as-is
      }
    }
    
    return String(category.description || '');
  };

  // Filter and sort services
  const filteredCategories = useMemo(() => {
    let filtered = categories.map(category => ({
      ...category,
      services: (category.services || []).filter((service: any) => {
        const matchesSearch = !searchTerm || 
          service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !selectedCategory || category.slug === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
    })).filter(category => category.services.length > 0);

    // Sort services within each category
    filtered.forEach(category => {
      category.services.sort((a: any, b: any) => {
        switch (sortBy) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'featured':
            return b.featured ? 1 : a.featured ? -1 : 0;
          case 'duration':
            return (a.duration || '').localeCompare(b.duration || '');
          default:
            return 0;
        }
      });
    });

    return filtered;
  }, [categories, searchTerm, selectedCategory, sortBy]);

  const totalServices = categories.reduce((total, category) => total + (category.services?.length || 0), 0);
  const filteredTotal = filteredCategories.reduce((total, category) => total + category.services.length, 0);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('services.errorTitle') || 'Oops! Something went wrong'}</h2>
          <p className="text-gray-600 mb-6">{t('services.errorDesc') || error}</p>
          <button
            onClick={fetchCategories}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
          >
            {t('services.tryAgain') || 'Try Again'}
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
            {t('services.headerTitle') || 'Our Medical Services'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('services.headerDesc') || 'Discover world-class medical treatments and procedures designed to enhance your health, beauty, and confidence. Expert care with cutting-edge technology.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {t('services.totalServices', { count: totalServices }) || `${totalServices} Total Services`}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {t('services.showing', { count: filteredTotal }) || `Showing ${filteredTotal}`}
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
            t={t}
          />
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedCategory 
                ? `${t('services.searchResults') || 'Search Results'}${filteredTotal > 0 ? ` (${filteredTotal})` : ''}`
                : t('services.allServices') || 'All Services'
              }
            </h2>
            <p className="text-gray-600 mt-1">
              {searchTerm && `${t('services.resultsFor') || 'Results for'} "${searchTerm}"`}
              {selectedCategory && ` ${t('services.inCategory') || 'in'} ${getCategoryName(categories.find((c: any) => c.slug === selectedCategory))}`}
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('services.grid') || 'Grid'}
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('services.list') || 'List'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
                  <div className="flex gap-3">
                    <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          <>
            {filteredCategories.length > 0 ? (
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
                          {getCategoryDescription(category)}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-center">
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Services Grid/List */}
                    <div className={
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        : "space-y-4"
                    }>
                      {category.services.map((service: any, serviceIndex: number) => (
                        <motion.div
                          key={service.slug}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: (categoryIndex * 0.1) + (serviceIndex * 0.05) 
                          }}
                          className={viewMode === 'list' ? 'w-full' : ''}
                        >
                          <ErrorBoundary>
                            {viewMode === 'grid' ? (
                              <ServiceCard
                                service={service}
                                onToggleFavorite={(serviceId: string) => {
                                  const newFavorites = new Set(favorites);
                                  if (newFavorites.has(serviceId)) {
                                    newFavorites.delete(serviceId);
                                  } else {
                                    newFavorites.add(serviceId);
                                  }
                                  setFavorites(newFavorites);
                                }}
                                isFavorited={favorites.has(service.id)}
                                t={t}
                              />
                            ) : (
                              /* List View Card */
                              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row">
                                  {/* Image */}
                                  <div className="relative md:w-64 h-48 md:h-auto overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                    <Image
                                      src={getServiceImageUrl(service) || '/images/services/default-service.jpg'}
                                      alt={getServiceImageAlt(service, service.title)}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {service.featured && (
                                      <div className="absolute top-4 left-4">
                                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                          ⭐ Featured
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Content */}
                                  <div className="flex-1 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                          {service.title}
                                        </h3>
                                        {service.category && (
                                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                            {getCategoryName(service.category)}
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => {
                                          const newFavorites = new Set(favorites);
                                          if (newFavorites.has(service.id)) {
                                            newFavorites.delete(service.id);
                                          } else {
                                            newFavorites.add(service.id);
                                          }
                                          setFavorites(newFavorites);
                                        }}
                                        className={`p-2 rounded-full border transition-all duration-200 ${
                                          favorites.has(service.id)
                                            ? 'bg-red-500 text-white border-red-500 shadow-lg' 
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                      >
                                        <HeartIcon className={`h-4 w-4 ${favorites.has(service.id) ? 'fill-current' : ''}`} />
                                      </button>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                      {service.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {service.recoveryTime && (
                                          <div className="flex items-center gap-1">
                                            <CalendarDaysIcon className="h-4 w-4" />
                                            <span>{service.recoveryTime} recovery</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <Link 
                                        href={`/services/${service.category?.slug || 'general'}/${service.slug}`}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                                      >
                                        {t('services.learnMore') || 'Learn More'}
                                        <ArrowRightIcon className="h-4 w-4" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </ErrorBoundary>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}
              </div>
            ) : (
              /* Empty State */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('common.noResults') || 'No services found'}</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || selectedCategory 
                    ? "Try adjusting your search criteria or browse all services"
                    : "No services are currently available"
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                    <Link
                      href="/contact"
                      className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl font-medium transition-colors duration-200"
                    >
                      {t('nav.contact') || 'Contact Us'}
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        {/* Floating Action Button for Favorites */}
        <AnimatePresence>
          {favorites.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <button
                onClick={() => {
                  // Here you would typically show favorites panel or navigate to favorites page
                  console.log('Show favorites:', favorites);
                }}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
              >
                <HeartIcon className="h-6 w-6 fill-current" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {favorites.size}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-6 left-6 z-50"
            >
              <button
                onClick={scrollToTop}
                className="bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
              >
                <ChevronUpIcon className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
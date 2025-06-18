'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowLeftIcon,
  StarIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
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
  treatmentDetails?: string;
  results?: string;
}

interface Stat {
  number: string;
  label: string;
}

interface ResultsPageTemplateProps {
  categoryId: string;
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  treatments: string[];
  stats: Stat[];
}

export default function ResultsPageTemplate({
  categoryId,
  title,
  subtitle,
  description,
  gradientFrom,
  gradientTo,
  treatments,
  stats,
}: ResultsPageTemplateProps) {
  const { t } = useTranslation();
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<BeforeAfterCase | null>(null);
  const [showBeforeImage, setShowBeforeImage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 12;

  useEffect(() => {
    fetchCases();
  }, [categoryId]);

  const fetchCases = async () => {
    try {
      const response = await fetch(`/api/before-after?category=${categoryId}`);
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

  // Mock data for demonstration
  const mockCases: BeforeAfterCase[] = Array.from({ length: 24 }, (_, i) => ({
    id: `${categoryId}-${i + 1}`,
    title: `${categoryId === 'dental' ? 'Diş Tedavisi' : categoryId === 'hair' ? 'Saç Ekimi' : 'Estetik Cerrahi'} Vakası ${i + 1}`,
    beforeImage: `https://picsum.photos/400/400?random=${i + 100}`,
    afterImage: `https://picsum.photos/400/400?random=${i + 200}`,
    description: `${categoryId === 'dental' ? 'Gülümseme tasarımı ile mükemmel sonuç' : categoryId === 'hair' ? 'FUE tekniği ile doğal saç ekimi' : 'Doğal görünümlü estetik cerrahi'}`,
    patientAge: 25 + (i % 20),
    patientGender: i % 2 === 0 ? 'Kadın' : 'Erkek',
    timeframe: `${3 + (i % 9)} Hafta`,
    treatmentDetails: `${categoryId === 'dental' ? 'Dijital gülümseme tasarımı ve veneer uygulaması' : categoryId === 'hair' ? 'FUE tekniği ile 3000 greft saç ekimi' : 'Minimal invaziv teknikle güvenli operasyon'}`,
    results: 'Mükemmel sonuç, hasta çok memnun'
  }));

  const displayCases = cases.length > 0 ? cases : mockCases;
  const totalPages = Math.ceil(displayCases.length / casesPerPage);
  const currentCases = displayCases.slice(
    (currentPage - 1) * casesPerPage,
    currentPage * casesPerPage
  );



  const openModal = (caseItem: BeforeAfterCase) => {
    console.log('Opening modal for case:', {
      id: caseItem.id,
      title: caseItem.title,
      afterImage: caseItem.afterImage,
      beforeImage: caseItem.beforeImage
    });
    setSelectedCase(caseItem);
    setShowBeforeImage(true);
  };

  const closeModal = () => {
    setSelectedCase(null);
  };

  const nextCase = () => {
    if (!selectedCase) return;
    const currentIndex = displayCases.findIndex(c => c.id === selectedCase.id);
    const nextIndex = (currentIndex + 1) % displayCases.length;
    setSelectedCase(displayCases[nextIndex]);
    setShowBeforeImage(true);
  };

  const prevCase = () => {
    if (!selectedCase) return;
    const currentIndex = displayCases.findIndex(c => c.id === selectedCase.id);
    const prevIndex = currentIndex === 0 ? displayCases.length - 1 : currentIndex - 1;
    setSelectedCase(displayCases[prevIndex]);
    setShowBeforeImage(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t('results.backToGallery') || 'Back to Gallery'}
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              {title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
            >
              {subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-white/80 max-w-4xl mx-auto"
            >
              {description}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 text-professional">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{t('results.beforeAfterResults') || 'Before & After Results'}</h2>
          <p className="text-lg text-gray-600">{t('results.discoverResults') || 'Discover our real patient results'}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCases.map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => openModal(caseItem)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={caseItem.afterImage || '/images/placeholder.svg'}
                      alt={t('results.treatmentResult') || 'Treatment Result'}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        console.error('Grid image failed to load:', caseItem.afterImage);
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=No+Image';
                      }}
                    />
                    
                    {/* Minimal hover effect */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 rounded-xl" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-serif font-bold">{selectedCase.title}</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevCase}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextCase}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Image Section */}
                  <div className="space-y-6">
                    <div className="relative w-full h-96 rounded-xl overflow-hidden bg-gray-200 shadow-lg border-2 border-gray-300">
                      {selectedCase.afterImage ? (
                        <Image
                          src={selectedCase.afterImage}
                          alt={t('results.treatmentResult') || 'Treatment Result'}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            console.error('Modal image failed to load:', selectedCase.afterImage);
                            e.currentTarget.src = 'https://picsum.photos/400/400?random=999';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-gray-500">No image available</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-professional shadow-lg bg-green-500 text-white">
                          ✨ Result
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-serif font-bold text-blue-600">{selectedCase.patientAge || 'N/A'}</div>
                        <div className="text-sm text-blue-800">{t('results.patientAge') || 'Patient Age'}: {selectedCase.patientAge} {t('results.years') || 'years'}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-serif font-bold text-green-600">{selectedCase.timeframe || 'N/A'}</div>
                        <div className="text-sm text-green-800">{t('results.timeline') || 'Timeline'}: {selectedCase.timeframe || t('results.na') || 'N/A'}</div>
                      </div>
                    </div>

                    {selectedCase.description && (
                      <div>
                        <h3 className="text-lg font-serif font-bold mb-2">{t('results.description') || 'Description'}: {selectedCase.description}</h3>
                      </div>
                    )}

                    {selectedCase.treatmentDetails && (
                      <div>
                        <h3 className="text-lg font-serif font-bold mb-2">{t('results.treatmentDetails') || 'Treatment Details'}</h3>
                        <p className="text-gray-600">{selectedCase.treatmentDetails}</p>
                      </div>
                    )}

                    {selectedCase.results && (
                      <div>
                        <h3 className="text-lg font-serif font-bold mb-2">{t('results.resultsAchieved') || 'Results Achieved'}: {selectedCase.results}</h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              {t('results.cta.title') || 'Would You Like to Achieve These Results Too?'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('results.cta.subtitle') || 'Get a free consultation with our expert team and create your personalized treatment plan.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg text-professional-bold hover:bg-gray-100 transition-colors duration-200"
              >
                {t('results.cta.consultation') || 'Free Consultation'}
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 text-white px-8 py-3 rounded-lg text-professional-bold hover:bg-white/10 transition-colors duration-200"
              >
                {t('results.cta.contact') || 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
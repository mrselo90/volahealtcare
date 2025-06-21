'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  PlayCircleIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  BuildingOffice2Icon,
  HomeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';
import { getServiceImageUrl, getServiceImageAlt, getFallbackImageUrl } from '@/utils/imageUtils';
import { getTranslation } from '@/utils/translationUtils';
import { formatServiceContent, extractKeyPoints, estimateReadingTime, createTableOfContents, optimizeParagraphStructure, enhanceListFormatting } from '@/utils/contentUtils';
import { useTranslation } from '@/lib/i18n/hooks';
import TestimonialForm from '@/components/TestimonialForm';
import settings from '@/data/settings.json';

// Enhanced Loading Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
  <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[70vh] bg-gradient-to-br from-gray-200 to-gray-300 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="h-8 bg-white/30 rounded w-2/3 mb-4" />
          <div className="h-12 bg-white/30 rounded w-1/2 mb-4" />
          <div className="h-6 bg-white/30 rounded w-3/4" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Image Component with better error handling
function OptimizedImage({ src, alt, ...props }: { src: string; alt?: string; [key: string]: any }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt || 'Service image'}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setImgSrc('/images/placeholder.jpg');
          setIsLoading(false);
        }}
        className={`transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${props.className || ''}`}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <InformationCircleIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Premium Booking Modal Component - Superior Design
const BookingModal = ({ isOpen, onClose, service }: { 
  isOpen: boolean; 
  onClose: () => void; 
  service: Service | null; 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceId: service.id,
          preferredDate: formData.preferredDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          country: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        onClick={onClose}
        title="Click outside to close"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative cursor-default"
          onClick={e => e.stopPropagation()}
        >
          {/* Enhanced Close Button - Top Right Corner */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group border-2 border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 group-hover:text-gray-700" />
          </button>
          
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8 pr-12 sm:pr-16">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Book an Appointment</h2>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Schedule your consultation for <span className="font-semibold text-blue-600">{service?.title}</span>
                </p>
              </div>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Appointment Requested!</h3>
                    <p className="text-green-700 text-sm">We'll contact you soon to confirm your consultation.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
              >
                <div className="flex items-center gap-3">
                  <XMarkIcon className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Booking Failed</h3>
                    <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your country"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={service?.title || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                  />
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select preferred time</option>
                  <option value="09:00">09:00</option>
                  <option value="09:15">09:15</option>
                  <option value="09:30">09:30</option>
                  <option value="09:45">09:45</option>
                  <option value="10:00">10:00</option>
                  <option value="10:15">10:15</option>
                  <option value="10:30">10:30</option>
                  <option value="10:45">10:45</option>
                  <option value="11:00">11:00</option>
                  <option value="11:15">11:15</option>
                  <option value="11:30">11:30</option>
                  <option value="11:45">11:45</option>
                  <option value="12:00">12:00</option>
                  <option value="12:15">12:15</option>
                  <option value="12:30">12:30</option>
                  <option value="12:45">12:45</option>
                  <option value="13:00">13:00</option>
                  <option value="13:15">13:15</option>
                  <option value="13:30">13:30</option>
                  <option value="13:45">13:45</option>
                  <option value="14:00">14:00</option>
                  <option value="14:15">14:15</option>
                  <option value="14:30">14:30</option>
                  <option value="14:45">14:45</option>
                  <option value="15:00">15:00</option>
                  <option value="15:15">15:15</option>
                  <option value="15:30">15:30</option>
                  <option value="15:45">15:45</option>
                  <option value="16:00">16:00</option>
                  <option value="16:15">16:15</option>
                  <option value="16:30">16:30</option>
                  <option value="16:45">16:45</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Any specific requests or details..."
                />
              </div>

              {/* Form Actions */}
              <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="text-center text-xs sm:text-sm text-gray-600">
                <p className="mb-2">Or contact us directly:</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                  <a href="tel:+1555123456" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700">
                    <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    +1 (555) 123-4567
                  </a>
                  <a href="mailto:info@example.com" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700">
                    📧 info@example.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Service data interfaces
interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  anesthesia?: string;
  recovery?: string;
  featured: boolean;
  minAge?: number;
  maxAge?: number;
  availability?: string;
  // Package Details
  timeInTurkey?: string;
  operationTime?: string;
  hospitalStay?: string;
  accommodation?: string;
  transportation?: string;
  translations: Array<{
    id: string;
    language: string;
    title: string;
    description: string;
    content?: string;
  }>;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
  }>;
  faqs?: Array<{
    id: string;
    translations: Array<{
      language: string;
      question: string;
      answer: string;
    }>;
  }>;
  beforeAfterImages?: Array<{
    id: string;
    url: string;
    alt: string | null;
  }>;
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

// Custom hooks
function useServiceData(slug: string) {
  const [data, setData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/services/${slug}`);
        if (!response.ok) throw new Error('Service not found');
        
        const serviceData = await response.json();
        setData({
          ...serviceData,
          translations: serviceData.translations?.length > 0 
            ? serviceData.translations 
            : [{
                id: 'default',
                language: 'en',
                title: serviceData.title || 'Untitled Service',
                description: serviceData.description || ''
              }]
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  return { data, loading, error };
}

function useImageLightbox() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = useCallback((imageUrl: string, alt: string = '', index: number = 0) => {
    setSelectedImage(imageUrl);
    setSelectedImageAlt(alt);
    setCurrentImageIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageAlt('');
    setCurrentImageIndex(0);
  }, []);

  return { selectedImage, selectedImageAlt, currentImageIndex, setCurrentImageIndex, openLightbox, closeLightbox };
}

// Enhanced sticky navigation hook
function useStickyNavigation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
      
      // Update active section based on scroll position
      const sections = ['overview', 'benefits', 'procedure', 'gallery', 'faq', 'booking'];
      let current = 'overview';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return { activeSection, isScrolled, scrollToSection };
}

interface ServicePageProps {
  params: { 
    lang: string;
    category: string; 
    service: string;
  };
}

// Quick Overview Card Component
const QuickOverviewCard = ({ t }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <InformationCircleIcon className="h-5 w-5 text-blue-600" />
      {t('services.detail.quickOverview')}
    </h3>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t('services.detail.readingTime')}</span>
        <span className="font-semibold text-gray-900">3 {t('services.detail.minRead')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t('services.detail.keyBenefits')}</span>
        <span className="font-semibold text-gray-900">5 {t('services.detail.highlights')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t('services.detail.sections')}</span>
        <span className="font-semibold text-gray-900">5 {t('services.detail.topics')}</span>
      </div>
    </div>
  </motion.div>
);

export default function ServicePage({ params }: ServicePageProps) {
  const { lang, category, service } = params;
  const { data, loading, error } = useServiceData(service);
  const { selectedImage, selectedImageAlt, currentImageIndex, setCurrentImageIndex, openLightbox, closeLightbox } = useImageLightbox();
  const { activeSection, isScrolled, scrollToSection } = useStickyNavigation();
  const { t, language } = useTranslation();
  
  const [currentLang, setCurrentLang] = useState(lang || language);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Testimonials state - moved to top
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  
  // Related services state
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [relatedServicesLoading, setRelatedServicesLoading] = useState(true);

  const router = useRouter();

  // Fetch testimonials callback - moved to top
  const fetchTestimonials = useCallback(async () => {
    if (!data?.id) return;
    
    try {
      setTestimonialsLoading(true);
      const response = await fetch(`/api/testimonials?serviceId=${data.id}&isApproved=true`);
      if (response.ok) {
        const testimonialData = await response.json();
        setTestimonials(testimonialData.slice(0, 10)); // Limit to 10 testimonials
      } else {
        console.error('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setTestimonialsLoading(false);
    }
  }, [data?.id]);

  // Fetch related services callback
  const fetchRelatedServices = useCallback(async () => {
    if (!data?.category || !data?.id) return;
    
    try {
      setRelatedServicesLoading(true);
      const response = await fetch(`/api/services?category=${data.category}&exclude=${data.id}&limit=4`);
      if (response.ok) {
        const servicesData = await response.json();
        setRelatedServices(servicesData);
      } else {
        console.error('Failed to fetch related services');
      }
    } catch (error) {
      console.error('Error fetching related services:', error);
    } finally {
      setRelatedServicesLoading(false);
    }
  }, [data?.category, data?.id]);

  // Effects - moved to top
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    fetchRelatedServices();
  }, [fetchRelatedServices]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <LoadingSkeleton />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Get localized content
  const serviceTitle = getTranslation(data.translations, 'title', currentLang) || data.title;
  const rawContent = getTranslation(data.translations, 'content', currentLang) || getTranslation(data.translations, 'description', currentLang) || data.description;
  
  // Apply multiple formatting layers for better readability
  let processedContent = formatServiceContent(rawContent);
  processedContent = optimizeParagraphStructure(processedContent);
  processedContent = enhanceListFormatting(processedContent);
  
  const serviceDescription = processedContent;
  const keyPoints = extractKeyPoints(rawContent);
  const readingTime = estimateReadingTime(rawContent);
  const tableOfContents = createTableOfContents(serviceDescription);
  const featuredImage = data.images?.[0];
  const allImages = [...(data.images || []), ...(data.beforeAfterImages || [])];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: InformationCircleIcon },
    { id: 'procedure', label: 'Procedure', icon: ClockIcon },
    { id: 'gallery', label: 'Gallery', icon: PlayCircleIcon },
    { id: 'faq', label: 'FAQ', icon: InformationCircleIcon },
    { id: 'booking', label: 'Book Now', icon: CalendarIcon },
  ];

  // Fallback testimonials if no database testimonials exist
  const fallbackTestimonials = [
    {
      name: "Sarah Johnson",
      country: "United States",
      rating: 5,
      review: "Absolutely amazing experience! The staff was professional and the results exceeded my expectations.",
      photoUrl: "/images/testimonials/testimonial-1.svg"
    },
    {
      name: "Maria Garcia",
      country: "Spain", 
      rating: 5,
      review: "I couldn't be happier with my decision. The care I received was exceptional from start to finish.",
      photoUrl: "/images/testimonials/testimonial-2.svg"
    },
    {
      name: "Emma Wilson",
      country: "UK",
      rating: 5,
      review: "Professional, caring, and amazing results. I would definitely recommend this to anyone considering it.",
      photoUrl: "/images/testimonials/testimonial-3.svg"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const whatsappNumber = settings.contactPhone.replace(/[^\d]/g, '');
  const whatsappMessage = encodeURIComponent("Hello! I am interested in your services.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      {/* Hero Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] overflow-hidden"
      >
        {/* Background with Parallax Effect */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        </motion.div>
        


        {/* Enhanced Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl"
            >

          


              {/* Professional Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight mb-3 sm:mb-4 lg:mb-6"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {serviceTitle}
                </span>
              </motion.h1>

              {/* Professional Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mb-4 sm:mb-6 lg:mb-8 text-professional-light"
              >
                {serviceDescription?.substring(0, 120)}...
              </motion.p>

              {/* CTA Section - Contact Only */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-start"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg text-professional-bold text-blue-600 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  {t('contact.button') || 'Contact Us'}
                  <ChatBubbleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Functional */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-white/80">
          <button
            onClick={() => scrollToSection('overview')}
            className="flex flex-col items-center gap-1 sm:gap-2 hover:text-white transition-colors duration-300 group cursor-pointer"
            aria-label="Scroll to content"
          >
            <ChevronDownIcon className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce group-hover:animate-pulse" />
            <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity hidden sm:block">
              {t('services.detail.scrollDown')}
            </span>
          </button>
        </div>
      </motion.section>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-12 lg:space-y-16">
            
            {/* Quick Info Card - Mobile Only */}
            <div className="lg:hidden">
              <QuickOverviewCard t={t} />
            </div>
            
        {/* Enhanced Overview Section */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24"
            >
              <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-blue-100/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                      <InformationCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">{t('services.detail.aboutTreatment')}</h2>
                      <p className="text-professional text-sm sm:text-base lg:text-lg">{t('services.detail.comprehensiveInfo')}</p>
                    </div>
                  </div>
                </div>

                {/* Key Points Section */}
                {keyPoints.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <SparklesIcon className="h-5 w-5 text-blue-600" />
                      {t('services.detail.keyBenefits')}
                    </h3>
                    <div className="grid gap-3">
                      {keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      {t('services.detail.tableOfContents')}
                    </h3>
                    <div className="grid gap-2">
                      {tableOfContents.map((item, index) => (
                        <a
                          key={index}
                          href={`#${item.id}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-xs text-gray-400">{index + 1}.</span>
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 mb-6 sm:mb-8 lg:mb-12">
                  <div className="space-y-8 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => {
                          const text = children?.toString() || '';
                          const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                          return (
                            <h2 id={id} className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200 scroll-mt-24">
                              {children}
                            </h2>
                          );
                        },
                        p: ({ children }) => (
                          <p className="text-gray-700 leading-relaxed mb-6 text-base lg:text-lg font-light">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-3 mb-8 ml-4">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-3 text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
                            <span className="text-base lg:text-lg leading-relaxed">{children}</span>
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-blue-700">{children}</em>
                        ),
                      }}
                    >
                      {serviceDescription}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Premium Package Details Section */}
                {(data.timeInTurkey || data.operationTime || data.hospitalStay || data.recovery || data.accommodation || data.transportation) && (
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 mb-6 sm:mb-8 lg:mb-12 shadow-2xl border border-white/10">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400 to-pink-600 rounded-full blur-3xl"></div>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 text-center mb-6 sm:mb-8 lg:mb-12">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl"
                                              >
                          <InformationCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                        </motion.div>
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-white mb-3 sm:mb-4"
                      >
                        {t('services.packageDetails.title')}
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl text-blue-100 max-w-2xl mx-auto"
                      >
                        {t('services.packageDetails.subtitle')}
                      </motion.p>
                    </div>

                                         {/* Cards Grid */}
                     <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-10">
                      {data.timeInTurkey && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <CalendarIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-base text-professional-bold text-blue-700">{t('services.packageDetails.timeInTurkey')}</div>
                              <div className="text-xs text-professional-light text-gray-500">{t('services.packageDetails.timeInTurkeySubtitle')}</div>
                            </div>
                          </div>
                          <div className="mt-auto text-2xl font-serif font-bold text-blue-900">{data.timeInTurkey}</div>
                        </div>
                      )}
                      {data.operationTime && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <ClockIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-base text-professional-bold text-blue-700">{t('services.packageDetails.operationTime')}</div>
                              <div className="text-xs text-professional-light text-gray-500">{t('services.packageDetails.operationTimeSubtitle')}</div>
                            </div>
                          </div>
                          <div className="mt-auto text-2xl font-serif font-bold text-blue-900">{data.operationTime}</div>
                        </div>
                      )}
                      {data.hospitalStay && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <BuildingOffice2Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-base font-semibold text-blue-700">{t('services.packageDetails.hospitalStay')}</div>
                              <div className="text-xs text-gray-500">{t('services.packageDetails.hospitalStaySubtitle')}</div>
                            </div>
                          </div>
                          <div className="mt-auto text-2xl font-bold text-blue-900">{data.hospitalStay}</div>
                        </div>
                      )}
                      {data.recovery && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <HeartIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-base font-semibold text-blue-700">{t('services.packageDetails.recovery')}</div>
                              <div className="text-xs text-gray-500">{t('services.packageDetails.recoverySubtitle')}</div>
                            </div>
                          </div>
                          <div className="mt-auto text-2xl font-bold text-blue-900">{data.recovery}</div>
                        </div>
                      )}
                      {data.accommodation && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <HomeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-base font-semibold text-blue-700">{t('services.packageDetails.accommodation')}</div>
                              <div className="text-xs text-gray-500">{t('services.packageDetails.accommodationSubtitle')}</div>
                            </div>
                          </div>
                          <div className="mt-auto text-2xl font-bold text-blue-900">{data.accommodation}</div>
                        </div>
                      )}
                      {data.transportation && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <TruckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-base font-semibold text-blue-700">{t('services.packageDetails.transportation')}</div>
                              <div className="text-xs text-gray-500">{t('services.packageDetails.transportationSubtitle')}</div>
                            </div>
                          </div>
                          <div className="mt-auto text-2xl font-bold text-blue-900">{data.transportation}</div>
                        </div>
                      )}
                    </div>

                    {/* Premium CTA Banner */}
                    <div className="relative z-10 bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 rounded-2xl p-8 text-center shadow-2xl border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
                      <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                          {t('services.packageDetails.premiumPackageTitle')}
                        </h4>
                        <p className="text-blue-100 text-lg text-professional-light">{t('services.packageDetails.premiumPackageDescription')}</p>
                        <div className="mt-6">
                                                      <Link
                              href="/consultation"
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-professional-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                            <SparklesIcon className="h-6 w-6" />
                            {t('services.packageDetails.reserveJourney')}
                            <ArrowRightIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Key Information for other fields */}
                {/* Anesthesia information hidden per user request */}
            

              </div>
            </motion.section>

            {/* Procedure Details Section */}


        {/* FAQ Section */}
        {data.faqs && data.faqs.length > 0 && (
              <motion.section
                id="faq"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="scroll-mt-24"
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-yellow-100 rounded-2xl">
                      <InformationCircleIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                      <p className="text-gray-600">Find answers to common questions</p>
                    </div>
              </div>
              
              <div className="space-y-4">
                {data.faqs.map((faq, index) => {
                      const translation = faq.translations?.find(t => t.language === lang) || faq.translations?.[0];
                      if (!translation) return null;

                  return (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                      <button
                            className="w-full px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                      >
                        <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-gray-900 pr-4">
                            {translation.question}
                              </h4>
                              <ChevronDownIcon
                                className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
                                  faqOpen === index ? 'transform rotate-180' : ''
                                }`}
                              />
                        </div>
                      </button>
                      <AnimatePresence>
                        {faqOpen === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                                <div className="px-6 pb-6 pt-2 bg-gray-50">
                                  <div className="prose max-w-none text-gray-700">
                              <ReactMarkdown>{translation.answer}</ReactMarkdown>
                                  </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                        </motion.div>
                  );
                })}
              </div>
            </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-4 sm:space-y-6 lg:space-y-8">
              
              {/* Quick Info Card - Desktop Only */}
              <div className="hidden lg:block">
                <QuickOverviewCard t={t} />
              </div>

              {/* Navigation Card */}
              {tableOfContents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {t('services.detail.jumpToSection')}
                  </h3>
                  <div className="space-y-2">
                    {tableOfContents.slice(0, 5).map((item, index) => (
                      <a
                        key={index}
                        href={`#${item.id}`}
                        className="block text-sm text-blue-600 hover:text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Quick Booking Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                id="booking"
                className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{t('services.detail.consultation.title')}</h3>
                  <p className="text-blue-100 text-sm sm:text-base">{t('services.detail.consultation.subtitle')}</p>
                </div>
            
                <div className="space-y-4 mb-4 sm:mb-6">
                  {/* Package Details */}
                  {/* Package Details block removed as requested */}
                </div>

                <div className="space-y-3">
                  <a 
                    href="/consultation"
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[48px] sm:min-h-[56px]"
                  >
                    <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <span className="text-center leading-tight">{t('services.detail.consultation.bookFreeConsultation')}</span>
                  </a>
                  
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full border-2 border-white/30 text-white hover:bg-white/10 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[48px]">
                    <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="text-center leading-tight">{t('services.detail.consultation.messageNow')}</span>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4 text-green-300" />
                      <span>{t('services.detail.consultation.freeConsultation')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheckIcon className="h-4 w-4 text-green-300" />
                      <span>{t('services.detail.consultation.expertCare')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Service Statistics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{t('services.detail.whyChooseUs.title')}</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">4500+</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{t('services.detail.whyChooseUs.happyClients')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <StarIconSolid className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">4.9/5</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{t('services.detail.whyChooseUs.averageRating')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">15+</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{t('services.detail.whyChooseUs.yearsExperience')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-gray-600 text-xs sm:text-sm">{t('services.detail.whyChooseUs.successRate')}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Patient Testimonials */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{t('services.detail.testimonials.title')}</h3>
                    {testimonials.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {testimonials.length} {testimonials.length !== 1 ? t('services.detail.testimonials.reviews') : t('services.detail.testimonials.review')}
                      </div>
                    )}
                  </div>
                  <TestimonialForm 
                    serviceId={data?.id} 
                    serviceName={serviceTitle}
                    onSubmitSuccess={fetchTestimonials}
                  />
                </div>
                
                {testimonialsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">{t('services.detail.testimonials.loading')}</p>
                  </div>
                ) : displayTestimonials.length > 0 ? (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTestimonial}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(displayTestimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                            <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            ({displayTestimonials[currentTestimonial]?.rating || 5}/5)
                          </span>
                        </div>
                        
                        <p className="text-gray-700 italic leading-relaxed">
                          "{displayTestimonials[currentTestimonial]?.review || displayTestimonials[currentTestimonial]?.text}"
                        </p>
                        
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          {displayTestimonials[currentTestimonial]?.photoUrl ? (
                            <img
                              src={displayTestimonials[currentTestimonial].photoUrl}
                              alt={displayTestimonials[currentTestimonial].name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {displayTestimonials[currentTestimonial]?.name?.charAt(0) || 'P'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">
                              {displayTestimonials[currentTestimonial]?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {displayTestimonials[currentTestimonial]?.country || displayTestimonials[currentTestimonial]?.location}
                            </div>
                            {displayTestimonials[currentTestimonial]?.createdAt && (
                              <div className="text-xs text-gray-400">
                                {new Date(displayTestimonials[currentTestimonial].createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Testimonial Navigation - only show if more than 1 testimonial */}
                    {displayTestimonials.length > 1 && (
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => setCurrentTestimonial(
                            currentTestimonial === 0 ? displayTestimonials.length - 1 : currentTestimonial - 1
                          )}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          {displayTestimonials.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentTestimonial(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentTestimonial ? 'bg-blue-600 w-6' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <button
                          onClick={() => setCurrentTestimonial(
                            currentTestimonial === displayTestimonials.length - 1 ? 0 : currentTestimonial + 1
                          )}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <StarIconSolid className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-500">{t('services.detail.testimonials.noReviews')}</p>
                    <p className="text-sm text-gray-400 mt-1">{t('services.detail.testimonials.beFirst')}</p>
                  </div>
                )}
              </motion.div>

              {/* Enhanced Related Services */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-blue-100/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                      {t('services.detail.relatedServices.title')}
                    </h3>
                    <p className="text-sm text-gray-600">{t('services.detail.relatedServices.subtitle')}</p>
                  </div>
                </div>
                
                {relatedServicesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center p-4 rounded-2xl border border-gray-100">
                          <div className="w-16 h-16 bg-gray-200 rounded-xl mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : relatedServices.length > 0 ? (
                  <div className="space-y-4">
                    {relatedServices.map((service) => {
                      const serviceTitle = service.translations?.[0]?.title || service.title;
                      const serviceDescription = service.translations?.[0]?.description || service.description;
                      const categorySlug = service.category?.slug || params.category;
                      
                      return (
                        <Link
                          key={service.id}
                          href={`/${params.lang}/services/${categorySlug}/${service.slug}`}
                          className="block group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group bg-white/70 backdrop-blur-sm hover:shadow-lg"
                          >
                            <div className="flex items-center">
                              {/* Service Image */}
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex-shrink-0 mr-4">
                                {service.images?.[0]?.url ? (
                                  <OptimizedImage
                                    src={service.images[0].url}
                                    alt={service.images[0].alt || serviceTitle}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              {/* Service Info */}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate">
                                  {serviceTitle}
                                </div>
                                <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                  {serviceDescription?.substring(0, 80)}...
                                </div>
                                
                                {/* Package details */}
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  {service.timeInTurkey && (
                                    <div className="flex items-center gap-1">
                                      <ClockIcon className="h-3 w-3" />
                                      <span>{service.timeInTurkey}</span>
                                    </div>
                                  )}
                                  {service.operationTime && (
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      <span>{service.operationTime}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Arrow Icon */}
                              <div className="ml-4 flex-shrink-0">
                                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="h-12 w-12 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-gray-500">{t('services.detail.relatedServices.noServices')}</p>
                    <Link 
                      href={`/${params.lang}/services`}
                      className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('services.detail.relatedServices.browseAll')}
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                )}
                
                {/* View All Services Link */}
                {relatedServices.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link 
                      href={`/${params.lang}/services/${params.category}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group"
                    >
                      {t('services.detail.relatedServices.viewAll', { category: params.category })}
                      <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>



      {/* Enhanced Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div className="relative max-w-7xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
              {/* Image Container */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <OptimizedImage
                  src={selectedImage}
                  alt={selectedImageAlt || 'Enlarged view'}
                  width={1200}
                  height={800}
                  className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
                  priority
                />
              </motion.div>

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 sm:p-3 text-white hover:text-gray-300 transition-all backdrop-blur-sm hover:scale-105"
                aria-label="Close lightbox"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
                      setCurrentImageIndex(prevIndex);
                      openLightbox(
                        allImages[prevIndex]?.url || getFallbackImageUrl(),
                        allImages[prevIndex]?.alt || 'Previous image',
                        prevIndex
                      );
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 sm:p-3 text-white transition-all backdrop-blur-sm hover:scale-105"
                  >
                    <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextIndex = currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
                      setCurrentImageIndex(nextIndex);
                      openLightbox(
                        allImages[nextIndex]?.url || getFallbackImageUrl(),
                        allImages[nextIndex]?.alt || 'Next image',
                        nextIndex
                      );
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 sm:p-3 text-white transition-all backdrop-blur-sm hover:scale-105"
                  >
                    <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} of {allImages.length}
          </div>

                  {/* Thumbnail Navigation */}
                  <div className="absolute bottom-4 left-0 right-0 justify-center space-x-1 sm:space-x-2 max-w-md mx-auto hidden sm:flex">
                    {allImages.slice(Math.max(0, currentImageIndex - 2), currentImageIndex + 3).map((image, index) => {
                      const actualIndex = Math.max(0, currentImageIndex - 2) + index;
              return (
                  <button
                          key={actualIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(actualIndex);
                            openLightbox(
                              image.url,
                              image.alt || serviceTitle,
                              actualIndex
                            );
                          }}
                          className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg overflow-hidden transition-all ${
                            actualIndex === currentImageIndex 
                              ? 'ring-2 ring-white scale-110' 
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <OptimizedImage
                            src={image.url}
                            alt={image.alt || serviceTitle}
                            fill
                            className="object-cover w-full h-full"
                          />
                  </button>
              );
            })}
          </div>
                </>
              )}

              {/* Image Info */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm max-w-md">
                {selectedImageAlt || serviceTitle}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        service={data}
      />

    </div>
  );
}
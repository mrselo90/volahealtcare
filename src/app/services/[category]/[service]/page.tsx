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
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';
import { getServiceImageUrl, getServiceImageAlt, getFallbackImageUrl } from '@/utils/imageUtils';
import { getTranslation } from '@/utils/translationUtils';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    preferredDate: '',
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
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative cursor-default"
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
          
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 pr-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Book an Appointment</h2>
                <p className="text-gray-600 mt-2">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
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
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Or contact us directly:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:+1555123456" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <PhoneIcon className="h-4 w-4" />
                    +1 (555) 123-4567
                  </a>
                  <a href="mailto:info@example.com" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
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
  duration: string;
  currency?: string;
  benefits?: string;
  risks?: string;
  aftercare?: string;
  anesthesia?: string;
  recovery?: string;
  prerequisites?: string;
  featured: boolean;
  minAge?: number;
  maxAge?: number;
  availability?: string;
  translations: Array<{
    id: string;
    language: string;
    title: string;
    description: string;
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
    category: string; 
    service: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const { data, loading, error } = useServiceData(params.service);
  const { selectedImage, selectedImageAlt, currentImageIndex, setCurrentImageIndex, openLightbox, closeLightbox } = useImageLightbox();
  const { activeSection, isScrolled, scrollToSection } = useStickyNavigation();
  
  const [lang, setLang] = useState('en');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const router = useRouter();

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
  const serviceTitle = getTranslation(data.translations, 'title', lang) || data.title;
  const serviceDescription = getTranslation(data.translations, 'description', lang) || data.description;
  const featuredImage = data.images?.[0];
  const allImages = [...(data.images || []), ...(data.beforeAfterImages || [])];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: InformationCircleIcon },
    { id: 'benefits', label: 'Benefits', icon: CheckCircleIcon },
    { id: 'procedure', label: 'Procedure', icon: ClockIcon },
    { id: 'gallery', label: 'Gallery', icon: PlayCircleIcon },
    { id: 'faq', label: 'FAQ', icon: InformationCircleIcon },
    { id: 'booking', label: 'Book Now', icon: CalendarIcon },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "United States",
      rating: 5,
      text: "Absolutely amazing experience! The staff was professional and the results exceeded my expectations.",
      avatar: "/images/testimonial1.jpg"
    },
    {
      name: "Maria Garcia",
      location: "Spain", 
      rating: 5,
      text: "I couldn't be happier with my decision. The care I received was exceptional from start to finish.",
      avatar: "/images/testimonial2.jpg"
    },
    {
      name: "Emma Wilson",
      location: "UK",
      rating: 5,
      text: "Professional, caring, and amazing results. I would definitely recommend this to anyone considering it.",
      avatar: "/images/testimonial3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section - Enhanced */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[80vh] overflow-hidden"
      >
        {/* Background with Parallax Effect */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          {featuredImage ? (
            <OptimizedImage
              src={featuredImage.url}
              alt={featuredImage.alt || serviceTitle}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </motion.div>
        
        {/* Enhanced Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-all duration-300 hover:scale-105 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Services</span>
              </motion.button>
              
              <div className="flex items-center gap-4">
                {/* Enhanced Language Selector */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center bg-white/15 rounded-full p-1 backdrop-blur-sm border border-white/20"
                >
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        lang === l.code 
                          ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
                          : 'text-white hover:bg-white/20 hover:scale-105'
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </motion.div>

                {/* Enhanced Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 border ${
                      isFavorited 
                        ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/25' 
                        : 'bg-white/15 text-white hover:bg-white/25 border-white/20'
                    }`}
                  >
                    {isFavorited ? (
                      <HeartIconSolid className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button className="p-3 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm transition-all duration-300 hover:scale-110 border border-white/20">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl"
            >
              {/* Enhanced Breadcrumb */}
              <motion.nav 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-blue-200 mb-6 text-sm flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit"
              >
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRightIcon className="h-4 w-4" />
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                <ChevronRightIcon className="h-4 w-4" />
                <span className="text-white font-medium">{serviceTitle}</span>
              </motion.nav>
          
              {/* Enhanced Service Category & Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-blue-400/30">
                  {data.category}
                </span>
                {data.featured && (
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
                    <StarIconSolid className="h-4 w-4" />
                    Featured Treatment
                  </span>
                )}
                <span className="bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  {data.duration || 'Consult for timing'}
                </span>
              </motion.div>

              {/* Enhanced Title with Gradient */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-8"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {serviceTitle}
                </span>
              </motion.h1>

              {/* Enhanced Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-xl md:text-2xl text-blue-100 max-w-4xl mb-10 leading-relaxed font-light"
              >
                {serviceDescription?.substring(0, 200)}...
              </motion.p>

              {/* Enhanced Price & CTA Section */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-8"
              >
                {/* Price Card */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="text-blue-200 text-sm font-medium mb-2">Starting from</div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    {data.price ? `$${data.price.toLocaleString()}` : 'Contact'}
                  </div>
                  <div className="text-blue-200 text-sm mt-1">{data.currency || 'USD'}</div>
                </div>
                
                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBookingModal(true)}
                    className="bg-gradient-to-r from-white to-blue-50 text-blue-700 hover:from-blue-50 hover:to-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl flex items-center gap-3 group"
                  >
                    <CalendarIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    Book Free Consultation
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('procedure')}
                    className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm hover:border-white group flex items-center gap-2"
                  >
                    Learn More
                    <ChevronDownIcon className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDownIcon className="h-8 w-8 animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* Enhanced Sticky Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-30 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Navigation Items */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : isScrolled
                          ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <select 
                value={activeSection}
                onChange={(e) => scrollToSection(e.target.value)}
                className="bg-white/90 text-gray-900 px-4 py-2 rounded-xl border border-gray-200 font-medium"
              >
                {navigationItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <PhoneIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            
        {/* Enhanced Overview Section */}
            <motion.section
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24"
            >
              <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <InformationCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">About This Treatment</h2>
                    <p className="text-gray-600 text-lg">Comprehensive information about your procedure</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 mb-12">
                  <ReactMarkdown>{serviceDescription}</ReactMarkdown>
                  </div>

                {/* Enhanced Key Information Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <ClockIcon className="h-6 w-6" />
                      <h4 className="font-semibold">Duration</h4>
                    </div>
                    <p className="text-lg font-medium">{data.duration || 'Varies by case'}</p>
                  </motion.div>
              
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <CurrencyDollarIcon className="h-6 w-6" />
                      <h4 className="font-semibold">Starting Price</h4>
                    </div>
                    <p className="text-lg font-medium">
                      {data.price ? `$${data.price.toLocaleString()}` : 'Contact for pricing'}
                    </p>
                  </motion.div>

                  {data.anesthesia && (
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldCheckIcon className="h-6 w-6" />
                        <h4 className="font-semibold">Anesthesia</h4>
                      </div>
                      <p className="text-lg font-medium">{data.anesthesia}</p>
                    </motion.div>
                  )}

                  {data.recovery && (
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <SparklesIcon className="h-6 w-6" />
                        <h4 className="font-semibold">Recovery Time</h4>
                      </div>
                      <p className="text-lg font-medium">{data.recovery}</p>
                    </motion.div>
                  )}
                </div>
            
                {/* Age Requirements */}
                {(data.minAge || data.maxAge) && (
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-600" />
                      Age Requirements
                    </h4>
                    <p className="text-gray-700">
                      Suitable for ages {data.minAge || 'Any'} to {data.maxAge || 'Any'}
                    </p>
                  </div>
                )}

                {/* Enhanced What to Expect */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <h4 className="text-3xl font-bold mb-8 text-center">What to Expect</h4>
                    <div className="grid md:grid-cols-3 gap-8">
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="text-center group"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 border border-white/20">
                          <span className="text-3xl font-bold">1</span>
                        </div>
                        <h5 className="font-bold mb-3 text-lg">Consultation</h5>
                        <p className="text-blue-100 leading-relaxed">Initial assessment and personalized treatment planning</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="text-center group"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 border border-white/20">
                          <span className="text-3xl font-bold">2</span>
                        </div>
                        <h5 className="font-bold mb-3 text-lg">Procedure</h5>
                        <p className="text-blue-100 leading-relaxed">Professional treatment by our expert medical team</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="text-center group"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 border border-white/20">
                          <span className="text-3xl font-bold">3</span>
                        </div>
                        <h5 className="font-bold mb-3 text-lg">Recovery</h5>
                        <p className="text-blue-100 leading-relaxed">Comprehensive follow-up care and support</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

        {/* Benefits & Risks Section */}
            <motion.section
              id="benefits"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Benefits & Considerations</h2>
                    <p className="text-gray-600">Understanding the advantages and important factors</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Benefits */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                      <CheckCircleIcon className="h-6 w-6" />
                      Benefits
                    </h3>
                  {data.benefits ? (
                      <div className="prose prose-green max-w-none text-green-700">
                      <ReactMarkdown>{data.benefits}</ReactMarkdown>
                    </div>
                  ) : (
                      <ul className="space-y-4">
                        {[
                          'Professional and experienced medical team',
                          'State-of-the-art facilities and equipment',
                          'Personalized treatment plans',
                          'Comprehensive aftercare support',
                          'Proven track record of success'
                        ].map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3 text-green-700">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                      </li>
                        ))}
                    </ul>
                  )}
                </div>

                  {/* Risks & Considerations */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                      <InformationCircleIcon className="h-6 w-6" />
                      Important Considerations
                    </h3>
                  {data.risks ? (
                      <div className="prose prose-amber max-w-none text-amber-700">
                      <ReactMarkdown>{data.risks}</ReactMarkdown>
                    </div>
                  ) : (
                      <div className="text-amber-700">
                        <p className="mb-4">
                          As with any medical procedure, there are potential considerations and risks that will be thoroughly discussed during your consultation.
                        </p>
                        <ul className="space-y-2 text-sm">
                          <li>• Individual results may vary</li>
                          <li>• Recovery time depends on personal factors</li>
                          <li>• Pre-existing conditions may affect suitability</li>
                          <li>• All risks will be explained in detail</li>
                        </ul>
                      </div>
                  )}
                </div>
                </div>
              </div>
            </motion.section>

            {/* Procedure Details Section */}
            <motion.section
              id="procedure"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <ClockIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Procedure Process</h2>
                    <p className="text-gray-600">Step-by-step guide through your treatment journey</p>
                  </div>
                </div>
            
                <div className="space-y-8">
                  {/* Pre-procedure */}
              {data.prerequisites && (
                    <div className="relative">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-3">Before Your Procedure</h4>
                          <div className="bg-blue-50 rounded-2xl p-6">
                            <div className="prose max-w-none text-gray-700">
                    <ReactMarkdown>{data.prerequisites}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              )}
              
                  {/* During procedure */}
                  <div className="relative">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">During Your Treatment</h4>
                        <div className="bg-green-50 rounded-2xl p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-green-800 mb-2">Comfort & Safety</h5>
                              <p className="text-gray-700 text-sm">
                                Your comfort and safety are our top priorities. Our experienced medical team will ensure you're well-informed and comfortable throughout the entire process.
                              </p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-green-800 mb-2">Duration</h5>
                              <p className="text-gray-700 text-sm">
                                The procedure typically takes {data.duration || 'varies based on individual needs'}. Our team will keep you informed of progress throughout.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              </div>
              
                  {/* Post-procedure */}
              {data.aftercare && (
                    <div className="relative">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-3">Aftercare & Recovery</h4>
                          <div className="bg-purple-50 rounded-2xl p-6">
                            <div className="prose max-w-none text-gray-700">
                    <ReactMarkdown>{data.aftercare}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              )}
            </div>
              </div>
            </motion.section>

            {/* Gallery Section */}
            <motion.section
              id="gallery"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-indigo-100 rounded-2xl">
                    <PlayCircleIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
                    <p className="text-gray-600">View our gallery and results</p>
                  </div>
                </div>

                {allImages.length > 0 ? (
                  <div className="space-y-12">
                    {/* Main Gallery */}
                    {data.images && data.images.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {data.images.map((image, index) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                              onClick={() => openLightbox(
                                image.url, 
                                image.alt || serviceTitle, 
                                index
                              )}
                            >
                              <OptimizedImage
                                src={image.url}
                                alt={image.alt || serviceTitle}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <MagnifyingGlassIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Before & After Gallery */}
                    {data.beforeAfterImages && data.beforeAfterImages.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Before & After Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {data.beforeAfterImages.map((image, index) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                              onClick={() => openLightbox(
                                image.url, 
                                image.alt || `${serviceTitle} Before/After`, 
                                data.images.length + index
                              )}
                            >
                              <OptimizedImage
                                src={image.url}
                                alt={image.alt || `${serviceTitle} Before/After`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                <MagnifyingGlassIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Before/After
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <PlayCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Gallery images coming soon</p>
                  </div>
                )}
              </div>
            </motion.section>

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
            <div className="sticky top-32 space-y-8">
              
              {/* Quick Booking Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                id="booking"
                className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Book Your Consultation</h3>
                  <p className="text-blue-100">Free consultation with our experts</p>
            </div>
            
                <div className="space-y-4 mb-6">
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-yellow-300" />
                      <span className="font-semibold">Starting Price</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {data.price ? `${data.price} ${data.currency || 'USD'}` : 'Contact for pricing'}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <ClockIcon className="h-5 w-5 text-green-300" />
                      <span className="font-semibold">Duration</span>
                    </div>
                    <div className="text-lg">{data.duration || 'Varies'}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="h-6 w-6" />
                    Book Free Consultation
                  </button>
                  
                  <button className="w-full border-2 border-white/30 text-white hover:bg-white/10 py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2">
                    <PhoneIcon className="h-5 w-5" />
                    Call Now: +1 (555) 123-4567
                  </button>
                      </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4 text-green-300" />
                      <span>Free consultation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheckIcon className="h-4 w-4 text-green-300" />
                      <span>Expert care</span>
                </div>
              </div>
                </div>
              </motion.div>

              {/* Service Statistics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">500+</div>
                      <div className="text-gray-600 text-sm">Happy Patients</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <StarIconSolid className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                      <div className="text-gray-600 text-sm">Average Rating</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">10+</div>
                      <div className="text-gray-600 text-sm">Years Experience</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <SparklesIcon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-gray-600 text-sm">Success Rate</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Patient Testimonials */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Reviews</h3>
                
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
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                      
                      <p className="text-gray-700 italic">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {testimonials[currentTestimonial].name.charAt(0)}
              </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {testimonials[currentTestimonial].location}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Testimonial Navigation */}
                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => setCurrentTestimonial(
                        currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1
                      )}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {testimonials.map((_, index) => (
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
                        currentTestimonial === testimonials.length - 1 ? 0 : currentTestimonial + 1
                      )}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Related Services */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Related Services</h3>
                
                <div className="space-y-4">
                  {['Teeth Whitening', 'Dental Veneers', 'Smile Makeover'].map((service, index) => (
                    <Link
                      key={index}
                      href={`/services/dental/${service.toLowerCase().replace(' ', '-')}`}
                      className="block p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service}
                          </div>
                          <div className="text-sm text-gray-600">
                            Professional treatment
                          </div>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button - Mobile */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-2xl hover:bg-blue-700 transition-colors flex items-center justify-center group"
        >
          <span className="absolute w-full h-full rounded-full animate-ping bg-blue-400 opacity-30"></span>
          <CalendarIcon className="h-6 w-6 relative z-10" />
        </motion.button>
      </div>

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
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white hover:text-gray-300 transition-all backdrop-blur-sm hover:scale-105"
                aria-label="Close lightbox"
              >
                <XMarkIcon className="w-6 h-6" />
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all backdrop-blur-sm hover:scale-105"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white transition-all backdrop-blur-sm hover:scale-105"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} of {allImages.length}
          </div>

                  {/* Thumbnail Navigation */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 max-w-md mx-auto">
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
                          className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
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

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowBookingModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group"
        >
          <CalendarIcon className="h-6 w-6" />
          <span className="hidden lg:block font-semibold">Book Consultation</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </motion.button>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
        service={data} 
      />

    </div>
  );
}
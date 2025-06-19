'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  InformationCircleIcon,
  CheckCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  StarIcon,
  ChevronRightIcon,
  CalendarIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useTranslation } from '@/lib/i18n/hooks';
import settings from '@/data/settings.json';

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
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
}

interface ServicePageProps {
  params: { 
    category: string; 
    service: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const { t, language } = useTranslation();
  const [data, setData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${params.service}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        const serviceData = await response.json();
        setData(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.service]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Service could not be loaded'}</p>
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

  const serviceTitle = data.title;
  const serviceDescription = data.description;
  const whatsappNumber = settings.contactPhone.replace(/[^\d]/g, '');
  const whatsappMessage = encodeURIComponent("Hello! I am interested in your services.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[50vh] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 text-white">
                {serviceTitle}
              </h1>
              <p className="text-xl text-blue-100 max-w-4xl mb-8">
                {serviceDescription?.substring(0, 120)}...
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all duration-300"
              >
                {t('contact.button') || 'Contact Us'}
                <ChatBubbleLeftIcon className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <InformationCircleIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">About This Treatment</h2>
                  <p className="text-gray-600">Comprehensive information about the procedure</p>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed">
                  {serviceDescription}
                </p>
              </div>
            </motion.section>

            {/* Benefits Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <SparklesIcon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Key Benefits</h2>
                  <p className="text-gray-600">What you can expect from this treatment</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Professional and experienced medical team</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">State-of-the-art facilities and equipment</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Personalized treatment plans</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Comprehensive aftercare support</p>
                </div>
              </div>
            </motion.section>

            {/* Statistics Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <UserGroupIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
                  <p className="text-gray-600">Our track record speaks for itself</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4500+</div>
                  <div className="text-gray-600 text-sm">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
                  <div className="text-gray-600 text-sm">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
                  <div className="text-gray-600 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                  <div className="text-gray-600 text-sm">Success Rate</div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-6">
              
              {/* Quick Booking Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-2xl"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free Consultation</h3>
                  <p className="text-blue-100">Get started on your journey today</p>
                </div>

                <div className="space-y-3">
                  <a 
                    href="/consultation"
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="h-6 w-6" />
                    <span>Free Consultation</span>
                  </a>
                  
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full border-2 border-white/30 text-white hover:bg-white/10 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <PhoneIcon className="h-5 w-5" />
                    <span>Message Now</span>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4 text-green-300" />
                      <span>Free Consultation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheckIcon className="h-4 w-4 text-green-300" />
                      <span>Expert Care</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
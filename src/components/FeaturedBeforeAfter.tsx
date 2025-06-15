'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CounterAnimation from '@/components/CounterAnimation';

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

interface FeaturedBeforeAfterProps {
  limit?: number;
  className?: string;
}

export default function FeaturedBeforeAfter({ 
  limit = 6, 
  className = '' 
}: FeaturedBeforeAfterProps) {
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState(0);

  useEffect(() => {
    const fetchFeaturedCases = async () => {
      try {
        const response = await fetch('/api/before-after?featured=true&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch featured cases');
        }
        const data = await response.json();
        
        console.log('Featured cases loaded:', data);
        setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching featured cases:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCases();
  }, []);

  // Auto-rotate featured cases
  useEffect(() => {
    if (cases.length > 1) {
      const interval = setInterval(() => {
        setSelectedCase(prev => (prev + 1) % cases.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [cases.length]);

  const currentCase = cases[selectedCase];

  // Debug logging
  useEffect(() => {
    if (currentCase) {
      console.log('Current case:', {
        title: currentCase.title,
        beforeImage: currentCase.beforeImage,
        afterImage: currentCase.afterImage
      });
    }
  }, [currentCase]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="text-lg font-medium text-blue-100">Loading transformations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || cases.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">No Featured Cases</h3>
              <p className="text-blue-100 mb-6">
                {error ? 'Unable to load featured cases at the moment.' : 'No featured transformations are currently available.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 text-white px-8 py-3 rounded-full text-sm font-semibold mb-8 shadow-2xl">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>REAL PATIENT TRANSFORMATIONS</span>
            <span>✨</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
            Life-Changing
            <br />
            <span className="text-4xl md:text-6xl font-light italic">Results</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Witness the incredible transformations of patients who trusted us with their medical tourism journey at Vola Health Istanbul.
          </p>
        </motion.div>

        {/* Main Featured Case Display */}
        {currentCase && (
          <motion.div 
            key={selectedCase}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl featured-case-card">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Result Image */}
                <div className="relative">
                  <div className="relative group max-w-md mx-auto">
                    <div className="absolute -top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 glow-animation">
                      ✨ RESULT
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-800">
                      <Image
                        src={currentCase.afterImage}
                        alt={currentCase.afterImageAlt || 'Treatment result'}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Result image failed to load:', currentCase.afterImage);
                          e.currentTarget.src = '/images/placeholder-result.jpg';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Case Details */}
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold gradient-text-accent shimmer-effect">
                      ⭐ FEATURED
                    </span>
                    {currentCase.category && (
                      <span className="bg-blue-500/20 border border-blue-400/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                        {typeof currentCase.category.name === 'string' 
                          ? JSON.parse(currentCase.category.name).en 
                          : currentCase.category.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight gradient-text-primary">
                    {currentCase.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-lg p-4 stats-card">
                      <div className="text-blue-200 text-sm mb-1">Patient Age</div>
                      <div className="text-xl font-semibold">{currentCase.patientAge} years</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 stats-card">
                      <div className="text-blue-200 text-sm mb-1">Timeline</div>
                      <div className="text-xl font-semibold">{currentCase.timeframe || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                    {currentCase.description}
                  </p>
                  
                  {currentCase.results && (
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
                      <div className="text-green-200 text-sm mb-2">RESULTS ACHIEVED</div>
                      <p className="text-white">{currentCase.results}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Case Navigation */}
        <div className="flex justify-center items-center gap-4 mb-16">
          {cases.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedCase(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedCase 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`View case ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { number: 1500, suffix: '+', label: 'Successful Cases', icon: '🏆' },
            { number: 98, suffix: '%', label: 'Satisfaction Rate', icon: '😊' },
            { number: 25, suffix: '+', label: 'Countries Served', icon: '🌍' },
            { number: 15, suffix: '+', label: 'Years Experience', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 stats-card">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <CounterAnimation 
                    end={stat.number} 
                    suffix={stat.suffix}
                    duration={2}
                  />
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl max-w-4xl mx-auto featured-case-card">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 gradient-text-primary">
              Ready for Your Transformation?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who chose Istanbul for their medical journey. 
              Our expert team is ready to help you achieve your desired results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl btn-primary-gradient"
              >
                <span>View All Transformations</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 shadow-xl stats-card"
              >
                <span>Free Consultation</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
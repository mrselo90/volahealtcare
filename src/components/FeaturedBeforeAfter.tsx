'use client';

import Link from 'next/link';
import BeforeAfterGallery from './BeforeAfterGallery';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchFeaturedCases = async () => {
      try {
        const response = await fetch('/api/before-after?featured=true&limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch featured cases');
        }
        const data = await response.json();
        
        // The API returns cases directly as an array, not wrapped in an object
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

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium text-gray-600">Loading featured transformations...</p>
            </div>
            <p className="text-gray-400">Discovering our most remarkable results</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || cases.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Featured Cases</h3>
              <p className="text-gray-600 mb-6">
                {error ? 'Unable to load featured cases at the moment.' : 'No featured transformations are currently available.'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <span>⭐</span>
            <span>Featured Transformations</span>
            <span>✨</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-green-900 bg-clip-text text-transparent mb-6">
            Remarkable Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Witness the incredible transformations of our patients who trusted us with their medical tourism journey. 
            Each story represents hope, expertise, and life-changing results.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{cases.length}+</div>
              <div className="text-sm text-gray-500 font-medium">Featured Cases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-500 font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-gray-500 font-medium">Countries</div>
            </div>
          </div>
        </div>

        {/* Enhanced Gallery */}
        <BeforeAfterGallery
          featuredOnly={true}
          limit={6}
          showFilters={false}
          gridCols={3}
          className="featured-gallery"
        />

        {/* Enhanced CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Ready for Your Transformation?</h3>
            </div>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who chose Turkey for their medical journey. 
              Our expert team is ready to help you achieve your desired results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>View All Cases</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>Start Your Journey</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
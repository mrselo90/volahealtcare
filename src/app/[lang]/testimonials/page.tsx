'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, PlayIcon, UserIcon, MapPinIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/lib/i18n/hooks';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  country: string;
  photoUrl?: string;
  createdAt: string;
  isApproved: boolean;
  isFeatured: boolean;
  service: {
    title: string;
    slug: string;
  };
  // Legacy fields for compatibility
  content?: string;
  author?: string;
  image?: string;
  treatment?: string;
  date?: string;
  procedure?: string;
  grafts?: string;
  videoUrl?: string | null;
  beforeAfter?: boolean;
}



// Filters will be defined inside component to access translations

export default function Testimonials() {
  const { t } = useTranslation();
  const [selectedTreatment, setSelectedTreatment] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [showVideoOnly, setShowVideoOnly] = useState(false);
  const [apiTestimonials, setApiTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const filters = {
    treatment: [
      { value: 'all', label: t('testimonials.page.filters.allTreatments') },
      { value: 'hair-transplant', label: t('testimonials.page.filters.hairTransplant') },
      { value: 'dental', label: t('testimonials.page.filters.dentalAesthetics') },
      { value: 'facial', label: t('testimonials.page.filters.facialAesthetics') },
      { value: 'body', label: t('testimonials.page.filters.bodyAesthetics') },
    ],
    country: [
      { value: 'all', label: t('testimonials.page.filters.allCountries') },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'United States', label: 'United States' },
      { value: 'Canada', label: 'Canada' },
      { value: 'Australia', label: 'Australia' },
      { value: 'UAE', label: 'UAE' },
      { value: 'Spain', label: 'Spain' },
    ],
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?approved=true');
      if (response.ok) {
        const data = await response.json();
        // Transform database testimonials to match interface
        const transformedTestimonials = data.map((testimonial: any) => ({
          ...testimonial,
          content: testimonial.review,
          author: testimonial.name,
          image: testimonial.photoUrl,
          treatment: getCategoryFromService(testimonial.service?.title),
          date: testimonial.createdAt,
          procedure: testimonial.service?.title,
          videoUrl: null,
          beforeAfter: true
        }));
        setApiTestimonials(transformedTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map service titles to treatment categories
  const getCategoryFromService = (serviceTitle?: string): string => {
    if (!serviceTitle) return 'all';
    const title = serviceTitle.toLowerCase();
    if (title.includes('hair') || title.includes('transplant')) return 'hair-transplant';
    if (title.includes('dental') || title.includes('teeth') || title.includes('smile') || title.includes('veneer')) return 'dental';
    if (title.includes('face') || title.includes('botox') || title.includes('facelift') || title.includes('brow')) return 'facial';
    if (title.includes('breast') || title.includes('tummy') || title.includes('bbl') || title.includes('liposuction')) return 'body';
    return 'all';
  };

  const allTestimonials = [...apiTestimonials];

  const filteredTestimonials = allTestimonials.filter((testimonial) => {
    const treatmentMatch = selectedTreatment === 'all' || testimonial.treatment === selectedTreatment;
    const countryMatch = selectedCountry === 'all' || testimonial.country === selectedCountry;
    const videoMatch = !showVideoOnly || testimonial.videoUrl;
    return treatmentMatch && countryMatch && videoMatch;
  });

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === filteredTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section - Consistent with site design */}
      <section className="relative section-padding-mobile overflow-hidden">
        {/* Background Elements - Matching home page pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/3 to-blue-600/5"></div>
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg"
            >
              <span className="text-[10px] sm:text-xs lg:text-sm text-professional-bold text-blue-800 tracking-wide">✨ {t('testimonials.page.patientTestimonials') || 'PATIENT TESTIMONIALS'}</span>
            </motion.div>

            {/* Hero Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-mobile-hero font-serif font-bold tracking-tight leading-[1.1] sm:leading-tight">
                <span className="block text-gray-900">{t('testimonials.page.heroTitle') || 'Real Patient'}</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mt-1 sm:mt-0">
                  {t('testimonials.page.heroSubtitle') || 'Success Stories'}
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-xl leading-relaxed text-gray-600 max-w-xl lg:max-w-3xl mx-auto">
                {t('testimonials.page.heroDescription') || 'Discover the transformative journeys of our patients from around the world. Their stories inspire us every day.'}
              </p>
            </motion.div>

            {/* Trust Stats - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 lg:gap-8 pt-4 sm:pt-6 lg:pt-8"
            >
              {[
                { label: t('testimonials.page.stats.happyPatients') || 'Happy Patients', value: '4,500+' },
                { label: t('testimonials.page.stats.successRate') || 'Success Rate', value: '98.5%' },
                { label: t('testimonials.page.stats.countriesServed') || 'Countries Served', value: '25+' },
                { label: t('testimonials.page.stats.yearsExperience') || 'Years Experience', value: '15+' }
              ].map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 shadow-md mx-2 sm:mx-0">
                  <div className={`w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r ${index % 2 === 0 ? 'from-blue-400 to-purple-500' : 'from-purple-400 to-blue-500'} rounded-full animate-pulse flex-shrink-0`} style={{animationDelay: `${index * 200}ms`}}></div>
                  <div className="text-center">
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs lg:text-sm text-gray-600 whitespace-nowrap">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section - Consistent with site design */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4 lg:mb-6">
              {t('testimonials.page.filters.title') || 'FILTER TESTIMONIALS'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('testimonials.page.filters.description') || 'Find testimonials by treatment type, country, or view video testimonials only.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto mb-8">
            <select
              value={selectedTreatment}
              onChange={(e) => setSelectedTreatment(e.target.value)}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300"
            >
              {filters.treatment.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300"
            >
              {filters.country.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <label className="flex items-center space-x-3 cursor-pointer bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <input
                type="checkbox"
                checked={showVideoOnly}
                onChange={(e) => setShowVideoOnly(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium text-sm sm:text-base">{t('testimonials.page.filters.videoOnly') || 'Video Only'}</span>
            </label>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              {t('testimonials.page.filters.showing') || 'Showing'} <span className="font-medium text-blue-600">{filteredTestimonials.length}</span> {t('testimonials.page.filters.of') || 'of'} <span className="font-medium">{allTestimonials.length}</span> {t('testimonials.page.filters.testimonials') || 'testimonials'}
              {loading && <span className="ml-2 text-blue-600">({t('testimonials.loading') || 'Loading...'})</span>}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Testimonial Carousel - Consistent with site design */}
      {filteredTestimonials.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4 lg:mb-6">
                {t('testimonials.page.featured.title') || 'FEATURED TESTIMONIAL'}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('testimonials.page.featured.subtitle') || 'Hear directly from our patients about their transformation journey.'}
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      {[...Array(filteredTestimonials[currentTestimonial]?.rating || 5)].map((_, i) => (
                        <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
                      ))}
                      <span className="text-gray-500 ml-2">
                        ({filteredTestimonials[currentTestimonial]?.rating || 5}/5)
                      </span>
                    </div>

                    <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                      "{filteredTestimonials[currentTestimonial]?.content}"
                    </blockquote>

                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900 text-lg">
                        {filteredTestimonials[currentTestimonial]?.author}
                      </div>
                      <div className="text-blue-600 font-medium">
                        {filteredTestimonials[currentTestimonial]?.procedure}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {filteredTestimonials[currentTestimonial]?.country}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(filteredTestimonials[currentTestimonial]?.date || '').toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
                      {filteredTestimonials[currentTestimonial]?.videoUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={filteredTestimonials[currentTestimonial]?.image || '/images/testimonials/testimonial-1.svg'}
                            alt={filteredTestimonials[currentTestimonial]?.author || 'Patient'}
                            width={200}
                            height={200}
                            className="rounded-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <PlayIcon className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                              {t('testimonials.page.featured.videoTestimonial')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={filteredTestimonials[currentTestimonial]?.image || '/images/testimonials/testimonial-1.svg'}
                          alt={filteredTestimonials[currentTestimonial]?.author || 'Patient'}
                          width={200}
                          height={200}
                          className="rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors" />
                  </button>

                  <div className="flex space-x-2">
                    {filteredTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8' 
                            : 'bg-gray-300 hover:bg-gray-400 w-3'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Testimonials Grid - Consistent with site design */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4 lg:mb-6">
              {t('testimonials.page.allTestimonials.title') || 'ALL TESTIMONIALS'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {t('testimonials.page.allTestimonials.subtitle') || 'Read all patient experiences and success stories from our clinic.'}
            </p>
          </div>

          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <UserIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-serif font-light text-gray-900 mb-4">{t('testimonials.page.noResults.title') || 'No Testimonials Found'}</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                {t('testimonials.page.noResults.description') || 'Try adjusting your filters to see more testimonials from our satisfied patients.'}
              </p>
              <button
                onClick={() => {
                  setSelectedTreatment('all');
                  setSelectedCountry('all');
                  setShowVideoOnly(false);
                }}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl lg:rounded-2xl text-professional-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('testimonials.page.noResults.clearFilters') || 'Clear All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 lg:p-8 bg-white shadow-professional card-hover"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <Image
                        src={testimonial.image || '/images/testimonials/testimonial-1.svg'}
                        alt={testimonial.author || 'Patient'}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      {testimonial.videoUrl && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <PlayIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-serif font-light text-gray-900 heading-professional">{testimonial.author}</h3>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.procedure}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {testimonial.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">({testimonial.rating}/5)</span>
                  </div>

                  <blockquote className="text-gray-600 text-professional leading-relaxed mb-4 line-clamp-4">
                    "{testimonial.content}"
                  </blockquote>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(testimonial.date || testimonial.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    {testimonial.grafts && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {testimonial.grafts}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Consistent with site design */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Pattern for Better Visual Hierarchy */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/10 max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white drop-shadow-lg mb-4 lg:mb-6">
                {t('testimonials.page.cta.title') || 'READY TO START YOUR'}
                <span className="block">{t('testimonials.page.cta.subtitle') || 'TRANSFORMATION JOURNEY?'}</span>
              </h2>
              <p className="text-lg sm:text-xl leading-relaxed text-gray-100 font-light max-w-3xl mx-auto mb-6 lg:mb-8">
                {t('testimonials.page.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/consultation"
                  className="group relative btn-touch px-6 lg:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl lg:rounded-2xl text-white text-professional-bold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t('testimonials.page.cta.freeConsultation') || 'Free Consultation'}
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="group btn-touch px-6 lg:px-8 py-4 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl lg:rounded-2xl text-gray-700 hover:text-blue-700 text-professional-bold text-base lg:text-lg transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {t('testimonials.page.cta.contactUs') || 'Contact Us'}
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 
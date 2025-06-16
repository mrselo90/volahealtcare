'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, PlayIcon, UserIcon, MapPinIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/lib/i18n/hooks';

const hardcodedTestimonials = [
  {
    id: 1,
    content: 'I traveled from London for my FUE hair transplant at Vola Health Istanbul. The results after 8 months are incredible! Dr. Mehmet and his team were professional, caring, and the clinic exceeded all my expectations.',
    author: 'James Mitchell',
    role: 'FUE Hair Transplant Patient',
    image: '/images/testimonials/testimonial-1.svg',
    rating: 5,
    treatment: 'hair-transplant',
    country: 'United Kingdom',
    date: '2024-01-15',
    procedure: 'FUE Hair Transplant',
    grafts: '3,200 grafts',
    videoUrl: null,
    beforeAfter: true,
  },
  {
    id: 2,
    content: 'My DHI hair transplant experience was life-changing. The precision and attention to detail were remarkable. 6 months later, I have natural-looking, thick hair.',
    author: 'Michael Rodriguez',
    role: 'DHI Hair Transplant Patient',
    image: '/images/testimonials/testimonial-2.svg',
    rating: 5,
    treatment: 'hair-transplant',
    country: 'United States',
    date: '2023-11-20',
    procedure: 'DHI Hair Transplant',
    grafts: '2,800 grafts',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    beforeAfter: true,
  },
  {
    id: 3,
    content: 'I got my Hollywood Smile at Vola Health Istanbul and couldn\'t be happier! The veneers look completely natural and the transformation is amazing.',
    author: 'Sarah Johnson',
    role: 'Hollywood Smile Patient',
    image: '/images/testimonials/testimonial-3.svg',
    rating: 5,
    treatment: 'dental',
    country: 'Canada',
    date: '2024-02-10',
    procedure: 'Hollywood Smile - Porcelain Veneers',
    grafts: '16 veneers',
    videoUrl: null,
    beforeAfter: true,
  },
];

const filters = {
  treatment: [
    { value: 'all', label: 'All Treatments' },
    { value: 'hair-transplant', label: 'Hair Transplant' },
    { value: 'dental', label: 'Dental Aesthetics' },
    { value: 'facial', label: 'Facial Aesthetics' },
    { value: 'body', label: 'Body Aesthetics' },
  ],
  country: [
    { value: 'all', label: 'All Countries' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'UAE', label: 'UAE' },
    { value: 'Spain', label: 'Spain' },
  ],
};

export default function Testimonials() {
  const { t } = useTranslation();
  const [selectedTreatment, setSelectedTreatment] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [showVideoOnly, setShowVideoOnly] = useState(false);
  const [apiTestimonials, setApiTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setApiTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTestimonials = [...hardcodedTestimonials, ...apiTestimonials];

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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-blue-600/10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg"
            >
              <span className="text-sm font-medium text-blue-800">✨ PATIENT TESTIMONIALS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-gray-900 leading-tight">
                Real Stories from
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                  Real Patients
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover authentic experiences from patients around the world who chose Vola Health Istanbul for their transformation journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16"
            >
              {[
                { label: 'Happy Patients', value: '1,500+' },
                { label: 'Success Rate', value: '98.5%' },
                { label: 'Countries Served', value: '85+' },
                { label: 'Years Experience', value: '12+' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
              Filter Testimonials
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find testimonials by treatment type, country, or view video testimonials only.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
            <select
              value={selectedTreatment}
              onChange={(e) => setSelectedTreatment(e.target.value)}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
              className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              {filters.country.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showVideoOnly}
                onChange={(e) => setShowVideoOnly(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Video testimonials only</span>
            </label>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-500">
              Showing {filteredTestimonials.length} of {allTestimonials.length} testimonials
              {loading && <span className="ml-2">(Loading...)</span>}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      {filteredTestimonials.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
                Featured Patient Stories
              </h2>
              <p className="text-gray-600">
                Hear directly from our patients about their transformation journey
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
                              Video Testimonial
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
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                  </button>

                  <div className="flex space-x-2">
                    {filteredTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial 
                            ? 'bg-blue-600 w-8' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
              All Patient Testimonials
            </h2>
            <p className="text-gray-600">
              Browse through all our patient stories and experiences
            </p>
          </div>

          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <UserIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
              <p className="text-gray-500 mb-6">
                No testimonials match your current filters.
              </p>
              <button
                onClick={() => {
                  setSelectedTreatment('all');
                  setSelectedCountry('all');
                  setShowVideoOnly(false);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6 pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                        />
                        {testimonial.videoUrl && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <PlayIcon className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                        <p className="text-sm text-blue-600">{testimonial.procedure}</p>
                        <p className="text-xs text-gray-500">{testimonial.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">({testimonial.rating}/5)</span>
                    </div>

                    <blockquote className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                      "{testimonial.content}"
                    </blockquote>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(testimonial.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}</span>
                      {testimonial.grafts && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {testimonial.grafts}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-white">
              Ready to Start Your
              <span className="block font-medium">Transformation Journey?</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of satisfied patients who chose Vola Health Istanbul for their medical tourism experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 
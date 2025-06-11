'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    content: 'The care and attention I received was exceptional. The results exceeded my expectations!',
    author: 'Sarah Johnson',
    role: 'Dental Veneers Patient',
    image: '/images/testimonial-1.jpg',
    rating: 5,
    treatment: 'dental',
    country: 'United States',
    videoUrl: 'https://www.youtube.com/embed/your-video-id-1',
  },
  {
    id: 2,
    content: 'Professional staff, luxurious facilities, and amazing results. Highly recommended!',
    author: 'Michael Chen',
    role: 'Rhinoplasty Patient',
    image: '/images/testimonial-2.jpg',
    rating: 5,
    treatment: 'facial',
    country: 'Canada',
    videoUrl: 'https://www.youtube.com/embed/your-video-id-2',
  },
  {
    id: 3,
    content: 'From start to finish, my experience was perfect. The results are life-changing!',
    author: 'Emma Garcia',
    role: 'Body Contouring Patient',
    image: '/images/testimonial-3.jpg',
    rating: 5,
    treatment: 'body',
    country: 'Spain',
  },
  {
    id: 4,
    content: 'The team made me feel comfortable throughout the entire process. I love my new smile!',
    author: 'David Wilson',
    role: 'Hollywood Smile Patient',
    image: '/images/testimonial-4.jpg',
    rating: 5,
    treatment: 'dental',
    country: 'United Kingdom',
    videoUrl: 'https://www.youtube.com/embed/your-video-id-3',
  },
  {
    id: 5,
    content: 'Excellent service and results that speak for themselves. Thank you!',
    author: 'Anna Kowalski',
    role: 'Facelift Patient',
    image: '/images/testimonial-5.jpg',
    rating: 5,
    treatment: 'facial',
    country: 'Poland',
  },
  {
    id: 6,
    content: 'The best decision I ever made. The results are natural and beautiful.',
    author: 'Maria Silva',
    role: 'Breast Augmentation Patient',
    image: '/images/testimonial-6.jpg',
    rating: 5,
    treatment: 'body',
    country: 'Brazil',
    videoUrl: 'https://www.youtube.com/embed/your-video-id-4',
  },
];

const filters = {
  treatment: [
    { value: 'all', label: 'All Treatments' },
    { value: 'dental', label: 'Dental Aesthetics' },
    { value: 'facial', label: 'Facial Aesthetics' },
    { value: 'body', label: 'Body Aesthetics' },
  ],
  country: [
    { value: 'all', label: 'All Countries' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Brazil', label: 'Brazil' },
  ],
};

export default function Testimonials() {
  const [selectedTreatment, setSelectedTreatment] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const treatmentMatch = selectedTreatment === 'all' || testimonial.treatment === selectedTreatment;
    const countryMatch = selectedCountry === 'all' || testimonial.country === selectedCountry;
    return treatmentMatch && countryMatch;
  });

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Patient Testimonials
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Read and watch real experiences from our satisfied patients from around the world.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <select
            value={selectedTreatment}
            onChange={(e) => setSelectedTreatment(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
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
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
          >
            {filters.country.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
            >
              {testimonial.videoUrl ? (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={testimonial.videoUrl}
                    title={`Testimonial from ${testimonial.author}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="relative h-48">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-full w-full object-cover"
                    width={400}
                    height={200}
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-lg font-medium text-gray-900">{testimonial.content}</p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={testimonial.image}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <span>{testimonial.role}</span>
                      <span>&middot;</span>
                      <span>{testimonial.country}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 
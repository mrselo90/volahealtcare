'use client';

import { useState, useEffect } from 'react';
import { RiStarLine, RiEditLine, RiDeleteBinLine, RiAddLine } from 'react-icons/ri';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: {
    title: string;
  };
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        return response.json();
      })
      .then((data) => {
        setTestimonials(data);
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <RiStarLine
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="relative space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Testimonials</h1>
        <button className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-lg shadow hover:bg-amber-600 transition-all text-lg font-semibold">
          <RiAddLine className="h-5 w-5" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <RiStarLine className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No testimonials</h3>
          <p className="mt-1 text-sm text-gray-500">No testimonials have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white shadow-lg ring-1 ring-gray-900/5 rounded-2xl p-8 flex flex-col gap-4 hover:shadow-amber-200 transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                <div className="flex gap-2">
                  <button
                    className="text-gray-400 hover:text-amber-500 p-2 rounded-full transition-colors"
                    title="Edit testimonial"
                  >
                    <RiEditLine className="h-5 w-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                    title="Delete testimonial"
                  >
                    <RiDeleteBinLine className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">{testimonial.service.title}</p>
              <div className="mt-2 flex items-center">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {testimonial.rating}/5
                </span>
              </div>
              <p className="mt-4 text-base text-gray-700">{testimonial.comment}</p>
              <div className="mt-4 text-xs text-gray-400">
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
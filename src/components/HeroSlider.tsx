'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  category: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/service-images/Before-After (9).jpg",
    title: "Hair Transplant Excellence",
    subtitle: "Advanced FUE & DHI techniques for natural results",
    category: "Hair Restoration"
  },
  {
    id: 2,
    image: "/service-images/4_edited.jpg",
    title: "Aesthetic Surgery",
    subtitle: "Transform your appearance with expert precision",
    category: "Plastic Surgery"
  },
  {
    id: 3,
    image: "/service-images/DSD-digital-smile-design-in-istanbul-768x429.png",
    title: "Dental Excellence",
    subtitle: "Hollywood smile and comprehensive dental care",
    category: "Dental Services"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center text-white space-y-4 max-w-lg">
                  {/* Category Badge */}
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-sm text-professional-bold tracking-wide">
                      {slide.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight">
                    {slide.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  
                  {/* Learn More Button */}
                  <div className="pt-4">
                    <button className="group px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 hover:border-white/50 rounded-xl text-white text-professional-bold transition-all duration-300 transform hover:scale-105">
                      <span className="flex items-center gap-2">
                        Learn More
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/50 text-white transition-all duration-300 transform hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/50 text-white transition-all duration-300 transform hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>

      {/* Auto-play Toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 text-white transition-all duration-300"
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </div>
  );
} 
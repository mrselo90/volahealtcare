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



  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl">
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
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
              />
              
              {/* Gradient Overlay - Enhanced for mobile readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80 sm:from-black/60 sm:via-black/40 sm:to-black/70"></div>
              
              {/* Content Overlay - Mobile optimized */}
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                <div className="text-center text-white space-y-2 sm:space-y-4 max-w-xs sm:max-w-lg">
                  {/* Category Badge - Mobile responsive */}
                  <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-xs sm:text-sm text-professional-bold tracking-wide">
                      {slide.category}
                    </span>
                  </div>
                  
                  {/* Title - Mobile responsive typography */}
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold leading-tight">
                    {slide.title}
                  </h3>
                  
                  {/* Subtitle - Mobile responsive */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed hidden sm:block">
                    {slide.subtitle}
                  </p>
                  
                  {/* Mobile subtitle - shorter version */}
                  <p className="text-sm text-gray-200 leading-relaxed sm:hidden">
                    {slide.subtitle.split(' ').slice(0, 4).join(' ')}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Mobile optimized */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/50 text-white transition-all duration-300 transform hover:scale-110 group min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/50 text-white transition-all duration-300 transform hover:scale-110 group min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>



      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>

      {/* Auto-play Toggle - Mobile optimized */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 text-white transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </div>
  );
} 
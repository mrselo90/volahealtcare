'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/lib/i18n/hooks';

interface SlideData {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  videoPoster?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  orderIndex: number;
  isActive: boolean;
  translations: Array<{
    id: string;
    language: string;
    title?: string;
    subtitle?: string;
    category?: string;
  }>;
}

export default function HeroSlider() {
  const { t, language } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isSliderVisible, setIsSliderVisible] = useState(false);

  // Client-side hydration protection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch slides from database
  useEffect(() => {
    if (!isClient) return;
    
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched slides:', data);
          
          // Log video URLs for debugging
          data.forEach((slide: any, index: number) => {
            if (slide.mediaType === 'video') {
              console.log(`Video slide ${index}:`, {
                id: slide.id,
                videoUrl: slide.videoUrl,
                imageUrl: slide.imageUrl,
                mediaType: slide.mediaType
              });
            }
          });
          
          setSlides(data);
        } else {
          // Fallback to default slides if API fails
          setSlides([
            {
              id: '1',
              imageUrl: "/service-images/Before-After (9).jpg",
              mediaType: 'image' as const,
              title: t('heroSlider.slides.hair.title'),
              subtitle: t('heroSlider.slides.hair.subtitle'),
              category: t('heroSlider.slides.hair.category'),
              orderIndex: 0,
              isActive: true,
              translations: []
            },
            {
              id: '2',
              imageUrl: "/service-images/4_edited.jpg",
              mediaType: 'image' as const,
              title: t('heroSlider.slides.aesthetic.title'),
              subtitle: t('heroSlider.slides.aesthetic.subtitle'),
              category: t('heroSlider.slides.aesthetic.category'),
              orderIndex: 1,
              isActive: true,
              translations: []
            },
            {
              id: '3',
              imageUrl: "/service-images/DSD-digital-smile-design-in-istanbul-768x429.png",
              mediaType: 'image' as const,
              title: t('heroSlider.slides.dental.title'),
              subtitle: t('heroSlider.slides.dental.subtitle'),
              category: t('heroSlider.slides.dental.category'),
              orderIndex: 2,
              isActive: true,
              translations: []
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        // Fallback to default slides
        setSlides([
          {
            id: '1',
            imageUrl: "/service-images/Before-After (9).jpg",
            mediaType: 'image' as const,
            title: t('heroSlider.slides.hair.title'),
            subtitle: t('heroSlider.slides.hair.subtitle'),
            category: t('heroSlider.slides.hair.category'),
            orderIndex: 0,
            isActive: true,
            translations: []
          },
          {
            id: '2',
            imageUrl: "/service-images/4_edited.jpg",
            mediaType: 'image' as const,
            title: t('heroSlider.slides.aesthetic.title'),
            subtitle: t('heroSlider.slides.aesthetic.subtitle'),
            category: t('heroSlider.slides.aesthetic.category'),
            orderIndex: 1,
            isActive: true,
            translations: []
          },
          {
            id: '3',
            imageUrl: "/service-images/DSD-digital-smile-design-in-istanbul-768x429.png",
            mediaType: 'image' as const,
            title: t('heroSlider.slides.dental.title'),
            subtitle: t('heroSlider.slides.dental.subtitle'),
            category: t('heroSlider.slides.dental.category'),
            orderIndex: 2,
            isActive: true,
            translations: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [t, isClient]);

  // Helper function to get localized content
  const getLocalizedContent = useCallback((slide: SlideData, field: 'title' | 'subtitle' | 'category') => {
    const translation = slide.translations.find(t => t.language === language);
    if (translation && translation[field]) {
      return translation[field];
    }
    return slide[field] || ''; // Fallback to default or empty string
  }, [language]);

  // Toggle sound for all videos
  const toggleSound = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      // Apply to all video elements
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          video.muted = newMuted;
        }
      });
      return newMuted;
    });
  }, []);

  // Auto-play videos when they become active
  useEffect(() => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData?.mediaType === 'video') {
      const video = videoRefs.current[currentSlideData.id];
      if (video) {
        video.muted = isMuted;
        video.play().catch(error => {
          console.log('Video autoplay failed:', error);
        });
      }
    }
  }, [currentSlide, slides, isMuted]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 6000); // Change slide every 6 seconds

      return () => {
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
        }
      };
    }
  }, [isAutoPlaying, slides.length]);

  // Intersection Observer for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSliderVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsAutoPlaying(false);
        } else {
          setIsAutoPlaying(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!isClient || loading) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="relative w-full h-full">
              {slide.mediaType === 'video' && slide.videoUrl ? (
                <div className="relative w-full h-full">
                  <video
                    ref={(el) => {
                      videoRefs.current[slide.id] = el;
                    }}
                    className="w-full h-full object-cover"
                    poster={slide.videoPoster || slide.imageUrl}
                    data-slide-id={slide.id}
                    data-video-url={slide.videoUrl}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onError={(e) => {
                      console.error('Video error for slide:', slide.id, e);
                    }}
                  >
                    <source src={slide.videoUrl} type="video/mp4" />
                    <source src={slide.videoUrl} type="video/webm" />
                    <source src={slide.videoUrl} type="video/quicktime" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : slide.imageUrl && slide.imageUrl.trim() !== '' ? (
                <Image
                  src={slide.imageUrl}
                  alt={getLocalizedContent(slide, 'title') || 'Slide image'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    console.error('Image error for slide:', slide.id, slide.imageUrl);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              
              {/* Fallback image for videos that fail to load */}
              {slide.mediaType === 'video' && slide.videoUrl && slide.imageUrl && slide.imageUrl.trim() !== '' && (
                <Image
                  src={slide.imageUrl}
                  alt={getLocalizedContent(slide, 'title') || 'Video poster'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                  style={{ display: 'none' }}
                  onError={() => {
                    // If video fails, show this image
                    const img = document.querySelector(`[data-slide-id="${slide.id}"] img`) as HTMLImageElement;
                    if (img) img.style.display = 'block';
                  }}
                />
              )}
              
              {/* Gradient Overlay - Enhanced for mobile readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80 sm:from-black/60 sm:via-black/40 sm:to-black/70"></div>
              
              {/* Content Overlay - Mobile optimized */}
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                <div className="text-center text-white space-y-2 sm:space-y-4 max-w-xs sm:max-w-lg">
                  {/* Category Badge - Mobile responsive */}
                  {getLocalizedContent(slide, 'category') && (
                    <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <span className="text-xs sm:text-sm font-semibold tracking-wide">
                        {getLocalizedContent(slide, 'category')}
                      </span>
                    </div>
                  )}
                  
                  {/* Title - Mobile responsive typography */}
                  {getLocalizedContent(slide, 'title') && (
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold leading-tight">
                      {getLocalizedContent(slide, 'title')}
                    </h3>
                  )}
                  
                  {/* Subtitle - Mobile responsive */}
                  {getLocalizedContent(slide, 'subtitle') && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed hidden sm:block">
                      {getLocalizedContent(slide, 'subtitle')}
                    </p>
                  )}
                  
                  {/* Mobile subtitle - shorter version */}
                  {getLocalizedContent(slide, 'subtitle') && (
                    <p className="text-sm text-gray-200 leading-relaxed sm:hidden">
                      {getLocalizedContent(slide, 'subtitle').split(' ').slice(0, 4).join(' ')}...
                    </p>
                  )}
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
        aria-label={t('heroSlider.navigation.previous')}
      >
        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full border border-white/30 hover:border-white/50 text-white transition-all duration-300 transform hover:scale-110 group min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label={t('heroSlider.navigation.next')}
      >
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators - Hidden on mobile */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 gap-2 hidden sm:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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

      {/* Sound Control Button - Top Right */}
      {slides.some(slide => slide.mediaType === 'video') && (
        <button
          onClick={toggleSound}
          className="absolute top-4 right-4 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all duration-300 transform hover:scale-110 z-20"
          aria-label={isMuted ? 'Unmute videos' : 'Mute videos'}
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="w-5 h-5" />
          ) : (
            <SpeakerWaveIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
} 
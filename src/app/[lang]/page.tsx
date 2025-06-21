'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/hooks';
import dynamic from 'next/dynamic';

interface SocialMediaUrls {
  social_instagram: string;
  social_facebook: string;
  social_trustpilot: string;
  social_googlemaps: string;
  social_linkedin: string;
  social_youtube: string;
  social_pinterest: string;
  social_twitter: string;
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  country: string;
}

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'placeholder';
  mediaAlt?: string;
  isActive: boolean;
  orderIndex: number;
}

const Chatbot = dynamic(() => import('@/components/ui/Chatbot'), { 
  ssr: false, 
  loading: () => null
});
const HeroSlider = dynamic(() => import('@/components/HeroSlider'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-full flex items-center justify-center">Loading gallery...</div> 
});
const FeaturedBeforeAfter = dynamic(() => import('@/components/FeaturedBeforeAfter'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-64 flex items-center justify-center">Loading results...</div> 
});

export default function Home({ params }: { params: { lang: string } }) {
  const { lang } = params;
  
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [socialUrls, setSocialUrls] = useState<SocialMediaUrls>({
    social_instagram: '',
    social_facebook: '',
    social_trustpilot: '',
    social_googlemaps: '',
    social_linkedin: '',
    social_youtube: '',
    social_pinterest: '',
    social_twitter: ''
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    let isCancelled = false;
    
    const loadData = async () => {
      if (isCancelled) return;
      
      setIsLoading(true);
      
      try {
        // Use Promise.allSettled to ensure all requests complete, even if some fail
        const results = await Promise.allSettled([
          fetchSocialUrls(isCancelled), 
          fetchTestimonials(isCancelled), 
          fetchContentBlocks(isCancelled)
        ]);
        
        // Check if any requests failed and log them
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`API request ${index} failed:`, result.reason);
          }
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // Always set loading to false
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };
    
    // Add a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      if (!isCancelled) {
        loadData();
      }
    }, 100);
    
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isClient]);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (!isClient || !isMounted || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      if (isMounted) {
        setCurrentTestimonial((prev) => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, isClient, isMounted]);

  // Auto-rotate media content every 6 seconds
  useEffect(() => {
    if (!isClient || !isMounted) return;
    
    const mediaBlocks = getMediaContentBlocks();
    if (mediaBlocks.length > 1) {
      const interval = setInterval(() => {
        if (isMounted) {
          setCurrentMediaIndex((prev) => 
            prev === mediaBlocks.length - 1 ? 0 : prev + 1
          );
        }
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [contentBlocks, isClient, isMounted]);

  const fetchTestimonials = async (isCancelled?: boolean) => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok && !isCancelled) {
        const data = await response.json();
        const homeTestimonials = data.slice(0, 3);
        setTestimonials(homeTestimonials);
      }
    } catch (error) {
      if (!isCancelled) {
        console.error('Error fetching testimonials:', error);
        // Set empty array as fallback
        setTestimonials([]);
      }
    }
  };

  const fetchSocialUrls = async (isCancelled?: boolean) => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok && !isCancelled) {
        const data = await response.json();
        setSocialUrls({
          social_instagram: data.socialMedia?.instagram || '',
          social_facebook: data.socialMedia?.facebook || '',
          social_trustpilot: data.socialMedia?.trustpilot || '',
          social_googlemaps: data.socialMedia?.googlemaps || '',
          social_linkedin: data.socialMedia?.linkedin || '',
          social_youtube: data.socialMedia?.youtube || '',
          social_pinterest: data.socialMedia?.pinterest || '',
          social_twitter: data.socialMedia?.twitter || '',
        });
      }
    } catch (error) {
      if (!isCancelled) {
        console.error('Error fetching social media URLs:', error);
        // Keep default empty values as fallback
      }
    }
  };

  const fetchContentBlocks = async (isCancelled?: boolean) => {
    try {
      const response = await fetch('/api/content-blocks');
      if (response.ok && !isCancelled) {
        const data = await response.json();
        setContentBlocks(data);
      }
    } catch (error) {
      if (!isCancelled) {
        console.error('Error fetching content blocks:', error);
        // Set empty array as fallback
        setContentBlocks([]);
      }
    }
  };

  const getContentBlock = (key: string) => {
    const block = contentBlocks.find(block => block.key === key && block.isActive);
    return block;
  };

  const getMediaContentBlocks = () => {
    return contentBlocks.filter(block => 
      block.isActive && 
      block.mediaUrl && 
      (block.mediaType === 'image' || block.mediaType === 'video')
    ).sort((a, b) => a.orderIndex - b.orderIndex);
  };

  // Touch gesture handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    const mediaBlocks = getMediaContentBlocks();

    if (isLeftSwipe && mediaBlocks.length > 1) {
      setCurrentMediaIndex(prev => 
        prev === mediaBlocks.length - 1 ? 0 : prev + 1
      );
    }
    if (isRightSwipe && mediaBlocks.length > 1) {
      setCurrentMediaIndex(prev => 
        prev === 0 ? mediaBlocks.length - 1 : prev - 1
      );
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'pinterest':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.333 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.079-1.044 2.431-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624-.001 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        );
      case 'trustpilot':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0L9.3 8.7H0l7.5 5.4L4.8 24L12 18.6L19.2 24l-2.7-9.9L24 8.7h-9.3L12 0z"/>
          </svg>
        );
      case 'googlemaps':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const socialPlatforms = [
    { key: 'social_instagram', platform: 'instagram' },
    { key: 'social_facebook', platform: 'facebook' },
    { key: 'social_trustpilot', platform: 'trustpilot' },
    { key: 'social_googlemaps', platform: 'googlemaps' },
    { key: 'social_twitter', platform: 'twitter' },
    { key: 'social_linkedin', platform: 'linkedin' },
    { key: 'social_youtube', platform: 'youtube' },
    { key: 'social_pinterest', platform: 'pinterest' }
  ];

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-center">
            <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Floating Social Media Sidebar - Mobile & Desktop Optimized */}
      {isClient && (
        <div className="fixed right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-2 sm:space-y-3">
          <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg border border-gray-200/50">
            {socialUrls.social_instagram && (
              <a 
                href={socialUrls.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 mb-1.5 sm:mb-2 touch-manipulation"
                title="Follow us on Instagram"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('instagram')}
                </div>
              </a>
            )}
            {socialUrls.social_facebook && (
              <a 
                href={socialUrls.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 mb-1.5 sm:mb-2 touch-manipulation"
                title="Follow us on Facebook"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('facebook')}
                </div>
              </a>
            )}
            {socialUrls.social_trustpilot && (
              <a 
                href={socialUrls.social_trustpilot}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-green-50 to-lime-50 hover:from-green-100 hover:to-lime-100 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 mb-1.5 sm:mb-2 touch-manipulation"
                title="Read our Trustpilot reviews"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('trustpilot')}
                </div>
              </a>
            )}
            {socialUrls.social_googlemaps && (
              <a 
                href={socialUrls.social_googlemaps}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-yellow-50 to-red-50 hover:from-yellow-100 hover:to-red-100 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 mb-1.5 sm:mb-2 touch-manipulation"
                title="Find us on Google Maps"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('googlemaps')}
                </div>
              </a>
            )}
            {socialUrls.social_linkedin && (
              <a 
                href={socialUrls.social_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 mb-1.5 sm:mb-2 touch-manipulation"
                title="Connect on LinkedIn"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('linkedin')}
                </div>
              </a>
            )}
            {socialUrls.social_youtube && (
              <a 
                href={socialUrls.social_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 touch-manipulation"
                title="Subscribe to our YouTube"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('youtube')}
                </div>
              </a>
            )}
            {socialUrls.social_twitter && (
              <a 
                href={socialUrls.social_twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-50 to-gray-200 hover:from-gray-100 hover:to-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 touch-manipulation"
                title="Follow us on Twitter"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {getSocialIcon('twitter')}
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-blue-600/10"></div>
          
          {/* Animated Background Shapes - Optimized for mobile */}
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-500"></div>
          
          {/* Optional Background Image with Overlay - Hidden on small mobile */}
          <div className="absolute inset-0 opacity-20 sm:opacity-30 hidden sm:block">
            <Image
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Professional medical facility"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/70"></div>
          </div>
        </div>
          
        {/* Content - Mobile-first approach */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-20 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-10 order-2 lg:order-1">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="inline-block px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg">
                  <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-blue-800 tracking-wide">✨ {t('home.premiumBadge') || 'PREMIUM HEALTH CARE'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold tracking-tight leading-[1.1] sm:leading-tight">
                  <span className="block text-gray-900">{t('home.hero.title') || 'Transform Your Life'}</span>
                </h1>
              </div>
              
              <p className="text-sm sm:text-base lg:text-xl leading-relaxed text-gray-600 max-w-xl lg:max-w-2xl mx-auto lg:mx-0">
                {t('home.hero.subtitle') || 'Experience world-class healthcare with our expert team and luxury accommodations in beautiful Istanbul.'}
              </p>

              {/* CTA Buttons - Mobile optimized */}
              <div className="flex flex-col gap-3 sm:gap-4 justify-center lg:justify-start pt-4 lg:pt-6">
                <Link
                  href={`/${lang}/consultation`}
                  className="group relative touch-manipulation px-6 lg:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl lg:rounded-2xl text-white font-bold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t('nav.consultation') || 'Free Consultation'}
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href={`/${lang}/gallery`}
                  className="group touch-manipulation px-6 lg:px-8 py-4 bg-white/80 hover:bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl lg:rounded-2xl text-gray-700 hover:text-blue-700 font-bold text-base lg:text-lg transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('nav.gallery') || 'View Results'}
                  </span>
                </Link>
              </div>

              {/* Trust Indicators - Web side by side, mobile stacked */}
              <div className="flex flex-col md:flex-row justify-center lg:justify-start gap-2 md:gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8">
                <div className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 shadow-md mx-2 md:mx-0">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-xs lg:text-sm font-bold text-gray-700 whitespace-nowrap">{t('home.hero.trustIndicators.successfulCases') || '4500+ Successful Cases'}</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 shadow-md mx-2 md:mx-0">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse delay-200 flex-shrink-0"></div>
                  <span className="text-xs lg:text-sm font-bold text-gray-700 whitespace-nowrap">{t('home.hero.trustIndicators.satisfactionRate') || '98% Satisfaction Rate'}</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 bg-white/60 backdrop-blur-sm rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 shadow-md mx-2 md:mx-0">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-pulse delay-400 flex-shrink-0"></div>
                  <span className="text-xs lg:text-sm font-bold text-gray-700 whitespace-nowrap">{t('home.hero.trustIndicators.yearsExperience') || '15+ Years Experience'}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Slider - Mobile optimized height */}
            <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] order-1 lg:order-2">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 lg:mb-8">{t('home.excellenceTitle') || 'EXCELLENCE IN MEDICAL TOURISM'}</h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 lg:mb-12">
              {t('home.excellenceDesc') || 'Vola Health Istanbul has established itself as a premier destination for medical tourism, combining world-class expertise with cutting-edge technology. Our comprehensive approach covers dental treatments, hair transplant procedures, and plastic surgery, delivering exceptional results in the beautiful city of Istanbul.'}
            </p>
            <Link 
              href={`/${lang}/about`} 
              className="inline-block border-b-2 border-black pb-1 text-base lg:text-lg font-medium hover:opacity-80 transition-opacity"
            >
              {t('home.discoverClinic') || 'DISCOVER OUR CLINIC'}
            </Link>
          </div>
        </div>
      </section>

      {/* Before & After Gallery - REAL PATIENT TRANSFORMATIONS */}
      <FeaturedBeforeAfter limit={6} />

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">{t('home.ourServicesTitle') || 'OUR SERVICES'}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: t('home.dentalTitle') || 'DENTAL TREATMENTS',
                description: t('home.dentalDesc') || 'Transform your smile with advanced dental procedures including veneers, implants, and Hollywood smile treatments.',
                count: t('home.dentalCount') || '8 Services',
                href: '/services'
              },
              {
                title: t('home.hairTitle') || 'HAIR TRANSPLANT',
                description: t('home.hairDesc') || 'Restore your natural hairline with cutting-edge FUE, DHI, and Sapphire techniques for permanent results.',
                count: t('home.hairCount') || '9 Services',
                href: '/services'
              },
              {
                title: t('home.plasticTitle') || 'PLASTIC SURGERY',
                description: t('home.plasticDesc') || 'Enhance your natural beauty with rhinoplasty, facelifts, and comprehensive facial aesthetic procedures.',
                count: t('home.plasticCount') || '21 Services',
                href: '/services'
              }
            ].map((service, index) => (
              <div key={index} className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <h3 className="text-2xl font-serif font-light mb-4 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                <p className="text-sm font-medium text-blue-600 mb-6">{service.count}</p>
                <Link href={service.href} className="text-sm font-medium hover:underline transition-colors duration-300">{t('buttons.viewAllServices')}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Approach */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Pattern for Better Visual Hierarchy */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-center mb-8 lg:mb-16 text-white drop-shadow-lg">{t('home.volaExperience') || 'THE VOLA HEALTH EXPERIENCE'}</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              {/* Enhanced readability with better spacing and contrast */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <p className="text-lg sm:text-xl leading-relaxed text-gray-100 font-light">
                  {t('home.experienceDesc1') || 'At Vola Health Istanbul, we combine cutting-edge medical technology with personalized patient care to deliver exceptional results in medical tourism.'}
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <p className="text-lg sm:text-xl leading-relaxed text-gray-100 font-light">
                  {t('home.experienceDesc2') || 'Our comprehensive approach includes pre-treatment consultation, world-class procedures, and dedicated aftercare support to ensure your complete satisfaction and safety.'}
                </p>
              </div>
              
              <div className="pt-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span>{t('home.learnProcess') || 'LEARN OUR PROCESS'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              {(() => {
                const mediaBlocks = getMediaContentBlocks();
                
                if (mediaBlocks.length > 0) {
                  const currentMedia = mediaBlocks[currentMediaIndex];
                  
                  return (
                    <div className="relative group">
                      {/* Media Display */}
                      <div 
                        className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-br from-gray-900 to-black cursor-pointer select-none"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {currentMedia.mediaType === 'image' ? (
                          <Image
                            src={currentMedia.mediaUrl!}
                            alt={currentMedia.mediaAlt || currentMedia.title}
                            fill
                            className="object-cover transition-all duration-500"
                          />
                        ) : (
                          <video
                            src={currentMedia.mediaUrl!}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            poster={currentMedia.mediaAlt}
                            key={currentMedia.id}
                            preload="metadata"
                          />
                        )}

                        {/* Sound Control for Videos */}
                        {currentMedia.mediaType === 'video' && (
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
                            aria-label={isMuted ? 'Sesi aç' : 'Sesi kapat'}
                          >
                            {isMuted ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Enhanced Navigation Arrows */}
                      {mediaBlocks.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentMediaIndex(prev => 
                              prev === 0 ? mediaBlocks.length - 1 : prev - 1
                            )}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
                            aria-label="Previous media"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setCurrentMediaIndex(prev => 
                              prev === mediaBlocks.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
                            aria-label="Next media"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Enhanced Dot Indicators */}
                      {mediaBlocks.length > 1 && (
                        <div className="flex justify-center mt-6 space-x-3">
                          {mediaBlocks.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentMediaIndex(index)}
                              className={`transition-all duration-300 rounded-full ${
                                index === currentMediaIndex 
                                  ? 'w-8 h-3 bg-white shadow-lg' 
                                  : 'w-3 h-3 bg-white/40 hover:bg-white/60 hover:scale-125'
                              }`}
                              aria-label={`Go to media ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Thumbnail Preview Strip (for multiple videos) */}
                      {mediaBlocks.length > 2 && (
                        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                          {mediaBlocks.map((media, index) => (
                            <button
                              key={media.id}
                              onClick={() => setCurrentMediaIndex(index)}
                              className={`flex-shrink-0 relative w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                index === currentMediaIndex
                                  ? 'border-white shadow-lg scale-105'
                                  : 'border-white/30 hover:border-white/60 hover:scale-105'
                              }`}
                            >
                              {media.mediaType === 'image' ? (
                                <Image
                                  src={media.mediaUrl!}
                                  alt={media.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              )}
                              {index === currentMediaIndex && (
                                <div className="absolute inset-0 bg-white/20"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Fallback to single experience_media block or placeholder
                  const experienceMedia = getContentBlock('experience_media');
                  
                  if (experienceMedia?.mediaUrl && experienceMedia.mediaType === 'image') {
                    return (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                        <Image
                          src={experienceMedia.mediaUrl}
                          alt={experienceMedia.mediaAlt || experienceMedia.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  } else if (experienceMedia?.mediaUrl && experienceMedia.mediaType === 'video') {
                    return (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                        <video
                          src={experienceMedia.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                          poster={experienceMedia.mediaAlt}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 aspect-video flex items-center justify-center rounded-2xl border border-white/20 shadow-2xl">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {experienceMedia?.title || '[Video/Image Placeholder]'}
                          </span>
                        </div>
                      </div>
                    );
                  }
                }
              })()}
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">{t('home.testimonialsTitle') || 'PATIENT TESTIMONIALS'}</h2>
          
          <div className="bg-gray-50 p-6 sm:p-8 lg:p-12 text-center rounded-lg">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-6 lg:mb-8 font-serif">"</div>
            
            {testimonials.length > 0 ? (
              <>
                <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6 lg:mb-8 italic font-serif">
                  {testimonials[currentTestimonial]?.content}
                </p>
                <p className="font-medium">
                  {testimonials[currentTestimonial]?.author}
                </p>
                <p className="text-gray-600">{testimonials[currentTestimonial]?.country}</p>
                
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6 lg:mb-8 italic font-serif">
                  My experience at Vola Health Istanbul was exceptional. The quality of care, professionalism, and results exceeded all my expectations. I felt safe and well-cared for throughout my entire medical tourism journey.
                </p>
                <p className="font-medium">Emma Thompson</p>
                <p className="text-gray-600">London, UK</p>
                
                <div className="flex justify-center mt-8 space-x-2">
                  {[1, 2, 3].map((dot) => (
                    <button 
                      key={dot} 
                      className={`w-3 h-3 rounded-full ${dot === 1 ? 'bg-black' : 'bg-gray-300'}`}
                      aria-label={`Testimonial ${dot}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* View All Testimonials Link */}
          <div className="text-center mt-8">
            <Link 
              href="/testimonials" 
              className="inline-block border-b-2 border-blue-600 pb-1 text-base lg:text-lg text-blue-600 hover:opacity-80 transition-opacity"
            >
              {t('home.viewAllTestimonials') || 'VIEW ALL TESTIMONIALS'}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 text-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">{t('home.contactTitle') || 'CONTACT US'}</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-2xl font-serif font-light mb-6">{t('home.contactClinic') || 'VOLA HEALTH ISTANBUL'}</h3>
              <p className="mb-6 leading-relaxed">
                <strong>{t('home.contactAddress') || 'Address:'}</strong> Veliefendi, Prof. Dr. Turan Güneş Cd. No:103 Zeytinburnu/Istanbul
              </p>
              <p className="mb-6 leading-relaxed">
                <strong>{t('home.contactPhone') || 'Phone:'}</strong> +90 544 474 98 81<br />
                <strong>{t('home.contactEmail') || 'Email:'}</strong> info@volahealthistanbul.com
              </p>
              <p className="leading-relaxed">
                <strong>{t('home.contactHours') || 'Hours:'}</strong><br />
                {t('home.contactSchedule.weekdays') || 'Monday - Friday'}: 9:00 AM - 7:00 PM<br />
                {t('home.contactSchedule.saturday') || 'Saturday'}: 10:00 AM - 5:00 PM
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-serif font-light mb-6">{t('home.contactForm.title') || 'SEND US A MESSAGE'}</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder={t('home.contactForm.namePlaceholder') || 'Your Name'} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder={t('home.contactForm.emailPlaceholder') || 'Your Email'} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea 
                    rows={5}
                    placeholder={t('home.contactForm.messagePlaceholder') || 'Your Message'} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg rounded-lg"
                >
                  {t('home.contactForm.sendButton') || 'SEND MESSAGE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot - Fixed position */}
      <Chatbot />

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
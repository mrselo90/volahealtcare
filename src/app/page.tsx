'use client';

import Image from 'next/image';
import Link from 'next/link';
import FeaturedBeforeAfter from '@/components/FeaturedBeforeAfter';
import MobileMenu from '@/components/MobileMenu';
import { useState, useEffect } from 'react';

interface SocialMediaUrls {
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
  social_youtube: string;
  social_pinterest: string;
  social_twitter: string;
}

export default function Home() {
  const [socialUrls, setSocialUrls] = useState<SocialMediaUrls>({
    social_instagram: '',
    social_facebook: '',
    social_linkedin: '',
    social_youtube: '',
    social_pinterest: '',
    social_twitter: ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSocialUrls();
  }, []);

  const fetchSocialUrls = async () => {
    try {
      const response = await fetch('/api/social-media');
      if (response.ok) {
        const data = await response.json();
        setSocialUrls(data);
      }
    } catch (error) {
      console.error('Error fetching social media URLs:', error);
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
      default:
        return null;
    }
  };

  const socialPlatforms = [
    { key: 'social_instagram', platform: 'instagram' },
    { key: 'social_facebook', platform: 'facebook' },
    { key: 'social_twitter', platform: 'twitter' },
    { key: 'social_linkedin', platform: 'linkedin' },
    { key: 'social_youtube', platform: 'youtube' },
    { key: 'social_pinterest', platform: 'pinterest' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/20">
        <div className="flex justify-between items-center px-4 py-3">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">ACI</span>
            </div>
            <span className="ml-2 text-sm font-medium">AESTHETIC CARE</span>
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2"
          >
            <div className="flex flex-col space-y-1">
              <div className="w-5 h-px bg-white"></div>
              <div className="w-5 h-px bg-white"></div>
              <div className="w-5 h-px bg-white"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Left Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-20 bg-white/10 backdrop-blur-sm border-r border-white/20 flex-col items-center justify-between py-8 z-50">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">ACI</span>
            </div>
          </Link>
          
          {/* Menu Button */}
          <button className="text-white text-xs font-light mb-2 tracking-widest">MENU</button>
          <div className="flex flex-col space-y-1">
            <div className="w-6 h-px bg-white"></div>
            <div className="w-6 h-px bg-white"></div>
            <div className="w-6 h-px bg-white"></div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-col space-y-4">
          {socialPlatforms.map((social) => {
            const url = socialUrls[social.key as keyof SocialMediaUrls];
            return url ? (
              <a 
                key={social.key}
                href={url} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {getSocialIcon(social.platform)}
              </a>
            ) : null;
          })}
          
          {/* Default functional social icons */}
          {socialPlatforms.every(s => !socialUrls[s.key as keyof SocialMediaUrls]) && (
            <>
              <a 
                href="https://instagram.com/aestheticcareistanbul" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Follow us on Instagram"
              >
                {getSocialIcon('instagram')}
              </a>
              <a 
                href="https://facebook.com/aestheticcareistanbul" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Follow us on Facebook"
              >
                {getSocialIcon('facebook')}
              </a>
              <a 
                href="https://linkedin.com/company/aesthetic-care-istanbul" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Connect on LinkedIn"
              >
                {getSocialIcon('linkedin')}
              </a>
              <a 
                href="https://youtube.com/@aestheticcareistanbul" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Subscribe to our YouTube"
              >
                {getSocialIcon('youtube')}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-20">
        {/* Desktop Top Header */}
        <header className="hidden lg:block fixed top-0 right-0 left-20 z-40 bg-black/80 backdrop-blur-sm border-b border-white/10">
          <div className="flex justify-between items-center px-8 py-4">
            {/* Logo Text */}
            <div>
              <h1 className="text-xl font-light tracking-widest">AESTHETIC CARE ISTANBUL</h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Link
                href="/consultation"
                className="px-6 py-2 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
              >
                FREE CONSULTATION →
              </Link>
              <Link
                href="/services"
                className="px-6 py-2 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
              >
                VIEW SERVICES →
              </Link>
              <a
                href="tel:+905551234567"
                className="px-6 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center"
              >
                📞 +90 555 123 45 67
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-0">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <Image
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Professional dental practice"
              fill
              className="object-cover opacity-90"
              priority
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-4 lg:mb-6 leading-tight">
                  Premium Medical Tourism
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold mb-6 lg:mb-8 leading-tight">
                  In Istanbul
                </h3>
                
                <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                  Experience world-class <strong>aesthetic procedures</strong> with expert care in the heart of Istanbul. From dental aesthetics to facial and body procedures, we offer comprehensive medical tourism services with <strong>premium quality at affordable prices</strong>.
                </p>

                {/* Mobile CTA Buttons */}
                <div className="lg:hidden flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link
                    href="/consultation"
                    className="px-6 py-3 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition-colors text-center"
                  >
                    FREE CONSULTATION →
                  </Link>
                  <Link
                    href="/services"
                    className="px-6 py-3 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors text-center"
                  >
                    VIEW SERVICES →
                  </Link>
                </div>
              </div>

              {/* Right Side - Additional Content */}
              <div className="text-center lg:text-right space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 lg:space-y-4">
                  <div className="border-t border-white/30 pt-4">
                    <p className="text-xs sm:text-sm font-medium tracking-widest">EXPERT</p>
                    <p className="text-xs sm:text-sm font-medium tracking-widest">SURGEONS</p>
                  </div>
                  <div className="border-t border-white/30 pt-4">
                    <p className="text-xs sm:text-sm font-medium tracking-widest">ISTANBUL,</p>
                    <p className="text-xs sm:text-sm font-medium tracking-widest">TURKEY</p>
                    <p className="text-xs sm:text-sm font-medium tracking-widest">MEDICAL TOURISM</p>
                  </div>
                  <div className="border-t border-white/30 pt-4">
                    <p className="text-xs sm:text-sm font-medium tracking-widest">DENTAL • FACIAL</p>
                    <p className="text-xs sm:text-sm font-medium tracking-widest">BODY AESTHETICS</p>
                    <p className="text-xs sm:text-sm font-medium tracking-widest">31 SERVICES</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-6 lg:mb-8">EXCELLENCE IN MEDICAL TOURISM</h2>
              <p className="text-lg sm:text-xl leading-relaxed mb-8 lg:mb-12 max-w-4xl mx-auto">
                Aesthetic Care Istanbul has established itself as a premier destination for medical tourism, combining world-class expertise with cutting-edge technology. Our comprehensive approach covers dental, facial, and body aesthetics, delivering exceptional results in the beautiful city of Istanbul.
              </p>
              <Link 
                href="/about" 
                className="inline-block border-b-2 border-black pb-1 text-base lg:text-lg font-medium hover:opacity-80 transition-opacity"
              >
                DISCOVER OUR CLINIC
              </Link>
            </div>
          </div>
        </section>

        {/* Before & After Gallery - REAL PATIENT TRANSFORMATIONS */}
        <FeaturedBeforeAfter limit={6} />

        {/* Services Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">OUR SERVICES</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: 'DENTAL AESTHETICS',
                  description: 'Transform your smile with advanced dental procedures including veneers, implants, and Hollywood smile treatments.',
                  count: '10 Services'
                },
                {
                  title: 'FACIAL PROCEDURES',
                  description: 'Enhance your natural beauty with rhinoplasty, facelifts, and non-invasive treatments.',
                  count: '11 Services'
                },
                {
                  title: 'BODY CONTOURING',
                  description: 'Achieve your ideal body shape with our comprehensive body aesthetic procedures.',
                  count: '10 Services'
                }
              ].map((service, index) => (
                <div key={index} className="p-8 bg-white shadow-professional card-hover">
                  <h3 className="text-2xl font-serif font-light mb-4 heading-professional">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-professional">{service.description}</p>
                  <p className="text-sm font-medium text-yellow-600 mb-6">{service.count}</p>
                  <Link href="/services" className="text-sm font-medium hover:underline transition-colors duration-300">VIEW ALL SERVICES</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Approach */}
        <section className="py-12 sm:py-16 lg:py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">THE AESTHETIC CARE EXPERIENCE</h2>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-lg sm:text-xl leading-relaxed mb-6 lg:mb-8">
                  At Aesthetic Care Istanbul, we combine cutting-edge medical technology with personalized patient care to deliver exceptional results in medical tourism.
                </p>
                <p className="text-lg sm:text-xl leading-relaxed mb-6 lg:mb-8">
                  Our comprehensive approach includes pre-treatment consultation, world-class procedures, and dedicated aftercare support to ensure your complete satisfaction and safety.
                </p>
                <Link 
                  href="/about" 
                  className="inline-block border-b-2 border-white pb-1 text-base lg:text-lg font-medium hover:opacity-80 transition-opacity"
                >
                  LEARN ABOUT OUR PROCESS
                </Link>
              </div>
              <div className="order-1 lg:order-2 bg-gray-900 aspect-video flex items-center justify-center rounded-lg">
                <span className="text-gray-600">[Video/Image Placeholder]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">PATIENT TESTIMONIALS</h2>
            
            <div className="bg-gray-50 p-6 sm:p-8 lg:p-12 text-center rounded-lg">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-6 lg:mb-8 font-serif">"</div>
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6 lg:mb-8 italic font-serif">
                My experience at Aesthetic Care Istanbul was exceptional. The quality of care, professionalism, and results exceeded all my expectations. I felt safe and well-cared for throughout my entire medical tourism journey.
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
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center mb-8 lg:mb-16">CONTACT US</h2>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h3 className="text-2xl font-serif font-light mb-6">ISTANBUL CLINIC</h3>
                <p className="mb-6 leading-relaxed">
                  Beşiktaş, Barbaros Bulvarı<br />
                  İstanbul, Turkey 34353
                </p>
                <p className="mb-6 leading-relaxed">
                  <strong>Phone:</strong> +90 555 123 45 67<br />
                  <strong>Email:</strong> info@aestheticcareistanbul.com
                </p>
                <p className="leading-relaxed">
                  <strong>Hours:</strong><br />
                  Monday - Friday: 9:00 AM - 7:00 PM<br />
                  Saturday: 10:00 AM - 5:00 PM
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-light mb-6">SEND US A MESSAGE</h3>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border border-gray-300 form-input focus:outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 border border-gray-300 form-input focus:outline-none"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows={5}
                      placeholder="Your Message" 
                      className="w-full px-4 py-3 border border-gray-300 form-input focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors btn-professional"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-8 lg:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Social Media Icons */}
            <div className="lg:hidden flex justify-center space-x-4 mb-6">
              {socialPlatforms.map((social) => {
                const url = socialUrls[social.key as keyof SocialMediaUrls];
                return url ? (
                  <a 
                    key={social.key}
                    href={url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ) : null;
              })}
              
              {/* Default functional social icons for mobile */}
              {socialPlatforms.every(s => !socialUrls[s.key as keyof SocialMediaUrls]) && (
                <>
                  <a 
                    href="https://instagram.com/aestheticcareistanbul" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Follow us on Instagram"
                  >
                    {getSocialIcon('instagram')}
                  </a>
                  <a 
                    href="https://facebook.com/aestheticcareistanbul" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Follow us on Facebook"
                  >
                    {getSocialIcon('facebook')}
                  </a>
                  <a 
                    href="https://linkedin.com/company/aesthetic-care-istanbul" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Connect on LinkedIn"
                  >
                    {getSocialIcon('linkedin')}
                  </a>
                  <a 
                    href="https://youtube.com/@aestheticcareistanbul" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Subscribe to our YouTube"
                  >
                    {getSocialIcon('youtube')}
                  </a>
                </>
              )}
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
              <div className="mb-4 lg:mb-0">
                <p className="text-sm sm:text-base">© {new Date().getFullYear()} Aesthetic Care Istanbul. All rights reserved.</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <a href="#" className="text-sm sm:text-base hover:opacity-80 transition-opacity">Privacy Policy</a>
                <a href="#" className="text-sm sm:text-base hover:opacity-80 transition-opacity">Terms of Service</a>
                <a href="#" className="text-sm sm:text-base hover:opacity-80 transition-opacity">Sitemap</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </div>
  );
}
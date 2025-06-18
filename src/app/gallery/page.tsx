'use client';

import BeforeAfterGallery from '@/components/BeforeAfterGallery';
import BeforeAfterStats from '@/components/BeforeAfterStats';
import CategoryBeforeAfterSection from '@/components/CategoryBeforeAfterSection';
import { useTranslation } from '@/lib/i18n/hooks';

export default function GalleryPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-700/10"></div>
        <div className="relative container-mobile py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight">
              {t('gallery.hero.title') || 'Before & After Gallery'}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-6 px-4">
              {t('gallery.hero.subtitle') || 'Witness real transformations from our satisfied patients. Each story represents a journey of confidence and renewed self-esteem.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <a
                href="/consultation"
                className="btn-touch bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl text-center"
              >
                {t('gallery.hero.consultation_btn') || 'Free Consultation'}
              </a>
              <a
                href="/contact"
                className="btn-touch border-2 border-white/40 hover:border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                {t('gallery.hero.contact_btn') || 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
          {/* Dental Before/After Section */}
          <CategoryBeforeAfterSection
            title={t('gallery.dental.title') || 'Dental Treatment Results'}
            categoryId="cmbxi8jym00006qsy4b8dagzk"
            description={t('gallery.dental.description') || 'Discover the impressive results of our dental treatments that transform your smile. From aesthetic dentistry to implant applications, achieving perfect results.'}
            gradientFrom="from-blue-600"
            gradientTo="to-blue-700"
          />

          {/* Hair Before/After Section */}
          <CategoryBeforeAfterSection
            title={t('gallery.hair.title') || 'Hair Transplant Results'}
            categoryId="cmbxiawkb0000uxvzc1in2i7v"
            description={t('gallery.hair.description') || 'See the natural results achieved with our hair transplant and treatments. Permanent and natural-looking hair with FUE technique.'}
            gradientFrom="from-blue-500"
            gradientTo="to-purple-500"
          />

          {/* Aesthetic Before/After Section */}
          <CategoryBeforeAfterSection
            title={t('gallery.aesthetic.title') || 'Plastic Surgery Results'}
            categoryId="cmbxi8jzv001j6qsyv769abfx"
            description={t('gallery.aesthetic.description') || 'Impressive results of our plastic surgery operations. Perfect transformations with our priority on natural appearance and patient safety.'}
            gradientFrom="from-purple-600"
            gradientTo="to-purple-700"
          />

        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('gallery.testimonials.title') || 'Patient Testimonials'}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t('gallery.testimonials.subtitle') || 'Listen to our patients\' experiences and satisfaction'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="flex text-blue-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t('gallery.testimonials.testimonial1') || '"My hair transplant operation was perfect. Natural-looking results and professional service. I definitely recommend it."'}
              </p>
              <div className="font-semibold text-white">Michael K.</div>
              <div className="text-sm text-gray-400">{t('gallery.testimonials.hair_patient') || 'Hair Transplant Patient'}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="flex text-purple-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t('gallery.testimonials.testimonial2') || '"My dental treatment went great. My smile completely changed and my self-confidence increased. Thank you Vola Health!"'}
              </p>
              <div className="font-semibold text-white">Sarah D.</div>
              <div className="text-sm text-gray-400">{t('gallery.testimonials.dental_patient') || 'Dental Treatment Patient'}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="flex items-center mb-4">
                <div className="flex text-blue-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t('gallery.testimonials.testimonial3') || '"My plastic surgery operation exceeded my expectations. Natural results and excellent care. I recommend it to everyone."'}
              </p>
              <div className="font-semibold text-white">Emma S.</div>
              <div className="text-sm text-gray-400">{t('gallery.testimonials.plastic_patient') || 'Plastic Surgery Patient'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t('gallery.cta.title') || 'Ready to Start Your Transformation?'}
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('gallery.cta.subtitle') || 'Join thousands of satisfied patients who have achieved their aesthetic goals. Achieve the look of your dreams with our expert care and proven results.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/consultation"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t('gallery.cta.consultation_btn') || 'Get Free Consultation'}
              </a>
              <a
                href="/contact"
                className="border-2 border-gray-300 hover:border-white text-gray-300 hover:text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                {t('gallery.cta.contact_btn') || 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-900/30 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">4500+</div>
              <div className="text-gray-300 font-medium">{t('gallery.stats.transformations') || 'Successful Transformations'}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-300 font-medium">{t('gallery.stats.satisfaction') || 'Patient Satisfaction Rate'}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">15+</div>
              <div className="text-gray-300 font-medium">{t('gallery.stats.experience') || 'Years of Excellence'}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
              <div className="text-gray-300 font-medium">{t('gallery.stats.countries') || 'Countries Served'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
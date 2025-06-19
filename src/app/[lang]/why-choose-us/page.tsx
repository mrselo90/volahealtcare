'use client';
import Image from 'next/image';
import { FaUserMd, FaGlobe, FaHotel, FaShuttleVan, FaShieldAlt, FaHeart, FaCertificate, FaStar } from 'react-icons/fa';
import { useTranslation } from '@/lib/i18n/hooks';

export default function WhyChooseUsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {t('why.title') || 'Why Choose Us?'}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Experience world-class medical care with premium services, expert team, and luxury accommodations in the heart of Istanbul.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Professional Team */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <FaUserMd className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-800">
              {t('why.teamTitle') || 'Professional Team'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('why.teamDesc') || 'Our experienced and friendly medical team is dedicated to your safety, comfort, and the best possible results with over 15 years of combined expertise.'}
            </p>
          </div>

          {/* 24/7 Translator */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
              <FaGlobe className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-800">
              {t('why.translatorTitle') || '24/7 Translator'}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t('why.translatorDesc') || 'We provide round-the-clock translation support in 11 languages so you always feel at home and understood throughout your journey.'}
            </p>
          </div>

          {/* 5-Star Hotel */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
              <FaHotel className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-800">
              {t('why.hotelTitle') || '5-Star Hotel Accommodation'}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4 w-full max-w-md">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image 
                  src="/ramada-merter.jpg" 
                  alt="Ramada Merter Hotel Room" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image 
                  src="/ramada-merter.jpg" 
                  alt="Ramada Merter Hotel Lobby" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('why.hotelDesc') || 'Enjoy your stay at the luxurious Ramada Merter Hotel with premium amenities, ensuring comfort and convenience during your treatment journey.'}
            </p>
          </div>

          {/* VIP Transfer */}
          <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
              <FaShuttleVan className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-800">
              {t('why.transferTitle') || 'VIP Transfer'}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4 w-full max-w-md">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image 
                  src="/Vola VIP Transfer2.jpg" 
                  alt="VIP Transfer Vehicle" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image 
                  src="/Vola VIP Transfer2.jpg" 
                  alt="VIP Transfer Interior" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t('why.transferDesc') || 'Travel in style and comfort with our private Mercedes Vito vehicles, providing seamless airport, hotel, and clinic transfers with professional drivers.'}
            </p>
          </div>
        </div>

        {/* Additional Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-gray-800">
            Additional Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Safety & Quality */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-xl text-red-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">
                Safety First
              </h3>
              <p className="text-sm text-gray-600">
                International safety standards and protocols
              </p>
            </div>

            {/* Patient Care */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-xl text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">
                Personalized Care
              </h3>
              <p className="text-sm text-gray-600">
                Individual attention and customized treatment plans
              </p>
            </div>

            {/* Certifications */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCertificate className="text-xl text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">
                Certified Excellence
              </h3>
              <p className="text-sm text-gray-600">
                International accreditations and certifications
              </p>
            </div>

            {/* Reviews */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-xl text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-800">
                98% Satisfaction
              </h3>
              <p className="text-sm text-gray-600">
                Thousands of happy patients worldwide
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who chose Vola Health Istanbul for their transformation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/consultation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-flex items-center justify-center"
            >
              Free Consultation
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300 inline-flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
} 
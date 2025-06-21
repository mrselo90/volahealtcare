import Link from 'next/link'
import { ArrowLeftIcon, HomeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-gray-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl md:text-3xl">😞</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Page Not Found
          </h1>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to exploring our medical services.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <HomeIcon className="h-5 w-5" />
              Go to Homepage
            </Link>
            
            <Link
              href="/en/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Browse Services
            </Link>
          </div>

          {/* Contact Section */}
          <div className="pt-8 border-t border-gray-200 mt-12">
            <p className="text-gray-600 mb-4">
              Need help finding what you're looking for?
            </p>
            <Link
              href="/en/contact"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <PhoneIcon className="h-5 w-5" />
              Contact Our Team
            </Link>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link href="/en/services/dental-treatments" className="text-blue-600 hover:text-blue-700">
              Dental Treatments
            </Link>
            <Link href="/en/services/hair-transplant" className="text-blue-600 hover:text-blue-700">
              Hair Transplant
            </Link>
            <Link href="/en/services/plastic-surgery" className="text-blue-600 hover:text-blue-700">
              Plastic Surgery
            </Link>
            <Link href="/en/gallery" className="text-blue-600 hover:text-blue-700">
              Before & After
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
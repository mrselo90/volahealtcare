import { Metadata } from 'next';
import BeforeAfterGallery from '@/components/BeforeAfterGallery';
import BeforeAfterStats from '@/components/BeforeAfterStats';

export const metadata: Metadata = {
  title: 'Before & After Gallery | Patient Transformations',
  description: 'Browse our comprehensive before and after gallery showcasing real patient transformations from our aesthetic and wellness treatments.',
  keywords: 'before after, patient results, transformations, aesthetic surgery, dental treatment, cosmetic procedures',
  openGraph: {
    title: 'Before & After Gallery | Patient Transformations',
    description: 'Browse our comprehensive before and after gallery showcasing real patient transformations from our aesthetic and wellness treatments.',
    type: 'website',
  },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Before & After Gallery
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Witness real transformations from our satisfied patients. 
              Each story represents a journey of confidence and renewed self-esteem.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Results, Real Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our before and after gallery showcases the exceptional results achieved by our patients. 
              Every transformation tells a story of enhanced confidence and improved quality of life.
            </p>
          </div>
        </div>

        <BeforeAfterGallery 
          showFilters={true}
          gridCols={3}
          className="gallery-page"
        />
      </div>

      {/* Stats Section */}
      <BeforeAfterStats />

      {/* Call to Action */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Transformation?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied patients who have achieved their aesthetic goals with our expert care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/consultation"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Free Consultation
              </a>
              <a
                href="/contact"
                className="border border-gray-300 hover:border-white text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Successful Transformations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Patient Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
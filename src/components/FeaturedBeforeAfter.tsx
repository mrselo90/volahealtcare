'use client';

import Link from 'next/link';
import BeforeAfterGallery from './BeforeAfterGallery';

interface FeaturedBeforeAfterProps {
  limit?: number;
  className?: string;
}

export default function FeaturedBeforeAfter({ 
  limit = 6, 
  className = '' 
}: FeaturedBeforeAfterProps) {
  return (
    <section className={`py-20 bg-white text-black ${className}`}>
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            BEFORE & AFTER GALLERY
          </h2>
          <p className="text-xl leading-relaxed mb-12 max-w-4xl mx-auto">
            Witness the transformative power of our biologic approach to dentistry. 
            Each case represents not just aesthetic enhancement, but improved overall health and wellness.
          </p>
          <Link
            href="/gallery"
            className="inline-block border-b-2 border-black pb-1 text-lg font-medium hover:opacity-80 transition-opacity"
          >
            VIEW COMPLETE GALLERY →
          </Link>
        </div>

        {/* Featured Gallery */}
        <BeforeAfterGallery 
          featuredOnly={true}
          limit={limit}
          showFilters={false}
          gridCols={3}
          className="featured-gallery"
        />

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-light mb-6">
              READY TO TRANSFORM YOUR SMILE?
            </h3>
            <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Experience the Curatola difference with our personalized approach to biologic dentistry. 
              Your journey to optimal oral health begins with a comprehensive consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/consultation"
                className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
              >
                SCHEDULE CONSULTATION
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
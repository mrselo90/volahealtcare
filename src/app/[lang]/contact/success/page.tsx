'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                <h1 className="ml-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Thank You!
                </h1>
              </div>
              <div className="mt-6 space-y-6">
                <p className="text-base text-gray-600">
                  Your consultation request has been received successfully. Our team will review your request and contact you shortly to discuss the next steps.
                </p>
                <p className="text-base text-gray-600">
                  If you have any immediate questions, feel free to contact us:
                </p>
                <ul className="mt-4 space-y-2 text-base text-gray-600">
                  <li>
                    <a href="tel:+905444749881" className="text-primary hover:text-primary-600">
                                              +90 544 474 98 81
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@volahealthistanbul.com" className="text-primary hover:text-primary-600">
                      info@volahealthistanbul.com
                    </a>
                  </li>
                </ul>
                <div className="mt-10 flex space-x-3">
                  <Link
                    href="/"
                    className="btn-primary"
                  >
                    Go back home
                  </Link>
                  <Link
                    href="/services"
                    className="btn-secondary"
                  >
                    View our services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
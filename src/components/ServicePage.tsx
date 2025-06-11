'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

interface ServicePageProps {
  title: string;
  description: string;
  longDescription: string;
  benefits: string[];
  process: {
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  beforeAfterImages?: {
    before: string;
    after: string;
    description: string;
  }[];
  category: 'dental' | 'facial' | 'body';
}

export default function ServicePage({
  title,
  description,
  longDescription,
  benefits,
  process,
  faq,
  beforeAfterImages,
  category,
}: ServicePageProps) {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 pt-8 pb-2 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="/services" className="hover:text-primary">Services</Link>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href={`/services/${category}`} className="capitalize hover:text-primary">{category}</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-700 font-semibold truncate max-w-xs" aria-current="page">{title}</li>
        </ol>
      </nav>

      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:mx-0"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {description}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="https://wa.me/+905555555555"
                className="flex items-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 px-5 py-3 text-base font-bold text-white shadow-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <FaWhatsapp className="h-5 w-5" />
                Contact Us on WhatsApp
              </Link>
              <Link href="#process" className="text-sm font-semibold leading-6 text-gray-900">
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Long description section */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-2xl lg:mx-0"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            About {title}
          </h2>
          <div className="mt-6 text-lg leading-8 text-gray-600" dangerouslySetInnerHTML={{ __html: longDescription }} />
        </motion.div>
      </div>

      {/* Benefits section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-2xl lg:mx-0"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Benefits
            </h2>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center"
                >
                  <svg
                    className="h-6 w-6 flex-none text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="ml-4 text-lg text-gray-600">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Process section */}
      <div id="process" className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Treatment Process
          </h2>
          <div className="mt-8 space-y-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
                    {index + 1}
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="mt-2 ml-14 text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Before/After section */}
      {beforeAfterImages && beforeAfterImages.length > 0 && (
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Before & After
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {beforeAfterImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Image
                          src={image.before}
                          alt="Before treatment"
                          width={400}
                          height={300}
                          className="rounded-lg"
                        />
                        <p className="mt-1 text-center text-sm text-gray-500">Before</p>
                      </div>
                      <div>
                        <Image
                          src={image.after}
                          alt="After treatment"
                          width={400}
                          height={300}
                          className="rounded-lg"
                        />
                        <p className="mt-1 text-center text-sm text-gray-500">After</p>
                      </div>
                    </div>
                    <p className="mt-2 text-center text-sm text-gray-600">{image.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* FAQ section */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <dl className="mt-8 space-y-8">
            {faq.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <dt className="text-lg font-semibold text-gray-900">{item.question}</dt>
                <dd className="mt-2 text-gray-600">{item.answer}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-50">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="relative isolate overflow-hidden bg-indigo-600 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24"
          >
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your {category === 'dental' ? 'Smile' : category === 'facial' ? 'Look' : 'Body'}?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-indigo-100">
              Contact us now to schedule your consultation and learn more about {title}.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="https://wa.me/+905555555555"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact Us on WhatsApp
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
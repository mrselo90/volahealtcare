'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { label: 'Years of experience', value: '15+' },
  { label: 'Satisfied patients', value: '10,000+' },
  { label: 'Medical procedures', value: '25,000+' },
  { label: 'Expert doctors', value: '50+' },
];

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Medical Officer',
    image: '/images/team/sarah-johnson.jpg',
    bio: 'Board-certified plastic surgeon with over 15 years of experience in aesthetic procedures.',
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Head of Dental Surgery',
    image: '/images/team/michael-chen.jpg',
    bio: 'Specialist in advanced dental aesthetics and reconstructive procedures.',
  },
  {
    name: 'Dr. Emma Garcia',
    role: 'Lead Facial Surgeon',
    image: '/images/team/emma-garcia.jpg',
    bio: 'Expert in facial aesthetic surgery with a focus on natural-looking results.',
  },
  {
    name: 'Dr. James Wilson',
    role: 'Body Contouring Specialist',
    image: '/images/team/james-wilson.jpg',
    bio: 'Renowned surgeon specializing in body contouring and aesthetic procedures.',
  },
];

const certifications = [
  {
    name: 'JCI Accreditation',
    description: 'Joint Commission International certification for healthcare quality',
    image: '/images/cert-1.jpg',
  },
  {
    name: 'ISO 9001:2015',
    description: 'International standard for quality management systems',
    image: '/images/cert-2.jpg',
  },
  {
    name: 'Turkish Ministry of Health',
    description: 'Licensed and approved medical facility',
    image: '/images/cert-3.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  About MedTour
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Leading the way in medical tourism with exceptional care and outstanding results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Commitment to Excellence
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                At MedTour, we are dedicated to providing world-class medical tourism services that combine exceptional medical care with luxury hospitality. Our state-of-the-art facilities and experienced medical team ensure that every patient receives the highest standard of care.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                We understand that choosing to undergo medical treatment abroad is a significant decision. That's why we offer comprehensive support throughout your journey, from initial consultation to post-treatment care.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/about/facility.jpg"
                alt="Our Facility"
                width={800}
                height={600}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary-700 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by Thousands of Patients
              </h2>
              <p className="mt-4 text-lg leading-8 text-primary-100">
                Our track record speaks for itself
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-white/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-primary-100">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Expert Team</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet our team of experienced medical professionals dedicated to providing exceptional care.
          </p>
        </div>
        <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {team.map((person) => (
            <li key={person.name}>
              <Image
                src={person.image}
                alt={person.name}
                width={400}
                height={400}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
              <p className="text-base leading-7 text-primary-600">{person.role}</p>
              <p className="mt-4 text-base leading-7 text-gray-600">{person.bio}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Life?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Take the first step towards your transformation with our expert medical team.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/contact"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Contact Us
              </Link>
              <Link href="/services" className="text-sm font-semibold leading-6 text-white">
                View Our Services <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
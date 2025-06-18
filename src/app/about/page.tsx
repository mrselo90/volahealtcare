'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslation } from '../../lib/i18n/hooks';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <main className="container-mobile py-20 sm:py-24">
      <div className="flex justify-center mb-6 sm:mb-8">
        <Image src="/Vola_edited.jpg" alt="Vola Health Logo" width={120} height={120} className="sm:w-40 sm:h-40 rounded-none" priority />
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-6 sm:mb-8 text-center">{t('about.title') || 'About Us'}</h1>
      <div className="prose prose-base sm:prose-lg mx-auto text-gray-800 max-w-none sm:max-w-3xl">
        <h2 className="text-2xl font-serif font-bold mb-4">{t('about.subtitle') || 'Vola Health Istanbul'}</h2>
        <p>{t('about.p1') || 'Welcome to Vola Health Istanbul, a premier destination for advanced aesthetic and dental care, located in the vibrant city of Istanbul. With over seven years of dedicated service, we are proud to have established ourselves as a trusted name in the fields of dental and plastic surgery. Our clinic is devoted to enhancing the lives of patients worldwide by delivering excellence in medical aesthetics and personalized care at the highest standards.'}</p>
        <p>{t('about.p2') || 'At Vola Health, we understand that each patient is unique, with their own goals and needs. Our approach is therefore highly individualized, and we believe in forming genuine connections with our patients to better understand and address their aspirations. From the initial consultation to post-operative care, every step of our process is meticulously crafted to ensure that patients not only receive exceptional medical results but also feel comfortable, supported, and informed along the way. We are honored to have earned the trust and confidence of our international clientele, and we are dedicated to maintaining this trust by constantly refining our services and expanding our expertise.'}</p>
        <p>{t('about.p3') || 'Choosing Vola Health means choosing a team that values your journey as much as you do. We believe in more than just aesthetic improvements; we believe in the confidence, happiness, and quality of life that come from feeling your best. With a dedicated team by your side, we invite you to embark on a transformative journey with us, where your goals and expectations are not only met but exceeded.'}</p>
        <p className="text-professional-bold mt-8">{t('about.slogan') || 'Vola Health Istanbul – For a Better You'}</p>
      </div>
    </main>
  );
} 
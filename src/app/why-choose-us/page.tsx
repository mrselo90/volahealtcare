'use client';
import Image from 'next/image';
import { FaUserMd, FaGlobe, FaHotel, FaShuttleVan } from 'react-icons/fa';
import { useTranslation } from '../../lib/i18n/hooks';

export default function WhyChooseUsPage() {
  const { t } = useTranslation();
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-primary">{t('why.title') || 'Why Choose Us?'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Profesyonel Ekip */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaUserMd className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.teamTitle') || 'Professional Team'}</h2>
          <p className="text-gray-700">{t('why.teamDesc') || 'Our experienced and friendly medical team is dedicated to your safety, comfort, and the best possible results.'}</p>
        </div>
        {/* 24/7 Translator */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaGlobe className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.translatorTitle') || '24/7 Translator'}</h2>
          <p className="text-gray-700">{t('why.translatorDesc') || 'We provide round-the-clock translation support so you always feel at home and understood, no matter your language.'}</p>
        </div>
        {/* 5* Hotel */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaHotel className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.hotelTitle') || '5-Star Hotel Accommodation'}</h2>
          <div className="w-full flex justify-center gap-4 mb-2 flex-wrap">
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-Ramada.jpg" alt="Vola Ramada Hotel 1" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-Ramada2.jpg" alt="Vola Ramada Hotel 2" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
          </div>
          <p className="text-gray-700">{t('why.hotelDesc') || 'Enjoy your stay at the luxurious Ramada Merter Hotel, ensuring comfort and convenience during your treatment journey.'}</p>
        </div>
        {/* VIP Transfer */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaShuttleVan className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.transferTitle') || 'VIP Transfer'}</h2>
          <div className="w-full flex justify-center gap-4 mb-2 flex-wrap">
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-VIP Transfer.jpg" alt="Vola VIP Transfer 1" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-VIP Transfer.jpg" alt="Vola VIP Transfer" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
          </div>
          <p className="text-gray-700">{t('why.transferDesc') || 'Travel in style and comfort with our private Vito vehicles, providing seamless airport and clinic transfers.'}</p>
        </div>
      </div>
    </main>
  );
} 
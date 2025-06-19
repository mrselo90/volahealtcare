'use client';
import Image from 'next/image';
import { FaUserMd, FaGlobe, FaHotel, FaShuttleVan } from 'react-icons/fa';
import { useTranslation } from '@/lib/i18n/hooks';

export default function WhyChooseUsPage() {
  const { t } = useTranslation();
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-primary">{t('why.title') || 'Neden Bizi Seçmelisiniz?'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* Profesyonel Ekip */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaUserMd className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.teamTitle') || 'Profesyonel Ekip'}</h2>
          <p className="text-gray-700">{t('why.teamDesc') || 'Deneyimli tıbbi ekibimiz güvenliğiniz ve konforunuz için adanmıştır.'}</p>
        </div>
        {/* 24/7 Tercüman */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaGlobe className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.translatorTitle') || '24/7 Tercüman'}</h2>
          <p className="text-gray-700">{t('why.translatorDesc') || '7/24 tercüman desteği sağlıyoruz.'}</p>
        </div>
        {/* 5* Hotel */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaHotel className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.hotelTitle') || '5 Yıldızlı Otel Konaklaması'}</h2>
          <div className="w-full flex justify-center gap-4 mb-2 flex-wrap">
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-Ramada.jpg" alt="Vola-Ramada" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-Ramada2.jpg" alt="Vola-Ramada 2" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
          </div>
          <p className="text-gray-700">{t('why.hotelDesc') || 'Lüks Ramada Merter Hotel\'de konforlu tedavi süreci yaşayın.'}</p>
        </div>
        {/* VIP Transfer */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md">
          <FaShuttleVan className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('why.transferTitle') || 'VIP Transfer'}</h2>
          <div className="w-full flex justify-center gap-4 mb-2 flex-wrap">
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola VIP Transfer2.jpg" alt="Vola VIP Transfer 1" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
            <div className="relative w-[220px] h-[140px] max-w-full flex-1 min-w-[140px]">
              <Image src="/Vola-VIP Transfer.jpg" alt="Vola-VIP Transfer" fill style={{objectFit:'cover'}} className="rounded-lg" />
            </div>
          </div>
          <p className="text-gray-700">{t('why.transferDesc') || 'Özel Vito araçlarımızla konforlu seyahat edin.'}</p>
        </div>
      </div>
    </main>
  );
} 
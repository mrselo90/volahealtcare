import Image from 'next/image';
import { FaUserMd, FaGlobe, FaHotel, FaShuttleVan } from 'react-icons/fa';

export default function WhyChooseUsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-primary">Why Choose Us?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Profesyonel Ekip */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
          <FaUserMd className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Professional Team</h2>
          <p className="text-gray-700">Our experienced and friendly medical team is dedicated to your safety, comfort, and the best possible results.</p>
        </div>
        {/* 24/7 Translator */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
          <FaGlobe className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">24/7 Translator</h2>
          <p className="text-gray-700">We provide round-the-clock translation support so you always feel at home and understood, no matter your language.</p>
        </div>
        {/* 5* Hotel */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
          <FaHotel className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">5-Star Hotel Accommodation</h2>
          <div className="w-full flex justify-center mb-2">
            <Image src="/ramada-merter.jpg" alt="Ramada Merter Hotel" width={180} height={100} className="rounded-lg object-cover" />
          </div>
          <p className="text-gray-700">Enjoy your stay at the luxurious Ramada Merter Hotel, ensuring comfort and convenience during your treatment journey.</p>
        </div>
        {/* VIP Transfer */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
          <FaShuttleVan className="text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">VIP Transfer</h2>
          <p className="text-gray-700">Travel in style and comfort with our private Vito vehicles, providing seamless airport and clinic transfers.</p>
        </div>
      </div>
    </main>
  );
} 
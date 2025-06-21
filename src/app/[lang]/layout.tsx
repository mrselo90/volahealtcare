import type { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Chatbot from '@/components/ui/Chatbot';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { LanguageProvider } from '@/lib/i18n/hooks';
import CookieConsent from '@/components/ui/CookieConsent';
import { Providers } from '../providers';
import { languages, isValidLanguage, getLanguageDirection, type Language } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';


const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

// Generate static params for all supported languages
export async function generateStaticParams() {
  return languages.map((language) => ({
    lang: language.code,
  }));
}

// Generate metadata based on language
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  
  // Language-specific metadata
  const titles = {
    en: 'Vola Health Istanbul - Premium Medical Tourism',
    tr: 'Vola Health İstanbul - Premium Medikal Turizm',
    es: 'Vola Health Estambul - Turismo Médico Premium',
    pt: 'Vola Health Istambul - Turismo Médico Premium',
    de: 'Vola Health Istanbul - Premium Medizintourismus',
    fr: 'Vola Health Istanbul - Tourisme Médical Premium',
    ru: 'Vola Health Стамбул - Премиум Медицинский Туризм',
    ro: 'Vola Health Istanbul - Turism Medical Premium',
    it: 'Vola Health Istanbul - Turismo Medico Premium',
    pl: 'Vola Health Stambuł - Premium Turystyka Medyczna',
    ar: 'فولا هيلث اسطنبول - السياحة الطبية المتميزة'
  };

  const descriptions = {
    en: 'Experience world-class medical treatments in Istanbul, Turkey. Premium medical tourism services offering dental, aesthetic, and cosmetic procedures with exceptional care.',
    tr: 'İstanbul, Türkiye\'de dünya standartlarında tıbbi tedaviler deneyimleyin. Diş, estetik ve kozmetik prosedürler için premium medikal turizm hizmetleri.',
    es: 'Experimenta tratamientos médicos de clase mundial en Estambul, Turquía. Servicios premium de turismo médico que ofrecen procedimientos dentales, estéticos y cosméticos.',
    pt: 'Experimente tratamentos médicos de classe mundial em Istambul, Turquia. Serviços premium de turismo médico oferecendo procedimentos dentários, estéticos e cosméticos.',
    de: 'Erleben Sie Weltklasse-Medizinbehandlungen in Istanbul, Türkei. Premium-Medizintourismus-Services für Zahn-, Ästhetik- und Kosmetikbehandlungen.',
    fr: 'Découvrez des traitements médicaux de classe mondiale à Istanbul, Turquie. Services de tourisme médical premium offrant des procédures dentaires, esthétiques et cosmétiques.',
    ru: 'Испытайте медицинские процедуры мирового класса в Стамбуле, Турция. Премиум услуги медицинского туризма для стоматологических, эстетических и косметических процедур.',
    ro: 'Experimentați tratamente medicale de clasă mondială în Istanbul, Turcia. Servicii premium de turism medical oferind proceduri dentare, estetice și cosmetice.',
    it: 'Sperimenta trattamenti medici di classe mondiale a Istanbul, Turchia. Servizi premium di turismo medico che offrono procedure dentali, estetiche e cosmetiche.',
    pl: 'Doświadcz światowej klasy zabiegów medycznych w Stambule, Turcja. Premium usługi turystyki medycznej oferujące zabiegi dentystyczne, estetyczne i kosmetyczne.',
    ar: 'اختبر العلاجات الطبية عالمية المستوى في اسطنبول، تركيا. خدمات السياحة الطبية المتميزة التي تقدم إجراءات الأسنان والتجميل والجراحة التجميلية.'
  };

  return {
    title: titles[lang as Language] || titles.en,
    description: descriptions[lang as Language] || descriptions.en,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        languages.map(language => [language.code, `/${language.code}`])
      ),
    },
    openGraph: {
      title: titles[lang as Language] || titles.en,
      description: descriptions[lang as Language] || descriptions.en,
      url: `https://volahealthistanbul.com/${lang}`,
      siteName: 'Vola Health Istanbul',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: titles[lang as Language] || titles.en,
        },
      ],
      locale: lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      type: 'website',
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = params;
  
  // Validate language parameter
  if (!isValidLanguage(lang as Language)) {
    notFound();
  }

  const direction = getLanguageDirection(lang as Language);

  return (
    <LanguageProvider initialLanguage={lang as Language}>
      <div lang={lang} dir={direction} className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16 sm:pt-[72px]">
          {children}
        </main>
        <Footer />
        <Chatbot />
        <WhatsAppButton phoneNumber="905444749881" />
        <CookieConsent />
      </div>
    </LanguageProvider>
  );
} 
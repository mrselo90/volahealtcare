import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryName } from '@/utils/categoryUtils';
import { getServiceImageUrl, getServiceImageAlt } from '@/utils/imageUtils';
import { getTranslation } from '@/utils/translationUtils';

interface Props {
  params: {
    category: string;
    lang: string;
  };
}

async function getCategoryWithServices(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
  if (!res.ok) return null;
  const categories = await res.json();
  return categories.find((cat: any) => cat.slug === slug);
}

function getLocalizedText(val: any, fallback = '') {
  if (!val) return fallback;
  if (typeof val === 'object' && val.en !== undefined) return val.en;
  try {
    const parsed = JSON.parse(val);
    if (parsed && typeof parsed === 'object' && parsed.en !== undefined) return parsed.en;
  } catch {}
  return typeof val === 'string' ? val : fallback;
}

// Function to get service title in the correct language
function getServiceTitle(service: any, language: string) {
  if (service.translations && service.translations.length > 0) {
    return getTranslation(service.translations, 'title', language) || service.title || '';
  }
  return service.title || '';
}

// Function to get service description in the correct language
function getServiceDescription(service: any, language: string) {
  if (service.translations && service.translations.length > 0) {
    return getTranslation(service.translations, 'description', language) || service.description || '';
  }
  return service.description || '';
}

export default async function ServiceCategoryPage({ params }: Props) {
  const category = await getCategoryWithServices(params.category);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            {getCategoryName(category)}
          </h1>
          {category.description && (
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              {getLocalizedText(category.description)}
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((service: any) => (
            <Link
              key={service.slug}
              href={`/${params.lang}/services/${category.slug}/${service.slug}`}
              className="group relative block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-2">
                <Image
                  src={getServiceImageUrl(service)}
                  alt={getServiceImageAlt(service, getServiceTitle(service, params.lang))}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary">
                  {getServiceTitle(service, params.lang)}
                </h3>
                <p className="mt-2 text-gray-500">{getServiceDescription(service, params.lang)}</p>
                <div className="mt-4 flex items-center text-primary font-medium">
                  Learn more
                  <svg
                    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
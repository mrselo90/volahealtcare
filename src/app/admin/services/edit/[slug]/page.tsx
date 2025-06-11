'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const defaultTranslations = [
  { language: 'en', title: '', description: '' },
  { language: 'tr', title: '', description: '' },
];

// Helper function to validate and fix image URLs
const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

// Helper function to get a fallback image URL
const getFallbackImageUrl = () => '/images/placeholder.svg';

// Helper function to fix or replace invalid image URLs
const fixImageUrl = (url: string): string => {
  if (!url) return getFallbackImageUrl();
  
  // Validate the URL
  if (!isValidImageUrl(url)) {
    console.warn('Invalid image URL detected, using fallback:', url);
    return getFallbackImageUrl();
  }
  
  return url;
};

export default function EditServicePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  const [service, setService] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
    currency: 'USD',
    translations: defaultTranslations,
    images: [] as Array<{ id?: string; url: string; alt: string }>,
    featured: false,
    availability: 'always',
    minAge: 18,
    maxAge: 99,
    prerequisites: '',
    aftercare: '',
    benefits: '',
    risks: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) return setCategories([]);
      const data = await res.json();
      const parsed = data.map((cat: any) => {
        let name = '';
        try {
          const obj = typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name;
          name = obj && obj.en ? obj.en : (cat.name || '');
        } catch {
          name = cat.name || '';
        }
        return { ...cat, name };
      });
      setCategories(parsed);
    };

    const fetchService = async () => {
      try {
        const response = await fetch(`/api/admin/services/${params.slug}`);
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response from server');
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch service');
        }

        console.log('Fetched service data:', data); // Debug log

        // Map the fetched service data to our form structure
        const mappedService = {
          id: data.id || '',
          title: data.translations?.find((t: any) => t.language === 'en')?.title || '',
          slug: data.slug || '',
          description: data.translations?.find((t: any) => t.language === 'en')?.description || '',
          category: data.categoryId || '',
          price: data.price || 0,
          duration: data.duration || '',
          currency: data.currency || 'USD',
          translations: data.translations?.length > 0 ? data.translations.map((t: any) => ({
            language: t.language,
            title: t.title,
            description: t.description,
          })) : defaultTranslations,
          images: data.images?.map((img: any) => ({
            id: img.id,
            url: fixImageUrl(img.url),
            alt: img.alt || '',
          })) || [],
          featured: data.featured || false,
          availability: data.availability || 'always',
          minAge: data.minAge || 18,
          maxAge: data.maxAge || 99,
          prerequisites: data.prerequisites || '',
          aftercare: data.aftercare || '',
          benefits: data.benefits || '',
          risks: data.risks || '',
        };

        console.log('Mapped service data:', mappedService); // Debug log
        setService(mappedService);
      } catch (error) {
        console.error('Error fetching service:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to load service');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchService();
  }, [params.slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setService({ ...service, [name]: value, slug });
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setService({ ...service, [name]: checked });
    } else if (type === 'number') {
      setService({ ...service, [name]: Number(value) });
    } else {
      setService({ ...service, [name]: value });
    }
  };

  const handleTranslationChange = (language: string, field: string, value: string) => {
    setService({
      ...service,
      translations: service.translations.map(t => 
        t.language === language ? { ...t, [field]: value } : t
      ),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setService({
        ...service,
        images: [
          ...service.images,
          ...data.urls.map((url: string) => ({
            url,
            alt: '',
          })),
        ],
      });
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setService({
      ...service,
      images: service.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, id: service.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service');
      }
      
      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update service');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/services')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to Services
        </button>
      </div>
    );
  }

    return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <button
          onClick={() => router.push('/admin/services')}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Services
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={service.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={service.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                name="price"
                value={service.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input
                type="text"
                name="duration"
                value={service.duration}
                onChange={handleInputChange}
                placeholder="e.g., 2 hours"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                name="currency"
                value={service.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="TRY">TRY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                name="availability"
                value={service.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="always">Always Available</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekends">Weekends Only</option>
                <option value="limited">Limited Availability</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Age</label>
              <input
                type="number"
                name="minAge"
                value={service.minAge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Age</label>
              <input
                type="number"
                name="maxAge"
                value={service.maxAge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="featured"
                checked={service.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured Service</span>
            </label>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
              <textarea
                name="prerequisites"
                value={service.prerequisites}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Any requirements before the procedure..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aftercare Instructions</label>
              <textarea
                name="aftercare"
                value={service.aftercare}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Post-procedure care instructions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
              <textarea
                name="benefits"
                value={service.benefits}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Key benefits and expected outcomes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risks and Considerations</label>
              <textarea
                name="risks"
                value={service.risks}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Potential risks and important considerations..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {service.images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={fixImageUrl(image.url)}
                  alt={image.alt}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-48"
                  onError={(e) => {
                    console.error('Image failed to load:', image.url);
                    e.currentTarget.src = getFallbackImageUrl();
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => {
                    const newImages = [...service.images];
                    newImages[index] = { ...image, alt: e.target.value };
                    setService({ ...service, images: newImages });
                  }}
                  placeholder="Image description"
                  className="mt-2 w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            ))}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-amber-50 file:text-amber-700
                hover:file:bg-amber-100 transition-colors"
            />
            {uploading && <p className="mt-2 text-sm text-gray-500">Uploading images...</p>}
          </div>
        </div>

        {/* Translations */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Translations</h2>
          <div className="space-y-6">
            {service.translations.map((translation) => (
              <div key={translation.language} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-5 bg-gray-100 rounded text-xs flex items-center justify-center font-mono">
                    {translation.language.toUpperCase()}
                  </span>
                  {translation.language === 'en' ? 'English' : 'Turkish'}
                  {translation.language === 'en' && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Required</span>
                  )}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={translation.title}
                      onChange={(e) => handleTranslationChange(translation.language, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      required={translation.language === 'en'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={translation.description}
                      onChange={(e) => handleTranslationChange(translation.language, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      required={translation.language === 'en'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          >
            Update Service
          </button>
        </div>
      </form>
      </div>
    );
} 
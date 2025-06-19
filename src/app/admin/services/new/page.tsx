'use client';

import { useState, useEffect, useRef } from 'react';
import { RiSaveLine, RiCheckLine, RiErrorWarningLine, RiCloseLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'pl', name: 'Polski' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' }
];

const defaultTranslations = supportedLanguages.map(lang => ({
  language: lang.code,
  title: '',
  description: ''
}));

interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  anesthesia: string;
  recovery: string;
  featured: boolean;
  minAge?: number;
  maxAge?: number;
  availability: string;
  timeInTurkey: string;
  operationTime: string;
  hospitalStay: string;
  accommodation: string;
  transportation: string;
}

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [service, setService] = useState({
    title: '',
    slug: '',
    description: '',
    category: '', // Start empty so the placeholder shows
    translations: defaultTranslations,
    images: [] as Array<{ id?: string; url: string; alt: string }>,
    // Package Details
    timeInTurkey: '',
    operationTime: '',
    hospitalStay: '',
    recovery: '',
    accommodation: '',
    transportation: '',
    // Additional fields
    featured: false,
    availability: 'always',
    minAge: 18,
    maxAge: 99,
    prerequisites: '',
    aftercare: '',
    benefits: '',
    risks: '',
    anesthesia: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const res = await fetch('/api/categories');
        console.log('Categories response status:', res.status);
        
        if (!res.ok) {
          console.error('Failed to fetch categories:', res.status, res.statusText);
          setCategories([]);
          return;
        }
        
        const data = await res.json();
        console.log('Categories data:', data);
        
        // Parse name - public API returns plain strings, admin API returns JSON
        const parsed = data.map((cat: any) => {
          let name = '';
          try {
            // If name is already a string (from public API), use it directly
            if (typeof cat.name === 'string' && !cat.name.startsWith('{')) {
              name = cat.name;
            } else {
              // If name is JSON string (from admin API), parse it
              const obj = typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name;
              name = obj && obj.en ? obj.en : (cat.name || '');
            }
          } catch {
            name = cat.name || '';
          }
          return { ...cat, name };
        });
        console.log('Parsed categories:', parsed);
        setCategories(parsed);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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

    setSaving(true);
    try {
      const uploadedImages = [];
      
      // Upload files one by one since our API expects single file uploads
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file); // Use 'file' (singular) as expected by API

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        uploadedImages.push({
          url: data.url, // Use 'url' (singular) as returned by API
          alt: '',
        });
      }

      setService({
        ...service,
        images: [
          ...service.images,
          ...uploadedImages,
        ],
      });
      
      // Clear the error if upload was successful
      setMessage(null);
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to upload images' });
    } finally {
      setSaving(false);
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service');
      }
      
      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setMessage({ type: 'error', text: err.message });
      } else {
        setMessage({ type: 'error', text: 'Failed to create service' });
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Service</h1>
      {message && (
        <div className={`bg-${message.type === 'success' ? 'green' : 'red'}-50 border border-${message.type === 'success' ? 'green' : 'red'}-200 text-${message.type === 'success' ? 'green' : 'red'}-600 px-4 py-3 rounded mb-4`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={service.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Category</label>
            <select
              name="category"
              value={service.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
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
            <label className="block mb-2">Availability</label>
            <select
              name="availability"
              value={service.availability}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="always">Always Available</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="weekends">Weekends Only</option>
              <option value="limited">Limited Availability</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Minimum Age</label>
            <input
              type="number"
              name="minAge"
              value={service.minAge}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Maximum Age</label>
            <input
              type="number"
              name="maxAge"
              value={service.maxAge}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Package Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Package Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Time in Turkey</label>
              <input
                type="text"
                name="timeInTurkey"
                value={service.timeInTurkey}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 3-5 Days"
              />
            </div>

            <div>
              <label className="block mb-2">Operation Time</label>
              <input
                type="text"
                name="operationTime"
                value={service.operationTime}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 2-4 Hours"
              />
            </div>

            <div>
              <label className="block mb-2">Hospital Stay</label>
              <input
                type="text"
                name="hospitalStay"
                value={service.hospitalStay}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., Day Case"
              />
            </div>

            <div>
              <label className="block mb-2">Recovery Time</label>
              <input
                type="text"
                name="recovery"
                value={service.recovery}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 1-2 Weeks"
              />
            </div>

            <div>
              <label className="block mb-2">Accommodation</label>
              <input
                type="text"
                name="accommodation"
                value={service.accommodation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 5* Hotel"
              />
            </div>

            <div>
              <label className="block mb-2">Transportation</label>
              <input
                type="text"
                name="transportation"
                value={service.transportation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., VIP Car & Driver"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Prerequisites</label>
            <textarea
              name="prerequisites"
              value={service.prerequisites}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Aftercare Instructions</label>
            <textarea
              name="aftercare"
              value={service.aftercare}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Benefits</label>
            <textarea
              name="benefits"
              value={service.benefits}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Risks and Considerations</label>
            <textarea
              name="risks"
              value={service.risks}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2">Anesthesia</label>
            <input
              type="text"
              name="anesthesia"
              value={service.anesthesia}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Local Anesthesia"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="featured"
              checked={service.featured}
              onChange={handleInputChange}
              className="rounded border-gray-300"
            />
            <span>Featured Service</span>
          </label>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {service.images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={200}
                  height={200}
                  className="rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
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
                  className="mt-2 w-full text-sm p-1 border rounded"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {saving && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Translations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.translations.map((translation) => {
              const language = supportedLanguages.find(lang => lang.code === translation.language);
              return (
                <div key={translation.language} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {translation.language.toUpperCase()}
                    </span>
                    {language?.name}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">Title</label>
                      <input
                        type="text"
                        value={translation.title}
                        onChange={(e) => handleTranslationChange(translation.language, 'title', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter title in ${language?.name}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">Description</label>
                      <textarea
                        value={translation.description}
                        onChange={(e) => handleTranslationChange(translation.language, 'description', e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder={`Enter description in ${language?.name}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Service
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 
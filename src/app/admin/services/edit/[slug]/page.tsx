'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImagePicker from '@/components/ui/ImagePicker';
import { ToastProvider, useToast } from '@/components/ui/Toast';

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
  description: '',
  content: ''
}));

// Helper function to validate and fix image URLs
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  // Allow relative URLs that start with a forward slash
  if (url.startsWith('/')) {
    return true;
  }
  // Check for absolute URLs
  try {
    new URL(url);
    return true;
  } catch (e) {
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

function EditServicePageContent({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [service, setService] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    category: '',
    translations: defaultTranslations,
    images: [] as Array<{ id?: string; url: string; alt: string }>,
    featured: false,
    availability: 'always',
    minAge: 18,
    maxAge: 99,
          anesthesia: '',
    // Package Details
    timeInTurkey: '',
    operationTime: '',
    hospitalStay: '',
    recovery: '',
    accommodation: '',
    transportation: '',
  });

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || loading) return;
    
    try {
      // Save to localStorage as backup
      localStorage.setItem(`service-edit-${params.slug}`, JSON.stringify(service));
      
      // Optional: Auto-save to server (commented out to avoid too many requests)
      // const response = await fetch('/api/admin/services', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...service }),
      // });
      
      setLastSaved(new Date());
      console.log('Auto-saved to localStorage');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [hasUnsavedChanges, loading, service, params.slug]);

  // Trigger auto-save when data changes
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    if (hasUnsavedChanges) {
      autoSaveTimeoutRef.current = setTimeout(autoSave, 3000); // Auto-save after 3 seconds of inactivity
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, autoSave]);

  // Browser refresh protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load backup from localStorage if available
  useEffect(() => {
    const backupKey = `service-edit-${params.slug}`;
    const backup = localStorage.getItem(backupKey);
    if (backup && !loading) {
      try {
        const backupData = JSON.parse(backup);
        const backupTime = new Date(backupData.lastModified || 0);
        const now = new Date();
        const timeDiff = now.getTime() - backupTime.getTime();
        
        // If backup is less than 1 hour old, offer to restore
        if (timeDiff < 3600000) {
          const shouldRestore = window.confirm(
            'A recent backup of this service was found. Would you like to restore your unsaved changes?'
          );
          if (shouldRestore) {
            setService(backupData);
            setHasUnsavedChanges(true);
            showToast({
              type: 'info',
              title: 'Backup Restored',
              message: 'Your unsaved changes have been restored from backup.',
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse backup:', error);
      }
    }
  }, [loading, params.slug, showToast]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories for edit...');
        const res = await fetch('/api/categories');
        console.log('Categories response status:', res.status);
        
        if (!res.ok) {
          console.error('Failed to fetch categories:', res.status, res.statusText);
          setCategories([]);
          return;
        }
        
        const data = await res.json();
        console.log('Categories data for edit:', data);
        
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
        console.log('Parsed categories for edit:', parsed);
        setCategories(parsed);
      } catch (error) {
        console.error('Error fetching categories for edit:', error);
        setCategories([]);
      }
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
          title: data.translations?.find((t: any) => t.language === 'en')?.title || data.title || '',
          slug: data.slug || '',
          description: data.translations?.find((t: any) => t.language === 'en')?.description || data.description || '',
          category: data.categoryId || '',
          translations: data.translations?.length > 0 ? data.translations.map((t: any) => ({
            language: t.language,
            title: t.title || '',
            description: t.description || '',
            content: t.content || '',
          })) : defaultTranslations,
          images: Array.isArray(data.images) ? data.images.map((img: any) => ({
            id: img.id,
            url: fixImageUrl(img.url),
            alt: img.alt || '',
          })) : [],
          featured: data.featured || false,
          availability: data.availability || 'always',
          minAge: data.minAge || 18,
          maxAge: data.maxAge || 99,
          anesthesia: data.anesthesia || '',
          // Package Details
          timeInTurkey: data.timeInTurkey || '',
          operationTime: data.operationTime || '',
          hospitalStay: data.hospitalStay || '',
          recovery: data.recovery || '',
          accommodation: data.accommodation || '',
          transportation: data.transportation || '',
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
    setHasUnsavedChanges(true);
  };

  const handleTranslationChange = (language: string, field: string, value: string) => {
    setService({
      ...service,
      translations: service.translations.map(t => 
        t.language === language ? { ...t, [field]: value } : t
      ),
    });
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = async (files: FileList): Promise<Array<{ url: string; alt: string }>> => {
    if (!files?.length) return [];

    const uploadedImages = [];
    const slug = service.slug;

    if (!slug) {
      throw new Error('Service slug is not available. Please save the service first.');
    }

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);

      const response = await fetch('/api/admin/services/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      uploadedImages.push({
        url: data.url,
        alt: '',
      });
    }

    return uploadedImages;
  };

  const handleImagesChange = (newImages: Array<{ id?: string; url: string; alt: string }>) => {
    setService({
      ...service,
      images: newImages,
    });
    setHasUnsavedChanges(true);
  };

  const handleImageDelete = async (index: number) => {
    const image = service.images[index];
    // If the image is an uploaded file, delete from server
    if (image.url && image.url.startsWith('/uploads/')) {
      try {
        await fetch(`/api/admin/services/upload?url=${encodeURIComponent(image.url)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete image from server:', err);
        throw err; // Re-throw to let ImagePicker handle the error
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required fields
    const englishTranslation = service.translations.find(t => t.language === 'en');
    if (!englishTranslation?.title?.trim()) {
      setError('English title is required');
      setLoading(false);
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'English title is required',
      });
      return;
    }
    
    if (!englishTranslation?.description?.trim()) {
      setError('English description is required');
      setLoading(false);
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'English description is required',
      });
      return;
    }
    
    if (!service.category) {
      setError('Category is required');
      setLoading(false);
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a category',
      });
      return;
    }
    
    try {
      const response = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: service.id,
          categoryId: service.category,
          featured: service.featured,
          availability: service.availability,
          minAge: service.minAge,
          maxAge: service.maxAge,
          anesthesia: service.anesthesia,
          timeInTurkey: service.timeInTurkey,
          operationTime: service.operationTime,
          hospitalStay: service.hospitalStay,
          recovery: service.recovery,
          accommodation: service.accommodation,
          transportation: service.transportation,
          translations: service.translations,
          images: service.images,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update service');
      }
      
      // Clear backup and unsaved changes flag
      localStorage.removeItem(`service-edit-${params.slug}`);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      showToast({
        type: 'success',
        title: 'Service Updated!',
        message: 'Service has been successfully updated.',
      });
      
      setTimeout(() => {
        router.push('/admin/services');
        router.refresh();
      }, 1000);
          } catch (err) {
        console.error('Submit error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to update service';
        setError(errorMessage);
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: errorMessage,
        });
      } finally {
        setLoading(false);
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
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}
          {lastSaved && !hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (hasUnsavedChanges) {
              const shouldLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
              if (!shouldLeave) return;
            }
            router.push('/admin/services');
          }}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Anesthesia</label>
              <input
                type="text"
                name="anesthesia"
                value={service.anesthesia}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g., Local Anesthesia"
              />
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Türkiye'de Kalış Süresi</label>
              <input
                type="text"
                name="timeInTurkey"
                value={service.timeInTurkey}
                onChange={handleInputChange}
                                  placeholder="örn: 1-3 Gün"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operasyon Süresi</label>
              <input
                type="text"
                name="operationTime"
                value={service.operationTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="örn: 1 Saat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hastane Kalışı</label>
              <input
                type="text"
                name="hospitalStay"
                value={service.hospitalStay}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="örn: Günübirlik"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İyileşme Süresi</label>
              <input
                type="text"
                name="recovery"
                value={service.recovery}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="örn: 1-2 Hafta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konaklama</label>
              <input
                type="text"
                name="accommodation"
                value={service.accommodation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="örn: 5* Otel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ulaşım</label>
              <input
                type="text"
                name="transportation"
                value={service.transportation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="örn: VIP Araç ve Şoför"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Images</h2>
          <ImagePicker
            images={service.images}
            onImagesChange={handleImagesChange}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            multiple={true}
            maxImages={15}
            disabled={loading}
          />
        </div>

        {/* Translations */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Translations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.translations.map((translation) => {
              const language = supportedLanguages.find(lang => lang.code === translation.language);
              return (
                <div key={translation.language} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {translation.language.toUpperCase()}
                    </span>
                    {language?.name}
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
                        placeholder={`Enter title in ${language?.name}`}
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
                        placeholder={`Enter description in ${language?.name}`}
                        required={translation.language === 'en'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">About This Treatment (Content)</label>
                      <textarea
                        value={translation.content || ''}
                        onChange={(e) => handleTranslationChange(translation.language, 'content', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder={`Enter detailed content about this treatment in ${language?.name}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => {
              if (hasUnsavedChanges) {
                const shouldLeave = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
                if (!shouldLeave) return;
                // Clear backup if user confirms
                localStorage.removeItem(`service-edit-${params.slug}`);
              }
              router.push('/admin/services');
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors flex items-center gap-2 ${
              loading 
                ? 'bg-amber-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? 'Updating...' : 'Update Service'}
          </button>
        </div>
      </form>
      </div>
    );
}

export default function EditServicePage({ params }: { params: { slug: string } }) {
  return (
    <ToastProvider>
      <EditServicePageContent params={params} />
    </ToastProvider>
  );
} 
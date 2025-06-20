'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Service, ServiceTranslation, Image, FAQ, BeforeAfterImage } from '@prisma/client';
import { Tab } from '@headlessui/react';
import { RiImageLine, RiTranslate2, RiInformationLine, RiQuestionLine } from 'react-icons/ri';

type ServiceWithRelations = Service & {
  translations: ServiceTranslation[];
  images: Image[];
  faqs: (FAQ & { translations: any[] })[];
  beforeAfterImages: BeforeAfterImage[];
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'ru', name: 'Русский' },
  { code: 'ro', name: 'Română' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
];

// Categories will be loaded from API

interface ServiceFormProps {
  service: ServiceWithRelations | null;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function ServiceForm({ service }: ServiceFormProps) {
  console.log('🔥 ServiceForm component loaded!', service ? 'EDIT mode' : 'CREATE mode');
  
  const formTitle = service ? 'Edit Service' : 'Create Service';

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imagesModified, setImagesModified] = useState(false);
  const [categories, setCategories] = useState<Array<{id: string; name: string; slug: string}>>([]);
  const [formData, setFormData] = useState<Partial<ServiceWithRelations>>(() => {
    if (service) {
      return {
        id: service.id,
        categoryId: service.categoryId,
        price: service.price || 0,
        // Package Details
        timeInTurkey: service.timeInTurkey || '',
        operationTime: service.operationTime || '',
        hospitalStay: service.hospitalStay || '',
        recovery: service.recovery || '',
        accommodation: service.accommodation || '',
        transportation: service.transportation || '',
        translations: (service.translations ?? []).map(t => ({
          language: t.language,
          title: t.title,
          description: t.description,
          serviceId: t.serviceId,
          id: t.id,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
        images: (service.images ?? []).map(img => ({
          id: img.id,
          url: img.url,
          alt: img.alt || '',
          type: img.type || 'gallery',
          serviceId: service.id,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        })),
        faqs: (service.faqs ?? []).map(f => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          serviceId: service.id,
          translations: f.translations,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
        })),
        beforeAfterImages: (service.beforeAfterImages ?? []).map(img => ({
          id: img.id,
          beforeImage: img.beforeImage,
          afterImage: img.afterImage,
          description: img.description || '',
          serviceId: service.id,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt,
        })),
      };
    }
    return {
      categoryId: '',
      price: 0,
      // Package Details
      timeInTurkey: '',
      operationTime: '',
      hospitalStay: '',
      recovery: '',
      accommodation: '',
      transportation: '',
      translations: languages.map(lang => ({
        language: lang.code,
        title: '',
        description: '',
        serviceId: '',
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      images: [],
      faqs: [],
      beforeAfterImages: [],
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          console.log('Categories fetched:', data);
          
          // Parse category names if they are JSON strings
          const parsedCategories = data.map((cat: any) => {
            let name = cat.name;
            try {
              // If name is a JSON string, parse it and get the English name
              if (typeof name === 'string' && name.startsWith('{')) {
                const parsed = JSON.parse(name);
                name = parsed.en || name;
              }
            } catch (e) {
              // If parsing fails, use the original name
              console.log('Category name parsing failed for:', cat.name);
            }
            return { ...cat, name };
          });
          
          setCategories(parsedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    
    const englishTranslation = formData.translations?.find(t => t.language === 'en');
    if (!englishTranslation?.title) newErrors.englishTitle = 'English title is required';
    if (!englishTranslation?.description) newErrors.englishDescription = 'English description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const englishTitle = formData.translations?.find(t => t.language === 'en')?.title || '';
      const slug = service?.slug || englishTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const submitData: any = {
        id: service?.id,
        slug,
        categoryId: formData.categoryId,
        price: formData.price,
        // Package Details
        timeInTurkey: formData.timeInTurkey,
        operationTime: formData.operationTime,
        hospitalStay: formData.hospitalStay,
        recovery: formData.recovery,
        accommodation: formData.accommodation,
        transportation: formData.transportation,
        translations: formData.translations?.map(t => ({
          language: t.language,
          title: t.title,
          description: t.description,
          id: t.id,
        })),
        faqs: formData.faqs?.map(f => ({
          question: f.question,
          answer: f.answer,
          id: f.id,
          translations: f.translations?.map(t => ({
            language: t.language,
            question: t.question,
            answer: t.answer,
            id: t.id,
          })),
        })),
        beforeAfterImages: formData.beforeAfterImages?.map(img => ({
          beforeImage: img.beforeImage,
          afterImage: img.afterImage,
          description: img.description || '',
          id: img.id,
        })),
      };

      // Only include images and updateImages flag if they have been modified or if creating new service
      if (!service || imagesModified) {
        console.log('Including images in request because:', !service ? 'new service' : 'images modified');
        submitData.images = formData.images?.map(img => ({
          url: img.url,
          alt: img.alt || '',
          type: img.type || 'gallery',
          id: img.id,
        }));
        submitData.updateImages = true; // Explicit flag to update images
      } else {
        console.log('NOT including images in request - no modifications detected');
        // Don't include images or updateImages flag - preserve existing images
      }

      console.log('=== DEBUG INFO ===');
      console.log('service exists:', !!service);
      console.log('imagesModified:', imagesModified);
      console.log('submitData includes images:', 'images' in submitData);
      console.log('submitData.images:', submitData.images);
      console.log('formData.images length:', formData.images?.length);
      console.log('==================');

      const response = await fetch('/api/admin/services', {
        method: service ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save service');
      }

      router.push('/admin/services');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (
    language: string,
    field: 'title' | 'description',
    value: string
  ) => {
    setFormData((prev) => {
      const existingTranslation = prev.translations?.find(t => t.language === language);
      return {
        ...prev,
        translations: [
          ...(prev.translations || []).filter((t) => t.language !== language),
          {
            ...(existingTranslation || {
              language,
              title: '',
              description: '',
              serviceId: service?.id || '',
              id: service?.translations?.find((t) => t.language === language)?.id || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
            [field]: value,
          },
        ],
      };
    });
  };

  function getSlug(service: ServiceWithRelations | null, formData: Partial<ServiceWithRelations>) {
    if (service?.slug) return service.slug;
    
    const englishTitle = formData.translations?.find(t => t.language === 'en')?.title || '';
    if (englishTitle) {
      return englishTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    // Fallback to timestamp if no title
    return `new-service-${Date.now()}`;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== IMAGE UPLOAD STARTED ===');
    
    if (!e.target.files?.length) {
      console.log('No files selected');
      return;
    }
    
    const file = e.target.files[0];
    console.log('File selected:', file.name, file.size, file.type);
    setUploadingImage(true);

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      setUploadingImage(false);
      return;
    }

    const slug = getSlug(service, formData);
    console.log('Generated slug for upload:', slug);

    const form = new FormData();
    form.append('file', file);
    form.append('slug', slug);

    try {
      console.log('Sending upload request to /api/admin/services/upload');
      const response = await fetch('/api/admin/services/upload', {
        method: 'POST',
        body: form,
      });

      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Upload error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || 'Failed to upload image' };
        }
        throw new Error(error.error || 'Failed to upload image');
      }

      const result = await response.json();
      console.log('Upload response:', result);
      const { url } = result;
      
      if (!url) {
        throw new Error('No URL returned from upload');
      }
      
      console.log('Image uploaded successfully:', url);
      setImagesModified(true);
      console.log('imagesModified set to true after upload');
      
      const newImage = {
        url,
        alt: '',
        id: '',
        serviceId: service?.id || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'gallery',
      };
      console.log('Adding new image to formData:', newImage);
      
      setFormData((prev: Partial<ServiceWithRelations>) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          newImage,
        ],
      }));

      // Clear the file input
      e.target.value = '';
      alert('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const tabs = [
    { name: 'Basic Info', icon: RiInformationLine },
    { name: 'Translations', icon: RiTranslate2 },
    { name: 'Images', icon: RiImageLine },
    { name: 'FAQ', icon: RiQuestionLine },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-12 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">{formTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="pb-8">
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
              {tabs.map((tab, idx) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full py-2.5 text-sm leading-5 font-semibold rounded-lg',
                      selected
                        ? 'bg-amber-100 text-amber-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-amber-700',
                      'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-60 transition-colors'
                    )
                  }
                >
                  <span className="flex items-center justify-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </span>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel className="rounded-xl bg-white p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                      className={classNames(
                        "mt-1 block w-full rounded-md border py-2 px-3 shadow-sm sm:text-sm",
                        errors.categoryId
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      )}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (USD) *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        className={classNames(
                          "block w-full pl-7 pr-12 sm:text-sm rounded-md",
                          errors.price
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        )}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                  
                  {/* Package Details Section */}
                  <div className="sm:col-span-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                      Paket Detayları
                    </h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="timeInTurkey" className="block text-sm font-medium text-gray-700">
                          Türkiye'de Kalış Süresi
                        </label>
                        <input
                          type="text"
                          name="timeInTurkey"
                          id="timeInTurkey"
                          value={formData.timeInTurkey || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, timeInTurkey: e.target.value }))}
                          placeholder="örn: 1-3 Gün"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="operationTime" className="block text-sm font-medium text-gray-700">
                          Operasyon Süresi
                        </label>
                        <input
                          type="text"
                          name="operationTime"
                          id="operationTime"
                          value={formData.operationTime || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, operationTime: e.target.value }))}
                          placeholder="örn: 1 Saat"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="hospitalStay" className="block text-sm font-medium text-gray-700">
                          Hastane Kalışı
                        </label>
                        <input
                          type="text"
                          name="hospitalStay"
                          id="hospitalStay"
                          value={formData.hospitalStay || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, hospitalStay: e.target.value }))}
                          placeholder="örn: Günübirlik"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="recovery" className="block text-sm font-medium text-gray-700">
                          İyileşme Süresi
                        </label>
                        <input
                          type="text"
                          name="recovery"
                          id="recovery"
                          value={formData.recovery || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, recovery: e.target.value }))}
                          placeholder="e.g., 1-2 Weeks"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">
                          Accommodation
                        </label>
                        <input
                          type="text"
                          name="accommodation"
                          id="accommodation"
                          value={formData.accommodation || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, accommodation: e.target.value }))}
                          placeholder="e.g., 5* Hotel"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="transportation" className="block text-sm font-medium text-gray-700">
                          Transportation
                        </label>
                        <input
                          type="text"
                          name="transportation"
                          id="transportation"
                          value={formData.transportation || ''}
                          onChange={(e) => setFormData((prev) => ({ ...prev, transportation: e.target.value }))}
                          placeholder="e.g., VIP Car & Driver"
                          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel className="rounded-xl bg-white p-6">
                <div className="space-y-8">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className="border-t border-gray-200 pt-8 first:border-0 first:pt-0"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {language.name}
                        </h4>
                        {language.code === 'en' && (
                          <span className="text-xs text-amber-600 font-medium">Required</span>
                        )}
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor={`title-${language.code}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            name={`title-${language.code}`}
                            id={`title-${language.code}`}
                            value={formData.translations?.find(t => t.language === language.code)?.title || ''}
                            onChange={(e) => handleTranslationChange(language.code, 'title', e.target.value)}
                            className="mt-1 block w-full rounded-md border py-2 px-3 shadow-sm sm:text-sm"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor={`description-${language.code}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <textarea
                            name={`description-${language.code}`}
                            id={`description-${language.code}`}
                            value={formData.translations?.find(t => t.language === language.code)?.description || ''}
                            onChange={(e) => handleTranslationChange(language.code, 'description', e.target.value)}
                            className="mt-1 block w-full rounded-md border py-2 px-3 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>

              <Tab.Panel className="rounded-xl bg-white p-6">
                <div className="space-y-8">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt || ''}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={async () => {
                            console.log('=== IMAGE DELETE CLICKED ===');
                            console.log('Deleting image at index:', index);
                            console.log('Image URL:', image.url);
                            
                            // Confirm deletion
                            if (!confirm('Are you sure you want to delete this image?')) {
                              return;
                            }
                            
                            // Delete from server if it exists
                            if (image.url && image.url.startsWith('/uploads/')) {
                              try {
                                console.log('Deleting from server:', image.url);
                                const response = await fetch(`/api/admin/services/upload?url=${encodeURIComponent(image.url)}`, {
                                  method: 'DELETE',
                                });
                                
                                console.log('Delete response status:', response.status);
                                
                                if (response.ok) {
                                  console.log('Image deleted from server successfully');
                                } else {
                                  console.error('Failed to delete image from server:', response.status);
                                }
                              } catch (error) {
                                console.error('Error deleting image from server:', error);
                              }
                            }
                            
                            setImagesModified(true);
                            console.log('imagesModified set to true after delete');
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images?.filter((_, i) => i !== index),
                            }));
                            
                            alert('Image deleted successfully!');
                          }}
                          className="text-white hover:text-red-500 transition-colors"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className={`flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-500 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <div className="text-center">
                      {uploadingImage ? (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Uploading...
                          </span>
                        </>
                      ) : (
                        <>
                          <RiImageLine className="mx-auto h-12 w-12 text-gray-400" />
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Add Image
                          </span>
                        </>
                      )}
                    </div>
                  </label>
              </div>
            </Tab.Panel>

            <Tab.Panel className="rounded-xl bg-white p-6">
              <div className="text-center py-8">
                <RiQuestionLine className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No FAQs</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new FAQ.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    <RiQuestionLine className="-ml-1 mr-2 h-5 w-5" />
                    Add FAQ
                  </button>
                </div>
              </div>
            </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
        </div>

            <div className="sticky bottom-0 left-0 z-10 bg-white flex justify-end space-x-4 pt-6 border-t border-gray-100 pb-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={classNames(
                  "inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors",
                  loading
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700"
                )}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : service ? (
                  'Update Service'
                ) : (
                  'Create Service'
                )}
              </button>
          </div>
        </form>
      </div>
    );
  }
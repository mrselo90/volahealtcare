'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Service, ServiceTranslation, Image, FAQ, BeforeAfterImage } from '@prisma/client';
import { Tab } from '@headlessui/react';
import { RiImageLine, RiTranslate2, RiInformationLine, RiQuestionLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';
const ImagePicker = dynamic(() => import('@/components/ImagePicker'), { ssr: false });

// Define the form data type with all necessary fields
interface ServiceFormData {
  id?: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string;
  price: number;
  timeInTurkey: string;
  operationTime: string;
  hospitalStay: string;
  recovery: string;
  accommodation: string;
  transportation: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  translations: Array<{
    id?: string;
    language: string;
    title: string;
    description: string;
    serviceId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  images: Array<{
    id?: string;
    url: string;
    alt: string;
    type?: string;
    serviceId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  faqs: Array<{
    id?: string;
    question: string;
    answer: string;
    serviceId?: string;
    translations?: any[];
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  beforeAfterImages: Array<{
    id?: string;
    beforeImage: string;
    afterImage: string;
    description?: string;
    serviceId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  _deletedImages?: string[]; // Track images that were deleted in the form
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
  service: ServiceFormData | null;
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
  const getSlug = (service: ServiceFormData | null, formData: Partial<ServiceFormData>): string => {
    if (service?.slug) {
      return service.slug;
    }
    
    const englishTranslation = formData.translations?.find(t => t.language === 'en');
    if (englishTranslation?.title) {
      return englishTranslation.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Fallback to a generated slug if no title is available
    return `service-${Date.now()}`;
  };
  const [formData, setFormData] = useState<Partial<ServiceFormData>>(() => {
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData: Record<string, any> = {
        ...formData,
        images: imagesModified ? (formData.images?.map(img => ({
          id: img.id,
          url: img.url,
          alt: img.alt || '',
          type: img.type || 'gallery',
          serviceId: service?.id,
          createdAt: img.createdAt,
          updatedAt: new Date()
        }))) : undefined,
        updateImages: imagesModified,
        _deletedImages: formData._deletedImages || []
      };

      console.log('Submitting form data:', JSON.stringify(submitData, null, 2));

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

  const getTranslation = (language: string, field: 'title' | 'description'): string => {
    const translation = formData.translations?.find(t => t.language === language);
    return translation ? translation[field] : '';
  };

  const updateTranslation = (language: string, field: 'title' | 'description', value: string) => {
    setFormData(prev => {
      const currentData = prev as Partial<ServiceFormData>;
      const translations = [...(currentData.translations || [])];
      const existingIndex = translations.findIndex(t => t.language === language);
      
      if (existingIndex >= 0) {
        translations[existingIndex] = {
          ...translations[existingIndex],
          [field]: value,
          updatedAt: new Date()
        };
      } else {
        translations.push({
          id: '',
          language,
          title: field === 'title' ? value : '',
          description: field === 'description' ? value : '',
          serviceId: service?.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return {
        ...currentData,
        translations
      };
    });
  };

  const handleTranslationChange = (
    language: string,
    field: 'title' | 'description',
    value: string
  ) => {
    updateTranslation(language, field, value);
  };

  const handleImageDelete = async (image: { url: string; id?: string }, index: number) => {
    console.log('=== IMAGE DELETE CLICKED ===');
    console.log('Deleting image at index:', index);
    console.log('Image URL:', image.url);
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      // Delete from server if it exists
      if (image.url && image.url.startsWith('/uploads/')) {
        try {
          console.log('Deleting from server:', image.url);
          const response = await fetch(`/api/admin/services/upload?url=${encodeURIComponent(image.url)}`, {
            method: 'DELETE',
          });
          
          console.log('Delete response status:', response.status);
          
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to delete image from server');
          }
        } catch (error) {
          console.error('Error deleting image from server:', error);
          throw error; // Re-throw to be caught by outer try-catch
        }
      }
      
      // Update local state
      const updatedImages = [...(formData.images || [])];
      updatedImages.splice(index, 1);
      
      setFormData({
        ...formData,
        images: updatedImages,
        _deletedImages: [...(formData._deletedImages || []), image.url]
      } as ServiceFormData);
      
      console.log('Image removed from form data');
      
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete image. Please try again.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    try {
      const formDataInstance = new FormData();
      formDataInstance.append('file', file);
      formDataInstance.append('slug', getSlug(service, formData) || '');

      const response = await fetch('/api/admin/services/upload', {
        method: 'POST',
        body: formDataInstance,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        images: [
          ...(prev.images || []),
          {
            id: `temp-${Date.now()}`,
            url,
            alt: '',
            type: 'gallery',
            serviceId: service?.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }));
      
      setImagesModified(true);
      
      // Reset file input
      const target = e.target as HTMLInputElement;
      if (target) {
        target.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Render delete icon for image deletion
  const renderDeleteIcon = (onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
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
  );

  // Render image gallery
  const renderImageGallery = () => (
    <div className="space-y-8">
      {formData.images?.map((image, index) => (
        <div key={image.id || `image-${index}`} className="relative group">
          <img
            src={image.url}
            alt={image.alt || ''}
          />
          {renderDeleteIcon(() => handleImageDelete(image, index))}
        </div>
      ))}
      <div className="relative">
        <ImagePicker
          label="Add Image"
          className="w-full"
          onChange={(url, alt) => {
            setFormData(prev => ({
              ...prev,
              images: [
                ...(prev.images || []),
                {
                  id: `temp-${Date.now()}`,
                  url,
                  alt: alt || '',
                  type: 'gallery',
                  serviceId: service?.id,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            }) as any);
            setImagesModified(true);
          }}
        />
        <div className="text-center">
          {uploadingImage ? (
            <>
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 animate-spin" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
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
      </div>
    </div>
  );
}
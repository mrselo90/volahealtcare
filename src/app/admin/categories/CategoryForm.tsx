'use client';

import { useState, useEffect, useRef } from 'react';
import { RiErrorWarningLine, RiCloseLine } from 'react-icons/ri';
import { CategoryData, CategoryFormData as BaseCategoryFormData } from './types';

interface CategoryFormData extends BaseCategoryFormData {
  imageFile?: File;
}

interface CategoryFormProps {
  category: CategoryData | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category, 
  onSave, 
  onCancel,
  loading = false 
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: JSON.stringify(category?.name || { en: '' }),
    description: JSON.stringify(category?.description || { en: '' }),
    slug: category?.slug || '',
    imageUrl: category?.imageUrl || '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to parse JSON or fallback to default
  const safeParse = (val: string | undefined) => {
    if (!val) return { en: '' };
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return typeof parsed === 'object' && parsed !== null ? parsed : { en: String(val) };
    } catch {
      return { en: val };
    }
  };

  // Remove image handler
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Centralized image file handler with validation
  const handleImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      return;
    }
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be less than 2MB');
      return;
    }
    setImageError(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Helper to safely parse JSON with fallback
  const parseJsonField = (jsonString: string, fallback: any = { en: '' }) => {
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      return fallback;
    }
  };

  // Get field value for display
  const getFieldValue = (field: 'name' | 'description') => {
    const value = formData[field];
    const parsed = parseJsonField(value);
    return parsed?.en || '';
  };

  // Update field value
  const updateField = (field: 'name' | 'description' | 'slug' | 'imageUrl', value: string) => {
    if (field === 'name' || field === 'description') {
      const current = parseJsonField(formData[field]);
      const updated = { ...current, en: value };
      setFormData(prev => ({
        ...prev,
        [field]: JSON.stringify(updated)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  useEffect(() => {
    if (category) {
      setFormData({
        name: JSON.stringify(safeParse(category.name)),
        description: JSON.stringify(safeParse(category.description)),
        slug: category.slug,
        imageUrl: category.imageUrl || ''
      });
      setImagePreview(category.imageUrl || null);
    }
  }, [category]);

  const validateSlug = (slug: string) => {
    if (!slug) {
      setSlugError('Slug is required');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    setSlugError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.slug) {
      setFormError('Name and slug are required');
      return;
    }
    
    if (!validateSlug(formData.slug)) {
      return;
    }

    if (imageError) {
      return;
    }
    
    try {
      // Create form data with both the category data and the image file
      const formDataWithImage = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        imageUrl: formData.imageUrl || null,
        ...(imageFile && { imageFile })
      };
      
      await onSave(formDataWithImage);
    } catch (err) {
      console.error('Error saving category:', err);
      setFormError('Failed to save category');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <RiErrorWarningLine className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>
          <div className="mb-4 flex flex-col items-center">
            <div
              className={`relative h-24 w-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border-2 ${dragActive ? 'border-amber-500' : 'border-gray-200'} transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex={0}
              aria-label="Drag and drop category image"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Category image preview"
                  className="h-full w-full object-cover aspect-square"
                />
              ) : (
                <span className="text-gray-300 text-4xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19v-2.5M3 16.5V8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25v8.25M3 16.5l4.5-4.5a2.121 2.121 0 013 0l2.25 2.25m0 0l2.25-2.25a2.121 2.121 0 013 0l4.5 4.5" />
                  </svg>
                </span>
              )}
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]); }}
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>
            <span className="text-xs text-gray-400 mt-1">Drag & drop or click to upload. JPG, PNG. Max 2MB.</span>
            {imageError && (
              <p className="mt-2 text-sm text-red-600" id="image-error">
                {imageError}
              </p>
            )}
          </div>
        </div>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              value={getFieldValue('name')}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>
        </div>
        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="slug"
              className={`block w-full rounded-md ${slugError ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm`}
              value={formData.slug}
              onChange={(e) => {
                updateField('slug', e.target.value);
                if (slugError) validateSlug(e.target.value);
              }}
              onBlur={(e) => validateSlug(e.target.value)}
              required
            />
            {slugError && (
              <p className="mt-2 text-sm text-red-600" id="slug-error">
                {slugError}
              </p>
            )}
          </div>
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              value={getFieldValue('description')}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

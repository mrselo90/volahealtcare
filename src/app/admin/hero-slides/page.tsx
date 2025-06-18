'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface HeroSlide {
  id: string;
  title?: string;
  subtitle?: string;
  category?: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  videoPoster?: string;
  orderIndex: number;
  isActive: boolean;
  translations: Array<{
    id: string;
    language: string;
    title?: string;
    subtitle?: string;
    category?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SlideFormData {
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  videoPoster?: string;
  orderIndex: number;
  isActive: boolean;
  translations: Array<{
    language: string;
    title: string;
    subtitle: string;
    category: string;
  }>;
}

const languages = [
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

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState<SlideFormData>({
    title: '',
    subtitle: '',
    category: '',
    imageUrl: '',
    videoUrl: undefined,
    mediaType: 'image',
    videoPoster: undefined,
    orderIndex: 0,
    isActive: true,
    translations: []
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/hero-slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'hero-slide');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file is too large. Maximum size is 50MB.');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'hero-video');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, videoUrl: data.url }));
      } else {
        alert('Failed to upload video');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSlide 
        ? `/api/admin/hero-slides/${editingSlide.id}`
        : '/api/admin/hero-slides';
      
      const method = editingSlide ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSlides();
        setShowForm(false);
        setEditingSlide(null);
        setFormData({
          title: '',
          subtitle: '',
          category: '',
          imageUrl: '',
          videoUrl: undefined,
          mediaType: 'image',
          videoPoster: undefined,
          orderIndex: 0,
          isActive: true,
          translations: []
        });
      } else {
        alert('Failed to save slide');
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving slide');
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      category: slide.category || '',
      imageUrl: slide.imageUrl,
      videoUrl: slide.videoUrl,
      mediaType: slide.mediaType,
      videoPoster: slide.videoPoster,
      orderIndex: slide.orderIndex,
      isActive: slide.isActive,
      translations: slide.translations.map(t => ({
        language: t.language,
        title: t.title || '',
        subtitle: t.subtitle || '',
        category: t.category || ''
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSlides();
      } else {
        alert('Failed to delete slide');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Error deleting slide');
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...slide,
          isActive: !slide.isActive
        }),
      });

      if (response.ok) {
        await fetchSlides();
      }
    } catch (error) {
      console.error('Error toggling slide status:', error);
    }
  };

  const updateTranslation = (language: string, field: string, value: string) => {
    setFormData(prev => {
      const translations = [...prev.translations];
      const existingIndex = translations.findIndex(t => t.language === language);
      
      if (existingIndex >= 0) {
        translations[existingIndex] = {
          ...translations[existingIndex],
          [field]: value
        };
      } else {
        translations.push({
          language,
          title: field === 'title' ? value : '',
          subtitle: field === 'subtitle' ? value : '',
          category: field === 'category' ? value : ''
        });
      }
      
      return { ...prev, translations };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Slide
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              {slide.mediaType === 'video' && slide.videoUrl ? (
                <video
                  src={slide.videoUrl}
                  poster={slide.videoPoster || slide.imageUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  controls
                />
              ) : (
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-xs bg-white/20 px-2 py-1 rounded">
                      {slide.category}
                    </div>
                    <div className="text-xs bg-blue-500/80 px-2 py-1 rounded">
                      {slide.mediaType === 'video' ? '🎥 Video' : '📷 Image'}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{slide.title}</h3>
                  <p className="text-sm opacity-90">{slide.subtitle}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Order: {slide.orderIndex}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className={`p-1 rounded ${slide.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {slide.isActive ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Translations: {slide.translations.length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle (Optional)
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Media Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={formData.mediaType === 'image'}
                      onChange={(e) => setFormData(prev => ({ ...prev, mediaType: e.target.value as 'image' | 'video' }))}
                      className="mr-2"
                    />
                    Image
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={formData.mediaType === 'video'}
                      onChange={(e) => setFormData(prev => ({ ...prev, mediaType: e.target.value as 'image' | 'video' }))}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.mediaType === 'video' ? 'Poster Image (Required)' : 'Slide Image'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  >
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                  {formData.imageUrl && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Video Upload - Only show if video type is selected */}
              {formData.mediaType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video File
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file);
                      }}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                    >
                      <PhotoIcon className="h-6 w-6 text-gray-400" />
                      {uploading ? 'Uploading...' : 'Choose Video'}
                    </label>
                    {formData.videoUrl && (
                      <div className="relative w-20 h-20">
                        <video
                          src={formData.videoUrl}
                          className="w-full h-full object-cover rounded-lg"
                          poster={formData.videoPoster || formData.imageUrl}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: MP4, WebM. Max size: 50MB
                  </p>
                </div>
              )}

              

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              {/* Translations */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Translations</h3>
                <div className="space-y-4">
                  {languages.map((lang) => {
                    const translation = formData.translations.find(t => t.language === lang.code);
                    return (
                      <div key={lang.code} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-3">{lang.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Title"
                            value={translation?.title || ''}
                            onChange={(e) => updateTranslation(lang.code, 'title', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Category"
                            value={translation?.category || ''}
                            onChange={(e) => updateTranslation(lang.code, 'category', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Subtitle"
                            value={translation?.subtitle || ''}
                            onChange={(e) => updateTranslation(lang.code, 'subtitle', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSlide(null);
                    setFormData({
                      title: '',
                      subtitle: '',
                      category: '',
                      imageUrl: '',
                      videoUrl: undefined,
                      mediaType: 'image',
                      videoPoster: undefined,
                      orderIndex: 0,
                      isActive: true,
                      translations: []
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSlide ? 'Update' : 'Create'} Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
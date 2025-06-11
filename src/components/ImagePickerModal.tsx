'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: { url: string; alt?: string }) => void;
  title?: string;
  searchPlaceholder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  altText?: string;
}

const MEDICAL_IMAGES = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Medical procedure',
    altText: 'Professional medical procedure in sterile environment'
  },
  {
    id: '2', 
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Medical facility',
    altText: 'Modern medical facility interior'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Healthcare professional',
    altText: 'Healthcare professional at work'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Dental care',
    altText: 'Professional dental care treatment'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Medical consultation',
    altText: 'Doctor patient consultation session'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Surgery preparation',
    altText: 'Surgery preparation room with equipment'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Plastic surgery before',
    altText: 'Before plastic surgery consultation'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Cosmetic procedure',
    altText: 'Cosmetic medical procedure'
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1603398938825-ede4e4c4e12b?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Medical equipment',
    altText: 'Advanced medical equipment in clinic'
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Dermatology',
    altText: 'Dermatological examination'
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Facial treatment',
    altText: 'Professional facial treatment procedure'
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=600&fit=crop&crop=center&auto=format&q=80',
    name: 'Medical technology',
    altText: 'Modern medical technology equipment'
  }
];

export default function ImagePickerModal({
  isOpen,
  onClose,
  onImageSelect,
  title = 'Select Image',
  searchPlaceholder = 'Search images...',
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 5
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadedImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredImages = MEDICAL_IMAGES.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.altText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File too large. Maximum size: ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const result = await response.json();
      
      const uploadedImage: UploadedImage = {
        id: Date.now().toString(),
        url: result.url,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        altText: altTextInput || file.name.replace(/\.[^/.]+$/, '')
      };

      setRecentUploads(prev => [uploadedImage, ...prev.slice(0, 9)]);
      onImageSelect({ 
        url: result.url, 
        alt: uploadedImage.altText 
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageSelect({ 
        url: urlInput.trim(), 
        alt: altTextInput.trim() || undefined 
      });
    }
  };

  const handleImageSelect = (imageUrl: string, altText?: string) => {
    onImageSelect({ url: imageUrl, alt: altText });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'gallery', label: 'Gallery', icon: FolderIcon },
              { id: 'upload', label: 'Upload', icon: ArrowUpTrayIcon },
              { id: 'url', label: 'URL', icon: CloudArrowUpIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Recent Uploads */}
                {recentUploads.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Recent Uploads</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {recentUploads.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => handleImageSelect(img.url, img.altText)}
                          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
                        >
                          <Image
                            src={img.url}
                            alt={img.altText || img.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Medical Stock Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {filteredImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => handleImageSelect(img.url, img.altText)}
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group"
                      >
                        <Image
                          src={img.url}
                          alt={img.altText || img.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            console.log('Image load error for gallery image:', img.url);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-xs font-medium truncate">{img.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-4">
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={allowedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drop your image here, or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: {allowedTypes.join(', ')} • Max size: {maxSize}MB
                      </p>
                    </>
                  )}
                </div>

                {/* Alt Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={altTextInput}
                    onChange={(e) => setAltTextInput(e.target.value)}
                    placeholder="Describe the image for accessibility"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{uploadError}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={altTextInput}
                    onChange={(e) => setAltTextInput(e.target.value)}
                    placeholder="Describe the image for accessibility"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* URL Preview */}
                {urlInput && (
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={urlInput}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={() => setUploadError('Invalid image URL')}
                    />
                  </div>
                )}

                <button
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Use This URL
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 
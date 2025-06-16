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

interface ImagePickerProps {
  value?: string;
  onChange: (url: string, altText?: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
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

const SAMPLE_IMAGES = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    name: 'Medical procedure 1',
    altText: 'Professional medical procedure'
  },
  {
    id: '2', 
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    name: 'Medical facility',
    altText: 'Modern medical facility'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400',
    name: 'Healthcare professional',
    altText: 'Healthcare professional at work'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    name: 'Dental care',
    altText: 'Professional dental care'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400',
    name: 'Medical consultation',
    altText: 'Medical consultation session'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400',
    name: 'Surgery preparation',
    altText: 'Surgery preparation room'
  }
];

export default function ImagePicker({
  value,
  onChange,
  label = 'Choose Image',
  required = false,
  placeholder = 'Select an image or enter URL',
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize = 5,
  className = ''
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('gallery');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [urlInput, setUrlInput] = useState(value || '');
  const [altTextInput, setAltTextInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadedImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredImages = SAMPLE_IMAGES.filter(img =>
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
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
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
      onChange(result.url, uploadedImage.altText);
      setIsOpen(false);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim(), altTextInput.trim() || undefined);
      setIsOpen(false);
    }
  };

  const handleImageSelect = (imageUrl: string, altText?: string) => {
    onChange(imageUrl, altText);
    setIsOpen(false);
  };

  const getFileName = (url: string) => {
    if (!url) return '';
    return url.split('/').pop()?.split('?')[0] || 'Selected image';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm text-professional text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Preview/Trigger Button */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative group cursor-pointer"
      >
        {value ? (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
            <Image
              src={value}
              alt="Selected image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <PhotoIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm text-professional">Change Image</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PhotoIcon className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm text-professional">{placeholder}</p>
              <p className="text-xs text-gray-400 mt-1">Click to select image</p>
            </div>
          </div>
        )}
      </div>

      {value && (
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded">
          <span className="truncate">{getFileName(value)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-serif font-bold text-gray-900">{label}</h2>
                  <button
                    onClick={() => setIsOpen(false)}
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
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 text-sm text-professional transition-colors ${
                        activeTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
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
                          placeholder="Search images..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Recent Uploads */}
                      {recentUploads.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm text-professional text-gray-700">Recent Uploads</h3>
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
                        <h3 className="text-sm text-professional text-gray-700">Stock Images</h3>
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
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-xs text-professional truncate">{img.name}</p>
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
                            <p className="text-lg text-professional text-gray-900 mb-2">
                              Drop your image here, or{' '}
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                browse
                              </button>
                            </p>
                            <p className="text-sm text-professional">
                              Supports: {allowedTypes.join(', ')} • Max size: {maxSize}MB
                            </p>
                          </>
                        )}
                      </div>

                      {/* Alt Text Input */}
                      <div>
                        <label className="block text-sm text-professional text-gray-700 mb-2">
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
                        <label className="block text-sm text-professional text-gray-700 mb-2">
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
                        <label className="block text-sm text-professional text-gray-700 mb-2">
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
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg text-professional transition-colors"
                      >
                        Use This URL
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
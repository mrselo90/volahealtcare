import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, ImagePlus, Trash2, Eye } from 'lucide-react';
import { Button } from './button';

interface ImagePickerProps {
  images: Array<{ id?: string; url: string; alt: string }>;
  onImagesChange: (images: Array<{ id?: string; url: string; alt: string }>) => void;
  onImageUpload: (files: FileList) => Promise<Array<{ url: string; alt: string }>>;
  onImageDelete?: (index: number) => Promise<void>;
  multiple?: boolean;
  maxImages?: number;
  uploadPath?: string;
  className?: string;
  disabled?: boolean;
}

export default function ImagePicker({
  images,
  onImagesChange,
  onImageUpload,
  onImageDelete,
  multiple = true,
  maxImages = 10,
  className = '',
  disabled = false,
}: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length === 0) {
        alert('Please drop only image files');
        return;
      }

      if (!multiple && imageFiles.length > 1) {
        alert('Only one image is allowed');
        return;
      }

      if (images.length + imageFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }

      await handleFileUpload(imageFiles);
    },
    [disabled, multiple, maxImages, images.length]
  );

  const handleFileUpload = async (fileList: File[] | FileList) => {
    if (disabled) return;
    
    setUploading(true);
    try {
      const files = Array.from(fileList);
      const uploadedImages = await onImageUpload(fileList as FileList);
      
      if (multiple) {
        onImagesChange([...images, ...uploadedImages]);
      } else {
        onImagesChange(uploadedImages);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (disabled) return;
    
    try {
      if (onImageDelete) {
        await onImageDelete(index);
      }
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], alt };
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {dragActive
                  ? 'Drop images here'
                  : 'Drag & drop images here, or click to select'}
              </p>
              <p className="text-xs text-gray-500">
                {multiple ? `Maximum ${maxImages} images` : 'Single image only'} • 
                JPEG, PNG, WebP up to 5MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="relative group bg-gray-50 rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.svg';
                  }}
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-white text-gray-800"
                      onClick={() => setPreviewImage(image.url)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Alt text input */}
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Alt text..."
                  value={image.alt}
                  onChange={(e) => updateImageAlt(index, e.target.value)}
                  className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={disabled}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 
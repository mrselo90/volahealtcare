'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface ContentBlock {
  id: string;
  key: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'placeholder';
  mediaAlt?: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  key: string;
  title: string;
  content: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'placeholder';
  mediaAlt: string;
  isActive: boolean;
  orderIndex: number;
}

interface FileUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export default function ContentBlocksAdmin() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null
  });
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    key: '',
    title: '',
    content: '',
    mediaUrl: '',
    mediaType: 'image',
    mediaAlt: '',
    isActive: true,
    orderIndex: 0,
  });

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const fetchContentBlocks = async () => {
    try {
      const response = await fetch('/api/admin/content-blocks');
      if (response.ok) {
        const data = await response.json();
        setContentBlocks(data);
      }
    } catch (error) {
      console.error('Error fetching content blocks:', error);
      toast.error('Failed to load content blocks');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (block?: ContentBlock) => {
    if (block) {
      setEditingBlock(block);
      setFormData({
        key: block.key,
        title: block.title,
        content: block.content || '',
        mediaUrl: block.mediaUrl || '',
        mediaType: block.mediaType,
        mediaAlt: block.mediaAlt || '',
        isActive: block.isActive,
        orderIndex: block.orderIndex,
      });
    } else {
      setEditingBlock(null);
      setFormData({
        key: '',
        title: '',
        content: '',
        mediaUrl: '',
        mediaType: 'image',
        mediaAlt: '',
        isActive: true,
        orderIndex: contentBlocks.length,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
    setFileUpload({ uploading: false, progress: 0, error: null });
    setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      setFileUpload(prev => ({ ...prev, error: 'Please select an image or video file' }));
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setFileUpload(prev => ({ ...prev, error: 'File size must be less than 50MB' }));
      return;
    }

    setFileUpload({ uploading: true, progress: 0, error: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFileUpload(prev => ({ ...prev, progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const fileUrl = response.url;
          
          // Update form data with the uploaded file URL and type
          setFormData(prev => ({
            ...prev,
            mediaUrl: fileUrl,
            mediaType: isImage ? 'image' : 'video'
          }));
          
          setFileUpload({ uploading: false, progress: 100, error: null });
          toast.success('File uploaded successfully!');
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        setFileUpload({ uploading: false, progress: 0, error: 'Upload failed' });
        toast.error('Upload failed');
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setFileUpload({ uploading: false, progress: 0, error: 'Upload failed' });
      toast.error('Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = '/api/admin/content-blocks';
      const method = editingBlock ? 'PUT' : 'POST';
      
      const payload = {
        ...(editingBlock && { id: editingBlock.id }),
        ...formData,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingBlock ? 'Content block updated successfully' : 'Content block created successfully');
        closeModal();
        fetchContentBlocks();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save content block');
      }
    } catch (error) {
      console.error('Error saving content block:', error);
      toast.error('Failed to save content block');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content block?')) return;

    try {
      const response = await fetch(`/api/admin/content-blocks?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Content block deleted successfully');
        fetchContentBlocks();
      } else {
        toast.error('Failed to delete content block');
      }
    } catch (error) {
      console.error('Error deleting content block:', error);
      toast.error('Failed to delete content block');
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return <VideoCameraIcon className="h-5 w-5" />;
      case 'image':
        return <PhotoIcon className="h-5 w-5" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded"></div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Blocks</h1>
            <p className="mt-2 text-gray-600">Manage dynamic content sections</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Content Block
          </button>
        </div>
      </div>

      {/* Content Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentBlocks.map((block) => (
          <div key={block.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              {block.mediaUrl && block.mediaType === 'image' ? (
                <div className="relative aspect-video">
                  <Image
                    src={block.mediaUrl}
                    alt={block.mediaAlt || block.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : block.mediaUrl && block.mediaType === 'video' ? (
                <div className="relative aspect-video bg-black">
                  <video
                    src={block.mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    {getMediaIcon(block.mediaType)}
                    <span className="text-gray-500 text-sm mt-2 block">No Media</span>
                  </div>
                </div>
              )}
              
              {!block.isActive && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Inactive
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {block.key}
                </span>
                <span className="text-xs text-gray-500">
                  Order: {block.orderIndex}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{block.title}</h3>
              
              {block.content && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{block.content}</p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                {getMediaIcon(block.mediaType)}
                <span>{block.mediaType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(block)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(block.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {contentBlocks.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content blocks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new content block.</p>
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Content Block
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingBlock ? 'Edit Content Block' : 'Add New Content Block'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key (Unique Identifier) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="e.g., experience_media"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media Type
                    </label>
                    <select
                      value={formData.mediaType}
                      onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'image' | 'video' | 'placeholder' })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="placeholder">Placeholder</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media File
                  </label>
                  
                  {/* File Upload Area */}
                  <div className="space-y-4">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                        id="media-upload"
                        disabled={fileUpload.uploading}
                      />
                      <label
                        htmlFor="media-upload"
                        className={`cursor-pointer flex flex-col items-center space-y-2 ${
                          fileUpload.uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                                                 <div>
                           <span className="text-sm font-medium text-gray-900">
                             {fileUpload.uploading 
                               ? 'Uploading...' 
                               : dragOver 
                               ? 'Drop file here' 
                               : 'Click to upload or drag & drop'
                             }
                           </span>
                           <p className="text-xs text-gray-500">
                             Images and videos up to 50MB
                           </p>
                         </div>
                      </label>
                    </div>

                    {/* Upload Progress */}
                    {fileUpload.uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileUpload.progress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Upload Error */}
                    {fileUpload.error && (
                      <div className="text-red-600 text-sm">{fileUpload.error}</div>
                    )}



                    {/* Media Preview */}
                    {formData.mediaUrl && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          {formData.mediaType === 'image' ? (
                            <Image
                              src={formData.mediaUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          ) : formData.mediaType === 'video' ? (
                            <video
                              src={formData.mediaUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              No preview available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Alt Text (For Accessibility)
                  </label>
                  <input
                    type="text"
                    value={formData.mediaAlt}
                    onChange={(e) => setFormData({ ...formData, mediaAlt: e.target.value })}
                    placeholder="Describe the media content"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
                
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingBlock ? 'Update Block' : 'Create Block'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
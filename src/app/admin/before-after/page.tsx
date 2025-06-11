'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import ImagePickerModal from '@/components/ImagePickerModal';

interface BeforeAfterCase {
  id: string;
  title: string;
  patientAge?: number;
  patientGender?: string;
  patientCountry?: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
  treatmentDetails?: string;
  results?: string;
  timeframe?: string;
  categoryId?: string;
  serviceId?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  tags?: string[];
  beforeImageAlt?: string;
  afterImageAlt?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
}

export default function BeforeAfterAdmin() {
  const [cases, setCases] = useState<BeforeAfterCase[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<BeforeAfterCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showBeforeImagePicker, setShowBeforeImagePicker] = useState(false);
  const [showAfterImagePicker, setShowAfterImagePicker] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    patientAge: '',
    patientGender: '',
    patientCountry: '',
    beforeImage: '',
    afterImage: '',
    description: '',
    treatmentDetails: '',
    results: '',
    timeframe: '',
    categoryId: '',
    serviceId: '',
    isFeatured: false,
    isPublished: true,
    sortOrder: 0,
    tags: [] as string[],
    beforeImageAlt: '',
    afterImageAlt: '',
  });

  useEffect(() => {
    fetchCases();
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/admin/before-after');
      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.map((cat: any) => ({
          id: cat.id,
          name: typeof cat.name === 'string' ? JSON.parse(cat.name).en || cat.name : cat.name
        })));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const openModal = (caseToEdit?: BeforeAfterCase) => {
    if (caseToEdit) {
      setEditingCase(caseToEdit);
      setFormData({
        title: caseToEdit.title,
        patientAge: caseToEdit.patientAge?.toString() || '',
        patientGender: caseToEdit.patientGender || '',
        patientCountry: caseToEdit.patientCountry || '',
        beforeImage: caseToEdit.beforeImage,
        afterImage: caseToEdit.afterImage,
        description: caseToEdit.description || '',
        treatmentDetails: caseToEdit.treatmentDetails || '',
        results: caseToEdit.results || '',
        timeframe: caseToEdit.timeframe || '',
        categoryId: caseToEdit.categoryId || '',
        serviceId: caseToEdit.serviceId || '',
        isFeatured: caseToEdit.isFeatured,
        isPublished: caseToEdit.isPublished,
        sortOrder: caseToEdit.sortOrder,
        tags: Array.isArray(caseToEdit.tags) ? caseToEdit.tags : [],
        beforeImageAlt: caseToEdit.beforeImageAlt || '',
        afterImageAlt: caseToEdit.afterImageAlt || '',
      });
    } else {
      setEditingCase(null);
      setFormData({
        title: '',
        patientAge: '',
        patientGender: '',
        patientCountry: '',
        beforeImage: '',
        afterImage: '',
        description: '',
        treatmentDetails: '',
        results: '',
        timeframe: '',
        categoryId: '',
        serviceId: '',
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
        tags: [],
        beforeImageAlt: '',
        afterImageAlt: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = '/api/admin/before-after';
      const method = editingCase ? 'PUT' : 'POST';
      
      const payload = {
        ...(editingCase && { id: editingCase.id }),
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
        toast.success(editingCase ? 'Case updated successfully' : 'Case created successfully');
        closeModal();
        fetchCases();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save case');
      }
    } catch (error) {
      console.error('Error saving case:', error);
      toast.error('Failed to save case');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;

    try {
      const response = await fetch(`/api/admin/before-after?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Case deleted successfully');
        fetchCases();
      } else {
        toast.error('Failed to delete case');
      }
    } catch (error) {
      console.error('Error deleting case:', error);
      toast.error('Failed to delete case');
    }
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
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
            <h1 className="text-3xl font-bold text-gray-900">Before & After Gallery</h1>
            <p className="mt-2 text-gray-600">Manage patient transformation cases</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Case
          </button>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <div className="grid grid-cols-2 gap-1">
                <div className="relative aspect-square">
                  <Image
                    src={caseItem.beforeImage || '/images/placeholder.svg'}
                    alt={caseItem.beforeImageAlt || 'Before'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    Before
                  </div>
                </div>
                <div className="relative aspect-square">
                  <Image
                    src={caseItem.afterImage || '/images/placeholder.svg'}
                    alt={caseItem.afterImageAlt || 'After'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    After
                  </div>
                </div>
              </div>
              
              {caseItem.isFeatured && (
                <div className="absolute top-2 right-2">
                  <StarIcon className="h-6 w-6 text-yellow-500" />
                </div>
              )}
              
              {!caseItem.isPublished && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Draft
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{caseItem.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                {caseItem.patientAge && (
                  <p>Age: {caseItem.patientAge}</p>
                )}
                {caseItem.patientCountry && (
                  <p>Country: {caseItem.patientCountry}</p>
                )}
                {caseItem.timeframe && (
                  <p>Timeframe: {caseItem.timeframe}</p>
                )}
                {caseItem.category && (
                  <p className="text-blue-600">Category: {caseItem.category.name}</p>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(caseItem)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(caseItem.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cases</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new before & after case.</p>
          <div className="mt-6">
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Case
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingCase ? 'Edit Case' : 'Add New Case'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Patient Age
                    </label>
                    <input
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Gender
                    </label>
                    <select
                      value={formData.patientGender}
                      onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Country
                    </label>
                    <input
                      type="text"
                      value={formData.patientCountry}
                      onChange={(e) => setFormData({ ...formData, patientCountry: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Before Image *
                    </label>
                    <div className="space-y-2">
                      {formData.beforeImage && (
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={formData.beforeImage}
                            alt="Before image preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowBeforeImagePicker(true)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        {formData.beforeImage ? 'Change Before Image' : 'Select Before Image'}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      After Image *
                    </label>
                    <div className="space-y-2">
                      {formData.afterImage && (
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={formData.afterImage}
                            alt="After image preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowAfterImagePicker(true)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        {formData.afterImage ? 'Change After Image' : 'Select After Image'}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Before Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.beforeImageAlt}
                      onChange={(e) => setFormData({ ...formData, beforeImageAlt: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      After Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.afterImageAlt}
                      onChange={(e) => setFormData({ ...formData, afterImageAlt: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeframe
                    </label>
                    <input
                      type="text"
                      value={formData.timeframe}
                      onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                      placeholder="e.g., 3 months, 6 weeks"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Details
                  </label>
                  <textarea
                    rows={3}
                    value={formData.treatmentDetails}
                    onChange={(e) => setFormData({ ...formData, treatmentDetails: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Results
                  </label>
                  <textarea
                    rows={3}
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                    onChange={(e) => handleTagInput(e.target.value)}
                    placeholder="facial, rejuvenation, botox"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    Featured Case
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="mr-2"
                    />
                    Published
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
                    {submitting ? 'Saving...' : editingCase ? 'Update Case' : 'Create Case'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Before Image Picker */}
      <ImagePickerModal
        isOpen={showBeforeImagePicker}
        onClose={() => setShowBeforeImagePicker(false)}
        onImageSelect={(imageData) => {
          setFormData(prev => ({
            ...prev,
            beforeImage: imageData.url,
            beforeImageAlt: imageData.alt && !prev.beforeImageAlt ? (imageData.alt || '') : prev.beforeImageAlt
          }));
          setShowBeforeImagePicker(false);
        }}
        title="Select Before Image"
        searchPlaceholder="Search medical images..."
      />
      
      {/* After Image Picker */}
      <ImagePickerModal
        isOpen={showAfterImagePicker}
        onClose={() => setShowAfterImagePicker(false)}
        onImageSelect={(imageData) => {
          setFormData(prev => ({
            ...prev,
            afterImage: imageData.url,
            afterImageAlt: imageData.alt && !prev.afterImageAlt ? (imageData.alt || '') : prev.afterImageAlt
          }));
          setShowAfterImagePicker(false);
        }}
        title="Select After Image"
        searchPlaceholder="Search medical images..."
      />
    </div>
  );
} 
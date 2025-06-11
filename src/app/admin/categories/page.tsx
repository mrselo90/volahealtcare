'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { RiAddLine, RiLoader4Line, RiDeleteBinLine } from 'react-icons/ri';

// Import components
import Modal from './Modal';
import CategoryForm from './CategoryForm';
import CategoryCard from './CategoryCard';
import EmptyState from './EmptyState';
import ConfirmModal from './ConfirmModal';
import { CategoryData, CategoryFormData } from './types';
import { getCategoryName, createCategoryNameJson, validateCategoryData } from '@/utils/categoryUtils';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProps, setConfirmProps] = useState<{ onConfirm: () => void; title?: string; message: string; confirmText?: string; cancelText?: string; loading?: boolean }>({ onConfirm: () => {}, message: '' });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCategory = async (formData: CategoryFormData & { imageFile?: File }) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const { imageFile, ...categoryData } = formData;
      const formDataToSend = new FormData();
      
      // Add all category data as JSON
      // Ensure name is always a JSON string with 'en' key
      let nameObj: any;
      try {
        nameObj = typeof categoryData.name === 'string' ? JSON.parse(categoryData.name) : categoryData.name;
      } catch {
        nameObj = { en: categoryData.name };
      }
      // Fallback: if no 'en', use as string
      if (!nameObj || typeof nameObj !== 'object' || !nameObj.en) {
        nameObj = { en: typeof categoryData.name === 'string' ? categoryData.name : '' };
      }
      if (!nameObj.en || nameObj.en.trim() === '') {
        toast.error('Name is required');
        setIsSaving(false);
        return;
      }
      formDataToSend.append('name', JSON.stringify(nameObj));
      formDataToSend.append('description', categoryData.description);
      formDataToSend.append('slug', categoryData.slug);
      
      if (categoryData.imageUrl) {
        formDataToSend.append('imageUrl', categoryData.imageUrl);
      }
      
      // Add image file if present
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // For updates, include the ID as a query parameter
      const baseUrl = '/api/admin/categories';
      const url = editingCategory 
        ? `${baseUrl}?id=${editingCategory.id}`
        : baseUrl;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || (editingCategory ? 'Failed to update category' : 'Failed to create category'));
      }
      
      toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(err instanceof Error ? err.message : (editingCategory ? 'Failed to update category' : 'Failed to create category'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setConfirmProps({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      loading: isSaving,
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          setIsSaving(true);
          const response = await fetch(`/api/admin/categories?id=${id}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (!response.ok) {
            // Check if this is a soft error about linked services
            if (response.status === 400 && data.services) {
              setConfirmProps({
                title: 'Force Delete Category',
                message: `This category has ${data.services.length} linked services. Do you want to delete it anyway? This will unlink all services from this category.`,
                confirmText: 'Force Delete',
                cancelText: 'Cancel',
                loading: isSaving,
                onConfirm: async () => {
                  setConfirmOpen(false);
                  // Retry with force=true
                  await fetch(`/api/admin/categories?id=${id}&force=true`, {
                    method: 'DELETE',
                  });
                  toast.success('Category deleted and services unlinked');
                  fetchCategories();
                }
              });
              setConfirmOpen(true);
              return;
            }
            throw new Error(data.error || 'Failed to delete category');
          }
          toast.success(data.message || 'Category deleted successfully');
          fetchCategories();
        } catch (err) {
          console.error('Delete error:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
          toast.error(err instanceof Error ? err.message : 'Failed to delete category');
        } finally {
          setIsSaving(false);
        }
      }
    });
    setConfirmOpen(true);
  };

  const handleCleanupImages = () => {
    setConfirmProps({
      title: 'Cleanup Missing Images',
      message: 'This will remove references to any missing category images. Continue?',
      confirmText: 'Cleanup',
      cancelText: 'Cancel',
      loading: isCleaning,
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          setIsCleaning(true);
          const response = await fetch('/api/admin/cleanup', {
            method: 'POST',
          });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || 'Failed to clean up images');
          }
          toast.success(`Cleanup completed. Updated ${result.updatedCategories} categories.`);
          fetchCategories(); // Refresh the list
        } catch (err) {
          console.error('Error during cleanup:', err);
          toast.error(err instanceof Error ? err.message : 'Failed to clean up images');
        } finally {
          setIsCleaning(false);
        }
      }
    });
    setConfirmOpen(true);
  };

  const handleMoveCategory = async (id: string, direction: 'up' | 'down') => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/categories/${id}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder categories');
      }
      
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to reorder categories');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to ensure value is JSON string with 'en' key
  const ensureJsonString = (val: any) => {
    if (!val) return JSON.stringify({ en: '' });
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (typeof parsed === 'object' && parsed !== null && parsed.en !== undefined) {
          return JSON.stringify(parsed);
        }
      } catch {
        // Not JSON, treat as plain string
        return JSON.stringify({ en: val });
      }
    }
    if (typeof val === 'object' && val.en !== undefined) {
      return JSON.stringify(val);
    }
    return JSON.stringify({ en: String(val) });
  };

  const openEditModal = (category: CategoryData) => {
    // Patch: always wrap name/description as JSON string for editing
    setEditingCategory({
      ...category,
      name: ensureJsonString(category.name),
      description: ensureJsonString(category.description),
    });
    setIsModalOpen(true);
  };


  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RiLoader4Line className="animate-spin h-12 w-12 text-amber-600" />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        open={confirmOpen}
        title={confirmProps.title}
        message={confirmProps.message}
        confirmText={confirmProps.confirmText}
        cancelText={confirmProps.cancelText}
        onConfirm={confirmProps.onConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={confirmProps.loading}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleCleanupImages}
            disabled={isLoading || isCleaning}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCleaning ? (
              <>
                <RiLoader4Line className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Cleaning...
              </>
            ) : (
              <>
                <RiDeleteBinLine className="-ml-1 mr-2 h-4 w-4" />
                Cleanup Missing Images
              </>
            )}
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <RiAddLine className="-ml-1 mr-2 h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState onAddCategory={openCreateModal} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories.map((category, index) => (
              <li key={category.id}>
                <CategoryCard
                  category={category}
                  index={index}
                  total={categories.length}
                  onEdit={() => openEditModal(category)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  onMove={handleMoveCategory}
                  loading={isSaving}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={closeModal}
          loading={isSaving}
        />
      </Modal>
    </div>
    </>
  );
}

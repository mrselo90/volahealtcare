'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RiEdit2Line, RiDeleteBin6Line, RiAddLine } from 'react-icons/ri';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getCategoryName } from '@/utils/categoryUtils';
import { getServiceImageUrl, getServiceImageAlt } from '@/utils/imageUtils';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  price: number;
  duration: string;
  currency: string;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  translations: Array<{
    language: string;
    title: string;
    description: string;
  }>;
}

export default function AdminServices() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchServices();
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
      setLoading(false);
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/admin/services/edit/${slug}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete service');
      }

      // Refresh the services list
      fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch('/api/admin/services/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear services');
      }

      // Refresh the page to show empty state
      window.location.reload();
    } catch (error) {
      console.error('Error clearing services:', error);
      alert('Failed to clear services. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear All Services</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all services,
                  their translations, images, and FAQs from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => router.push('/admin/services/new')}>
            Add New Service
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {services.map((service, idx) => (
                <tr key={service.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/40 hover:bg-amber-100/60'}>
                  <td className="px-6 py-4 align-middle">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                            <Image
                        src={getServiceImageUrl(service)}
                        alt={getServiceImageAlt(service, service.title)}
                              fill
                              className="object-cover"
                            />
                      </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{service.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {(() => {
                      // First try to use the included category data
                      if (service.category) {
                        return getCategoryName(service.category);
                      }
                      
                      // Fallback to finding by categoryId
                      const cat = categories.find(c => c.id === service.categoryId);
                      if (cat) {
                        return getCategoryName(cat);
                      }
                      
                      return service.categoryId;
                    })()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{service.price} {service.currency}</td>
                  <td className="px-6 py-4 text-gray-700">{service.duration}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(service.slug)}
                      className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow transition-all"
                    >
                      <RiEdit2Line className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition-all"
                    >
                      <RiDeleteBin6Line className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
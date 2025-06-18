'use client';

import { useState, useEffect } from 'react';
import { RiStarLine, RiEditLine, RiDeleteBinLine, RiAddLine, RiStarFill, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

interface Testimonial {
  id: string;
  rating: number;
  review: string;
  country: string;
  photoUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  service: {
    id: string;
    title: string;
    slug: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Service {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    rating: 5,
    review: '',
    country: '',
    userName: '',
    categoryId: '',
    serviceId: '',
    photo: null as File | null
  });

  useEffect(() => {
    fetchTestimonials();
    fetchServices();
    fetchCategories();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isApproved }),
      });

      if (!response.ok) throw new Error('Failed to update testimonial');
      
      setTestimonials(prev => 
        prev.map(t => t.id === id ? { ...t, isApproved } : t)
      );
      
      toast.success(isApproved ? 'Testimonial approved' : 'Testimonial unapproved');
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleFeature = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isFeatured }),
      });

      if (!response.ok) throw new Error('Failed to update testimonial');
      
      setTestimonials(prev => 
        prev.map(t => t.id === id ? { ...t, isFeatured } : t)
      );
      
      toast.success(isFeatured ? 'Testimonial featured' : 'Testimonial unfeatured');
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');
      
      setTestimonials(prev => prev.filter(t => t.id !== id));
      toast.success('Testimonial deleted successfully');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let photoUrl = '';
      
      // Upload photo if selected
      if (newTestimonial.photo) {
        const formData = new FormData();
        formData.append('file', newTestimonial.photo);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          photoUrl = uploadResult.url;
        } else {
          throw new Error('Failed to upload photo');
        }
      }
      
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: newTestimonial.serviceId,
          rating: newTestimonial.rating,
          review: newTestimonial.review,
          country: newTestimonial.country,
          photoUrl: photoUrl,
          userName: newTestimonial.userName,
          isApproved: true, // Auto-approve admin-created testimonials
          isFeatured: false
        }),
      });

      if (!response.ok) throw new Error('Failed to add testimonial');
      
      const addedTestimonial = await response.json();
      setTestimonials(prev => [addedTestimonial, ...prev]);
      setShowAddModal(false);
      setNewTestimonial({
        rating: 5,
        review: '',
        country: '',
        userName: '',
        categoryId: '',
        serviceId: '',
        photo: null
      });
      toast.success('Testimonial added successfully');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? (
        <RiStarFill key={index} className="h-4 w-4 text-yellow-400" />
      ) : (
        <RiStarLine key={index} className="h-4 w-4 text-gray-300" />
      )
    ));
  };

  // Filter services based on selected category
  const filteredServices = newTestimonial.categoryId 
    ? services.filter(service => service.category.id === newTestimonial.categoryId)
    : services;

  return (
    <div className="relative space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Testimonials</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2 rounded-lg shadow hover:bg-amber-600 transition-all text-lg font-semibold"
        >
          <RiAddLine className="h-5 w-5" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <RiStarLine className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No testimonials</h3>
          <p className="mt-1 text-sm text-gray-500">No testimonials have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white shadow-lg ring-1 ring-gray-900/5 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-amber-200 transition-shadow ${
                testimonial.isFeatured ? 'ring-2 ring-amber-400' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {testimonial.user?.name || 'Anonymous'}
                    </h3>
                    {testimonial.isFeatured && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{testimonial.service.title}</p>
                  <p className="text-xs text-gray-400">{testimonial.country}</p>
                </div>
                
                {/* Status indicators */}
                <div className="flex flex-col items-end gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    testimonial.isApproved ? 'bg-green-400' : 'bg-red-400'
                  }`} title={testimonial.isApproved ? 'Approved' : 'Pending approval'} />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Review */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                {testimonial.review}
              </p>

              {/* Photo indicator */}
              {testimonial.photoUrl && (
                <div className="flex items-center gap-2">
                  <img
                    src={testimonial.photoUrl}
                    alt="Testimonial photo"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span>📷</span>
                    <span>Has photo</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Approve/Unapprove */}
                  <button
                    onClick={() => handleApprove(testimonial.id, !testimonial.isApproved)}
                    className={`p-2 rounded-full transition-colors ${
                      testimonial.isApproved 
                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={testimonial.isApproved ? 'Unapprove' : 'Approve'}
                  >
                    <RiCheckLine className="h-4 w-4" />
                  </button>

                  {/* Feature/Unfeature */}
                  <button
                    onClick={() => handleFeature(testimonial.id, !testimonial.isFeatured)}
                    className={`p-2 rounded-full transition-colors ${
                      testimonial.isFeatured 
                        ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' 
                        : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                    title={testimonial.isFeatured ? 'Unfeature' : 'Feature'}
                  >
                    <RiStarFill className="h-4 w-4" />
                  </button>



                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                    title="Delete testimonial"
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Testimonial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Testimonial</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <RiCloseLine className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  required
                  value={newTestimonial.userName}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={newTestimonial.categoryId}
                  onChange={(e) => setNewTestimonial(prev => ({ 
                    ...prev, 
                    categoryId: e.target.value,
                    serviceId: '' // Reset service when category changes
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  required
                  value={newTestimonial.serviceId}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, serviceId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  disabled={!newTestimonial.categoryId}
                >
                  <option value="">Select a service</option>
                  {filteredServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={newTestimonial.country}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={newTestimonial.review}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, review: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewTestimonial(prev => ({ 
                    ...prev, 
                    photo: e.target.files?.[0] || null 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {newTestimonial.photo && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {newTestimonial.photo.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
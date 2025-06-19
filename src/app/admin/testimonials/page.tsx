'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Star, User, Calendar, Globe, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  title: string;
  slug: string;
}

interface Testimonial {
  id: string;
  name: string;
  serviceId: string;
  rating: number;
  review: string;
  country: string;
  photoUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  service: {
    title: string;
    slug: string;
  };
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  translations: Array<{
    id: string;
    language: string;
    review: string;
  }>;
}

interface TestimonialFormData {
  name: string;
  serviceId: string;
  rating: number;
  review: string;
  country: string;
  photoUrl: string;
  isApproved: boolean;
  isFeatured: boolean;
  translations: Array<{
    language: string;
    review: string;
  }>;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    serviceId: '',
    rating: 5,
    review: '',
    country: '',
    photoUrl: '',
    isApproved: false,
    isFeatured: false,
    translations: []
  });

  useEffect(() => {
    fetchServices();
    fetchTestimonials();
  }, [selectedStatus, selectedService]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      if (selectedService !== 'all') {
        params.append('serviceId', selectedService);
      }

      const response = await fetch(`/api/admin/testimonials?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Patient name is required');
      return;
    }
    if (!formData.country.trim()) {
      toast.error('Country is required');
      return;
    }
    if (!formData.serviceId) {
      toast.error('Please select a service');
      return;
    }
    if (!formData.review.trim()) {
      toast.error('Review is required');
      return;
    }
    if (formData.review.length > 500) {
      toast.error('Review must be less than 500 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const url = editingTestimonial 
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : '/api/admin/testimonials';
      
      const method = editingTestimonial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingTestimonial ? 'Testimonial updated!' : 'Testimonial created!');
        setIsDialogOpen(false);
        setEditingTestimonial(null);
        resetForm();
        fetchTestimonials();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Testimonial deleted!');
        fetchTestimonials();
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleApprovalToggle = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isApproved: !testimonial.isApproved
        }),
      });

      if (response.ok) {
        toast.success(testimonial.isApproved ? 'Testimonial unapproved' : 'Testimonial approved');
        fetchTestimonials();
      } else {
        toast.error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleFeaturedToggle = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured: !testimonial.isFeatured
        }),
      });

      if (response.ok) {
        toast.success(testimonial.isFeatured ? 'Removed from featured' : 'Added to featured');
        fetchTestimonials();
      } else {
        toast.error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      serviceId: testimonial.serviceId,
      rating: testimonial.rating,
      review: testimonial.review,
      country: testimonial.country,
      photoUrl: testimonial.photoUrl || '',
      isApproved: testimonial.isApproved,
      isFeatured: testimonial.isFeatured,
      translations: testimonial.translations || []
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      serviceId: '',
      rating: 5,
      review: '',
      country: '',
      photoUrl: '',
      isApproved: false,
      isFeatured: false,
      translations: []
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonials Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingTestimonial(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Patient Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter patient name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: rating }, (_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              {Array.from({ length: 5 - rating }, (_, i) => (
                                <Star key={i + rating} className="w-4 h-4 text-gray-300" />
                              ))}
                            </div>
                            <span>{rating} Star{rating > 1 ? 's' : ''}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="photoUrl">Photo URL (optional)</Label>
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="review">Review *</Label>
                <Textarea
                  id="review"
                  rows={4}
                  placeholder="Write the patient's review here..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                />
                <p className={`text-sm mt-1 ${
                  formData.review.length > 500 
                    ? 'text-red-500' 
                    : formData.review.length > 400 
                    ? 'text-yellow-500' 
                    : 'text-muted-foreground'
                }`}>
                  {formData.review.length}/500 characters
                </p>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approved"
                    checked={formData.isApproved}
                    onCheckedChange={(checked) => setFormData({ ...formData, isApproved: !!checked })}
                  />
                  <Label htmlFor="approved" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Approved
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
                  />
                  <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Featured
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    `${editingTestimonial ? 'Update' : 'Create'} Testimonial`
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-8">Loading testimonials...</div>
      ) : (
        <div className="grid gap-4">
          {testimonials.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No testimonials found</p>
              </CardContent>
            </Card>
          ) : (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {testimonial.photoUrl ? (
                        <img
                          src={testimonial.photoUrl}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          {testimonial.country}
                          <Calendar className="w-4 h-4 ml-2" />
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={testimonial.isApproved ? "default" : "outline"}
                        onClick={() => handleApprovalToggle(testimonial)}
                      >
                        {testimonial.isApproved ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={testimonial.isFeatured ? "default" : "outline"}
                        onClick={() => handleFeaturedToggle(testimonial)}
                      >
                        <Star className={`w-4 h-4 ${testimonial.isFeatured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(testimonial)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this testimonial? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                      <Badge variant="outline">{testimonial.service.title}</Badge>
                      {testimonial.isApproved && (
                        <Badge variant="default">Approved</Badge>
                      )}
                      {testimonial.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {testimonial.review}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
} 
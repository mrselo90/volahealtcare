'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, MessageSquare, User, Globe, Camera, CheckCircle, AlertCircle, X, Heart, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface TestimonialFormProps {
  serviceId?: string;
  serviceName?: string;
  trigger?: React.ReactNode;
  onSubmitSuccess?: () => void;
}

interface FormData {
  name: string;
  country: string;
  rating: number;
  review: string;
  photoUrl: string;
}

const STEP_NAMES = ['Basic Info', 'Your Rating', 'Your Story'];

export default function TestimonialForm({ 
  serviceId, 
  serviceName, 
  trigger,
  onSubmitSuccess
}: TestimonialFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    country: '',
    rating: 5,
    review: '',
    photoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceId) {
      toast.error('Service not found');
      return;
    }

    if (!formData.name || !formData.country || !formData.review) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceId,
        }),
      });

      if (response.ok) {
        toast.success('Thank you for your review! It will be published after approval.');
        setIsOpen(false);
        resetForm();
        onSubmitSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      rating: 5,
      review: '',
      photoUrl: ''
    });
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() && formData.country.trim();
      case 1:
        return formData.rating > 0;
      case 2:
        return formData.review.trim().length >= 10;
      default:
        return false;
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
      >
        <Star
          className={`${sizeClasses[size]} cursor-pointer transition-all duration-200 ${
            i < rating 
              ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          onClick={interactive ? () => setFormData({ ...formData, rating: i + 1 }) : undefined}
        />
      </motion.div>
    ));
  };

  const defaultTrigger = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        variant="outline" 
        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 text-blue-700 font-medium shadow-sm"
      >
        <Heart className="w-4 h-4" />
        Share Your Experience
        <Sparkles className="w-4 h-4" />
      </Button>
    </motion.div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {STEP_NAMES.map((stepName, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              index <= currentStep
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              backgroundColor: index <= currentStep ? '#2563eb' : '#e5e7eb'
            }}
          >
            {index < currentStep ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </motion.div>
          {index < STEP_NAMES.length - 1 && (
            <div 
              className={`w-12 h-0.5 mx-2 transition-colors ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Tell us about yourself</h3>
              <p className="text-sm text-gray-600">We'd love to know who you are</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Your Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country *
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Your country"
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="photoUrl" className="text-sm font-medium text-gray-700">
                  Photo URL (optional)
                </Label>
                <div className="relative mt-1">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="photoUrl"
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="Link to your photo (optional)"
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Rate your experience</h3>
              <p className="text-sm text-gray-600">How would you rate your overall experience?</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                {renderStars(formData.rating, true, 'lg')}
              </div>
              <motion.div
                key={formData.rating}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-blue-600 mb-2"
              >
                {formData.rating}/5
              </motion.div>
              <div className="text-sm text-gray-600">
                {formData.rating === 5 && "Excellent! 🌟"}
                {formData.rating === 4 && "Very Good! 👍"}
                {formData.rating === 3 && "Good 👌"}
                {formData.rating === 2 && "Fair 😐"}
                {formData.rating === 1 && "Poor 😞"}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Share your story</h3>
              <p className="text-sm text-gray-600">Tell others about your experience</p>
            </div>
            
            <div>
              <Label htmlFor="review" className="text-sm font-medium text-gray-700">
                Your Review *
              </Label>
              <Textarea
                id="review"
                rows={6}
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder="Share your experience with us... What did you like? How was the service? Would you recommend it?"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <div className={`text-xs ${formData.review.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.review.length < 10 ? 'At least 10 characters required' : 'Looking good!'}
                </div>
                <div className="text-xs text-gray-500">
                  {formData.review.length}/500 characters
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Review Guidelines:</p>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Be honest and specific about your experience</li>
                    <li>• Reviews are moderated before publication</li>
                    <li>• Please respect patient privacy</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Heart className="w-5 h-5" />
              Share Your Experience
            </DialogTitle>
            {serviceName && (
              <p className="text-blue-100 text-sm">
                How was your {serviceName} experience?
              </p>
            )}
          </DialogHeader>
        </div>
        
        <div className="p-6">
          <StepIndicator />
          
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 0 ? () => setIsOpen(false) : prevStep}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {currentStep === 0 ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  'Previous'
                )}
              </Button>
              
              {currentStep < 2 ? (
                <Button 
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <motion.div
                    animate={{ x: canProceed() ? 0 : -2 }}
                    transition={{ repeat: canProceed() ? 0 : Infinity, duration: 0.5 }}
                  >
                    →
                  </motion.div>
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !canProceed()}
                  className="min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Submit Review
                    </div>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
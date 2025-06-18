'use client';

import { useState } from 'react';
import ImagePicker from '@/components/ImagePicker';
import { motion } from 'framer-motion';
import { 
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';

interface BeforeAfterData {
  beforeImageUrl: string;
  beforeImageAlt: string;
  afterImageUrl: string;
  afterImageAlt: string;
  title: string;
  description: string;
  serviceId?: string;
}

interface BeforeAfterFormProps {
  initialData?: Partial<BeforeAfterData>;
  onSubmit: (data: BeforeAfterData) => Promise<void>;
  isLoading?: boolean;
}

export default function BeforeAfterForm({ 
  initialData, 
  onSubmit, 
  isLoading = false 
}: BeforeAfterFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BeforeAfterData>({
    beforeImageUrl: initialData?.beforeImageUrl || '',
    beforeImageAlt: initialData?.beforeImageAlt || '',
    afterImageUrl: initialData?.afterImageUrl || '',
    afterImageAlt: initialData?.afterImageAlt || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    serviceId: initialData?.serviceId || ''
  });

  const [errors, setErrors] = useState<Partial<BeforeAfterData>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof BeforeAfterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (field: 'beforeImageUrl' | 'afterImageUrl') => 
    (url: string, altText?: string) => {
      const altField = field === 'beforeImageUrl' ? 'beforeImageAlt' : 'afterImageAlt';
      setFormData(prev => ({
        ...prev,
        [field]: url,
        [altField]: altText || prev[altField]
      }));
      
      // Clear errors
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<BeforeAfterData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.beforeImageUrl.trim()) {
      newErrors.beforeImageUrl = 'Before image is required';
    }

    if (!formData.afterImageUrl.trim()) {
      newErrors.afterImageUrl = 'After image is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitStatus('idle');
      await onSubmit(formData);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          beforeImageUrl: '',
          beforeImageAlt: '',
          afterImageUrl: '',
          afterImageAlt: '',
          title: '',
          description: '',
          serviceId: ''
        });
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {initialData ? 'Edit Before & After' : 'Add Before & After Images'}
        </h2>
        <p className="text-gray-600">
          Showcase your medical transformation results with professional before and after images.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Hollywood Smile Transformation"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service (Optional)
            </label>
            <select
              value={formData.serviceId || ''}
              onChange={(e) => handleInputChange('serviceId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a service</option>
              <option value="hollywood-smile">Hollywood Smile</option>
              <option value="dental-veneers">Dental Veneers</option>
              <option value="teeth-whitening">Teeth Whitening</option>
              <option value="rhinoplasty">Rhinoplasty</option>
              <option value="facelift">Facelift</option>
              <option value="breast-augmentation">Breast Augmentation</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('results.description') || 'Description'} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the transformation, procedure details, recovery time, etc."
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <ExclamationTriangleIcon className="h-4 w-4" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Image Pickers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before Image */}
          <div>
            <ImagePicker
              value={formData.beforeImageUrl}
              onChange={handleImageChange('beforeImageUrl')}
              label="Before Image"
              required={true}
              placeholder="Select before treatment image"
              className={errors.beforeImageUrl ? 'border-red-500' : ''}
            />
            {errors.beforeImageUrl && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {errors.beforeImageUrl}
              </p>
            )}
            
            {/* Before Alt Text */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Before Image Alt Text
              </label>
              <input
                type="text"
                value={formData.beforeImageAlt}
                onChange={(e) => handleInputChange('beforeImageAlt', e.target.value)}
                placeholder="Describe the before image for accessibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* After Image */}
          <div>
            <ImagePicker
              value={formData.afterImageUrl}
              onChange={handleImageChange('afterImageUrl')}
              label="After Image"
              required={true}
              placeholder="Select after treatment image"
              className={errors.afterImageUrl ? 'border-red-500' : ''}
            />
            {errors.afterImageUrl && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {errors.afterImageUrl}
              </p>
            )}
            
            {/* After Alt Text */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Image Alt Text
              </label>
              <input
                type="text"
                value={formData.afterImageAlt}
                onChange={(e) => handleInputChange('afterImageAlt', e.target.value)}
                placeholder="Describe the after image for accessibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {formData.beforeImageUrl && formData.afterImageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Before</p>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={formData.beforeImageUrl}
                    alt={formData.beforeImageAlt || 'Before treatment'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">After</p>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={formData.afterImageUrl}
                    alt={formData.afterImageAlt || 'After treatment'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            {formData.title && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900">{formData.title}</h4>
                {formData.description && (
                  <p className="text-gray-600 mt-1">{formData.description}</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg"
          >
            <CheckCircleIcon className="h-5 w-5" />
            <span>Before & After images saved successfully!</span>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg"
          >
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>Failed to save. Please try again.</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <DocumentCheckIcon className="h-5 w-5" />
                {initialData ? 'Update' : 'Save'} Before & After
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
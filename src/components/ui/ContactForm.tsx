'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  serviceId: string;
  preferredDate: string;
  notes: string;
}

interface ContactFormProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function ContactForm({ isModal = false, onClose }: ContactFormProps = {}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    serviceId: '',
    preferredDate: '',
    notes: '',
  });

  const [services, setServices] = useState<{ id: string; title: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        // Use only id and title for dropdown
        const serviceOptions = data.map((s: any) => ({ id: s.id, title: s.title }));
        setServices(serviceOptions);
        // Default to first service if available
        if (serviceOptions.length > 0) {
          setFormData(prev => ({ ...prev, serviceId: serviceOptions[0].id }));
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preferredDate: formData.preferredDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        serviceId: services[0]?.id || '',
        preferredDate: '',
        notes: '',
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Conditional wrapper for modal vs full page
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isModal) {
      return <div className="max-w-lg mx-auto">{children}</div>;
    }
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
    );
  };

  return (
    <ContentWrapper>
      {/* Header - Hide in modal mode */}
      {!isModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('contact.form.title') || 'Book Your'} <span className="text-blue-600">{t('contact.form.freeConsultation') || 'Free Consultation'}</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {t('contact.form.subtitle') || 'Take the first step towards your transformation. Our expert medical team is ready to guide you through your journey.'}
          </p>
        </motion.div>
      )}

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: isModal ? 0 : 0.2 }}
        className={isModal ? "" : "bg-white rounded-3xl shadow-2xl overflow-hidden"}
      >
        {/* Form Container */}
        <div className={isModal ? "space-y-6" : "p-8 lg:p-12"}>
            {/* Success Message */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">{t('contact.messages.success') || 'Consultation Booked Successfully!'}</h3>
                    <p className="text-green-700 mt-1">
                      {t('contact.messages.successDesc') || 'Thank you for choosing us. Our team will contact you within 24 hours to confirm your appointment.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <XMarkIcon className="h-10 w-10 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">{t('contact.messages.error') || 'Booking Failed'}</h3>
                    <p className="text-red-700 mt-1">
                      {t('contact.messages.errorDesc') || 'We\'re sorry, something went wrong. Please try again or contact us directly.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          <form onSubmit={handleSubmit} className={isModal ? "space-y-4" : "space-y-8"}>
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  {t('contact.form.personalInfo') || 'Personal Information'}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
        <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.fullName') || 'Full Name'} *
                    </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder={t('contact.form.fullNamePlaceholder') || 'Enter your full name'}
          />
        </div>

        <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.email') || 'Email Address'} *
                    </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder={t('contact.form.emailPlaceholder') || 'your.email@example.com'}
          />
        </div>

        <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.phone') || 'Phone Number'} *
                    </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder={t('contact.form.phonePlaceholder') || '+1 (555) 123-4567'}
          />
        </div>

        <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.country') || 'Country'} *
                    </label>
          <input
            type="text"
            name="country"
            id="country"
            required
            value={formData.country}
            onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder={t('contact.form.countryPlaceholder') || 'United States'}
          />
                  </div>
                </div>
        </div>

              {/* Service Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  {t('contact.form.serviceSchedule') || 'Service & Schedule'}
                </h3>
                <div className="space-y-6">
        <div>
                                        <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.service') || 'Interested Service'} *
                    </label>
                    <div className="relative">
          <select
            name="serviceId"
            id="serviceId"
            required
            value={formData.serviceId}
            onChange={handleChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg appearance-none bg-white"
          >
            {services.length === 0 && (
              <option value="">{t('contact.form.loadingServices') || 'Loading services...'}</option>
            )}
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.title}</option>
            ))}
          </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
                    </div>
        </div>

        <div>
                                        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.preferredDate') || 'Preferred Date & Time'}
                    </label>
          <input
            type="datetime-local"
            name="preferredDate"
            id="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
          />
                    <p className="text-sm text-gray-500 mt-2">
                      {t('contact.form.dateOptional') || 'Optional: Leave blank and we\'ll contact you to schedule'}
                    </p>
        </div>

        <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.notes') || 'Additional Notes'}
                    </label>
          <textarea
            name="notes"
            id="notes"
                      rows={4}
            value={formData.notes}
            onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg resize-none"
                      placeholder={t('contact.form.notesPlaceholder') || 'Tell us about your goals, concerns, or any questions you have...'}
          />
                  </div>
                </div>
        </div>

            {/* Submit Button */}
            <div className="pt-4">
              {isModal && onClose ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        {t('contact.form.booking') || 'Booking...'}
                      </>
                    ) : (
                      <>
                        📅 {t('contact.form.bookConsultation') || 'Book Consultation'}
                      </>
                    )}
                  </button>
                </div>
              ) : (
          <button
            type="submit"
            disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
          >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                      {t('contact.form.bookingConsultation') || 'Booking Your Consultation...'}
                    </>
                  ) : (
                    <>
                      📅 {t('contact.form.bookFreeConsultation') || 'Book Free Consultation'}
                    </>
                  )}
          </button>
              )}
            </div>
            </form>
        </div>

        {/* Contact Information Footer - Only show in full page mode */}
        {!isModal && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 lg:px-12 py-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Need immediate assistance?
              </h4>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a 
                  href="tel:+1555123456" 
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors font-medium text-lg"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  +1 (555) 123-4567
                </a>
                <a 
                  href="mailto:info@example.com" 
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors font-medium text-lg"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  info@example.com
                </a>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Available 24/7 for consultations and emergencies
                </p>
              </div>
            </div>
        )}
    </motion.div>
    </ContentWrapper>
  );
} 
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface ConsultationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  age: string;
  gender: string;
  interestedServices: string[];
  preferredDate: string;
  preferredTime: string;
  medicalHistory: string;
  currentMedications: string;
  budget: string;
  additionalInfo: string;
  contactMethod: string;
}

const services = [
  'Hollywood Smile',
  'Dental Veneers',
  'Dental Implants',
  'Teeth Whitening',
  'Rhinoplasty',
  'Facelift',
  'Brow Lift',
  'Eyelid Surgery',
  'Breast Augmentation',
  'Breast Lift',
  'Tummy Tuck',
  'Liposuction',
  'Hair Transplant',
  'Other'
];

export default function ConsultationPage() {
  const [formData, setFormData] = useState<ConsultationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    age: '',
    gender: '',
    interestedServices: [],
    preferredDate: '',
    preferredTime: '',
    medicalHistory: '',
    currentMedications: '',
    budget: '',
    additionalInfo: '',
    contactMethod: 'email'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<ConsultationForm>>({});

  const totalSteps = 4;

  const handleInputChange = (field: keyof ConsultationForm, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleServiceToggle = (service: string) => {
    const current = formData.interestedServices;
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service];
    handleInputChange('interestedServices', updated);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ConsultationForm> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        break;
      case 2:
        if (formData.interestedServices.length === 0) {
          newErrors.interestedServices = 'Please select at least one service';
        }
        break;
      case 3:
        if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit consultation');
      }

      const result = await response.json();
      console.log('Consultation submitted successfully:', result);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25"
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Services of Interest</h3>
              <p className="text-gray-600 mb-6">
                Select all procedures you're interested in learning about:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {services.map((service) => (
                  <button
                    key={service}
                    onClick={() => handleServiceToggle(service)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.interestedServices.includes(service)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{service}</span>
                      {formData.interestedServices.includes(service) && (
                        <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {errors.interestedServices && (
                <p className="mt-2 text-sm text-red-600">{errors.interestedServices}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultation Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select preferred time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="09:15">9:15 AM</option>
                    <option value="09:30">9:30 AM</option>
                    <option value="09:45">9:45 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:15">10:15 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="10:45">10:45 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:15">11:15 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="11:45">11:45 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:15">12:15 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="12:45">12:45 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:15">1:15 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="13:45">1:45 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:15">2:15 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="14:45">2:45 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:15">3:15 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="15:45">3:45 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:15">4:15 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="16:45">4:45 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'email', label: 'Email', icon: EnvelopeIcon },
                    { value: 'phone', label: 'Phone Call', icon: PhoneIcon },
                    { value: 'whatsapp', label: 'WhatsApp', icon: ChatBubbleLeftRightIcon }
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => handleInputChange('contactMethod', method.value)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.contactMethod === method.value
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <method.icon className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe any relevant medical history, previous surgeries, or conditions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="List any medications you're currently taking..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Any additional questions, concerns, or information you'd like to share..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Consultation Request Submitted!
            </h2>
            <p className="text-gray-600 mb-8">
                              Thank you for your interest in Vola Health Istanbul. We've received your consultation request and our team will contact you within 24 hours to schedule your free consultation.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Return to Homepage
              </Link>
              <div className="text-sm text-gray-500">
                <p>Questions? Call us at <strong>+90 544 474 98 81</strong></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Free Medical Consultation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized advice from our expert medical team. Complete this form to schedule your complimentary consultation.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: ShieldCheckIcon,
              title: 'Completely Free',
              description: 'No cost, no obligation consultation with medical experts'
            },
            {
              icon: ClockIcon,
              title: '15 Minutes',
              description: 'Comprehensive evaluation and personalized treatment plan'
            },
            {
              icon: HeartIcon,
              title: 'Expert Care',
              description: 'Board-certified surgeons with international experience'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <benefit.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 lg:p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      Schedule Consultation
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Prefer to speak with us directly?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+905444749881"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
                                +90 544 474 98 81
            </a>
            <a
              href="mailto:info@volahealthistanbul.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
                              info@volahealthistanbul.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
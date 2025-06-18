'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/hooks';
import {
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  HeartIcon,
  ShieldCheckIcon
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

export default function ConsultationPage() {
  const { t } = useTranslation();

  const services = [
    t('consultation.services.hollywoodSmile') || 'Hollywood Smile',
    t('consultation.services.dentalVeneers') || 'Dental Veneers',
    t('consultation.services.dentalImplants') || 'Dental Implants',
    t('consultation.services.zirconiumCrowns') || 'Zirconium Crowns',
    t('consultation.services.teethWhitening') || 'Teeth Whitening',
    t('consultation.services.rhinoplasty') || 'Rhinoplasty',
    t('consultation.services.facelift') || 'Facelift',
    t('consultation.services.browLift') || 'Brow Lift',
    t('consultation.services.eyelidSurgery') || 'Eyelid Surgery',
    t('consultation.services.breastAugmentation') || 'Breast Augmentation',
    t('consultation.services.breastLift') || 'Breast Lift',
    t('consultation.services.tummyTuck') || 'Tummy Tuck',
    t('consultation.services.liposuction') || 'Liposuction',
    t('consultation.services.hairTransplant') || 'Hair Transplant',
    t('consultation.services.other') || 'Other'
  ];

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
  const [errors, setErrors] = useState<Partial<Record<keyof ConsultationForm, string>>>({});

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
    const newErrors: Partial<Record<keyof ConsultationForm, string>> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = t('consultation.errors.firstNameRequired') || 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = t('consultation.errors.lastNameRequired') || 'Last name is required';
        if (!formData.email.trim()) newErrors.email = t('consultation.errors.emailRequired') || 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = t('consultation.errors.phoneRequired') || 'Phone is required';
        if (!formData.country.trim()) newErrors.country = t('consultation.errors.countryRequired') || 'Country is required';
        break;
      case 2:
        if (formData.interestedServices.length === 0) {
          newErrors.interestedServices = t('consultation.errors.serviceRequired') || 'Please select at least one service';
        }
        break;
      case 3:
        if (!formData.preferredDate) newErrors.preferredDate = t('consultation.errors.dateRequired') || 'Preferred date is required';
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('consultation.step1.title') || 'Personal Information'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.firstName') || 'First Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('consultation.step1.firstNamePlaceholder') || 'Enter your first name'}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.lastName') || 'Last Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('consultation.step1.lastNamePlaceholder') || 'Enter your last name'}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.email') || 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('consultation.step1.emailPlaceholder') || 'your.email@example.com'}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.phone') || 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('consultation.step1.phonePlaceholder') || '+1 (555) 123-4567'}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.country') || 'Country'} *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('consultation.step1.countryPlaceholder') || 'United States'}
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.age') || 'Age'}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('consultation.step1.agePlaceholder') || '25'}
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step1.gender') || 'Gender'}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('consultation.step1.selectGender') || 'Select gender'}</option>
                    <option value="male">{t('consultation.step1.male') || 'Male'}</option>
                    <option value="female">{t('consultation.step1.female') || 'Female'}</option>
                    <option value="other">{t('consultation.step1.other') || 'Other'}</option>
                    <option value="prefer-not-to-say">{t('consultation.step1.preferNotToSay') || 'Prefer not to say'}</option>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('consultation.step2.title') || 'Services of Interest'}</h3>
              <p className="text-gray-600 mb-6">
                {t('consultation.step2.subtitle') || 'Select all procedures you\'re interested in learning about:'}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('consultation.step3.title') || 'Consultation Preferences'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step3.preferredDate') || 'Preferred Date'} *
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
                    {t('consultation.step3.preferredTime') || 'Preferred Time'} (UTC +1)
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('consultation.step3.selectTime') || 'Select preferred time'}</option>
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
                  {t('consultation.step3.contactMethod') || 'Preferred Contact Method'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'email', label: t('consultation.step3.email') || 'Email', icon: EnvelopeIcon },
                    { value: 'phone', label: t('consultation.step3.phoneCall') || 'Phone Call', icon: PhoneIcon },
                    { value: 'whatsapp', label: t('consultation.step3.whatsapp') || 'WhatsApp', icon: ChatBubbleLeftRightIcon }
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('consultation.step4.title') || 'Medical Information'}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step4.medicalHistory') || 'Medical History'}
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={t('consultation.step4.medicalHistoryPlaceholder') || 'Please describe any relevant medical history, previous surgeries, or conditions...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step4.currentMedications') || 'Current Medications'}
                  </label>
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={t('consultation.step4.medicationsPlaceholder') || 'List any medications you\'re currently taking...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('consultation.step4.additionalInfo') || 'Additional Information'}
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={t('consultation.step4.additionalInfoPlaceholder') || 'Any additional questions, concerns, or information you\'d like to share...'}
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
              {t('consultation.success.title') || 'Consultation Request Submitted!'}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('consultation.success.message') || 'Thank you for your interest in Vola Health Istanbul. We\'ve received your consultation request and our team will contact you within 24 hours to schedule your free consultation.'}
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t('consultation.success.returnHome') || 'Return to Homepage'}
              </Link>
              <div className="text-sm text-gray-500">
                <p>{t('consultation.success.questions') || 'Questions? Message us'} 💬 <a href="https://wa.me/905444749881" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 hover:text-green-700">+90 544 474 98 81</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 sm:py-24">
      <div className="container-mobile">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm sm:text-base">
            ← {t('consultation.header.backToHome') || 'Back to Home'}
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('consultation.header.title') || 'Free Medical Consultation'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('consultation.header.subtitle') || 'Get personalized advice from our expert medical team. Complete this form to schedule your complimentary consultation.'}
          </p>
        </div>

        {/* Contact Info - Moved to top */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 mb-4">
            {t('consultation.contact.preferDirect') || 'Prefer to contact with us directly?'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/905444749881"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg"
            >
              {/* WhatsApp Icon */}
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp: +90 544 474 98 81
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

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: ShieldCheckIcon,
              title: t('consultation.benefits.free.title') || 'Completely Free',
              description: t('consultation.benefits.free.description') || 'No cost, no obligation consultation with medical experts'
            },
            {
              icon: ClockIcon,
              title: t('consultation.benefits.time.title') || '15 Minutes',
              description: t('consultation.benefits.time.description') || 'Comprehensive evaluation and personalized treatment plan'
            },
            {
              icon: HeartIcon,
              title: t('consultation.benefits.expert.title') || 'Expert Care',
              description: t('consultation.benefits.expert.description') || 'Board-certified surgeons with international experience'
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
                {t('consultation.progress.step') || 'Step'} {currentStep} {t('consultation.progress.of') || 'of'} {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% {t('consultation.progress.complete') || 'Complete'}
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
                {t('consultation.navigation.previous') || 'Previous'}
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('consultation.navigation.nextStep') || 'Next Step'}
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
                      {t('consultation.navigation.submitting') || 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {t('consultation.navigation.schedule') || 'Schedule Consultation'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
} 
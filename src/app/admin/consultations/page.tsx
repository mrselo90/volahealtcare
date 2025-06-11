'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HeartPulseIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Consultation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  age?: string;
  gender?: string;
  interestedServices: string[];
  preferredDate?: string;
  preferredTime?: string;
  medicalHistory?: string;
  currentMedications?: string;
  budget?: string;
  additionalInfo?: string;
  contactMethod: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/admin/consultations');
      if (!response.ok) throw new Error('Failed to fetch consultations');
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (id: string, status: Consultation['status']) => {
    try {
      const response = await fetch(`/api/admin/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update consultation');

      setConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c)
      );
    } catch (error) {
      console.error('Error updating consultation:', error);
    }
  };

  const filteredConsultations = consultations.filter(
    consultation => filter === 'all' || consultation.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'phone':
        return <PhoneIcon className="h-4 w-4" />;
      case 'whatsapp':
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      default:
        return <EnvelopeIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Requests</h1>
          <p className="text-gray-600">Manage and track consultation requests from potential patients</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', count: consultations.length, color: 'bg-gray-100 text-gray-800' },
          { label: 'Pending', count: consultations.filter(c => c.status === 'pending').length, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Contacted', count: consultations.filter(c => c.status === 'contacted').length, color: 'bg-blue-100 text-blue-800' },
          { label: 'Scheduled', count: consultations.filter(c => c.status === 'scheduled').length, color: 'bg-purple-100 text-purple-800' },
          { label: 'Completed', count: consultations.filter(c => c.status === 'completed').length, color: 'bg-green-100 text-green-800' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Consultations List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : consultations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No consultations yet</h3>
          <p className="mt-1 text-sm text-gray-500">Consultation requests will appear here when submitted.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map((consultation, index) => (
                  <motion.tr
                    key={consultation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.firstName} {consultation.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{consultation.email}</div>
                          <div className="text-xs text-gray-400">{consultation.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {consultation.interestedServices.length > 2 ? (
                          <>
                            {consultation.interestedServices.slice(0, 2).join(', ')}
                            <span className="text-gray-500"> +{consultation.interestedServices.length - 2} more</span>
                          </>
                        ) : (
                          consultation.interestedServices.join(', ')
                        )}
                      </div>
                      {consultation.budget && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          {consultation.budget}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {getContactMethodIcon(consultation.contactMethod)}
                        <span className="ml-2 capitalize">{consultation.contactMethod}</span>
                      </div>
                      <div className="text-xs text-gray-500">{consultation.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(consultation.createdAt)}
                      </div>
                      {consultation.preferredDate && (
                        <div className="text-xs text-gray-500">
                          Prefers: {new Date(consultation.preferredDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(consultation.status)}`}>
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        
                        {consultation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateConsultationStatus(consultation.id, 'contacted')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as contacted"
                            >
                              <PhoneIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as scheduled"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {consultation.status === 'contacted' && (
                          <button
                            onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as scheduled"
                          >
                            <CalendarDaysIcon className="h-5 w-5" />
                          </button>
                        )}
                        
                        {consultation.status === 'scheduled' && (
                          <button
                            onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as completed"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Consultation Details - {selectedConsultation.firstName} {selectedConsultation.lastName}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div><strong>Name:</strong> {selectedConsultation.firstName} {selectedConsultation.lastName}</div>
                    <div><strong>Email:</strong> {selectedConsultation.email}</div>
                    <div><strong>Phone:</strong> {selectedConsultation.phone}</div>
                    <div><strong>Country:</strong> {selectedConsultation.country}</div>
                    {selectedConsultation.age && <div><strong>Age:</strong> {selectedConsultation.age}</div>}
                    {selectedConsultation.gender && <div><strong>Gender:</strong> {selectedConsultation.gender}</div>}
                  </div>
                </div>

                {/* Services & Budget */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Services & Budget</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div><strong>Interested Services:</strong></div>
                    <ul className="list-disc list-inside ml-4">
                      {selectedConsultation.interestedServices.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                    {selectedConsultation.budget && (
                      <div><strong>Budget:</strong> {selectedConsultation.budget}</div>
                    )}
                  </div>
                </div>

                {/* Consultation Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Consultation Preferences</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedConsultation.preferredDate && (
                      <div><strong>Preferred Date:</strong> {new Date(selectedConsultation.preferredDate).toLocaleDateString()}</div>
                    )}
                    {selectedConsultation.preferredTime && (
                      <div><strong>Preferred Time:</strong> {selectedConsultation.preferredTime}</div>
                    )}
                    <div><strong>Contact Method:</strong> {selectedConsultation.contactMethod}</div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedConsultation.medicalHistory && (
                      <div>
                        <strong>Medical History:</strong>
                        <p className="mt-1 text-sm">{selectedConsultation.medicalHistory}</p>
                      </div>
                    )}
                    {selectedConsultation.currentMedications && (
                      <div>
                        <strong>Current Medications:</strong>
                        <p className="mt-1 text-sm">{selectedConsultation.currentMedications}</p>
                      </div>
                    )}
                    {selectedConsultation.additionalInfo && (
                      <div>
                        <strong>Additional Information:</strong>
                        <p className="mt-1 text-sm">{selectedConsultation.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                <div className="flex gap-2">
                  {['pending', 'contacted', 'scheduled', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateConsultationStatus(selectedConsultation.id, status as Consultation['status']);
                        setSelectedConsultation(prev => prev ? { ...prev, status: status as Consultation['status'] } : null);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        selectedConsultation.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 
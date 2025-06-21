'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RiCalendarLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  notes?: string;
  service: {
    title: string;
  };
  serviceId: string;
  preferredDate?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      setLoading(false);
      return;
    }

    fetch('/api/admin/appointments', {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error('Error fetching appointments:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session, status]);

  const filteredAppointments = appointments.filter(
    (appointment) => filter === 'all' || appointment.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border-gray-300 text-sm focus:border-amber-500 focus:ring-amber-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <RiCalendarLine className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">No appointments have been made yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
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
              {filteredAppointments.map((appointment, idx) => {
  const statusColor = appointment.status === 'pending'
    ? 'border-l-4 border-yellow-400'
    : appointment.status === 'confirmed'
    ? 'border-l-4 border-green-400'
    : 'border-l-4 border-red-400';
  return (
    <tr
      key={appointment.id}
      className={`transition-all duration-300 ease-in-out ${statusColor} ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50`}
      style={{ animation: 'fadeIn 0.5s' }}
    >
      <td className="px-4 py-4 whitespace-nowrap align-top">
        <div className="font-semibold text-gray-900 text-base leading-snug">{appointment.name}</div>
        <div className="text-xs text-gray-500">{appointment.email}</div>
        <div className="text-xs text-gray-400">{appointment.phone}</div>
        <div className="text-xs text-gray-400">{appointment.country}</div>
        {appointment.notes && (
          <div className="text-xs text-amber-500 mt-1">Notes: {appointment.notes}</div>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap align-top">
        <div className="flex items-center gap-2">
          <RiCalendarLine className="text-amber-400" />
          <span className="text-sm font-medium text-gray-900">{appointment.service?.title || <span className='italic text-gray-400'>Unknown Service</span>}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {appointment.preferredDate
            ? new Date(appointment.preferredDate).toLocaleDateString()
            : new Date(appointment.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          {appointment.preferredDate
            ? new Date(appointment.preferredDate).toLocaleTimeString()
            : new Date(appointment.createdAt).toLocaleTimeString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
            appointment.status
          )}`}
          title={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {appointment.status === 'pending' && (
          <div className="flex gap-2">
            <button
              className="text-green-600 hover:text-green-900"
              title="Confirm appointment"
              onClick={async () => {
                await fetch(`/api/appointments/${appointment.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                  body: JSON.stringify({ status: 'confirmed' }),
                });
                setAppointments((prev) =>
                  prev.map((a) =>
                    a.id === appointment.id ? { ...a, status: 'confirmed' } : a
                  )
                );
              }}
            >
              <RiCheckLine className="h-5 w-5" />
            </button>
            <button
              className="text-red-600 hover:text-red-900"
              title="Cancel appointment"
              onClick={async () => {
                await fetch(`/api/appointments/${appointment.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                  body: JSON.stringify({ status: 'cancelled' }),
                });
                setAppointments((prev) =>
                  prev.map((a) =>
                    a.id === appointment.id ? { ...a, status: 'cancelled' } : a
                  )
                );
              }}
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
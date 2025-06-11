'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, Service } from '@prisma/client';

type AppointmentWithService = Appointment & {
  service: Service;
};

interface AppointmentFormProps {
  appointment: AppointmentWithService;
}

export function AppointmentForm({ appointment }: AppointmentFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-3 text-base shadow-sm focus:border-amber-500 focus:ring-amber-500 transition-all"
        >
          <option value="pending" className="text-gray-500">Pending</option>
          <option value="confirmed" className="text-green-600">Confirmed</option>
          <option value="cancelled" className="text-red-600">Cancelled</option>
          <option value="completed" className="text-amber-600">Completed</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          type="submit"
          disabled={loading || status === appointment.status}
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-amber-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Status'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/appointments')}
          className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow hover:bg-gray-50 transition-all"
        >
          Back to List
        </button>
      </div>
    </form>
  );
} 
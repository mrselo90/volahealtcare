import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AppointmentForm } from '@/components/admin/appointments/AppointmentForm';

async function getAppointment(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      service: true,
    },
  });

  if (!appointment) {
    notFound();
  }

  return appointment;
}

export default async function AppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const appointment = await getAppointment(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Appointment Details
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          View and manage appointment information
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Patient Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.name}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.email}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.phone}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.country}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Service</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {appointment.service.title}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {appointment.status}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Preferred Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {appointment.preferredDate
                  ? new Date(appointment.preferredDate).toLocaleDateString()
                  : 'Not specified'}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {appointment.notes || 'No notes provided'}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex justify-end space-x-3">
            <AppointmentForm appointment={appointment} />
          </div>
        </div>
      </div>
    </div>
  );
} 
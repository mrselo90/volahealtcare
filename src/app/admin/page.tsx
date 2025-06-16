'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiCalendarLine, RiMessageLine, RiServiceLine, RiStarLine } from 'react-icons/ri';

interface Stats {
  services: number;
  appointments: number;
  messages: number;
  testimonials: number;
}

interface Activity {
  recentAppointments: Array<any>;
  recentTestimonials: Array<any>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    appointments: 0,
    messages: 0,
    testimonials: 0
  });
  const [activity, setActivity] = useState<Activity>({
    recentAppointments: [],
    recentTestimonials: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
    try {
        const [statsRes, activityRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activity')
      ]);

        const statsData = await statsRes.json();
        const activityData = await activityRes.json();
        
        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
    }

    fetchData();
  }, []);

  const statCards = [
    {
      name: 'Total Services',
      value: stats.services,
      icon: RiServiceLine,
      color: 'bg-gradient-to-br from-amber-200 via-amber-100 to-white',
      border: 'border-amber-300',
      iconColor: 'text-amber-500',
    },
    {
      name: 'Appointments',
      value: stats.appointments,
      icon: RiCalendarLine,
              color: 'bg-gradient-to-br from-blue-100 via-white to-purple-50',
      border: 'border-green-200',
      iconColor: 'text-green-500',
    },
    {
      name: 'Messages',
      value: stats.messages,
      icon: RiMessageLine,
              color: 'bg-gradient-to-br from-purple-100 via-white to-blue-50',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-500',
    },
    {
      name: 'Testimonials',
      value: stats.testimonials,
      icon: RiStarLine,
      color: 'bg-gradient-to-br from-purple-100 via-white to-amber-50',
      border: 'border-purple-200',
      iconColor: 'text-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className={`overflow-hidden rounded-2xl shadow-lg border-2 ${card.border} ${card.color} transition-transform duration-200 hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-amber-400`}
            tabIndex={0}
          >
            <div className="p-6 flex items-center gap-4">
              <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-inner ${card.iconColor}`}>
                <card.icon className={`h-7 w-7 ${card.iconColor}`} aria-hidden="true" />
                </div>
              <div className="flex-1 min-w-0">
                  <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                  <dd className="text-2xl font-extrabold text-gray-900">{card.value}</dd>
                  </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Appointments
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {activity.recentAppointments.map((appointment) => (
                    <li key={appointment.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.service.title}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.createdAt).toLocaleDateString()}
                </div>
                </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
                </div>

        {/* Recent Testimonials */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Testimonials
            </h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {activity.recentTestimonials.map((testimonial) => (
                    <li key={testimonial.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {testimonial.service.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            Rating: {testimonial.rating}/5
                          </p>
                </div>
                        <div className="text-sm text-gray-500">
                          {new Date(testimonial.createdAt).toLocaleDateString()}
              </div>
            </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
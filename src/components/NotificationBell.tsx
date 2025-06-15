'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState([
    // Remove any notification objects or text related to blog posts.
  ]);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative p-2 text-gray-400 hover:text-gray-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-200">
            Notifications
          </div>
          <div className="mt-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {notification.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
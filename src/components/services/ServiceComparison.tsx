'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Service } from '@/data/services';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ServiceComparisonProps {
  services: Service[];
  onRemoveService: (serviceSlug: string) => void;
}

export function ServiceComparison({ services, onRemoveService }: ServiceComparisonProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto">
      <table className="w-full min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature
            </th>
            {services.map((service) => (
              <th key={service.slug} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-between">
                  <span>{service.name}</span>
                  <button
                    onClick={() => onRemoveService(service.slug)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Thumbnail Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Image
            </td>
            {services.map((service) => (
              <td key={service.slug} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="relative w-32 h-24">
                  <Image
                    src={service.thumbnail}
                    alt={service.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </td>
            ))}
          </tr>

          {/* Description Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Description
            </td>
            {services.map((service) => (
              <td key={service.slug} className="px-6 py-4 text-sm text-gray-500">
                {service.description}
              </td>
            ))}
          </tr>

          {/* Price Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Price Range
            </td>
            {services.map((service) => (
              <td key={service.slug} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.priceRange ? `$${service.priceRange[0]} - $${service.priceRange[1]}` : 'Contact for pricing'}
              </td>
            ))}
          </tr>

          {/* Duration Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Duration
            </td>
            {services.map((service) => (
              <td key={service.slug} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.duration || 'Varies'}
              </td>
            ))}
          </tr>

          {/* Benefits Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Benefits
            </td>
            {services.map((service) => (
              <td key={service.slug} className="px-6 py-4 text-sm text-gray-500">
                <ul className="list-disc pl-4">
                  {service.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* Process Row */}
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Process
            </td>
            {services.map((service) => (
              <td key={service.slug} className="px-6 py-4 text-sm text-gray-500">
                <ol className="list-decimal pl-4">
                  {service.process.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
} 
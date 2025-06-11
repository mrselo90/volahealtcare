'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-64' : 'w-10'}`}>
        <input
          type="text"
          className={`
            peer
            w-full
            bg-gray-50
            rounded-full
            py-1.5
            pl-10
            pr-3
            text-sm
            leading-6
            text-gray-900
            focus:ring-2
            focus:ring-primary/20
            focus:outline-none
            ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}
            transition-all
            duration-300
          `}
          placeholder="Search treatments..."
          onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
        />
        <button
          type="button"
          className={`
            absolute
            left-0
            p-2
            text-gray-400
            hover:text-gray-500
            ${isExpanded ? 'peer-focus:text-primary' : ''}
          `}
          onClick={() => setIsExpanded(true)}
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
} 
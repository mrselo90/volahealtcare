'use client';

import { RiAddLine } from 'react-icons/ri';

interface EmptyStateProps {
  onAddCategory: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddCategory }) => (
  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
    <div className="mt-6">
      <button
        type="button"
        onClick={onAddCategory}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <RiAddLine className="-ml-1 mr-2 h-5 w-5" />
        New Category
      </button>
    </div>
  </div>
);

export default EmptyState;

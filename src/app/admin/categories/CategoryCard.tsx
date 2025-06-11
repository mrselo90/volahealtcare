'use client';

import { useState } from 'react';
interface CategoryData {
  id: string;
  name: string;
  description: string;
  slug: string;
  orderIndex: number;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  displayName?: (lang?: string) => string;
  displayDescription?: (lang?: string) => string;
}
import { RiEdit2Line, RiDeleteBinLine, RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';

interface CategoryCardProps {
  category: CategoryData;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  loading: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
  loading
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Helper to safely parse JSON with fallback
  const parseJsonField = (jsonString: string | null, fallback: any = { en: '' }) => {
    if (!jsonString) return fallback;
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      return fallback;
    }
  };

  // Always parse name as JSON string, fallback to showing raw string if not valid
  let nameObj = { en: '' };
  try {
    nameObj = typeof category.name === 'string' ? JSON.parse(category.name) : category.name;
    if (typeof nameObj !== 'object' || nameObj === null) nameObj = { en: String(category.name) };
  } catch {
    nameObj = { en: category.name || '' };
  }
  const displayName = nameObj.en && nameObj.en.trim() !== '' ? nameObj.en : (category.name || 'Unnamed Category');
  
  const descriptionObj = parseJsonField(category.description);
  const displayDescription = descriptionObj?.en || '';

  const handleMove = async (direction: 'up' | 'down') => {
    if (isMoving) return;
    
    const confirmMessage = `Are you sure you want to move this category ${direction === 'up' ? 'up' : 'down'}?`;
    if (!confirm(confirmMessage)) return;
    
    setIsMoving(true);
    try {
      await onMove(category.id, direction);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900">
              {displayName}
            </h3>
            {displayDescription && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {displayDescription}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                /{category.slug}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Order: {category.orderIndex + 1}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              {category.imageUrl && !imageError ? (
                <img
                  src={category.imageUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="text-gray-400 text-sm text-center p-2">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleMove('up')}
              disabled={loading || isMoving || index === 0}
              className={`p-1.5 ${index === 0 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'} rounded-md disabled:opacity-50`}
              aria-label="Move up"
            >
              <RiArrowUpLine className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleMove('down')}
              disabled={loading || isMoving || index === total - 1}
              className={`p-1.5 ${index === total - 1 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'} rounded-md disabled:opacity-50`}
              aria-label="Move down"
            >
              <RiArrowDownLine className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onEdit}
              disabled={loading || isMoving}
              className="p-1.5 text-amber-400 hover:bg-amber-50 hover:text-amber-500 rounded-md disabled:opacity-50"
              aria-label="Edit category"
            >
              <RiEdit2Line className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={loading || isMoving}
              className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-md disabled:opacity-50"
              aria-label="Delete category"
            >
              <RiDeleteBinLine className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

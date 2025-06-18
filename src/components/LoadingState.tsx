'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/hooks';

export const LoadingState = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="relative inline-flex">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <div className="w-8 h-8 bg-primary rounded-full absolute top-0 left-0 animate-ping"></div>
          <div className="w-8 h-8 bg-primary rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
        <p className="mt-4 text-sm text-gray-600">{t('common.loading')}</p>
      </motion.div>
    </div>
  );
};

export const ServiceCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-w-3 aspect-h-2 bg-gray-200 animate-pulse" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
        <div className="mt-4 flex items-center">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}; 
'use client';

import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const QuickOverviewCard = ({ t }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <InformationCircleIcon className="h-5 w-5 text-blue-600" />
      {t('services.detail.quickOverview')}
    </h3>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t('services.detail.readingTime')}</span>
        <span className="font-semibold text-gray-900">3 {t('services.detail.minRead')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t('services.detail.keyBenefits')}</span>
        <span className="font-semibold text-gray-900">5 {t('services.detail.highlights')}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">{t('services.detail.sections')}</span>
        <span className="font-semibold text-gray-900">5 {t('services.detail.topics')}</span>
      </div>
    </div>
  </motion.div>
); 
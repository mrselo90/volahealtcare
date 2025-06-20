'use client';

import Link from 'next/link';
import { 
  InformationCircleIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOffice2Icon,
  HeartIcon,
  HomeIcon,
  TruckIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const PackageDetails = ({ data, t }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 mb-6 sm:mb-8 lg:mb-12 shadow-2xl border border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400 to-pink-600 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <InformationCircleIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('services.packageDetails.title')}</h3>
        <p className="text-lg text-gray-600">{t('services.packageDetails.subtitle')}</p>
      </div>

      {/* Package Details Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
        {/* Time in Turkey */}
        {data.timeInTurkey && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-700 break-all leading-tight mb-2">{t('services.packageDetails.timeInTurkey')}</div>
                <div className="text-xs text-gray-500 leading-tight">{t('services.packageDetails.timeInTurkeySubtitle')}</div>
              </div>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-900">{data.timeInTurkey}</div>
          </div>
        )}

        {/* Operation Time */}
        {data.operationTime && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-700 break-all leading-tight mb-2">{t('services.packageDetails.operationTime')}</div>
                <div className="text-xs text-gray-500 leading-tight">{t('services.packageDetails.operationTimeSubtitle')}</div>
              </div>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-900">{data.operationTime}</div>
          </div>
        )}

        {/* Hospital Stay */}
        {data.hospitalStay && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-700 break-all leading-tight mb-2">{t('services.packageDetails.hospitalStay')}</div>
                <div className="text-xs text-gray-500 leading-tight">{t('services.packageDetails.hospitalStaySubtitle')}</div>
              </div>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-900">{data.hospitalStay}</div>
          </div>
        )}

        {/* Recovery */}
        {data.recovery && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <HeartIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-700 break-all leading-tight mb-2">{t('services.packageDetails.recovery')}</div>
                <div className="text-xs text-gray-500 leading-tight">{t('services.packageDetails.recoverySubtitle')}</div>
              </div>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-900">{data.recovery}</div>
          </div>
        )}

        {/* Accommodation */}
        {data.accommodation && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-700 break-all leading-tight mb-2">{t('services.packageDetails.accommodation')}</div>
                <div className="text-xs text-gray-500 leading-tight">{t('services.packageDetails.accommodationSubtitle')}</div>
              </div>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-900">{data.accommodation}</div>
          </div>
        )}

        {/* Transportation */}
        {data.transportation && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[220px]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-blue-700 break-all leading-tight mb-2">{t('services.packageDetails.transportation')}</div>
                <div className="text-xs text-gray-500 leading-tight">{t('services.packageDetails.transportationSubtitle')}</div>
              </div>
            </div>
            <div className="mt-auto text-2xl font-bold text-blue-900">{data.transportation}</div>
          </div>
        )}
      </div>

      {/* Premium CTA Banner */}
      <div className="relative z-10 mt-8 bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 rounded-2xl p-8 text-center shadow-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
        <div className="relative z-10">
          <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
            {t('services.packageDetails.premiumPackageTitle')}
          </h4>
          <p className="text-blue-100 text-lg">{t('services.packageDetails.premiumPackageDescription')}</p>
          <div className="mt-6">
            <Link 
              href="/consultation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <SparklesIcon className="h-6 w-6" />
              {t('services.packageDetails.reserveJourney')}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 
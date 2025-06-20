'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  PlayCircleIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  BuildingOffice2Icon,
  HomeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid 
} from '@heroicons/react/24/solid';

// You might need to adjust these import paths
import { QuickOverviewCard } from './QuickOverviewCard';
import { PackageDetails } from './PackageDetails';

export default function ServiceDetailClient({ service, translations }) {
  const t = (key) => translations[key] || key;

  // Most of the hooks and state management from the original page.tsx will go here.
  // For now, it's a simple component to render details.

  if (!service) {
    return <div>Service not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <QuickOverviewCard t={t} />
      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 my-8">
        <ReactMarkdown>{service.description}</ReactMarkdown>
      </div>
      <PackageDetails data={service} t={t} />
    </div>
  );
} 
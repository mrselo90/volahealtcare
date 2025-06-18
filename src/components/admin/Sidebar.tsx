'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  RiHomeLine,
  RiBriefcaseLine,
  RiCalendarLine,
  RiMessageLine,
  RiGlobalLine,
  RiStarLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiListCheck,
  RiImageLine,
  RiLinksLine,
  RiUserHeartLine,
  RiSlideshowLine,
  RiLayoutLine,
} from 'react-icons/ri';
import { useTranslation } from '@/lib/i18n/hooks';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navigationItems = [
    {
      name: t('admin.sidebar.dashboard'),
      href: '/admin',
      icon: RiHomeLine,
      description: t('admin.sidebar.dashboardDesc'),
    },
    {
      name: t('admin.sidebar.categories'),
      href: '/admin/categories',
      icon: RiListCheck,
      description: t('admin.sidebar.categoriesDesc'),
    },
    {
      name: 'Hero Slides',
      href: '/admin/hero-slides',
      icon: RiSlideshowLine,
      description: 'Manage homepage hero slider images',
    },
    {
      name: 'Content Blocks',
      href: '/admin/content-blocks',
      icon: RiLayoutLine,
      description: 'Manage dynamic content sections',
    },
    {
      name: t('admin.sidebar.services'),
      href: '/admin/services',
      icon: RiBriefcaseLine,
      description: t('admin.sidebar.servicesDesc'),
    },
    {
      name: t('admin.sidebar.beforeAfter'),
      href: '/admin/before-after',
      icon: RiImageLine,
      description: t('admin.sidebar.beforeAfterDesc'),
    },
    {
      name: t('admin.sidebar.appointments'),
      href: '/admin/appointments',
      icon: RiCalendarLine,
      description: t('admin.sidebar.appointmentsDesc'),
    },
    {
      name: t('admin.sidebar.consultations'),
      href: '/admin/consultations',
      icon: RiUserHeartLine,
      description: t('admin.sidebar.consultationsDesc'),
    },
    {
      name: t('admin.sidebar.messages'),
      href: '/admin/messages',
      icon: RiMessageLine,
      description: t('admin.sidebar.messagesDesc'),
    },
    {
      name: t('admin.sidebar.testimonials'),
      href: '/admin/testimonials',
      icon: RiStarLine,
      description: t('admin.sidebar.testimonialsDesc'),
    },
    {
      name: t('admin.sidebar.translations'),
      href: '/admin/translations',
      icon: RiGlobalLine,
      description: t('admin.sidebar.translationsDesc'),
    },
    {
      name: t('admin.sidebar.settings'),
      href: '/admin/settings',
      icon: RiSettings3Line,
      description: t('admin.sidebar.settingsDesc'),
    },
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0 bg-gradient-to-b from-white via-gray-50 to-amber-50 border-r border-gray-200 min-h-screen shadow-lg w-72">
      <div className="flex flex-col w-64 h-full">

        <nav className="flex-1 px-4 pt-8 pb-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                  ${isActive ? 'bg-amber-100 border-l-4 border-amber-400 text-amber-700 shadow-sm' : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'}`}
                tabIndex={0}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'text-amber-500' : 'text-gray-400 group-hover:text-amber-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => signOut()}
            className="w-full mt-8 flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            <RiLogoutBoxLine className="h-6 w-6" />
            <span>{t('admin.sidebar.signOut')}</span>
          </button>
        </nav>
      </div>
    </aside>
  );
} 
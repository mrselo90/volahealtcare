'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import { RiGlobalLine, RiLogoutBoxRLine, RiUserLine } from 'react-icons/ri';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/hooks';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'ru', name: 'Русский' },
  { code: 'ro', name: 'Română' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'ar', name: 'العربية' },
];

export function AdminHeader() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 sm:px-12 lg:px-16">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            {/* Logo Placeholder */}
            <div className="flex items-center gap-2">
              <Image src="/Vola_edited.jpg" alt="Vola Health Logo" width={32} height={32} className="rounded-none" />
              <span className="text-lg font-bold text-primary">Vola Health</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
                <RiGlobalLine className="h-5 w-5" />
                <span className="ml-2 text-sm font-medium">{t('admin.header.language')}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {languages.map((language) => (
                      <Menu.Item key={language.code}>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm w-full text-left`}
                            onClick={() => {
                              // Handle language change
                            }}
                          >
                            {language.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* User Menu */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ''}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <RiUserLine className="h-5 w-5" />
                )}
                <span className="ml-2 text-sm font-medium">
                  {session?.user?.name || 'User'}
                </span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } group flex items-center px-4 py-2 text-sm w-full`}
                          onClick={() => signOut()}
                        >
                          <RiLogoutBoxRLine className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
} 
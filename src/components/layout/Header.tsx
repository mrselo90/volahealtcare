'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const treatments = {
  dental: [
    { name: 'Digital Smile Design', href: '/services/digital-smile-design', icon: '🦷' },
    { name: 'Dental Veneers', href: '/services/dental-veneers', icon: '🦷' },
    { name: 'Hollywood Smile', href: '/services/hollywood-smile', icon: '✨' },
    { name: 'Gum Aesthetics', href: '/services/gum-aesthetics', icon: '🦷' },
    { name: 'Teeth Whitening', href: '/services/teeth-whitening', icon: '🦷' },
  ],
  facial: [
    { name: 'Rhinoplasty', href: '/services/rhinoplasty', icon: '👃' },
    { name: 'Facelift Surgery', href: '/services/facelift', icon: '😊' },
    { name: 'Eyelid Surgery', href: '/services/eyelid-surgery', icon: '👁️' },
    { name: 'Forehead Lifting', href: '/services/forehead-lifting', icon: '🤨' },
    { name: 'Neck Lift', href: '/services/neck-lift', icon: '💆' },
    { name: 'Botox', href: '/services/botox', icon: '💉' },
  ],
  body: [
    { name: 'Brazilian Butt Lift', href: '/services/bbl', icon: '🍑' },
    { name: 'Breast Augmentation', href: '/services/breast-augmentation', icon: '👚' },
    { name: 'Thigh Lift', href: '/services/thigh-lift', icon: '🦵' },
    { name: 'Tummy Tuck', href: '/services/tummy-tuck', icon: '👕' },
    { name: 'Six Pack Surgery', href: '/services/six-pack-surgery', icon: '��' },
  ],
};

const results = [
  { name: 'All Results', href: '/gallery', icon: '📸' },
  { name: 'Dental Results', href: '/results/dental', icon: '🦷' },
  { name: 'Hair Results', href: '/results/hair', icon: '💇' },
  { name: 'Aesthetic Results', href: '/results/aesthetic', icon: '✨' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Why Choose Us?', href: '/why-choose-us' },
  { name: 'Results', href: '/gallery' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Contact', href: '/contact' },
];

const mockNotifications = [
  { id: 1, title: 'New Blog Post', message: 'Check out our latest article on dental care!', time: '5m ago' },
  { id: 2, title: 'Special Offer', message: '20% off on all dental procedures this month', time: '1h ago' },
  { id: 3, title: 'Appointment Reminder', message: 'Your consultation is scheduled for tomorrow', time: '2h ago' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [nextAvailableSlot, setNextAvailableSlot] = useState('Tomorrow, 10:00 AM');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';
  
  let headerClasses = "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out h-16 md:h-20 lg:h-24 flex items-center backdrop-blur-sm";
  let textClasses = "text-sm font-semibold leading-6 transition-all duration-200";
  let logoTextClasses = "text-2xl font-serif font-bold tracking-wide";
  let mobileButtonClasses = "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-all duration-200";
  let navWrapperClasses = "w-full flex items-center justify-between p-6 lg:px-8";

  if (isHomePage && !isScrolled && !mobileMenuOpen) {
    headerClasses += " bg-transparent";
    textClasses += " text-white hover:text-brandIvory-light";
    logoTextClasses += " text-white";
    mobileButtonClasses += " text-white";
  } else {
    headerClasses += " bg-white/90 shadow-lg shadow-black/5";
    textClasses += " text-gray-900 hover:text-primary";
    logoTextClasses += " text-primary bg-gradient-to-r from-primary to-brandGold-light bg-clip-text text-transparent";
    mobileButtonClasses += " text-gray-900";
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
  };

  return (
    <header className={headerClasses}>
      <nav className={navWrapperClasses} aria-label="Global">
        <div className="flex lg:flex-1 items-center">
          <Link href="/" className="-m-1.5 p-1.5 group flex items-center gap-2">
            <Image src="/Vola_edited.jpg" alt="Vola Health Logo" width={40} height={40} className="rounded-none" priority />
            <span className="sr-only">Vola Health Istanbul</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => {
            if (item.name === 'Services') {
              return (
                <Popover key={item.name} className="relative">
                  <Popover.Button className={`${textClasses} flex items-center gap-1 relative group overflow-hidden`}>
                    Services
                    <ChevronDownIcon className="h-4 w-4" />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-0 z-10 mt-2 w-80 rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-black ring-opacity-5 border border-gray-100">
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Dental Treatments</h3>
                            <div className="space-y-1">
                              {treatments.dental.slice(0, 3).map((treatment) => (
                                <Link
                                  key={treatment.name}
                                  href={treatment.href}
                                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-50 transition-colors duration-200"
                                >
                                  <span className="text-lg">{treatment.icon}</span>
                                  <span className="text-sm text-gray-700">{treatment.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="border-t pt-2">
                            <Link
                              href="/services"
                              className="block text-center text-sm font-medium text-primary hover:text-primary-600 transition-colors duration-200"
                            >
                              View All Services →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              );
            }

            if (item.name === 'Results') {
              return (
                <Popover key="Results" className="relative">
                  <Popover.Button className={`${textClasses} flex items-center gap-1 relative group overflow-hidden`}>
                    Results
                    <ChevronDownIcon className="h-4 w-4" />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-0 z-10 mt-2 w-64 rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-black ring-opacity-5 border border-gray-100">
                      <div className="p-4">
                        <div className="space-y-2">
                          {results.map((result) => (
                            <Link
                              key={result.name}
                              href={result.href}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-primary-50 transition-colors duration-200 group"
                            >
                              <span className="text-lg">{result.icon}</span>
                              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors duration-200">
                                {result.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${textClasses} ${
                  pathname === item.href 
                    ? 'text-primary font-bold relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary' 
                    : ''
                } relative group overflow-hidden`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-6">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-full hover:bg-primary-50 transition-all duration-200 ${
              isSearchOpen ? 'bg-primary-50 text-primary' : ''
            }`}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {/* Search Modal */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl shadow-black/5 p-4 border border-gray-100"
              >
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search treatments, doctors..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-primary to-brandGold-light text-white rounded-md hover:from-primary-600 hover:to-brandGold-dark transition-all duration-200 shadow-sm hover:shadow"
                  >
                    Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-primary-50 transition-all duration-200 relative"
            >
              {hasUnreadNotifications ? (
                <BellAlertIcon className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <BellIcon className="h-5 w-5" />
              )}
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl shadow-black/5 overflow-hidden border border-gray-100"
                >
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={markNotificationsAsRead}
                        className="text-sm text-primary hover:text-primary-600 transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-colors duration-200 cursor-pointer group"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector */}
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-2 p-2 rounded-md hover:bg-primary-50 transition-all duration-200">
              <span className="text-2xl filter drop-shadow-sm">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-56 rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-black ring-opacity-5 border border-gray-100">
                <div className="py-1 max-h-96 overflow-y-auto">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => setCurrentLanguage(language.code)}
                      className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-all duration-200 ${
                        currentLanguage === language.code 
                          ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary' 
                          : 'text-gray-700 hover:bg-primary-50'
                      }`}
                    >
                      <span className="text-2xl filter drop-shadow-sm">{language.flag}</span>
                      {language.name}
                      {currentLanguage === language.code && (
                        <ChevronRightIcon className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          {/* Book Consultation Button */}
          <Popover className="relative">
            <Popover.Button
              className={`btn-primary ${
                isHomePage && !isScrolled 
                  ? 'bg-white text-primary hover:bg-gray-100' 
                  : 'bg-gradient-to-r from-primary to-brandGold-light text-white hover:from-primary-600 hover:to-brandGold-dark'
              } px-6 py-2.5 text-sm flex items-center gap-2 rounded-md transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105`}
            >
              <CalendarIcon className="h-5 w-5" />
              Book Consultation
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-2 w-72 rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-black ring-opacity-5 border border-gray-100 p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-900">Next Available Slot</h3>
                  <p className="text-primary font-medium">{nextAvailableSlot}</p>
                </div>
                <Link
                  href="/book-consultation"
                  className="block w-full text-center bg-gradient-to-r from-primary to-brandGold-light text-white py-2 rounded-md hover:from-primary-600 hover:to-brandGold-dark transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105"
                >
                  Schedule Now
                </Link>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className={`${mobileButtonClasses} hover:bg-primary-50`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Vola Health Istanbul</span>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-brandGold-light bg-clip-text text-transparent">
                Vola Health
              </span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-primary-50 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* Search in mobile menu */}
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search treatments, doctors..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-gradient-to-r from-primary to-brandGold-light text-white rounded-md hover:from-primary-600 hover:to-brandGold-dark transition-all duration-200"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>

                {navigation.map((item) => {
                  if (item.name === 'Results') {
                    return (
                      <Disclosure key="Results">
                        {({ open }) => (
                          <>
                            <Disclosure.Button className={`-mx-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-primary-50 transition-all duration-200`}>
                              Results
                              <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                            </Disclosure.Button>
                            <Disclosure.Panel className="mt-2 space-y-2">
                              {results.map((result) => (
                                <Link
                                  key={result.name}
                                  href={result.href}
                                  className="flex items-center gap-3 rounded-lg px-6 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary transition-all duration-200"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <span className="text-base">{result.icon}</span>
                                  {result.name}
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        pathname === item.href 
                          ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary' 
                          : 'text-gray-900 hover:bg-primary-50'
                      } transition-all duration-200`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="py-6">
                {/* Language selector in mobile menu */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Language</label>
                  <select
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Book Consultation button in mobile menu */}
                <Link
                  href="/book-consultation"
                  className="block w-full text-center bg-gradient-to-r from-primary to-brandGold-light text-white py-3 rounded-md hover:from-primary-600 hover:to-brandGold-dark transition-all duration-200 shadow-sm hover:shadow"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
} 
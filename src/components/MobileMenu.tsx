'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PhoneIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/before-after', label: 'Before & After' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const ctaButtons = [
    {
      href: '/consultation',
      label: 'Free Consultation',
      icon: CalendarDaysIcon,
      primary: true
    },
          {
        href: 'tel:+905444749881',
        label: '+90 544 474 98 81',
      icon: PhoneIcon,
      primary: false
    }
  ];

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Why Choose Us?', href: '/why-choose-us' },
    { name: 'Results', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-lg border-l border-white/20 z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <Image src="/Vola_edited.jpg" alt="Vola Health Logo" width={32} height={32} className="rounded-none" />
                  <div className="ml-3">
                    <p className="text-white text-professional-bold text-sm">VOLA HEALTH</p>
                    <p className="text-white/60 text-xs">ISTANBUL</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-6">
                <div className="space-y-1 px-6">
                  {navigation.map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * navigation.indexOf(item) }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-professional"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-6 my-6 border-t border-white/20" />

                {/* Quick Services */}
                <div className="px-6">
                  <p className="text-white/60 text-xs text-professional tracking-widest mb-4">POPULAR SERVICES</p>
                  <div className="space-y-2">
                    {[
                      'Hollywood Smile',
                      'Dental Veneers',
                      'Rhinoplasty',
                      'Hair Transplant',
                      'Facelift'
                    ].map((service, index) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Link
                          href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={onClose}
                          className="block px-4 py-2 text-white/80 hover:bg-white/5 rounded text-sm transition-colors"
                        >
                          {service}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </nav>

              {/* CTA Buttons */}
              <div className="p-6 space-y-3 border-t border-white/20">
                {ctaButtons.map((button, index) => (
                  <motion.div
                    key={button.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    <Link
                      href={button.href}
                      onClick={onClose}
                      className={`flex items-center justify-center gap-3 px-6 py-3 rounded-full text-professional transition-colors ${
                        button.primary
                          ? 'bg-white text-black hover:bg-white/90'
                          : 'border border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      <button.icon className="h-5 w-5" />
                      {button.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer Info */}
              <div className="p-6 bg-white/5 text-center">
                <p className="text-white/60 text-xs mb-2">Istanbul, Turkey</p>
                <p className="text-white/80 text-sm text-professional">Vola Health Istanbul</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
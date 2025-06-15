'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/hooks';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Vola Health Istanbul</h3>
            <p className="text-gray-300 mb-4">
              {t('about.content')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('common.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('nav.services')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services/hair-transplant" className="text-gray-300 hover:text-primary transition-colors">
                  {t('services.categories.hair')}
                </Link>
              </li>
              <li>
                <Link href="/services/dental" className="text-gray-300 hover:text-primary transition-colors">
                  {t('services.categories.dental')}
                </Link>
              </li>
              <li>
                <Link href="/services/plastic-surgery" className="text-gray-300 hover:text-primary transition-colors">
                  {t('services.categories.aesthetic')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Istanbul, Turkey</li>
              <li>{t('contact.info.phone')}: +90 544 474 98 81</li>
              <li>{t('contact.info.email')}: info@volahealthistanbul.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 text-center">
              © {new Date().getFullYear()} Vola Health Istanbul. All rights reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
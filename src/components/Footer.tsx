import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">Aesthetic Care</h3>
            <p className="text-gray-300 mb-4">
              Premium medical tourism services in Istanbul, providing world-class aesthetic treatments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services/hair-transplant" className="text-gray-300 hover:text-primary transition-colors">
                  Hair Transplant
                </Link>
              </li>
              <li>
                <Link href="/services/dental" className="text-gray-300 hover:text-primary transition-colors">
                  Dental Aesthetics
                </Link>
              </li>
              <li>
                <Link href="/services/plastic-surgery" className="text-gray-300 hover:text-primary transition-colors">
                  Plastic Surgery
                </Link>
              </li>
              <li>
                <Link href="/services/weight-loss" className="text-gray-300 hover:text-primary transition-colors">
                  Weight Loss
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Istanbul, Turkey</li>
              <li>Phone: +90 555 123 4567</li>
              <li>Email: info@aestheticcare.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Aesthetic Care. All rights reserved.
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
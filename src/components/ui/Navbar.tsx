"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  {
    name: "Services",
    dropdown: true,
    children: [
      { name: "Dental Aesthetics", href: "/services/dental" },
      { name: "Facial Aesthetics", href: "/services/face" },
      { name: "Body Aesthetics", href: "/services/body" },
    ],
  },
  { name: "Team", href: "#team" },
  { name: "Gallery", href: "#gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-900 tracking-tight">
            {/* Replace with your logo if needed */}
            Aesthetic Care Istanbul
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="relative group">
                  <button
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-700 font-medium transition-colors focus:outline-none"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.name}
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </button>
                  <div
                    className={`absolute left-0 top-full mt-2 min-w-[180px] bg-white shadow-lg rounded-xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 ${openDropdown === link.name ? "opacity-100 pointer-events-auto" : ""}`}
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.children?.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-5 py-3 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+905551234567" className="text-blue-700 font-semibold flex items-center gap-2">
            <span>+90 555 123 4567</span>
          </a>
          <Link href="#contact">
            <button className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md">
              Book Consultation
            </button>
          </Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {/* Add mobile menu logic here if needed */}
        </div>
      </nav>
    </header>
  );
}

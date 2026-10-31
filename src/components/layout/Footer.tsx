'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const productLinks = [
    { name: 'Black Pepper', href: '/products?search=pepper' },
    { name: 'White Pepper', href: '/products?search=white+pepper' },
    { name: 'Fennel Seeds', href: '/products?search=fennel' },
    { name: 'Dry Ginger', href: '/products?search=ginger' },
    { name: 'Green Cardamom', href: '/products?search=cardamom' },
    { name: 'Black Cardamom', href: '/products?search=black+cardamom' },
    { name: 'Nutmeg', href: '/products?search=nutmeg' },
    { name: 'Mace (Javitri)', href: '/products?search=mace' },
    { name: 'Cloves (Laung)', href: '/products?search=cloves' },
    { name: 'Star Anise', href: '/products?search=star+anise' },
    { name: 'Cinnamon Sticks', href: '/products?search=cinnamon' },
    { name: 'Fenugreek Seeds', href: '/products?search=fenugreek' },
    { name: 'Bay Leaf (Tejpatta)', href: '/products?search=bay+leaf' },
    { name: 'B2B Bulk Spices', href: '/b2b' },
  ];

  return (
    <footer className="w-full bg-[#1C1B1A] text-[#C5BEB3] pt-16 pb-8 border-t border-[#2E2C2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-10 pb-12 border-b border-[#2C2B29]">
          {/* Column 1: Products Grid (6 Cols) */}
          <div className="lg:col-span-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF] mb-6">
              PRODUCTS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs text-[#A8A196]">
              {productLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-[#B58D59] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Contact Info (3 Cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF] mb-6">
              CONTACT INFO
            </h3>
            <div className="space-y-3 text-xs text-[#A8A196]">
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#B58D59]" />
                <span>{STORE_CONFIG.contact.phone}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#B58D59]" />
                <a
                  href={`mailto:${STORE_CONFIG.contact.email}`}
                  className="hover:text-[#B58D59] transition-colors"
                >
                  {STORE_CONFIG.contact.email}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#B58D59]" />
                <span>{STORE_CONFIG.contact.address}</span>
              </p>

              {/* Social Icons */}
              <div className="flex items-center space-x-4 pt-3 text-[#A8A196]">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#B58D59] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#B58D59] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#B58D59] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#B58D59] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Payment Methods & Back to Top (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#FFFFFF] mb-6">
                PAYMENT METHODS
              </h3>
              <div className="flex flex-wrap gap-2 text-[10px] text-[#A8A196]">
                <span className="px-2.5 py-1 bg-[#262523] border border-[#3A3835] rounded font-mono">
                  UPI / QR
                </span>
                <span className="px-2.5 py-1 bg-[#262523] border border-[#3A3835] rounded font-mono">
                  VISA
                </span>
                <span className="px-2.5 py-1 bg-[#262523] border border-[#3A3835] rounded font-mono">
                  Mastercard
                </span>
                <span className="px-2.5 py-1 bg-[#262523] border border-[#3A3835] rounded font-mono">
                  NetBanking
                </span>
                <span className="px-2.5 py-1 bg-[#262523] border border-[#3A3835] rounded font-mono">
                  COD Available
                </span>
              </div>
            </div>

            {/* Back to top trigger */}
            <div className="mt-8">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#B58D59] hover:text-[#FFFFFF] transition-colors"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A756D]">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.name}. All Rights Reserved. Pure & Artisanal Spices.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <Link href="/b2b" className="hover:text-[#C5BEB3]">
              B2B Commercial Inquiries
            </Link>
            <Link href="/recipes" className="hover:text-[#C5BEB3]">
              Spice Recipes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

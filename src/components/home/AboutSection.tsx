'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Headphones } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function AboutSection() {
  return (
    <div>
      {/* Editorial Story Section (White / Off-White background) */}
      <section id="about" className="w-full bg-white py-16 md:py-24 border-b border-[#EBE5DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Large Editorial Spice Box Image (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full h-[360px] sm:h-[440px] rounded-lg overflow-hidden shadow-editorial border border-[#EBE5DB]">
                <Image
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80"
                  alt="Rasoi Ansh Handcrafted Spices & Artisanal Masalas"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right: Editorial Brand Narrative (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1B1A] leading-tight">
                  About <br />
                  <span className="text-[#B68E5A]">Rasoi Ansh</span>
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#5C5955] leading-relaxed">
                <p>
                  Rasoi Ansh spices are top-grade, handpicked by multi-generational spice masters
                  from heritage farms across Kerala, Rajasthan, and Kashmir. Processed under strict
                  hygienic standards and slow stone-grinding, our spices retain 100% of their
                  natural volatile essential oils, delivering unequalled richness and aroma to every
                  dish.
                </p>
                <p>
                  Rooted in family tradition rather than industrial mass-production, our products
                  are pure, non-irradiated, and free from artificial colors, fillers, or
                  preservatives. We provide both retail household packaging and commercial bulk
                  supplies to renowned chefs, restaurants, and catering institutions.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B68E5A] shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  KNOW MORE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lower Trust / Service Strip (Earthy Gold Background) */}
      <section className="w-full bg-[#B68E5A] py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            {/* Trust 1: Secured Payment */}
            <div className="flex flex-col items-center space-y-2.5 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
                SECURED PAYMENT
              </h3>
              <p className="text-[11px] text-white/80 max-w-xs">
                100% Encrypted & Safe Checkout with instant order verification.
              </p>
            </div>

            {/* Trust 2: Free Shipping */}
            <div className="flex flex-col items-center space-y-2.5 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
                FREE SHIPPING
              </h3>
              <p className="text-[11px] text-white/80 max-w-xs">
                Free domestic courier across India on all orders above ₹499.
              </p>
            </div>

            {/* Trust 3: Customer Support */}
            <div className="flex flex-col items-center space-y-2.5 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
                CUSTOMER SUPPORT
              </h3>
              <p className="text-[11px] text-white/80 max-w-xs">
                Direct hotline & email support for retail home cooks and B2B orders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

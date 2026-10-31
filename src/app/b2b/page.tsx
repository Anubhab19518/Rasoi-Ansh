'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  PackageCheck,
  Percent,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function B2BPage() {
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyRequirement, setMonthlyRequirement] = useState('50kg - 200kg');
  const [spiceRequirements, setSpiceRequirements] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const tiers = [
    {
      name: 'Restaurant / Cloud Kitchen',
      volume: '10kg – 50kg / month',
      discount: '15% – 20% Off Retail',
      packaging: '1kg & 5kg Food-Grade Foil Pouches',
      features: ['FSSAI Batch Lab Reports', 'Weekly Scheduled Dispatch', 'Credit Terms (upon approval)'],
    },
    {
      name: 'Hotel & Catering Institutions',
      volume: '50kg – 250kg / month',
      discount: '25% – 30% Off Retail',
      packaging: '5kg & 10kg Aroma-Lock Barrels',
      features: ['Custom Spice Blends & Roasting', 'Dedicated Key Account Manager', 'Priority Freight Delivery'],
    },
    {
      name: 'Commercial Wholesale / Export',
      volume: '250kg+ / month',
      discount: 'Custom Sourcing Tariff',
      packaging: '25kg & 50kg Jute / Poly Sacks',
      features: ['Direct Mandi / Farm Pricing', 'Agmark Special Grade Certificate', 'Customized White-Label Options'],
    },
  ];

  return (
    <div className="w-full bg-[#F8F5EE]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#1C1B1A] text-white py-16 md:py-24 border-b border-[#2E2C2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 bg-[#B58D59] text-white text-[11px] font-bold uppercase tracking-widest rounded-full">
                COMMERCIAL & INSTITUTIONAL SPICE SUPPLY
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight leading-tight">
                Direct Farm Sourcing for Chefs, Hotels & Cloud Kitchens
              </h1>
              <p className="text-xs sm:text-sm text-[#C5BEB3] max-w-xl leading-relaxed">
                Supply your kitchen with high-curcumin Lakadong turmeric, Tellicherry black pepper,
                and stone-ground garam masalas with certified volatile oil retention and GST invoicing.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#inquiry"
                  className="px-8 py-3.5 bg-[#B58D59] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#9A7542] transition-colors shadow-md"
                >
                  REQUEST B2B QUOTE
                </a>
                <Link
                  href="/products?categoryId=cat-uuid-4"
                  className="px-8 py-3.5 border border-[#44423F] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-[#1C1B1A] transition-colors"
                >
                  VIEW BULK SACKS
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-xl overflow-hidden border border-[#3A3835] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80"
                alt="Rasoi Ansh Commercial Spice Sacks"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tiered Pricing & Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-2">
            VOLUME ADVANTAGE
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
            Wholesale Commercial Tiers
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6864] mt-3">
            Transparent pricing based on monthly culinary consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E8E2D6] p-8 shadow-subtle flex flex-col justify-between hover:shadow-card-hover transition-all"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1B1A]">
                  {tier.name}
                </h3>
                <div className="py-2 border-y border-[#F4EFE6]">
                  <span className="text-xs font-bold text-[#B58D59]">{tier.volume}</span>
                  <p className="text-lg font-extrabold text-[#1C1B1A] mt-1">{tier.discount}</p>
                </div>
                <p className="text-xs font-semibold text-[#5C5955]">
                  Packaging: <strong className="text-[#1C1B1A]">{tier.packaging}</strong>
                </p>
                <ul className="space-y-2 text-xs text-[#6B6864] pt-2">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B58D59] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="#inquiry"
                  className="block w-full text-center py-3 bg-[#FAF7F2] border border-[#D5CEC2] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#1C1B1A] hover:text-white transition-colors"
                >
                  Inquire for Tier
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-editorial p-8 sm:p-12">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF7EE] text-[#1D6A35] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold uppercase text-[#1C1B1A]">
                Inquiry Received
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6864] max-w-md mx-auto">
                Our B2B Key Account Manager will connect with you within 4 business hours with
                custom spice quotes and sample dispatch details.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-8 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B58D59]"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2 pb-4 border-b border-[#F4EFE6]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59]">
                  COMMERCIAL ENQUIRY
                </p>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
                  Request Rasoi Ansh Wholesale Catalog
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Business / Restaurant Name <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spice Route Hospitality Pvt Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Contact Person Name <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chef Raghav Mehta"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Email Address <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@spiceroute.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Phone / WhatsApp <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  Estimated Monthly Volume
                </label>
                <select
                  value={monthlyRequirement}
                  onChange={(e) => setMonthlyRequirement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                >
                  <option value="10kg - 50kg">10kg – 50kg / month</option>
                  <option value="50kg - 200kg">50kg – 200kg / month</option>
                  <option value="200kg - 500kg">200kg – 500kg / month</option>
                  <option value="500kg+">500kg+ (Container / Bulk Sacks)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  Required Spices / Custom Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Royal Garam Masala (5kg bags), Tellicherry Black Pepper 25kg, Pure Lakadong Turmeric..."
                  value={spiceRequirements}
                  onChange={(e) => setSpiceRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-all shadow-md flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>SUBMIT B2B INQUIRY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

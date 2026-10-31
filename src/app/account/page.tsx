'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin?returnUrl=/account');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#B58D59] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D6]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-1">
            CUSTOMER DASHBOARD
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
            Namaste, {user.name}
          </h1>
          <p className="text-xs text-[#7A756D]">{user.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2 bg-white border border-[#D5CEC2] rounded-full text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: My Orders */}
        <Link
          href="/account/orders"
          className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EC] text-[#B58D59] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#1C1B1A] group-hover:text-[#B58D59] transition-colors uppercase tracking-tight">
              Order History
            </h2>
            <p className="text-xs text-[#7A756D] leading-relaxed">
              Track your ongoing spice deliveries, past purchases, and digital invoices.
            </p>
          </div>
          <div className="pt-6 flex items-center text-xs font-bold text-[#B58D59]">
            <span>View Orders</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Saved Addresses */}
        <Link
          href="/account/addresses"
          className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EC] text-[#B58D59] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#1C1B1A] group-hover:text-[#B58D59] transition-colors uppercase tracking-tight">
              Saved Addresses
            </h2>
            <p className="text-xs text-[#7A756D] leading-relaxed">
              Manage your primary shipping addresses for seamless 1-click checkout.
            </p>
          </div>
          <div className="pt-6 flex items-center text-xs font-bold text-[#B58D59]">
            <span>Manage Address Book</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: B2B Wholesale */}
        <Link
          href="/b2b"
          className="bg-[#FAF7F2] p-6 rounded-xl border border-[#E8E2D6] shadow-subtle hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1B1A] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#1C1B1A] group-hover:text-[#B58D59] transition-colors uppercase tracking-tight">
              B2B Commercial Supply
            </h2>
            <p className="text-xs text-[#7A756D] leading-relaxed">
              Wholesale pricing, 1kg - 25kg bulk packing, and GST invoicing for culinary businesses.
            </p>
          </div>
          <div className="pt-6 flex items-center text-xs font-bold text-[#1C1B1A] group-hover:text-[#B58D59]">
            <span>Explore B2B</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}

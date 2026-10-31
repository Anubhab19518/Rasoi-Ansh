'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Trash2, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSavedAddresses, saveAddressForUser, deleteAddressForUser } from '@/lib/auth';
import { StructuredShippingAddress } from '@/types/storefront';

export default function SavedAddressesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?returnUrl=/account/addresses');
      return;
    }
    if (user?.email) {
      const list = getSavedAddresses(user.email);
      setAddresses(list);
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !street || !city || !postalCode) return;

    const newEntry = {
      id: `addr-${Date.now()}`,
      name: name.trim() || user.name,
      phone: phone.trim() || user.phone || '',
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || 'India',
      },
    };

    saveAddressForUser(user.email, newEntry);
    setAddresses(getSavedAddresses(user.email));
    setIsAddingNew(false);
    // Reset form
    setName('');
    setPhone('');
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
  };

  const handleDelete = (id: string) => {
    if (!user?.email) return;
    deleteAddressForUser(user.email, id);
    setAddresses(getSavedAddresses(user.email));
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#B58D59] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#88837C] mb-6">
        <Link href="/" className="hover:text-[#B58D59]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/account" className="hover:text-[#B58D59]">
          Account
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1C1B1A] font-semibold">Saved Addresses</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-1">
            ADDRESS BOOK
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
            Delivery Addresses
          </h1>
        </div>
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B58D59] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* New Address Form */}
      {isAddingNew && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D6] shadow-editorial mb-8 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#F4EFE6]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
              Add New Delivery Address
            </h2>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-[#88837C] hover:text-[#1C1B1A]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={user.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder={user.phone || '+91 98765 00000'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                Street Address / House No.
              </label>
              <input
                type="text"
                required
                placeholder="42 Heritage Spice Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rajasthan"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="302001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-5 py-2.5 border border-[#D5CEC2] rounded-full text-xs font-bold uppercase tracking-wider text-[#6B6864] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B58D59] transition-colors shadow-xs"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards Grid */}
      {addresses.length === 0 && !isAddingNew ? (
        <div className="bg-white rounded-xl border border-[#E8E2D6] p-12 text-center shadow-subtle max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF5EC] text-[#B58D59] flex items-center justify-center">
            <MapPin className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider text-[#1C1B1A]">
            No Saved Addresses
          </h2>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            Save delivery addresses to speed up future checkouts across the store.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-6 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors shadow-md"
            >
              ADD ADDRESS
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addresses.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1C1B1A]">{entry.name}</span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-[#9E9990] hover:text-red-600 transition-colors p-1"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#7A756D] font-mono">{entry.phone}</p>
                <p className="text-xs text-[#5C5955] leading-relaxed pt-1">
                  {entry.address.street}
                  <br />
                  {entry.address.city}, {entry.address.state} - {entry.address.postalCode}
                  <br />
                  {entry.address.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

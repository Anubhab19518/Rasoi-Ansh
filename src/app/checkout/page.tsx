'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  Check,
  Plus,
  Loader2,
  Lock,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { placeOrder, getCoupons } from '@/lib/api';
import { getSavedAddresses, saveAddressForUser } from '@/lib/auth';
import { StructuredShippingAddress, OrderCreationPayload, Coupon } from '@/types/storefront';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    appliedCoupon,
    couponError,
    isValidatingCoupon,
    applyCouponCode,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const list = await getCoupons();
        if (Array.isArray(list)) {
          setAvailableCoupons(list.filter((c) => c.isActive));
        }
      } catch (err) {
        console.warn('Could not fetch coupons in checkout page:', err);
      }
    }
    loadCoupons();
  }, []);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCouponCode(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  // Contact Info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Address selection state
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveAddressToBook, setSaveAddressToBook] = useState(true);

  // Address Fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?returnUrl=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  // Pre-fill user data and saved addresses
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      if (user.phone) {
        setCustomerPhone(user.phone);
      }
      const list = getSavedAddresses(user.email);
      setSavedAddresses(list);
      if (list.length > 0) {
        setSelectedAddressId(list[0].id);
        const addr = list[0].address;
        setStreet(addr.street || '');
        setCity(addr.city || '');
        setState(addr.state || '');
        setPostalCode(addr.postalCode || '');
        setCountry(addr.country || 'India');
        if (list[0].phone) {
          setCustomerPhone(list[0].phone);
        }
        if (list[0].name) {
          setCustomerName(list[0].name);
        }
      }
    }
  }, [user]);

  const handleSelectSavedAddress = (addrEntry: any) => {
    setSelectedAddressId(addrEntry.id);
    const addr = addrEntry.address;
    setStreet(addr.street || '');
    setCity(addr.city || '');
    setState(addr.state || '');
    setPostalCode(addr.postalCode || '');
    setCountry(addr.country || 'India');
    if (addrEntry.phone) {
      setCustomerPhone(addrEntry.phone);
    }
    if (addrEntry.name) {
      setCustomerName(addrEntry.name);
    }
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('India');
    if (user?.phone) {
      setCustomerPhone(user.phone);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName || !street || !city || !postalCode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const shippingAddress: StructuredShippingAddress = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim() || 'India',
    };

    // Save to address book if requested
    if (user?.email && saveAddressToBook && selectedAddressId === 'new') {
      saveAddressForUser(user.email, {
        id: `addr-${Date.now()}`,
        name: customerName,
        phone: customerPhone,
        address: shippingAddress,
      });
    }

    const shippingCharge = subtotal >= 499 ? 0 : 50;
    const finalOrderTotal = Math.max(0, grandTotal + shippingCharge);

    const orderPayload: OrderCreationPayload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      itemsCount: itemCount,
      total: Number(finalOrderTotal.toFixed(2)),
      status: 'PROCESSING',
      paymentMethod,
      couponId: appliedCoupon?.couponId,
      couponCode: appliedCoupon?.code,
      couponDiscount: discountAmount > 0 ? Number(discountAmount.toFixed(2)) : undefined,
      shippingAddress,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        sku: item.sku,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        options: item.selectedOptions,
      })),
    };

    try {
      const response = await placeOrder(orderPayload);
      clearCart();
      const orderId = response?.id || 'order-' + Date.now();
      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMessage(
        err.message || 'We could not place your order. Please check the backend connection and try again.'
      );
      setIsSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B58D59] animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-lg font-bold uppercase text-[#1C1B1A] mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-xs text-[#7A756D] mb-6">
          Add spices to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#B58D59] transition-colors"
        >
          Browse Spices
        </Link>
      </div>
    );
  }

  const shippingCost = subtotal >= 499 ? 0 : 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-1">
          SECURE CHECKOUT
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
          Delivery Address & Order Review
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Shipping & Contact Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A] pb-3 border-b border-[#F4EFE6]">
                1. Customer Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Full Name <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Email Address <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Phone Number (for Courier Updates) <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#F4EFE6]">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
                  2. Shipping Address
                </h2>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectNewAddress}
                    className="text-xs text-[#B58D59] font-bold uppercase tracking-wider hover:underline"
                  >
                    + Enter New Address
                  </button>
                )}
              </div>

              {/* Saved Address Cards */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#88837C]">
                    Select Saved Address:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => handleSelectSavedAddress(entry)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedAddressId === entry.id
                            ? 'border-[#B58D59] bg-[#FAF5EC] shadow-xs'
                            : 'border-[#E2DCCF] bg-white hover:border-[#B58D59]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#1C1B1A]">{entry.name}</span>
                          {selectedAddressId === entry.id && (
                            <Check className="w-3.5 h-3.5 text-[#B58D59]" />
                          )}
                        </div>
                        {entry.phone && (
                          <p className="text-[10px] text-[#88837C] font-mono mb-1">
                            {entry.phone}
                          </p>
                        )}
                        <p className="text-[#6B6864] text-[11px] line-clamp-2">
                          {entry.address.street}, {entry.address.city}, {entry.address.state} -{' '}
                          {entry.address.postalCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                    Street Address & House / Flat No. <span className="text-[#B58D59]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42 Heritage Spice Street, Opp. Royal Market"
                    value={street}
                    onChange={(e) => {
                      setSelectedAddressId('new');
                      setStreet(e.target.value);
                    }}
                    className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg text-xs text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#3A3937] mb-1">
                      City <span className="text-[#B58D59]">*</span>
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
                      State <span className="text-[#B58D59]">*</span>
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
                      PIN Code <span className="text-[#B58D59]">*</span>
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

                {selectedAddressId === 'new' && (
                  <label className="flex items-center space-x-2 text-xs text-[#3A3937] pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAddressToBook}
                      onChange={(e) => setSaveAddressToBook(e.target.checked)}
                      className="w-4 h-4 text-[#B58D59] rounded border-[#D5CEC2] focus:ring-[#B58D59]"
                    />
                    <span>Save this address to my account for future orders</span>
                  </label>
                )}
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A] pb-3 border-b border-[#F4EFE6]">
                3. Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod('PREPAID')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    paymentMethod === 'PREPAID'
                      ? 'border-[#B58D59] bg-[#FAF5EC] shadow-xs'
                      : 'border-[#E2DCCF] bg-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#B58D59] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#1C1B1A]">Online Payment</p>
                    <p className="text-[11px] text-[#7A756D] mt-0.5">
                      UPI, Cards & NetBanking (Instant Confirmation)
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    paymentMethod === 'COD'
                      ? 'border-[#B58D59] bg-[#FAF5EC] shadow-xs'
                      : 'border-[#E2DCCF] bg-white'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#B58D59] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#1C1B1A]">Cash on Delivery</p>
                    <p className="text-[11px] text-[#7A756D] mt-0.5">
                      Pay upon delivery to the courier executive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary & Placement (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A] pb-3 border-b border-[#F4EFE6]">
                Order Items ({itemCount})
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F4EFE6] pr-1">
                {items.map((item) => (
                  <div key={item.sku} className="py-3 flex items-center space-x-3 text-xs">
                    <div className="relative w-12 h-12 rounded bg-[#FAF7F2] border border-[#E5DFD4] overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1C1B1A] truncate">{item.name}</p>
                      {item.selectedOptions && Object.values(item.selectedOptions).length > 0 && (
                        <span className="inline-block text-[10px] font-bold text-[#B58D59] bg-[#FAF5EC] px-1.5 py-0.5 rounded my-0.5">
                          {Object.values(item.selectedOptions).join(', ')}
                        </span>
                      )}
                      <p className="text-[10px] text-[#88837C]">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <div className="text-right font-bold text-[#1C1B1A]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section in Checkout */}
              <div className="pt-2 border-t border-[#F4EFE6]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A756D] mb-2">
                  Promo Voucher
                </label>
                {appliedCoupon ? (
                  <div className="bg-[#EBF7EE] border border-[#A6E1B6] rounded-md p-2.5 flex items-center justify-between text-xs text-[#1D6A35]">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Code <strong>{appliedCoupon.code}</strong> applied (-₹
                        {discountAmount.toFixed(2)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-[#1D6A35] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="e.g. ONAM10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 text-xs uppercase px-3 py-2 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg focus:outline-none focus:border-[#B58D59]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#B58D59] disabled:opacity-50 transition-colors"
                      >
                        {isValidatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>

                    {availableCoupons.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#88837C] flex items-center space-x-1">
                          <Tag className="w-3 h-3 text-[#B58D59]" />
                          <span>Available Offers:</span>
                        </p>
                        <div className="space-y-1">
                          {availableCoupons.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => applyCouponCode(c.code)}
                              className="p-2 rounded border border-dashed border-[#B58D59]/60 bg-[#FAF5EC] hover:bg-[#F5EDE0] cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-extrabold text-[#B58D59] tracking-wider uppercase">
                                  {c.code}
                                </span>
                                <span className="text-[10px] text-[#6B6864] ml-2">
                                  {c.description || `${c.discountValue}% off`}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-[#1C1B1A] uppercase hover:underline">
                                Apply →
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2.5 pt-3 border-t border-[#F4EFE6] text-xs text-[#5C5955]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C1B1A]">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1D6A35]">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#2E7D32] font-semibold">
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#1C1B1A] pt-3 border-t border-[#E8E2D6]">
                  <span>Total to Pay</span>
                  <span className="text-[#B58D59]">
                    ₹{(grandTotal + shippingCost).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] disabled:opacity-50 transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>CREATING ORDER...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>PLACE ORDER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Assurance */}
            <div className="bg-[#FAF7F2] rounded-lg border border-[#E8E2D6] p-4 text-xs text-[#6B6864] space-y-1.5">
              <p className="flex items-center space-x-2 font-semibold text-[#1C1B1A]">
                <ShieldCheck className="w-4 h-4 text-[#B58D59]" />
                <span>100% Authentic Indian Spices Guaranteed</span>
              </p>
              <p className="text-[11px]">
                Your order is processed directly by Rasoi Ansh master spice blenders.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getCoupons } from '@/lib/api';
import { Coupon } from '@/types/storefront';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
    updateQuantity,
    removeItem,
    clearCart,
    applyCouponCode,
    removeCoupon,
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
        console.warn('Could not fetch coupons in cart page:', err);
      }
    }
    loadCoupons();
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCouponCode(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-xl border border-[#E8E2D6] shadow-editorial max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5EC] flex items-center justify-center text-[#B58D59]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-[#1C1B1A]">
            Sign in to view your cart
          </h1>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            Rasoi Ansh secures your artisanal spice selections to your customer account.
          </p>
          <div className="pt-4">
            <Link
              href="/signin?returnUrl=/cart"
              className="inline-block w-full py-3.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors shadow-md"
            >
              SIGN IN / REGISTER
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-xl border border-[#E8E2D6] shadow-editorial max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF5EC] flex items-center justify-center text-[#B58D59]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-[#1C1B1A]">
            Your cart is empty
          </h1>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            Discover our collection of single-origin spices and heritage stone-ground masalas.
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-block w-full py-3.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors shadow-md"
            >
              EXPLORE SPICES
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-1">
          SHOPPING BAG
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
          Your Spice Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E8E2D6] shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-[#F4EFE6] flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
              Selected Spices & Masalas
            </h2>
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-[#F4EFE6]">
            {items.map((item) => {
              const weightLabel = item.selectedOptions
                ? Object.values(item.selectedOptions).join(', ')
                : '';

              return (
                <div
                  key={item.sku}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="relative w-20 h-20 bg-[#FAF7F2] rounded-lg border border-[#E5DFD4] overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80'
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-sm font-bold text-[#1C1B1A] hover:text-[#B58D59] transition-colors truncate block"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] font-mono text-[#88837C] mt-0.5">
                        SKU: {item.sku}
                      </p>
                      {weightLabel && (
                        <span className="inline-block text-[10px] font-bold uppercase text-[#B58D59] bg-[#FAF5EC] px-2 py-0.5 rounded mt-1">
                          {weightLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#D5CEC2] rounded-full bg-[#FAF7F2] px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="text-[#555350] hover:text-[#1C1B1A] p-0.5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1C1B1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        className="text-[#555350] hover:text-[#1C1B1A] p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-extrabold text-[#1C1B1A]">
                        ₹{item.price * item.quantity}
                      </p>
                      <p className="text-[10px] text-[#88837C]">
                        ₹{item.price} each
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="text-[#99948D] hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary & Coupon Engine (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-[#E8E2D6] p-6 shadow-subtle space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A] pb-3 border-b border-[#F4EFE6]">
              Order Summary
            </h2>

            {/* Coupon Application */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A756D] mb-2">
                Promotional Voucher
              </label>
              {appliedCoupon ? (
                <div className="bg-[#EBF7EE] border border-[#A6E1B6] rounded-md p-3 flex items-center justify-between text-xs text-[#1D6A35]">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied!
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-[#1D6A35] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. ONAM10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 text-xs uppercase px-3 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-lg focus:outline-none focus:border-[#B58D59]"
                    />
                    <button
                      type="submit"
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      className="px-4 py-2.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#B58D59] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[75px]"
                    >
                      {isValidatingCoupon ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </form>

                  {/* Available Coupons list */}
                  {availableCoupons.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#88837C] flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-[#B58D59]" />
                        <span>Active Offers from Rasoi Ansh</span>
                      </p>
                      <div className="space-y-1.5">
                        {availableCoupons.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => applyCouponCode(c.code)}
                            className="p-2.5 rounded border border-dashed border-[#B58D59]/60 bg-[#FAF5EC] hover:bg-[#F5EDE0] cursor-pointer transition-colors flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-extrabold text-[#B58D59] tracking-wider uppercase">
                                {c.code}
                              </span>
                              <p className="text-[11px] text-[#6B6864]">
                                {c.description || (c.discountType === 'PERCENTAGE' ? `${c.discountValue}% off` : `₹${c.discountValue} off`)}
                              </p>
                            </div>
                            <span className="text-[11px] font-bold text-[#1C1B1A] uppercase hover:underline">
                              Apply Voucher →
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

            {/* Cost Breakdown */}
            <div className="space-y-3 pt-3 border-t border-[#F4EFE6] text-xs text-[#5C5955]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1C1B1A]">₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#1D6A35]">
                  <span>Voucher Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Domestic Shipping</span>
                <span className="text-[#2E7D32] font-semibold">
                  {subtotal >= 499 ? 'FREE' : '₹50.00'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#1C1B1A] pt-3 border-t border-[#E8E2D6]">
                <span>Grand Total</span>
                <span className="text-[#B58D59]">
                  ₹{(grandTotal + (subtotal >= 499 ? 0 : 50)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-2">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center space-x-2 py-4 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#FAF7F2] rounded-lg border border-[#E8E2D6] p-4 space-y-2 text-xs text-[#6B6864]">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#B58D59]" />
              <span>Safe & Secure Bank-Grade Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#B58D59]" />
              <span>Dispatched within 24-48 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

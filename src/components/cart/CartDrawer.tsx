'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getCoupons } from '@/lib/api';
import { Coupon } from '@/types/storefront';

export default function CartDrawer() {
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
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeItem,
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
        console.warn('Could not fetch coupons:', err);
      }
    }
    if (isCartDrawerOpen) {
      loadCoupons();
    }
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCouponCode(couponInput);
    if (ok) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E5DFD4] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-[#EBE5DB] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#B58D59]" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#1C1B1A]">
                YOUR CART ({isAuthenticated ? itemCount : 0})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-[#7A756D] hover:text-[#1C1B1A] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!isAuthenticated ? (
              /* Signed-out state */
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EFE9DC] flex items-center justify-center text-[#B58D59]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1B1A] mb-2">
                  SIGN IN TO VIEW YOUR CART
                </h3>
                <p className="text-xs text-[#7A756D] mb-6 max-w-xs mx-auto">
                  Rasoi Ansh securely scopes your cart items to your verified customer account.
                </p>
                <Link
                  href="/signin"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block px-8 py-3 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors"
                >
                  SIGN IN / REGISTER
                </Link>
              </div>
            ) : items.length === 0 ? (
              /* Empty Cart */
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EFE9DC] flex items-center justify-center text-[#B58D59]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1B1A] mb-2">
                  YOUR CART IS EMPTY
                </h3>
                <p className="text-xs text-[#7A756D] mb-6">
                  Discover our collection of artisanal whole spices and stone-ground masalas.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block px-8 py-3 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors"
                >
                  EXPLORE SPICES
                </Link>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-4">
                {items.map((item) => {
                  const optionLabel = item.selectedOptions
                    ? Object.values(item.selectedOptions).join(', ')
                    : '';

                  return (
                    <div
                      key={item.sku}
                      className="flex space-x-4 bg-white p-3.5 rounded-lg border border-[#EBE5DB] shadow-xs"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded bg-[#F8F5EE] border border-[#E8E2D6] overflow-hidden flex-shrink-0">
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

                      {/* Info & Stepper */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-semibold text-[#1C1B1A] truncate pr-2">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.sku)}
                            className="text-[#99948D] hover:text-red-600 transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {optionLabel && (
                          <span className="inline-block text-[10px] uppercase font-bold text-[#B58D59] bg-[#FAF5EC] px-1.5 py-0.5 rounded mt-0.5">
                            {optionLabel}
                          </span>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-[#DCD5C9] rounded-full bg-[#FAF7F2] px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                              className="text-[#555350] hover:text-[#1C1B1A] p-0.5"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#1C1B1A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              className="text-[#555350] hover:text-[#1C1B1A] p-0.5"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#1C1B1A]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Coupon Code Section */}
                <div className="pt-2 space-y-3">
                  {appliedCoupon ? (
                    <div className="bg-[#EBF7EE] border border-[#A6E1B6] rounded-md p-2.5 flex items-center justify-between text-xs text-[#1D6A35]">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3.5 h-3.5" />
                        <span>
                          Code <strong>{appliedCoupon.code}</strong> applied (-₹
                          {discountAmount.toFixed(2)})
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] font-bold text-[#1D6A35] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Promo code (e.g. ONAM10)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="w-full text-xs uppercase px-3 py-2 bg-white border border-[#DCD5C9] rounded-md focus:outline-none focus:border-[#B58D59]"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isValidatingCoupon || !couponInput.trim()}
                          className="px-4 py-2 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#B58D59] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[70px]"
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </form>

                      {/* Available Coupons from Admin */}
                      {availableCoupons.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#88837C] flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-[#B58D59]" />
                            <span>Available Offers</span>
                          </p>
                          <div className="space-y-1.5">
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
                                  <p className="text-[10px] text-[#6B6864] line-clamp-1">
                                    {c.description || (c.discountType === 'PERCENTAGE' ? `${c.discountValue}% off` : `₹${c.discountValue} off`)}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold text-[#1C1B1A] uppercase hover:underline">
                                  Apply →
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">
                      {couponError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {isAuthenticated && items.length > 0 && (
            <div className="bg-white px-6 py-5 border-t border-[#EBE5DB] space-y-3">
              <div className="space-y-1.5 text-xs text-[#555350]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C1B1A]">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1D6A35]">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1C1B1A] pt-2 border-t border-[#F0EBE1]">
                  <span>Grand Total</span>
                  <span className="text-[#B58D59]">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors shadow-md"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full block text-center py-2 text-xs font-semibold text-[#6B6864] hover:text-[#1C1B1A]"
                >
                  View Full Cart & Items
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

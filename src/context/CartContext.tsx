'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, CouponValidationResult } from '@/types/storefront';
import { useAuth } from './AuthContext';
import { validateCoupon } from '@/lib/api';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  appliedCoupon: CouponValidationResult | null;
  couponError: string | null;
  isValidatingCoupon: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addItem: (item: CartItem) => { success: boolean; requiresAuth?: boolean };
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Storage key is strictly scoped to the authenticated user ID
  const cartStorageKey = useMemo(() => {
    return user ? `rasoi_cart_${user.id}` : null;
  }, [user]);

  // Load cart when authenticated user changes
  useEffect(() => {
    if (!isAuthenticated || !cartStorageKey) {
      // Clear memory cart when unauthenticated
      setItems([]);
      setAppliedCoupon(null);
      setCouponError(null);
      return;
    }

    try {
      const stored = localStorage.getItem(cartStorageKey);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, [isAuthenticated, cartStorageKey]);

  // Listen for global logout event
  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      setAppliedCoupon(null);
      setCouponError(null);
      setIsCartDrawerOpen(false);
    };

    window.addEventListener('rasoi_auth_logout', handleLogout);
    return () => window.removeEventListener('rasoi_auth_logout', handleLogout);
  }, []);

  // Save cart to user-scoped storage whenever items change
  const persistCart = useCallback(
    (newItems: CartItem[]) => {
      if (cartStorageKey) {
        localStorage.setItem(cartStorageKey, JSON.stringify(newItems));
      }
    },
    [cartStorageKey]
  );

  const addItem = (newItem: CartItem): { success: boolean; requiresAuth?: boolean } => {
    if (!isAuthenticated || !user) {
      return { success: false, requiresAuth: true };
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.sku === newItem.sku);
      let updated: CartItem[];

      if (existingIndex > -1) {
        updated = prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updated = [...prevItems, newItem];
      }

      persistCart(updated);
      return updated;
    });

    setIsCartDrawerOpen(true);
    return { success: true };
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (!isAuthenticated) return;

    setItems((prevItems) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prevItems.filter((item) => item.sku !== sku);
      } else {
        updated = prevItems.map((item) =>
          item.sku === sku ? { ...item, quantity } : item
        );
      }
      persistCart(updated);
      return updated;
    });
  };

  const removeItem = (sku: string) => {
    if (!isAuthenticated) return;

    setItems((prevItems) => {
      const updated = prevItems.filter((item) => item.sku !== sku);
      persistCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
    if (cartStorageKey) {
      localStorage.removeItem(cartStorageKey);
    }
  };

  // Line item computations
  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || !appliedCoupon.valid) return 0;
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      return (subtotal * appliedCoupon.discountValue) / 100;
    }
    return Math.min(appliedCoupon.discountValue, subtotal);
  }, [appliedCoupon, subtotal]);

  const taxAmount = useMemo(() => {
    // 5% GST on Spices & Masalas
    const taxableSubtotal = Math.max(0, subtotal - discountAmount);
    return Math.round(taxableSubtotal * 0.05 * 100) / 100;
  }, [subtotal, discountAmount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + taxAmount);
  }, [subtotal, discountAmount, taxAmount]);

  // Live coupon validation
  const applyCouponCode = async (code: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setCouponError('Please sign in to apply coupons.');
      return false;
    }

    if (items.length === 0) {
      setCouponError('Your cart is empty.');
      return false;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const result = await validateCoupon({
        code: code.trim().toUpperCase(),
        customerEmail: user.email,
        subtotal,
        cartItems: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          pricing: { effectivePrice: item.price },
          price: item.price,
          product: {
            id: item.productId,
            categoryId: item.categoryId,
            price: item.price,
          },
        })),
      });

      if (result.valid) {
        setAppliedCoupon(result);
        setCouponError(null);
        return true;
      } else {
        setCouponError(result.message || 'Invalid coupon code.');
        setAppliedCoupon(null);
        return false;
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to validate coupon code.');
      setAppliedCoupon(null);
      return false;
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
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
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

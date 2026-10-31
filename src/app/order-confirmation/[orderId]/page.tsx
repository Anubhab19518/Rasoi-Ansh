'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Tag,
  Receipt,
} from 'lucide-react';
import { getOrderById } from '@/lib/api';
import { OrderResponse } from '@/types/storefront';

interface OrderConfirmationPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getOrderById(params.orderId);
        if (data) {
          setOrder(data);
        }
      } catch (err: any) {
        console.error('Unable to load order from backend:', err);
        setFetchError(err.message || 'Unable to load order details');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#B58D59] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#7A756D]">
          Fetching order details...
        </p>
      </div>
    );
  }

  const steps = [
    { label: 'Received', status: 'PENDING' },
    { label: 'Processing', status: 'PROCESSING' },
    { label: 'Confirmed', status: 'CONFIRMED' },
    { label: 'Shipped', status: 'SHIPPED' },
    { label: 'Delivered', status: 'DELIVERED' },
  ];

  const currentStatus = order?.status || 'PROCESSING';
  const currentStepIndex = steps.findIndex((s) => s.status === currentStatus);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 1;

  const address = order?.shippingAddress;
  const addressLines = typeof address === 'object' && address !== null ? (
    <div className="space-y-1">
      <p className="font-bold text-[#1C1B1A]">{order?.customerName}</p>
      <p className="text-[#5C5955]">{address.street}</p>
      <p className="text-[#5C5955]">
        {address.city}, {address.state} - {address.postalCode}
      </p>
      <p className="text-[#5C5955]">{address.country || 'India'}</p>
      {order?.customerPhone && (
        <p className="text-xs text-[#7A756D] font-mono pt-1">
          Phone: {order.customerPhone}
        </p>
      )}
      <p className="text-xs text-[#7A756D] font-mono">
        Email: {order?.customerEmail}
      </p>
    </div>
  ) : (
    <div className="space-y-1">
      <p className="font-bold text-[#1C1B1A]">{order?.customerName}</p>
      <p className="text-[#5C5955]">{String(address || 'Standard Delivery Address')}</p>
      {order?.customerPhone && <p className="text-xs text-[#7A756D]">Phone: {order.customerPhone}</p>}
      <p className="text-xs text-[#7A756D]">Email: {order?.customerEmail}</p>
    </div>
  );

  // Computed Item Subtotal
  const itemsSubtotal = order?.items && Array.isArray(order.items)
    ? order.items.reduce((acc: number, it: any) => acc + (Number(it.price || 0) * Number(it.quantity || 1)), 0)
    : Number(order?.total || 0);

  const couponDiscount = Number(order?.couponDiscount || 0);
  const taxableSubtotal = Math.max(0, itemsSubtotal - couponDiscount);
  const estimatedTax = Math.round(taxableSubtotal * 0.05 * 100) / 100;
  const shippingCost = itemsSubtotal >= 499 ? 0 : 50;
  const orderTotal = Number(order?.total || (taxableSubtotal + estimatedTax + shippingCost));

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Top Banner Card */}
      <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-editorial p-8 sm:p-12 text-center space-y-4 mb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EBF7EE] text-[#1D6A35] flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59]">
          ORDER CONFIRMED
        </p>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1B1A] uppercase tracking-tight">
          Thank you for choosing Rasoi Ansh
        </h1>

        <p className="text-xs sm:text-sm text-[#6B6864] max-w-md mx-auto">
          Your order has been recorded. Our master spice blenders are preparing your freshly
          packed batch.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block bg-[#FAF5EC] border border-[#E8E0D2] px-4 py-2 rounded-full text-xs font-mono font-bold text-[#1C1B1A]">
            Order ID: {order?.id || params.orderId}
          </span>
          <span className="inline-block bg-[#FAF7F2] border border-[#E8E2D6] px-3 py-2 rounded-full text-xs text-[#7A756D]">
            Placed on {formattedDate}
          </span>
        </div>
      </div>

      {/* Real-Time Order Status Stepper */}
      <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-subtle p-6 sm:p-8 mb-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
            Fulfillment Status
          </h2>
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#FAF5EC] text-[#B58D59] border border-[#E8E0D2]">
            {currentStatus}
          </span>
        </div>

        <div className="relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#EBE5DB] z-0" />
          {/* Progress Active Line */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#B58D59] z-0 transition-all duration-500"
            style={{
              width: `${(activeIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#B58D59] text-white shadow-xs'
                      : 'bg-white border-2 border-[#D5CEC2] text-[#88837C]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-2 ${
                    isCurrent ? 'text-[#1C1B1A] font-bold' : 'text-[#88837C]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ordered Products Table */}
      {order?.items && order.items.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-subtle p-6 sm:p-8 mb-8 space-y-4">
          <div className="flex items-center space-x-2 text-[#B58D59] pb-3 border-b border-[#F4EFE6]">
            <Package className="w-4 h-4" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
              Ordered Items ({order.items.length})
            </h2>
          </div>

          <div className="divide-y divide-[#F4EFE6]">
            {order.items.map((item: any, idx: number) => {
              const weightLabel = item.options
                ? Object.values(item.options).join(', ')
                : '';

              return (
                <div
                  key={idx}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-[#1C1B1A]">
                      {item.productName || item.sku || 'Rasoi Ansh Spice'}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-[#88837C]">
                      {item.sku && <span className="font-mono">SKU: {item.sku}</span>}
                      {weightLabel && (
                        <span className="font-bold text-[#B58D59] bg-[#FAF5EC] px-2 py-0.5 rounded border border-[#E8E0D2]">
                          {weightLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
                    <div className="text-[#5C5955]">
                      <span>Qty: <strong>{item.quantity}</strong></span>
                      <span className="text-[#88837C] ml-2">× ₹{item.price}</span>
                    </div>
                    <div className="text-right font-extrabold text-sm text-[#1C1B1A] min-w-[70px]">
                      ₹{item.total || (item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Destination & Price Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Delivery Details */}
        <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-subtle p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#B58D59] pb-2 border-b border-[#F4EFE6]">
            <MapPin className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
              Delivery Destination
            </h3>
          </div>
          <div className="text-xs">{addressLines}</div>
        </div>

        {/* Detailed Price Breakdown */}
        <div className="bg-white rounded-xl border border-[#E8E2D6] shadow-subtle p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#B58D59] pb-2 border-b border-[#F4EFE6]">
            <Receipt className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
              Price Breakdown
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-[#5C5955]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#1C1B1A]">₹{itemsSubtotal.toFixed(2)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-[#1D6A35]">
                <span>Voucher Discount ({order?.couponCode})</span>
                <span>-₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Domestic Shipping</span>
              <span className="text-[#2E7D32] font-semibold">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E8E2D6] text-base font-extrabold text-[#1C1B1A]">
              <span>Amount Paid / Total</span>
              <span className="text-[#B58D59]">₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/account/orders"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors shadow-md text-center"
        >
          VIEW MY ORDERS
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto px-8 py-3.5 border border-[#D5CEC2] bg-white text-[#1C1B1A] text-xs font-bold uppercase tracking-widest rounded-full hover:border-[#B58D59] hover:text-[#B58D59] transition-colors text-center"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}

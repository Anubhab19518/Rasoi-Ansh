'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Clock, ArrowRight, Loader2, ChevronRight, AlertCircle, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/lib/api';
import { OrderResponse } from '@/types/storefront';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?returnUrl=/account/orders');
      return;
    }

    async function loadOrders() {
      if (!user) return;
      try {
        const allOrders = await getAllOrders();
        if (Array.isArray(allOrders)) {
          // Filter to user email
          const userOrders = allOrders.filter(
            (o) => o.customerEmail?.toLowerCase() === user.email.toLowerCase()
          );
          setOrders(userOrders);
        }
      } catch (err) {
        console.warn('Could not fetch all orders from backend:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B58D59] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-[#88837C] mb-6">
        <Link href="/" className="hover:text-[#B58D59]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/account" className="hover:text-[#B58D59]">
          Account
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1C1B1A] font-semibold">Orders</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-1">
          PURCHASE HISTORY
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
          My Spice Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E2D6] p-12 text-center shadow-subtle max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF5EC] text-[#B58D59] flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider text-[#1C1B1A]">
            No Orders Placed Yet
          </h2>
          <p className="text-xs text-[#7A756D] leading-relaxed">
            Your artisanal spice deliveries and invoices will appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] transition-colors shadow-md"
            >
              EXPLORE SPICES
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent Order';

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl border border-[#E8E2D6] shadow-subtle hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-[#1C1B1A]">
                      {order.orderNumber || order.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        order.status === 'DELIVERED'
                          ? 'bg-[#EBF7EE] text-[#1D6A35]'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-[#FAF5EC] text-[#B58D59]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#7A756D] flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-[#A8A196]" />
                    <span>Placed on {formattedDate}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5955]">
                    <span>
                      {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'} • Total:{' '}
                      <strong className="text-[#1C1B1A]">₹{order.total}</strong>
                    </span>
                    {order.couponCode && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-[#1D6A35] bg-[#EBF7EE] px-2 py-0.5 rounded border border-[#A6E1B6]">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{order.couponCode} applied</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#FAF7F2] border border-[#D5CEC2] rounded-full text-xs font-bold uppercase tracking-wider text-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-white transition-all shadow-xs"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

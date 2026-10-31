'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Check } from 'lucide-react';
import { Product } from '@/types/storefront';
import { useSpiceConfigurator } from '@/hooks/useSpiceConfigurator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface FeaturedProductSectionProps {
  products: Product[];
}

function FeaturedMainCard({ product }: { product: Product }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const {
    price,
    regularPrice,
    sku,
    activeVariant,
    selectedWeightLabel,
    primaryImage,
    isOutOfStock,
  } = useSpiceConfigurator(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(
        `/signin?returnUrl=${encodeURIComponent(
          `/products/${product.slug || product.id}`
        )}`
      );
      return;
    }

    if (isOutOfStock) return;

    const res = addItem({
      productId: product.id,
      variantId: activeVariant?.id || null,
      name: product.name,
      sku,
      price,
      regularPrice,
      quantity: 1,
      imageUrl: primaryImage,
      selectedOptions: selectedWeightLabel ? { Weight: selectedWeightLabel } : undefined,
      categoryId: product.categoryId,
    });

    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <div className="lg:col-span-6 bg-white rounded-2xl flex flex-col justify-between shadow-editorial relative overflow-hidden group">
      {/* Quick Add Plus Button Top Left */}
      <button
        onClick={handleQuickAdd}
        className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-[#B68E5A] text-white flex items-center justify-center hover:bg-[#1C1B1A] transition-colors shadow-md"
        aria-label="Add to cart"
      >
        {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>

      {/* Product Center Image - full-bleed top */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="relative w-full h-[320px] sm:h-[380px] block overflow-hidden bg-[#FAF7F2]"
      >
        <Image
          src={
            primaryImage ||
            'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
          }
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </Link>

      {/* Bottom Details (Product Name + Item Code + Price Pill) */}
      <div className="p-5 sm:p-6 flex items-end justify-between border-t border-[#F4EFE6] bg-white">
        <div>
          <Link
            href={`/products/${product.slug || product.id}`}
            className="text-lg sm:text-xl font-bold text-[#1C1B1A] hover:text-[#B68E5A] transition-colors uppercase tracking-tight block"
          >
            {product.name}
          </Link>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-[#88837C] font-mono">
              Item Code: {sku}
            </p>
            {selectedWeightLabel && (
              <span className="text-[10px] font-bold text-[#B68E5A] bg-[#FAF5EC] px-1.5 py-0.5 rounded">
                {selectedWeightLabel}
              </span>
            )}
          </div>
        </div>

        {/* Price Pill */}
        <div className="bg-[#B68E5A] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-1 shadow-xs">
          <span>₹</span>
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
}

function FeaturedSecondaryCard({ product }: { product: Product }) {
  const { price, sku, selectedWeightLabel, primaryImage } = useSpiceConfigurator(product);

  return (
    <div className="bg-white rounded-xl flex flex-col justify-between shadow-editorial relative overflow-hidden group hover:shadow-card-hover transition-all">
      {/* Product Image - full bleed top */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="relative w-full h-[150px] sm:h-[175px] block overflow-hidden bg-[#FAF7F2]"
      >
        <Image
          src={
            primaryImage ||
            'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=500&q=80'
          }
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Bottom Details */}
      <div className="p-3.5 sm:p-4 flex items-end justify-between border-t border-[#F4EFE6] bg-white">
        <div className="min-w-0 pr-2">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="text-xs sm:text-sm font-bold text-[#1C1B1A] hover:text-[#B68E5A] transition-colors truncate block"
          >
            {product.name}
          </Link>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <p className="text-[10px] text-[#88837C] font-mono truncate">
              Item Code: {sku}
            </p>
            {selectedWeightLabel && (
              <span className="text-[9px] font-bold text-[#B68E5A] bg-[#FAF5EC] px-1 rounded">
                {selectedWeightLabel}
              </span>
            )}
          </div>
        </div>

        {/* Price Pill */}
        <div className="bg-[#B68E5A] text-white px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-xs flex items-center space-x-0.5">
          <span>₹</span>
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductSection({ products }: FeaturedProductSectionProps) {
  const mainProduct: Product = products[0] || {
    id: 'prod-black-pepper',
    ecommerceId: 'c3d7764d-b379-4eec-8c53-8dc6a58e0f35',
    categoryId: 'cat-whole-spices',
    name: 'Tellicherry Black Pepper',
    slug: 'tellicherry-black-pepper',
    price: 250,
    offerPrice: 250,
    quantity: 100,
    status: 'ACTIVE',
    hasVariants: true,
    variants: [{ id: 'v-bp', sku: 'BPP9901', price: 250, quantity: 100, status: 'ACTIVE' }],
    description: 'Tellicherry Extra Bold whole black peppercorns from Malabar Coast.',
    images: [
      {
        id: '1',
        imageUrl:
          'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
  };

  const secondaryProducts: Product[] =
    products.length > 1
      ? products.slice(1, 5)
      : [
          {
            id: 'prod-cinnamon',
            ecommerceId: 'c3d7764d-b379-4eec-8c53-8dc6a58e0f35',
            categoryId: 'cat-whole-spices',
            name: 'Ceylon Cinnamon',
            slug: 'ceylon-cinnamon-sticks',
            price: 198,
            offerPrice: 198,
            quantity: 100,
            status: 'ACTIVE',
            hasVariants: true,
            variants: [{ id: 'v-cin', sku: 'CNMN01', price: 198, quantity: 100, status: 'ACTIVE' }],
            images: [
              {
                id: '2',
                imageUrl:
                  'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=500&q=80',
                isPrimary: true,
              },
            ],
          },
          {
            id: 'prod-cardamom',
            ecommerceId: 'c3d7764d-b379-4eec-8c53-8dc6a58e0f35',
            categoryId: 'cat-whole-spices',
            name: 'Green Cardamon',
            slug: 'green-cardamon',
            price: 240,
            offerPrice: 240,
            quantity: 100,
            status: 'ACTIVE',
            hasVariants: true,
            variants: [{ id: 'v-card', sku: 'GREENC-100G', price: 240, quantity: 100, status: 'ACTIVE' }],
            images: [
              {
                id: '3',
                imageUrl:
                  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
                isPrimary: true,
              },
            ],
          },
        ];

  return (
    <section className="w-full bg-[#B68E5A] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left: Big Featured Product Card (6 cols) */}
          <FeaturedMainCard product={mainProduct} />

          {/* Right: 2x2 Grid of Secondary Products (6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {secondaryProducts.map((prod) => (
              <FeaturedSecondaryCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

        {/* View All Products Button Centered Below Section */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block px-10 py-3.5 border border-white/60 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-[#B68E5A] transition-all duration-300 shadow-sm"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}

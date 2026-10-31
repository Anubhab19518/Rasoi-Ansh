'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/storefront';
import { useSpiceConfigurator } from '@/hooks/useSpiceConfigurator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const {
    availableWeights,
    selectedWeight,
    selectedWeightLabel,
    setSelectedWeight,
    activeVariant,
    price,
    regularPrice,
    sku,
    isOutOfStock,
    isB2B,
    primaryImage,
  } = useSpiceConfigurator(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/signin?returnUrl=${encodeURIComponent(`/products/${product.slug || product.id}`)}`);
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

  const discountPercent =
    regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-[#E8E2D6] overflow-hidden flex flex-col justify-between shadow-subtle hover:shadow-card-hover transition-all duration-300 group">
      <div>
        {/* Top Badges & Product Image */}
        <div className="relative w-full aspect-square bg-[#FAF7F2] overflow-hidden border-b border-[#F4EFE6]">
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 z-10 bg-[#B58D59] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {isB2B && (
            <span className="absolute top-3 right-3 z-10 bg-[#1C1B1A] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
              B2B BULK
            </span>
          )}

          <Link
            href={`/products/${product.slug || product.id}`}
            className="relative w-full h-full block"
          >
            <Image
              src={
                primaryImage ||
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80'
              }
              alt={product.name}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Category / Subtitle */}
          <div className="flex items-center justify-between text-[11px] text-[#88837C]">
            <span className="uppercase font-semibold tracking-wider">
              {product.category?.name || 'Rasoi Ansh Spice'}
            </span>
            <span className="font-mono text-[10px]">{sku}</span>
          </div>

          {/* Product Title */}
          <Link
            href={`/products/${product.slug || product.id}`}
            className="block text-sm sm:text-base font-bold text-[#1C1B1A] hover:text-[#B58D59] transition-colors leading-snug line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Weight / Variant Chips */}
          {availableWeights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableWeights.map((w) => (
                <button
                  key={w.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeight(w.value);
                  }}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                    selectedWeight === w.value
                      ? 'border-[#B58D59] bg-[#FAF5EC] text-[#B58D59]'
                      : 'border-[#E2DC CF] text-[#6B6864] hover:border-[#B58D59]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pricing & Add to Cart Button */}
      <div className="p-4 sm:p-5 pt-0 border-t border-[#F8F5EE] flex items-center justify-between mt-2">
        <div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-extrabold text-[#1C1B1A]">
              ₹{price}
            </span>
            {regularPrice > price && (
              <span className="text-xs text-[#A19B91] line-through font-normal">
                ₹{regularPrice}
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#88837C]">Excl. of taxes</p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
            isOutOfStock
              ? 'bg-[#EAE5DC] text-[#A8A196] cursor-not-allowed'
              : justAdded
              ? 'bg-[#1D6A35] text-white'
              : 'bg-[#1C1B1A] text-white hover:bg-[#B58D59]'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {isOutOfStock ? (
            <span>Sold Out</span>
          ) : justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

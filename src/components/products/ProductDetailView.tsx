'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Package,
  ZoomIn,
} from 'lucide-react';
import { Product } from '@/types/storefront';
import { useSpiceConfigurator } from '@/hooks/useSpiceConfigurator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem, setIsCartDrawerOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [justAdded, setJustAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const {
    availableWeights,
    selectedWeight,
    selectedWeightLabel,
    setSelectedWeight,
    activeVariant,
    price,
    regularPrice,
    sku,
    stock,
    isOutOfStock,
    isB2B,
    primaryImage,
  } = useSpiceConfigurator(product);

  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (activeVariant?.images && activeVariant.images.length > 0) {
      activeVariant.images.forEach((img) => {
        if (img.imageUrl || img.url) list.push(img.imageUrl || img.url || '');
      });
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const url = img.imageUrl || img.url;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    if (list.length === 0) {
      list.push(
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
      );
    }
    return list;
  }, [product, activeVariant]);

  const currentImage = allImages[selectedImageIndex] || allImages[0];

  const handleAddToCart = (buyNow = false) => {
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
      quantity,
      imageUrl: currentImage,
      selectedOptions: selectedWeightLabel ? { Weight: selectedWeightLabel } : undefined,
      categoryId: product.categoryId,
    });

    if (res.success) {
      if (buyNow) {
        setIsCartDrawerOpen(false);
        router.push('/checkout');
      } else {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    }
  };

  const discountPercent =
    regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;

  // Detail sections derived dynamically from backend admin product.details
  const detailSections: Array<{ title: string; content: string }> = React.useMemo(() => {
    // 1. If product.details is an array of objects
    if (Array.isArray(product.details) && product.details.length > 0) {
      return product.details
        .map((item: any, idx: number) => {
          if (typeof item === 'object' && item !== null) {
            const title =
              item.title || item.name || item.key || item.heading || `Specification ${idx + 1}`;
            const content =
              item.content || item.value || item.description || item.text || '';
            return { title, content };
          }
          if (typeof item === 'string' && item.trim()) {
            return { title: `Specification ${idx + 1}`, content: item.trim() };
          }
          return null;
        })
        .filter(Boolean) as Array<{ title: string; content: string }>;
    }

    // 2. If product.detailSections is provided
    if (Array.isArray(product.detailSections) && product.detailSections.length > 0) {
      return product.detailSections;
    }

    // 3. If product.specifications is an array
    if (
      Array.isArray((product as any).specifications) &&
      (product as any).specifications.length > 0
    ) {
      return (product as any).specifications.map((item: any, idx: number) => ({
        title: item.title || item.key || item.name || `Specification ${idx + 1}`,
        content: item.content || item.value || '',
      }));
    }

    // 4. If product.details is a key-value object
    if (
      typeof product.details === 'object' &&
      product.details !== null &&
      !Array.isArray(product.details)
    ) {
      return Object.entries(product.details).map(([key, val]) => ({
        title: key,
        content: typeof val === 'object' ? JSON.stringify(val) : String(val),
      }));
    }

    // 5. Fallback only if no specifications are configured in admin panel
    return [
      {
        title: 'Authenticity & Purity',
        content:
          '100% pure, single-origin artisanal spices tested for essential oil richness and natural aroma.',
      },
      {
        title: 'Certifications & Storage',
        content:
          '100% Pesticide tested, FSSAI Certified. Store in an airtight container in a cool, dry place away from direct sunlight.',
      },
    ];
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#88837C] mb-8">
        <Link href="/" className="hover:text-[#B58D59]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-[#B58D59]">
          Spices
        </Link>
        <ChevronRight className="w-3 h-3" />
        {product.category && (
          <>
            <Link
              href={`/products?categoryId=${product.categoryId}`}
              className="hover:text-[#B58D59]"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-[#1C1B1A] font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left: Product Images Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image Container with Amazon / Flipkart Style Interactive Pan-Zoom */}
          <div
            className="relative w-full aspect-square bg-[#FAF7F2] rounded-xl border border-[#E8E2D6] shadow-editorial overflow-hidden cursor-crosshair group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-20 bg-[#B58D59] text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
                {discountPercent}% OFF
              </span>
            )}
            {isB2B && (
              <span className="absolute top-4 right-4 z-20 bg-[#1C1B1A] text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
                B2B Bulk Sacks
              </span>
            )}

            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover select-none transition-transform duration-150 ease-out ${
                  isZoomed ? 'scale-[2.4]' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />
            </div>

            {/* Magnifier indicator hint */}
            {!isZoomed && (
              <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Roll over image to zoom</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#B58D59] ring-2 ring-[#B58D59]/20'
                      : 'border-[#E8E2D6] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Configurator (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Category */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B58D59]">
              {product.category?.name || 'Rasoi Ansh Artisanal Spice'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1B1A] uppercase tracking-tight mt-1">
              {product.name}
            </h1>
            <p className="text-xs font-mono text-[#88837C] mt-1">
              SKU: <strong className="text-[#1C1B1A]">{sku}</strong>
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 pb-4 border-b border-[#EBE5DB]">
            <span className="text-3xl font-extrabold text-[#1C1B1A]">
              ₹{price}
            </span>
            {regularPrice > price && (
              <span className="text-base text-[#A19B91] line-through">
                ₹{regularPrice}
              </span>
            )}
            <span className="text-xs text-[#7A756D] font-semibold bg-[#FAF7F2] border border-[#E8E2D6] px-2.5 py-1 rounded">
              Excl. of taxes (+5% GST at checkout)
            </span>
          </div>

          {/* Markdown Description */}
          <div className="pt-1">
            <MarkdownRenderer
              content={
                product.description ||
                'Authentic, farm-fresh single-origin spice handpicked and processed under rigorous quality standards for uncompromised aroma and purity.'
              }
            />
          </div>

          {/* Pack Size / Weight Selection */}
          {availableWeights.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
                Select Pack Size / Weight:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableWeights.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeight(w.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                      selectedWeight === w.value
                        ? 'border-[#B58D59] bg-[#FAF5EC] text-[#B58D59] shadow-xs'
                        : 'border-[#E0D9CD] bg-white text-[#3A3937] hover:border-[#B58D59]'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability indicator */}
          <div className="text-xs flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isOutOfStock ? 'bg-red-500' : 'bg-[#2E7D32]'
              }`}
            />
            <span className="font-semibold text-[#1C1B1A]">
              {isOutOfStock
                ? 'Out of Stock'
                : `In Stock (${stock > 20 ? 'Ready for Dispatch' : `Only ${stock} left`})`}
            </span>
          </div>

          {/* Quantity Stepper and Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#D5CEC2] rounded-full bg-white px-3 py-2 shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="text-[#6B6864] hover:text-[#1C1B1A] p-1 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-[#1C1B1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stock || 50, q + 1))}
                  disabled={isOutOfStock || (stock !== undefined && quantity >= stock)}
                  className="text-[#6B6864] hover:text-[#1C1B1A] p-1 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-[#E0D9CD] text-[#88837C] cursor-not-allowed'
                    : justAdded
                    ? 'bg-[#1D6A35] text-white'
                    : 'bg-[#1C1B1A] text-white hover:bg-[#B58D59]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now CTA */}
            {!isOutOfStock && (
              <button
                onClick={() => handleAddToCart(true)}
                className="w-full py-3.5 px-6 border border-[#B58D59] bg-[#B58D59] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#9A7542] transition-colors shadow-xs"
              >
                BUY NOW
              </button>
            )}
          </div>

          {/* Purity & Trust Points */}
          <div className="pt-4 border-t border-[#EBE5DB] grid grid-cols-2 gap-3 text-xs text-[#5C5955]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#B58D59]" />
              <span>100% Pure & Stone Ground</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#B58D59]" />
              <span>FSSAI & Agmark Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#B58D59]" />
              <span>Fast Domestic Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#B58D59]" />
              <span>Aroma-Lock Packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rich Specifications & Details Accordion / Tabs */}
      <div className="mt-16 md:mt-24 pt-10 border-t border-[#E0D9CD]">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1C1B1A] mb-8 text-center">
          Product Specifications & Heritage
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detailSections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-[#E8E2D6] shadow-subtle space-y-2"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#B58D59]">
                {sec.title}
              </h3>
              <MarkdownRenderer content={sec.content} />
            </div>
          ))}
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 md:mt-24 pt-10 border-t border-[#E0D9CD]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1C1B1A]">
              You May Also Love
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-[#B58D59] hover:underline"
            >
              View All Spices →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rp) => (
              <div
                key={rp.id}
                className="bg-white p-4 rounded-lg border border-[#E8E2D6] flex flex-col justify-between shadow-subtle group"
              >
                <Link
                  href={`/products/${rp.slug || rp.id}`}
                  className="relative w-full aspect-square flex items-center justify-center my-2"
                >
                  <Image
                    src={
                      rp.images?.[0]?.imageUrl ||
                      rp.images?.[0]?.url ||
                      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={rp.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="pt-3 border-t border-[#F4EFE6]">
                  <Link
                    href={`/products/${rp.slug || rp.id}`}
                    className="text-xs font-bold text-[#1C1B1A] group-hover:text-[#B58D59] truncate block"
                  >
                    {rp.name}
                  </Link>
                  <p className="text-xs font-bold text-[#1C1B1A] mt-1">
                    ₹{rp.offerPrice || rp.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

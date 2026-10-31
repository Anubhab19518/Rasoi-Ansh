import React from 'react';
import HeroBannerSlider from '@/components/hero/HeroBannerSlider';
import FeaturedProductSection from '@/components/products/FeaturedProductSection';
import AboutSection from '@/components/home/AboutSection';
import { getBanners, getProducts } from '@/lib/api';
import { Banner, Product } from '@/types/storefront';

export const revalidate = 0; // Fetch fresh data on every request

export default async function HomePage() {
  let banners: Banner[] = [];
  let products: Product[] = [];

  try {
    const bannersData = await getBanners();
    if (Array.isArray(bannersData)) {
      banners = bannersData;
    }
  } catch (err) {
    console.warn('Unable to load banners from backend on SSR, using client fallback:', err);
  }

  try {
    const productsData = await getProducts({ status: 'ACTIVE', limit: 8 });
    if (Array.isArray(productsData)) {
      products = productsData;
    }
  } catch (err) {
    console.warn('Unable to load products from backend on SSR, using client fallback:', err);
  }

  return (
    <div className="w-full">
      {/* 1. Dynamic Hero Banner Section */}
      <HeroBannerSlider initialBanners={banners} />

      {/* 2. Asymmetric Featured Products Section (Gold Background) */}
      <FeaturedProductSection products={products} />

      {/* 3. Editorial About Brand Story & Trust Strip */}
      <AboutSection />
    </div>
  );
}

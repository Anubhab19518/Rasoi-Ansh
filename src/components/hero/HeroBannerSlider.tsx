'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/types/storefront';
import { getBanners } from '@/lib/api';

interface HeroBannerSliderProps {
  initialBanners?: Banner[];
}

export default function HeroBannerSlider({ initialBanners }: HeroBannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!initialBanners || initialBanners.length === 0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await getBanners();
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback editorial slides matching reference
          setBanners([
            {
              id: 'fallback-1',
              ecommerceId: '',
              title: 'STAR ANISE',
              subtitle:
                'Star anise has been used in Asian and Eurasian cooking for many, many years. This age-old spice is not only known as a culinary expert, but is also famous for its medicinal properties.',
              imageUrl:
                'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
              redirectUrl: '/products?search=star+anise',
              displayOrder: 0,
              isActive: true,
            },
            {
              id: 'fallback-2',
              ecommerceId: '',
              title: 'ROYAL GARAM MASALA',
              subtitle:
                'An authentic heritage blend of 16 roasted whole spices stone-ground in small batches to preserve natural volatile aromatic oils.',
              imageUrl:
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
              redirectUrl: '/products?search=garam+masala',
              displayOrder: 1,
              isActive: true,
            },
          ]);
        }
      } catch (err) {
        // Fallback default
        setBanners([
          {
            id: 'fallback-1',
            ecommerceId: '',
            title: 'STAR ANISE',
            subtitle:
              'Star anise has been used in Asian and Eurasian cooking for many, many years. This age-old spice is not only known as a culinary expert, but is also famous for its medicinal properties.',
            imageUrl:
              'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
            redirectUrl: '/products',
            displayOrder: 0,
            isActive: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    if (!initialBanners || initialBanners.length === 0) {
      loadBanners();
    }
  }, [initialBanners]);

  // Buttery-smooth automatic slide transition with hover pause
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  if (isLoading || banners.length === 0) {
    return (
      <section className="w-full bg-[#F8F5EE] min-h-[calc(100vh-5rem)] min-h-[calc(100dvh-5rem)] flex items-center justify-center py-12">
        <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-pulse">
          <div className="space-y-4">
            <div className="h-4 bg-[#EBE5DB] w-32 rounded"></div>
            <div className="h-12 bg-[#E0D9CD] w-3/4 rounded"></div>
            <div className="h-16 bg-[#EBE5DB] w-full rounded"></div>
            <div className="h-10 bg-[#1C1B1A]/20 w-32 rounded-full"></div>
          </div>
          <div className="h-80 bg-[#E8E2D6] rounded-xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative w-full bg-[#F8F5EE] overflow-hidden min-h-[calc(100vh-5rem)] min-h-[calc(100dvh-5rem)] flex flex-col justify-between py-6 md:py-10 border-b border-[#EBE5DB]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        {/* Stacked cross-fade viewport */}
        <div className="relative w-full h-[460px] sm:h-[500px] md:h-[480px] lg:h-[520px] max-h-[62vh]">
          {banners.map((banner, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={banner.id || idx}
                className={`absolute inset-0 w-full h-full flex items-center transition-all duration-1000 ease-in-out ${
                  isActive
                    ? 'opacity-100 z-10 pointer-events-auto scale-100'
                    : 'opacity-0 z-0 pointer-events-none scale-[0.98]'
                }`}
                style={{
                  transitionProperty: 'opacity, transform',
                }}
              >
                <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Text Content (5 cols) */}
                  <div className="md:col-span-6 lg:col-span-5 z-10 space-y-5 lg:space-y-6">
                    <div>
                      <p className="text-sm font-semibold tracking-wider text-[#3A3937] lowercase">
                        handpicked spices
                      </p>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1B1A] uppercase tracking-tight leading-none mt-2">
                        {banner.title}
                      </h1>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C5955] leading-relaxed max-w-md font-normal line-clamp-4">
                      {banner.subtitle ||
                        'Pure, single-origin whole spices and authentic artisanal blends processed with traditional cold-grinding methods.'}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={banner.redirectUrl || '/products'}
                        className="inline-block px-8 py-3 bg-[#1C1B1A] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#B58D59] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        BUY NOW
                      </Link>
                    </div>
                  </div>

                  {/* Right Product Showcase Hero Visual (7 cols) */}
                  <div className="md:col-span-6 lg:col-span-7 relative flex items-center justify-center h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx === 0}
                        className="object-contain drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination Dots */}
      {banners.length > 1 && (
        <div className="flex justify-center items-center space-x-2.5 pt-3 pb-1 relative z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                currentIndex === idx
                  ? 'w-7 bg-[#B58D59]'
                  : 'w-2.5 bg-[#D5CEC2] hover:bg-[#A8A196]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '@/types/storefront';
import { SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

interface ProductCatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductCatalogView({
  initialProducts,
  categories,
  initialCategory = '',
  initialSearch = '',
}: ProductCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory && product.categoryId !== selectedCategory && product.category?.slug !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(term);
        const matchDesc = product.description?.toLowerCase().includes(term);
        const matchCat = product.category?.name?.toLowerCase().includes(term);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      // Stock filter
      if (inStockOnly) {
        const stock = product.computedQuantity ?? product.quantity ?? 10;
        if (stock <= 0) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = a.offerPrice || a.price;
        const priceB = b.offerPrice || b.price;
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = a.offerPrice || a.price;
        const priceB = b.offerPrice || b.price;
        return priceB - priceA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [initialProducts, selectedCategory, searchTerm, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header & Breadcrumb */}
      <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-2">
          ARTISANAL SPICE COLLECTION
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1B1A] uppercase tracking-tight">
          Handpicked Indian Spices & Masalas
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6864] mt-3">
          100% natural, single-origin whole spices and cold-ground heritage blends
          curated for culinary perfection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Filter (Desktop - 3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E8E2D6] shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE6]">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B58D59]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1B1A]">
                  Filter Spices
                </h3>
              </div>
              {(selectedCategory || searchTerm || inStockOnly) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#B58D59] hover:underline flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#88837C] mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g. Cardamom, Turmeric..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-[#FAF7F2] border border-[#E0D9CD] rounded-md focus:outline-none focus:border-[#B58D59]"
                />
                <Search className="w-3.5 h-3.5 text-[#9E9990] absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Categories list */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#88837C] mb-2.5">
                Categories
              </label>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                    !selectedCategory
                      ? 'bg-[#B58D59] text-white font-bold'
                      : 'text-[#555350] hover:bg-[#FAF7F2]'
                  }`}
                >
                  All Spices & Masalas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#B58D59] text-white font-bold'
                        : 'text-[#555350] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-2 border-t border-[#F4EFE6]">
              <label className="flex items-center space-x-2 text-xs text-[#3A3937] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-[#B58D59] rounded border-[#D5CEC2] focus:ring-[#B58D59]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Main Product Grid Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar (Active filters, count, sort dropdown, mobile filter button) */}
          <div className="bg-white px-4 sm:px-6 py-3.5 rounded-lg border border-[#E8E2D6] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B6864] flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
              <span>
                Showing <strong>{filteredProducts.length}</strong> spices
              </span>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="lg:hidden flex items-center space-x-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#E0D9CD] rounded-md text-xs font-semibold text-[#1C1B1A]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B58D59]" />
                <span>Filters</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-[#88837C] font-semibold uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-[#FAF7F2] border border-[#E0D9CD] rounded-md px-3 py-1.5 text-[#1C1B1A] focus:outline-none focus:border-[#B58D59]"
              >
                <option value="featured">Featured Blends</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Accordion */}
          {isFilterDrawerOpen && (
            <div className="lg:hidden bg-white p-4 rounded-lg border border-[#E8E2D6] shadow-md space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#F4EFE6]">
                <h3 className="text-xs font-bold uppercase tracking-wider">Categories</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#B58D59] hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setIsFilterDrawerOpen(false);
                  }}
                  className={`p-2 rounded text-left ${
                    !selectedCategory ? 'bg-[#B58D59] text-white font-bold' : 'bg-[#FAF7F2]'
                  }`}
                >
                  All Spices
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsFilterDrawerOpen(false);
                    }}
                    className={`p-2 rounded text-left truncate ${
                      selectedCategory === cat.id
                        ? 'bg-[#B58D59] text-white font-bold'
                        : 'bg-[#FAF7F2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#E8E2D6] p-16 text-center shadow-subtle">
              <p className="text-sm font-bold uppercase tracking-wider text-[#1C1B1A] mb-2">
                No Spices Found
              </p>
              <p className="text-xs text-[#7A756D] max-w-sm mx-auto mb-6">
                We couldn&apos;t find any products matching your current filters. Try changing or clearing your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#B58D59] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

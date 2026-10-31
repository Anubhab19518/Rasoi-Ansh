'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types/storefront';

interface NavbarSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarSearch({ isOpen, onClose }: NavbarSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await getProducts({ search: query.trim(), status: 'ACTIVE' });
        if (Array.isArray(data)) {
          setResults(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-lg shadow-2xl border border-[#E0D9CD] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#E8E2D6] bg-white">
          <Search className="w-5 h-5 text-[#8A857D] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search whole spices, gourmet masalas, turmeric, cardamom..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#1C1B1A] placeholder-[#9E9990] text-sm focus:outline-none"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[#B58D59] animate-spin" />
          ) : (
            <button
              onClick={onClose}
              className="p-1 text-[#8A857D] hover:text-[#1C1B1A]"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() && results.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-sm text-[#7A756D]">
              <p>No spices found for &quot;{query}&quot;.</p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-3 inline-block text-xs uppercase tracking-wider font-semibold text-[#B58D59] hover:underline"
              >
                Browse All Spices
              </Link>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-[#EBE5DB]">
              {results.map((product) => {
                const img =
                  product.images?.[0]?.imageUrl ||
                  product.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80';
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug || product.id}`}
                    onClick={onClose}
                    className="flex items-center space-x-4 py-3 hover:bg-white/60 px-2 rounded transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded bg-white border border-[#E5DFD4] overflow-hidden flex-shrink-0">
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1C1B1A] group-hover:text-[#B58D59] transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#7A756D] truncate">
                        {product.category?.name || 'Gourmet Spice'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1C1B1A]">
                        ₹{product.offerPrice || product.price}
                      </p>
                      {product.offerPrice && (
                        <p className="text-xs text-[#99948D] line-through">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-6 px-2 text-xs text-[#7A756D]">
              <p className="font-semibold uppercase tracking-wider text-[#A8A196] mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Star Anise', 'Black Pepper', 'Royal Garam Masala', 'Green Cardamom', 'Turmeric'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-white border border-[#E5DFD4] rounded-full text-xs text-[#3A3937] hover:border-[#B58D59] hover:text-[#B58D59] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer link to catalog */}
        {results.length > 0 && (
          <div className="bg-[#F0EBE1] px-4 py-2.5 border-t border-[#E8E2D6] flex justify-between items-center text-xs">
            <span className="text-[#7A756D]">
              Showing top {results.length} spice matches
            </span>
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="inline-flex items-center text-[#B58D59] font-bold uppercase tracking-wider hover:underline"
            >
              <span>View All Results</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { getCategories } from '@/lib/api';
import { Category } from '@/types/storefront';

export default function Header({
  onOpenSearch,
}: {
  onOpenSearch?: () => void;
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        // Fallback static categories
        setCategories([
          { id: '1', ecommerceId: '', name: 'Spices & Masalas', slug: 'spices-masalas', parentId: null },
          { id: '2', ecommerceId: '', name: 'Whole Spices', slug: 'whole-spices', parentId: null },
          { id: '3', ecommerceId: '', name: 'Ground Spices', slug: 'ground-spices', parentId: null },
          { id: '4', ecommerceId: '', name: 'B2B Bulk Spices', slug: 'b2b-bulk-spices', parentId: null },
        ]);
      }
    }
    loadCategories();
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Products', href: '/products' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'B2B Bulk', href: '/b2b' },
  ];

  return (
    <header className="w-full bg-[#F8F5EE] border-b border-[#EBE5DB] sticky top-0 z-40">
      {/* Top Utility Bar with Social & Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link
              href="/"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                pathname === '/'
                  ? 'text-[#B58D59] border-b border-[#B58D59] pb-0.5'
                  : 'text-[#3A3937] hover:text-[#B58D59]'
              }`}
            >
              Home
            </Link>

            {/* Products & Categories Mega Dropdown */}
            <div className="relative group">
              <Link
                href="/products"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center space-x-1 ${
                  pathname.startsWith('/products') || pathname.startsWith('/categories')
                    ? 'text-[#B58D59] border-b border-[#B58D59] pb-0.5'
                    : 'text-[#3A3937] hover:text-[#B58D59]'
                }`}
              >
                <span>Products</span>
              </Link>

              {categories.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-[#E8E2D6] rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#B58D59] border-b border-[#F4EFE6]">
                    Spice Categories
                  </div>
                  <Link
                    href="/products"
                    className="block px-3 py-1.5 text-xs text-[#1C1B1A] font-semibold hover:bg-[#FAF7F2] hover:text-[#B58D59]"
                  >
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?categoryId=${cat.id}`}
                      className="block px-3 py-1.5 text-xs text-[#555350] hover:bg-[#FAF7F2] hover:text-[#B58D59] truncate"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#about"
              className="text-xs font-semibold uppercase tracking-wider text-[#3A3937] hover:text-[#B58D59] transition-colors"
            >
              About
            </Link>

            <Link
              href="/recipes"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                pathname.startsWith('/recipes')
                  ? 'text-[#B58D59] border-b border-[#B58D59] pb-0.5'
                  : 'text-[#3A3937] hover:text-[#B58D59]'
              }`}
            >
              Recipes
            </Link>

            <Link
              href="/b2b"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                pathname.startsWith('/b2b')
                  ? 'text-[#B58D59] border-b border-[#B58D59] pb-0.5'
                  : 'text-[#3A3937] hover:text-[#B58D59]'
              }`}
            >
              B2B Bulk
            </Link>
          </nav>

          {/* Centered Brand Logo */}
          <div className="flex-1 md:flex-initial flex justify-center py-2">
            <Link href="/" className="flex items-center justify-center">
              <div className="relative h-12 w-44 md:h-14 md:w-52 flex items-center justify-center">
                <Image
                  src="/Rasoi-Ansh-logo.png"
                  alt="Rasoi Ansh - Handpicked Spices"
                  width={200}
                  height={56}
                  priority
                  className="object-contain max-h-full"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
                <span className="sr-only">Rasoi Ansh</span>
              </div>
            </Link>
          </div>

          {/* Right Utility Icons (Social + Actions) */}
          <div className="flex items-center space-x-5">
            {/* Social icons subtle */}
            <div className="hidden lg:flex items-center space-x-3 text-[#6B6864] mr-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1B1A] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1B1A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1B1A] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1B1A] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Search Icon Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-[#3A3937] hover:text-[#B58D59] transition-colors"
              aria-label="Search Spices"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Account Icon / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center space-x-1 p-1 text-[#3A3937] hover:text-[#B58D59] transition-colors"
                    aria-label="Customer Account"
                  >
                    <User className="w-4 h-4" />
                  </button>

                  {isAccountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EBE5DB] rounded-md shadow-lg py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-[#F4EFE6]">
                        <p className="font-semibold text-[#1C1B1A] truncate">{user?.name}</p>
                        <p className="text-[#888580] truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2 text-[#3A3937] hover:bg-[#F8F5EE]"
                      >
                        Account Dashboard
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2 text-[#3A3937] hover:bg-[#F8F5EE]"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="block px-4 py-2 text-[#3A3937] hover:bg-[#F8F5EE]"
                      >
                        Saved Addresses
                      </Link>
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t border-[#F4EFE6] mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="p-1.5 text-[#3A3937] hover:text-[#B58D59] transition-colors"
                  aria-label="Sign In"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Shopping Bag / Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-1.5 text-[#3A3937] hover:text-[#B58D59] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B58D59] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-[#3A3937]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#EBE5DB] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold uppercase tracking-wider text-[#3A3937] hover:text-[#B58D59] py-1"
            >
              {link.name}
            </Link>
          ))}
          {categories.length > 0 && (
            <div className="pt-2 border-t border-[#EBE5DB]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#888580] mb-2">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?categoryId=${cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs text-[#555350] hover:text-[#B58D59]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

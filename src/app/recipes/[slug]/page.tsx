import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Users, ChefHat, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { RECIPES_DATA } from '@/lib/constants';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/storefront';

interface RecipeDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipe = RECIPES_DATA.find((r) => r.slug === params.slug);

  if (!recipe) {
    notFound();
  }

  let products: Product[] = [];
  try {
    const all = await getProducts({ status: 'ACTIVE' });
    if (Array.isArray(all)) {
      products = all;
    }
  } catch {
    // Ignore
  }

  // Find related products matching the recipe or fallback to first 2 products
  const relatedSpices = products.length > 0
    ? products.filter((p) => recipe.relatedProductSlugs.includes(p.slug || ''))
    : [];

  const displaySpices = relatedSpices.length > 0 ? relatedSpices : products.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#88837C] mb-6">
        <Link href="/" className="hover:text-[#B58D59]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/recipes" className="hover:text-[#B58D59]">
          Recipes
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1C1B1A] font-semibold truncate max-w-xs">
          {recipe.title}
        </span>
      </nav>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B58D59]">
          HERITAGE CULINARY GUIDE
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1B1A] uppercase tracking-tight leading-tight">
          {recipe.title}
        </h1>
        <p className="text-sm sm:text-base text-[#5C5955] leading-relaxed max-w-2xl">
          {recipe.subtitle}
        </p>

        {/* Quick Specs */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#6B6864]">
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-lg border border-[#E8E2D6] shadow-xs">
            <Clock className="w-4 h-4 text-[#B58D59]" />
            <span>
              Prep: <strong>{recipe.prepTime}</strong> | Cook: <strong>{recipe.cookTime}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-lg border border-[#E8E2D6] shadow-xs">
            <Users className="w-4 h-4 text-[#B58D59]" />
            <span>
              Serves: <strong>{recipe.servings}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-lg border border-[#E8E2D6] shadow-xs">
            <ChefHat className="w-4 h-4 text-[#B58D59]" />
            <span>
              Difficulty: <strong>{recipe.difficulty}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-80 sm:h-[420px] rounded-xl overflow-hidden shadow-editorial border border-[#E8E2D6] mb-12">
        <Image src={recipe.heroImage} alt={recipe.title} fill priority className="object-cover" />
      </div>

      {/* Ingredients & Instructions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
        {/* Ingredients (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D6] shadow-subtle space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1B1A] pb-3 border-b border-[#F4EFE6]">
            Ingredients Checklist
          </h2>
          <ul className="space-y-3 text-xs text-[#555350]">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B58D59] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1B1A] pb-3 border-b border-[#E8E2D6]">
            Cooking Method
          </h2>
          <div className="space-y-6 text-xs sm:text-sm text-[#5C5955]">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className="w-7 h-7 rounded-full bg-[#1C1B1A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="leading-relaxed flex-1 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop the Ingredients / Related Spices */}
      {displaySpices.length > 0 && (
        <div className="pt-10 border-t border-[#E0D9CD]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-1">
                ELEVATE YOUR COOKING
              </p>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1C1B1A]">
                Shop the Recipe Spices
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-[#B58D59] hover:underline"
            >
              All Spices →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySpices.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

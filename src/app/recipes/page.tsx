import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ChefHat, ArrowRight } from 'lucide-react';
import { RECIPES_DATA } from '@/lib/constants';

export const metadata = {
  title: 'Culinary Recipes — Rasoi Ansh Gourmet Masalas & Spices',
  description: 'Authentic Indian regional recipes crafted with Rasoi Ansh stone-ground masalas and single-origin whole spices.',
};

export default function RecipesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#B58D59] mb-2">
          CULINARY INSPIRATION
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#1C1B1A]">
          Rasoi Ansh Kitchen Recipes
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6864] mt-3">
          Discover time-tested regional Indian recipes designed to showcase the authentic aromas
          and flavors of our handpicked spices.
        </p>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {RECIPES_DATA.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl border border-[#E8E2D6] overflow-hidden shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Hero Image */}
              <div className="relative w-full h-64 sm:h-72 overflow-hidden">
                <Image
                  src={recipe.heroImage}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#1C1B1A]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  {recipe.difficulty}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1C1B1A] group-hover:text-[#B58D59] transition-colors leading-snug">
                  {recipe.title}
                </h2>
                <p className="text-xs text-[#5C5955] leading-relaxed line-clamp-2">
                  {recipe.description}
                </p>

                {/* Metadata icons */}
                <div className="flex items-center space-x-6 pt-3 text-xs text-[#7A756D] border-t border-[#F4EFE6]">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B58D59]" />
                    <span>{recipe.cookTime}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B58D59]" />
                    <span>{recipe.servings}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-[#B58D59]" />
                    <span>Artisanal Blend</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Read Recipe CTA */}
            <div className="p-6 sm:p-8 pt-0">
              <Link
                href={`/recipes/${recipe.slug}`}
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#B58D59] group-hover:text-[#1C1B1A] transition-colors"
              >
                <span>View Full Recipe & Spices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

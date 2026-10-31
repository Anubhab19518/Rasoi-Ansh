import React from 'react';
import ProductCatalogView from '@/components/products/ProductCatalogView';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/types/storefront';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts({ status: 'ACTIVE' }),
      getCategories(),
    ]);

    if (Array.isArray(productsData)) products = productsData;
    if (Array.isArray(categoriesData)) categories = categoriesData;
  } catch (err) {
    console.warn('Error fetching category page data:', err);
  }

  const currentCategory = categories.find(
    (c) => c.slug === params.slug || c.id === params.slug
  );

  return (
    <ProductCatalogView
      initialProducts={products}
      categories={categories}
      initialCategory={currentCategory?.id || params.slug}
    />
  );
}

import React from 'react';
import ProductCatalogView from '@/components/products/ProductCatalogView';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/types/storefront';

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: {
    categoryId?: string;
    search?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
    console.warn('Error fetching catalog data:', err);
  }

  return (
    <ProductCatalogView
      initialProducts={products}
      categories={categories}
      initialCategory={searchParams.categoryId || ''}
      initialSearch={searchParams.search || ''}
    />
  );
}

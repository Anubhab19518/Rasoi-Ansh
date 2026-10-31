'use client';

import { useState, useMemo } from 'react';
import { Product, ProductVariant } from '@/types/storefront';

export function useSpiceConfigurator(product: Product) {
  // Extract all option values from first option (usually "Weight" or "Pack Size")
  const availableWeights = useMemo(() => {
    const formatLabel = (rawVal: string, unitSymbol?: string | null, sku?: string) => {
      const trimmed = String(rawVal).trim();
      if (!trimmed) return '';

      // If already has explicit unit attached (e.g. "0.1 g", "100g", "1 kg", "500gm")
      if (
        /\b(g|gm|gms|gram|grams|kg|kgs|kilogram|kilograms|jar|pk|pack)\b/i.test(trimmed) ||
        /(g|kg|gm|gms|pk|jar)$/i.test(trimmed)
      ) {
        return trimmed.replace(/\s+/g, '');
      }

      // Check explicit unit symbol from backend option / unit model
      const explicitUnit = (unitSymbol || '').trim().toLowerCase();
      if (explicitUnit) {
        return `${trimmed}${explicitUnit}`;
      }

      // Check SKU if it has explicit KG or G suffix (e.g. "KASHMI-01G", "RA-CARD-1KG")
      if (sku) {
        const skuUpper = sku.toUpperCase();
        if (skuUpper.endsWith('KG') || skuUpper.includes('-KG') || skuUpper.includes('_KG')) {
          return `${trimmed}kg`;
        }
        if (skuUpper.endsWith('G') || skuUpper.includes('-G') || skuUpper.includes('_G')) {
          return `${trimmed}g`;
        }
      }

      // Default unit for Indian spices is gram ("g")
      return `${trimmed}g`;
    };

    if (product.options && product.options.length > 0 && product.options[0].values) {
      const optionUnit = product.options[0].unit?.symbol;
      return product.options[0].values
        .map((v) => {
          const unitSym = v.unit?.symbol || optionUnit;
          const label = formatLabel(v.value, unitSym);
          const num = Number(v.value);
          return {
            id: v.id,
            value: v.value,
            label,
            unitSymbol: unitSym || 'g',
            order: isNaN(num) ? 999 : num,
          };
        })
        .sort((a, b) => a.order - b.order);
    }

    // Fallback if variants have optionValues directly
    if (product.variants && product.variants.length > 0) {
      const list = product.variants.map((v) => {
        const firstVal =
          Array.isArray(v.optionValues) && v.optionValues.length > 0 ? v.optionValues[0] : null;
        const valStr =
          typeof firstVal === 'object' && firstVal !== null
            ? 'value' in firstVal
              ? firstVal.value
              : ''
            : '';
        const unitSym =
          typeof firstVal === 'object' && firstVal !== null && 'unitSymbol' in firstVal
            ? firstVal.unitSymbol
            : null;
        const num = Number(valStr);
        const label = formatLabel(valStr || v.sku, unitSym, v.sku);
        return {
          id: v.id,
          value: valStr || v.sku,
          label,
          unitSymbol: unitSym || 'g',
          order: isNaN(num) ? 999 : num,
        };
      });
      return list.sort((a, b) => a.order - b.order);
    }
    return [];
  }, [product]);

  const [selectedWeight, setSelectedWeight] = useState<string>(() => {
    if (product.variants && product.variants.length > 0) {
      const targetPrice = product.offerPrice || product.price;
      const matchVariant = product.variants.find(
        (v) => (v.offerPrice || v.price) === targetPrice
      );
      if (matchVariant?.optionValues && matchVariant.optionValues.length > 0) {
        const ov = matchVariant.optionValues[0];
        const val = typeof ov === 'object' && ov !== null && 'value' in ov ? ov.value : String(ov);
        if (val) return val;
      }
      if (matchVariant?.sku) {
        const matchWeight = availableWeights.find(
          (w) => matchVariant.sku.toUpperCase().includes(w.value.toUpperCase()) || w.value === matchVariant.id
        );
        if (matchWeight) return matchWeight.value;
      }
    }

    const default100 = availableWeights.find(
      (w) => w.value === '100' || w.label.toLowerCase() === '100g'
    );
    if (default100) return default100.value;

    return availableWeights[0]?.value || '';
  });

  const activeVariant = useMemo<ProductVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null;

    // Find variant matching selected weight value
    const match = product.variants.find((v) => {
      if (v.id === selectedWeight) return true;
      if (!v.optionValues || !Array.isArray(v.optionValues)) {
        return v.sku?.toLowerCase().includes(String(selectedWeight).toLowerCase());
      }
      return v.optionValues.some((ov) => {
        if (typeof ov === 'object' && ov !== null && 'value' in ov) {
          return String(ov.value) === String(selectedWeight);
        }
        return String(ov) === String(selectedWeight);
      });
    });

    if (match) return match;

    const targetPrice = product.offerPrice || product.price;
    const priceMatch = product.variants.find(
      (v) => (v.offerPrice || v.price) === targetPrice
    );
    return priceMatch || product.variants[0] || null;
  }, [product, selectedWeight]);

  const price = activeVariant
    ? (activeVariant.offerPrice || activeVariant.price)
    : (product.offerPrice || product.price);

  const regularPrice = activeVariant ? activeVariant.price : product.price;

  const sku = activeVariant ? activeVariant.sku : `RA-${product.slug?.toUpperCase() || 'SPICE'}`;

  const stock = activeVariant
    ? activeVariant.quantity
    : (product.computedQuantity ?? product.quantity ?? 100);

  const isOutOfStock = stock <= 0;

  const isB2B =
    selectedWeight.toLowerCase().includes('kg') ||
    Number(selectedWeight) >= 1000 ||
    product.category?.slug === 'b2b-bulk-spices';

  // Primary image
  const primaryImage = useMemo(() => {
    if (activeVariant && activeVariant.images && activeVariant.images.length > 0) {
      return activeVariant.images[0].imageUrl || activeVariant.images[0].url;
    }
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.isPrimary);
      return primary?.imageUrl || primary?.url || product.images[0].imageUrl || product.images[0].url;
    }
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80';
  }, [product, activeVariant]);

  const selectedWeightLabel = useMemo(() => {
    const match = availableWeights.find((w) => String(w.value) === String(selectedWeight));
    return match?.label || (selectedWeight ? `${selectedWeight}g` : '');
  }, [availableWeights, selectedWeight]);

  return {
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
  };
}

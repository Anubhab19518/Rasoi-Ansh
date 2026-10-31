// ==========================================
// 1. Common Response Envelope
// ==========================================
export interface ApiResponse<T> {
  success?: boolean;
  status?: 'ok' | 'error';
  data: T;
  message?: string;
  code?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// 2. Categories & Taxonomy
// ==========================================
export interface Category {
  id: string; // UUID
  ecommerceId: string;
  name: string; // e.g. "Spices & Masalas", "Whole Spices", "Ground Spices", "B2B Bulk"
  slug: string; // e.g. "spices-masalas", "whole-spices", "ground-spices"
  description?: string | null;
  parentId: string | null;
  path?: string;
  displayOrder?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}

// ==========================================
// 3. Units & Specifications
// ==========================================
export type UnitType = 'WEIGHT' | 'VOLUME' | 'QUANTITY' | 'COUNT' | 'OTHER';

export interface Unit {
  id: string; // e.g. "unit-gram", "unit-kg", "u-pack", "u-bottle"
  name: string; // "Gram", "Kilogram", "Pack", "Glass Jar"
  symbol: string; // "g", "kg", "pk", "jar"
  category?: string;
  type?: UnitType;
}

// ==========================================
// 4. Product Options, Values & Variants
// ==========================================
export interface ProductOptionValue {
  id: string; // UUID
  optionId?: string;
  value: string; // e.g. "100", "250", "500", "1kg", "5kg"
  displayOrder?: number;
  unitId?: string | null;
  unit?: Unit | null;
}

export interface ProductOption {
  id: string; // UUID
  productId?: string;
  name: string; // e.g. "Weight", "Pack Size", "Form"
  displayOrder?: number;
  unitId?: string | null;
  unit?: Unit | null;
  values: ProductOptionValue[];
}

export interface ProductVariantImage {
  id: string;
  variantId: string;
  url?: string;
  imageUrl?: string;
  publicId?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface VariantOptionValueMap {
  id?: string;
  optionId?: string;
  optionName?: string;
  valueId?: string;
  value: string;
  unitSymbol?: string | null;
}

export interface ProductVariant {
  id: string; // UUID
  productId?: string;
  sku: string; // e.g. "ROYALGAR-100G", "RA-TURM-500G", "RA-CARD-1KG-B2B"
  price: number; // Regular unit price
  offerPrice?: number | null; // Discounted promotional price
  quantity: number; // Inventory level
  status: 'ACTIVE' | 'INACTIVE';
  optionValues?: VariantOptionValueMap[] | Array<{ id: string; value: string }>;
  images?: ProductVariantImage[];
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 5. Product Details & Rich Sections
// ==========================================
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface ProductImage {
  id: string;
  productId?: string;
  url?: string;
  imageUrl?: string;
  publicId?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface Product {
  id: string; // UUID
  ecommerceId: string;
  categoryId: string;
  name: string; // e.g. "Royal Garam Masala Blend", "Alleppey Green Cardamom"
  slug: string; // e.g. "royal-garam-masala-blend"
  brand?: string | null; // "Rasoi Ansh"
  description?: string | null;
  details?: string[] | Array<{ title: string; content: string }>;
  detailSections?: Array<{ title: string; content: string }>;
  price: number;
  offerPrice?: number | null;
  taxRate?: number;
  taxClass?: string | null;
  quantity: number;
  computedQuantity?: number;
  status: ProductStatus;
  hasVariants: boolean;
  category?: Category;
  options?: ProductOption[];
  variants?: ProductVariant[];
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 6. Banners & Homepage Media
// ==========================================
export interface Banner {
  id: string;
  ecommerceId: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  publicId?: string | null;
  redirectUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 7. Shopping Cart & Local State
// ==========================================
export interface CartItem {
  productId: string; // UUID of product
  variantId?: string | null; // UUID of variant
  name: string;
  sku: string;
  price: number; // Effective price
  regularPrice: number; // MRP for strikethrough
  quantity: number;
  imageUrl?: string;
  selectedOptions?: Record<string, string>; // e.g. { "Weight": "250 g" }
  categoryId?: string;
}

// ==========================================
// 8. Coupons & Discount Engine
// ==========================================
export type CouponDiscountType = 'PERCENTAGE' | 'FIXED';

export interface Coupon {
  id: string;
  ecommerceId: string;
  name: string;
  code: string;
  description?: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  targetType?: string;
  startDate?: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface CouponValidationPayload {
  code: string;
  customerEmail: string;
  subtotal?: number;
  cartItems: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
    pricing?: { effectivePrice: number };
    price?: number;
    product?: {
      id: string;
      categoryId?: string;
      price: number;
    };
  }>;
}

export interface CouponValidationResult {
  valid: boolean;
  couponId: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  discountAmount: number;
  eligibleSubtotal: number;
  finalPrice?: number;
  message: string;
}

// ==========================================
// 9. Orders & Checkout Payloads
// ==========================================
export interface StructuredShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemInput {
  productId: string;
  productName?: string;
  sku: string;
  variantId?: string;
  quantity: number;
  price: number;
  total?: number;
  options?: Record<string, string>;
}

export interface OrderCreationPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemsCount: number;
  total: number;
  status?: 'PROCESSING' | 'PENDING' | 'CONFIRMED';
  paymentMethod?: 'PREPAID' | 'COD';
  couponId?: string;
  couponCode?: string;
  couponDiscount?: number;
  shippingAddress: StructuredShippingAddress | string;
  billingAddress?: StructuredShippingAddress | string;
  items: OrderItemInput[];
}

export interface OrderResponse {
  id: string;
  orderNumber?: string;
  ecommerceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemsCount: number;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'IN_TRANSIT' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  couponCode?: string;
  couponDiscount?: number;
  shippingAddress?: any;
  createdAt: string;
  items?: any[];
}

// ==========================================
// 10. Customer Analytics & Auth Context
// ==========================================
export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate?: string;
  status: 'VIP' | 'ACTIVE';
}

export interface UserContext {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Medium' | 'Master';
  description: string;
  ingredients: string[];
  instructions: string[];
  relatedProductSlugs: string[];
}

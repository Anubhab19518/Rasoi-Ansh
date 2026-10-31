import {
  ApiResponse,
  Category,
  Product,
  Banner,
  Unit,
  Coupon,
  CouponValidationPayload,
  CouponValidationResult,
  OrderCreationPayload,
  OrderResponse,
} from '@/types/storefront';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000/api/v1';

const ECOMMERCE_ID =
  process.env.NEXT_PUBLIC_ECOMMERCE_ID ||
  process.env.NEXT_PUBLIC_STORE_ID ||
  'c3d7764d-b379-4eec-8c53-8dc6a58e0f35';

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

let serverAuthToken: string | null = null;

async function getOrFetchServerToken(): Promise<string | null> {
  if (serverAuthToken) return serverAuthToken;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ecommerce-id': ECOMMERCE_ID,
      },
      body: JSON.stringify({
        email: 'freshharvest_admin@bazar.com',
        password: 'Password123!',
      }),
      cache: 'no-store',
    });
    const json = await res.json();
    if (json.data?.accessToken) {
      serverAuthToken = json.data.accessToken;
      return serverAuthToken;
    }
  } catch (err) {
    console.warn('Could not auto-fetch server token:', err);
  }
  return null;
}

export async function fetchStorefront<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Attach storeId query param if not already present
  const separator = cleanEndpoint.includes('?') ? '&' : '?';
  const url = `${BACKEND_URL}${cleanEndpoint}${cleanEndpoint.includes('storeId=') ? '' : `${separator}storeId=${ECOMMERCE_ID}`}`;

  if (!ECOMMERCE_ID || ECOMMERCE_ID === 'undefined') {
    throw new ApiError(
      'Store ID (x-ecommerce-id) is not configured in environment variables.',
      400
    );
  }

  const clientToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('rasoi_ansh_token')
      : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('x-ecommerce-id', ECOMMERCE_ID);

  if (clientToken) {
    headers.set('Authorization', `Bearer ${clientToken}`);
  } else {
    // For SSR or guest browsing, acquire server token if backend mandates auth
    const sToken = await getOrFetchServerToken();
    if (sToken) {
      headers.set('Authorization', `Bearer ${sToken}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
    });

    const json: ApiResponse<T> = await response.json().catch(() => ({
      status: 'error',
      data: null as any,
      message: `Server returned non-JSON response (Status: ${response.status})`,
    }));

    if (!response.ok || (json.success === false && json.status === 'error')) {
      // If unauthorized, attempt one-time token refresh and retry
      if (response.status === 401) {
        serverAuthToken = null;
        const freshToken = await getOrFetchServerToken();
        if (freshToken) {
          headers.set('Authorization', `Bearer ${freshToken}`);
          const retryRes = await fetch(url, { ...options, headers, cache: 'no-store' });
          const retryJson: ApiResponse<T> = await retryRes.json().catch(() => null as any);
          if (retryRes.ok && retryJson?.data) {
            return retryJson.data;
          }
        }
      }

      const errorMsg =
        json.message ||
        json.errors?.[0]?.message ||
        `HTTP Error ${response.status}: Failed to execute request on ${endpoint}`;
      throw new ApiError(errorMsg, response.status, json);
    }

    return json.data;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err.message || 'Unable to connect to Rasoi Ansh backend server.',
      503
    );
  }
}

// ==================== Rasoi Ansh Storefront Methods ====================

export const getCategories = () =>
  fetchStorefront<Category[]>('/catalog/categories');

export const getProducts = (params?: {
  categoryId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set('categoryId', params.categoryId);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qStr = query.toString();
  return fetchStorefront<Product[]>(
    `/catalog/products${qStr ? `?${qStr}` : ''}`
  );
};

export const getProductDetails = (idOrSlug: string) =>
  fetchStorefront<Product>(`/catalog/products/${idOrSlug}`);

export const getBanners = () =>
  fetchStorefront<Banner[]>('/catalog/banners?active=true');

export const getUnits = () =>
  fetchStorefront<Unit[]>('/catalog/units');

export const getCoupons = () =>
  fetchStorefront<Coupon[]>('/catalog/coupons');

export const validateCoupon = (payload: CouponValidationPayload) =>
  fetchStorefront<CouponValidationResult>('/catalog/coupons/validate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const placeOrder = (orderData: OrderCreationPayload) =>
  fetchStorefront<OrderResponse>('/catalog/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    return await fetchStorefront<OrderResponse>(`/catalog/orders/${orderId}`);
  } catch {
    // If individual order route is not exposed directly, find in orders list
    const allOrders = await fetchStorefront<OrderResponse[]>('/catalog/orders');
    if (Array.isArray(allOrders)) {
      const match = allOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (match) return match;
    }
    throw new ApiError(`Order ${orderId} not found`, 404);
  }
};

export const getAllOrders = () =>
  fetchStorefront<OrderResponse[]>('/catalog/orders');

import { UserContext, StructuredShippingAddress } from '@/types/storefront';

const TOKEN_KEY = 'rasoi_ansh_token';
const USER_KEY = 'rasoi_ansh_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserContext | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: UserContext): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Saved Addresses stored locally per authenticated user email
export function getSavedAddresses(userEmail?: string): Array<{
  id: string;
  name: string;
  phone: string;
  isDefault?: boolean;
  address: StructuredShippingAddress;
}> {
  if (typeof window === 'undefined' || !userEmail) return [];
  const key = `rasoi_saved_addresses_${userEmail.toLowerCase().trim()}`;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAddressForUser(
  userEmail: string,
  entry: {
    id: string;
    name: string;
    phone: string;
    isDefault?: boolean;
    address: StructuredShippingAddress;
  }
): void {
  if (typeof window === 'undefined' || !userEmail) return;
  const key = `rasoi_saved_addresses_${userEmail.toLowerCase().trim()}`;
  const existing = getSavedAddresses(userEmail);
  const updated = [entry, ...existing.filter((a) => a.id !== entry.id)];
  localStorage.setItem(key, JSON.stringify(updated));
}

export function deleteAddressForUser(userEmail: string, addressId: string): void {
  if (typeof window === 'undefined' || !userEmail) return;
  const key = `rasoi_saved_addresses_${userEmail.toLowerCase().trim()}`;
  const existing = getSavedAddresses(userEmail);
  const updated = existing.filter((a) => a.id !== addressId);
  localStorage.setItem(key, JSON.stringify(updated));
}

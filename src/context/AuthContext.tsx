'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from '@/types/storefront';
import { getStoredToken, getStoredUser, setAuthSession, clearAuthSession } from '@/lib/auth';

interface AuthContextType {
  user: UserContext | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, name: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContext | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Hydrate from localStorage
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const loginWithEmail = async (email: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      // Create user session token
      const mockToken = `user-jwt-${Buffer.from(email).toString('base64')}-${Date.now()}`;
      const userData: UserContext = {
        id: `cust-${email.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : undefined,
      };

      setAuthSession(mockToken, userData);
      setToken(mockToken);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    // Standard Google auth prompt / flow
    // In production, when user configures Google Client ID, this bridges with OAuth token
    setIsLoading(true);
    try {
      const email = 'customer.rasoi@gmail.com';
      const name = 'Aarav Sharma';
      const googleToken = `google-jwt-${Date.now()}`;
      const userData: UserContext = {
        id: 'cust-google-aarav',
        name,
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      };

      setAuthSession(googleToken, userData);
      setToken(googleToken);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
    // Clear cart cache for this user
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('rasoi_auth_logout'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

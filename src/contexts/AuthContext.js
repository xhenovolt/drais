/**
 * Authentication Context & Hooks
 * DRAIS v0.0.0042
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api, handleApiError, saveUser, clearUser, getCurrentUser } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials);
      
      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        saveUser(userData);
        return { success: true, data: userData };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      const apiError = handleApiError(error);
      return { success: false, error: apiError.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData);
      
      if (response.data.success) {
        const newUser = response.data.data.user;
        setUser(newUser);
        saveUser(newUser);
        return { success: true, data: newUser };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      const apiError = handleApiError(error);
      return { success: false, error: apiError.message };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearUser();
      router.push('/auth/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Hook to require specific role
 */
export function useRequireRole(allowedRoles) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (!allowedRoles.includes(user.role)) {
        router.push('/403');
      }
    }
  }, [user, loading, allowedRoles, router]);

  return { user, loading };
}

'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { authService } from '../services/auth';
import { User, SignupData } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized function to check if we're in browser environment
  const isBrowser = useMemo(() => typeof window !== 'undefined', []);

  useEffect(() => {
    if (!isBrowser) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      authService.me()
        .then((userData) => {
          setUser(userData);
          setError(null);
        })
        .catch((err) => {
          console.error('Failed to fetch user data:', err.message);
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isBrowser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      if (isBrowser) {
        localStorage.setItem('token', response.token);
      }
      setUser(response.user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isBrowser]);

  const signup = useCallback(async (data: SignupData) => {
    try {
      setError(null);
      const response = await authService.signup(data);
      if (isBrowser) {
        localStorage.setItem('token', response.token);
      }
      setUser(response.user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isBrowser]);

  const logout = useCallback(() => {
    if (isBrowser) {
      localStorage.removeItem('token');
    }
    setUser(null);
    setError(null);
    // Use Next.js router instead of window.location for better UX
    if (isBrowser) {
      window.location.href = '/auth/login';
    }
  }, [isBrowser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user
  }), [user, loading, error, login, signup, logout, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

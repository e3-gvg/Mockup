'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'SUPER_ADMIN';
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
    plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
    isActive: boolean;
  };
  // Propriedades específicas para SUPER_ADMIN
  isSuperAdmin?: boolean;
  canAccessAllTenants?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, tenantSubdomain: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const API_URL = `${API_BASE_URL}/api/v1`;

  // Fetch user data from our backend
  const fetchUserData = useCallback(async (supabaseSession: Session) => {
    try {
      const response = await fetch(`${API_URL}/auth/supabase/me`, {
        headers: {
          'Authorization': `Bearer ${supabaseSession.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        console.error('Failed to fetch user data:', response.statusText);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  }, [API_URL]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setSupabaseUser(initialSession.user);
          await fetchUserData(initialSession);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        if (session) {
          await fetchUserData(session);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set the session manually since we're using our backend
      const { error } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });

      if (error) {
        throw error;
      }

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, router]);

  // Sign up function
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    tenantSubdomain: string
  ) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/auth/supabase/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          tenantSubdomain
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // After successful registration, sign in the user
      await signIn(email, password);
      
      toast.success('Registration successful! Welcome!');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL, router, signIn]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Also call our backend logout endpoint
      if (session) {
        await fetch(`${API_URL}/auth/supabase/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Clear local state
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, [API_URL, session, router]);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
        setSupabaseUser(data.session.user);
        await fetchUserData(data.session);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      // If refresh fails, sign out the user
      await signOut();
    }
  }, [fetchUserData, signOut]);

  // Auto-refresh session before expiry
  useEffect(() => {
    if (!session) return;

    const timeUntilExpiry = (session.expires_at || 0) * 1000 - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 60000, 60000); // Refresh 1 minute before expiry, minimum 1 minute

    const refreshTimer = setTimeout(() => {
      refreshSession();
    }, refreshTime);

    return () => clearTimeout(refreshTimer);
  }, [session, refreshSession]);

  const value: AuthContextType = useMemo(() => ({
    user,
    supabaseUser,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
    isAuthenticated: !!user && !!session
  }), [user, supabaseUser, session, loading, signUp, signIn, signOut, refreshSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for checking authentication status
export const useAuthStatus = () => {
  const { user, loading, isAuthenticated } = useSupabaseAuth();
  
  return {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER' || user?.role === 'ADMIN',
    isOperator: user?.role === 'OPERATOR' || user?.role === 'MANAGER' || user?.role === 'ADMIN'
  };
};

// Hook for tenant information
export const useTenant = () => {
  const { user } = useSupabaseAuth();
  
  return {
    tenant: user?.tenant || null,
    tenantId: user?.tenantId || null,
    isActive: user?.tenant?.isActive || false,
    plan: user?.tenant?.plan || null
  };
};
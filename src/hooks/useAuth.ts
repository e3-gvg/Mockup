'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
    plan: string;
    isActive: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
  canManageAlerts: () => boolean;
  canManageMachines: () => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // SUPER_ADMIN tem acesso a tudo
    if (user.role === 'SUPER_ADMIN') return true;
    
    return allowedRoles.includes(user.role);
  };

  const canManageAlerts = (): boolean => {
    return hasRole(['ADMIN', 'SUPER_ADMIN']);
  };

  const canManageMachines = (): boolean => {
    return hasRole(['ADMIN', 'SUPER_ADMIN']);
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === 'SUPER_ADMIN';
  };

  const isAdmin = (): boolean => {
    return hasRole(['ADMIN', 'SUPER_ADMIN']);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    canManageAlerts,
    canManageMachines,
    isSuperAdmin,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Hook para verificar permissões específicas
export const usePermissions = () => {
  const { user, hasRole, canManageAlerts, canManageMachines, isSuperAdmin, isAdmin } = useAuth();

  return {
    // Verificações de role
    hasRole,
    isUser: () => hasRole('USER'),
    isAdmin,
    isSuperAdmin,
    
    // Verificações de funcionalidades específicas
    canManageAlerts,
    canManageMachines,
    canViewAnalytics: () => hasRole(['USER', 'ADMIN', 'SUPER_ADMIN']),
    canManageUsers: () => hasRole(['ADMIN', 'SUPER_ADMIN']),
    canManageTenant: () => hasRole(['ADMIN', 'SUPER_ADMIN']),
    canAccessCrossTenant: () => isSuperAdmin(),
    
    // Informações do usuário
    userRole: user?.role,
    tenantId: user?.tenantId,
    tenantPlan: user?.tenant?.plan,
  };
};

export default useAuth;
# 🚀 Roadmap de Implementação - Frontend Otimizado

## 📋 Visão Geral

Este documento detalha a implementação prática das melhorias sugeridas pela equipe especializada, com exemplos de código e instruções passo-a-passo.

---

## 🎯 FASE 1 - REFATORAÇÃO CRÍTICA (1-2 semanas)

### 1.1 Reestruturação do Componente Principal

#### 📁 **Nova Estrutura de Arquivos:**
```
src/
├── app/
│   └── page.tsx                 # Componente principal simplificado
├── components/
│   ├── ui/                      # Componentes base reutilizáveis
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── LoadingSpinner.tsx
│   ├── features/                # Componentes de funcionalidade
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   └── maintenance/
│   └── layout/                  # Componentes de layout
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── MainLayout.tsx
├── hooks/                       # Custom hooks
│   ├── useStats.ts
│   ├── useRealTimeData.ts
│   └── useLocalStorage.ts
├── services/                    # Camada de serviços
│   ├── api.ts
│   ├── mqtt.ts
│   └── analytics.ts
├── stores/                      # Gerenciamento de estado
│   ├── dashboardStore.ts
│   └── userStore.ts
├── types/                       # TypeScript definitions
│   ├── dashboard.ts
│   ├── api.ts
│   └── common.ts
└── utils/                       # Utilitários
    ├── formatters.ts
    ├── constants.ts
    └── helpers.ts
```

#### 🔧 **Exemplo: Novo page.tsx Simplificado**
```typescript
'use client';

import React from 'react';
import { DashboardProvider } from '@/stores/dashboardStore';
import MainLayout from '@/components/layout/MainLayout';
import DashboardContent from '@/components/features/dashboard/DashboardContent';

export default function HomePage() {
  return (
    <DashboardProvider>
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </DashboardProvider>
  );
}
```

### 1.2 Design System Básico

#### 🎨 **Design Tokens (src/styles/tokens.ts)**
```typescript
export const designTokens = {
  colors: {
    primary: {
      50: '#f0fdf4',
      500: '#22c55e',
      900: '#14532d',
    },
    secondary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    accent: {
      50: '#faf5ff',
      500: '#a855f7',
      900: '#581c87',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      800: '#1f2937',
      900: '#111827',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  }
};
```

#### 🧩 **Componente Card Reutilizável**
```typescript
// src/components/ui/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/styles/tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

const variantStyles = {
  default: 'bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 border-neutral-700/30',
  success: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30',
  warning: 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-500/30',
  info: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30',
};

const sizeStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  animate = true 
}: CardProps) {
  const baseClasses = `
    ${variantStyles[variant]} 
    ${sizeStyles[size]}
    border backdrop-blur-xl rounded-2xl 
    hover:scale-105 transition-all duration-300 
    shadow-xl ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
```

### 1.3 Custom Hooks para Lógica Reutilizável

#### 🪝 **Hook para Estatísticas (src/hooks/useStats.ts)**
```typescript
import { useState, useEffect } from 'react';
import { StatsData } from '@/types/dashboard';
import { fetchStats } from '@/services/api';

export function useStats() {
  const [stats, setStats] = useState<StatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    
    // Atualização em tempo real a cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: () => loadStats() };
}
```

### 1.4 Gerenciamento de Estado com Zustand

#### 🏪 **Dashboard Store (src/stores/dashboardStore.ts)**
```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DashboardState {
  activeSection: string;
  isCollapsed: boolean;
  notifications: Notification[];
  setActiveSection: (section: string) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>()()
  devtools(
    (set, get) => ({
      activeSection: 'dashboard',
      isCollapsed: false,
      notifications: [],
      
      setActiveSection: (section) => 
        set({ activeSection: section }, false, 'setActiveSection'),
      
      toggleSidebar: () => 
        set((state) => ({ isCollapsed: !state.isCollapsed }), false, 'toggleSidebar'),
      
      addNotification: (notification) => 
        set((state) => ({ 
          notifications: [...state.notifications, notification] 
        }), false, 'addNotification'),
      
      removeNotification: (id) => 
        set((state) => ({ 
          notifications: state.notifications.filter(n => n.id !== id) 
        }), false, 'removeNotification'),
    }),
    { name: 'dashboard-store' }
  )
);
```

---

## ⚡ FASE 2 - OTIMIZAÇÃO DE PERFORMANCE (2-3 semanas)

### 2.1 Lazy Loading e Code Splitting

#### 📦 **Componentes com Lazy Loading**
```typescript
// src/components/features/dashboard/DashboardContent.tsx
import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy loading dos componentes pesados
const OEEDashboard = lazy(() => import('@/components/OEEDashboard'));
const FleetKPIComparison = lazy(() => import('@/components/FleetKPIComparison'));
const EnergyAirConsumption = lazy(() => import('@/components/EnergyAirConsumption'));
const PredictiveMaintenance = lazy(() => import('@/components/PredictiveMaintenance'));

export default function DashboardContent() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<LoadingSpinner />}>
        <OEEDashboard />
      </Suspense>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingSpinner />}>
          <FleetKPIComparison />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <EnergyAirConsumption />
        </Suspense>
      </div>
      
      <Suspense fallback={<LoadingSpinner />}>
        <PredictiveMaintenance />
      </Suspense>
    </div>
  );
}
```

### 2.2 Otimização com React.memo e useMemo

#### 🧠 **Componente Otimizado**
```typescript
// src/components/features/dashboard/StatCard.tsx
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: LucideIcon;
  variant: 'success' | 'info' | 'warning';
  index: number;
}

const StatCard = memo(function StatCard({
  title,
  value,
  trend,
  description,
  icon: Icon,
  variant,
  index
}: StatCardProps) {
  const styles = useMemo(() => {
    const variants = {
      success: {
        bgColor: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40',
        borderColor: 'border-green-500/30',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
        trendBg: 'bg-green-500/20',
        trendColor: 'text-green-400'
      },
      info: {
        bgColor: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40',
        borderColor: 'border-blue-500/30',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        trendBg: 'bg-blue-500/20',
        trendColor: 'text-blue-400'
      },
      warning: {
        bgColor: 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40',
        borderColor: 'border-yellow-500/30',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400',
        trendBg: 'bg-yellow-500/20',
        trendColor: 'text-yellow-400'
      }
    };
    return variants[variant];
  }, [variant]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${styles.bgColor} ${styles.borderColor} border backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${styles.trendBg} ${styles.trendColor} font-medium`}>
          {trend}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
});

export default StatCard;
```

### 2.3 Service Layer para APIs

#### 🔌 **Camada de Serviços (src/services/api.ts)**
```typescript
class ApiService {
  private baseURL: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getStats() {
    return this.request('/api/stats');
  }

  async getOEEData() {
    return this.request('/api/oee');
  }

  async getEnergyData() {
    return this.request('/api/energy');
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiService = new ApiService();
export const fetchStats = () => apiService.getStats();
export const fetchOEEData = () => apiService.getOEEData();
export const fetchEnergyData = () => apiService.getEnergyData();
```

---

## 🎨 FASE 3 - MELHORIAS DE UX/UI (3-4 semanas)

### 3.1 Sistema de Navegação Melhorado

#### 🧭 **Breadcrumbs Component**
```typescript
// src/components/ui/Breadcrumbs.tsx
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link href="/" className="flex items-center hover:text-white transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.href && !item.active ? (
            <Link 
              href={item.href} 
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? 'text-white font-medium' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
```

### 3.2 Loading States Melhorados

#### ⏳ **Skeleton Loading Component**
```typescript
// src/components/ui/SkeletonCard.tsx
import React from 'react';

interface SkeletonCardProps {
  variant?: 'stat' | 'chart' | 'table';
}

export default function SkeletonCard({ variant = 'stat' }: SkeletonCardProps) {
  const baseClasses = "bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 border border-neutral-700/30 backdrop-blur-xl rounded-2xl p-6 animate-pulse";

  if (variant === 'stat') {
    return (
      <div className={baseClasses}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-neutral-700/50 rounded-xl"></div>
          <div className="w-16 h-6 bg-neutral-700/50 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="w-24 h-4 bg-neutral-700/50 rounded"></div>
          <div className="w-20 h-8 bg-neutral-700/50 rounded"></div>
          <div className="w-32 h-3 bg-neutral-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={baseClasses}>
        <div className="w-32 h-6 bg-neutral-700/50 rounded mb-4"></div>
        <div className="h-64 bg-neutral-700/50 rounded"></div>
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="w-8 h-8 bg-neutral-700/50 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-neutral-700/50 rounded"></div>
              <div className="w-1/2 h-3 bg-neutral-700/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 CONFIGURAÇÃO DE TESTES

### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Exemplo de Teste
```typescript
// src/components/ui/__tests__/Card.test.tsx
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    const { container } = render(
      <Card variant="success">
        <div>Success Card</div>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('from-green-900/40');
  });

  it('handles different sizes', () => {
    const { container } = render(
      <Card size="lg">
        <div>Large Card</div>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('p-8');
  });
});
```

---

## 📊 Métricas e Monitoramento

### Performance Monitoring
```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  static measureRender(componentName: string) {
    return function <T extends React.ComponentType<any>>(Component: T): T {
      const WrappedComponent = (props: any) => {
        const startTime = performance.now();
        
        React.useEffect(() => {
          const endTime = performance.now();
          console.log(`${componentName} render time: ${endTime - startTime}ms`);
        });
        
        return React.createElement(Component, props);
      };
      
      WrappedComponent.displayName = `PerformanceMonitor(${componentName})`;
      return WrappedComponent as T;
    };
  }
  
  static trackUserInteraction(action: string, data?: any) {
    // Integração com analytics (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, data);
    }
  }
}
```

---

## 🚀 Scripts de Automação

### Package.json Scripts Atualizados
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "analyze": "cross-env ANALYZE=true next build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lighthouse": "lhci autorun",
    "validate": "npm run type-check && npm run lint && npm run test:ci",
    "prebuild": "npm run validate"
  }
}
```

---

*Este roadmap fornece uma base sólida para transformar o frontend atual em uma aplicação moderna, performática e maintível. Cada fase pode ser implementada incrementalmente, permitindo melhorias contínuas sem interromper o desenvolvimento.*
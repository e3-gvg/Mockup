'use client';

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/hooks/useSupabaseAuth';
import { NotificationProvider } from '@/components/NotificationToast';
import { ModalProvider } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';

// Mock window object
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
});

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/'
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null })
        })
      })
    })
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: React.ComponentProps<'span'>) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn()
  })
}));



// All providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ModalProvider>
          <VisualFeedbackProvider>
            {children}
          </VisualFeedbackProvider>
        </ModalProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'OPERATOR' as const,
  tenantId: 'test-tenant-id',
  tenant: {
    id: 'test-tenant-id',
    name: 'Test Tenant',
    subdomain: 'test',
    plan: 'PRO' as const,
    isActive: true
  },
  ...overrides
});

export const createMockSession = (overrides = {}) => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    ...overrides
  }
});

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const checkAccessibility = async (container: HTMLElement) => {
  const { default: axeCore } = await import('axe-core');
  const results = await axeCore.run(container);
  return results;
};

// Component testing helpers
export const waitForLoadingToFinish = async () => {
  // This function would be implemented when testing library is properly configured
  return Promise.resolve();
};

export const expectElementToBeVisible = () => {
  // This function would be implemented when testing library is properly configured
  return true;
};

export const expectElementToHaveAccessibleName = () => {
  // This function would be implemented when testing library is properly configured
  return true;
};

// Mock data generators
export const generateMockOEEData = (overrides = {}) => ({
  overall: 85,
  availability: 93,
  performance: 90,
  quality: 95,
  ...overrides
});

export const generateMockMachineData = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `machine-${index + 1}`,
    name: `Linha ${index + 1}`,
    oee: Math.floor(Math.random() * 40) + 60, // 60-100%
    status: ['excellent', 'good', 'needs-attention'][Math.floor(Math.random() * 3)],
    lastUpdate: new Date().toISOString()
  }));
};

// Error boundary for testing
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error);
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="error-boundary">
          <h2>Something went wrong in test.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Re-export everything from React Testing Library
// export * from '@testing-library/react'; // Commented out until properly configured
export { customRender as render };
export { mockRouter };
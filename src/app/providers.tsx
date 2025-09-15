'use client';

import * as React from 'react';
import { AuthProvider } from '../hooks/useSupabaseAuth';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      {children}
    </AuthProvider>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Header = () => (
  <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Image 
          src="/logo-e3.png" 
          alt="E3 Logo" 
          width={60}
          height={60}
          className="h-15 w-auto"
        />
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard IoT</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de Monitoramento Industrial</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-300 font-medium">Online</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">VULCAN</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  </header>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Map pathname to section ID
  const getActiveSectionFromPath = useCallback((path: string) => {
    if (path === '/dashboard') return 'dashboard';
    if (path.includes('/analise-refugo')) return 'analise-refugo';
    if (path.includes('/digital-twin')) return 'digital-twin';
    if (path.includes('/dados')) return 'dados';
    if (path.includes('/usuarios')) return 'usuarios';
    if (path.includes('/configuracoes')) return 'configuracoes';
    return 'dashboard';
  }, []);

  const activeSection = getActiveSectionFromPath(pathname);

  const handleSectionChange = useCallback((section: string) => {
    switch (section) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'analise-refugo':
        router.push('/dashboard/analise-refugo');
        break;
      case 'digital-twin':
        router.push('/dashboard/digital-twin');
        break;
      case 'dados':
        router.push('/dashboard/dados');
        break;
      case 'usuarios':
        router.push('/dashboard/usuarios');
        break;
      case 'configuracoes':
        router.push('/dashboard/configuracoes');
        break;
      default:
        router.push('/dashboard');
    }
  }, [router]);

  const handleToggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

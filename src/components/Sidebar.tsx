'use client';

import React, { memo, useCallback } from 'react';
import Image from 'next/image';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Wrench, 
  Activity, 
  Database, 
  Users, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Box,
  Package,
  X,
  Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

// Memoize menu items to prevent recreation on every render
const menuItems = [
  { id: 'dashboard', label: 'Painel Principal', icon: Home },
  { id: 'ativos', label: 'Ativos', icon: Package },
  { id: 'dados', label: 'Dados', icon: Database },
  { id: 'usuarios', label: 'Usuários', icon: Users },
  { id: 'alerts', label: 'Alertas', icon: Bell },
  { id: 'monitoring', label: 'Monitoramento', icon: Activity },
  { id: 'mqtt', label: 'Monitor MQTT', icon: Wifi },
  { id: 'analytics', label: 'Análises', icon: BarChart3 },
  { id: 'maintenance', label: 'Manutenção', icon: Wrench },
  { id: 'analise-refugo', label: 'Análise de Refugo', icon: Trash2 },
  { id: 'digital-twin', label: 'Gêmeo Digital', icon: Box },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
] as const;

const Sidebar = memo<SidebarProps>(({ isCollapsed, onToggle, activeSection, onSectionChange, isMobileOpen = false, onMobileToggle }) => {
  // Memoize click handler to prevent recreation
  const handleSectionClick = useCallback((sectionId: string) => {
    // Navigate to root-level pages instead of changing sections
    const routeMap: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'monitoring': '/monitoramento',
      'mqtt': '/mqtt',
      'analytics': '/analytics',
      'maintenance': '/maintenance',
      'analise-refugo': '/analise-refugo',
      'digital-twin': '/digital-twin',
      'ativos': '/ativos',
      'dados': '/dados',
      'usuarios': '/usuarios',
      'alerts': '/alerts',
      'configuracoes': '/configuracoes'
    };
    
    const route = routeMap[sectionId];
    if (route) {
      window.location.href = route;
      // Close mobile menu after navigation
      if (onMobileToggle) {
        onMobileToggle();
      }
    } else {
      onSectionChange(sectionId);
    }
  }, [onSectionChange, onMobileToggle]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileToggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`glass-sidebar text-white h-full flex flex-col shadow-2xl border-r border-gray-700/50 ${
          isMobileOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'
        } lg:relative lg:translate-x-0`}
      >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center space-x-3"
            >
              <Image 
                src="/logo-e3.png" 
                alt="E3 Logo" 
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <h2 className="text-lg font-bold text-white">VULCAN</h2>
                <p className="text-xs text-gray-400">Industrial IoT</p>
              </div>
            </motion.div>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Image 
                  src="/logo-e3.png" 
                  alt="E3 Logo" 
                  width={24}
                  height={24}
                  className="h-6 w-auto"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Mobile Close Button */}
            <button
              onClick={onMobileToggle}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors lg:hidden"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            {/* Desktop Toggle Button */}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors hidden lg:block"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-white shadow-lg'
                  : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : ''}`} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800/50 rounded-lg p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">E3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">VULCAN</p>
                <p className="text-xs text-gray-400">Sistema Online</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      </motion.div>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
'use client';

import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'warning' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationToast({ 
  notification, 
  onClose 
}: { 
  notification: Notification; 
  onClose: () => void; 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        glass-container border-2 ${getStyles()}
        p-4 min-w-[320px] max-w-sm
        shadow-xl backdrop-blur-xl
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white mb-1">
                {notification.title}
              </h4>
              {notification.message && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  {notification.message}
                </p>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
          
          {notification.action && (
            <div className="mt-3">
              <button
                onClick={() => {
                  notification.action?.onClick();
                  onClose();
                }}
                className="glass-button text-xs px-3 py-1.5 text-white hover:bg-white/20"
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {notification.duration && notification.duration > 0 && !isHovered && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: notification.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

// Hook para facilitar o uso
export function useToast() {
  const { addNotification } = useNotifications();
  
  return {
    success: (title: string, message?: string, options?: Partial<Notification>) => {
      addNotification({ type: 'success', title, message, ...options });
    },
    warning: (title: string, message?: string, options?: Partial<Notification>) => {
      addNotification({ type: 'warning', title, message, ...options });
    },
    error: (title: string, message?: string, options?: Partial<Notification>) => {
      addNotification({ type: 'error', title, message, ...options });
    },
    info: (title: string, message?: string, options?: Partial<Notification>) => {
      addNotification({ type: 'info', title, message, ...options });
    },
    custom: (notification: Omit<Notification, 'id'>) => {
      addNotification(notification);
    }
  };
}

// Componente para demonstração
export function ToastDemo() {
  const toast = useToast();
  
  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold text-white mb-4">Sistema de Notificações</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => toast.success('Operação Concluída', 'Dados salvos com sucesso!')}
          className="glass-button text-sm"
        >
          ✅ Sucesso
        </button>
        
        <button
          onClick={() => toast.warning('Atenção Requerida', 'Temperatura acima do normal')}
          className="glass-button text-sm"
        >
          ⚠️ Aviso
        </button>
        
        <button
          onClick={() => toast.error('Falha Crítica', 'Conexão com sensor perdida')}
          className="glass-button text-sm"
        >
          ❌ Erro
        </button>
        
        <button
          onClick={() => toast.info('Nova Atualização', 'Sistema atualizado para v2.1.0')}
          className="glass-button text-sm"
        >
          ℹ️ Info
        </button>
      </div>
      
      <button
        onClick={() => toast.custom({
          type: 'warning',
          title: 'Manutenção Programada',
          message: 'Sistema será reiniciado em 5 minutos',
          duration: 0, // Não remove automaticamente
          action: {
            label: 'Adiar',
            onClick: () => toast.info('Manutenção Adiada', 'Reagendada para 22:00')
          }
        })}
        className="glass-button text-sm w-full mt-3"
      >
        🔧 Notificação com Ação
      </button>
    </div>
  );
}

export default NotificationToast;
'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Info, Settings } from 'lucide-react';

type ModalType = 'default' | 'confirmation' | 'alert' | 'form' | 'fullscreen';
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalConfig {
  id: string;
  type: ModalType;
  size: ModalSize;
  title: string;
  content: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      loading?: boolean;
      variant?: 'success' | 'warning' | 'error' | 'default';
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
  onClose?: () => void;
}

interface ModalContextType {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = (config: Omit<ModalConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const modal = { ...config, id };
    setModals(prev => [...prev, modal]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter(m => m.id !== id);
    });
  };

  const closeAllModals = () => {
    modals.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modals.length > 0) {
        const topModal = modals[modals.length - 1];
        if (topModal.closeOnEscape !== false) {
          closeModal(topModal.id);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modals]);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals }}>
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  );
}

function ModalContainer() {
  const { modals, closeModal } = useModal();

  return (
    <AnimatePresence>
      {modals.map((modal, index) => (
        <ModalOverlay
          key={modal.id}
          modal={modal}
          zIndex={1000 + index}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </AnimatePresence>
  );
}

function ModalOverlay({ 
  modal, 
  zIndex, 
  onClose 
}: { 
  modal: ModalConfig; 
  zIndex: number; 
  onClose: () => void; 
}) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && modal.closeOnOverlayClick !== false) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (modal.size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'full': return 'max-w-7xl mx-4';
      default: return 'max-w-lg';
    }
  };

  const getModalClasses = () => {
    if (modal.type === 'fullscreen') {
      return 'w-full h-full max-w-none max-h-none m-0 rounded-none';
    }
    return `${getSizeClasses()} w-full max-h-[90vh] mx-4`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex }}
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          glass-container border-2 border-white/20
          ${getModalClasses()}
          shadow-2xl backdrop-blur-xl
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContent modal={modal} onClose={onClose} />
      </motion.div>
    </motion.div>
  );
}

function ModalContent({ modal, onClose }: { modal: ModalConfig; onClose: () => void }) {
  const getIcon = () => {
    switch (modal.type) {
      case 'confirmation':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'alert':
        return <Info className="w-6 h-6 text-blue-400" />;
      default:
        return null;
    }
  };

  const getButtonVariant = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'glass-button';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <h2 className="text-xl font-semibold text-white">
            {modal.title}
          </h2>
        </div>
        
        {modal.showCloseButton !== false && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {modal.content}
      </div>

      {/* Actions */}
      {modal.actions && (
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
          {modal.actions.secondary && (
            <button
              onClick={modal.actions.secondary.onClick}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              {modal.actions.secondary.label}
            </button>
          )}
          
          {modal.actions.primary && (
            <button
              onClick={modal.actions.primary.onClick}
              disabled={modal.actions.primary.loading}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all
                ${getButtonVariant(modal.actions.primary.variant)}
                ${modal.actions.primary.loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {modal.actions.primary.loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando...</span>
                </div>
              ) : (
                modal.actions.primary.label
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
}

// Hook para facilitar o uso
export function useSmartModal() {
  const { openModal, closeModal } = useModal();
  
  return {
    // Modal de confirmação
    confirm: ({
      title,
      message,
      onConfirm,
      onCancel,
      confirmLabel = 'Confirmar',
      cancelLabel = 'Cancelar',
      variant = 'warning'
    }: {
      title: string;
      message: string;
      onConfirm: () => void;
      onCancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
      variant?: 'success' | 'warning' | 'error';
    }) => {
      return openModal({
        type: 'confirmation',
        size: 'md',
        title,
        content: (
          <div className="text-gray-300 leading-relaxed">
            {message}
          </div>
        ),
        actions: {
          primary: {
            label: confirmLabel,
            onClick: onConfirm,
            variant
          },
          secondary: {
            label: cancelLabel,
            onClick: onCancel || (() => {})
          }
        }
      });
    },

    // Modal de alerta
    alert: (title: string, message: string) => {
      return openModal({
        type: 'alert',
        size: 'md',
        title,
        content: (
          <div className="text-gray-300 leading-relaxed">
            {message}
          </div>
        ),
        actions: {
          primary: {
            label: 'OK',
            onClick: () => {}
          }
        }
      });
    },

    // Modal customizado
    open: (config: Omit<ModalConfig, 'id'>) => {
      return openModal(config);
    },

    close: closeModal
  };
}

// Componente para demonstração
export function ModalDemo() {
  const modal = useSmartModal();
  const [loading, setLoading] = useState(false);
  
  const handleDelete = () => {
    modal.confirm({
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
      variant: 'error',
      confirmLabel: 'Excluir',
      onConfirm: () => {
        // Simular exclusão
        console.log('Item excluído');
      }
    });
  };

  const handleSave = () => {
    setLoading(true);
    modal.open({
      type: 'form',
      size: 'lg',
      title: 'Configurações Avançadas',
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome do Dispositivo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição opcional..."
            />
          </div>
        </div>
      ),
      actions: {
        primary: {
          label: 'Salvar',
          onClick: () => {
            setTimeout(() => setLoading(false), 2000);
          },
          loading,
          variant: 'success'
        },
        secondary: {
          label: 'Cancelar',
          onClick: () => setLoading(false)
        }
      }
    });
  };

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold text-white mb-4">Sistema de Modais</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => modal.alert('Informação', 'Sistema atualizado com sucesso!')}
          className="glass-button text-sm"
        >
          ℹ️ Alerta
        </button>
        
        <button
          onClick={handleDelete}
          className="glass-button text-sm"
        >
          🗑️ Confirmação
        </button>
        
        <button
          onClick={handleSave}
          className="glass-button text-sm"
        >
          ⚙️ Formulário
        </button>
        
        <button
          onClick={() => modal.open({
            type: 'fullscreen',
            size: 'full',
            title: 'Visualização Completa',
            content: (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">Modal Fullscreen</h3>
                  <p className="text-gray-300">Conteúdo em tela cheia para visualizações detalhadas</p>
                </div>
              </div>
            )
          })}
          className="glass-button text-sm"
        >
          🖥️ Tela Cheia
        </button>
      </div>
    </div>
  );
}

export default ModalProvider;
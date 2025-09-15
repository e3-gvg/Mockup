'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Package,
  Cpu,
  Hash,
  IdCard,
  Tag,
  Save,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/NotificationToast';

interface Asset {
  id: string;
  modelo: string;
  tipo: string;
  codigo: string;
  matricula: string;
  apelido: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  createdAt: string;
  updatedAt: string;
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  asset?: Asset | null;
  mode: 'create' | 'edit';
}

const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  asset,
  mode
}) => {
  const [formData, setFormData] = useState({
    modelo: '',
    tipo: '',
    codigo: '',
    matricula: '',
    apelido: '',
    status: 'ativo' as Asset['status']
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Tipos de máquinas predefinidos
  const tiposMaquinas = [
    'Endireitadeira',
    'Estribadeira',
    'Dobradeira',
    'Cortadeira',
    'Central de Corte e Dobra',
    'Soldadora',
    'Curvadora',
    'Calandradora'
  ];

  // Preencher formulário quando em modo de edição
  useEffect(() => {
    if (mode === 'edit' && asset) {
      setFormData({
        modelo: asset.modelo,
        tipo: asset.tipo,
        codigo: asset.codigo,
        matricula: asset.matricula,
        apelido: asset.apelido,
        status: asset.status
      });
    } else {
      setFormData({
        modelo: '',
        tipo: '',
        codigo: '',
        matricula: '',
        apelido: '',
        status: 'ativo'
      });
    }
  }, [mode, asset, isOpen]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(formData);
      toast.success(
        mode === 'create' 
          ? 'Ativo criado com sucesso!' 
          : 'Ativo atualizado com sucesso!'
      );
      onClose();
    } catch {
      toast.error('Erro ao salvar ativo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gray-800 rounded-xl border border-gray-700/50 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'create' ? 'Novo Ativo' : 'Editar Ativo'}
                </h2>
                <p className="text-sm text-gray-400">
                  {mode === 'create' 
                    ? 'Adicione uma nova máquina ao sistema'
                    : 'Modifique as informações do ativo'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modelo */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Package className="w-4 h-4" />
                  <span>Modelo *</span>
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder="Ex: CNC-1000X"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Cpu className="w-4 h-4" />
                  <span>Tipo *</span>
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                >
                  <option value="">Selecione o tipo</option>
                  {tiposMaquinas.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Código */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <Hash className="w-4 h-4" />
                  <span>Código *</span>
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                  placeholder="Ex: TNC001"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors font-mono"
                />
              </div>

              {/* Matrícula */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                  <IdCard className="w-4 h-4" />
                  <span>Matrícula *</span>
                </label>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => handleInputChange('matricula', e.target.value.toUpperCase())}
                  placeholder="Ex: MAT-2024-001"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors font-mono"
                />

              </div>
            </div>

            {/* Apelido */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <Tag className="w-4 h-4" />
                <span>Apelido *</span>
              </label>
              <input
                type="text"
                value={formData.apelido}
                onChange={(e) => handleInputChange('apelido', e.target.value)}
                placeholder="Ex: Torno Principal"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
              />

            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Status
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'ativo', label: 'Ativo', color: 'green' },
                  { value: 'inativo', label: 'Inativo', color: 'gray' },
                  { value: 'manutencao', label: 'Manutenção', color: 'yellow' }
                ].map((status) => (
                  <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      formData.status === status.value
                        ? `border-${status.color}-500 bg-${status.color}-500`
                        : 'border-gray-500'
                    }`}>
                      {formData.status === status.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm text-gray-300">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-white font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssetModal;
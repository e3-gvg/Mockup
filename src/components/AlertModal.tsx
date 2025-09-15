'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Bell,
  Save,
  Loader2
} from 'lucide-react';
import { assetsService, Asset } from '../services/assetsService';

export interface AlertFormData {
  id?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  source: string;
  threshold?: number;
  unit?: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  enabled: boolean;
  emailNotification: boolean;
  smsNotification: boolean;
  pushNotification: boolean;
  machineId: string; // ID da máquina selecionada
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alertData: AlertFormData) => void;
  editAlert?: AlertFormData | null;
  title: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editAlert,
  title
}) => {
  const [formData, setFormData] = useState<AlertFormData>({
    title: '',
    description: '',
    severity: 'medium',
    category: 'temperature',
    source: '',
    threshold: 0,
    unit: '°C',
    condition: 'greater_than',
    enabled: true,
    emailNotification: true,
    smsNotification: false,
    pushNotification: true,
    machineId: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'notifications'>('basic');

  useEffect(() => {
    if (editAlert) {
      setFormData(editAlert);
    } else {
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: 'temperature',
        source: '',
        threshold: 0,
        unit: '°C',
        condition: 'greater_than',
        enabled: true,
        emailNotification: true,
        smsNotification: false,
        pushNotification: true,
        machineId: ''
      });
    }
    setErrors({});
    setActiveTab('basic');
  }, [editAlert, isOpen]);

  // Carregar assets disponíveis quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadAvailableAssets();
    }
  }, [isOpen]);

  const loadAvailableAssets = async () => {
    setLoadingAssets(true);
    try {
      const assets = await assetsService.getAssets();
      setAvailableAssets(assets);
    } catch (error) {
      console.error('Erro ao carregar assets:', error);
    } finally {
      setLoadingAssets(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Fonte é obrigatória';
    }

    if (formData.threshold === undefined || formData.threshold < 0) {
      newErrors.threshold = 'Limite deve ser um valor válido';
    }

    if (!formData.machineId) {
      newErrors.machineId = 'Selecione uma máquina';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar alerta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AlertFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'medium': return <Bell className="w-4 h-4 text-yellow-400" />;
      case 'low': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const categories = [
    { value: 'temperature', label: 'Temperatura' },
    { value: 'pressure', label: 'Pressão' },
    { value: 'vibration', label: 'Vibração' },
    { value: 'speed', label: 'Velocidade' },
    { value: 'power', label: 'Energia' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'security', label: 'Segurança' },
    { value: 'system', label: 'Sistema' }
  ];

  const units = [
    { value: '°C', label: '°C (Celsius)' },
    { value: '°F', label: '°F (Fahrenheit)' },
    { value: 'bar', label: 'bar (Pressão)' },
    { value: 'psi', label: 'psi (Pressão)' },
    { value: 'rpm', label: 'rpm (Rotação)' },
    { value: 'Hz', label: 'Hz (Frequência)' },
    { value: 'V', label: 'V (Voltagem)' },
    { value: 'A', label: 'A (Corrente)' },
    { value: 'W', label: 'W (Potência)' },
    { value: '%', label: '% (Percentual)' }
  ];

  const conditions = [
    { value: 'greater_than', label: 'Maior que' },
    { value: 'less_than', label: 'Menor que' },
    { value: 'equals', label: 'Igual a' },
    { value: 'not_equals', label: 'Diferente de' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>Informações Básicas</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Notificações</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                          errors.title ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Ex: Temperatura Alta - Motor 1"
                      />
                      {errors.title && (
                        <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fonte *
                      </label>
                      <input
                        type="text"
                        value={formData.source}
                        onChange={(e) => handleInputChange('source', e.target.value)}
                        className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                          errors.source ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="Ex: Sensor-001, Linha-A"
                      />
                      {errors.source && (
                        <p className="text-red-400 text-sm mt-1">{errors.source}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                        errors.description ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Descreva quando este alerta deve ser acionado..."
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Severidade
                      </label>
                      <div className="relative">
                        <select
                          value={formData.severity}
                          onChange={(e) => handleInputChange('severity', e.target.value)}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                          <option value="critical">Crítica</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {getSeverityIcon(formData.severity)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categoria
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Máquina
                      </label>
                      <select
                        value={formData.machineId}
                        onChange={(e) => handleInputChange('machineId', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="">Selecione uma máquina</option>
                        {availableAssets.map(asset => (
                          <option key={asset.id} value={asset.id}>{asset.modelo} - {asset.tipo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Threshold Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Configuração de Limite</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Condição
                      </label>
                      <select
                        value={formData.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      >
                        {conditions.map(cond => (
                          <option key={cond.value} value={cond.value}>{cond.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Valor Limite *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.threshold}
                        onChange={(e) => handleInputChange('threshold', parseFloat(e.target.value))}
                        className={`w-full bg-gray-700/50 border rounded-lg px-4 py-2 text-white ${
                          errors.threshold ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.threshold && (
                        <p className="text-red-400 text-sm mt-1">{errors.threshold}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Unidade
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      >
                        {units.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Configurações de Notificação</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => handleInputChange('enabled', e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-gray-300 font-medium">Alerta Ativo</span>
                      <p className="text-sm text-gray-400">Ativar ou desativar este alerta</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.emailNotification}
                      onChange={(e) => handleInputChange('emailNotification', e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-gray-300 font-medium">Notificação por Email</span>
                      <p className="text-sm text-gray-400">Receber alertas por email</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.smsNotification}
                      onChange={(e) => handleInputChange('smsNotification', e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-gray-300 font-medium">Notificação por SMS</span>
                      <p className="text-sm text-gray-400">Receber alertas por SMS</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.pushNotification}
                      onChange={(e) => handleInputChange('pushNotification', e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-gray-300 font-medium">Notificação Push</span>
                      <p className="text-sm text-gray-400">Receber notificações push no navegador</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Salvando...' : 'Salvar Alerta'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlertModal;
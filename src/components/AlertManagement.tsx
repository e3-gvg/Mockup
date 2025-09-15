'use client';

import React, { useState, useEffect } from 'react';
import { Alert, CreateAlertRequest } from '../types/alert.types';
import { alertsService } from '../services/alerts';
import { useAuth } from '../hooks/useAuth';

interface AlertManagementProps {
  onAlertCreated?: (alert: Alert) => void;
  onAlertUpdated?: (alert: Alert) => void;
  onAlertDeleted?: (alertId: string) => void;
}

const AlertManagement: React.FC<AlertManagementProps> = ({
  onAlertCreated,
  onAlertUpdated,
  onAlertDeleted,
}) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState<CreateAlertRequest>({
    title: '',
    description: '',
    severity: 'MEDIUM',
    machineId: '',
    category: '',
    source: 'MANUAL',
  });

  // Verificar se o usuário tem permissão para gerenciar alertas
  const canManageAlerts = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (canManageAlerts) {
      loadAlerts();
    }
  }, [canManageAlerts]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const alertsData = await alertsService.getAlerts();
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageAlerts) return;

    try {
      setLoading(true);
      setError(null);

      if (editingAlert) {
        const updatedAlert = await alertsService.updateAlert(editingAlert.id, formData);
        setAlerts(prev => prev.map(alert => 
          alert.id === editingAlert.id ? updatedAlert : alert
        ));
        onAlertUpdated?.(updatedAlert);
        setEditingAlert(null);
      } else {
        const newAlert = await alertsService.createAlert(formData);
        setAlerts(prev => [newAlert, ...prev]);
        onAlertCreated?.(newAlert);
        setShowCreateForm(false);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'MEDIUM',
        machineId: '',
        category: '',
        source: 'MANUAL',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar alerta');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      machineId: alert.machineId,
      category: alert.category || '',
      source: alert.source,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (alertId: string) => {
    if (!canManageAlerts) return;
    
    if (!confirm('Tem certeza que deseja deletar este alerta?')) return;

    try {
      setLoading(true);
      await alertsService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      onAlertDeleted?.(alertId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar alerta');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingAlert(null);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      severity: 'MEDIUM',
      machineId: '',
      category: '',
      source: 'MANUAL',
    });
  };

  if (!canManageAlerts) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Acesso Restrito
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Apenas administradores podem gerenciar alertas.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Alertas</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          Novo Alerta
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingAlert ? 'Editar Alerta' : 'Criar Novo Alerta'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Título do alerta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severidade *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição detalhada do alerta"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID da Máquina *
                </label>
                <input
                  type="text"
                  value={formData.machineId}
                  onChange={(e) => setFormData(prev => ({ ...prev, machineId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ID da máquina"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Categoria do alerta"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Salvando...' : editingAlert ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Alertas Cadastrados</h3>
        </div>
        
        {loading && alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Carregando alertas...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum alerta cadastrado.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{alert.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Máquina: {alert.machineId}</span>
                      {alert.category && <span>Categoria: {alert.category}</span>}
                      <span>Fonte: {alert.source}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(alert)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertManagement;
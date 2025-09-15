'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  Filter,
  Search,
  Settings,
  Volume2,
  VolumeX,
  Trash2,
  Eye,

  Download
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useSmartModal } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge, PerformanceGauge } from '@/components/VisualFeedback';
import AlertModal, { AlertFormData } from '@/components/AlertModal';
import Tooltip from '@/components/Tooltip';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'error' | 'info';
  category: string;
  source: string;
  timestamp: string;
  status: 'active' | 'resolved';
  acknowledged: boolean;
  priority?: string;
  assignedTo?: string;
  tags?: string[];
  relatedDevices?: string[];
  escalationLevel?: number;
  autoResolved?: boolean;
  pushNotification?: boolean;
}

function AlertsContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertFormData | null>(null);
  const toast = useToast();
  const modal = useSmartModal();

  const alertMetrics = [
    {
      title: 'Alertas Ativos',
      value: '23',
      change: '+5',
      description: 'Requerem atenção',
      icon: Bell,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Críticos',
      value: '4',
      change: '+2',
      description: 'Alta prioridade',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Resolvidos Hoje',
      value: '18',
      change: '+6',
      description: 'Finalizados com sucesso',
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Tempo Médio',
      value: '12min',
      change: '-3min',
      description: 'Resolução de alertas',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    }
  ];

  const alerts: Alert[] = [
    {
      id: 'ALT-001',
      title: 'Temperatura Alta - Linha 1',
      description: 'Temperatura do motor excedeu 85°C',
      severity: 'critical' as const,
      category: 'Temperatura',
      source: 'Linha de Produção 1',
      timestamp: '2024-01-15T10:30:00',
      status: 'active' as const,
      acknowledged: false
    },
    {
      id: 'ALT-002',
      title: 'Pressão Baixa - Compressor',
      description: 'Pressão do ar comprimido abaixo de 6 bar',
      severity: 'warning' as const,
      category: 'Pressão',
      source: 'Compressor AR-01',
      timestamp: '2024-01-15T10:25:00',
      status: 'active' as const,
      acknowledged: true
    },
    {
      id: 'ALT-003',
      title: 'Vibração Anormal - Esteira',
      description: 'Vibração detectada acima do limite normal',
      severity: 'warning' as const,
      category: 'Vibração',
      source: 'Esteira Transportadora',
      timestamp: '2024-01-15T10:20:00',
      status: 'resolved' as const,
      acknowledged: true
    },
    {
      id: 'ALT-004',
      title: 'Falha de Comunicação',
      description: 'Perda de conexão com sensor de umidade',
      severity: 'error' as const,
      category: 'Comunicação',
      source: 'Sensor UMD-05',
      timestamp: '2024-01-15T10:15:00',
      status: 'active' as const,
      acknowledged: false
    },
    {
      id: 'ALT-005',
      title: 'Manutenção Programada',
      description: 'Manutenção preventiva agendada para hoje',
      severity: 'info' as const,
      category: 'Manutenção',
      source: 'Sistema de Gestão',
      timestamp: '2024-01-15T09:00:00',
      status: 'active' as const,
      acknowledged: true
    },
    {
      id: 'ALT-006',
      title: 'Consumo Energético Alto',
      description: 'Consumo 15% acima da média histórica',
      severity: 'warning' as const,
      category: 'Energia',
      source: 'Medidor Principal',
      timestamp: '2024-01-15T08:45:00',
      status: 'active' as const,
      acknowledged: false
    }
  ];

  const [alertsList, setAlertsList] = useState<Alert[]>(alerts);

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'critical', label: 'Críticos' },
    { value: 'warning', label: 'Avisos' },
    { value: 'resolved', label: 'Resolvidos' },
    { value: 'unacknowledged', label: 'Não Reconhecidos' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-red-500/20 text-red-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredAlerts = alertsList.filter(alert => {
    const matchesFilter = (() => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'active') return alert.status === 'active';
      if (activeFilter === 'critical') return alert.severity === 'critical';
      if (activeFilter === 'warning') return alert.severity === 'warning';
      if (activeFilter === 'resolved') return alert.status === 'resolved';
      if (activeFilter === 'unacknowledged') return !alert.acknowledged;
      return true;
    })();

    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAcknowledge = (alertId: string) => {
    setAlertsList(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alerta', `Alerta ${alertId} reconhecido`);
  };

  const handleResolve = (alertId: string) => {
    const modalId = modal.confirm({
      title: 'Resolver Alerta',
      message: `Tem certeza que deseja marcar o alerta ${alertId} como resolvido?`,
      onConfirm: () => {
        setAlertsList(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'resolved' } : alert
        ));
        toast.success('Alerta', `Alerta ${alertId} resolvido com sucesso`);
        modal.close(modalId);
      },
      confirmLabel: 'Resolver',
      cancelLabel: 'Cancelar',
      variant: 'success'
    });
  };

  const handleDelete = (alertId: string) => {
    const modalId = modal.confirm({
      title: 'Excluir Alerta',
      message: `Tem certeza que deseja excluir o alerta ${alertId}? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        setAlertsList(prev => prev.filter(alert => alert.id !== alertId));
        toast.success('Alerta', `Alerta ${alertId} excluído`);
        modal.close(modalId);
      },
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      variant: 'error'
    });
  };

  const handleSaveAlert = (alertData: AlertFormData) => {
    // Mapear severity de AlertFormData para Alert
    const severityMap: Record<AlertFormData['severity'], Alert['severity']> = {
      'low': 'info',
      'medium': 'warning', 
      'high': 'error',
      'critical': 'critical'
    };

    const newAlert: Alert = {
      id: alertData.id || `ALT-${String(alertsList.length + 1).padStart(3, '0')}`,
      title: alertData.title,
      description: alertData.description,
      severity: severityMap[alertData.severity],
      category: alertData.category,
      source: alertData.source,
      timestamp: new Date().toISOString(),
      status: alertData.enabled ? 'active' : 'resolved',
      acknowledged: false,
      priority: alertData.severity,
      assignedTo: undefined,
      tags: [],
      relatedDevices: [alertData.source],
      escalationLevel: alertData.severity === 'critical' ? 3 : alertData.severity === 'high' ? 2 : 1,
      autoResolved: false,
      pushNotification: alertData.pushNotification
    };

    if (editingAlert?.id) {
      setAlertsList(prev => prev.map(alert => 
        alert.id === editingAlert.id ? newAlert : alert
      ));
      toast.success('Alerta', 'Alerta atualizado com sucesso');
    } else {
      setAlertsList(prev => [newAlert, ...prev]);
      toast.success('Alerta', 'Novo alerta criado com sucesso');
    }
    setIsAlertModalOpen(false);
    setEditingAlert(null);
  };

  const handleEditAlert = (alert: Alert) => {
    // Mapear severity de Alert para AlertFormData
    const severityMap: Record<Alert['severity'], AlertFormData['severity']> = {
      'critical': 'critical',
      'error': 'high',
      'warning': 'medium',
      'info': 'low'
    };

    // Converter Alert para AlertFormData
    const alertFormData: AlertFormData = {
      id: alert.id,
      title: alert.title,
      description: alert.description,
      severity: severityMap[alert.severity],
      category: alert.category.toLowerCase(),
      source: alert.source,
      enabled: alert.status === 'active',
      condition: 'greater_than',
      emailNotification: true,
      smsNotification: false,
      pushNotification: alert.pushNotification || true
    };
    setEditingAlert(alertFormData);
    setIsAlertModalOpen(true);
  };

  const handleCreateAlert = () => {
    setEditingAlert(null);
    setIsAlertModalOpen(true);
  };

  const handleExportAlerts = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Título,Descrição,Severidade,Categoria,Fonte,Status,Reconhecido,Data\n" +
      filteredAlerts.map(alert => 
        `${alert.id},"${alert.title}","${alert.description}",${alert.severity},${alert.category},"${alert.source}",${alert.status},${alert.acknowledged ? 'Sim' : 'Não'},${new Date(alert.timestamp).toLocaleString('pt-BR')}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alertas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exportação', 'Relatório de alertas exportado com sucesso');
  };

  const handleOpenSettings = () => {
    toast.info('Configurações', 'Abrindo configurações de alertas...');
    // Aqui você pode implementar a navegação para a página de configurações
    // ou abrir um modal de configurações
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="alerts"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Alertas</h1>
                  <p className="text-gray-400">Central de alertas e notificações do sistema - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Tooltip content="Criar um novo alerta personalizado">
                  <button 
                    onClick={handleCreateAlert}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Novo Alerta</span>
                  </button>
                </Tooltip>
                <Tooltip content={soundEnabled ? "Desativar notificações sonoras" : "Ativar notificações sonoras"}>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span className="text-sm">{soundEnabled ? 'Som Ativo' : 'Som Inativo'}</span>
                  </button>
                </Tooltip>
                <Tooltip content="Exportar lista de alertas para CSV">
                  <button 
                    onClick={handleExportAlerts}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Exportar</span>
                  </button>
                </Tooltip>
                <Tooltip content="Configurações de alertas e notificações">
                  <button 
                    onClick={handleOpenSettings}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Configurar</span>
                  </button>
                </Tooltip>
                <Tooltip content="Status do sistema em tempo real">
                  <StatusBadge status="online" label="Sistema Online" pulse />
                </Tooltip>
                <Tooltip content="Performance do sistema: 95%">
                  <PerformanceGauge value={95} label="Performance" size="sm" />
                </Tooltip>
                <Tooltip content="Perfil do administrador">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <span className="text-sm font-bold text-white">A</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* Alerts Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {alertMetrics.map((metric, index) => {
                const Icon = metric.icon;
                const tooltipContent = (() => {
                  switch (metric.title) {
                    case 'Alertas Ativos':
                      return 'Número total de alertas que requerem atenção imediata';
                    case 'Críticos':
                      return 'Alertas de alta prioridade que podem afetar a operação';
                    case 'Resolvidos Hoje':
                      return 'Alertas que foram resolvidos nas últimas 24 horas';
                    case 'Tempo Médio':
                      return 'Tempo médio para resolução de alertas no sistema';
                    default:
                      return metric.description;
                  }
                })();
                
                return (
                  <Tooltip key={metric.title} content={tooltipContent}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                          <Icon className={`w-6 h-6 ${metric.color}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">{metric.change}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium mb-1">{metric.title}</h3>
                        <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                        <p className="text-xs text-gray-400">{metric.description}</p>
                      </div>
                    </motion.div>
                  </Tooltip>
                );
              })}
            </div>

            {/* Filters and Search */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              {/* Filter Bar */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <span>Central de Alertas</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Tooltip content="Buscar por título, descrição ou fonte do alerta">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar alertas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-64"
                        />
                      </div>
                    </Tooltip>
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <Tooltip content="Filtrar alertas por categoria, status ou severidade">
                        <select 
                          value={activeFilter}
                          onChange={(e) => setActiveFilter(e.target.value)}
                          className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                        >
                          {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts List */}
              <div className="divide-y divide-gray-700/30">
                {filteredAlerts.length === 0 ? (
                  <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum alerta encontrado com os filtros aplicados.</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert, index) => {
                    const SeverityIcon = getSeverityIcon(alert.severity);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-700/20 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                              <SeverityIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-white font-medium">{alert.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                  {alert.severity.toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                                  {alert.status === 'active' ? 'ATIVO' : 'RESOLVIDO'}
                                </span>
                                {!alert.acknowledged && alert.status === 'active' && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                                    NÃO RECONHECIDO
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-300 mb-2">{alert.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>Fonte: {alert.source}</span>
                                <span>•</span>
                                <span>Categoria: {alert.category}</span>
                                <span>•</span>
                                <span>{new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!alert.acknowledged && alert.status === 'active' && (
                              <Tooltip content="Marcar como reconhecido - confirma que você viu este alerta">
                                <button 
                                  onClick={() => handleAcknowledge(alert.id)}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            )}
                            {alert.status === 'active' && (
                              <Tooltip content="Marcar como resolvido - indica que o problema foi solucionado">
                                <button 
                                  onClick={() => handleResolve(alert.id)}
                                  className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip content="Editar informações do alerta">
                              <button 
                                onClick={() => handleEditAlert(alert)}
                                className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Excluir alerta permanentemente">
                              <button 
                                onClick={() => handleDelete(alert.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Alert Modal */}
       <AlertModal
         isOpen={isAlertModalOpen}
         onClose={() => {
           setIsAlertModalOpen(false);
           setEditingAlert(null);
         }}
         onSave={handleSaveAlert}
         editAlert={editingAlert}
         title={editingAlert ? 'Editar Alerta' : 'Novo Alerta'}
       />
    </div>
  );
}

export default function AlertsPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <AlertsContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
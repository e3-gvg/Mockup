'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Settings,
  Hammer,
  Activity,
  TrendingUp,
  Users,
  FileText,
  Plus,
  Filter,
  Download
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useSmartModal } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge, PerformanceGauge } from '@/components/VisualFeedback';

function MaintenanceContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const toast = useToast();
  const modal = useSmartModal();

  const maintenanceMetrics = [
    {
      title: 'Manutenções Pendentes',
      value: '12',
      change: '+3',
      description: 'Aguardando execução',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Concluídas Hoje',
      value: '8',
      change: '+2',
      description: 'Finalizadas com sucesso',
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Críticas',
      value: '3',
      change: '-1',
      description: 'Requerem atenção imediata',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'MTTR Médio',
      value: '2.4h',
      change: '-0.3h',
      description: 'Tempo médio de reparo',
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    }
  ];

  const maintenanceOrders = [
    {
      id: 'MO-001',
      equipment: 'Linha de Produção 1',
      type: 'Preventiva',
      priority: 'Alta',
      status: 'Pendente',
      technician: 'João Silva',
      scheduledDate: '2024-01-15',
      estimatedTime: '4h',
      description: 'Troca de filtros e lubrificação'
    },
    {
      id: 'MO-002',
      equipment: 'Compressor AR-01',
      type: 'Corretiva',
      priority: 'Crítica',
      status: 'Em Andamento',
      technician: 'Maria Santos',
      scheduledDate: '2024-01-14',
      estimatedTime: '6h',
      description: 'Reparo do sistema de refrigeração'
    },
    {
      id: 'MO-003',
      equipment: 'Esteira Transportadora',
      type: 'Preventiva',
      priority: 'Média',
      status: 'Concluída',
      technician: 'Carlos Lima',
      scheduledDate: '2024-01-13',
      estimatedTime: '2h',
      description: 'Inspeção e ajuste de tensão'
    },
    {
      id: 'MO-004',
      equipment: 'Robô Soldador R2',
      type: 'Preditiva',
      priority: 'Baixa',
      status: 'Agendada',
      technician: 'Ana Costa',
      scheduledDate: '2024-01-16',
      estimatedTime: '3h',
      description: 'Calibração de sensores'
    },
    {
      id: 'MO-005',
      equipment: 'Prensa Hidráulica',
      type: 'Corretiva',
      priority: 'Alta',
      status: 'Pendente',
      technician: 'Pedro Oliveira',
      scheduledDate: '2024-01-15',
      estimatedTime: '5h',
      description: 'Substituição de vedações'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluídas' },
    { value: 'critical', label: 'Críticas' }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400';
      case 'em andamento': return 'bg-blue-500/20 text-blue-400';
      case 'concluída': return 'bg-green-500/20 text-green-400';
      case 'agendada': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'crítica': return 'bg-red-500/20 text-red-400';
      case 'alta': return 'bg-orange-500/20 text-orange-400';
      case 'média': return 'bg-yellow-500/20 text-yellow-400';
      case 'baixa': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'preventiva': return Settings;
      case 'corretiva': return Wrench;
      case 'preditiva': return Activity;
      default: return Hammer;
    }
  };

  const filteredOrders = maintenanceOrders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return order.status === 'Pendente';
    if (activeFilter === 'in-progress') return order.status === 'Em Andamento';
    if (activeFilter === 'completed') return order.status === 'Concluída';
    if (activeFilter === 'critical') return order.priority === 'Crítica';
    return true;
  });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewMaintenance = () => {
    modal.confirm({
      title: 'Nova Ordem de Manutenção',
      message: 'Deseja criar uma nova ordem de manutenção?',
      onConfirm: () => {
        toast.success('Manutenção', 'Nova ordem de manutenção criada com sucesso!');
      }
    });
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
          activeSection="maintenance"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Manutenção</h1>
                  <p className="text-gray-400">Gestão de ordens de manutenção e equipamentos - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleNewMaintenance}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Nova Ordem</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Relatório</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <PerformanceGauge value={92} label="Performance" size="sm" />
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">M</span>
                </div>
              </div>
            </div>
          </header>

          {/* Maintenance Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {maintenanceMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl"
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
                );
              })}
            </div>

            {/* Filters and Orders */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              {/* Filter Bar */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span>Ordens de Manutenção</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <select 
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        {filterOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-700/30">
                {filteredOrders.map((order, index) => {
                  const TypeIcon = getTypeIcon(order.type);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-700/20 transition-colors cursor-pointer"
                      onClick={() => toast.info('Ordem', `Visualizando ordem ${order.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-xl bg-gray-700/50">
                            <TypeIcon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="text-white font-medium">{order.id}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                                {order.priority}
                              </span>
                            </div>
                            <p className="text-gray-300 font-medium">{order.equipment}</p>
                            <p className="text-gray-400 text-sm">{order.description}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{order.technician}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{new Date(order.scheduledDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{order.estimatedTime}</span>
                          </div>
                          <div className="text-xs text-gray-500">{order.type}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => toast.info('Ação', 'Abrindo planejamento de manutenção')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Planejamento</h3>
                    <p className="text-gray-400 text-sm">Agendar manutenções</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Visualizar e gerenciar o cronograma de manutenções preventivas e corretivas.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => toast.info('Ação', 'Abrindo inventário de peças')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Hammer className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Inventário</h3>
                    <p className="text-gray-400 text-sm">Peças e ferramentas</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Controlar estoque de peças de reposição e ferramentas de manutenção.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => toast.info('Ação', 'Abrindo relatórios de manutenção')}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Relatórios</h3>
                    <p className="text-gray-400 text-sm">Análises e métricas</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Gerar relatórios de performance e análises de manutenção.</p>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <MaintenanceContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
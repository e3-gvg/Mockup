'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap, 
  Activity, 
  Settings, 
  Volume2, 
  VolumeX, 
  Clock, 
  MapPin,
  X
} from 'lucide-react';

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  priority: 'high' | 'medium' | 'low';
  category: 'machine' | 'quality' | 'maintenance' | 'energy' | 'safety' | 'production';
  machineId?: string;
  machineName?: string;
  location?: string;
  timestamp: Date;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  autoResolve: boolean;
  resolvedAt?: Date;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: () => void;
}



const SmartNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<SmartNotification | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'machine' | 'production' | 'energy' | 'safety' | 'maintenance'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoResolveEnabled, setAutoResolveEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simular notificações em tempo real
  useEffect(() => {
    const mockNotifications: SmartNotification[] = [
      {
        id: 'NOTIF-001',
        title: 'Temperatura Crítica Detectada',
        message: 'Máquina M001 atingiu 85°C, acima do limite de 80°C',
        type: 'critical',
        priority: 'high',
        category: 'machine',
        machineId: 'M001',
        machineName: 'Linha de Produção A',
        location: 'Setor A - Linha 1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        isRead: false,
        isAcknowledged: false,
        autoResolve: false,
        data: { temperature: 85, threshold: 80, unit: '°C' },
        actions: [
          {
            id: 'stop-machine',
            label: 'Parar Máquina',
            type: 'danger',
            action: () => console.log('Stopping machine')
          },
          {
            id: 'adjust-cooling',
            label: 'Ajustar Resfriamento',
            type: 'primary',
            action: () => console.log('Adjusting cooling')
          }
        ]
      },
      {
        id: 'NOTIF-002',
        title: 'Manutenção Preventiva Agendada',
        message: 'Máquina M002 precisa de manutenção em 2 horas',
        type: 'warning',
        priority: 'medium',
        category: 'maintenance',
        machineId: 'M002',
        machineName: 'Linha de Produção B',
        location: 'Setor B - Linha 2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
        isRead: false,
        isAcknowledged: false,
        autoResolve: true,
        data: { maintenanceType: 'preventive', scheduledTime: '14:00' }
      },
      {
        id: 'NOTIF-003',
        title: 'Qualidade Abaixo do Padrão',
        message: 'Lote BATCH-003 com 15% de defeitos, acima do limite de 10%',
        type: 'warning',
        priority: 'high',
        category: 'quality',
        machineId: 'M003',
        machineName: 'Linha de Produção C',
        location: 'Setor C - Linha 3',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        isRead: true,
        isAcknowledged: false,
        autoResolve: false,
        data: { defectRate: 15, threshold: 10, batchId: 'BATCH-003' }
      },
      {
        id: 'NOTIF-004',
        title: 'Consumo de Energia Otimizado',
        message: 'Sistema reduziu consumo em 12% através de ajustes automáticos',
        type: 'success',
        priority: 'low',
        category: 'energy',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        isRead: true,
        isAcknowledged: true,
        acknowledgedBy: 'Sistema Automático',
        acknowledgedAt: new Date(Date.now() - 55 * 60 * 1000),
        autoResolve: true,
        data: { energySaved: 12, unit: '%' }
      },
      {
        id: 'NOTIF-005',
        title: 'Sensor de Vibração Anômalo',
        message: 'Detectada vibração excessiva no motor principal da M001',
        type: 'critical',
        priority: 'high',
        category: 'safety',
        machineId: 'M001',
        machineName: 'Linha de Produção A',
        location: 'Setor A - Linha 1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
        isRead: false,
        isAcknowledged: false,
        autoResolve: false,
        data: { vibrationLevel: 8.5, threshold: 6.0, unit: 'mm/s' }
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);

  // Simular WebSocket para notificações em tempo real
  useEffect(() => {
    const simulateRealTimeNotifications = () => {
      const eventTypes = [
        {
          title: 'Temperatura Crítica',
          message: 'Máquina M002 atingiu 87°C, acima do limite seguro',
          type: 'critical' as const,
          priority: 'high' as const,
          category: 'machine' as const,
          machineId: 'M002',
          machineName: 'Linha de Produção B',
          location: 'Setor B - Linha 2',
          data: { temperature: 87, threshold: 80, unit: '°C' }
        },
        {
          title: 'Eficiência Baixa Detectada',
          message: 'OEE da Máquina M003 caiu para 65%, abaixo do target de 85%',
          type: 'warning' as const,
          priority: 'medium' as const,
          category: 'production' as const,
          machineId: 'M003',
          machineName: 'Linha de Produção C',
          location: 'Setor C - Linha 3',
          data: { oee: 65, target: 85, unit: '%' }
        },
        {
          title: 'Consumo de Energia Otimizado',
          message: 'IA reduziu consumo energético em 8% através de ajustes automáticos',
          type: 'success' as const,
          priority: 'low' as const,
          category: 'energy' as const,
          data: { energySaved: 8, unit: '%', method: 'AI Optimization' }
        },
        {
          title: 'Sensor de Pressão Anômalo',
          message: 'Pressão do ar comprimido abaixo do normal: 4.2 bar (min: 6.0 bar)',
          type: 'warning' as const,
          priority: 'high' as const,
          category: 'safety' as const,
          machineId: 'M001',
          machineName: 'Linha de Produção A',
          location: 'Setor A - Linha 1',
          data: { pressure: 4.2, threshold: 6.0, unit: 'bar' }
        },
        {
          title: 'Manutenção Preditiva Acionada',
          message: 'Algoritmo ML detectou padrão de desgaste no motor M004',
          type: 'info' as const,
          priority: 'medium' as const,
          category: 'maintenance' as const,
          machineId: 'M004',
          machineName: 'Linha de Produção D',
          location: 'Setor D - Linha 4',
          data: { confidence: 92, recommendedAction: 'Inspeção em 48h', component: 'Motor Principal' }
        }
      ];

      const interval = setInterval(() => {
        if (Math.random() > 0.6) { // 40% chance
          const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
          const newNotification: SmartNotification = {
            id: `NOTIF-${Date.now()}`,
            ...randomEvent,
            timestamp: new Date(),
            isRead: false,
            isAcknowledged: false,
            autoResolve: Math.random() > 0.7,
            actions: randomEvent.type === 'critical' ? [
              {
                id: 'emergency-stop',
                label: 'Parada de Emergência',
                type: 'danger',
                action: () => {
                  console.log('🚨 Parada de emergência acionada!');
                  // Simular ação de parada
                }
              },
              {
                id: 'adjust-parameters',
                label: 'Ajustar Parâmetros',
                type: 'primary',
                action: () => {
                  console.log('⚙️ Ajustando parâmetros automaticamente...');
                  // Simular ajuste automático
                }
              }
            ] : undefined
          };
          
          setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Manter apenas 20 notificações
          setUnreadCount(prev => prev + 1);
          
          if (soundEnabled) {
            // Simular diferentes sons baseados na prioridade
            const soundType = newNotification.priority === 'high' ? '🚨' : 
                            newNotification.priority === 'medium' ? '⚠️' : '🔔';
            console.log(`${soundType} Nova notificação: ${newNotification.title}`);
          }
        }
      }, 25000); // A cada 25 segundos

      return interval;
    };

    const interval = simulateRealTimeNotifications();
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-gray-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'machine': return <Activity className="w-4 h-4" />;
      case 'quality': return <CheckCircle className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'energy': return <Zap className="w-4 h-4" />;
      case 'safety': return <AlertTriangle className="w-4 h-4" />;
      case 'production': return <Activity className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };



  const acknowledgeNotification = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id 
        ? { 
            ...notif, 
            isAcknowledged: true, 
            acknowledgedBy: 'Usuário Atual',
            acknowledgedAt: new Date()
          }
        : notif
    ));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id && !notif.isRead) {
        setUnreadCount(count => count - 1);
        return { ...notif, isRead: true };
      }
      return notif;
    }));
  };

  // Filtrar notificações com múltiplos critérios
  const filteredNotifications = notifications.filter(notif => {
    // Filtro por tipo
    const typeMatch = filter === 'all' || notif.type === filter || 
                     (filter === 'unread' && !notif.isRead) ||
                     (filter === 'critical' && notif.type === 'critical') ||
                     (filter === 'unacknowledged' && !notif.isAcknowledged) ||
                     notif.category === filter;
    
    // Filtro por categoria
    const categoryMatch = categoryFilter === 'all' || notif.category === categoryFilter;
    
    // Filtro por prioridade
    const priorityMatch = priorityFilter === 'all' || notif.priority === priorityFilter;
    
    return typeMatch && categoryMatch && priorityMatch;
  });

  // Estatísticas das notificações
  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    critical: notifications.filter(n => n.type === 'critical').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    info: notifications.filter(n => n.type === 'info').length,
    success: notifications.filter(n => n.type === 'success').length,
    byCategory: {
      machine: notifications.filter(n => n.category === 'machine').length,
      production: notifications.filter(n => n.category === 'production').length,
      energy: notifications.filter(n => n.category === 'energy').length,
      safety: notifications.filter(n => n.category === 'safety').length,
      maintenance: notifications.filter(n => n.category === 'maintenance').length
    },
    byPriority: {
      high: notifications.filter(n => n.priority === 'high').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      low: notifications.filter(n => n.priority === 'low').length
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-8 h-8 text-yellow-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Notificações Inteligentes</h2>
            <p className="text-gray-400">
              {unreadCount} não lidas • {filteredNotifications.length} de {notifications.length} total
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-colors ${
              showStats 
                ? 'bg-gray-500/20 text-gray-500 border border-gray-500/30' 
                : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600'
            }`}
            title="Estatísticas"
          >
            <Activity className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled 
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                : 'bg-gray-700 text-gray-400 border border-gray-600'
            }`}
            title="Sons de Notificação"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setAutoResolveEnabled(!autoResolveEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              autoResolveEnabled 
                ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                : 'bg-gray-700 text-gray-400 border border-gray-600'
            }`}
            title="Auto-resolução"
          >
            <Zap className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{notificationStats.total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{notificationStats.critical}</div>
              <div className="text-xs text-gray-400">Críticas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{notificationStats.warning}</div>
              <div className="text-xs text-gray-400">Avisos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{notificationStats.unread}</div>
              <div className="text-xs text-gray-400">Não Lidas</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Por Categoria</h4>
              <div className="space-y-2">
                {Object.entries(notificationStats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-400">{category}</span>
                    <span className="font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Por Prioridade</h4>
              <div className="space-y-2">
                {Object.entries(notificationStats.byPriority).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-400">{priority}</span>
                    <span className="font-medium text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
        {/* Type Filters */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tipo</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas', count: notifications.length },
              { key: 'unread', label: 'Não Lidas', count: notificationStats.unread },
              { key: 'critical', label: 'Críticas', count: notificationStats.critical },
              { key: 'warning', label: 'Avisos', count: notificationStats.warning },
              { key: 'info', label: 'Informações', count: notificationStats.info },
              { key: 'success', label: 'Sucessos', count: notificationStats.success }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                  filter === key
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50'
                }`}
              >
                <span>{label}</span>
                <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded">{count}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Categoria</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'machine', label: 'Máquinas' },
              { key: 'production', label: 'Produção' },
              { key: 'energy', label: 'Energia' },
              { key: 'safety', label: 'Segurança' },
              { key: 'maintenance', label: 'Manutenção' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key as 'all' | 'machine' | 'production' | 'energy' | 'safety' | 'maintenance')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  categoryFilter === key
                    ? 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Priority Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Prioridade</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'high', label: 'Alta' },
              { key: 'medium', label: 'Média' },
              { key: 'low', label: 'Baixa' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPriorityFilter(key as 'all' | 'high' | 'medium' | 'low')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  priorityFilter === key
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedNotification?.id === notification.id
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : `bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 ${
                        !notification.isRead ? 'border-l-4 border-l-yellow-500' : ''
                      }`
                }`}
                onClick={() => {
                  setSelectedNotification(notification);
                  markAsRead(notification.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium truncate ${
                          !notification.isRead ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">{notification.category}</span>
                        </div>
                        
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          {notification.machineName && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{notification.machineName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {notification.isAcknowledged && (
                            <span className="text-green-400">✓ Confirmado</span>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          )}
        </div>

        {/* Notification Details */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          {selectedNotification ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Detalhes</h3>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getNotificationIcon(selectedNotification.type)}
                    <h4 className="font-medium text-white">{selectedNotification.title}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{selectedNotification.message}</p>
                </div>
                
                {selectedNotification.data && (
                  <div className="border-t border-gray-700 pt-4">
                    <h5 className="text-sm font-medium text-white mb-2">Dados Técnicos</h5>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedNotification.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                          <span className="text-white">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Prioridade:</span>
                      <span className={`ml-2 capitalize ${
                        selectedNotification.priority === 'high' ? 'text-red-400' :
                        selectedNotification.priority === 'medium' ? 'text-yellow-400' :
                        'text-gray-400'
                      }`}>
                        {selectedNotification.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Categoria:</span>
                      <span className="text-white ml-2 capitalize">{selectedNotification.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Horário:</span>
                      <span className="text-white ml-2">
                        {selectedNotification.timestamp.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 ${
                        selectedNotification.isAcknowledged ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {selectedNotification.isAcknowledged ? 'Confirmado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedNotification.actions && selectedNotification.actions.length > 0 && (
                  <div className="border-t border-gray-700 pt-4">
                    <h5 className="text-sm font-medium text-white mb-3">Ações Disponíveis</h5>
                    <div className="space-y-2">
                      {selectedNotification.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={action.action}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            action.type === 'primary' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                            action.type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' :
                            'bg-gray-700 hover:bg-gray-600 text-white'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {!selectedNotification.isAcknowledged && (
                  <div className="border-t border-gray-700 pt-4">
                    <button
                      onClick={() => acknowledgeNotification(selectedNotification.id)}
                      className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirmar Notificação</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma notificação para ver os detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartNotifications;
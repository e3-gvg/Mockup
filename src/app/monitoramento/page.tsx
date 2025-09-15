'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Bell,
  Settings,
  Wifi,
  Cpu,
  Thermometer
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useSmartModal } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge, ConnectionStatus, PerformanceGauge } from '@/components/VisualFeedback';

function MonitoramentoContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toast = useToast();
  const modal = useSmartModal();

  const monitoringData = [
    {
      title: 'Sensores Ativos',
      value: '24/26',
      trend: '92.3%',
      description: 'Sensores funcionando',
      icon: Activity,
      bgColor: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40',
      borderColor: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      trendBg: 'bg-green-500/20',
      trendColor: 'text-green-400'
    },
    {
      title: 'Conectividade',
      value: '98.7%',
      trend: 'Estável',
      description: 'Uptime da rede',
      icon: Wifi,
      bgColor: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      trendBg: 'bg-blue-500/20',
      trendColor: 'text-blue-400'
    },
    {
      title: 'CPU Sistema',
      value: '67%',
      trend: 'Normal',
      description: 'Uso do processador',
      icon: Cpu,
      bgColor: 'bg-gradient-to-br from-purple-900/40 to-violet-900/40',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      trendBg: 'bg-purple-500/20',
      trendColor: 'text-purple-400'
    },
    {
      title: 'Temperatura',
      value: '42°C',
      trend: 'Ideal',
      description: 'Temperatura média',
      icon: Thermometer,
      bgColor: 'bg-gradient-to-br from-orange-900/40 to-yellow-900/40',
      borderColor: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      trendBg: 'bg-orange-500/20',
      trendColor: 'text-orange-400'
    }
  ];

  const devicesList = [
    { id: 'SENSOR_001', name: 'Sensor Temperatura 1', status: 'online', value: '45.2°C', location: 'Linha A' },
    { id: 'SENSOR_002', name: 'Sensor Pressão 1', status: 'online', value: '2.3 bar', location: 'Linha A' },
    { id: 'SENSOR_003', name: 'Sensor Vibração 1', status: 'warning', value: '0.8 mm/s', location: 'Linha B' },
    { id: 'SENSOR_004', name: 'Sensor Umidade 1', status: 'online', value: '65%', location: 'Linha C' },
    { id: 'SENSOR_005', name: 'Sensor Corrente 1', status: 'offline', value: '--', location: 'Linha D' },
    { id: 'SENSOR_006', name: 'Sensor Velocidade 1', status: 'online', value: '1200 RPM', location: 'Linha A' }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="monitoring"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Monitoramento</h1>
                  <p className="text-gray-400">Status em tempo real dos dispositivos - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <StatusBadge status="online" label="Sistema Online" pulse />
                <ConnectionStatus isConnected={true} signalStrength={95} showDetails />
                <div className="flex items-center space-x-3">
                  <PerformanceGauge value={67} label="CPU" size="sm" />
                  <PerformanceGauge value={72} label="RAM" size="sm" />
                </div>
                <button 
                   onClick={() => toast.info('Sistema Online', 'Monitoramento ativo')}
                   className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                 >
                   <Bell className="w-5 h-5 text-gray-300" />
                 </button>
                 <button 
                   onClick={() => modal.open({
                     type: 'form',
                     size: 'lg',
                     title: 'Configurações de Monitoramento',
                     content: (
                        <div className="space-y-6">
                          <p className="text-gray-300">Configurações de monitoramento em tempo real</p>
                        </div>
                      )
                   })}
                   className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                 >
                  <Settings className="w-5 h-5 text-gray-300" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">E3</span>
                </div>
              </div>
            </div>
          </header>

          {/* Monitoring Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monitoringData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${stat.trendBg} ${stat.trendColor} font-medium`}>
                        {stat.trend}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-gray-300 text-sm font-medium">{stat.title}</h3>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Devices List */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Dispositivos Conectados</h2>
              <div className="space-y-4">
                {devicesList.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        device.status === 'online' ? 'bg-green-400' :
                        device.status === 'warning' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <div>
                        <h3 className="text-white font-medium">{device.name}</h3>
                        <p className="text-gray-400 text-sm">{device.id} - {device.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{device.value}</p>
                      <p className={`text-xs capitalize ${
                        device.status === 'online' ? 'text-green-400' :
                        device.status === 'warning' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>{device.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-time Chart Placeholder */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Gráfico em Tempo Real</h2>
              <div className="h-64 bg-gray-700/30 rounded-xl flex items-center justify-center">
                <p className="text-gray-400">Gráfico de monitoramento em tempo real</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function MonitoramentoPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <MonitoramentoContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Target,
  Zap,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider } from '@/components/NotificationToast';
import { ModalProvider } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge, PerformanceGauge } from '@/components/VisualFeedback';
import { machinesService } from '@/services/machinesService';
import { Machine } from '@/types/machine.types';

function AnalyticsContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const analyticsMetrics = [
    {
      title: 'Eficiência Geral',
      value: '87.3%',
      change: '+2.1%',
      trend: 'up',
      description: 'OEE médio do período',
      icon: Target,
      color: 'text-green-400'
    },
    {
      title: 'Tempo de Atividade',
      value: '94.7%',
      change: '+1.2%',
      trend: 'up',
      description: 'Disponibilidade média',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      title: 'Performance',
      value: '92.1%',
      change: '+0.8%',
      trend: 'up',
      description: 'Taxa de performance',
      icon: Zap,
      color: 'text-purple-400'
    },
    {
      title: 'Qualidade',
      value: '96.8%',
      change: '-0.3%',
      trend: 'down',
      description: 'Índice de qualidade',
      icon: Activity,
      color: 'text-orange-400'
    }
  ];

  const productionData = machines.map((machine, index) => ({
    machine: machine.name,
    machineId: machine.id,
    efficiency: 85 + Math.random() * 15, // Simulado: 85-100%
    production: 1000 + Math.random() * 400, // Simulado: 1000-1400 unidades
    quality: 95 + Math.random() * 5, // Simulado: 95-100%
    status: machine.status,
    location: machine.location,
    type: machine.type
  }));

  const timeRanges = [
    { value: '1h', label: '1 Hora' },
    { value: '24h', label: '24 Horas' },
    { value: '7d', label: '7 Dias' },
    { value: '30d', label: '30 Dias' },
    { value: '90d', label: '90 Dias' }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await machinesService.getMachines({ limit: 50 });
        setMachines(response.machines);
      } catch (err) {
        console.error('Erro ao buscar máquinas:', err);
        setError('Erro ao carregar dados das máquinas');
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="analytics"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
                  <p className="text-gray-400">Análise de dados e métricas de performance - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Exportar</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Atualizar</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <PerformanceGauge value={85} label="Performance" size="sm" />
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Analytics Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="text-gray-300">Carregando dados das máquinas...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                  <button 
                    onClick={() => window.location.reload()}
                    className="ml-auto px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}

            {/* Key Metrics */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {analyticsMetrics.map((metric, index) => {
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
                          <div className="p-3 rounded-xl bg-gray-700/50">
                            <Icon className={`w-6 h-6 ${metric.color}`} />
                          </div>
                          <div className={`flex items-center space-x-1 text-sm ${
                            metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${
                              metric.trend === 'down' ? 'rotate-180' : ''
                            }`} />
                            <span>{metric.change}</span>
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

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Efficiency Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Eficiência por Linha</span>
                  </h3>
                  <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                </div>
                <div className="space-y-4">
                  {productionData.map((line, index) => (
                    <div key={line.machine} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{line.machine}</span>
                        <span className="text-white font-medium">{line.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${line.efficiency}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quality Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-green-400" />
                    <span>Qualidade por Linha</span>
                  </h3>
                  <Calendar className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                </div>
                <div className="space-y-4">
                  {productionData.map((line) => (
                    <div key={line.machine} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          line.quality >= 97 ? 'bg-green-400' :
                          line.quality >= 95 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <span className="text-gray-300">{line.machine}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{line.quality}%</div>
                        <div className="text-xs text-gray-400">{line.production} unidades</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Detailed Analytics Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Análise Detalhada de Performance</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/30">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium">Linha de Produção</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Eficiência</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Produção</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Qualidade</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productionData.map((line, index) => (
                      <motion.tr
                        key={line.machine}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            <span className="text-white font-medium">{line.machine}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-white">{line.efficiency}%</span>
                            <div className="w-16 bg-gray-700/50 rounded-full h-1.5">
                              <div 
                                className="bg-blue-400 h-1.5 rounded-full"
                                style={{ width: `${line.efficiency}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{line.production.toLocaleString()} un</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            line.quality >= 97 ? 'bg-green-500/20 text-green-400' :
                            line.quality >= 95 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {line.quality}%
                          </span>
                        </td>
                        <td className="p-4">
                          <StatusBadge status="online" label="Operacional" />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
                </motion.div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <AnalyticsContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
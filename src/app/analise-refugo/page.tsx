'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  TrendingDown, 
  DollarSign, 
  Package, 

  Download,
  Calendar
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge } from '@/components/VisualFeedback';

function AnaliseRefugoContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const toast = useToast();

  const refugoMetrics = [
    {
      title: 'Taxa de Refugo',
      value: '3.2%',
      trend: '-0.5%',
      description: 'Redução este mês',
      icon: Trash2,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Custo do Refugo',
      value: 'R$ 12.450',
      trend: '-R$ 2.100',
      description: 'Economia mensal',
      icon: DollarSign,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Peças Refugadas',
      value: '1.247',
      trend: '-156',
      description: 'Redução semanal',
      icon: Package,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Eficiência',
      value: '96.8%',
      trend: '+0.5%',
      description: 'Melhoria contínua',
      icon: TrendingDown,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-green-400'
    }
  ];

  const refugoByCategory = [
    { category: 'Defeito Dimensional', percentage: 35, count: 436, color: 'bg-red-500' },
    { category: 'Defeito de Superfície', percentage: 28, count: 349, color: 'bg-orange-500' },
    { category: 'Defeito de Material', percentage: 22, count: 274, color: 'bg-yellow-500' },
    { category: 'Defeito de Montagem', percentage: 15, count: 188, color: 'bg-purple-500' }
  ];

  const machineAnalysis = [
    { machine: 'Endireitadeira Principal', refugoRate: '2.1%', parts: 1250, cost: 'R$ 2.100', defectType: 'Dimensional', status: 'normal' },
    { machine: 'Estribadeira Automática', refugoRate: '4.8%', parts: 980, cost: 'R$ 3.200', defectType: 'Superfície', status: 'attention' },
    { machine: 'Dobradeira Bi-direcional', refugoRate: '1.9%', parts: 1450, cost: 'R$ 1.800', defectType: 'Material', status: 'good' },
    { machine: 'Cortadeira Hidráulica', refugoRate: '6.2%', parts: 750, cost: 'R$ 4.100', defectType: 'Montagem', status: 'critical' },
    { machine: 'Estribadeira 3D', refugoRate: '2.8%', parts: 1100, cost: 'R$ 2.400', defectType: 'Dimensional', status: 'normal' }
  ];

  const recommendations = [
    { priority: 'high', action: 'Calibrar Máquina D4', description: 'Taxa de refugo acima de 6%', estimated: 'R$ 4.100 economia/mês' },
    { priority: 'medium', action: 'Revisar processo B2', description: 'Defeitos de superfície recorrentes', estimated: 'R$ 1.800 economia/mês' },
    { priority: 'low', action: 'Treinamento operadores', description: 'Reduzir defeitos de montagem', estimated: 'R$ 800 economia/mês' }
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="analise-refugo"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Análise de Refugo</h1>
                  <p className="text-gray-400">Análise de desperdício e qualidade - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                  </select>
                </div>
                <button 
                  onClick={() => toast.success('Relatório', 'Exportando dados de refugo...')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Exportar</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">E3</span>
                </div>
              </div>
            </div>
          </header>

          {/* Refugo Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {refugoMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${metric.bgColor} ${metric.borderColor} border backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                        <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${metric.trendBg} ${metric.trendColor} font-medium`}>
                        {metric.trend}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-gray-300 text-sm font-medium">{metric.title}</h3>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Tendência de Refugo</h2>
                <div className="h-64 bg-gray-700/30 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400">Gráfico de tendência de refugo ao longo do tempo</p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Refugo por Categoria</h2>
                <div className="space-y-4">
                  {refugoByCategory.map((item, index) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{item.category}</span>
                        <span className="text-white font-medium">{item.percentage}% ({item.count})</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Machine Analysis Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-white mb-4 lg:mb-6">Análise por Máquina</h2>
              <div className="overflow-x-auto -mx-4 lg:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 font-medium py-2 lg:py-3 px-2 lg:px-3">Máquina</th>
                      <th className="text-left text-gray-300 font-medium py-2 lg:py-3 px-2 lg:px-3">Taxa Refugo</th>
                      <th className="text-left text-gray-300 font-medium py-2 lg:py-3 px-2 lg:px-3">Peças</th>
                      <th className="text-left text-gray-300 font-medium py-2 lg:py-3 px-2 lg:px-3">Custo</th>
                      <th className="text-left text-gray-300 font-medium py-2 lg:py-3 px-2 lg:px-3">Tipo Defeito</th>
                      <th className="text-left text-gray-300 font-medium py-2 lg:py-3 px-2 lg:px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machineAnalysis.map((machine, index) => (
                      <motion.tr
                        key={machine.machine}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-2 lg:py-4 px-2 lg:px-3 text-white font-medium text-sm lg:text-base">{machine.machine}</td>
                        <td className="py-2 lg:py-4 px-2 lg:px-3 text-white text-sm lg:text-base">{machine.refugoRate}</td>
                        <td className="py-2 lg:py-4 px-2 lg:px-3 text-gray-300 text-sm lg:text-base">{machine.parts}</td>
                        <td className="py-2 lg:py-4 px-2 lg:px-3 text-gray-300 text-sm lg:text-base">{machine.cost}</td>
                        <td className="py-2 lg:py-4 px-2 lg:px-3 text-gray-300 text-sm lg:text-base">{machine.defectType}</td>
                        <td className="py-2 lg:py-4 px-2 lg:px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            machine.status === 'good' ? 'bg-green-500/20 text-green-400' :
                            machine.status === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                            machine.status === 'attention' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {machine.status === 'good' ? 'Bom' :
                             machine.status === 'normal' ? 'Normal' :
                             machine.status === 'attention' ? 'Atenção' : 'Crítico'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Ações Recomendadas</h2>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-400' :
                        rec.priority === 'medium' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} />
                      <div>
                        <h3 className="text-white font-medium">{rec.action}</h3>
                        <p className="text-gray-400 text-sm">{rec.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-medium">{rec.estimated}</p>
                      <p className="text-gray-400 text-xs">Economia estimada</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AnaliseRefugoPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <AnaliseRefugoContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
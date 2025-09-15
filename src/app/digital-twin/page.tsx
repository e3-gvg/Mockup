'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Gauge, 
  Download,
  Play,
  Pause,
  Monitor,
  Layers
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge } from '@/components/VisualFeedback';

function DigitalTwinContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [selectedTwin, setSelectedTwin] = useState('production-line-1');
  const toast = useToast();

  const twinMetrics = [
    {
      title: 'Simulações Ativas',
      value: '3',
      trend: '+1',
      description: 'Executando agora',
      icon: Cpu,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Precisão do Modelo',
      value: '97.8%',
      trend: '+2.1%',
      description: 'Melhoria contínua',
      icon: Gauge,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Cenários Testados',
      value: '156',
      trend: '+24',
      description: 'Esta semana',
      icon: Layers,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Economia Prevista',
      value: 'R$ 45.2K',
      trend: '+R$ 8.1K',
      description: 'Otimizações identificadas',
      icon: Activity,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-green-400'
    }
  ];

  const digitalTwins = [
    {
      id: 'production-line-1',
      name: 'Linha de Produção 1',
      status: 'running',
      accuracy: '98.2%',
      lastUpdate: '2 min',
      scenarios: 12,
      type: 'Produção'
    },
    {
      id: 'quality-control',
      name: 'Controle de Qualidade',
      status: 'idle',
      accuracy: '96.8%',
      lastUpdate: '15 min',
      scenarios: 8,
      type: 'Qualidade'
    },
    {
      id: 'energy-system',
      name: 'Sistema Energético',
      status: 'running',
      accuracy: '99.1%',
      lastUpdate: '1 min',
      scenarios: 15,
      type: 'Energia'
    },
    {
      id: 'maintenance-pred',
      name: 'Manutenção Preditiva',
      status: 'paused',
      accuracy: '97.5%',
      lastUpdate: '1 hora',
      scenarios: 6,
      type: 'Manutenção'
    }
  ];

  const simulationScenarios = [
    {
      name: 'Aumento de Demanda 20%',
      impact: 'Positivo',
      efficiency: '+12%',
      cost: '+R$ 2.1K',
      duration: '2h 15min',
      status: 'completed'
    },
    {
      name: 'Falha Máquina Principal',
      impact: 'Crítico',
      efficiency: '-45%',
      cost: '+R$ 15.8K',
      duration: '4h 30min',
      status: 'running'
    },
    {
      name: 'Otimização Energética',
      impact: 'Positivo',
      efficiency: '+8%',
      cost: '-R$ 3.2K',
      duration: '1h 45min',
      status: 'pending'
    },
    {
      name: 'Novo Produto Linha',
      impact: 'Neutro',
      efficiency: '+2%',
      cost: '+R$ 800',
      duration: '3h 20min',
      status: 'completed'
    }
  ];

  const realTimeData = [
    { parameter: 'Temperatura', real: '75.2°C', twin: '75.1°C', variance: '0.1%', status: 'good' },
    { parameter: 'Pressão', real: '2.8 bar', twin: '2.9 bar', variance: '3.6%', status: 'normal' },
    { parameter: 'Velocidade', real: '1250 RPM', twin: '1248 RPM', variance: '0.2%', status: 'good' },
    { parameter: 'Vibração', real: '0.8 mm/s', twin: '0.9 mm/s', variance: '12.5%', status: 'attention' },
    { parameter: 'Consumo Energia', real: '45.2 kW', twin: '44.8 kW', variance: '0.9%', status: 'good' }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulationToggle = () => {
    setSimulationRunning(!simulationRunning);
    toast.success(
      'Simulação',
      simulationRunning ? 'Simulação pausada' : 'Simulação iniciada'
    );
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900 pointer-events-none" />
      
      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="digital-twin"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Digital Twin</h1>
                  <p className="text-gray-400">Simulações e gêmeos digitais - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <select 
                    value={selectedTwin}
                    onChange={(e) => setSelectedTwin(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    {digitalTwins.map(twin => (
                      <option key={twin.id} value={twin.id}>{twin.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSimulationToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    simulationRunning 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {simulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm">{simulationRunning ? 'Pausar' : 'Iniciar'}</span>
                </button>
                <button 
                  onClick={() => toast.success('Relatório', 'Exportando dados do Digital Twin...')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Exportar</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">DT</span>
                </div>
              </div>
            </div>
          </header>

          {/* Digital Twin Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {twinMetrics.map((metric, index) => {
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

            {/* Twin Overview and Real-time Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Digital Twins List */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Gêmeos Digitais Ativos</h2>
                <div className="space-y-4">
                  {digitalTwins.map((twin, index) => (
                    <motion.div
                      key={twin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gray-700/30 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${
                        selectedTwin === twin.id ? 'ring-2 ring-blue-500/50' : ''
                      }`}
                      onClick={() => setSelectedTwin(twin.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{twin.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          twin.status === 'running' ? 'bg-green-500/20 text-green-400' :
                          twin.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {twin.status === 'running' ? 'Executando' :
                           twin.status === 'idle' ? 'Inativo' : 'Pausado'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Precisão</p>
                          <p className="text-white font-medium">{twin.accuracy}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Última Atualização</p>
                          <p className="text-white font-medium">{twin.lastUpdate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Cenários</p>
                          <p className="text-white font-medium">{twin.scenarios}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Tipo</p>
                          <p className="text-white font-medium">{twin.type}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Real-time vs Twin Comparison */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Comparação Real vs Digital</h2>
                <div className="space-y-4">
                  {realTimeData.map((data, index) => (
                    <motion.div
                      key={data.parameter}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/30 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{data.parameter}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          data.status === 'good' ? 'bg-green-500/20 text-green-400' :
                          data.status === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {data.variance}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Real</p>
                          <p className="text-white font-medium">{data.real}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Digital Twin</p>
                          <p className="text-white font-medium">{data.twin}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulation Scenarios */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Cenários de Simulação</h2>
                <button 
                  onClick={() => toast.success('Novo Cenário', 'Configurar novo cenário de simulação')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                >
                  Novo Cenário
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 font-medium py-3">Cenário</th>
                      <th className="text-left text-gray-300 font-medium py-3">Impacto</th>
                      <th className="text-left text-gray-300 font-medium py-3">Eficiência</th>
                      <th className="text-left text-gray-300 font-medium py-3">Custo</th>
                      <th className="text-left text-gray-300 font-medium py-3">Duração</th>
                      <th className="text-left text-gray-300 font-medium py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationScenarios.map((scenario, index) => (
                      <motion.tr
                        key={scenario.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-4 text-white font-medium">{scenario.name}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            scenario.impact === 'Positivo' ? 'bg-green-500/20 text-green-400' :
                            scenario.impact === 'Crítico' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {scenario.impact}
                          </span>
                        </td>
                        <td className="py-4 text-white">{scenario.efficiency}</td>
                        <td className="py-4 text-gray-300">{scenario.cost}</td>
                        <td className="py-4 text-gray-300">{scenario.duration}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            scenario.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            scenario.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {scenario.status === 'completed' ? 'Concluído' :
                             scenario.status === 'running' ? 'Executando' : 'Pendente'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3D Visualization Placeholder */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Visualização 3D do Gêmeo Digital</h2>
              <div className="h-96 bg-gray-700/30 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Modelo 3D Interativo</p>
                  <p className="text-gray-500 text-sm">Visualização em tempo real do gêmeo digital selecionado</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DigitalTwinPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <DigitalTwinContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
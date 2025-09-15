'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Settings, 
  Zap,
  Gauge, 
  Filter, 
  Download, 
  RefreshCw,
  Battery,
  Fan,
  Cog
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

interface Component {
  id: string;
  name: string;
  type: 'motor' | 'bearing' | 'belt' | 'sensor' | 'valve' | 'pump' | 'filter' | 'battery';
  machineId: string;
  machineName: string;
  location: string;
  installDate: Date;
  expectedLifespan: number; // em horas
  currentUsage: number; // em horas
  healthScore: number; // 0-100
  status: 'healthy' | 'warning' | 'critical' | 'maintenance_required';
  lastMaintenance: Date;
  nextMaintenance: Date;
  maintenanceType: 'preventive' | 'corrective' | 'predictive';
  cost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  predictions: ComponentPrediction[];
  metrics: ComponentMetrics;
}

interface ComponentPrediction {
  date: Date;
  failureProbability: number;
  remainingLife: number; // em dias
  confidence: number;
  factors: string[];
  algorithm: 'ml_regression' | 'neural_network' | 'time_series' | 'ensemble' | 'deep_learning_cnn' | 'arima_prophet_ensemble' | 'gradient_boosting_xgb' | 'lstm_neural_network';
  dataPoints: number;
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'degrading';
  criticalThreshold: number;
  recommendations: string[];
}

interface ComponentMetrics {
  temperature: number[];
  vibration: number[];
  current: number[];
  efficiency: number[];
  timestamps: string[];
}

interface MaintenanceTask {
  id: string;
  componentId: string;
  componentName: string;
  machineId: string;
  machineName: string;
  type: 'inspection' | 'replacement' | 'repair' | 'calibration' | 'cleaning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: Date;
  estimatedDuration: number; // em horas
  assignedTo: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  description: string;
  requiredParts: string[];
  estimatedCost: number;
}

const PredictiveMaintenance: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('health');
  const [timeRange, setTimeRange] = useState<string>('7d');

  useEffect(() => {
    // Simular dados de componentes
    const mockComponents: Component[] = [
      {
        id: 'COMP-001',
        name: 'Motor Principal',
        type: 'motor',
        machineId: 'M001',
        machineName: 'Endireitadeira Principal',
        location: 'Setor A - Linha 1',
        installDate: new Date('2023-01-15'),
        expectedLifespan: 8760, // 1 ano
        currentUsage: 6205, // ~8.5 meses
        healthScore: 72,
        status: 'warning',
        lastMaintenance: new Date('2024-10-15'),
        nextMaintenance: new Date('2024-12-15'),
        maintenanceType: 'predictive',
        cost: 15000,
        priority: 'high',
        predictions: [
          {
            date: new Date(),
            failureProbability: 28,
            remainingLife: 45,
            confidence: 85,
            factors: ['Temperatura elevada', 'Vibração anômala', 'Desgaste dos rolamentos'],
            algorithm: 'lstm_neural_network',
            dataPoints: 25680, // 8 meses de dados históricos
            lastUpdated: new Date(),
            trend: 'degrading',
            criticalThreshold: 85,
            recommendations: [
              'Substituir rolamentos principais em 15 dias (confiança: 94%)',
              'Implementar lubrificação automática inteligente',
              'Instalar sensores de vibração adicionais nos eixos Y e Z',
              'Agendar inspeção termográfica em 7 dias'
            ]
          }
        ],
        metrics: {
          temperature: [65, 67, 69, 71, 68, 70, 72, 74, 73, 71],
          vibration: [2.1, 2.3, 2.5, 2.8, 2.6, 2.9, 3.1, 3.3, 3.0, 2.8],
          current: [12.5, 12.8, 13.1, 13.5, 13.2, 13.8, 14.1, 14.3, 14.0, 13.6],
          efficiency: [92, 91, 90, 88, 89, 87, 85, 84, 86, 87],
          timestamps: ['00:00', '02:24', '04:48', '07:12', '09:36', '12:00', '14:24', '16:48', '19:12', '21:36']
        }
      },
      {
        id: 'COMP-002',
        name: 'Rolamento Traseiro',
        type: 'bearing',
        machineId: 'M001',
        machineName: 'Endireitadeira Principal',
        location: 'Setor A - Linha 1',
        installDate: new Date('2023-06-10'),
        expectedLifespan: 4380, // 6 meses
        currentUsage: 3850,
        healthScore: 45,
        status: 'critical',
        lastMaintenance: new Date('2024-09-10'),
        nextMaintenance: new Date('2024-11-25'),
        maintenanceType: 'corrective',
        cost: 2500,
        priority: 'critical',
        predictions: [
          {
            date: new Date(),
            failureProbability: 78,
            remainingLife: 12,
            confidence: 92,
            factors: ['Desgaste excessivo', 'Lubrificação inadequada', 'Sobrecarga'],
            algorithm: 'deep_learning_cnn',
            dataPoints: 18240, // 2 anos de dados históricos
            lastUpdated: new Date(),
            trend: 'degrading',
            criticalThreshold: 60,
            recommendations: [
              'CRÍTICO: Falha iminente detectada - parar operação em 24h',
              'Substituição emergencial necessária (probabilidade 98%)',
              'Implementar monitoramento contínuo de temperatura',
              'Revisar protocolo de lubrificação preventiva'
            ]
          }
        ],
        metrics: {
          temperature: [45, 47, 49, 52, 54, 56, 58, 61, 59, 57],
          vibration: [4.2, 4.5, 4.8, 5.1, 5.3, 5.6, 5.9, 6.2, 6.0, 5.8],
          current: [8.5, 8.7, 8.9, 9.2, 9.4, 9.6, 9.8, 10.1, 9.9, 9.7],
          efficiency: [78, 76, 74, 71, 69, 67, 64, 62, 65, 67],
          timestamps: ['00:00', '02:24', '04:48', '07:12', '09:36', '12:00', '14:24', '16:48', '19:12', '21:36']
        }
      },
      {
        id: 'COMP-003',
        name: 'Correia Transportadora',
        type: 'belt',
        machineId: 'M002',
        machineName: 'Estribadeira Automática',
        location: 'Setor B - Linha 2',
        installDate: new Date('2024-03-01'),
        expectedLifespan: 2190, // 3 meses
        currentUsage: 1850,
        healthScore: 88,
        status: 'healthy',
        lastMaintenance: new Date('2024-10-01'),
        nextMaintenance: new Date('2024-12-01'),
        maintenanceType: 'preventive',
        cost: 800,
        priority: 'low',
        predictions: [
          {
            date: new Date(),
            failureProbability: 15,
            remainingLife: 85,
            confidence: 78,
            factors: ['Desgaste normal', 'Tensão adequada'],
            algorithm: 'arima_prophet_ensemble',
            dataPoints: 12960, // 18 meses de dados históricos
            lastUpdated: new Date(),
            trend: 'stable',
            criticalThreshold: 40,
            recommendations: [
              'Manter cronograma otimizado de manutenção preventiva',
              'Implementar sensores IoT para monitoramento de tensão',
              'Aplicar algoritmo de detecção de anomalias em tempo real'
            ]
          }
        ],
        metrics: {
          temperature: [35, 36, 37, 38, 37, 36, 35, 36, 37, 36],
          vibration: [1.2, 1.3, 1.1, 1.4, 1.2, 1.3, 1.1, 1.2, 1.3, 1.2],
          current: [5.2, 5.3, 5.1, 5.4, 5.2, 5.3, 5.1, 5.2, 5.3, 5.2],
          efficiency: [95, 94, 96, 93, 95, 94, 96, 95, 94, 95],
          timestamps: ['00:00', '02:24', '04:48', '07:12', '09:36', '12:00', '14:24', '16:48', '19:12', '21:36']
        }
      },
      {
        id: 'COMP-004',
        name: 'Sensor de Temperatura',
        type: 'sensor',
        machineId: 'M003',
        machineName: 'Dobradeira Bi-direcional',
        location: 'Setor C - Linha 3',
        installDate: new Date('2023-08-20'),
        expectedLifespan: 17520, // 2 anos
        currentUsage: 8760, // 1 ano
        healthScore: 92,
        status: 'healthy',
        lastMaintenance: new Date('2024-08-20'),
        nextMaintenance: new Date('2025-02-20'),
        maintenanceType: 'preventive',
        cost: 350,
        priority: 'medium',
        predictions: [
          {
            date: new Date(),
            failureProbability: 8,
            remainingLife: 365,
            confidence: 88,
            factors: ['Funcionamento normal', 'Calibração em dia'],
            algorithm: 'gradient_boosting_xgb',
            dataPoints: 21600, // 2.5 anos de dados históricos
            lastUpdated: new Date(),
            trend: 'stable',
            criticalThreshold: 25,
            recommendations: [
              'Calibração automática baseada em ML implementada',
              'Monitoramento preditivo de drift de calibração',
              'Sistema de auto-diagnóstico de conexões ativado'
            ]
          }
        ],
        metrics: {
          temperature: [22, 23, 22, 24, 23, 22, 23, 24, 23, 22],
          vibration: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
          current: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
          efficiency: [98, 99, 98, 97, 98, 99, 98, 97, 98, 99],
          timestamps: ['00:00', '02:24', '04:48', '07:12', '09:36', '12:00', '14:24', '16:48', '19:12', '21:36']
        }
      }
    ];

    const mockTasks: MaintenanceTask[] = [
      {
        id: 'TASK-001',
        componentId: 'COMP-002',
        componentName: 'Rolamento Traseiro',
        machineId: 'M001',
        machineName: 'Endireitadeira Principal',
        type: 'replacement',
        priority: 'critical',
        scheduledDate: new Date('2024-11-25'),
        estimatedDuration: 4,
        assignedTo: 'João Silva',
        status: 'scheduled',
        description: 'Substituição do rolamento traseiro devido ao desgaste crítico',
        requiredParts: ['Rolamento SKF 6308', 'Graxa industrial', 'Vedação'],
        estimatedCost: 2500
      },
      {
        id: 'TASK-002',
        componentId: 'COMP-001',
        componentName: 'Motor Principal',
        machineId: 'M001',
        machineName: 'Endireitadeira Principal',
        type: 'inspection',
        priority: 'high',
        scheduledDate: new Date('2024-12-15'),
        estimatedDuration: 2,
        assignedTo: 'Maria Santos',
        status: 'scheduled',
        description: 'Inspeção preventiva do motor principal',
        requiredParts: [],
        estimatedCost: 0
      },
      {
        id: 'TASK-003',
        componentId: 'COMP-003',
        componentName: 'Correia Transportadora',
        machineId: 'M002',
        machineName: 'Estribadeira Automática',
        type: 'inspection',
        priority: 'medium',
        scheduledDate: new Date('2024-12-01'),
        estimatedDuration: 1,
        assignedTo: 'Carlos Oliveira',
        status: 'scheduled',
        description: 'Inspeção da tensão e desgaste da correia',
        requiredParts: [],
        estimatedCost: 0
      }
    ];

    setComponents(mockComponents);
    setMaintenanceTasks(mockTasks);
  }, []);

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'motor': return <Zap className="w-5 h-5" />;
      case 'bearing': return <Cog className="w-5 h-5" />;
      case 'belt': return <Activity className="w-5 h-5" />;
      case 'sensor': return <Gauge className="w-5 h-5" />;
      case 'valve': return <Settings className="w-5 h-5" />;
      case 'pump': return <Fan className="w-5 h-5" />;
      case 'filter': return <Filter className="w-5 h-5" />;
      case 'battery': return <Battery className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'maintenance_required': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredComponents = components.filter(comp => {
    if (filter === 'all') return true;
    if (filter === 'critical') return comp.status === 'critical' || comp.status === 'maintenance_required';
    if (filter === 'warning') return comp.status === 'warning';
    if (filter === 'healthy') return comp.status === 'healthy';
    return comp.type === filter;
  });

  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (sortBy) {
      case 'health': return a.healthScore - b.healthScore;
      case 'usage': return (b.currentUsage / b.expectedLifespan) - (a.currentUsage / a.expectedLifespan);
      case 'maintenance': return new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime();
      case 'priority': 
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default: return 0;
    }
  });

  const getUsagePercentage = (component: Component) => {
    return Math.round((component.currentUsage / component.expectedLifespan) * 100);
  };

  const getRemainingDays = (component: Component) => {
    const usageRate = component.currentUsage / ((new Date().getTime() - component.installDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingHours = component.expectedLifespan - component.currentUsage;
    return Math.round(remainingHours / (usageRate * 24));
  };

  const pieData = [
    { name: 'Saudável', value: components.filter(c => c.status === 'healthy').length, color: '#10B981' },
    { name: 'Atenção', value: components.filter(c => c.status === 'warning').length, color: '#F59E0B' },
    { name: 'Crítico', value: components.filter(c => c.status === 'critical').length, color: '#EF4444' },
    { name: 'Manutenção', value: components.filter(c => c.status === 'maintenance_required').length, color: '#F97316' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Wrench className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Manutenção Preditiva</h2>
            <p className="text-gray-400">Monitoramento inteligente de componentes e vida útil</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Relatório</span>
          </button>
          
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
                <span className="text-2xl font-bold text-gray-400">{components.length}</span>
          </div>
          <h3 className="text-white font-semibold mb-2">Total de Componentes</h3>
          <p className="text-gray-400 text-sm">Monitorados por IA em tempo real</p>
          <div className="mt-3 text-xs text-gray-300">
                <span className="bg-gray-500/20 px-2 py-1 rounded">IoT + ML</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-red-400">
              {components.filter(c => c.status === 'critical' || c.status === 'maintenance_required').length}
            </span>
          </div>
          <h3 className="text-white font-semibold mb-2">Alertas Críticos</h3>
          <p className="text-gray-400 text-sm">Componentes com alta probabilidade de falha</p>
          <div className="mt-3 text-xs text-red-300">
            <span className="bg-red-500/20 px-2 py-1 rounded">IA: 98% confiança</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{maintenanceTasks.filter(t => t.status === 'scheduled').length}</span>
          </div>
          <h3 className="text-white font-semibold mb-2">Manutenções Agendadas</h3>
          <p className="text-gray-400 text-sm">Próximas intervenções preventivas</p>
          <div className="mt-3 text-xs text-yellow-300">
            <span className="bg-yellow-500/20 px-2 py-1 rounded">Otimizado por ML</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-green-400">96.8%</span>
          </div>
          <h3 className="text-white font-semibold mb-2">Precisão dos Modelos</h3>
          <p className="text-gray-400 text-sm">Acurácia média dos algoritmos de IA</p>
          <div className="mt-3 text-xs text-green-300">
            <span className="bg-green-500/20 px-2 py-1 rounded">Deep Learning</span>
          </div>
        </motion.div>
      </div>

      {/* Seção de Performance dos Modelos de IA */}
      <motion.div 
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-gray-400" />
            Performance dos Modelos de IA
          </h3>
          <div className="text-sm text-gray-400">
            Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Algoritmos Ativos</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">LSTM Neural Network</span>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">97.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Deep Learning CNN</span>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">96.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">XGBoost Ensemble</span>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">95.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">ARIMA-Prophet</span>
                <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">92.1%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Dados de Treinamento</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Total de Pontos:</span>
                <span className="text-xs text-white">78.32k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Período Histórico:</span>
                <span className="text-xs text-white">2.5 anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Frequência:</span>
                <span className="text-xs text-white">1 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Qualidade:</span>
                <span className="text-xs text-green-400">99.7%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Métricas de Predição</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Falsos Positivos:</span>
                <span className="text-xs text-green-400">2.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Falsos Negativos:</span>
                <span className="text-xs text-green-400">1.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Tempo de Antecipação:</span>
                <span className="text-xs text-white">15-30 dias</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Economia Estimada:</span>
                <span className="text-xs text-green-400">R$ 2.4M/ano</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'critical', label: 'Críticos' },
              { key: 'warning', label: 'Atenção' },
              { key: 'healthy', label: 'Saudáveis' },
              { key: 'motor', label: 'Motores' },
              { key: 'bearing', label: 'Rolamentos' },
              { key: 'belt', label: 'Correias' },
              { key: 'sensor', label: 'Sensores' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filter === key
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="1d">Último Dia</option>
              <option value="7d">Última Semana</option>
              <option value="30d">Último Mês</option>
              <option value="90d">Últimos 3 Meses</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="health">Saúde</option>
              <option value="usage">Uso</option>
              <option value="maintenance">Próxima Manutenção</option>
              <option value="priority">Prioridade</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Components List */}
        <div className="lg:col-span-2 space-y-4">
          {sortedComponents.map((component) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                selectedComponent?.id === component.id
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70'
              }`}
              onClick={() => setSelectedComponent(component)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    {getComponentIcon(component.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{component.name}</h4>
                    <p className="text-sm text-gray-400">{component.machineName}</p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(component.status)}`}>
                  {component.status === 'healthy' ? 'Saudável' :
                   component.status === 'warning' ? 'Atenção' :
                   component.status === 'critical' ? 'Crítico' : 'Manutenção'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Saúde</p>
                  <p className={`text-lg font-bold ${getHealthScoreColor(component.healthScore)}`}>
                    {component.healthScore}%
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">Uso</p>
                  <p className="text-lg font-bold text-white">
                    {getUsagePercentage(component)}%
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">Vida Restante</p>
                  <p className="text-lg font-bold text-white">
                    {getRemainingDays(component)}d
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400">Próxima Manutenção</p>
                  <p className="text-sm text-white">
                    {component.nextMaintenance.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              {/* Usage Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Uso: {component.currentUsage.toLocaleString()}h</span>
                  <span>Limite: {component.expectedLifespan.toLocaleString()}h</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      getUsagePercentage(component) > 80 ? 'bg-red-500' :
                      getUsagePercentage(component) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(getUsagePercentage(component), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Health Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Saúde do Componente</span>
                  <span>{component.healthScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getHealthScoreColor(component.healthScore).replace('text-', 'bg-')}`}
                    style={{ width: `${component.healthScore}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Component Details & Charts */}
        <div className="space-y-6">
          {/* Status Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Details */}
          {selectedComponent && (
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detalhes do Componente</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">{selectedComponent.name}</h4>
                  <p className="text-sm text-gray-400">{selectedComponent.machineName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Tipo:</span>
                    <span className="text-white ml-2 capitalize">{selectedComponent.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Instalação:</span>
                    <span className="text-white ml-2">
                      {selectedComponent.installDate.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Custo:</span>
                    <span className="text-white ml-2">R$ {selectedComponent.cost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Prioridade:</span>
                    <span className={`ml-2 capitalize ${
                      selectedComponent.priority === 'critical' ? 'text-red-400' :
                      selectedComponent.priority === 'high' ? 'text-orange-400' :
                      selectedComponent.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      {selectedComponent.priority}
                    </span>
                  </div>
                </div>
                
                {selectedComponent.predictions.length > 0 && (
                  <div className="border-t border-gray-700 pt-4 space-y-4">
                    {/* Predição Principal */}
                    <div>
                      <h5 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        Análise Preditiva com IA
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Probabilidade:</span>
                          <span className={`font-medium ${
                            selectedComponent.predictions[0].failureProbability > 70 ? 'text-red-400' :
                            selectedComponent.predictions[0].failureProbability > 40 ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {selectedComponent.predictions[0].failureProbability}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vida Restante:</span>
                          <span className="text-white font-medium">
                            {selectedComponent.predictions[0].remainingLife} dias
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confiança:</span>
                          <span className="text-green-400 font-medium">
                            {selectedComponent.predictions[0].confidence}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tendência:</span>
                          <span className={`font-medium capitalize flex items-center gap-1 ${
                            selectedComponent.predictions[0].trend === 'degrading' ? 'text-red-400' :
                            selectedComponent.predictions[0].trend === 'stable' ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {selectedComponent.predictions[0].trend === 'degrading' ? <TrendingDown className="w-3 h-3" /> :
                             selectedComponent.predictions[0].trend === 'stable' ? <Activity className="w-3 h-3" /> :
                             <TrendingUp className="w-3 h-3" />}
                            {selectedComponent.predictions[0].trend}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Algoritmo e Dados */}
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <h6 className="text-xs font-medium text-gray-300 mb-2">Modelo de IA</h6>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400">Algoritmo:</span>
                          <span className="text-gray-400 ml-2 capitalize">
                            {selectedComponent.predictions[0].algorithm.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Pontos de Dados:</span>
                          <span className="text-white ml-2">
                            {selectedComponent.predictions[0].dataPoints.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Última Atualização:</span>
                          <span className="text-white ml-2">
                            {selectedComponent.predictions[0].lastUpdated.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Limite Crítico:</span>
                          <span className="text-red-400 ml-2">
                            {selectedComponent.predictions[0].criticalThreshold}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fatores de Risco */}
                    <div>
                      <p className="text-xs font-medium text-gray-300 mb-2">Fatores de Risco Identificados:</p>
                      <div className="space-y-1">
                        {selectedComponent.predictions[0].factors.map((factor, index) => (
                          <div key={index} className="text-xs text-yellow-400 flex items-center space-x-2 bg-yellow-500/10 rounded px-2 py-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recomendações da IA */}
                    <div>
                      <p className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-gray-400" />
                        Recomendações Inteligentes:
                      </p>
                      <div className="space-y-1">
                        {selectedComponent.predictions[0].recommendations.map((recommendation, index) => (
                          <div key={index} className="text-xs text-gray-400 flex items-start space-x-2 bg-gray-500/10 rounded px-2 py-1">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Maintenance */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Próximas Manutenções</h3>
            <div className="space-y-3">
              {maintenanceTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-white">{task.componentName}</h5>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{task.machineName}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {task.scheduledDate.toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-white">{task.estimatedDuration}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Chart */}
      {selectedComponent && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Métricas do Componente - {selectedComponent.name}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Temperatura (°C)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedComponent.metrics.timestamps.map((time, index) => ({
                    time,
                    value: selectedComponent.metrics.temperature[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Vibração (mm/s)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedComponent.metrics.timestamps.map((time, index) => ({
                    time,
                    value: selectedComponent.metrics.vibration[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Corrente (A)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedComponent.metrics.timestamps.map((time, index) => ({
                    time,
                    value: selectedComponent.metrics.current[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#6B7280" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Eficiência (%)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedComponent.metrics.timestamps.map((time, index) => ({
                    time,
                    value: selectedComponent.metrics.efficiency[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveMaintenance;
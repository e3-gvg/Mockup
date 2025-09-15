'use client';

import React, { useState, useEffect } from 'react';

import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  Factory, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Layers,
  Lightbulb,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Machine {
  id: string;
  name: string;
  model: string;
  type: string;
  location: string;
  installDate: Date;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  shift: 'morning' | 'afternoon' | 'night';
  operator: string;
  kpis: MachineKPIs;
}

interface MachineKPIs {
  oee: number; // Overall Equipment Effectiveness
  availability: number;
  performance: number;
  quality: number;
  throughput: number; // peças/hora
  energyEfficiency: number; // kWh/peça
  cycleTime: number; // segundos
  defectRate: number; // %
  downtime: number; // minutos/dia
  mtbf: number; // Mean Time Between Failures (horas)
  mttr: number; // Mean Time To Repair (horas)
  utilizationRate: number; // %
  productionCost: number; // R$/peça
  maintenanceCost: number; // R$/mês
}

interface KPIComparison {
  kpiName: string;
  unit: string;
  values: { machineId: string; machineName: string; value: number; trend: 'up' | 'down' | 'stable'; }[];
  benchmark: number;
  target: number;
  category: 'efficiency' | 'quality' | 'cost' | 'maintenance';
}

interface BenchmarkData {
  industry: string;
  worldClass: number;
  average: number;
  belowAverage: number;
}

interface ImprovementRecommendation {
  id: string;
  machineId: string;
  machineName: string;
  category: 'efficiency' | 'quality' | 'cost' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  roi: number;
  timeframe: string;
}

interface FleetAnalytics {
  totalMachines: number;
  averageOEE: number;
  bestPerformer: string;
  worstPerformer: string;
  improvementOpportunities: string[];
  costSavingsPotential: number;
  benchmarkComparisons: KPIComparison[];
  recommendations: ImprovementRecommendation[];
  industryBenchmarks: Record<string, BenchmarkData>;
  performanceMatrix: {
    highPerformance: string[];
    mediumPerformance: string[];
    lowPerformance: string[];
  };
}

const FleetKPIComparison: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<string>('oee');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<string>('current');
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [fleetAnalytics, setFleetAnalytics] = useState<FleetAnalytics | null>(null);

  useEffect(() => {
    // Simular dados de máquinas
    const mockMachines: Machine[] = [
      {
        id: 'M001',
        name: 'Linha de Produção A',
        model: 'HAAS VF-2',
        type: 'CNC Mill',
        location: 'Setor A - Linha 1',
        installDate: new Date('2022-03-15'),
        status: 'running',
        shift: 'morning',
        operator: 'João Silva',
        kpis: {
          oee: 78.5,
          availability: 92.3,
          performance: 85.1,
          quality: 94.2,
          throughput: 145,
          energyEfficiency: 2.3,
          cycleTime: 24.8,
          defectRate: 5.8,
          downtime: 45,
          mtbf: 168,
          mttr: 2.5,
          utilizationRate: 87.2,
          productionCost: 12.50,
          maintenanceCost: 3200
        }
      },
      {
        id: 'M002',
        name: 'Linha de Produção B',
        model: 'HAAS VF-2',
        type: 'CNC Mill',
        location: 'Setor B - Linha 2',
        installDate: new Date('2022-03-20'),
        status: 'running',
        shift: 'afternoon',
        operator: 'Maria Santos',
        kpis: {
          oee: 82.1,
          availability: 94.7,
          performance: 88.3,
          quality: 96.1,
          throughput: 158,
          energyEfficiency: 2.1,
          cycleTime: 22.9,
          defectRate: 3.9,
          downtime: 32,
          mtbf: 192,
          mttr: 2.1,
          utilizationRate: 91.5,
          productionCost: 11.80,
          maintenanceCost: 2850
        }
      },
      {
        id: 'M003',
        name: 'Linha de Produção C',
        model: 'HAAS VF-3',
        type: 'CNC Mill',
        location: 'Setor C - Linha 3',
        installDate: new Date('2021-11-10'),
        status: 'maintenance',
        shift: 'night',
        operator: 'Carlos Oliveira',
        kpis: {
          oee: 71.2,
          availability: 88.1,
          performance: 81.7,
          quality: 92.4,
          throughput: 132,
          energyEfficiency: 2.6,
          cycleTime: 27.3,
          defectRate: 7.6,
          downtime: 68,
          mtbf: 144,
          mttr: 3.2,
          utilizationRate: 82.3,
          productionCost: 13.90,
          maintenanceCost: 4100
        }
      },
      {
        id: 'M004',
        name: 'Linha de Produção D',
        model: 'MAZAK VTC-200',
        type: 'CNC Mill',
        location: 'Setor D - Linha 4',
        installDate: new Date('2023-01-08'),
        status: 'running',
        shift: 'morning',
        operator: 'Ana Costa',
        kpis: {
          oee: 85.3,
          availability: 96.2,
          performance: 89.7,
          quality: 97.8,
          throughput: 172,
          energyEfficiency: 1.9,
          cycleTime: 20.9,
          defectRate: 2.2,
          downtime: 22,
          mtbf: 216,
          mttr: 1.8,
          utilizationRate: 94.1,
          productionCost: 10.90,
          maintenanceCost: 2400
        }
      },
      {
        id: 'M005',
        name: 'Linha de Produção E',
        model: 'MAZAK VTC-200',
        type: 'CNC Mill',
        location: 'Setor E - Linha 5',
        installDate: new Date('2023-02-15'),
        status: 'idle',
        shift: 'afternoon',
        operator: 'Pedro Alves',
        kpis: {
          oee: 79.8,
          availability: 91.5,
          performance: 86.4,
          quality: 95.3,
          throughput: 149,
          energyEfficiency: 2.0,
          cycleTime: 24.1,
          defectRate: 4.7,
          downtime: 51,
          mtbf: 178,
          mttr: 2.3,
          utilizationRate: 88.7,
          productionCost: 11.60,
          maintenanceCost: 2750
        }
      },
      {
        id: 'M006',
        name: 'Linha de Produção F',
        model: 'DMG MORI NHX4000',
        type: 'CNC Mill',
        location: 'Setor F - Linha 6',
        installDate: new Date('2023-06-20'),
        status: 'running',
        shift: 'night',
        operator: 'Luiz Fernando',
        kpis: {
          oee: 88.7,
          availability: 97.1,
          performance: 92.3,
          quality: 98.5,
          throughput: 185,
          energyEfficiency: 1.7,
          cycleTime: 19.4,
          defectRate: 1.5,
          downtime: 17,
          mtbf: 248,
          mttr: 1.5,
          utilizationRate: 96.8,
          productionCost: 9.80,
          maintenanceCost: 2100
        }
      }
    ];

    const analytics: FleetAnalytics = {
      totalMachines: mockMachines.length,
      averageOEE: mockMachines.reduce((sum, m) => sum + m.kpis.oee, 0) / mockMachines.length,
      bestPerformer: mockMachines.reduce((best, current) => 
        current.kpis.oee > best.kpis.oee ? current : best
      ).name,
      worstPerformer: mockMachines.reduce((worst, current) => 
        current.kpis.oee < worst.kpis.oee ? current : worst
      ).name,
      improvementOpportunities: [
        'Reduzir tempo de setup na Linha C',
        'Otimizar manutenção preventiva na Linha A',
        'Melhorar treinamento de operadores',
        'Implementar automação adicional'
      ],
      costSavingsPotential: 125000,
      benchmarkComparisons: [],
      recommendations: [
        {
          id: '1',
          machineId: 'M003',
          machineName: 'Dobradeira Bi-direcional',
          category: 'efficiency',
          priority: 'high',
          title: 'Otimização de Setup',
          description: 'Implementar SMED (Single Minute Exchange of Die) para reduzir tempo de setup em 40%',
          potentialSavings: 25000,
          implementationCost: 15000,
          roi: 167,
          timeframe: '2-3 meses'
        },
        {
          id: '2',
          machineId: 'M001',
          machineName: 'Endireitadeira Principal',
          category: 'maintenance',
          priority: 'medium',
          title: 'Manutenção Preditiva',
          description: 'Instalar sensores de vibração para detectar falhas antes que ocorram',
          potentialSavings: 18000,
          implementationCost: 12000,
          roi: 150,
          timeframe: '1-2 meses'
        },
        {
          id: '3',
          machineId: 'M005',
          machineName: 'Estribadeira 3D',
          category: 'efficiency',
          priority: 'medium',
          title: 'Treinamento de Operadores',
          description: 'Programa de capacitação para reduzir micro-paradas e melhorar eficiência',
          potentialSavings: 12000,
          implementationCost: 8000,
          roi: 150,
          timeframe: '3-4 semanas'
        },
        {
          id: '4',
          machineId: 'M002',
          machineName: 'Estribadeira Automática',
          category: 'quality',
          priority: 'high',
          title: 'Automação de Qualidade',
          description: 'Sistema de inspeção automática para reduzir defeitos em 60%',
          potentialSavings: 30000,
          implementationCost: 22000,
          roi: 136,
          timeframe: '4-6 meses'
        }
      ],
      industryBenchmarks: {
        oee: {
          industry: 'Manufatura',
          worldClass: 95,
          average: 85,
          belowAverage: 70
        },
        availability: {
          industry: 'Manufatura',
          worldClass: 98,
          average: 90,
          belowAverage: 80
        },
        performance: {
          industry: 'Manufatura',
          worldClass: 97,
          average: 88,
          belowAverage: 75
        },
        quality: {
          industry: 'Manufatura',
          worldClass: 99,
          average: 95,
          belowAverage: 85
        }
      },
      performanceMatrix: {
        highPerformance: ['M004', 'M006'],
        mediumPerformance: ['M002', 'M005'],
        lowPerformance: ['M001', 'M003']
      }
    };

    setMachines(mockMachines);
    setFleetAnalytics(analytics);
    setSelectedMachines(mockMachines.slice(0, 4).map(m => m.id));
  }, []);

  const kpiDefinitions = {
    oee: { name: 'OEE', unit: '%', category: 'efficiency', target: 85, benchmark: 80 },
    availability: { name: 'Disponibilidade', unit: '%', category: 'efficiency', target: 95, benchmark: 90 },
    performance: { name: 'Performance', unit: '%', category: 'efficiency', target: 90, benchmark: 85 },
    quality: { name: 'Qualidade', unit: '%', category: 'quality', target: 98, benchmark: 95 },
    throughput: { name: 'Throughput', unit: 'peças/h', category: 'efficiency', target: 180, benchmark: 150 },
    energyEfficiency: { name: 'Eficiência Energética', unit: 'kWh/peça', category: 'cost', target: 1.8, benchmark: 2.2 },
    cycleTime: { name: 'Tempo de Ciclo', unit: 's', category: 'efficiency', target: 20, benchmark: 25 },
    defectRate: { name: 'Taxa de Defeitos', unit: '%', category: 'quality', target: 2, benchmark: 5 },
    downtime: { name: 'Tempo de Parada', unit: 'min/dia', category: 'efficiency', target: 20, benchmark: 40 },
    mtbf: { name: 'MTBF', unit: 'horas', category: 'maintenance', target: 200, benchmark: 150 },
    mttr: { name: 'MTTR', unit: 'horas', category: 'maintenance', target: 2, benchmark: 3 },
    utilizationRate: { name: 'Taxa de Utilização', unit: '%', category: 'efficiency', target: 95, benchmark: 85 },
    productionCost: { name: 'Custo de Produção', unit: 'R$/peça', category: 'cost', target: 10, benchmark: 13 },
    maintenanceCost: { name: 'Custo de Manutenção', unit: 'R$/mês', category: 'cost', target: 2000, benchmark: 3500 }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-500/20';
      case 'idle': return 'text-yellow-400 bg-yellow-500/20';
      case 'maintenance': return 'text-orange-400 bg-orange-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running': return 'Operando';
      case 'idle': return 'Parada';
      case 'maintenance': return 'Manutenção';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  const getTrendIcon = (current: number, target: number, isInverted = false) => {
    const isGood = isInverted ? current < target : current > target;
    if (Math.abs(current - target) < target * 0.05) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
    return isGood ? 
      <ArrowUpRight className="w-4 h-4 text-green-400" /> : 
      <ArrowDownRight className="w-4 h-4 text-red-400" />;
  };

  const getPerformanceColor = (current: number, target: number, isInverted = false) => {
    const isGood = isInverted ? current < target : current > target;
    const diff = Math.abs(current - target) / target;
    
    if (diff < 0.05) return 'text-gray-300';
    if (isGood) {
      return diff > 0.1 ? 'text-green-400' : 'text-green-300';
    } else {
      return diff > 0.1 ? 'text-red-400' : 'text-yellow-400';
    }
  };

  const filteredMachines = machines.filter(machine => {
    if (filterType === 'all') return true;
    if (filterType === 'running') return machine.status === 'running';
    if (filterType === 'model') return selectedMachines.length === 0 || selectedMachines.includes(machine.id);
    return machine.type === filterType;
  });

  const getComparisonData = () => {
    return filteredMachines.map(machine => ({
      name: machine.name.replace('Linha de Produção ', ''),
      value: machine.kpis[selectedKPI as keyof MachineKPIs] as number,
      machineId: machine.id,
      status: machine.status,
      operator: machine.operator
    }));
  };

  const getRadarData = () => {
    const kpis = ['oee', 'availability', 'performance', 'quality', 'utilizationRate'];
    return kpis.map(kpi => {
      const data: Record<string, string | number> = { kpi: kpiDefinitions[kpi as keyof typeof kpiDefinitions].name };
      selectedMachines.forEach(machineId => {
        const machine = machines.find(m => m.id === machineId);
        if (machine) {
          data[machine.name.replace('Linha de Produção ', '')] = machine.kpis[kpi as keyof MachineKPIs];
        }
      });
      return data;
    });
  };

  const toggleMachineSelection = (machineId: string) => {
    setSelectedMachines(prev => 
      prev.includes(machineId) 
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  const currentKPI = kpiDefinitions[selectedKPI as keyof typeof kpiDefinitions];
  const comparisonData = getComparisonData();
  const radarData = getRadarData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BarChart3 className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Comparação de KPIs da Frota</h2>
            <p className="text-gray-400">Análise comparativa de performance entre máquinas similares</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fleet Overview */}
      {fleetAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Máquinas</p>
                <p className="text-2xl font-bold text-white">{fleetAnalytics.totalMachines}</p>
              </div>
              <div className="p-3 bg-gray-500/20 rounded-lg">
                <Factory className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">OEE Médio da Frota</p>
                <p className="text-2xl font-bold text-yellow-400">{fleetAnalytics.averageOEE.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Melhor Performance</p>
                <p className="text-lg font-bold text-green-400">{fleetAnalytics.bestPerformer}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Award className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Potencial de Economia</p>
                <p className="text-2xl font-bold text-green-400">R$ {(fleetAnalytics.costSavingsPotential / 1000).toFixed(0)}k</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">KPI Selecionado</label>
            <select
              value={selectedKPI}
              onChange={(e) => setSelectedKPI(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              {Object.entries(kpiDefinitions).map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Comparação</label>
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="current">Atual</option>
              <option value="trend">Tendência</option>
              <option value="benchmark">vs Benchmark</option>
              <option value="target">vs Meta</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filtro</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">Todas as Máquinas</option>
              <option value="running">Apenas Operando</option>
              <option value="CNC Mill">CNC Mills</option>
              <option value="model">Selecionadas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="1d">Último Dia</option>
              <option value="7d">Última Semana</option>
              <option value="30d">Último Mês</option>
              <option value="90d">Últimos 3 Meses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Selection */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Seleção de Máquinas</h3>
          <div className="space-y-3">
            {machines.map((machine) => (
              <div
                key={machine.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMachines.includes(machine.id)
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                }`}
                onClick={() => toggleMachineSelection(machine.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-white text-sm">{machine.name}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(machine.status)}`}>
                        {getStatusLabel(machine.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{machine.model}</p>
                    <p className="text-xs text-gray-500">{machine.operator}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-400">{machine.kpis.oee.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">OEE</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Comparison Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">{currentKPI.name} - Comparação</h3>
              <p className="text-sm text-gray-400">
                Meta: {currentKPI.target}{currentKPI.unit} | 
                Benchmark: {currentKPI.benchmark}{currentKPI.unit}
              </p>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [
                    `${value}${currentKPI.unit}`,
                    currentKPI.name
                  ]}
                  labelFormatter={(label: string, payload: readonly { payload?: { operator?: string } }[]) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${label} (${data.operator})` : label;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
                {/* Target Line */}
                <Bar 
                  dataKey={() => currentKPI.target}
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                {/* Benchmark Line */}
                <Bar 
                  dataKey={() => currentKPI.benchmark}
                  fill="transparent"
                  stroke="#6B7280"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed KPI Table */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Comparação Detalhada de KPIs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Máquina</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">OEE</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Disponibilidade</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Performance</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Qualidade</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Throughput</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Custo/Peça</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.map((machine) => (
                <tr key={machine.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{machine.name}</p>
                      <p className="text-sm text-gray-400">{machine.operator}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(machine.status)}`}>
                      {getStatusLabel(machine.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`font-medium ${getPerformanceColor(machine.kpis.oee, 85)}`}>
                        {machine.kpis.oee.toFixed(1)}%
                      </span>
                      {getTrendIcon(machine.kpis.oee, 85)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`font-medium ${getPerformanceColor(machine.kpis.availability, 95)}`}>
                        {machine.kpis.availability.toFixed(1)}%
                      </span>
                      {getTrendIcon(machine.kpis.availability, 95)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`font-medium ${getPerformanceColor(machine.kpis.performance, 90)}`}>
                        {machine.kpis.performance.toFixed(1)}%
                      </span>
                      {getTrendIcon(machine.kpis.performance, 90)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`font-medium ${getPerformanceColor(machine.kpis.quality, 98)}`}>
                        {machine.kpis.quality.toFixed(1)}%
                      </span>
                      {getTrendIcon(machine.kpis.quality, 98)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`font-medium ${getPerformanceColor(machine.kpis.throughput, 180)}`}>
                        {machine.kpis.throughput}
                      </span>
                      {getTrendIcon(machine.kpis.throughput, 180)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`font-medium ${getPerformanceColor(machine.kpis.productionCost, 10, true)}`}>
                        R$ {machine.kpis.productionCost.toFixed(2)}
                      </span>
                      {getTrendIcon(machine.kpis.productionCost, 10, true)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart for Multi-KPI Comparison */}
      {selectedMachines.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Comparação Multi-KPI (Radar)</h3>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="kpi" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                {selectedMachines.slice(0, 4).map((machineId, index) => {
                  const machine = machines.find(m => m.id === machineId);
                  const colors = ['#F59E0B', '#10B981', '#6B7280', '#EF4444'];
                  return machine ? (
                    <Radar
                      key={machineId}
                      name={machine.name.replace('Linha de Produção ', '')}
                      dataKey={machine.name.replace('Linha de Produção ', '')}
                      stroke={colors[index]}
                      fill={colors[index]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ) : null;
                })}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {selectedMachines.slice(0, 4).map((machineId, index) => {
              const machine = machines.find(m => m.id === machineId);
              const colors = ['#F59E0B', '#10B981', '#6B7280', '#EF4444'];
              return machine ? (
                <div key={machineId} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }}></div>
                  <span className="text-sm text-gray-300">{machine.name.replace('Linha de Produção ', '')}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Industry Benchmarking */}
      {fleetAnalytics && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Benchmarking Industrial
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(fleetAnalytics.industryBenchmarks).map(([kpi, benchmark]) => (
              <div key={kpi} className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3 capitalize">{kpi}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Classe Mundial</span>
                    <span className="text-green-400 font-medium">{benchmark.worldClass}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Média da Indústria</span>
                    <span className="text-yellow-400 font-medium">{benchmark.average}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Abaixo da Média</span>
                    <span className="text-red-400 font-medium">{benchmark.belowAverage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Smart Recommendations */}
      {fleetAnalytics && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
            Recomendações Inteligentes
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fleetAnalytics.recommendations.map((rec) => (
              <div key={rec.id} className="bg-gray-700/30 rounded-lg p-4 border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-400">{rec.machineName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-green-600/20 text-green-400'
                  }`}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{rec.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Economia Potencial:</span>
                    <p className="text-green-400 font-medium">R$ {rec.potentialSavings.toLocaleString()}/mês</p>
                  </div>
                  <div>
                    <span className="text-gray-400">ROI:</span>
                    <p className="text-yellow-400 font-medium">{rec.roi}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Investimento:</span>
                    <p className="text-white">R$ {rec.implementationCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Prazo:</span>
                    <p className="text-white">{rec.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Matrix */}
      {fleetAnalytics && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-yellow-400" />
            Matriz de Performance
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-white font-medium py-3 px-4">Máquina</th>
                  <th className="text-center text-white font-medium py-3 px-4">OEE</th>
                  <th className="text-center text-white font-medium py-3 px-4">Disponibilidade</th>
                  <th className="text-center text-white font-medium py-3 px-4">Performance</th>
                  <th className="text-center text-white font-medium py-3 px-4">Qualidade</th>
                  <th className="text-center text-white font-medium py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => {
                  const getPerformanceColor = (value: number, benchmark: { worldClass: number; average: number; belowAverage: number }) => {
                    if (value >= benchmark.worldClass) return 'bg-green-600/20 text-green-400';
                    if (value >= benchmark.average) return 'bg-yellow-600/20 text-yellow-400';
                    return 'bg-red-600/20 text-red-400';
                  };
                  
                  const oeeValue = (machine.kpis.availability * machine.kpis.performance * machine.kpis.quality) / 10000;
                  
                  return (
                    <tr key={machine.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{machine.name}</p>
                          <p className="text-xs text-gray-400">{machine.model}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPerformanceColor(oeeValue, fleetAnalytics.industryBenchmarks.oee)
                        }`}>
                          {oeeValue.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPerformanceColor(machine.kpis.availability, fleetAnalytics.industryBenchmarks.availability)
                        }`}>
                          {machine.kpis.availability}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPerformanceColor(machine.kpis.performance, fleetAnalytics.industryBenchmarks.performance)
                        }`}>
                          {machine.kpis.performance}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPerformanceColor(machine.kpis.quality, fleetAnalytics.industryBenchmarks.quality)
                        }`}>
                          {machine.kpis.quality}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          machine.status === 'running' ? 'bg-green-600/20 text-green-400' :
                          machine.status === 'idle' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {machine.status === 'running' ? 'Operando' :
                           machine.status === 'idle' ? 'Parada' : 'Manutenção'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600/20 rounded-full mr-2"></div>
              <span className="text-gray-400">Classe Mundial (≥95%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-600/20 rounded-full mr-2"></div>
              <span className="text-gray-400">Média da Indústria (85-94%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600/20 rounded-full mr-2"></div>
              <span className="text-gray-400">Abaixo da Média (&lt;85%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Improvement Opportunities */}
      {fleetAnalytics && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Oportunidades de Melhoria</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Ações Recomendadas</h4>
              <div className="space-y-2">
                {fleetAnalytics.improvementOpportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Benchmarks da Indústria</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-sm text-gray-300">OEE Classe Mundial</span>
                  <span className="text-sm font-medium text-green-400">85%+</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-sm text-gray-300">Disponibilidade Alvo</span>
                  <span className="text-sm font-medium text-green-400">95%+</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-sm text-gray-300">Taxa de Defeitos</span>
                  <span className="text-sm font-medium text-green-400">&lt;2%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-sm text-gray-300">MTBF Mínimo</span>
                  <span className="text-sm font-medium text-green-400">200h+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetKPIComparison;
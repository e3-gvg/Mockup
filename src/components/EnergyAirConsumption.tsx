'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Wind, 
  DollarSign, 
  Leaf, 
  CheckCircle, 
  Download, 
  RefreshCw, 
  Target,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Cell } from 'recharts';

interface EnergyConsumption {
  timestamp: Date;
  totalPower: number; // kW
  activePower: number; // kW
  reactivePower: number; // kVAr
  powerFactor: number;
  voltage: number; // V
  current: number; // A
  frequency: number; // Hz
  cost: number; // R$
  co2Emission: number; // kg CO2
}

interface AirConsumption {
  timestamp: Date;
  totalFlow: number; // m³/min
  pressure: number; // bar
  temperature: number; // °C
  humidity: number; // %
  dewPoint: number; // °C
  compressorLoad: number; // %
  energyConsumption: number; // kWh
  cost: number; // R$
  leakageRate: number; // %
}

interface MachineConsumption {
  machineId: string;
  machineName: string;
  location: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  energyConsumption: {
    current: number; // kW
    daily: number; // kWh
    monthly: number; // kWh
    efficiency: number; // kWh/peça
    cost: number; // R$/dia
  };
  airConsumption: {
    current: number; // m³/min
    daily: number; // m³
    monthly: number; // m³
    efficiency: number; // m³/peça
    cost: number; // R$/dia
  };
  alerts: ConsumptionAlert[];
}

interface ConsumptionAlert {
  id: string;
  type: 'energy' | 'air';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  value: number;
  threshold: number;
  unit: string;
}

interface ConsumptionTarget {
  type: 'energy' | 'air';
  period: 'daily' | 'monthly' | 'yearly';
  target: number;
  current: number;
  unit: string;
  savings: number; // R$
}

const EnergyAirConsumption: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyConsumption[]>([]);
  const [airData, setAirData] = useState<AirConsumption[]>([]);
  const [machineData, setMachineData] = useState<MachineConsumption[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('24h');
  const [selectedMetric, setSelectedMetric] = useState<string>('power');
  const [showTargets, setShowTargets] = useState(false);
  const [targets, setTargets] = useState<ConsumptionTarget[]>([]);

  useEffect(() => {
    // Simular dados de consumo de energia baseado no período
    const mockEnergyData: EnergyConsumption[] = [];
    const now = new Date();
    
    // Calcular pontos de dados baseado no período
    const getDataPoints = (period: string) => {
      switch (period) {
        case '1h': return 60; // 1 ponto por minuto
        case '24h': return 24; // 1 ponto por hora
        case '7d': return 7 * 24; // 1 ponto por hora por 7 dias
        case '30d': return 30 * 4; // 4 pontos por dia por 30 dias
        default: return 24;
      }
    };
    
    const dataPoints = getDataPoints(selectedPeriod);
    const intervalMs = selectedPeriod === '1h' ? 60 * 1000 : 
                     selectedPeriod === '24h' ? 60 * 60 * 1000 :
                     selectedPeriod === '7d' ? 60 * 60 * 1000 :
                     6 * 60 * 60 * 1000; // 6 horas para 30d
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * intervalMs);
      const baseLoad = 150 + Math.sin(i * 0.5) * 30; // Variação senoidal
      const randomVariation = (Math.random() - 0.5) * 20;
      const totalPower = Math.max(0, baseLoad + randomVariation);
      
      mockEnergyData.push({
        timestamp,
        totalPower,
        activePower: totalPower * 0.85,
        reactivePower: totalPower * 0.3,
        powerFactor: 0.85 + Math.random() * 0.1,
        voltage: 380 + (Math.random() - 0.5) * 10,
        current: totalPower / 0.38 / Math.sqrt(3),
        frequency: 60 + (Math.random() - 0.5) * 0.2,
        cost: totalPower * 0.65, // R$ 0.65/kWh
        co2Emission: totalPower * 0.084 // 0.084 kg CO2/kWh
      });
    }

    // Simular dados de consumo de ar comprimido
    const mockAirData: AirConsumption[] = [];
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * intervalMs);
      const baseFlow = 25 + Math.sin(i * 0.3) * 8;
      const randomVariation = (Math.random() - 0.5) * 5;
      const totalFlow = Math.max(0, baseFlow + randomVariation);
      
      mockAirData.push({
        timestamp,
        totalFlow,
        pressure: 6.5 + (Math.random() - 0.5) * 0.5,
        temperature: 22 + (Math.random() - 0.5) * 4,
        humidity: 45 + Math.random() * 20,
        dewPoint: 5 + Math.random() * 5,
        compressorLoad: (totalFlow / 35) * 100,
        energyConsumption: totalFlow * 0.12, // kWh por m³/min
        cost: totalFlow * 0.08, // R$ por m³/min
        leakageRate: 8 + Math.random() * 4
      });
    }

    // Simular dados de máquinas
    const mockMachineData: MachineConsumption[] = [
      {
        machineId: 'M001',
        machineName: 'Endireitadeira Principal',
        location: 'Setor A - Linha 1',
        status: 'running',
        energyConsumption: {
          current: 45.2,
          daily: 1084.8,
          monthly: 32544,
          efficiency: 0.85,
          cost: 704.12
        },
        airConsumption: {
          current: 8.5,
          daily: 204,
          monthly: 6120,
          efficiency: 0.16,
          cost: 16.32
        },
        alerts: [
          {
            id: 'ALERT-001',
            type: 'energy',
            severity: 'medium',
            message: 'Consumo de energia 15% acima da média',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            value: 45.2,
            threshold: 40.0,
            unit: 'kW'
          }
        ]
      },
      {
        machineId: 'M002',
        machineName: 'Estribadeira Automática',
        location: 'Setor B - Linha 2',
        status: 'running',
        energyConsumption: {
          current: 38.7,
          daily: 928.8,
          monthly: 27864,
          efficiency: 0.72,
          cost: 603.72
        },
        airConsumption: {
          current: 7.2,
          daily: 172.8,
          monthly: 5184,
          efficiency: 0.13,
          cost: 13.82
        },
        alerts: []
      },
      {
        machineId: 'M003',
        machineName: 'Dobradeira Bi-direcional',
        location: 'Setor C - Linha 3',
        status: 'maintenance',
        energyConsumption: {
          current: 12.1,
          daily: 290.4,
          monthly: 8712,
          efficiency: 0.95,
          cost: 188.76
        },
        airConsumption: {
          current: 2.1,
          daily: 50.4,
          monthly: 1512,
          efficiency: 0.18,
          cost: 4.03
        },
        alerts: [
          {
            id: 'ALERT-002',
            type: 'air',
            severity: 'high',
            message: 'Possível vazamento detectado - consumo em standby elevado',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            value: 2.1,
            threshold: 1.0,
            unit: 'm³/min'
          }
        ]
      },
      {
        machineId: 'M004',
        machineName: 'Cortadeira Hidráulica',
        location: 'Setor D - Linha 4',
        status: 'running',
        energyConsumption: {
          current: 42.8,
          daily: 1027.2,
          monthly: 30816,
          efficiency: 0.68,
          cost: 667.68
        },
        airConsumption: {
          current: 9.1,
          daily: 218.4,
          monthly: 6552,
          efficiency: 0.14,
          cost: 17.47
        },
        alerts: []
      },
      {
        machineId: 'M005',
        machineName: 'Estribadeira 3D',
        location: 'Setor E - Linha 5',
        status: 'idle',
        energyConsumption: {
          current: 8.3,
          daily: 199.2,
          monthly: 5976,
          efficiency: 0.78,
          cost: 129.48
        },
        airConsumption: {
          current: 1.5,
          daily: 36,
          monthly: 1080,
          efficiency: 0.15,
          cost: 2.88
        },
        alerts: []
      }
    ];

    const mockTargets: ConsumptionTarget[] = [
      {
        type: 'energy',
        period: 'daily',
        target: 3000,
        current: 3530.4,
        unit: 'kWh',
        savings: 344.76
      },
      {
        type: 'air',
        period: 'daily',
        target: 600,
        current: 681.6,
        unit: 'm³',
        savings: 6.53
      },
      {
        type: 'energy',
        period: 'monthly',
        target: 90000,
        current: 105912,
        unit: 'kWh',
        savings: 10342.8
      },
      {
        type: 'air',
        period: 'monthly',
        target: 18000,
        current: 20448,
        unit: 'm³',
        savings: 195.84
      }
    ];

    setEnergyData(mockEnergyData);
    setAirData(mockAirData);
    setMachineData(mockMachineData);
    setTargets(mockTargets);
  }, [selectedPeriod]);

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

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredMachineData = selectedMachine === 'all' 
    ? machineData 
    : machineData.filter(m => m.machineId === selectedMachine);

  const totalEnergyConsumption = machineData.reduce((sum, m) => sum + m.energyConsumption.current, 0);
  const totalAirConsumption = machineData.reduce((sum, m) => sum + m.airConsumption.current, 0);
  const totalEnergyCost = machineData.reduce((sum, m) => sum + m.energyConsumption.cost, 0);
  const totalAirCost = machineData.reduce((sum, m) => sum + m.airConsumption.cost, 0);
  const totalAlerts = machineData.reduce((sum, m) => sum + m.alerts.length, 0);

  const energyPieData = machineData.map((machine, index) => ({
    name: machine.machineName,
    value: machine.energyConsumption.current,
    color: ['#F59E0B', '#10B981', '#6B7280', '#EF4444', '#8B5CF6'][index % 5]
  }));

  const airPieData = machineData.map((machine, index) => ({
    name: machine.machineName,
    value: machine.airConsumption.current,
    color: ['#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'][index % 5]
  }));

  const getChartData = () => {
    if (selectedMetric === 'power') {
      return energyData.map(d => ({
        time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        value: d.totalPower,
        cost: d.cost
      }));
    } else if (selectedMetric === 'air') {
      return airData.map(d => ({
        time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        value: d.totalFlow,
        cost: d.cost
      }));
    } else if (selectedMetric === 'cost') {
      return energyData.map((d, index) => ({
        time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        value: d.cost + (airData[index]?.cost || 0),
        cost: d.cost + (airData[index]?.cost || 0)
      }));
    } else if (selectedMetric === 'efficiency') {
      return energyData.map((d, index) => {
        const totalEfficiency = machineData.reduce((sum, m) => sum + m.energyConsumption.efficiency, 0) / machineData.length;
        return {
          time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          value: totalEfficiency + (Math.random() - 0.5) * 0.1, // Simula variação
          cost: d.cost
        };
      });
    } else {
      return airData.map(d => ({
        time: d.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        value: d.totalFlow,
        cost: d.cost
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <Wind className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Monitoramento de Energia e Ar Comprimido</h2>
            <p className="text-gray-400">Análise detalhada de consumo e eficiência energética</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowTargets(!showTargets)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              showTargets 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Metas</span>
          </button>
          
          <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Relatório</span>
          </button>
          
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Consumo Total de Energia</p>
              <p className="text-2xl font-bold text-yellow-400">{totalEnergyConsumption.toFixed(1)} kW</p>
              <p className="text-xs text-gray-500">R$ {totalEnergyCost.toFixed(2)}/dia</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Consumo Total de Ar</p>
              <p className="text-2xl font-bold text-gray-400">{totalAirConsumption.toFixed(1)} m³/min</p>
              <p className="text-xs text-gray-500">R$ {totalAirCost.toFixed(2)}/dia</p>
            </div>
            <div className="p-3 bg-gray-500/20 rounded-lg">
                <Wind className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Custo Total Diário</p>
              <p className="text-2xl font-bold text-green-400">R$ {(totalEnergyCost + totalAirCost).toFixed(2)}</p>
              <p className="text-xs text-gray-500">Energia + Ar Comprimido</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Emissão de CO₂</p>
              <p className="text-2xl font-bold text-orange-400">
                {(totalEnergyConsumption * 24 * 0.084).toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500">Por dia</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Leaf className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Alertas Ativos</p>
              <p className="text-2xl font-bold text-red-400">{totalAlerts}</p>
              <p className="text-xs text-gray-500">Requer atenção</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Targets Panel */}
      {showTargets && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Metas de Consumo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {targets.map((target, index) => {
              const isOverTarget = target.current > target.target;
              const percentage = (target.current / target.target) * 100;
              
              return (
                <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {target.type === 'energy' ? 
                        <Zap className="w-4 h-4 text-yellow-400" /> : 
                        <Wind className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-sm font-medium text-white capitalize">
                        {target.type === 'energy' ? 'Energia' : 'Ar'} - {target.period === 'daily' ? 'Diário' : 'Mensal'}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isOverTarget ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Meta:</span>
                      <span className="text-white">{target.target.toLocaleString()} {target.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Atual:</span>
                      <span className={isOverTarget ? 'text-red-400' : 'text-green-400'}>
                        {target.current.toLocaleString()} {target.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Economia Potencial:</span>
                      <span className="text-green-400">R$ {target.savings.toFixed(2)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isOverTarget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Máquina</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">Todas as Máquinas</option>
              {machineData.map(machine => (
                <option key={machine.machineId} value={machine.machineId}>
                  {machine.machineName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="1h">Última Hora</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Última Semana</option>
              <option value="30d">Último Mês</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Métrica</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="power">Energia Elétrica</option>
              <option value="air">Ar Comprimido</option>
              <option value="cost">Custo</option>
              <option value="efficiency">Eficiência</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Visualização</label>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-lg text-sm">
                Gráfico
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                Tabela
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {selectedMetric === 'power' ? 'Consumo de Energia Elétrica' : 
               selectedMetric === 'air' ? 'Consumo de Ar Comprimido' :
               selectedMetric === 'cost' ? 'Custo Total' :
               selectedMetric === 'efficiency' ? 'Eficiência Energética' : 'Consumo de Ar Comprimido'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Últimas 24 horas</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={
                      selectedMetric === 'power' ? '#F59E0B' : 
                      selectedMetric === 'air' ? '#06B6D4' :
                      selectedMetric === 'cost' ? '#EF4444' :
                      selectedMetric === 'efficiency' ? '#10B981' : '#06B6D4'
                    } stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={
                      selectedMetric === 'power' ? '#F59E0B' : 
                      selectedMetric === 'air' ? '#06B6D4' :
                      selectedMetric === 'cost' ? '#EF4444' :
                      selectedMetric === 'efficiency' ? '#10B981' : '#06B6D4'
                    } stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => {
                    let unit = '';
                    let label = '';
                    
                    if (selectedMetric === 'power') {
                      unit = 'kW';
                      label = 'Potência';
                    } else if (selectedMetric === 'air') {
                      unit = 'm³/min';
                      label = 'Fluxo';
                    } else if (selectedMetric === 'cost') {
                      unit = 'R$';
                      label = 'Custo';
                    } else if (selectedMetric === 'efficiency') {
                      unit = 'kWh/peça';
                      label = 'Eficiência';
                    }
                    
                    return [`${value.toFixed(selectedMetric === 'cost' ? 2 : 1)} ${unit}`, label];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    selectedMetric === 'power' ? '#F59E0B' : 
                    selectedMetric === 'air' ? '#06B6D4' :
                    selectedMetric === 'cost' ? '#EF4444' :
                    selectedMetric === 'efficiency' ? '#10B981' : '#06B6D4'
                  }
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="space-y-6">
          {/* Energy Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Energia</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={energyPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={70}>
                    {energyPieData.map((entry, index) => (
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
                    formatter={(value: number) => [`${value.toFixed(1)} kW`, 'Consumo']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {energyPieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value.toFixed(1)} kW</span>
                </div>
              ))}
            </div>
          </div>

          {/* Air Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Ar Comprimido</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={airPieData} cx="50%" cy="50%" innerRadius={30} outerRadius={70}>
                    {airPieData.map((entry, index) => (
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
                    formatter={(value: number) => [`${value.toFixed(1)} m³/min`, 'Consumo']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {airPieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value.toFixed(1)} m³/min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Machine Details Table */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Detalhes por Máquina</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Máquina</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Energia (kW)</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Ar (m³/min)</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Eficiência Energética</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Eficiência Ar</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Custo Diário</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Alertas</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachineData.map((machine) => (
                <tr key={machine.machineId} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{machine.machineName}</p>
                      <p className="text-sm text-gray-400">{machine.location}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(machine.status)}`}>
                      {getStatusLabel(machine.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <p className="font-medium text-white">{machine.energyConsumption.current.toFixed(1)}</p>
                    <p className="text-xs text-gray-400">{machine.energyConsumption.daily.toFixed(0)} kWh/dia</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <p className="font-medium text-white">{machine.airConsumption.current.toFixed(1)}</p>
                    <p className="text-xs text-gray-400">{machine.airConsumption.daily.toFixed(0)} m³/dia</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <p className="font-medium text-yellow-400">{machine.energyConsumption.efficiency.toFixed(2)} kWh/peça</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <p className="font-medium text-gray-400">{machine.airConsumption.efficiency.toFixed(2)} m³/peça</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <p className="font-medium text-green-400">
                      R$ {(machine.energyConsumption.cost + machine.airConsumption.cost).toFixed(2)}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {machine.alerts.length > 0 ? (
                      <div className="flex items-center justify-center space-x-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-medium">{machine.alerts.length}</span>
                      </div>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Alerts */}
      {totalAlerts > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Alertas Ativos</h3>
          
          <div className="space-y-3">
            {machineData.flatMap(machine => 
              machine.alerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <h4 className="font-medium">{machine.machineName}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                          {alert.type === 'energy' ? 'Energia' : 'Ar Comprimido'}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>Valor: {alert.value} {alert.unit}</span>
                        <span>Limite: {alert.threshold} {alert.unit}</span>
                        <span>{alert.timestamp.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs">
                        Investigar
                      </button>
                      <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs">
                        Dispensar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyAirConsumption;
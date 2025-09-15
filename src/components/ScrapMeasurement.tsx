'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  CheckCircle, 
  Target, 
  DollarSign, 
  Recycle, 
  Download, 
  RefreshCw, 
  Eye, 
  Settings, 
  Activity, 
  Percent,
  Calendar
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface ScrapRecord {
  id: string;
  timestamp: Date;
  machineId: string;
  machineName: string;
  productType: string;
  batchId: string;
  scrapType: 'material_waste' | 'defective_product' | 'setup_waste' | 'rework' | 'contamination';
  scrapReason: string;
  quantity: number;
  unit: 'kg' | 'pcs' | 'liters' | 'm2' | 'm3';
  materialCost: number; // R$ por unidade
  totalLoss: number; // R$ total
  operatorId: string;
  operatorName: string;
  shift: 'morning' | 'afternoon' | 'night';
  isRecyclable: boolean;
  recycleValue: number; // R$
  rootCause?: string;
  correctionAction?: string;
  status: 'pending' | 'analyzed' | 'resolved';
}

interface ScrapAnalytics {
  totalScrap: number;
  totalLoss: number;
  scrapRate: number; // %
  recycleRate: number; // %
  topReasons: { reason: string; count: number; percentage: number }[];
  trendData: { date: Date; scrap: number; loss: number; rate: number }[];
  machineComparison: { machineId: string; machineName: string; scrapRate: number; loss: number }[];
  materialBreakdown: { material: string; quantity: number; loss: number; percentage: number }[];
}

interface ScrapTarget {
  type: 'rate' | 'loss' | 'recycle';
  target: number;
  current: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly';
  status: 'on_track' | 'warning' | 'critical';
}

interface QualityMetrics {
  firstPassYield: number; // %
  defectRate: number; // %
  reworkRate: number; // %
  customerReturns: number;
  qualityScore: number; // 0-100
  sixSigmaLevel: number;
}

const ScrapMeasurement: React.FC = () => {
  const [scrapRecords, setScrapRecords] = useState<ScrapRecord[]>([]);
  const [analytics, setAnalytics] = useState<ScrapAnalytics | null>(null);
  const [targets, setTargets] = useState<ScrapTarget[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedScrapType, setSelectedScrapType] = useState<string>('all');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ScrapRecord | null>(null);

  useEffect(() => {
    // Simular dados de refugo baseado no período selecionado
    const mockScrapRecords: ScrapRecord[] = [];
    const now = new Date();
    
    // Calcular número de dias baseado no período
    const getDaysFromPeriod = (period: string) => {
      switch (period) {
        case '24h': return 1;
        case '7d': return 7;
        case '30d': return 30;
        case '90d': return 90;
        default: return 7;
      }
    };
    
    const daysToGenerate = getDaysFromPeriod(selectedPeriod);
    const machines = [
      { id: 'M001', name: 'Linha de Produção A' },
      { id: 'M002', name: 'Linha de Produção B' },
      { id: 'M003', name: 'Linha de Produção C' },
      { id: 'M004', name: 'Linha de Produção D' },
      { id: 'M005', name: 'Linha de Produção E' }
    ];
    
    const scrapTypes = [
      { type: 'material_waste', reasons: ['Sobra de corte', 'Material vencido', 'Contaminação'] },
      { type: 'defective_product', reasons: ['Dimensão incorreta', 'Acabamento ruim', 'Falha estrutural'] },
      { type: 'setup_waste', reasons: ['Ajuste de máquina', 'Troca de ferramenta', 'Calibração'] },
      { type: 'rework', reasons: ['Retrabalho necessário', 'Correção de defeito', 'Ajuste de qualidade'] },
      { type: 'contamination', reasons: ['Contaminação cruzada', 'Material impuro', 'Ambiente contaminado'] }
    ];
    
    const operators = [
      { id: 'OP001', name: 'João Silva' },
      { id: 'OP002', name: 'Maria Santos' },
      { id: 'OP003', name: 'Pedro Costa' },
      { id: 'OP004', name: 'Ana Oliveira' },
      { id: 'OP005', name: 'Carlos Lima' }
    ];
    
    const products = ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'];
    const shifts = ['morning', 'afternoon', 'night'] as const;
    const units = ['kg', 'pcs', 'liters'] as const;
    
    // Gerar registros baseado no período selecionado
    const recordsToGenerate = Math.floor(daysToGenerate * 5); // ~5 registros por dia
    for (let i = 0; i < recordsToGenerate; i++) {
      const daysAgo = Math.floor(Math.random() * daysToGenerate);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000);
      const machine = machines[Math.floor(Math.random() * machines.length)];
      const scrapTypeData = scrapTypes[Math.floor(Math.random() * scrapTypes.length)];
      const reason = scrapTypeData.reasons[Math.floor(Math.random() * scrapTypeData.reasons.length)];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const shift = shifts[Math.floor(Math.random() * shifts.length)];
      const unit = units[Math.floor(Math.random() * units.length)];
      
      const quantity = Math.random() * 50 + 1;
      const materialCost = Math.random() * 20 + 5;
      const totalLoss = quantity * materialCost;
      const isRecyclable = Math.random() > 0.3;
      const recycleValue = isRecyclable ? totalLoss * (0.1 + Math.random() * 0.3) : 0;
      
      mockScrapRecords.push({
        id: `SCRAP-${String(i + 1).padStart(3, '0')}`,
        timestamp,
        machineId: machine.id,
        machineName: machine.name,
        productType: product,
        batchId: `BATCH-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
        scrapType: scrapTypeData.type as 'material_waste' | 'defective_product' | 'setup_waste' | 'rework' | 'contamination',
        scrapReason: reason,
        quantity,
        unit,
        materialCost,
        totalLoss,
        operatorId: operator.id,
        operatorName: operator.name,
        shift,
        isRecyclable,
        recycleValue,
        rootCause: Math.random() > 0.5 ? 'Análise de causa raiz pendente' : undefined,
        correctionAction: Math.random() > 0.7 ? 'Ação corretiva implementada' : undefined,
        status: ['pending', 'analyzed', 'resolved'][Math.floor(Math.random() * 3)] as 'pending' | 'analyzed' | 'resolved'
      });
    }
    
    // Ordenar por timestamp (mais recente primeiro)
    mockScrapRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Calcular analytics
    const totalScrap = mockScrapRecords.reduce((sum, record) => sum + record.quantity, 0);
    const totalLoss = mockScrapRecords.reduce((sum, record) => sum + record.totalLoss, 0);
    const totalRecycleValue = mockScrapRecords.reduce((sum, record) => sum + record.recycleValue, 0);
    const scrapRate = 8.5; // % simulado
    const recycleRate = (totalRecycleValue / totalLoss) * 100;
    
    // Top reasons
    const reasonCounts = mockScrapRecords.reduce((acc, record) => {
      acc[record.scrapReason] = (acc[record.scrapReason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topReasons = Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: (count / mockScrapRecords.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Trend data (últimos 7 dias)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayRecords = mockScrapRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate.toDateString() === date.toDateString();
      });
      
      const dayScrap = dayRecords.reduce((sum, record) => sum + record.quantity, 0);
      const dayLoss = dayRecords.reduce((sum, record) => sum + record.totalLoss, 0);
      const dayRate = Math.random() * 5 + 5; // % simulado
      
      trendData.push({
        date,
        scrap: dayScrap,
        loss: dayLoss,
        rate: dayRate
      });
    }
    
    // Machine comparison
    const machineComparison = machines.map(machine => {
      const machineRecords = mockScrapRecords.filter(record => record.machineId === machine.id);
      const machineLoss = machineRecords.reduce((sum, record) => sum + record.totalLoss, 0);
      const machineRate = Math.random() * 10 + 3; // % simulado
      
      return {
        machineId: machine.id,
        machineName: machine.name,
        scrapRate: machineRate,
        loss: machineLoss
      };
    });
    
    // Material breakdown
    const materialCounts = mockScrapRecords.reduce((acc, record) => {
      acc[record.productType] = (acc[record.productType] || { quantity: 0, loss: 0 });
      acc[record.productType].quantity += record.quantity;
      acc[record.productType].loss += record.totalLoss;
      return acc;
    }, {} as Record<string, { quantity: number; loss: number }>);
    
    const materialBreakdown = Object.entries(materialCounts)
      .map(([material, data]) => ({
        material,
        quantity: data.quantity,
        loss: data.loss,
        percentage: (data.loss / totalLoss) * 100
      }))
      .sort((a, b) => b.loss - a.loss);
    
    const mockAnalytics: ScrapAnalytics = {
      totalScrap,
      totalLoss,
      scrapRate,
      recycleRate,
      topReasons,
      trendData,
      machineComparison,
      materialBreakdown
    };
    
    // Targets
    const mockTargets: ScrapTarget[] = [
      {
        type: 'rate',
        target: 5.0,
        current: scrapRate,
        unit: '%',
        period: 'monthly',
        status: scrapRate <= 5.0 ? 'on_track' : scrapRate <= 7.0 ? 'warning' : 'critical'
      },
      {
        type: 'loss',
        target: 15000,
        current: totalLoss,
        unit: 'R$',
        period: 'monthly',
        status: totalLoss <= 15000 ? 'on_track' : totalLoss <= 20000 ? 'warning' : 'critical'
      },
      {
        type: 'recycle',
        target: 80.0,
        current: recycleRate,
        unit: '%',
        period: 'monthly',
        status: recycleRate >= 80.0 ? 'on_track' : recycleRate >= 60.0 ? 'warning' : 'critical'
      }
    ];
    
    // Quality metrics
    const mockQualityMetrics: QualityMetrics = {
      firstPassYield: 92.5,
      defectRate: 2.8,
      reworkRate: 4.7,
      customerReturns: 12,
      qualityScore: 87.3,
      sixSigmaLevel: 4.2
    };
    
    setScrapRecords(mockScrapRecords);
    setAnalytics(mockAnalytics);
    setTargets(mockTargets);
    setQualityMetrics(mockQualityMetrics);
  }, [selectedPeriod]);

  const getScrapTypeLabel = (type: string) => {
    switch (type) {
      case 'material_waste': return 'Desperdício de Material';
      case 'defective_product': return 'Produto Defeituoso';
      case 'setup_waste': return 'Desperdício de Setup';
      case 'rework': return 'Retrabalho';
      case 'contamination': return 'Contaminação';
      default: return type;
    }
  };

  const getScrapTypeColor = (type: string) => {
    switch (type) {
      case 'material_waste': return 'text-red-400 bg-red-500/20';
      case 'defective_product': return 'text-orange-400 bg-orange-500/20';
      case 'setup_waste': return 'text-yellow-400 bg-yellow-500/20';
      case 'rework': return 'text-gray-400 bg-gray-500/20';
      case 'contamination': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'analyzed': return 'text-gray-400 bg-gray-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'analyzed': return 'Analisado';
      case 'resolved': return 'Resolvido';
      default: return status;
    }
  };

  const getTargetStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredRecords = scrapRecords.filter(record => {
    if (selectedMachine !== 'all' && record.machineId !== selectedMachine) return false;
    if (selectedScrapType !== 'all' && record.scrapType !== selectedScrapType) return false;
    return true;
  });

  if (!analytics || !qualityMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trash2 className="w-8 h-8 text-red-500" />
            <Recycle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Medição e Análise de Refugo</h2>
            <p className="text-gray-400">Monitoramento de desperdício e qualidade de produção</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              showDetails 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Detalhes</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taxa de Refugo</p>
              <p className="text-2xl font-bold text-red-400">{analytics.scrapRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Meta: ≤ 5.0%</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Percent className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Perda Total</p>
              <p className="text-2xl font-bold text-orange-400">R$ {analytics.totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
              <p className="text-xs text-gray-500">Este mês</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taxa de Reciclagem</p>
              <p className="text-2xl font-bold text-green-400">{analytics.recycleRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Meta: ≥ 80%</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Recycle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">First Pass Yield</p>
              <p className="text-2xl font-bold text-gray-400">{qualityMetrics.firstPassYield.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Qualidade primeira passada</p>
            </div>
            <div className="p-3 bg-gray-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Score de Qualidade</p>
              <p className="text-2xl font-bold text-purple-400">{qualityMetrics.qualityScore.toFixed(1)}</p>
              <p className="text-xs text-gray-500">Índice geral</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Nível Six Sigma</p>
              <p className="text-2xl font-bold text-yellow-400">{qualityMetrics.sixSigmaLevel.toFixed(1)}σ</p>
              <p className="text-xs text-gray-500">Capacidade do processo</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Targets */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Metas de Qualidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {targets.map((target, index) => {
            const isOnTrack = target.status === 'on_track';
            const percentage = target.type === 'recycle' 
              ? (target.current / target.target) * 100
              : target.type === 'rate'
              ? (target.target / target.current) * 100
              : (target.target / target.current) * 100;
            
            return (
              <div key={index} className={`p-4 rounded-lg border ${getTargetStatusColor(target.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">
                    {target.type === 'rate' ? 'Taxa de Refugo' : 
                     target.type === 'loss' ? 'Perda Financeira' : 'Taxa de Reciclagem'}
                  </h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                    {target.period === 'daily' ? 'Diário' : target.period === 'weekly' ? 'Semanal' : 'Mensal'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Meta:</span>
                    <span className="text-white">
                      {target.type === 'loss' ? 'R$ ' : ''}
                      {target.target.toLocaleString('pt-BR')}
                      {target.type !== 'loss' ? target.unit : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Atual:</span>
                    <span className={isOnTrack ? 'text-green-400' : 'text-red-400'}>
                      {target.type === 'loss' ? 'R$ ' : ''}
                      {target.current.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                      {target.type !== 'loss' ? target.unit : ''}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isOnTrack ? 'bg-green-500' : target.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Última Semana</option>
              <option value="30d">Último Mês</option>
              <option value="90d">Últimos 3 Meses</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Máquina</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">Todas as Máquinas</option>
              <option value="M001">Linha de Produção A</option>
              <option value="M002">Linha de Produção B</option>
              <option value="M003">Linha de Produção C</option>
              <option value="M004">Linha de Produção D</option>
              <option value="M005">Linha de Produção E</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Refugo</label>
            <select
              value={selectedScrapType}
              onChange={(e) => setSelectedScrapType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">Todos os Tipos</option>
              <option value="material_waste">Desperdício de Material</option>
              <option value="defective_product">Produto Defeituoso</option>
              <option value="setup_waste">Desperdício de Setup</option>
              <option value="rework">Retrabalho</option>
              <option value="contamination">Contaminação</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ações</label>
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-lg text-sm">
                Filtrar
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Tendência de Refugo</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Últimos 7 dias</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.trendData}>
                <defs>
                  <linearGradient id="colorScrap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                  formatter={(value: number, name: string) => {
                    if (name === 'scrap') return [`${value.toFixed(1)} kg`, 'Refugo'];
                    if (name === 'loss') return [`R$ ${value.toFixed(0)}`, 'Perda'];
                    if (name === 'rate') return [`${value.toFixed(1)}%`, 'Taxa'];
                    return [value, name];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorScrap)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Reasons */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Principais Causas</h3>
          
          <div className="space-y-4">
            {analytics.topReasons.map((reason, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{reason.reason}</span>
                  <span className="text-xs text-gray-400">{reason.count} ocorrências</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{reason.percentage.toFixed(1)}%</span>
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                    style={{ width: `${reason.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Comparison */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Comparação por Máquina</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.machineComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="machineName" 
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
                formatter={(value: number, name: string) => {
                  if (name === 'scrapRate') return [`${value.toFixed(1)}%`, 'Taxa de Refugo'];
                  if (name === 'loss') return [`R$ ${value.toFixed(0)}`, 'Perda Total'];
                  return [value, name];
                }}
              />
              <Bar dataKey="scrapRate" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Records Table */}
      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Registros Recentes de Refugo</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Data/Hora</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Máquina</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Motivo</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Quantidade</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Perda</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Reciclável</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.slice(0, 10).map((record) => (
                  <tr key={record.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-gray-400">{record.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-white">{record.timestamp.toLocaleDateString('pt-BR')}</p>
                        <p className="text-xs text-gray-400">{record.timestamp.toLocaleTimeString('pt-BR')}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-white">{record.machineName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getScrapTypeColor(record.scrapType)}`}>
                        {getScrapTypeLabel(record.scrapType)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-white max-w-32 truncate" title={record.scrapReason}>
                        {record.scrapReason}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <p className="text-sm text-white">{record.quantity.toFixed(1)} {record.unit}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <p className="text-sm text-red-400">R$ {record.totalLoss.toFixed(2)}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record.isRecyclable ? (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="ml-1 text-xs text-green-400">
                            R$ {record.recycleValue.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Não</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => setSelectedRecord(record)}
                          className="p-1 text-gray-400 hover:text-gray-300"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-yellow-400 hover:text-yellow-300"
                          title="Editar"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length > 10 && (
            <div className="mt-4 text-center">
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                Carregar mais registros ({filteredRecords.length - 10} restantes)
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Detalhes do Registro de Refugo</h3>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="p-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">ID do Registro</label>
                  <p className="text-white font-mono">{selectedRecord.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data e Hora</label>
                  <p className="text-white">{selectedRecord.timestamp.toLocaleString('pt-BR')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Máquina</label>
                  <p className="text-white">{selectedRecord.machineName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Produto</label>
                  <p className="text-white">{selectedRecord.productType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Lote</label>
                  <p className="text-white font-mono">{selectedRecord.batchId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Operador</label>
                  <p className="text-white">{selectedRecord.operatorName}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Refugo</label>
                  <span className={`px-3 py-1 text-sm rounded-full ${getScrapTypeColor(selectedRecord.scrapType)}`}>
                    {getScrapTypeLabel(selectedRecord.scrapType)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Motivo</label>
                  <p className="text-white">{selectedRecord.scrapReason}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Quantidade</label>
                  <p className="text-white">{selectedRecord.quantity.toFixed(2)} {selectedRecord.unit}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Custo do Material</label>
                  <p className="text-white">R$ {selectedRecord.materialCost.toFixed(2)} por {selectedRecord.unit}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Perda Total</label>
                  <p className="text-red-400 font-semibold">R$ {selectedRecord.totalLoss.toFixed(2)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Reciclável</label>
                  <div className="flex items-center space-x-2">
                    {selectedRecord.isRecyclable ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Sim - R$ {selectedRecord.recycleValue.toFixed(2)}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-400">Não</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {(selectedRecord.rootCause || selectedRecord.correctionAction) && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-lg font-medium text-white mb-4">Análise e Ações</h4>
                
                {selectedRecord.rootCause && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Causa Raiz</label>
                    <p className="text-white">{selectedRecord.rootCause}</p>
                  </div>
                )}
                
                {selectedRecord.correctionAction && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Ação Corretiva</label>
                    <p className="text-white">{selectedRecord.correctionAction}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Fechar
              </button>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
                Editar Registro
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ScrapMeasurement;
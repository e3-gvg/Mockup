'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  Download,
  RefreshCw,
  QrCode,
  GitBranch,
  Shield
} from 'lucide-react';

interface MaterialGenealogy {
  materialId: string;
  supplier: string;
  batchNumber: string;
  certificationNumber: string;
  chemicalComposition: Record<string, number>;
  mechanicalProperties: Record<string, number>;
  testResults: QualityTest[];
}

interface QualityTest {
  id: string;
  testType: string;
  result: 'pass' | 'fail' | 'pending';
  value: number;
  specification: { min: number; max: number };
  timestamp: Date;
  inspector: string;
}

interface ProductionBatch {
  id: string;
  castingId: string;
  qrCode: string;
  productType: string;
  quantity: number;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'quality_check' | 'shipped' | 'rejected';
  machineId: string;
  machineName: string;
  operatorId: string;
  operatorName: string;
  qualityScore: number;
  defectCount: number;
  materialLot: string;
  materialGenealogy: MaterialGenealogy[];
  location: string;
  temperature: number;
  pressure: number;
  cycleTime: number;
  energyConsumption: number;
  certifications: string[];
  customerOrder: string;
  shippingInfo?: {
    carrier: string;
    trackingNumber: string;
    destination: string;
    shippedAt: Date;
  };
}

interface TraceabilityEvent {
  id: string;
  batchId: string;
  timestamp: Date;
  eventType: 'start' | 'quality_check' | 'material_change' | 'operator_change' | 'maintenance' | 'completion' | 'shipment';
  description: string;
  userId: string;
  userName: string;
  data?: Record<string, unknown>;
}

const ProductionTraceability: React.FC = () => {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [events, setEvents] = useState<TraceabilityEvent[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');

  // Dados simulados
  useEffect(() => {
    const mockBatches: ProductionBatch[] = [
      {
        id: 'BATCH-001',
        castingId: 'CAST-2024-001',
        qrCode: 'QR-BATCH-001-2024',
        productType: 'Peça Estrutural A',
        quantity: 150,
        startTime: new Date('2024-01-15T08:00:00'),
        endTime: new Date('2024-01-15T16:30:00'),
        status: 'completed',
        machineId: 'M001',
        machineName: 'Linha de Produção A',
        operatorId: 'OP001',
        operatorName: 'João Silva',
        qualityScore: 98,
        defectCount: 2,
        materialLot: 'MAT-2024-A15',
        materialGenealogy: [{
          materialId: 'MAT-001',
          supplier: 'Aços Especiais Ltda',
          batchNumber: 'AE-2024-001',
          certificationNumber: 'CERT-AE-001',
          chemicalComposition: { C: 0.15, Mn: 1.2, Si: 0.3, P: 0.025, S: 0.015 },
          mechanicalProperties: { tensileStrength: 520, yieldStrength: 355, elongation: 22 },
          testResults: [{
            id: 'TEST-001',
            testType: 'Tração',
            result: 'pass',
            value: 525,
            specification: { min: 520, max: 680 },
            timestamp: new Date('2024-01-14T10:00:00'),
            inspector: 'Lab. Qualidade'
          }]
        }],
        location: 'Setor A - Linha 1',
        temperature: 72,
        pressure: 145,
        cycleTime: 45,
        energyConsumption: 234,
        certifications: ['ISO 9001', 'IATF 16949', 'AS9100'],
        customerOrder: 'ORD-2024-001',
        shippingInfo: {
          carrier: 'Transportadora Express',
          trackingNumber: 'TRK-001-2024',
          destination: 'Cliente A - São Paulo',
          shippedAt: new Date('2024-01-16T08:00:00')
        }
      },
      {
        id: 'BATCH-002',
        castingId: 'CAST-2024-002',
        qrCode: 'QR-BATCH-002-2024',
        productType: 'Componente B',
        quantity: 200,
        startTime: new Date('2024-01-15T09:15:00'),
        status: 'in_progress',
        machineId: 'M002',
        machineName: 'Linha de Produção B',
        operatorId: 'OP002',
        operatorName: 'Maria Santos',
        qualityScore: 95,
        defectCount: 5,
        materialLot: 'MAT-2024-B12',
        materialGenealogy: [{
          materialId: 'MAT-002',
          supplier: 'Metais Premium SA',
          batchNumber: 'MP-2024-002',
          certificationNumber: 'CERT-MP-002',
          chemicalComposition: { C: 0.18, Mn: 1.4, Si: 0.25, P: 0.020, S: 0.012 },
          mechanicalProperties: { tensileStrength: 580, yieldStrength: 420, elongation: 18 },
          testResults: [{
            id: 'TEST-002',
            testType: 'Dureza',
            result: 'pass',
            value: 185,
            specification: { min: 180, max: 220 },
            timestamp: new Date('2024-01-14T14:00:00'),
            inspector: 'Lab. Materiais'
          }]
        }],
        location: 'Setor B - Linha 2',
        temperature: 68,
        pressure: 152,
        cycleTime: 38,
        energyConsumption: 189,
        certifications: ['ISO 9001', 'ISO 14001'],
        customerOrder: 'ORD-2024-002'
      },
      {
        id: 'BATCH-003',
        castingId: 'CAST-2024-003',
        qrCode: 'QR-BATCH-003-2024',
        productType: 'Peça Crítica C',
        quantity: 75,
        startTime: new Date('2024-01-15T10:30:00'),
        endTime: new Date('2024-01-15T14:45:00'),
        status: 'quality_check',
        machineId: 'M003',
        machineName: 'Linha de Produção C',
        operatorId: 'OP003',
        operatorName: 'Carlos Oliveira',
        qualityScore: 92,
        defectCount: 8,
        materialLot: 'MAT-2024-C08',
        materialGenealogy: [{
          materialId: 'MAT-003',
          supplier: 'Liga Especial Corp',
          batchNumber: 'LE-2024-003',
          certificationNumber: 'CERT-LE-003',
          chemicalComposition: { C: 0.12, Mn: 0.8, Si: 0.4, Cr: 1.2, Ni: 0.3 },
          mechanicalProperties: { tensileStrength: 650, yieldStrength: 480, elongation: 15 },
          testResults: [{
            id: 'TEST-003',
            testType: 'Impacto',
            result: 'pending',
            value: 45,
            specification: { min: 40, max: 80 },
            timestamp: new Date('2024-01-15T15:00:00'),
            inspector: 'Lab. Crítico'
          }]
        }],
        location: 'Setor C - Linha 3',
        temperature: 75,
        pressure: 148,
        cycleTime: 52,
        energyConsumption: 267,
        certifications: ['ISO 9001', 'AS9100', 'NADCAP'],
        customerOrder: 'ORD-2024-003'
      }
    ];

    const mockEvents: TraceabilityEvent[] = [
      {
        id: 'EVT-001',
        batchId: 'BATCH-001',
        timestamp: new Date('2024-01-15T08:00:00'),
        eventType: 'start',
        description: 'Início da produção do lote BATCH-001',
        userId: 'OP001',
        userName: 'João Silva'
      },
      {
        id: 'EVT-002',
        batchId: 'BATCH-001',
        timestamp: new Date('2024-01-15T12:00:00'),
        eventType: 'quality_check',
        description: 'Inspeção de qualidade realizada - 98% aprovação',
        userId: 'QC001',
        userName: 'Ana Costa',
        data: { qualityScore: 98, defectCount: 2 }
      },
      {
        id: 'EVT-003',
        batchId: 'BATCH-001',
        timestamp: new Date('2024-01-15T16:30:00'),
        eventType: 'completion',
        description: 'Produção concluída com sucesso',
        userId: 'OP001',
        userName: 'João Silva'
      }
    ];

    setBatches(mockBatches);
    setEvents(mockEvents);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'quality_check': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-gray-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Produção';
      case 'quality_check': return 'Controle de Qualidade';
      case 'shipped': return 'Enviado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.castingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.machineName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getBatchEvents = (batchId: string) => {
    return events.filter(event => event.batchId === batchId)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Rastreabilidade de Produção</h2>
          <p className="text-gray-400">Acompanhe lotes, casting IDs e histórico completo de produção</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {}}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por Casting ID, produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">Todos os Status</option>
            <option value="in_progress">Em Produção</option>
            <option value="completed">Concluído</option>
            <option value="quality_check">Controle de Qualidade</option>
            <option value="shipped">Enviado</option>
            <option value="rejected">Rejeitado</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="all">Todos</option>
          </select>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <Package className="w-4 h-4" />
            <span className="text-sm">{filteredBatches.length} lotes encontrados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batches List */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Lotes de Produção</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredBatches.map((batch) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedBatch?.id === batch.id
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedBatch(batch)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(batch.status)}
                    <span className="font-medium text-white">{batch.castingId}</span>
                  </div>
                  <span className="text-xs text-gray-400">{getStatusText(batch.status)}</span>
                </div>
                
                <div className="text-sm text-gray-300 mb-2">{batch.productType}</div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Package className="w-3 h-3" />
                    <span>{batch.quantity} unidades</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{batch.machineName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{batch.operatorName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{batch.qualityScore}% qualidade</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Batch Details */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
          {selectedBatch ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Detalhes do Lote</h3>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors text-sm">
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Ver Completo</span>
                  </button>
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Casting ID</label>
                  <p className="text-white font-medium">{selectedBatch.castingId}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedBatch.status)}
                    <span className="text-white">{getStatusText(selectedBatch.status)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Produto</label>
                  <p className="text-white">{selectedBatch.productType}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Quantidade</label>
                  <p className="text-white">{selectedBatch.quantity} unidades</p>
                </div>
              </div>
              
              {/* Production Metrics */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-3">Métricas de Produção</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Qualidade:</span>
                    <span className="text-white ml-2">{selectedBatch.qualityScore}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Defeitos:</span>
                    <span className="text-white ml-2">{selectedBatch.defectCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Temperatura:</span>
                    <span className="text-white ml-2">{selectedBatch.temperature}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Pressão:</span>
                    <span className="text-white ml-2">{selectedBatch.pressure} bar</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tempo de Ciclo:</span>
                    <span className="text-white ml-2">{selectedBatch.cycleTime}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Energia:</span>
                    <span className="text-white ml-2">{selectedBatch.energyConsumption} kWh</span>
                  </div>
                </div>
              </div>
              
              {/* Material Genealogy */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Genealogia de Materiais
                </h4>
                <div className="space-y-3">
                  {selectedBatch.materialGenealogy.map((material, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{material.supplier}</span>
                        <span className="text-xs text-gray-400">{material.certificationNumber}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Lote:</span>
                          <span className="text-white ml-1">{material.batchNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Resistência:</span>
                          <span className="text-white ml-1">{material.mechanicalProperties.tensileStrength} MPa</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Certifications */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Certificações
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBatch.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full border border-yellow-600/30">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Events Timeline */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-white mb-3">Histórico de Eventos</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {getBatchEvents(selectedBatch.id).map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{event.description}</span>
                          <span className="text-xs text-gray-400">
                            {event.timestamp.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">Por: {event.userName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um lote para ver os detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionTraceability;
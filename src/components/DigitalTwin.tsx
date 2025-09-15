'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Zap, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Layers, 
  Gauge,
  ZoomOut,
  ZoomIn,
  RotateCcw, 
  Fan, 
  Battery, 
  Filter, 
  RefreshCw, 
  Play,
  Pause,
  Box
} from 'lucide-react';

interface MachineComponent {
  id: string;
  name: string;
  type: 'motor' | 'sensor' | 'valve' | 'pump' | 'filter' | 'bearing' | 'belt' | 'battery';
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  temperature: number;
  vibration: number;
  efficiency: number;
  position: { x: number; y: number };
  lastUpdate: Date;
  alerts: ComponentAlert[];
}

interface ComponentAlert {
  id: string;
  type: 'temperature' | 'vibration' | 'efficiency' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
}

interface DigitalTwinMachine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  components: MachineComponent[];
  overallHealth: number;
  energyConsumption: number;
  production: {
    current: number;
    target: number;
    efficiency: number;
  };
  lastUpdate: Date;
}

const DigitalTwin: React.FC = () => {
  const [machines, setMachines] = useState<DigitalTwinMachine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<DigitalTwinMachine | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<MachineComponent | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [isRealTime, setIsRealTime] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Simular dados de máquinas com componentes
    const mockMachines: DigitalTwinMachine[] = [
      {
        id: 'M001',
        name: 'Endireitadeira Principal',
        type: 'CNC Machine',
        location: 'Setor A - Linha 1',
        status: 'running',
        overallHealth: 87,
        energyConsumption: 45.2,
        production: {
          current: 156,
          target: 180,
          efficiency: 86.7
        },
        lastUpdate: new Date(),
        components: [
          {
            id: 'COMP-001',
            name: 'Motor Principal',
            type: 'motor',
            status: 'healthy',
            temperature: 68,
            vibration: 2.1,
            efficiency: 94.2,
            position: { x: 150, y: 100 },
            lastUpdate: new Date(),
            alerts: []
          },
          {
            id: 'COMP-002',
            name: 'Sensor de Temperatura',
            type: 'sensor',
            status: 'warning',
            temperature: 82,
            vibration: 0.5,
            efficiency: 98.1,
            position: { x: 200, y: 80 },
            lastUpdate: new Date(),
            alerts: [
              {
                id: 'ALT-001',
                type: 'temperature',
                severity: 'medium',
                message: 'Temperatura acima do normal',
                timestamp: new Date()
              }
            ]
          },
          {
            id: 'COMP-003',
            name: 'Bomba Hidráulica',
            type: 'pump',
            status: 'healthy',
            temperature: 55,
            vibration: 1.8,
            efficiency: 91.5,
            position: { x: 100, y: 150 },
            lastUpdate: new Date(),
            alerts: []
          },
          {
            id: 'COMP-004',
            name: 'Filtro de Ar',
            type: 'filter',
            status: 'critical',
            temperature: 45,
            vibration: 0.2,
            efficiency: 67.3,
            position: { x: 250, y: 120 },
            lastUpdate: new Date(),
            alerts: [
              {
                id: 'ALT-002',
                type: 'efficiency',
                severity: 'critical',
                message: 'Eficiência abaixo do limite crítico',
                timestamp: new Date()
              }
            ]
          },
          {
            id: 'COMP-005',
            name: 'Rolamento Principal',
            type: 'bearing',
            status: 'warning',
            temperature: 75,
            vibration: 3.2,
            efficiency: 88.9,
            position: { x: 180, y: 140 },
            lastUpdate: new Date(),
            alerts: [
              {
                id: 'ALT-003',
                type: 'vibration',
                severity: 'medium',
                message: 'Vibração elevada detectada',
                timestamp: new Date()
              }
            ]
          }
        ]
      },
      {
        id: 'M002',
        name: 'Linha de Produção B',
        type: 'Assembly Line',
        location: 'Setor B - Linha 2',
        status: 'idle',
        overallHealth: 92,
        energyConsumption: 12.8,
        production: {
          current: 0,
          target: 160,
          efficiency: 0
        },
        lastUpdate: new Date(),
        components: [
          {
            id: 'COMP-006',
            name: 'Motor Secundário',
            type: 'motor',
            status: 'healthy',
            temperature: 42,
            vibration: 0.8,
            efficiency: 0,
            position: { x: 120, y: 90 },
            lastUpdate: new Date(),
            alerts: []
          },
          {
            id: 'COMP-007',
            name: 'Válvula de Controle',
            type: 'valve',
            status: 'healthy',
            temperature: 38,
            vibration: 0.3,
            efficiency: 0,
            position: { x: 170, y: 110 },
            lastUpdate: new Date(),
            alerts: []
          }
        ]
      },
      {
        id: 'M003',
        name: 'Linha de Produção C',
        type: 'Injection Molding',
        location: 'Setor C - Linha 3',
        status: 'maintenance',
        overallHealth: 65,
        energyConsumption: 0,
        production: {
          current: 0,
          target: 200,
          efficiency: 0
        },
        lastUpdate: new Date(),
        components: [
          {
            id: 'COMP-008',
            name: 'Sistema Hidráulico',
            type: 'pump',
            status: 'offline',
            temperature: 25,
            vibration: 0,
            efficiency: 0,
            position: { x: 140, y: 100 },
            lastUpdate: new Date(),
            alerts: [
              {
                id: 'ALT-004',
                type: 'maintenance',
                severity: 'high',
                message: 'Manutenção programada em andamento',
                timestamp: new Date()
              }
            ]
          }
        ]
      }
    ];

    setMachines(mockMachines);
    setSelectedMachine(mockMachines[0]);
  }, []);

  // Atualização em tempo real
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setMachines(prevMachines => 
        prevMachines.map(machine => ({
          ...machine,
          components: machine.components.map(component => ({
            ...component,
            temperature: component.status === 'offline' ? component.temperature : 
              component.temperature + (Math.random() - 0.5) * 2,
            vibration: component.status === 'offline' ? component.vibration : 
              Math.max(0, component.vibration + (Math.random() - 0.5) * 0.2),
            efficiency: component.status === 'offline' ? 0 : 
              Math.max(0, Math.min(100, component.efficiency + (Math.random() - 0.5) * 2)),
            lastUpdate: new Date()
          }))
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'motor': return <Zap className="w-4 h-4" />;
      case 'sensor': return <Gauge className="w-4 h-4" />;
      case 'valve': return <Settings className="w-4 h-4" />;
      case 'pump': return <Fan className="w-4 h-4" />;
      case 'filter': return <Filter className="w-4 h-4" />;
      case 'bearing': return <Activity className="w-4 h-4" />;
      case 'belt': return <Activity className="w-4 h-4" />;
      case 'battery': return <Battery className="w-4 h-4" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500 border-green-400';
      case 'warning': return 'bg-yellow-500 border-yellow-400';
      case 'critical': return 'bg-red-500 border-red-400';
      case 'offline': return 'bg-gray-500 border-gray-400';
      default: return 'bg-gray-500 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'critical': return <XCircle className="w-3 h-3 text-red-400" />;
      case 'offline': return <XCircle className="w-3 h-3 text-gray-400" />;
      default: return <XCircle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getMachineStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-500/20';
      case 'idle': return 'text-yellow-400 bg-yellow-500/20';
      case 'maintenance': return 'text-orange-400 bg-orange-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Monitor className="w-8 h-8 text-gray-500" />
            <Layers className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Digital Twin - Visualização 3D</h2>
            <p className="text-gray-400">Monitoramento visual em tempo real dos componentes das máquinas</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              isRealTime 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isRealTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRealTime ? 'Pausar' : 'Tempo Real'}</span>
          </button>
          
          <button 
            onClick={() => setViewMode(viewMode === 'overview' ? 'detailed' : 'overview')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{viewMode === 'overview' ? 'Visão Detalhada' : 'Visão Geral'}</span>
          </button>
          
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Machine Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <motion.div
            key={machine.id}
            onClick={() => setSelectedMachine(machine)}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedMachine?.id === machine.id
                ? 'bg-gray-500/10 border-gray-500/30'
                : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Monitor className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{machine.name}</h4>
                  <p className="text-sm text-gray-400">{machine.location}</p>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getMachineStatusColor(machine.status)}`}>
                {machine.status === 'running' ? 'Operando' :
                 machine.status === 'idle' ? 'Parada' :
                 machine.status === 'maintenance' ? 'Manutenção' : 'Offline'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Saúde Geral</p>
                <p className="text-lg font-bold text-white">{machine.overallHealth}%</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Componentes</p>
                <p className="text-lg font-bold text-white">{machine.components.length}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Energia</p>
                <p className="text-lg font-bold text-white">{machine.energyConsumption.toFixed(1)} kW</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Eficiência</p>
                <p className="text-lg font-bold text-white">{machine.production.efficiency.toFixed(1)}%</p>
              </div>
            </div>
            
            {/* Component Status Summary */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {['healthy', 'warning', 'critical', 'offline'].map(status => {
                  const count = machine.components.filter(c => c.status === status).length;
                  if (count === 0) return null;
                  return (
                    <div key={status} className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} title={`${count} ${status}`}></div>
                  );
                })}
              </div>
              <span className="text-xs text-gray-400">
                {machine.components.filter(c => c.status === 'healthy').length} saudáveis, 
                {machine.components.filter(c => c.status !== 'healthy').length} com alertas
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Digital Twin Visualization */}
      {selectedMachine && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Machine View */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedMachine.name} - Vista Digital</h3>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">{Math.round(zoom * 100)}%</span>
                <button 
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Machine Schematic */}
            <div className="relative bg-gray-900/50 rounded-lg p-4 h-96 overflow-hidden">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 400 300"
                className="transition-transform duration-300"
                style={{ 
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                {/* Machine Base */}
                <rect x="50" y="200" width="300" height="80" fill="#374151" stroke="#6B7280" strokeWidth="2" rx="8" />
                <text x="200" y="245" textAnchor="middle" fill="#9CA3AF" fontSize="12">{selectedMachine.name}</text>
                
                {/* Components */}
                {selectedMachine.components.map((component) => (
                  <g key={component.id}>
                    {/* Component Circle */}
                    <circle
                      cx={component.position.x}
                      cy={component.position.y}
                      r="20"
                      className={`cursor-pointer transition-all ${getStatusColor(component.status)} opacity-80 hover:opacity-100`}
                      onClick={() => setSelectedComponent(component)}
                    />
                    
                    {/* Component Icon */}
                    <foreignObject
                      x={component.position.x - 8}
                      y={component.position.y - 8}
                      width="16"
                      height="16"
                      className="pointer-events-none"
                    >
                      <div className="text-white">
                        {getComponentIcon(component.type)}
                      </div>
                    </foreignObject>
                    
                    {/* Status Indicator */}
                    <circle
                      cx={component.position.x + 12}
                      cy={component.position.y - 12}
                      r="6"
                      className={getStatusColor(component.status)}
                    />
                    
                    {/* Component Label */}
                    <text 
                      x={component.position.x} 
                      y={component.position.y + 35} 
                      textAnchor="middle" 
                      fill="#9CA3AF" 
                      fontSize="10"
                      className="pointer-events-none"
                    >
                      {component.name.split(' ')[0]}
                    </text>
                    
                    {/* Alert Indicator */}
                    {component.alerts.length > 0 && (
                      <circle
                        cx={component.position.x - 12}
                        cy={component.position.y - 12}
                        r="4"
                        fill="#EF4444"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                ))}
                
                {/* Connection Lines */}
                {selectedMachine.components.map((component, index) => {
                  if (index === 0) return null;
                  const prevComponent = selectedMachine.components[index - 1];
                  return (
                    <line
                      key={`line-${component.id}`}
                      x1={prevComponent.position.x}
                      y1={prevComponent.position.y}
                      x2={component.position.x}
                      y2={component.position.y}
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Component Details Panel */}
          <div className="space-y-6">
            {/* Machine Info */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Informações da Máquina</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getMachineStatusColor(selectedMachine.status)}`}>
                    {selectedMachine.status === 'running' ? 'Operando' :
                     selectedMachine.status === 'idle' ? 'Parada' :
                     selectedMachine.status === 'maintenance' ? 'Manutenção' : 'Offline'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Saúde Geral:</span>
                  <span className="text-white font-medium">{selectedMachine.overallHealth}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Consumo de Energia:</span>
                  <span className="text-white font-medium">{selectedMachine.energyConsumption.toFixed(1)} kW</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Produção Atual:</span>
                  <span className="text-white font-medium">{selectedMachine.production.current} pcs/h</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Meta de Produção:</span>
                  <span className="text-white font-medium">{selectedMachine.production.target} pcs/h</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Eficiência:</span>
                  <span className="text-white font-medium">{selectedMachine.production.efficiency.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Component Details */}
            {selectedComponent && (
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Detalhes do Componente</h3>
                  <button 
                    onClick={() => setSelectedComponent(null)}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(selectedComponent.status)}`}>
                      {getComponentIcon(selectedComponent.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{selectedComponent.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{selectedComponent.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Temperatura</p>
                      <p className="text-lg font-bold text-white">{selectedComponent.temperature.toFixed(1)}°C</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Vibração</p>
                      <p className="text-lg font-bold text-white">{selectedComponent.vibration.toFixed(1)} mm/s</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Eficiência</p>
                      <p className="text-lg font-bold text-white">{selectedComponent.efficiency.toFixed(1)}%</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(selectedComponent.status)}
                        <span className="text-sm text-white capitalize">{selectedComponent.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedComponent.alerts.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">Alertas Ativos</h5>
                      <div className="space-y-2">
                        {selectedComponent.alerts.map((alert) => (
                          <div key={alert.id} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                              <span className="text-sm font-medium text-red-400 capitalize">{alert.severity}</span>
                            </div>
                            <p className="text-sm text-white">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {alert.timestamp.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Components List */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Lista de Componentes</h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedMachine.components.map((component) => (
                  <div 
                    key={component.id}
                    onClick={() => setSelectedComponent(component)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedComponent?.id === component.id
                        ? 'bg-gray-500/20 border border-gray-500/30'
                        : 'bg-gray-700/30 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${getStatusColor(component.status)}`}>
                          {getComponentIcon(component.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{component.name}</p>
                          <p className="text-xs text-gray-400">{component.efficiency.toFixed(1)}% eficiência</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(component.status)}
                        {component.alerts.length > 0 && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {component.alerts.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTwin;
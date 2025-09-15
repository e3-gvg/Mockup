'use client';

// Tipos para os controladores Beckhoff
export interface BeckhoffController {
  id: string;
  model: 'CX7000';
  serialNumber: string;
  ipAddress: string;
  mqttTopic: string;
  firmwareVersion: string;
  lastConnection: Date;
  status: 'online' | 'offline' | 'error';
}

// Tipos para sensores conectados
export interface Sensor {
  id: string;
  type: 'temperature' | 'vibration' | 'pressure' | 'current' | 'voltage' | 'flow' | 'position';
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  currentValue?: number;
  lastUpdate?: Date;
  status: 'active' | 'inactive' | 'error';
}

// Tipos para os ativos
export interface Asset {
  id: string;
  modelo: string;
  tipo: string;
  codigo: string;
  matricula: string;
  apelido: string;
  name?: string;
  location?: string;
  localizacao?: string;
  efficiency?: number;
  status: 'ativo' | 'inativo' | 'manutencao';
  createdAt: string;
  updatedAt: string;
  // Integração com sistema IoT
  controller?: BeckhoffController;
  sensors?: Sensor[];
  mqttTopics?: string[];
}

// Tipos para dados de sensores vinculados às máquinas
export interface MachineData {
  id: string;
  assetId: string;
  name: string;
  type: string;
  matricula?: string;
  apelido?: string;
  modelo?: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  temperature: number;
  vibration: number;
  energyConsumption: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  status: 'excellent' | 'good' | 'needs-attention' | 'offline';
  isOnline: boolean;
  alerts: number;
}

// Função para buscar ativos do localStorage ou usar dados mock como fallback
export function getAssetsFromStorage(): Asset[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('assets');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Erro ao carregar ativos do localStorage:', error);
      }
    }
  }
  
  // Dados mock das máquinas Schnell Brasil (fallback)
  return [
    {
      id: '1',
      modelo: 'Serie 16 Super',
      tipo: 'Endireitadeira',
      codigo: 'END001',
      matricula: 'SCH-2024-001',
      apelido: 'Endireitadeira Principal',
      status: 'ativo',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      controller: {
        id: 'CX7000-001',
        model: 'CX7000',
        serialNumber: 'BK7000-001-2024',
        ipAddress: '192.168.1.101',
        mqttTopic: 'schnell/endireitadeira/001',
        firmwareVersion: '4.7.2',
        lastConnection: new Date(),
        status: 'online'
      },
      sensors: [
        { id: 'TEMP-001', type: 'temperature', name: 'Temperatura Motor', unit: '°C', minValue: 0, maxValue: 100, currentValue: 45, status: 'active' },
        { id: 'VIB-001', type: 'vibration', name: 'Vibração Eixo Principal', unit: 'mm/s', minValue: 0, maxValue: 50, currentValue: 12, status: 'active' },
        { id: 'CURR-001', type: 'current', name: 'Corrente Motor', unit: 'A', minValue: 0, maxValue: 100, currentValue: 35, status: 'active' }
      ],
      mqttTopics: ['schnell/endireitadeira/001/temperature', 'schnell/endireitadeira/001/vibration', 'schnell/endireitadeira/001/current']
    },
    {
      id: '2',
      modelo: 'Serie 16 BD',
      tipo: 'Estribadeira',
      codigo: 'EST001',
      matricula: 'SCH-2024-002',
      apelido: 'Estribadeira Automática',
      status: 'ativo',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-21',
      controller: {
        id: 'CX7000-002',
        model: 'CX7000',
        serialNumber: 'BK7000-002-2024',
        ipAddress: '192.168.1.102',
        mqttTopic: 'schnell/estribadeira/002',
        firmwareVersion: '4.7.2',
        lastConnection: new Date(),
        status: 'online'
      },
      sensors: [
        { id: 'TEMP-002', type: 'temperature', name: 'Temperatura Hidráulico', unit: '°C', minValue: 0, maxValue: 80, currentValue: 42, status: 'active' },
        { id: 'PRESS-002', type: 'pressure', name: 'Pressão Hidráulica', unit: 'bar', minValue: 0, maxValue: 300, currentValue: 180, status: 'active' },
        { id: 'POS-002', type: 'position', name: 'Posição Mandril', unit: 'mm', minValue: 0, maxValue: 500, currentValue: 250, status: 'active' }
      ],
      mqttTopics: ['schnell/estribadeira/002/temperature', 'schnell/estribadeira/002/pressure', 'schnell/estribadeira/002/position']
    },
    {
      id: '3',
      modelo: 'DBX 16',
      tipo: 'Dobradeira',
      codigo: 'DOB001',
      matricula: 'SCH-2024-003',
      apelido: 'Dobradeira Bi-direcional',
      status: 'manutencao',
      createdAt: '2024-01-17',
      updatedAt: '2024-01-22',
      controller: {
        id: 'CX7000-003',
        model: 'CX7000',
        serialNumber: 'BK7000-003-2024',
        ipAddress: '192.168.1.103',
        mqttTopic: 'schnell/dobradeira/003',
        firmwareVersion: '4.7.2',
        lastConnection: new Date(Date.now() - 300000), // 5 minutos atrás
        status: 'offline'
      },
      sensors: [
        { id: 'TEMP-003', type: 'temperature', name: 'Temperatura Servo Motor', unit: '°C', minValue: 0, maxValue: 90, currentValue: 0, status: 'inactive' },
        { id: 'VIB-003', type: 'vibration', name: 'Vibração Mesa', unit: 'mm/s', minValue: 0, maxValue: 30, currentValue: 0, status: 'inactive' },
        { id: 'FORCE-003', type: 'pressure', name: 'Força Dobra', unit: 'kN', minValue: 0, maxValue: 500, currentValue: 0, status: 'inactive' }
      ],
      mqttTopics: ['schnell/dobradeira/003/temperature', 'schnell/dobradeira/003/vibration', 'schnell/dobradeira/003/force']
    },
    {
      id: '4',
      modelo: 'CX 25',
      tipo: 'Cortadeira',
      codigo: 'COR001',
      matricula: 'SCH-2024-004',
      apelido: 'Cortadeira Hidráulica',
      status: 'inativo',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-23',
      controller: {
        id: 'CX7000-004',
        model: 'CX7000',
        serialNumber: 'BK7000-004-2024',
        ipAddress: '192.168.1.104',
        mqttTopic: 'schnell/cortadeira/004',
        firmwareVersion: '4.7.2',
        lastConnection: new Date(Date.now() - 86400000), // 1 dia atrás
        status: 'offline'
      },
      sensors: [
        { id: 'TEMP-004', type: 'temperature', name: 'Temperatura Lâmina', unit: '°C', minValue: 0, maxValue: 120, currentValue: 0, status: 'inactive' },
        { id: 'PRESS-004', type: 'pressure', name: 'Pressão Corte', unit: 'bar', minValue: 0, maxValue: 400, currentValue: 0, status: 'inactive' },
        { id: 'VIB-004', type: 'vibration', name: 'Vibração Lâmina', unit: 'mm/s', minValue: 0, maxValue: 25, currentValue: 0, status: 'inactive' }
      ],
      mqttTopics: ['schnell/cortadeira/004/temperature', 'schnell/cortadeira/004/pressure', 'schnell/cortadeira/004/vibration']
    },
    {
      id: '5',
      modelo: 'Serie 16 3D',
      tipo: 'Estribadeira',
      codigo: 'EST002',
      matricula: 'SCH-2024-005',
      apelido: 'Estribadeira 3D',
      status: 'ativo',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-24',
      controller: {
        id: 'CX7000-005',
        model: 'CX7000',
        serialNumber: 'BK7000-005-2024',
        ipAddress: '192.168.1.105',
        mqttTopic: 'schnell/estribadeira3d/005',
        firmwareVersion: '4.7.2',
        lastConnection: new Date(),
        status: 'online'
      },
      sensors: [
        { id: 'TEMP-005', type: 'temperature', name: 'Temperatura Sistema', unit: '°C', minValue: 0, maxValue: 85, currentValue: 38, status: 'active' },
        { id: 'POS-005-X', type: 'position', name: 'Posição Eixo X', unit: 'mm', minValue: 0, maxValue: 1000, currentValue: 450, status: 'active' },
        { id: 'POS-005-Y', type: 'position', name: 'Posição Eixo Y', unit: 'mm', minValue: 0, maxValue: 800, currentValue: 320, status: 'active' },
        { id: 'POS-005-Z', type: 'position', name: 'Posição Eixo Z', unit: 'mm', minValue: 0, maxValue: 600, currentValue: 150, status: 'active' }
      ],
      mqttTopics: ['schnell/estribadeira3d/005/temperature', 'schnell/estribadeira3d/005/position_x', 'schnell/estribadeira3d/005/position_y', 'schnell/estribadeira3d/005/position_z']
    },
    {
      id: '6',
      modelo: 'Reta Line',
      tipo: 'Central de Corte e Dobra',
      codigo: 'CCD001',
      matricula: 'SCH-2024-006',
      apelido: 'Central Principal',
      status: 'ativo',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-25',
      controller: {
        id: 'CX7000-006',
        model: 'CX7000',
        serialNumber: 'BK7000-006-2024',
        ipAddress: '192.168.1.106',
        mqttTopic: 'schnell/central/006',
        firmwareVersion: '4.7.2',
        lastConnection: new Date(),
        status: 'online'
      },
      sensors: [
        { id: 'TEMP-006-1', type: 'temperature', name: 'Temperatura Corte', unit: '°C', minValue: 0, maxValue: 100, currentValue: 52, status: 'active' },
        { id: 'TEMP-006-2', type: 'temperature', name: 'Temperatura Dobra', unit: '°C', minValue: 0, maxValue: 100, currentValue: 48, status: 'active' },
        { id: 'FLOW-006', type: 'flow', name: 'Fluxo Refrigeração', unit: 'L/min', minValue: 0, maxValue: 50, currentValue: 25, status: 'active' },
        { id: 'PRESS-006', type: 'pressure', name: 'Pressão Ar Comprimido', unit: 'bar', minValue: 0, maxValue: 10, currentValue: 6.5, status: 'active' }
      ],
      mqttTopics: ['schnell/central/006/temperature_corte', 'schnell/central/006/temperature_dobra', 'schnell/central/006/flow', 'schnell/central/006/pressure']
    }
  ];
}

const mockAssets: Asset[] = getAssetsFromStorage();

// Função para gerar dados de sensores baseados nos ativos
function generateMachineData(asset: Asset): MachineData {
  const baseOEE = asset.status === 'ativo' ? 75 + Math.random() * 20 : 
                  asset.status === 'manutencao' ? 40 + Math.random() * 30 : 0;
  
  const availability = asset.status === 'ativo' ? 85 + Math.random() * 10 : 
                      asset.status === 'manutencao' ? 60 + Math.random() * 25 : 0;
  
  const performance = asset.status === 'ativo' ? 80 + Math.random() * 15 : 
                     asset.status === 'manutencao' ? 50 + Math.random() * 30 : 0;
  
  const quality = asset.status === 'ativo' ? 90 + Math.random() * 8 : 
                 asset.status === 'manutencao' ? 70 + Math.random() * 20 : 0;

  const getStatus = (oee: number): 'excellent' | 'good' | 'needs-attention' | 'offline' => {
    if (asset.status === 'inativo') return 'offline';
    if (oee >= 85) return 'excellent';
    if (oee >= 75) return 'good';
    return 'needs-attention';
  };

  return {
    id: asset.id,
    assetId: asset.id,
    name: asset.apelido,
    type: asset.tipo,
    oee: Math.round(baseOEE),
    availability: Math.round(availability),
    performance: Math.round(performance),
    quality: Math.round(quality),
    temperature: 65 + Math.random() * 20,
    vibration: 1 + Math.random() * 3,
    energyConsumption: 500 + Math.random() * 300,
    lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
    status: getStatus(baseOEE),
    isOnline: asset.status !== 'inativo',
    alerts: asset.status === 'manutencao' ? Math.floor(Math.random() * 3) + 1 : 
           asset.status === 'ativo' ? Math.floor(Math.random() * 2) : 0
  };
}

// Serviço para gerenciar dados dos ativos
export class AssetsService {
  private static instance: AssetsService;
  private assets: Asset[] = mockAssets;
  private machineData: Map<string, MachineData> = new Map();

  private constructor() {
    this.initializeMachineData();
  }

  public static getInstance(): AssetsService {
    if (!AssetsService.instance) {
      AssetsService.instance = new AssetsService();
    }
    return AssetsService.instance;
  }

  private initializeMachineData() {
    this.assets.forEach(asset => {
      const machineData = generateMachineData(asset);
      this.machineData.set(asset.id, machineData);
    });
  }

  // Buscar todos os ativos
  public getAssets(): Asset[] {
    return [...this.assets];
  }

  // Buscar ativo por ID
  public getAssetById(id: string): Asset | undefined {
    return this.assets.find(asset => asset.id === id);
  }

  // Alias para getAssets (compatibilidade)
  public getAllAssets(): Asset[] {
    return this.getAssets();
  }

  // Buscar ativo por matrícula
  public getAssetByMatricula(matricula: string): Asset | undefined {
    return this.assets.find(asset => asset.matricula === matricula);
  }

  // Buscar dados de máquina por ID do ativo
  public getMachineData(assetId: string): MachineData | undefined {
    return this.machineData.get(assetId);
  }

  // Buscar todos os dados de máquinas
  public getAllMachineData(): MachineData[] {
    return Array.from(this.machineData.values());
  }

  // Buscar máquinas ativas
  public getActiveMachines(): MachineData[] {
    return this.getAllMachineData().filter(machine => machine.isOnline);
  }

  // Buscar máquinas por status
  public getMachinesByStatus(status: 'excellent' | 'good' | 'needs-attention' | 'offline'): MachineData[] {
    return this.getAllMachineData().filter(machine => machine.status === status);
  }

  // Calcular OEE médio
  public getAverageOEE(): number {
    const activeMachines = this.getActiveMachines();
    if (activeMachines.length === 0) return 0;
    
    const totalOEE = activeMachines.reduce((sum, machine) => sum + machine.oee, 0);
    return Math.round(totalOEE / activeMachines.length);
  }

  // Calcular disponibilidade média
  public getAverageAvailability(): number {
    const activeMachines = this.getActiveMachines();
    if (activeMachines.length === 0) return 0;
    
    const totalAvailability = activeMachines.reduce((sum, machine) => sum + machine.availability, 0);
    return Math.round(totalAvailability / activeMachines.length);
  }

  // Calcular performance média
  public getAveragePerformance(): number {
    const activeMachines = this.getActiveMachines();
    if (activeMachines.length === 0) return 0;
    
    const totalPerformance = activeMachines.reduce((sum, machine) => sum + machine.performance, 0);
    return Math.round(totalPerformance / activeMachines.length);
  }

  // Calcular qualidade média
  public getAverageQuality(): number {
    const activeMachines = this.getActiveMachines();
    if (activeMachines.length === 0) return 0;
    
    const totalQuality = activeMachines.reduce((sum, machine) => sum + machine.quality, 0);
    return Math.round(totalQuality / activeMachines.length);
  }

  // Buscar máquinas que precisam de manutenção
  public getMachinesNeedingMaintenance(): MachineData[] {
    const now = new Date();
    return this.getAllMachineData().filter(machine => 
      machine.nextMaintenance <= now || machine.status === 'needs-attention'
    );
  }

  // Atualizar dados de uma máquina (simula dados em tempo real)
  public updateMachineData(assetId: string): void {
    const asset = this.getAssetById(assetId);
    if (asset) {
      const newData = generateMachineData(asset);
      this.machineData.set(assetId, newData);
    }
  }

  // Simular atualização de dados em tempo real
  public startRealTimeUpdates(callback?: () => void): NodeJS.Timeout {
    return setInterval(() => {
      // Atualiza dados de algumas máquinas aleatoriamente
      const activeAssets = this.assets.filter(asset => asset.status === 'ativo');
      const randomAsset = activeAssets[Math.floor(Math.random() * activeAssets.length)];
      
      if (randomAsset) {
        this.updateMachineData(randomAsset.id);
        callback?.();
      }
    }, 5000); // Atualiza a cada 5 segundos
  }
}

// Instância singleton do serviço
export const assetsService = AssetsService.getInstance();
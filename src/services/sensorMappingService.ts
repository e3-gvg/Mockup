import { assetsService, Asset, MachineData } from './assetsService';

// Interface para dados de sensores IoT
export interface SensorData {
  id: string;
  machineId: string;
  sensorType: 'temperature' | 'vibration' | 'pressure' | 'current' | 'voltage' | 'flow' | 'humidity';
  sensorName: string;
  value: number;
  unit: string;
  timestamp: Date;
  quality: 'good' | 'uncertain' | 'bad';
  metadata?: Record<string, unknown>;
}

// Interface para componentes de máquina com sensores
export interface MachineComponent {
  id: string;
  name: string;
  type: 'motor' | 'sensor' | 'valve' | 'pump' | 'filter' | 'bearing' | 'belt' | 'battery';
  machineId: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  temperature: number;
  vibration: number;
  efficiency: number;
  position: { x: number; y: number };
  lastUpdate: Date;
  sensors: string[]; // IDs dos sensores associados
}

// Interface para mapeamento de máquina com sensores
export interface MachineWithSensors extends MachineData {
  matricula: string;
  components: MachineComponent[];
  sensorData: SensorData[];
  overallHealth: number;
  energyConsumption: number;
  lastSensorUpdate: Date;
}

// Interface para alertas de sensores
export interface SensorAlert {
  id: string;
  machineId: string;
  machineName: string;
  sensorId: string;
  sensorName: string;
  sensorType: string;
  alertType: 'threshold' | 'anomaly' | 'offline' | 'quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

class SensorMappingService {
  private static instance: SensorMappingService;
  private sensorDataCache: Map<string, SensorData[]> = new Map();
  private machineComponentsCache: Map<string, MachineComponent[]> = new Map();
  private alertsCache: SensorAlert[] = [];

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): SensorMappingService {
    if (!SensorMappingService.instance) {
      SensorMappingService.instance = new SensorMappingService();
    }
    return SensorMappingService.instance;
  }

  // Inicializa dados mock para demonstração
  private initializeMockData(): void {
    const assets = assetsService.getAllAssets();
    
    assets.forEach((asset: Asset) => {
      // Gerar componentes para cada máquina
      const components = this.generateMachineComponents(asset);
      this.machineComponentsCache.set(asset.matricula, components);
      
      // Gerar dados de sensores para cada componente
      const sensorData = this.generateSensorData(asset, components);
      this.sensorDataCache.set(asset.matricula, sensorData);
    });

    // Gerar alguns alertas mock
    this.generateMockAlerts();
  }

  // Gera componentes mock para uma máquina
  private generateMachineComponents(asset: Asset): MachineComponent[] {
    const componentTypes: MachineComponent['type'][] = ['motor', 'bearing', 'belt', 'sensor', 'valve', 'pump'];
    const components: MachineComponent[] = [];

    componentTypes.forEach((type, index) => {
      const component: MachineComponent = {
        id: `${asset.matricula}_${type}_${index + 1}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`,
        type,
        machineId: asset.matricula,
        status: asset.status === 'ativo' ? 
          (Math.random() > 0.8 ? 'warning' : 'healthy') : 
          (asset.status === 'manutencao' ? 'critical' : 'offline'),
        temperature: 20 + Math.random() * 60,
        vibration: Math.random() * 10,
        efficiency: asset.status === 'ativo' ? 80 + Math.random() * 20 : 40 + Math.random() * 40,
        position: { x: Math.random() * 400, y: Math.random() * 300 },
        lastUpdate: new Date(),
        sensors: [`sensor_${asset.matricula}_${type}_temp`, `sensor_${asset.matricula}_${type}_vib`]
      };
      components.push(component);
    });

    return components;
  }

  // Gera dados de sensores mock
  private generateSensorData(asset: Asset, components: MachineComponent[]): SensorData[] {
    const sensorData: SensorData[] = [];
    const now = new Date();

    components.forEach(component => {
      // Sensor de temperatura
      sensorData.push({
        id: `sensor_${asset.matricula}_${component.type}_temp`,
        machineId: asset.matricula,
        sensorType: 'temperature',
        sensorName: `${component.name} - Temperatura`,
        value: component.temperature,
        unit: '°C',
        timestamp: now,
        quality: component.status === 'offline' ? 'bad' : 'good',
        metadata: {
          componentId: component.id,
          componentType: component.type,
          location: asset.localizacao || 'Não informado'
        }
      });

      // Sensor de vibração
      sensorData.push({
        id: `sensor_${asset.matricula}_${component.type}_vib`,
        machineId: asset.matricula,
        sensorType: 'vibration',
        sensorName: `${component.name} - Vibração`,
        value: component.vibration,
        unit: 'mm/s',
        timestamp: now,
        quality: component.status === 'offline' ? 'bad' : 'good',
        metadata: {
          componentId: component.id,
          componentType: component.type,
          location: asset.localizacao || 'Não informado'
        }
      });
    });

    return sensorData;
  }

  // Gera alertas mock
  private generateMockAlerts(): void {
    const assets = assetsService.getAllAssets();
    
    assets.forEach((asset: Asset) => {
      const components = this.machineComponentsCache.get(asset.matricula) || [];
      
      components.forEach(component => {
        if (component.status === 'warning' || component.status === 'critical') {
          const alert: SensorAlert = {
            id: `alert_${component.id}_${Date.now()}`,
            machineId: asset.matricula,
            machineName: asset.apelido || asset.modelo,
            sensorId: component.sensors[0],
            sensorName: `${component.name} - Temperatura`,
            sensorType: 'temperature',
            alertType: 'threshold',
            severity: component.status === 'critical' ? 'critical' : 'medium',
            message: `${component.name} apresenta ${component.status === 'critical' ? 'temperatura crítica' : 'temperatura elevada'}`,
            value: component.temperature,
            threshold: 70,
            timestamp: new Date(),
            acknowledged: false
          };
          this.alertsCache.push(alert);
        }
      });
    });
  }

  // Obtém máquina com dados de sensores
  public getMachineWithSensors(machineId: string): MachineWithSensors | null {
    const asset = assetsService.getAssetByMatricula(machineId);
    if (!asset) return null;

    const machineData = assetsService.getMachineData(machineId);
    if (!machineData) return null;

    const components = this.machineComponentsCache.get(machineId) || [];
    const sensorData = this.sensorDataCache.get(machineId) || [];

    // Calcular saúde geral baseada nos componentes
    const overallHealth = components.length > 0 ? 
      components.reduce((sum, comp) => {
        const healthValue = comp.status === 'healthy' ? 100 : 
                           comp.status === 'warning' ? 70 : 
                           comp.status === 'critical' ? 30 : 0;
        return sum + healthValue;
      }, 0) / components.length : 100;

    // Calcular consumo de energia baseado na eficiência
    const energyConsumption = components.reduce((sum, comp) => {
      return sum + (100 - comp.efficiency) * 0.5; // Simulação simples
    }, 0);

    const lastSensorUpdate = sensorData.length > 0 ? 
      new Date(Math.max(...sensorData.map(s => s.timestamp.getTime()))) : new Date();

    return {
      ...machineData,
      matricula: machineId,
      components,
      sensorData,
      overallHealth,
      energyConsumption,
      lastSensorUpdate
    };
  }

  // Obtém todas as máquinas com dados de sensores
  public getAllMachinesWithSensors(): MachineWithSensors[] {
    const assets = assetsService.getAllAssets();
    return assets.map((asset: Asset) => this.getMachineWithSensors(asset.matricula))
                 .filter((machine: MachineWithSensors | null) => machine !== null) as MachineWithSensors[];
  }

  // Obtém dados de sensores por máquina
  public getSensorDataByMachine(machineId: string): SensorData[] {
    return this.sensorDataCache.get(machineId) || [];
  }

  // Obtém componentes por máquina
  public getComponentsByMachine(machineId: string): MachineComponent[] {
    return this.machineComponentsCache.get(machineId) || [];
  }

  // Obtém alertas ativos
  public getActiveAlerts(): SensorAlert[] {
    return this.alertsCache.filter(alert => !alert.acknowledged);
  }

  // Obtém alertas por máquina
  public getAlertsByMachine(machineId: string): SensorAlert[] {
    return this.alertsCache.filter(alert => alert.machineId === machineId);
  }

  // Reconhece um alerta
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alertsCache.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // Simula atualização de dados de sensores em tempo real
  public updateSensorData(machineId: string): void {
    const components = this.machineComponentsCache.get(machineId);
    if (!components) return;

    const updatedSensorData: SensorData[] = [];
    const now = new Date();

    components.forEach(component => {
      // Atualizar valores dos componentes
      component.temperature += (Math.random() - 0.5) * 2;
      component.vibration += (Math.random() - 0.5) * 0.5;
      component.efficiency += (Math.random() - 0.5) * 1;
      component.lastUpdate = now;

      // Atualizar dados dos sensores
      const tempSensor: SensorData = {
        id: `sensor_${machineId}_${component.type}_temp`,
        machineId,
        sensorType: 'temperature',
        sensorName: `${component.name} - Temperatura`,
        value: component.temperature,
        unit: '°C',
        timestamp: now,
        quality: component.status === 'offline' ? 'bad' : 'good',
        metadata: {
          componentId: component.id,
          componentType: component.type
        }
      };

      const vibSensor: SensorData = {
        id: `sensor_${machineId}_${component.type}_vib`,
        machineId,
        sensorType: 'vibration',
        sensorName: `${component.name} - Vibração`,
        value: component.vibration,
        unit: 'mm/s',
        timestamp: now,
        quality: component.status === 'offline' ? 'bad' : 'good',
        metadata: {
          componentId: component.id,
          componentType: component.type
        }
      };

      updatedSensorData.push(tempSensor, vibSensor);
    });

    this.sensorDataCache.set(machineId, updatedSensorData);
  }

  // Obtém estatísticas de sensores
  public getSensorStatistics(): {
    totalSensors: number;
    activeSensors: number;
    offlineSensors: number;
    alertsCount: number;
    machinesWithIssues: number;
  } {
    let totalSensors = 0;
    let activeSensors = 0;
    let offlineSensors = 0;
    let machinesWithIssues = 0;

    this.sensorDataCache.forEach((sensorData, machineId) => {
      totalSensors += sensorData.length;
      
      const activeSensorCount = sensorData.filter(s => s.quality === 'good').length;
      const offlineSensorCount = sensorData.filter(s => s.quality === 'bad').length;
      
      activeSensors += activeSensorCount;
      offlineSensors += offlineSensorCount;
      
      const components = this.machineComponentsCache.get(machineId) || [];
      const hasIssues = components.some(c => c.status === 'warning' || c.status === 'critical');
      if (hasIssues) machinesWithIssues++;
    });

    return {
      totalSensors,
      activeSensors,
      offlineSensors,
      alertsCount: this.getActiveAlerts().length,
      machinesWithIssues
    };
  }
}

export const sensorMappingService = SensorMappingService.getInstance();
export default sensorMappingService;
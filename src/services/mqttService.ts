'use client';

import { Asset, BeckhoffController, Sensor } from './assetsService';

// Interface para dados MQTT recebidos
export interface MqttMessage {
  topic: string;
  payload: any;
  timestamp: Date;
  machineId: string;
  sensorId: string;
}

// Interface para dados processados dos sensores
export interface SensorData {
  sensorId: string;
  machineId: string;
  machineName: string;
  sensorName: string;
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
  thresholds: {
    min: number;
    max: number;
    warningMin?: number;
    warningMax?: number;
  };
}

// Interface para alertas gerados
export interface MqttAlert {
  id: string;
  machineId: string;
  machineName: string;
  sensorId: string;
  sensorName: string;
  type: 'threshold_exceeded' | 'sensor_offline' | 'communication_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

class MqttService {
  private client: any = null;
  private isConnected: boolean = false;
  private subscribers: Map<string, (data: SensorData) => void> = new Map();
  private alertSubscribers: Map<string, (alert: MqttAlert) => void> = new Map();
  private sensorDataHistory: Map<string, SensorData[]> = new Map();
  private activeAlerts: MqttAlert[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMqttClient();
    }
  }

  private async initializeMqttClient() {
    try {
      // Simulação de cliente MQTT (em produção, usar biblioteca como mqtt.js)
      console.log('Inicializando cliente MQTT para controladores Beckhoff CX7000...');
      
      // Simular conexão
      setTimeout(() => {
        this.isConnected = true;
        console.log('Conectado ao broker MQTT');
        this.startDataSimulation();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao conectar ao MQTT:', error);
    }
  }

  // Simular dados dos sensores (em produção, seria substituído por dados reais do MQTT)
  private startDataSimulation() {
    setInterval(() => {
      this.simulateSensorData();
    }, 2000); // Atualizar a cada 2 segundos
  }

  private simulateSensorData() {
    // Simular dados para cada máquina ativa
    const machines = this.getActiveMachines();
    
    machines.forEach(machine => {
      if (machine.controller?.status === 'online' && machine.sensors) {
        machine.sensors.forEach(sensor => {
          if (sensor.status === 'active') {
            const sensorData = this.generateSensorData(machine, sensor);
            this.processSensorData(sensorData);
          }
        });
      }
    });
  }

  private getActiveMachines(): Asset[] {
    // Em produção, buscar do serviço de ativos
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('assets');
      if (stored) {
        try {
          return JSON.parse(stored).filter((asset: Asset) => asset.status === 'ativo');
        } catch (error) {
          console.warn('Erro ao carregar ativos:', error);
        }
      }
    }
    return [];
  }

  private generateSensorData(machine: Asset, sensor: Sensor): SensorData {
    // Gerar valor aleatório dentro da faixa do sensor com alguma variação
    const range = sensor.maxValue - sensor.minValue;
    const baseValue = sensor.currentValue || (sensor.minValue + range * 0.5);
    const variation = range * 0.1; // 10% de variação
    const newValue = baseValue + (Math.random() - 0.5) * variation;
    
    // Determinar status baseado nos thresholds
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (newValue > sensor.maxValue * 0.9 || newValue < sensor.minValue * 1.1) {
      status = 'warning';
    }
    if (newValue > sensor.maxValue || newValue < sensor.minValue) {
      status = 'critical';
    }

    return {
      sensorId: sensor.id,
      machineId: machine.id,
      machineName: machine.apelido,
      sensorName: sensor.name,
      value: Math.round(newValue * 100) / 100,
      unit: sensor.unit,
      timestamp: new Date(),
      status,
      thresholds: {
        min: sensor.minValue,
        max: sensor.maxValue,
        warningMin: sensor.minValue * 1.1,
        warningMax: sensor.maxValue * 0.9
      }
    };
  }

  private processSensorData(data: SensorData) {
    // Armazenar histórico
    const history = this.sensorDataHistory.get(data.sensorId) || [];
    history.push(data);
    
    // Manter apenas os últimos 100 pontos
    if (history.length > 100) {
      history.shift();
    }
    this.sensorDataHistory.set(data.sensorId, history);

    // Verificar se precisa gerar alerta
    if (data.status !== 'normal') {
      this.generateAlert(data);
    }

    // Notificar subscribers
    this.subscribers.forEach(callback => {
      callback(data);
    });
  }

  private generateAlert(data: SensorData) {
    // Verificar se já existe alerta ativo para este sensor
    const existingAlert = this.activeAlerts.find(
      alert => alert.sensorId === data.sensorId && !alert.acknowledged
    );

    if (!existingAlert) {
      const alert: MqttAlert = {
        id: `alert-${Date.now()}-${data.sensorId}`,
        machineId: data.machineId,
        machineName: data.machineName,
        sensorId: data.sensorId,
        sensorName: data.sensorName,
        type: 'threshold_exceeded',
        severity: data.status === 'critical' ? 'critical' : 'medium',
        message: `${data.sensorName} fora dos limites: ${data.value}${data.unit}`,
        timestamp: new Date(),
        acknowledged: false
      };

      this.activeAlerts.push(alert);
      
      // Notificar subscribers de alertas
      this.alertSubscribers.forEach(callback => {
        callback(alert);
      });
    }
  }

  // Métodos públicos
  public subscribe(id: string, callback: (data: SensorData) => void) {
    this.subscribers.set(id, callback);
  }

  public unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  public subscribeToAlerts(id: string, callback: (alert: MqttAlert) => void) {
    this.alertSubscribers.set(id, callback);
  }

  public unsubscribeFromAlerts(id: string) {
    this.alertSubscribers.delete(id);
  }

  public getSensorHistory(sensorId: string): SensorData[] {
    return this.sensorDataHistory.get(sensorId) || [];
  }

  public getActiveAlerts(): MqttAlert[] {
    return this.activeAlerts.filter(alert => !alert.acknowledged);
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getMachineStatus(machineId: string): 'online' | 'offline' | 'error' {
    const machines = this.getActiveMachines();
    const machine = machines.find(m => m.id === machineId);
    return machine?.controller?.status || 'offline';
  }

  // Método para enviar comandos para as máquinas (futuro)
  public sendCommand(machineId: string, command: string, parameters?: any) {
    if (!this.isConnected) {
      throw new Error('Cliente MQTT não conectado');
    }
    
    const machines = this.getActiveMachines();
    const machine = machines.find(m => m.id === machineId);
    
    if (machine?.controller) {
      const topic = `${machine.controller.mqttTopic}/commands`;
      const payload = {
        command,
        parameters,
        timestamp: new Date().toISOString()
      };
      
      console.log(`Enviando comando para ${topic}:`, payload);
      // Em produção, enviar via cliente MQTT real
    }
  }
}

// Singleton instance
const mqttService = new MqttService();
export default mqttService;

// Hook para usar o serviço MQTT em componentes React
export function useMqttData(machineId?: string) {
  const [sensorData, setSensorData] = React.useState<SensorData[]>([]);
  const [alerts, setAlerts] = React.useState<MqttAlert[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const subscriberId = `component-${Date.now()}`;
    
    mqttService.subscribe(subscriberId, (data) => {
      if (!machineId || data.machineId === machineId) {
        setSensorData(prev => {
          const filtered = prev.filter(d => d.sensorId !== data.sensorId);
          return [...filtered, data].slice(-50); // Manter últimos 50 pontos
        });
      }
    });

    mqttService.subscribeToAlerts(subscriberId, (alert) => {
      if (!machineId || alert.machineId === machineId) {
        setAlerts(prev => [alert, ...prev].slice(0, 20)); // Manter últimos 20 alertas
      }
    });

    setIsConnected(mqttService.getConnectionStatus());

    return () => {
      mqttService.unsubscribe(subscriberId);
      mqttService.unsubscribeFromAlerts(subscriberId);
    };
  }, [machineId]);

  return {
    sensorData,
    alerts,
    isConnected,
    acknowledgeAlert: mqttService.acknowledgeAlert.bind(mqttService),
    sendCommand: mqttService.sendCommand.bind(mqttService)
  };
}

// Importar React para o hook
import React from 'react';
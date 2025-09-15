export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  description?: string;
  specifications?: Record<string, any>;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  sensorData?: SensorData[];
  tenant?: {
    id: string;
    name: string;
  };
}

export interface SensorData {
  id: string;
  machineId: string;
  sensorType: string;
  sensorName: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CreateMachineRequest {
  name: string;
  type: string;
  location: string;
  status?: 'active' | 'inactive' | 'maintenance' | 'error';
  description?: string;
  specifications?: Record<string, any>;
}

export interface MachineFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface MachineAnalytics {
  machineId: string;
  machineName: string;
  efficiency: number;
  production: number;
  quality: number;
  uptime: number;
  downtime: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
}
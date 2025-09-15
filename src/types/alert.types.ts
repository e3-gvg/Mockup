export interface Alert {
  id: string;
  tenantId: string;
  machineId: string;
  type: 'WARNING' | 'ERROR' | 'MAINTENANCE' | 'INFO';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  value?: number;
  threshold?: number;
  unit?: string;
  sensorType?: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Campos adicionais para compatibilidade com o frontend
  category?: string;
  source?: string;
  timestamp?: string;
  status?: 'active' | 'resolved';
  acknowledged?: boolean;
  priority?: string;
  assignedTo?: string;
  tags?: string[];
  relatedDevices?: string[];
  escalationLevel?: number;
  autoResolved?: boolean;
  pushNotification?: boolean;
}

export interface CreateAlertRequest {
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  machineId: string;
  category?: string;
  source?: string;
  limitValue?: number;
  unit?: string;
  type?: 'WARNING' | 'ERROR' | 'MAINTENANCE' | 'INFO';
}

export interface AlertFilters {
  severity?: string;
  isAcknowledged?: boolean;
  machineId?: string;
  page?: number;
  limit?: number;
}

export interface AlertStats {
  total: number;
  active: number;
  resolved: number;
  acknowledged: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}
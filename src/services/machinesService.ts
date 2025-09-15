import { Machine, CreateMachineRequest, MachineFilters } from '../types/machine.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface MachinesResponse {
  machines: Machine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  crossTenantAccess: boolean;
  includeTenantInfo: boolean;
}

class MachinesService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token de autenticação necessário. Faça login para continuar.');
      }
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getMachines(filters: MachineFilters = {}): Promise<MachinesResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    
    const response = await fetch(`${API_BASE_URL}/machines?${queryParams}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse<MachinesResponse>(response);
  }

  async getMachine(id: string): Promise<Machine> {
    const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    
    const data = await this.handleResponse<{ data: Machine }>(response);
    return data.data;
  }

  async createMachine(machineData: CreateMachineRequest): Promise<Machine> {
    const response = await fetch(`${API_BASE_URL}/machines`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(machineData),
    });
    
    const data = await this.handleResponse<{ data: Machine }>(response);
    return data.data;
  }

  async updateMachine(id: string, machineData: Partial<CreateMachineRequest>): Promise<Machine> {
    const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(machineData),
    });
    
    const data = await this.handleResponse<{ data: Machine }>(response);
    return data.data;
  }

  async deleteMachine(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/machines/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    
    await this.handleResponse<{ message: string }>(response);
  }

  async sendSensorData(machineId: string, sensorData: {
    sensorType: string;
    sensorName: string;
    value: number;
    unit: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/machines/${machineId}/sensor-data`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(sensorData),
    });
    
    await this.handleResponse<{ message: string }>(response);
  }
}

export const machinesService = new MachinesService();
export default machinesService;
import { Alert, CreateAlertRequest, AlertFilters, AlertStats } from '../types/alert.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class AlertsService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  private getUserRole(): string | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.role || null;
    } catch {
      return null;
    }
  }

  private canManageAlerts(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  async getAlerts(filters: AlertFilters = {}): Promise<Alert[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.severity) queryParams.append('severity', filters.severity);
    if (filters.isAcknowledged !== undefined) queryParams.append('isAcknowledged', filters.isAcknowledged.toString());
    if (filters.machineId) queryParams.append('machineId', filters.machineId);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/alerts?${queryParams}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<Alert[]>(response);
  }

  async getAlertById(id: string): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<Alert>(response);
  }

  async createAlert(alertData: CreateAlertRequest): Promise<Alert> {
    if (!this.canManageAlerts()) {
      throw new Error('Insufficient permissions to create alerts');
    }
    
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(alertData),
    });
    return this.handleResponse<Alert>(response);
  }

  async updateAlert(id: string, updateData: Partial<CreateAlertRequest>): Promise<Alert> {
    if (!this.canManageAlerts()) {
      throw new Error('Insufficient permissions to update alerts');
    }
    
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return this.handleResponse<Alert>(response);
  }

  async deleteAlert(id: string): Promise<void> {
    if (!this.canManageAlerts()) {
      throw new Error('Insufficient permissions to delete alerts');
    }
    
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  async acknowledgeAlert(id: string): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/acknowledge`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<Alert>(response);
  }

  async resolveAlert(id: string): Promise<Alert> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/resolve`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<Alert>(response);
  }

  async getAlertsByMachine(machineId: string, filters: { page?: number; limit?: number } = {}): Promise<Alert[]> {
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/alerts/machine/${machineId}?${queryParams}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<Alert[]>(response);
  }

  async getAlertStats(): Promise<AlertStats> {
    const response = await fetch(`${API_BASE_URL}/alerts/stats`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });
    return this.handleResponse<AlertStats>(response);
  }
}

export const alertsService = new AlertsService();
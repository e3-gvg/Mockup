'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Settings, BarChart3, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'react-hot-toast';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  isActive: boolean;
  machineCount: number;
  userCount: number;
  lastActivity: string;
}

interface Machine {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'RUNNING' | 'STOPPED' | 'IDLE' | 'ERROR';
  oee: number;
  tenant: {
    id: string;
    name: string;
    subdomain: string;
  };
}

interface SuperAdminStats {
  totalTenants: number;
  activeTenants: number;
  totalMachines: number;
  totalUsers: number;
  machinesByStatus: Record<string, number>;
  tenantsByPlan: Record<string, number>;
}

export function SuperAdminDashboard() {
  const { user } = useSupabaseAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'tenant-specific'>('overview');

  // Verificar se o usuário é SUPER_ADMIN
  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Acesso Negado</h3>
          <p className="text-gray-600">Você precisa de privilégios de Super Administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadDashboardData();
  }, [selectedTenant]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar estatísticas gerais
      await loadStats();
      
      // Carregar tenants
      await loadTenants();
      
      // Carregar máquinas
      await loadMachines();
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/machines/stats', {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadTenants = async () => {
    try {
      // Simular dados de tenants (implementar endpoint real)
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Empresa A',
          subdomain: 'empresa-a',
          plan: 'PRO',
          isActive: true,
          machineCount: 15,
          userCount: 8,
          lastActivity: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Empresa B',
          subdomain: 'empresa-b',
          plan: 'ENTERPRISE',
          isActive: true,
          machineCount: 32,
          userCount: 25,
          lastActivity: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          name: 'Empresa C',
          subdomain: 'empresa-c',
          plan: 'BASIC',
          isActive: false,
          machineCount: 5,
          userCount: 3,
          lastActivity: '2024-01-10T14:20:00Z'
        }
      ];
      setTenants(mockTenants);
    } catch (error) {
      console.error('Erro ao carregar tenants:', error);
    }
  };

  const loadMachines = async () => {
    try {
      const endpoint = selectedTenant === 'all' 
        ? '/api/machines/all-tenants'
        : `/api/machines/tenant/${selectedTenant}`;
        
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMachines(data.machines || []);
      }
    } catch (error) {
      console.error('Erro ao carregar máquinas:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'bg-green-100 text-green-800';
      case 'IDLE': return 'bg-yellow-100 text-yellow-800';
      case 'STOPPED': return 'bg-gray-100 text-gray-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'BASIC': return 'bg-blue-100 text-blue-800';
      case 'PRO': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Visão geral de todos os tenants e recursos do sistema</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            onClick={() => setViewMode('overview')}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Visão Geral</span>
          </Button>
          
          <Button
            variant={viewMode === 'tenant-specific' ? 'default' : 'outline'}
            onClick={() => setViewMode('tenant-specific')}
            className="flex items-center space-x-2"
          >
            <EyeOff className="h-4 w-4" />
            <span>Por Tenant</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tenants</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.length}</div>
              <p className="text-xs text-muted-foreground">
                {tenants.filter(t => t.isActive).length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.machinesByStatus?.RUNNING || 0} em operação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenants.reduce((acc, t) => acc + t.userCount, 0)}</div>
              <p className="text-xs text-muted-foreground">
                Distribuídos em {tenants.length} tenants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                OEE médio do sistema
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={viewMode === 'overview' ? 'overview' : 'tenants'} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tenants">Gerenciar Tenants</TabsTrigger>
          <TabsTrigger value="machines">Todas as Máquinas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Lista de Tenants */}
          <Card>
            <CardHeader>
              <CardTitle>Tenants Ativos</CardTitle>
              <CardDescription>Visão geral de todos os tenants do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold">{tenant.name}</h4>
                        <p className="text-sm text-gray-600">{tenant.subdomain}.iotsaas.com</p>
                      </div>
                      <Badge className={getPlanColor(tenant.plan)}>
                        {tenant.plan}
                      </Badge>
                      <Badge variant={tenant.isActive ? 'default' : 'secondary'}>
                        {tenant.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-semibold">{tenant.machineCount}</div>
                        <div>Máquinas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{tenant.userCount}</div>
                        <div>Usuários</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTenant(tenant.id);
                          setViewMode('tenant-specific');
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Tenants</CardTitle>
              <CardDescription>Administração de tenants do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tenants</SelectItem>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.subdomain})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedTenant !== 'all' && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Máquinas do Tenant Selecionado</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {machines.map((machine) => (
                        <Card key={machine.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold">{machine.name}</h5>
                              <Badge className={getStatusColor(machine.status)}>
                                {machine.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{machine.model}</p>
                            <p className="text-sm text-gray-600 mb-2">{machine.location}</p>
                            <div className="text-sm">
                              <span className="font-medium">OEE: </span>
                              <span className={machine.oee >= 80 ? 'text-green-600' : machine.oee >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                                {machine.oee}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="machines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Máquinas</CardTitle>
              <CardDescription>Visão consolidada de todas as máquinas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {machines.map((machine) => (
                  <Card key={machine.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{machine.name}</h5>
                        <Badge className={getStatusColor(machine.status)}>
                          {machine.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{machine.model}</p>
                      <p className="text-sm text-gray-600 mb-1">{machine.location}</p>
                      {machine.tenant && (
                        <p className="text-xs text-blue-600 mb-2">
                          Tenant: {machine.tenant.name}
                        </p>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">OEE: </span>
                        <span className={machine.oee >= 80 ? 'text-green-600' : machine.oee >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                          {machine.oee}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SuperAdminDashboard;
'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building2, Users, Settings, Eye, Crown } from 'lucide-react';
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
}

interface TenantSelectorProps {
  selectedTenantId: string;
  onTenantChange: (tenantId: string) => void;
  showStats?: boolean;
  className?: string;
}

export function TenantSelector({ 
  selectedTenantId, 
  onTenantChange, 
  showStats = false,
  className = '' 
}: TenantSelectorProps) {
  const { user } = useSupabaseAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Verificar se o usuário é SUPER_ADMIN
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (isSuperAdmin) {
      loadTenants();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (selectedTenantId && tenants.length > 0) {
      const tenant = tenants.find(t => t.id === selectedTenantId);
      setSelectedTenant(tenant || null);
    }
  }, [selectedTenantId, tenants]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      
      // Simular carregamento de tenants (implementar endpoint real)
      const mockTenants: Tenant[] = [
        {
          id: 'all',
          name: 'Todos os Tenants',
          subdomain: 'all',
          plan: 'ENTERPRISE',
          isActive: true,
          machineCount: 52,
          userCount: 36
        },
        {
          id: '1',
          name: 'Schnell Indústria',
          subdomain: 'schnell',
          plan: 'ENTERPRISE',
          isActive: true,
          machineCount: 15,
          userCount: 8
        },
        {
          id: '2',
          name: 'Metalúrgica ABC',
          subdomain: 'metalurgica-abc',
          plan: 'PRO',
          isActive: true,
          machineCount: 22,
          userCount: 12
        },
        {
          id: '3',
          name: 'Fábrica XYZ',
          subdomain: 'fabrica-xyz',
          plan: 'BASIC',
          isActive: true,
          machineCount: 8,
          userCount: 5
        },
        {
          id: '4',
          name: 'Indústria Beta',
          subdomain: 'industria-beta',
          plan: 'PRO',
          isActive: false,
          machineCount: 7,
          userCount: 11
        }
      ];
      
      setTenants(mockTenants);
      
      // Se não há tenant selecionado, selecionar 'all' por padrão
      if (!selectedTenantId) {
        onTenantChange('all');
      }
      
    } catch (error) {
      console.error('Erro ao carregar tenants:', error);
      toast.error('Erro ao carregar lista de tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleTenantChange = (tenantId: string) => {
    onTenantChange(tenantId);
    const tenant = tenants.find(t => t.id === tenantId);
    setSelectedTenant(tenant || null);
    
    if (tenant) {
      toast.success(`Visualizando dados de: ${tenant.name}`);
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

  // Se não for SUPER_ADMIN, mostrar apenas informações do próprio tenant
  if (!isSuperAdmin) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Seu Tenant</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{user?.tenant?.name || 'Tenant Atual'}</h3>
              <p className="text-sm text-gray-600">
                {user?.tenant?.subdomain || 'subdomain'}.iotsaas.com
              </p>
            </div>
            <Badge className={getPlanColor(user?.tenant?.plan || 'BASIC')}>
              {user?.tenant?.plan || 'BASIC'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Carregando tenants...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Seletor de Tenant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span>Super Admin - Seletor de Tenant</span>
          </CardTitle>
          <CardDescription>
            Selecione um tenant para visualizar seus dados ou escolha "Todos" para visão geral
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedTenantId} onValueChange={handleTenantChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    <div className="flex items-center space-x-2">
                      <span>{tenant.name}</span>
                      {!tenant.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Inativo
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTenant && selectedTenant.id !== 'all' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{selectedTenant.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPlanColor(selectedTenant.plan)}>
                      {selectedTenant.plan}
                    </Badge>
                    <Badge variant={selectedTenant.isActive ? 'default' : 'secondary'}>
                      {selectedTenant.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedTenant.subdomain}.iotsaas.com
                </p>
                
                {showStats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium">{selectedTenant.machineCount}</span> máquinas
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <span className="font-medium">{selectedTenant.userCount}</span> usuários
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedTenant && selectedTenant.id === 'all' && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Visão Geral do Sistema</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Visualizando dados consolidados de todos os tenants ativos
                </p>
                
                {showStats && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">{selectedTenant.machineCount}</span> máquinas totais
                    </div>
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">{selectedTenant.userCount}</span> usuários totais
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TenantSelector;
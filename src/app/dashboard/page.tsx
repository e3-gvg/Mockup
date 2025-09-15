'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Gauge, 
  TrendingUp, 
  CheckCircle, 
  Loader2,
  BarChart3,
  Wrench,
  Menu,
  Bell,
  Settings,
  Crown
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useModal } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { ToastDemo } from '@/components/NotificationToast';
import { ModalDemo } from '@/components/SmartModal';
import { VisualFeedbackDemo, StatusBadge, PerformanceGauge, ConnectionStatus } from '@/components/VisualFeedback';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import TenantSelector from '@/components/TenantSelector';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';

// Lazy load heavy components for better performance
const OEEDashboard = lazy(() => import('../../components/OEEDashboard'));
const FleetKPIComparison = lazy(() => import('../../components/FleetKPIComparison'));
const EnergyAirConsumption = lazy(() => import('../../components/EnergyAirConsumption'));
const ScrapMeasurement = lazy(() => import('../../components/ScrapMeasurement'));
const PredictiveMaintenance = lazy(() => import('../../components/PredictiveMaintenance'));

// Loading component for lazy loaded components
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center p-8 min-h-[200px]">
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 text-center">
      <Loader2 className="w-6 h-6 text-yellow-400 animate-spin mx-auto mb-3" />
      <p className="text-gray-400 text-sm">Carregando {name}...</p>
    </div>
  </div>
);

function DashboardContent() {
  const { user } = useSupabaseAuth();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('all');
  const toast = useToast();
  const modal = useModal();

  // Verificar se é SUPER_ADMIN
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Activity,
      description: 'Visão geral do sistema'
    },
    ...(isSuperAdmin ? [{
      id: 'super-admin',
      label: 'Super Admin',
      icon: Crown,
      description: 'Painel administrativo global'
    }] : []),
    {
      id: 'oee',
      label: 'OEE',
      icon: Gauge,
      description: 'Overall Equipment Effectiveness'
    },
    {
      id: 'kpi',
      label: 'KPI',
      icon: BarChart3,
      description: 'Key Performance Indicators'
    },
    {
      id: 'refugo',
      label: 'Refugo',
      icon: TrendingUp,
      description: 'Análise e medição de refugo'
    },
    {
      id: 'manutencao',
      label: 'Manutenção',
      icon: Wrench,
      description: 'Manutenção preditiva e preventiva'
    }
  ];

  const stats = [
    {
      title: 'Eficiência Geral (OEE)',
      value: '87.2%',
      trend: '+2.1%',
      description: 'Acima da meta de 85%',
      icon: Gauge,
      bgColor: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40',
      borderColor: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      trendBg: 'bg-green-500/20',
      trendColor: 'text-green-400'
    },
    {
      title: 'Disponibilidade',
      value: '94.8%',
      trend: '+1.2%',
      description: 'Tempo de operação ativo',
      icon: Activity,
      bgColor: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      trendBg: 'bg-blue-500/20',
      trendColor: 'text-blue-400'
    },
    {
      title: 'Performance',
      value: '91.5%',
      trend: '+0.8%',
      description: 'Velocidade de produção',
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-purple-900/40 to-violet-900/40',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      trendBg: 'bg-purple-500/20',
      trendColor: 'text-purple-400'
    },
    {
      title: 'Qualidade',
      value: '96.1%',
      trend: '+0.3%',
      description: 'Produtos sem defeito',
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-br from-orange-900/40 to-yellow-900/40',
      borderColor: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      trendBg: 'bg-orange-500/20',
      trendColor: 'text-orange-400'
    }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Definir tenant padrão baseado no usuário
  useEffect(() => {
    if (user && !isSuperAdmin) {
      setSelectedTenantId(user.tenant?.id || '');
    }
  }, [user, isSuperAdmin]);

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="dashboard"
          onSectionChange={() => {}}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors lg:hidden"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
                
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Dashboard</h1>
                  <p className="text-sm sm:text-base text-gray-400 hidden sm:block">Visão geral do sistema - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                  <p className="text-xs text-gray-400 sm:hidden">{mounted && currentTime ? currentTime.toLocaleTimeString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                  <StatusBadge status="online" label="Sistema Online" pulse />
                  <ConnectionStatus isConnected={true} signalStrength={95} showDetails />
                </div>
                <div className="hidden lg:flex items-center space-x-3">
                  <PerformanceGauge value={87} label="CPU" size="sm" />
                  <PerformanceGauge value={72} label="RAM" size="sm" />
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                     onClick={() => toast.info('Sistema Online', 'Todas as conexões estão funcionando normalmente')}
                     className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                   >
                     <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                   </button>
                   <button 
                     onClick={() => modal.openModal({
                       type: 'form',
                       size: 'lg',
                       title: 'Configurações do Sistema',
                       content: (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <ToastDemo />
                              <ModalDemo />
                            </div>
                            <VisualFeedbackDemo />
                          </div>
                        )
                     })}
                     className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                   >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                  </button>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-white">E3</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="bg-gray-900/50 p-1 rounded-xl overflow-hidden">
              <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        isActive
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Tenant Selector for Super Admin */}
                  {isSuperAdmin && (
                    <TenantSelector 
                      selectedTenantId={selectedTenantId}
                      onTenantChange={handleTenantChange}
                      showStats={true}
                      className="mb-6"
                    />
                  )}
                  
                  {/* Dashboard Overview */}
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                      {isSuperAdmin && selectedTenantId === 'all' 
                        ? 'Visão Geral Global do Sistema' 
                        : 'Visão Geral do Sistema'
                      }
                    </h2>
                    <p className="text-gray-400 mb-6">
                      {isSuperAdmin && selectedTenantId === 'all'
                        ? 'Resumo executivo consolidado de todos os tenants'
                        : 'Resumo executivo e status geral do sistema IoT'
                      }
                    </p>
                  </div>

                  {/* General Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${stat.bgColor} ${stat.borderColor} border backdrop-blur-xl rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-xl`}
                        >
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg}`}>
                              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${stat.trendBg} ${stat.trendColor} font-medium`}>
                              {stat.trend}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-gray-300 text-sm font-medium">{stat.title}</h3>
                            <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Energy Monitoring */}
                  <Suspense fallback={<ComponentLoader name="Consumo de Energia" />}>
                    <EnergyAirConsumption />
                  </Suspense>
                </div>
              )}

              {activeTab === 'super-admin' && isSuperAdmin && (
                <div className="space-y-6">
                  {/* Super Admin Dashboard */}
                  <Suspense fallback={<ComponentLoader name="Dashboard Super Admin" />}>
                    <SuperAdminDashboard selectedTenantId={selectedTenantId} />
                  </Suspense>
                </div>
              )}

              {activeTab === 'oee' && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Overall Equipment Effectiveness (OEE)</h2>
                    <p className="text-gray-400 mb-6">Análise detalhada da eficiência geral dos equipamentos</p>
                  </div>

                  {/* OEE Dashboard - Principal */}
                  <Suspense fallback={<ComponentLoader name="Dashboard OEE" />}>
                    <OEEDashboard />
                  </Suspense>
                </div>
              )}

              {activeTab === 'kpi' && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Key Performance Indicators (KPI)</h2>
                    <p className="text-gray-400 mb-6">Indicadores chave de performance e comparações</p>
                  </div>

                  {/* KPI Comparison */}
                  <Suspense fallback={<ComponentLoader name="Comparação KPI" />}>
                    <FleetKPIComparison />
                  </Suspense>
                </div>
              )}

              {activeTab === 'refugo' && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Análise e Medição de Refugo</h2>
                    <p className="text-gray-400 mb-6">Monitoramento detalhado de refugo e qualidade</p>
                  </div>
                  
                  <Suspense fallback={<ComponentLoader name="Medição de Refugo" />}>
                    <ScrapMeasurement />
                  </Suspense>
                </div>
              )}

              {activeTab === 'manutencao' && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Manutenção Preditiva</h2>
                    <p className="text-gray-400 mb-6">Prevenção de falhas e manutenção inteligente</p>
                  </div>
                  
                  <Suspense fallback={<ComponentLoader name="Manutenção Preditiva" />}>
                    <PredictiveMaintenance />
                  </Suspense>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <DashboardContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}

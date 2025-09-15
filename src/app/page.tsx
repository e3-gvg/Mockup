'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Loader2,
  Box,
  Bell,
  Settings,
  Gauge,
  TrendingUp,
  CheckCircle,
  Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import Sidebar from '../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useSmartModal } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { ToastDemo } from '@/components/NotificationToast';
import { ModalDemo } from '@/components/SmartModal';
import { VisualFeedbackDemo, StatusBadge, ConnectionStatus, PerformanceGauge } from '@/components/VisualFeedback';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Lazy load heavy components for better performance
const OEEDashboard = lazy(() => import('../components/OEEDashboard'));
const FleetKPIComparison = lazy(() => import('../components/FleetKPIComparison'));
const EnergyAirConsumption = lazy(() => import('../components/EnergyAirConsumption'));
const ScrapMeasurement = lazy(() => import('../components/ScrapMeasurement'));
const PredictiveMaintenance = lazy(() => import('../components/PredictiveMaintenance'));

// Loading component for lazy loaded components
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center p-8 min-h-[200px]">
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 text-center">
      <Loader2 className="w-6 h-6 text-yellow-400 animate-spin mx-auto mb-3" />
      <p className="text-gray-400 text-sm">Carregando {name}...</p>
    </div>
  </div>
);

function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const toast = useToast();
  const modal = useSmartModal();
  const router = useRouter();
  const { isAuthenticated, loading } = useSupabaseAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 text-center">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            {/* OEE Dashboard - Principal */}
            <div className="mb-8">
              <Suspense fallback={<ComponentLoader name="Dashboard OEE" />}>
                <OEEDashboard />
              </Suspense>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${stat.bgColor} backdrop-blur-xl border ${stat.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-2xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${stat.trendBg} ${stat.trendColor} font-medium`}>
                        {stat.trend}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </motion.div>
                );
              })}}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Suspense fallback={<ComponentLoader name="Comparação KPI" />}>
                <FleetKPIComparison />
              </Suspense>
              <Suspense fallback={<ComponentLoader name="Consumo de Energia" />}>
                <EnergyAirConsumption />
              </Suspense>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Suspense fallback={<ComponentLoader name="Medição de Refugo" />}>
                <ScrapMeasurement />
              </Suspense>
              <Suspense fallback={<ComponentLoader name="Manutenção Preditiva" />}>
                <PredictiveMaintenance />
              </Suspense>
            </div>
          </>
        );
      case 'analytics':
        return <div className="p-8 text-center">Analytics Dashboard - Coming Soon</div>;
      case 'maintenance':
        return (
          <Suspense fallback={<ComponentLoader name="Manutenção Preditiva" />}>
            <PredictiveMaintenance />
          </Suspense>
        );
      case 'energy':
        return (
          <Suspense fallback={<ComponentLoader name="Consumo de Energia" />}>
            <EnergyAirConsumption />
          </Suspense>
        );
      case 'quality':
        return (
          <Suspense fallback={<ComponentLoader name="Medição de Refugo" />}>
            <ScrapMeasurement />
          </Suspense>
        );
      case 'dados':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Dados IoT</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">Sensores Ativos</h3>
                  <p className="text-2xl font-bold text-white">247</p>
                  <p className="text-sm text-gray-400">98.4% operacionais</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">Dados Coletados</h3>
                  <p className="text-2xl font-bold text-white">1.2M</p>
                  <p className="text-sm text-gray-400">Últimas 24h</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">Taxa de Transmissão</h3>
                  <p className="text-2xl font-bold text-white">99.7%</p>
                  <p className="text-sm text-gray-400">Sem perdas</p>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Telemetria em Tempo Real</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Temperatura Linha 1</span>
                    <span className="text-green-400 font-mono">72.5°C</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Pressão Hidráulica</span>
                    <span className="text-blue-400 font-mono">145.2 bar</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Vibração Motor A</span>
                    <span className="text-yellow-400 font-mono">2.1 mm/s</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Consumo Energético</span>
                    <span className="text-orange-400 font-mono">847.3 kW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'usuarios':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Gestão de Usuários</h2>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                  Adicionar Usuário
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">Total de Usuários</h3>
                  <p className="text-2xl font-bold text-white">42</p>
                  <p className="text-sm text-gray-400">+3 este mês</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">Usuários Ativos</h3>
                  <p className="text-2xl font-bold text-white">38</p>
                  <p className="text-sm text-gray-400">90.5% taxa ativa</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">Administradores</h3>
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-sm text-gray-400">Acesso total</p>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Lista de Usuários</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">JD</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">João Silva</p>
                        <p className="text-gray-400 text-sm">joao.silva@empresa.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Admin</span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">MS</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Maria Santos</p>
                        <p className="text-gray-400 text-sm">maria.santos@empresa.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Operador</span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">PC</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Pedro Costa</p>
                        <p className="text-gray-400 text-sm">pedro.costa@empresa.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Técnico</span>
                      <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'configuracoes':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Configurações do Sistema</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Configurações Gerais</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Notificações Push</p>
                        <p className="text-gray-400 text-sm">Receber alertas em tempo real</p>
                      </div>
                      <button className="bg-green-600 w-12 h-6 rounded-full relative">
                        <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Modo Escuro</p>
                        <p className="text-gray-400 text-sm">Interface em tema escuro</p>
                      </div>
                      <button className="bg-green-600 w-12 h-6 rounded-full relative">
                        <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Auto-backup</p>
                        <p className="text-gray-400 text-sm">Backup automático dos dados</p>
                      </div>
                      <button className="bg-green-600 w-12 h-6 rounded-full relative">
                        <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Configurações de Rede</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <label className="block text-white font-medium mb-2">Servidor MQTT</label>
                      <input type="text" value="mqtt.empresa.com:1883" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <label className="block text-white font-medium mb-2">Intervalo de Coleta (ms)</label>
                      <input type="number" value="5000" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded-lg">
                      <label className="block text-white font-medium mb-2">Timeout de Conexão (s)</label>
                      <input type="number" value="30" className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                  Cancelar
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        );
      case 'analise-refugo':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Análise de Refugo</h2>
                <div className="flex space-x-3">
                  <select 
                    className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    onChange={(e) => console.log('Período selecionado:', e.target.value)}
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Último trimestre</option>
                  </select>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                    Exportar Relatório
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-red-400 font-semibold mb-2">Taxa de Refugo</h3>
                  <p className="text-2xl font-bold text-white">3.8%</p>
                  <p className="text-sm text-gray-400">-0.5% vs mês anterior</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">Custo do Refugo</h3>
                  <p className="text-2xl font-bold text-white">R$ 24.5K</p>
                  <p className="text-sm text-gray-400">Este mês</p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="text-yellow-400 font-semibold mb-2">Peças Refugadas</h3>
                  <p className="text-2xl font-bold text-white">1,247</p>
                  <p className="text-sm text-gray-400">Últimos 30 dias</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">Eficiência</h3>
                  <p className="text-2xl font-bold text-white">96.2%</p>
                  <p className="text-sm text-gray-400">+1.2% vs meta</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Refugo por Categoria</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Defeito Dimensional</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-red-400 text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Defeito Superficial</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <span className="text-orange-400 text-sm">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Defeito Material</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-yellow-400 text-sm">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Análise por Máquina</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <div>
                        <p className="text-white font-medium">Linha 1 - Torno CNC</p>
                        <p className="text-gray-400 text-sm">Taxa: 2.1%</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Normal</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <div>
                        <p className="text-white font-medium">Linha 2 - Fresadora</p>
                        <p className="text-gray-400 text-sm">Taxa: 5.7%</p>
                      </div>
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Atenção</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                      <div>
                        <p className="text-white font-medium">Linha 3 - Prensa</p>
                        <p className="text-gray-400 text-sm">Taxa: 1.8%</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Excelente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'digital-twin':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Digital Twin</h2>
                <div className="flex space-x-3">
                  <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                    <option>Linha de Produção 1</option>
                    <option>Linha de Produção 2</option>
                    <option>Linha de Produção 3</option>
                  </select>
                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                    Iniciar Simulação
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                    Exportar Modelo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">Status da Simulação</h3>
                  <p className="text-2xl font-bold text-white">Ativa</p>
                  <p className="text-sm text-gray-400">Executando há 2h 15m</p>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">Precisão do Modelo</h3>
                  <p className="text-2xl font-bold text-white">94.7%</p>
                  <p className="text-sm text-gray-400">Baseado em dados reais</p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">Cenários Testados</h3>
                  <p className="text-2xl font-bold text-white">127</p>
                  <p className="text-sm text-gray-400">Este mês</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <h3 className="text-orange-400 font-semibold mb-2">Economia Projetada</h3>
                  <p className="text-2xl font-bold text-white">R$ 85K</p>
                  <p className="text-sm text-gray-400">Próximos 6 meses</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Modelo 3D da Linha de Produção</h3>
                  <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Box className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                      <p className="text-gray-400">Visualização 3D da Linha</p>
                      <p className="text-gray-500 text-sm">Modelo interativo carregado</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white text-sm transition-colors">Rotacionar</button>
                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white text-sm transition-colors">Zoom</button>
                    <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white text-sm transition-colors">Reset</button>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Controles de Simulação</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Velocidade da Linha</label>
                      <input type="range" min="50" max="150" value="100" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>50%</span>
                        <span>100%</span>
                        <span>150%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Temperatura (°C)</label>
                      <input type="range" min="60" max="90" value="75" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>60°C</span>
                        <span>75°C</span>
                        <span>90°C</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Umidade (%)</label>
                      <input type="range" min="30" max="70" value="45" className="w-full" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>30%</span>
                        <span>45%</span>
                        <span>70%</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-white font-medium mb-2">Cenários Predefinidos</h4>
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2 rounded text-sm hover:bg-blue-600/30 transition-colors">
                          Produção Normal
                        </button>
                        <button className="w-full bg-orange-600/20 border border-orange-500/30 text-orange-400 py-2 rounded text-sm hover:bg-orange-600/30 transition-colors">
                          Pico de Demanda
                        </button>
                        <button className="w-full bg-red-600/20 border border-red-500/30 text-red-400 py-2 rounded text-sm hover:bg-red-600/30 transition-colors">
                          Manutenção Preventiva
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Histórico de Simulações</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left text-gray-300 py-2">Data</th>
                        <th className="text-left text-gray-300 py-2">Cenário</th>
                        <th className="text-left text-gray-300 py-2">Duração</th>
                        <th className="text-left text-gray-300 py-2">Resultado</th>
                        <th className="text-left text-gray-300 py-2">Economia Projetada</th>
                        <th className="text-left text-gray-300 py-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="text-gray-300 py-2">15/01/2024</td>
                        <td className="text-gray-300 py-2">Otimização Energética</td>
                        <td className="text-gray-300 py-2">3h 45m</td>
                        <td className="text-green-400 py-2">Sucesso</td>
                        <td className="text-green-400 py-2">R$ 12.5K</td>
                        <td className="py-2">
                          <button className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-600/30 transition-colors">
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="text-gray-300 py-2">14/01/2024</td>
                        <td className="text-gray-300 py-2">Redução de Refugo</td>
                        <td className="text-gray-300 py-2">2h 20m</td>
                        <td className="text-green-400 py-2">Sucesso</td>
                        <td className="text-green-400 py-2">R$ 8.3K</td>
                        <td className="py-2">
                          <button className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-600/30 transition-colors">
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-300 py-2">13/01/2024</td>
                        <td className="text-gray-300 py-2">Aumento de Velocidade</td>
                        <td className="text-gray-300 py-2">1h 55m</td>
                        <td className="text-yellow-400 py-2">Parcial</td>
                        <td className="text-yellow-400 py-2">R$ 5.1K</td>
                        <td className="py-2">
                          <button className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-600/30 transition-colors">
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="mb-8">
              <Suspense fallback={<ComponentLoader name="Dashboard OEE" />}>
                <OEEDashboard />
              </Suspense>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Suspense fallback={<ComponentLoader name="Comparação KPI" />}>
                <FleetKPIComparison />
              </Suspense>
              <Suspense fallback={<ComponentLoader name="Consumo de Energia" />}>
                <EnergyAirConsumption />
              </Suspense>
            </div>
          </>
        );
    }
  };

  const stats = [
    {
      title: 'Eficiência Geral (OEE)',
      value: '87.2%',
      trend: '+2.1%',
      description: 'Acima da meta de 85%',
      icon: Gauge,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Disponibilidade',
      value: '94.8%',
      trend: '+1.2%',
      description: 'Tempo de operação ativo',
      icon: Activity,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Performance',
      value: '91.5%',
      trend: '+0.8%',
      description: 'Velocidade de produção',
      icon: TrendingUp,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Qualidade',
      value: '96.1%',
      trend: '+0.3%',
      description: 'Produtos sem defeito',
      icon: CheckCircle,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
                <div>
                  <h1 className="text-lg lg:text-2xl font-bold text-white mb-1">VULCAN</h1>
                  <p className="text-xs lg:text-sm text-gray-400 hidden sm:block">Monitoramento em tempo real - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="hidden sm:flex">
                  <StatusBadge status="online" label="Sistema Online" pulse />
                </div>
                <div className="hidden md:flex">
                  <ConnectionStatus isConnected={true} signalStrength={95} showDetails />
                </div>
                <div className="hidden lg:flex items-center space-x-3">
                  <PerformanceGauge value={87} label="CPU" size="sm" />
                  <PerformanceGauge value={72} label="RAM" size="sm" />
                </div>
                <button 
                   onClick={() => toast.info('Sistema Online', 'Todas as conexões estão funcionando normalmente')}
                   className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                 >
                   <Bell className="w-5 h-5 text-gray-300" />
                 </button>
                 <button 
                   onClick={() => modal.open({
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
                  <Settings className="w-5 h-5 text-gray-300" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">E3</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <HomeContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}

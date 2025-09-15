'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Server, 
  Shield, 
  Bell, 
  Database,
  Wifi,
  Save,
  RefreshCw,
  Download,
  Monitor
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useSmartModal } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge } from '@/components/VisualFeedback';

function ConfiguracoesContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('system');
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useToast();
  const modal = useSmartModal();

  const [systemConfig, setSystemConfig] = useState({
    systemName: 'VULCAN IoT Platform',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    autoBackup: true,
    backupInterval: '24',
    maxUsers: '500',
    sessionTimeout: '30'
  });

  const [securityConfig, setSecurityConfig] = useState({
    twoFactorAuth: true,
    passwordPolicy: 'strong',
    sessionSecurity: 'high',
    apiRateLimit: '1000',
    encryptionLevel: 'AES-256',
    auditLog: true
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertThreshold: 'medium',
    maintenanceAlerts: true,
    performanceAlerts: true
  });

  const [networkConfig, setNetworkConfig] = useState({
    serverPort: '3000',
    sslEnabled: true,
    corsEnabled: true,
    allowedOrigins: 'https://vulcan.com',
    maxConnections: '1000',
    timeout: '30'
  });

  const configTabs = [
    { id: 'system', name: 'Sistema', icon: Server },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'network', name: 'Rede', icon: Wifi },
    { id: 'database', name: 'Banco de Dados', icon: Database },
    { id: 'interface', name: 'Interface', icon: Monitor }
  ];

  const systemMetrics = [
    {
      title: 'Configurações Ativas',
      value: '24',
      description: 'Módulos configurados',
      icon: Settings,
      color: 'text-blue-400'
    },
    {
      title: 'Última Alteração',
      value: '2h ago',
      description: 'Por João Silva',
      icon: RefreshCw,
      color: 'text-green-400'
    },
    {
      title: 'Backup Automático',
      value: 'Ativo',
      description: 'Próximo em 6h',
      icon: Database,
      color: 'text-purple-400'
    },
    {
      title: 'Status do Sistema',
      value: 'Online',
      description: 'Todos os serviços',
      icon: Server,
      color: 'text-green-400'
    }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSave = () => {
    toast.success('Configurações', 'Configurações salvas com sucesso!');
    setHasChanges(false);
  };

  const handleReset = () => {
    modal.confirm({
      title: 'Confirmar Reset',
      message: 'Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.',
      onConfirm: () => {
        toast.success('Configurações', 'Configurações restauradas para o padrão');
        setHasChanges(false);
      }
    });
  };

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Nome do Sistema</label>
          <input
            type="text"
            value={systemConfig.systemName}
            onChange={(e) => {
              setSystemConfig({...systemConfig, systemName: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Fuso Horário</label>
          <select
            value={systemConfig.timezone}
            onChange={(e) => {
              setSystemConfig({...systemConfig, timezone: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
            <option value="America/New_York">New York (UTC-5)</option>
            <option value="Europe/London">London (UTC+0)</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Idioma</label>
          <select
            value={systemConfig.language}
            onChange={(e) => {
              setSystemConfig({...systemConfig, language: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Intervalo de Backup (horas)</label>
          <input
            type="number"
            value={systemConfig.backupInterval}
            onChange={(e) => {
              setSystemConfig({...systemConfig, backupInterval: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={systemConfig.autoBackup}
            onChange={(e) => {
              setSystemConfig({...systemConfig, autoBackup: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Backup Automático</span>
        </label>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Política de Senha</label>
          <select
            value={securityConfig.passwordPolicy}
            onChange={(e) => {
              setSecurityConfig({...securityConfig, passwordPolicy: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="weak">Fraca (6+ caracteres)</option>
            <option value="medium">Média (8+ caracteres, números)</option>
            <option value="strong">Forte (12+ caracteres, símbolos)</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Nível de Criptografia</label>
          <select
            value={securityConfig.encryptionLevel}
            onChange={(e) => {
              setSecurityConfig({...securityConfig, encryptionLevel: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="AES-128">AES-128</option>
            <option value="AES-256">AES-256</option>
            <option value="RSA-2048">RSA-2048</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Limite de Taxa API (req/min)</label>
          <input
            type="number"
            value={securityConfig.apiRateLimit}
            onChange={(e) => {
              setSecurityConfig({...securityConfig, apiRateLimit: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={securityConfig.twoFactorAuth}
            onChange={(e) => {
              setSecurityConfig({...securityConfig, twoFactorAuth: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Autenticação de Dois Fatores</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={securityConfig.auditLog}
            onChange={(e) => {
              setSecurityConfig({...securityConfig, auditLog: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Log de Auditoria</span>
        </label>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Limite de Alerta</label>
          <select
            value={notificationConfig.alertThreshold}
            onChange={(e) => {
              setNotificationConfig({...notificationConfig, alertThreshold: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto</option>
            <option value="critical">Crítico</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notificationConfig.emailNotifications}
            onChange={(e) => {
              setNotificationConfig({...notificationConfig, emailNotifications: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Notificações por Email</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notificationConfig.smsNotifications}
            onChange={(e) => {
              setNotificationConfig({...notificationConfig, smsNotifications: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Notificações por SMS</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notificationConfig.pushNotifications}
            onChange={(e) => {
              setNotificationConfig({...notificationConfig, pushNotifications: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Notificações Push</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notificationConfig.maintenanceAlerts}
            onChange={(e) => {
              setNotificationConfig({...notificationConfig, maintenanceAlerts: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Alertas de Manutenção</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notificationConfig.performanceAlerts}
            onChange={(e) => {
              setNotificationConfig({...notificationConfig, performanceAlerts: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">Alertas de Performance</span>
        </label>
      </div>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Porta do Servidor</label>
          <input
            type="number"
            value={networkConfig.serverPort}
            onChange={(e) => {
              setNetworkConfig({...networkConfig, serverPort: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Origens Permitidas</label>
          <input
            type="text"
            value={networkConfig.allowedOrigins}
            onChange={(e) => {
              setNetworkConfig({...networkConfig, allowedOrigins: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Máximo de Conexões</label>
          <input
            type="number"
            value={networkConfig.maxConnections}
            onChange={(e) => {
              setNetworkConfig({...networkConfig, maxConnections: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Timeout (segundos)</label>
          <input
            type="number"
            value={networkConfig.timeout}
            onChange={(e) => {
              setNetworkConfig({...networkConfig, timeout: e.target.value});
              setHasChanges(true);
            }}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={networkConfig.sslEnabled}
            onChange={(e) => {
              setNetworkConfig({...networkConfig, sslEnabled: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">SSL/TLS Habilitado</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={networkConfig.corsEnabled}
            onChange={(e) => {
              setNetworkConfig({...networkConfig, corsEnabled: e.target.checked});
              setHasChanges(true);
            }}
            className="rounded border-gray-600 bg-gray-700 text-blue-600"
          />
          <span className="text-gray-300">CORS Habilitado</span>
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'system': return renderSystemTab();
      case 'security': return renderSecurityTab();
      case 'notifications': return renderNotificationsTab();
      case 'network': return renderNetworkTab();
      case 'database': return <div className="text-gray-400 text-center py-8">Configurações de banco de dados em desenvolvimento</div>;
      case 'interface': return <div className="text-gray-400 text-center py-8">Configurações de interface em desenvolvimento</div>;
      default: return renderSystemTab();
    }
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="configuracoes"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Configurações</h1>
                  <p className="text-gray-400">Configurações do sistema e preferências - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {hasChanges && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span className="text-sm">Salvar</span>
                    </button>
                    <button 
                      onClick={handleReset}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm">Resetar</span>
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => toast.success('Backup', 'Exportando configurações...')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Exportar</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">C</span>
                </div>
              </div>
            </div>
          </header>

          {/* Configuration Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-gray-700/50">
                        <Icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">{metric.title}</h3>
                        <p className="text-xl font-bold text-white">{metric.value}</p>
                        <p className="text-xs text-gray-400">{metric.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Configuration Tabs */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-700/50">
                <div className="flex overflow-x-auto">
                  {configTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </div>

            {/* Save Changes Banner */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-600/90 backdrop-blur-xl border border-yellow-500/50 rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <Bell className="w-5 h-5 text-yellow-200" />
                  <span className="text-yellow-100 font-medium">Você tem alterações não salvas</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleSave}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
                    >
                      Salvar
                    </button>
                    <button 
                      onClick={() => setHasChanges(false)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <ConfiguracoesContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
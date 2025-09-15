'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  Cloud, 
  Activity, 
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge } from '@/components/VisualFeedback';

function DadosContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('production');
  const toast = useToast();

  const dataMetrics = [
    {
      title: 'Volume de Dados',
      value: '2.4 TB',
      trend: '+156 GB',
      description: 'Crescimento diário',
      icon: Database,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Registros Processados',
      value: '1.2M',
      trend: '+45K',
      description: 'Últimas 24h',
      icon: Activity,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Backup Automático',
      value: '99.9%',
      trend: '+0.1%',
      description: 'Disponibilidade',
      icon: Cloud,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-yellow-400'
    },
    {
      title: 'Performance DB',
      value: '12ms',
      trend: '-3ms',
      description: 'Tempo de resposta',
      icon: HardDrive,
      bgColor: 'bg-card/50',
      borderColor: 'border-border',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      iconColor: 'text-gray-900',
      trendBg: 'bg-yellow-500/20',
      trendColor: 'text-green-400'
    }
  ];

  const databases = [
    {
      id: 'production',
      name: 'Produção Principal',
      type: 'PostgreSQL',
      size: '1.8 TB',
      status: 'online',
      connections: 45,
      lastBackup: '2h ago',
      performance: 'excellent'
    },
    {
      id: 'analytics',
      name: 'Analytics & BI',
      type: 'ClickHouse',
      size: '450 GB',
      status: 'online',
      connections: 12,
      lastBackup: '1h ago',
      performance: 'good'
    },
    {
      id: 'timeseries',
      name: 'Dados IoT',
      type: 'InfluxDB',
      size: '320 GB',
      status: 'online',
      connections: 28,
      lastBackup: '30min ago',
      performance: 'excellent'
    },
    {
      id: 'cache',
      name: 'Cache Redis',
      type: 'Redis',
      size: '12 GB',
      status: 'online',
      connections: 156,
      lastBackup: 'N/A',
      performance: 'excellent'
    }
  ];

  const recentQueries = [
    {
      query: 'SELECT * FROM production_data WHERE timestamp > NOW() - INTERVAL 1 HOUR',
      database: 'Produção Principal',
      duration: '45ms',
      rows: '12,450',
      user: 'admin',
      timestamp: '14:32:15'
    },
    {
      query: 'SELECT machine_id, AVG(efficiency) FROM oee_metrics GROUP BY machine_id',
      database: 'Analytics & BI',
      duration: '120ms',
      rows: '8',
      user: 'analyst',
      timestamp: '14:28:42'
    },
    {
      query: 'INSERT INTO sensor_readings (device_id, value, timestamp) VALUES...',
      database: 'Dados IoT',
      duration: '8ms',
      rows: '1',
      user: 'iot_service',
      timestamp: '14:31:58'
    },
    {
      query: 'SELECT COUNT(*) FROM quality_control WHERE defect_type = "dimensional"',
      database: 'Produção Principal',
      duration: '32ms',
      rows: '1',
      user: 'quality_mgr',
      timestamp: '14:25:11'
    }
  ];

  const dataFlows = [
    {
      source: 'Sensores IoT',
      destination: 'InfluxDB',
      volume: '2.4K/min',
      status: 'active',
      latency: '< 1s'
    },
    {
      source: 'Sistema ERP',
      destination: 'PostgreSQL',
      volume: '156/min',
      status: 'active',
      latency: '< 2s'
    },
    {
      source: 'PostgreSQL',
      destination: 'ClickHouse',
      volume: '45/min',
      status: 'active',
      latency: '< 5s'
    },
    {
      source: 'Aplicações',
      destination: 'Redis Cache',
      volume: '8.2K/min',
      status: 'active',
      latency: '< 100ms'
    }
  ];

  const storageUsage = [
    { type: 'Dados de Produção', size: '1.2 TB', percentage: 50, color: 'bg-blue-500' },
    { type: 'Dados IoT', size: '480 GB', percentage: 20, color: 'bg-green-500' },
    { type: 'Analytics', size: '360 GB', percentage: 15, color: 'bg-purple-500' },
    { type: 'Logs do Sistema', size: '240 GB', percentage: 10, color: 'bg-orange-500' },
    { type: 'Backup', size: '120 GB', percentage: 5, color: 'bg-gray-500' }
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="dados"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Gestão de Dados</h1>
                  <p className="text-gray-400">Monitoramento e administração de dados - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-gray-400" />
                  <select 
                    value={selectedDatabase}
                    onChange={(e) => setSelectedDatabase(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                  >
                    {databases.map(db => (
                      <option key={db.id} value={db.id}>{db.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => toast.success('Backup', 'Iniciando backup manual...')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Backup</span>
                </button>
                <button 
                  onClick={() => toast.success('Relatório', 'Exportando relatório de dados...')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Exportar</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">DB</span>
                </div>
              </div>
            </div>
          </header>

          {/* Data Management Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${metric.bgColor} ${metric.borderColor} border backdrop-blur-xl rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                        <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${metric.trendBg} ${metric.trendColor} font-medium`}>
                        {metric.trend}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-gray-300 text-sm font-medium">{metric.title}</h3>
                      <p className="text-2xl font-bold text-white">{metric.value}</p>
                      <p className="text-xs text-gray-400">{metric.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Database Status and Storage Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Status */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Status dos Bancos de Dados</h2>
                <div className="space-y-4">
                  {databases.map((db, index) => (
                    <motion.div
                      key={db.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gray-700/30 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${
                        selectedDatabase === db.id ? 'ring-2 ring-blue-500/50' : ''
                      }`}
                      onClick={() => setSelectedDatabase(db.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{db.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          db.status === 'online' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {db.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Tipo</p>
                          <p className="text-white font-medium">{db.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Tamanho</p>
                          <p className="text-white font-medium">{db.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Conexões</p>
                          <p className="text-white font-medium">{db.connections}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Último Backup</p>
                          <p className="text-white font-medium">{db.lastBackup}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Performance</span>
                          <span className={`font-medium ${
                            db.performance === 'excellent' ? 'text-green-400' :
                            db.performance === 'good' ? 'text-blue-400' :
                            'text-yellow-400'
                          }`}>
                            {db.performance === 'excellent' ? 'Excelente' :
                             db.performance === 'good' ? 'Boa' : 'Regular'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                          <div className={`h-1.5 rounded-full ${
                            db.performance === 'excellent' ? 'bg-green-500 w-full' :
                            db.performance === 'good' ? 'bg-blue-500 w-4/5' :
                            'bg-yellow-500 w-3/5'
                          }`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Storage Usage */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Uso de Armazenamento</h2>
                <div className="space-y-4">
                  {storageUsage.map((item, index) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{item.type}</span>
                        <span className="text-white font-medium">{item.size} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Utilizado</span>
                    <span className="text-white font-bold">2.4 TB / 5.0 TB</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-12/25" />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">48% do espaço total utilizado</p>
                </div>
              </div>
            </div>

            {/* Data Flows */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Fluxos de Dados em Tempo Real</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataFlows.map((flow, index) => (
                  <motion.div
                    key={`${flow.source}-${flow.destination}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white font-medium text-sm">{flow.source}</span>
                      </div>
                      <span className="text-gray-400 text-xs">→</span>
                      <span className="text-gray-300 text-sm">{flow.destination}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-gray-400">Volume</p>
                        <p className="text-white font-medium">{flow.volume}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Latência</p>
                        <p className="text-white font-medium">{flow.latency}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Queries */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Consultas Recentes</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar consultas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-64"
                    />
                  </div>
                  <button className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 font-medium py-3">Consulta</th>
                      <th className="text-left text-gray-300 font-medium py-3">Banco</th>
                      <th className="text-left text-gray-300 font-medium py-3">Duração</th>
                      <th className="text-left text-gray-300 font-medium py-3">Linhas</th>
                      <th className="text-left text-gray-300 font-medium py-3">Usuário</th>
                      <th className="text-left text-gray-300 font-medium py-3">Horário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQueries.map((query, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-4 text-white font-mono text-xs max-w-xs truncate">
                          {query.query}
                        </td>
                        <td className="py-4 text-gray-300 text-sm">{query.database}</td>
                        <td className="py-4 text-white text-sm">{query.duration}</td>
                        <td className="py-4 text-gray-300 text-sm">{query.rows}</td>
                        <td className="py-4 text-gray-300 text-sm">{query.user}</td>
                        <td className="py-4 text-gray-300 text-sm">{query.timestamp}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function DadosPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <DadosContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
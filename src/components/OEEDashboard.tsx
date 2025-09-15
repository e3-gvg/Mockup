'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

// Dados simulados para OEE
const oeeData = {
  overall: 85,
  availability: 93,
  performance: 90,
  quality: 95
};

const oeeHistory = [
  { time: '00:00', oee: 82, availability: 90, performance: 89, quality: 95 },
  { time: '04:00', oee: 84, availability: 92, performance: 89, quality: 95 },
  { time: '08:00', oee: 87, availability: 93, performance: 90, quality: 96 },
  { time: '12:00', oee: 85, availability: 93, performance: 90, quality: 95 },
  { time: '16:00', oee: 88, availability: 94, performance: 91, quality: 96 },
  { time: '20:00', oee: 84, availability: 90, performance: 89, quality: 95 },
];

const machineOEE = [
  { name: 'Linha 1', oee: 89, status: 'excellent' },
  { name: 'Linha 2', oee: 76, status: 'good' },
  { name: 'Linha 3', oee: 92, status: 'excellent' },
  { name: 'Linha 4', oee: 82, status: 'good' },
  { name: 'Linha 5', oee: 94, status: 'excellent' },
  { name: 'Linha 6', oee: 69, status: 'needs-attention' },
];

const getOEEColor = (value: number) => {
  if (value >= 85) return '#10b981'; // Verde - Excelente
  if (value >= 75) return '#f59e0b'; // Amarelo - Bom
  return '#ef4444'; // Vermelho - Precisa atenção
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent':
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'good':
      return <TrendingUp className="w-5 h-5 text-yellow-400" />;
    case 'needs-attention':
      return <AlertTriangle className="w-5 h-5 text-red-400" />;
    default:
      return <Activity className="w-5 h-5 text-gray-400" />;
  }
};

const OEEGauge = memo<{ title: string; value: number; icon: React.ReactNode }>(({ title, value, icon }) => {
  const data = useMemo(() => [{ value, fill: getOEEColor(value) }], [value]);
  const roundedValue = useMemo(() => Math.round(value), [value]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      <div className="relative h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill={getOEEColor(value)}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{roundedValue}</div>
            <div className="text-xs text-gray-400">%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OEEGauge.displayName = 'OEEGauge';

const OEEHistoryChart = memo(() => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Histórico OEE - Últimas 24h</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={oeeHistory}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis domain={[60, 100]} stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="oee" 
            stroke="#f59e0b" 
            strokeWidth={3}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            name="OEE Geral"
          />
          <Line 
            type="monotone" 
            dataKey="availability" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
            name="Disponibilidade"
          />
          <Line 
            type="monotone" 
            dataKey="performance" 
            stroke="#6b7280"
                      strokeWidth={2}
                      dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
            name="Performance"
          />
          <Line 
            type="monotone" 
            dataKey="quality" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
            name="Qualidade"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
});

OEEHistoryChart.displayName = 'OEEHistoryChart';

const MachineOEEList = memo(() => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">OEE por Linha de Produção</h3>
      <div className="space-y-4">
        {machineOEE.map((machine, index) => (
          <motion.div 
            key={machine.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(machine.status)}
              <span className="text-white font-medium">{machine.name}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-32 bg-gray-600 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${machine.oee}%`,
                    backgroundColor: getOEEColor(machine.oee)
                  }}
                />
              </div>
              <span 
                className="text-base font-bold min-w-[60px] text-right"
                style={{ color: getOEEColor(machine.oee) }}
              >
                {Math.round(machine.oee)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

MachineOEEList.displayName = 'MachineOEEList';

const OEEDashboard = memo(() => {
  return (
    <div className="space-y-6">
      {/* Header com OEE Geral */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Overall Equipment Effectiveness (OEE)</h2>
            <p className="text-gray-300">Indicador principal de eficiência da produção</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">{Math.round(oeeData.overall)}%</div>
            <div className="text-sm text-gray-400">OEE Geral</div>
          </div>
        </div>
      </motion.div>

      {/* Métricas OEE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OEEGauge 
          title="Disponibilidade" 
          value={oeeData.availability} 
          icon={<Clock className="w-6 h-6 text-green-400" />}
        />
        <OEEGauge 
          title="Performance" 
          value={oeeData.performance} 
          icon={<Activity className="w-6 h-6 text-gray-400" />}
        />
        <OEEGauge 
          title="Qualidade" 
          value={oeeData.quality} 
          icon={<Target className="w-6 h-6 text-yellow-400" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OEEHistoryChart />
        <MachineOEEList />
      </div>
    </div>
  );
});

OEEDashboard.displayName = 'OEEDashboard';

export default OEEDashboard;
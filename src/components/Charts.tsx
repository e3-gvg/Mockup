'use client';

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SkeletonChart } from './SkeletonLoading';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const energyData = [
  { time: '00:00', consumption: 45, production: 52 },
  { time: '04:00', consumption: 38, production: 48 },
  { time: '08:00', consumption: 65, production: 58 },
  { time: '12:00', consumption: 78, production: 72 },
  { time: '16:00', consumption: 82, production: 85 },
  { time: '20:00', consumption: 67, production: 71 },
];

const machineData = [
  { name: 'Linha 1', efficiency: 95, downtime: 2 },
  { name: 'Linha 2', efficiency: 87, downtime: 8 },
  { name: 'Linha 3', efficiency: 92, downtime: 4 },
  { name: 'Linha 4', efficiency: 89, downtime: 6 },
  { name: 'Linha 5', efficiency: 96, downtime: 1 },
];

const statusData = [
  { name: 'Operacional', value: 75, color: '#f59e0b' },
  { name: 'Manutenção', value: 15, color: '#d97706' },
  { name: 'Parado', value: 10, color: '#6b7280' },
];

const temperatureData = [
  { time: '00:00', temp1: 65, temp2: 68, temp3: 62 },
  { time: '04:00', temp1: 63, temp2: 66, temp3: 60 },
  { time: '08:00', temp1: 72, temp2: 75, temp3: 69 },
  { time: '12:00', temp1: 78, temp2: 82, temp3: 75 },
  { time: '16:00', temp1: 85, temp2: 88, temp3: 82 },
  { time: '20:00', temp1: 76, temp2: 79, temp3: 73 },
];

export function EnergyChart() {
  const [loading, setLoading] = useState(true);
  const [data] = useState(energyData);
  
  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <SkeletonChart height="300px" />;
  }
  
  const currentProduction = data[data.length - 1]?.production || 0;
  const currentConsumption = data[data.length - 1]?.consumption || 0;
  const efficiency = ((currentProduction / currentConsumption) * 100).toFixed(1);
  const isEfficient = parseFloat(efficiency) > 100;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="smart-card group"
    >
      {/* Header com Indicadores */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Energia em Tempo Real</h3>
            <p className="text-sm text-gray-400">Consumo vs Produção</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`status-indicator ${
            isEfficient ? 'status-operational' : 'status-warning'
          }`}>
            {isEfficient ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {efficiency}%
          </div>
        </div>
      </div>
      
      {/* Ações Rápidas (aparecem no hover) */}
      <div className="card-actions">
        <div className="flex space-x-2">
          <button className="glass-button p-2 text-xs">
            📊 Detalhes
          </button>
          <button className="glass-button p-2 text-xs">
            📈 Histórico
          </button>
        </div>
      </div>
      
      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{currentProduction} kW</p>
          <p className="text-xs text-gray-400">Produção Atual</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-400">{currentConsumption} kW</p>
          <p className="text-xs text-gray-400">Consumo Atual</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}
            labelStyle={{ color: '#f59e0b' }}
            formatter={(value: number, name: string) => [
              `${value} kW`,
              name === 'production' ? 'Produção' : 'Consumo'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="production" 
            stackId="1" 
            stroke="var(--success)" 
            fill="var(--success)" 
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="consumption" 
            stackId="2" 
            stroke="var(--warning)" 
            fill="var(--warning)" 
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend Melhorada */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-300">Produção</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-300">Consumo</span>
        </div>
      </div>
    </motion.div>
  );
}

export function MachineEfficiencyChart() {
  const [loading, setLoading] = useState(true);
  const [data] = useState(machineData);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <SkeletonChart height="300px" />;
  }
  
  const avgEfficiency = (data.reduce((acc, item) => acc + item.efficiency, 0) / data.length).toFixed(1);
  const criticalMachines = data.filter(item => item.efficiency < 90).length;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="smart-card group"
    >
      {/* Header Aprimorado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Eficiência das Linhas</h3>
            <p className="text-sm text-gray-400">Performance em Tempo Real</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`status-indicator ${
            parseFloat(avgEfficiency) > 90 ? 'status-operational' : 'status-warning'
          }`}>
            <Activity className="w-3 h-3 mr-1" />
            {avgEfficiency}%
          </div>
          {criticalMachines > 0 && (
            <div className="status-indicator status-error">
              ⚠️ {criticalMachines}
            </div>
          )}
        </div>
      </div>
      
      {/* Ações Rápidas */}
      <div className="card-actions">
        <div className="flex space-x-2">
          <button className="glass-button p-2 text-xs">
            🔧 Manutenção
          </button>
          <button className="glass-button p-2 text-xs">
            📊 Relatório
          </button>
        </div>
      </div>
      
      {/* Resumo Rápido */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-xl font-bold text-green-400">{data.filter(m => m.efficiency >= 95).length}</p>
          <p className="text-xs text-gray-400">Excelente</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-yellow-400">{data.filter(m => m.efficiency >= 90 && m.efficiency < 95).length}</p>
          <p className="text-xs text-gray-400">Boa</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-red-400">{criticalMachines}</p>
          <p className="text-xs text-gray-400">Crítica</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}
             formatter={(value: number, name: string) => [
               `${value}%`,
               name === 'efficiency' ? 'Eficiência' : name === 'downtime' ? 'Tempo Parado' : name
             ]}
           />
          <Bar 
             dataKey="efficiency" 
             fill="var(--warning)"
             radius={[4, 4, 0, 0]}
           />
         </BarChart>
       </ResponsiveContainer>
       
       {/* Legend e Resumo */}
       <div className="flex items-center justify-between mt-4">
         <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded bg-green-500"></div>
             <span className="text-xs text-gray-400">≥95% Excelente</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded bg-yellow-500"></div>
             <span className="text-xs text-gray-400">90-94% Boa</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-3 h-3 rounded bg-red-500"></div>
             <span className="text-xs text-gray-400">&lt;90% Crítica</span>
           </div>
         </div>
         <div className="text-xs text-gray-400">
           Média Geral: <span className="text-white font-semibold">{avgEfficiency}%</span>
         </div>
       </div>
    </motion.div>
  );
}

export function StatusPieChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Status das Máquinas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center space-x-4 mt-4">
        {statusData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-300">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function TemperatureChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Temperatura dos Sensores</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={temperatureData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
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
            dataKey="temp1" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="temp2" 
            stroke="#d97706" 
            strokeWidth={2}
            dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="temp3" 
            stroke="#6b7280" 
            strokeWidth={2}
            dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Export default para compatibilidade com imports
const Charts = {
  EnergyChart,
  MachineEfficiencyChart,
  StatusPieChart,
  TemperatureChart
};

export default Charts;
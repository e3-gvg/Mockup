'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Battery,
  BatteryLow,
  Thermometer,
  Wifi,
  WifiOff,
  Loader2,
  Signal,
  SignalLow
} from 'lucide-react';

// Visual Feedback Provider
export function VisualFeedbackProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="visual-feedback-provider">
      {children}
    </div>
  );
}

// Status Badge Component
export function StatusBadge({ 
  status, 
  label, 
  pulse = false 
}: { 
  status: 'online' | 'offline' | 'warning' | 'error' | 'loading';
  label: string;
  pulse?: boolean;
}) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30'
        };
      case 'offline':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30'
        };
      case 'loading':
        return {
          icon: Loader2,
          color: 'text-blue-400',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center space-x-2 px-3 py-1.5 rounded-full
        ${config.bg} ${config.border} border
        ${pulse ? 'animate-pulse' : ''}
      `}
    >
      <Icon 
        className={`w-4 h-4 ${config.color} ${status === 'loading' ? 'animate-spin' : ''}`} 
      />
      <span className="text-sm font-medium text-white">{label}</span>
    </motion.div>
  );
}

// Connection Status Component
export function ConnectionStatus({ 
  isConnected, 
  signalStrength = 100,
  showDetails = false 
}: { 
  isConnected: boolean;
  signalStrength?: number;
  showDetails?: boolean;
}) {
  const getSignalIcon = () => {
    if (!isConnected) return WifiOff;
    if (signalStrength > 70) return Wifi;
    if (signalStrength > 30) return Signal;
    return SignalLow;
  };

  const SignalIcon = getSignalIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2"
    >
      <SignalIcon 
        className={`w-5 h-5 ${
          isConnected 
            ? signalStrength > 70 
              ? 'text-green-400' 
              : signalStrength > 30 
                ? 'text-yellow-400' 
                : 'text-red-400'
            : 'text-gray-500'
        }`} 
      />
      {showDetails && (
        <div className="text-sm">
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
          {isConnected && (
            <span className="text-gray-400 ml-2">
              {signalStrength}%
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Battery Status Component
export function BatteryStatus({ 
  level, 
  isCharging = false,
  showPercentage = true 
}: { 
  level: number;
  isCharging?: boolean;
  showPercentage?: boolean;
}) {
  const getBatteryColor = () => {
    if (level > 50) return 'text-green-400';
    if (level > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const BatteryIcon = level > 20 ? Battery : BatteryLow;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2"
    >
      <div className="relative">
        <BatteryIcon className={`w-5 h-5 ${getBatteryColor()}`} />
        {isCharging && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-1 h-3 bg-yellow-400 rounded-full" />
          </motion.div>
        )}
      </div>
      {showPercentage && (
        <span className={`text-sm font-medium ${getBatteryColor()}`}>
          {level}%
        </span>
      )}
    </motion.div>
  );
}

// Temperature Indicator
export function TemperatureIndicator({ 
  temperature, 
  unit = '°C',
  min = 0,
  max = 100,
  warningThreshold = 80,
  criticalThreshold = 90
}: {
  temperature: number;
  unit?: string;
  min?: number;
  max?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
}) {
  const getTemperatureColor = () => {
    if (temperature >= criticalThreshold) return 'text-red-400';
    if (temperature >= warningThreshold) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const percentage = ((temperature - min) / (max - min)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-3"
    >
      <Thermometer className={`w-5 h-5 ${getTemperatureColor()}`} />
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-300">Temperatura</span>
          <span className={`text-sm font-semibold ${getTemperatureColor()}`}>
            {temperature}{unit}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-2 rounded-full ${
              temperature >= criticalThreshold
                ? 'bg-red-500'
                : temperature >= warningThreshold
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Performance Gauge
export function PerformanceGauge({ 
  value, 
  label,
  unit = '%',
  size = 'md'
}: {
  value: number;
  label: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return { container: 'w-16 h-16', text: 'text-xs' };
      case 'lg': return { container: 'w-24 h-24', text: 'text-lg' };
      default: return { container: 'w-20 h-20', text: 'text-sm' };
    }
  };

  const getValueColor = () => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const classes = getSizeClasses();
  const circumference = 2 * Math.PI * 30; // radius = 30
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-2"
    >
      <div className={`relative ${classes.container}`}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="30"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="30"
            stroke={value >= 90 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${getValueColor()} ${classes.text}`}>
            {Math.round(value)}{unit}
          </span>
        </div>
      </div>
      
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </motion.div>
  );
}

// Loading States
export function LoadingSpinner({ 
  size = 'md',
  color = 'blue' 
}: { 
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
}) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'green': return 'border-green-500';
      case 'yellow': return 'border-yellow-500';
      case 'red': return 'border-red-500';
      default: return 'border-blue-500';
    }
  };

  return (
    <div className={`
      ${getSizeClass()} 
      border-2 border-transparent 
      ${getColorClass()} 
      border-t-transparent 
      rounded-full 
      animate-spin
    `} />
  );
}

// Pulse Dot
export function PulseDot({ 
  color = 'green',
  size = 'md' 
}: { 
  color?: 'green' | 'yellow' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-2 h-2';
      case 'lg': return 'w-4 h-4';
      default: return 'w-3 h-3';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-400';
      case 'blue': return 'bg-blue-400';
      default: return 'bg-green-400';
    }
  };

  return (
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={`${getSizeClass()} ${getColorClass()} rounded-full`}
    />
  );
}

// Demo Component
export function VisualFeedbackDemo() {
  const [temperature, setTemperature] = useState(75);
  const [performance, setPerformance] = useState(85);
  const [battery, setBattery] = useState(60);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => Math.max(20, Math.min(100, prev + (Math.random() - 0.5) * 10)));
      setPerformance(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 20)));
      setBattery(prev => Math.max(0, Math.min(100, prev - 1)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Feedback Visual</h3>
      
      {/* Status Badges */}
      <div className="flex flex-wrap gap-3">
        <StatusBadge status="online" label="Sistema Online" />
        <StatusBadge status="warning" label="Alta Temperatura" pulse />
        <StatusBadge status="loading" label="Sincronizando" />
      </div>

      {/* Connection & Battery */}
      <div className="flex items-center justify-between">
        <ConnectionStatus 
          isConnected={isConnected} 
          signalStrength={85} 
          showDetails 
        />
        <BatteryStatus level={battery} isCharging={battery < 20} />
      </div>

      {/* Temperature */}
      <TemperatureIndicator 
        temperature={temperature}
        warningThreshold={70}
        criticalThreshold={85}
      />

      {/* Performance Gauges */}
      <div className="grid grid-cols-3 gap-4">
        <PerformanceGauge value={performance} label="CPU" />
        <PerformanceGauge value={75} label="Memória" />
        <PerformanceGauge value={92} label="Rede" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={() => setIsConnected(!isConnected)}
          className="glass-button text-sm"
        >
          {isConnected ? 'Desconectar' : 'Conectar'}
        </button>
        
        <div className="flex items-center space-x-2">
          <PulseDot color="green" />
          <span className="text-xs text-gray-400">Ativo</span>
        </div>
      </div>
    </div>
  );
}

export default VisualFeedbackDemo;
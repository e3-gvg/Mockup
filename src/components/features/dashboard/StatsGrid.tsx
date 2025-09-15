'use client';

import React from 'react';
import { 
  Activity, 
  Gauge, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { StatCard } from '@/components/ui/Card';
import { useStats } from '@/hooks/useStats';
import { ComponentVariant } from '@/styles/tokens';

// Interface para dados de estatísticas
interface StatData {
  id: string;
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: ComponentVariant;
}

// Dados mockados - em produção viriam da API
const mockStats: StatData[] = [
  {
    id: 'oee',
    title: 'Eficiência Geral (OEE)',
    value: '87.2%',
    trend: '+2.1%',
    description: 'Acima da meta de 85%',
    icon: Gauge,
    variant: 'success'
  },
  {
    id: 'availability',
    title: 'Disponibilidade',
    value: '94.8%',
    trend: '+1.2%',
    description: 'Tempo de operação ativo',
    icon: Activity,
    variant: 'info'
  },
  {
    id: 'performance',
    title: 'Performance',
    value: '91.5%',
    trend: '+0.8%',
    description: 'Velocidade de produção',
    icon: TrendingUp,
    variant: 'info'
  },
  {
    id: 'quality',
    title: 'Qualidade',
    value: '95.1%',
    trend: '-0.3%',
    description: 'Taxa de produtos conformes',
    icon: CheckCircle,
    variant: 'warning'
  },
  {
    id: 'energy',
    title: 'Eficiência Energética',
    value: '78.4%',
    trend: '+3.2%',
    description: 'Consumo otimizado',
    icon: Zap,
    variant: 'success'
  },
  {
    id: 'maintenance',
    title: 'Manutenção Preventiva',
    value: '12',
    trend: '+2',
    description: 'Equipamentos programados',
    icon: AlertTriangle,
    variant: 'warning'
  }
];

/**
 * Grid de estatísticas do dashboard usando o novo design system
 * 
 * Demonstra:
 * - Uso do componente StatCard reutilizável
 * - Design system consistente
 * - Animações escalonadas
 * - Estados de loading
 * - Responsividade
 */
export default function StatsGrid() {
  // Hook personalizado para gerenciar dados (implementação futura)
  const { stats, loading, error } = useStats();
  
  // Usar dados mockados enquanto a API não está implementada
  const displayStats = stats.length > 0 ? stats : mockStats;

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Erro ao carregar dados"
          value="--"
          description={error}
          variant="error"
          icon={AlertTriangle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título da seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Indicadores Principais
          </h2>
          <p className="text-gray-400">
            Acompanhe os KPIs em tempo real da sua operação
          </p>
        </div>
        
        {/* Indicador de atualização */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* Grid responsivo de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
            loading={loading}
          />
        ))}
      </div>

      {/* Resumo rápido */}
      <div className="mt-8 p-4 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-neutral-700/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Status Geral da Operação
            </h3>
            <p className="text-gray-400">
              Todos os sistemas operando dentro dos parâmetros normais
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">Operacional</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de exemplo para demonstrar diferentes variantes
export function StatsGridDemo() {
  const demoStats = [
    {
      id: 'demo-success',
      title: 'Exemplo Sucesso',
      value: '98.5%',
      trend: '+5.2%',
      description: 'Indicador positivo',
      icon: CheckCircle,
      variant: 'success' as ComponentVariant
    },
    {
      id: 'demo-info',
      title: 'Exemplo Informação',
      value: '1,234',
      trend: '+12',
      description: 'Dados informativos',
      icon: Activity,
      variant: 'info' as ComponentVariant
    },
    {
      id: 'demo-warning',
      title: 'Exemplo Atenção',
      value: '76.3%',
      trend: '-2.1%',
      description: 'Requer atenção',
      icon: AlertTriangle,
      variant: 'warning' as ComponentVariant
    },
    {
      id: 'demo-error',
      title: 'Exemplo Erro',
      value: '0',
      trend: '-100%',
      description: 'Sistema offline',
      icon: AlertTriangle,
      variant: 'error' as ComponentVariant
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        Demonstração de Variantes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            description={stat.description}
            icon={stat.icon}
            variant={stat.variant}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
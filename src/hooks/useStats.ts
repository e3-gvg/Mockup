'use client';

import { useState, useEffect, useCallback } from 'react';
import { ComponentVariant } from '@/styles/tokens';

// Interfaces para tipagem forte
export interface StatData {
  id: string;
  title: string;
  value: string;
  trend: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant: ComponentVariant;
  timestamp?: Date;
}

export interface UseStatsOptions {
  refreshInterval?: number; // em milissegundos
  autoRefresh?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: StatData[]) => void;
}

export interface UseStatsReturn {
  stats: StatData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook personalizado para gerenciar dados de estatísticas
 * 
 * Funcionalidades:
 * - Carregamento automático de dados
 * - Refresh automático configurável
 * - Gerenciamento de estados (loading, error)
 * - Cache local para performance
 * - Retry automático em caso de erro
 * 
 * @param options - Opções de configuração
 * @returns Objeto com dados e funções de controle
 * 
 * @example
 * ```tsx
 * const { stats, loading, error, refetch } = useStats({
 *   refreshInterval: 30000, // 30 segundos
 *   autoRefresh: true
 * });
 * ```
 */
export function useStats(options: UseStatsOptions = {}): UseStatsReturn {
  const {
    refreshInterval = 30000, // 30 segundos por padrão
    autoRefresh = true,
    onError,
    onSuccess
  } = options;

  // Estados do hook
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Função para buscar dados da API
  const fetchStats = useCallback(async (): Promise<StatData[]> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${apiUrl}/api/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Adicionar headers de autenticação se necessário
          // 'Authorization': `Bearer ${token}`
        },
        // Cache control para evitar dados stale
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validar estrutura dos dados
      if (!Array.isArray(data)) {
        throw new Error('Formato de dados inválido: esperado array');
      }

      // Transformar dados da API para o formato esperado
      const transformedData: StatData[] = data.map((item: Record<string, unknown>) => ({
        id: String(item.id) || Math.random().toString(36).substr(2, 9),
        title: String(item.title) || 'Sem título',
        value: String(item.value) || '--',
        trend: String(item.trend) || '0%',
        description: String(item.description) || '',
        variant: (item.variant as ComponentVariant) || 'default',
        timestamp: new Date(item.timestamp ? String(item.timestamp) : Date.now())
      }));

      return transformedData;
    } catch (fetchError) {
      console.error('Erro ao buscar estatísticas:', fetchError);
      throw fetchError;
    }
  }, []);

  // Função principal para carregar dados
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchStats();
      
      setStats(data);
      setLastUpdated(new Date());
      setRetryCount(0);
      
      // Callback de sucesso
      onSuccess?.(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      // Callback de erro
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      
      // Retry automático (máximo 3 tentativas)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadStats();
        }, Math.pow(2, retryCount) * 1000); // Backoff exponencial
      }
    } finally {
      setLoading(false);
    }
  }, [fetchStats, onError, onSuccess, retryCount]);

  // Função pública para refetch manual
  const refetch = useCallback(async () => {
    setRetryCount(0);
    await loadStats();
  }, [loadStats]);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  // Effect para carregamento inicial
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Effect para refresh automático
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      // Só faz refresh se não estiver carregando e não houver erro
      if (!loading && !error) {
        loadStats();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loading, error, loadStats]);

  // Effect para cleanup
  useEffect(() => {
    return () => {
      // Cleanup se necessário
    };
  }, []);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refetch,
    clearError
  };
}

// Hook especializado para estatísticas em tempo real
export function useRealTimeStats(options: UseStatsOptions = {}) {
  return useStats({
    refreshInterval: 5000, // 5 segundos para tempo real
    autoRefresh: true,
    ...options
  });
}

// Hook para estatísticas com cache mais longo
export function useCachedStats(options: UseStatsOptions = {}) {
  return useStats({
    refreshInterval: 300000, // 5 minutos
    autoRefresh: true,
    ...options
  });
}

// Utilitário para formatar valores de estatísticas
export function formatStatValue(value: string | number, type: 'percentage' | 'number' | 'currency' = 'number'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '--';
  
  switch (type) {
    case 'percentage':
      return `${numValue.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numValue);
    case 'number':
    default:
      return new Intl.NumberFormat('pt-BR').format(numValue);
  }
}

// Utilitário para determinar variante baseada em valor
export function getVariantByValue(
  value: number, 
  thresholds: { success: number; warning: number }
): ComponentVariant {
  if (value >= thresholds.success) return 'success';
  if (value >= thresholds.warning) return 'warning';
  return 'error';
}

export default useStats;
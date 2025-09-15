'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const AnaliseRefugoPage: React.FC = () => {
  const { isAuthenticated, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Análise de Refugo</h1>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-lg">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Últimos 3 meses</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Refugo</p>
                <p className="text-2xl font-bold text-red-600">3.2%</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">↑ 0.3% vs mês anterior</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custo do Refugo</p>
                <p className="text-2xl font-bold text-orange-600">R$ 45.2K</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">💰</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">↓ R$ 2.1K vs mês anterior</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peças Refugadas</p>
                <p className="text-2xl font-bold text-purple-600">1,247</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">📦</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">↑ 89 vs mês anterior</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eficiência</p>
                <p className="text-2xl font-bold text-green-600">96.8%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📈</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">↓ 0.3% vs mês anterior</p>
          </div>
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Tendência de Refugo por Período</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">[Gráfico de Linha - Taxa de Refugo ao Longo do Tempo]</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Refugo por Categoria</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">[Gráfico de Pizza - Distribuição por Tipo de Defeito]</p>
            </div>
          </div>
        </div>

        {/* Análise por Máquina */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Análise por Máquina</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Máquina</th>
                    <th className="text-left py-3 px-4">Taxa de Refugo</th>
                    <th className="text-left py-3 px-4">Peças Refugadas</th>
                    <th className="text-left py-3 px-4">Custo</th>
                    <th className="text-left py-3 px-4">Principal Defeito</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Máquina A-001</td>
                    <td className="py-3 px-4">
                      <span className="text-red-600 font-semibold">4.2%</span>
                    </td>
                    <td className="py-3 px-4">342</td>
                    <td className="py-3 px-4">R$ 12.4K</td>
                    <td className="py-3 px-4">Dimensional</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">Crítico</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Máquina B-002</td>
                    <td className="py-3 px-4">
                      <span className="text-orange-600 font-semibold">2.8%</span>
                    </td>
                    <td className="py-3 px-4">198</td>
                    <td className="py-3 px-4">R$ 8.1K</td>
                    <td className="py-3 px-4">Superficial</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Atenção</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">Máquina C-003</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-semibold">1.5%</span>
                    </td>
                    <td className="py-3 px-4">89</td>
                    <td className="py-3 px-4">R$ 3.2K</td>
                    <td className="py-3 px-4">Material</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Normal</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ações Recomendadas */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Ações Recomendadas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <span className="text-red-600 text-xl">🚨</span>
                <div>
                  <h4 className="font-semibold text-red-800">Máquina A-001 - Intervenção Urgente</h4>
                  <p className="text-red-700 text-sm">Taxa de refugo acima do limite crítico (4%). Recomenda-se parada para manutenção preventiva.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 text-xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-yellow-800">Treinamento da Equipe</h4>
                  <p className="text-yellow-700 text-sm">Aumento de defeitos superficiais indica necessidade de treinamento em controle de qualidade.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-600 text-xl">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-800">Otimização de Processo</h4>
                  <p className="text-blue-700 text-sm">Implementar controle estatístico de processo para reduzir variabilidade dimensional.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnaliseRefugoPage;
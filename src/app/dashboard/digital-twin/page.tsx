'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';

const DigitalTwinPage: React.FC = () => {
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
          <h1 className="text-2xl font-bold">Digital Twin</h1>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-lg">
              <option>Linha de Produção 1</option>
              <option>Linha de Produção 2</option>
              <option>Linha de Produção 3</option>
            </select>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Iniciar Simulação
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Exportar Modelo
            </button>
          </div>
        </div>

        {/* Status da Simulação */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status da Simulação</p>
                <p className="text-2xl font-bold text-green-600">Ativa</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🟢</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Executando há 2h 15min</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Precisão do Modelo</p>
                <p className="text-2xl font-bold text-blue-600">94.7%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">↑ 1.2% vs última calibração</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cenários Testados</p>
                <p className="text-2xl font-bold text-purple-600">47</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🧪</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">+12 hoje</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Economia Prevista</p>
                <p className="text-2xl font-bold text-orange-600">R$ 127K</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">💡</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Próximos 6 meses</p>
          </div>
        </div>

        {/* Visualização 3D e Controles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualização 3D Principal */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Modelo 3D da Linha de Produção</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">Reset View</button>
                  <button className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">Fullscreen</button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🏭</span>
                  <p className="text-gray-600 text-lg font-medium">[Visualização 3D Interativa]</p>
                  <p className="text-gray-500 text-sm mt-2">Modelo tridimensional da linha de produção com sensores IoT em tempo real</p>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de Controles */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Controles de Simulação</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Velocidade da Simulação</label>
                <input type="range" min="0.5" max="5" step="0.5" defaultValue="1" className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>5x</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura Ambiente (°C)</label>
                <input type="number" defaultValue="23" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Umidade (%)</label>
                <input type="number" defaultValue="45" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Produção (peças/h)</label>
                <input type="number" defaultValue="150" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-700 mb-3">Cenários Predefinidos</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100">
                    Produção Normal
                  </button>
                  <button className="w-full px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm hover:bg-orange-100">
                    Pico de Demanda
                  </button>
                  <button className="w-full px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100">
                    Falha de Equipamento
                  </button>
                  <button className="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100">
                    Otimização Energética
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Análise de Cenários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Análise de Performance</h3>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">[Gráfico de Performance vs Tempo Real]</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Previsões e Otimizações</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-xl">📈</span>
                    <div>
                      <h4 className="font-semibold text-green-800">Otimização Detectada</h4>
                      <p className="text-green-700 text-sm">Redução de 15% no tempo de ciclo ajustando velocidade da esteira</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-xl">🔮</span>
                    <div>
                      <h4 className="font-semibold text-blue-800">Previsão de Manutenção</h4>
                      <p className="text-blue-700 text-sm">Máquina B-002 necessitará manutenção em 72 horas</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-600 text-xl">⚡</span>
                    <div>
                      <h4 className="font-semibold text-purple-800">Economia de Energia</h4>
                      <p className="text-purple-700 text-sm">Possível redução de 8% no consumo energético</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Simulações */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Histórico de Simulações</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Data/Hora</th>
                    <th className="text-left py-3 px-4">Cenário</th>
                    <th className="text-left py-3 px-4">Duração</th>
                    <th className="text-left py-3 px-4">Resultado</th>
                    <th className="text-left py-3 px-4">Economia Prevista</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">15/01/2024 14:30</td>
                    <td className="py-3 px-4">Otimização Energética</td>
                    <td className="py-3 px-4">45min</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Sucesso</span>
                    </td>
                    <td className="py-3 px-4">R$ 12.5K/mês</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Detalhes</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">15/01/2024 10:15</td>
                    <td className="py-3 px-4">Pico de Demanda</td>
                    <td className="py-3 px-4">1h 20min</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Parcial</span>
                    </td>
                    <td className="py-3 px-4">R$ 8.2K/mês</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Detalhes</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">14/01/2024 16:45</td>
                    <td className="py-3 px-4">Falha de Equipamento</td>
                    <td className="py-3 px-4">2h 10min</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Sucesso</span>
                    </td>
                    <td className="py-3 px-4">R$ 25.8K/ano</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Detalhes</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DigitalTwinPage;
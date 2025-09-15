'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Upload,
  MoreVertical,
  Package,
  Cpu,
  Hash,
  IdCard,
  Tag
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider, useSmartModal } from '@/components/SmartModal';
import Tooltip from '@/components/Tooltip';
import AssetModal from '@/components/AssetModal';

// Tipo para representar uma máquina/ativo
interface Asset {
  id: string;
  modelo: string;
  tipo: string;
  codigo: string;
  matricula: string;
  apelido: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  createdAt: string;
  updatedAt: string;
}

// Dados mock baseados em máquinas Schnell Brasil
const mockAssets: Asset[] = [
  {
    id: '1',
    modelo: 'Serie 16 Super',
    tipo: 'Endireitadeira',
    codigo: 'END001',
    matricula: 'SCH-2024-001',
    apelido: 'Endireitadeira Principal',
    status: 'ativo',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    modelo: 'Serie 16 BD',
    tipo: 'Estribadeira',
    codigo: 'EST001',
    matricula: 'SCH-2024-002',
    apelido: 'Estribadeira Automática',
    status: 'ativo',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-21'
  },
  {
    id: '3',
    modelo: 'DBX 16',
    tipo: 'Dobradeira',
    codigo: 'DOB001',
    matricula: 'SCH-2024-003',
    apelido: 'Dobradeira Bi-direcional',
    status: 'manutencao',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-22'
  },
  {
    id: '4',
    modelo: 'CX 25',
    tipo: 'Cortadeira',
    codigo: 'COR001',
    matricula: 'SCH-2024-004',
    apelido: 'Cortadeira Hidráulica',
    status: 'inativo',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-23'
  },
  {
    id: '5',
    modelo: 'Serie 16 3D',
    tipo: 'Estribadeira',
    codigo: 'EST002',
    matricula: 'SCH-2024-005',
    apelido: 'Estribadeira 3D',
    status: 'ativo',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-24'
  },
  {
    id: '6',
    modelo: 'Reta Line',
    tipo: 'Central de Corte e Dobra',
    codigo: 'CCD001',
    matricula: 'SCH-2024-006',
    apelido: 'Central Principal',
    status: 'ativo',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25'
  }
];

function AssetsPageContent() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(mockAssets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const toast = useToast();
  const modal = useSmartModal();

  // Filtrar ativos baseado na busca e filtros
  useEffect(() => {
    let filtered = assets;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.apelido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inativo':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'manutencao':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'manutencao':
        return 'Manutenção';
      default:
        return 'Desconhecido';
    }
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setModalMode('create');
    setIsAssetModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalMode('edit');
    setIsAssetModalOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    const modalId = modal.confirm({
      title: 'Excluir Ativo',
      message: `Tem certeza que deseja excluir o ativo "${asset.apelido}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        setAssets(prev => prev.filter(a => a.id !== asset.id));
        toast.success('Ativo excluído com sucesso!');
        modal.close(modalId);
      },
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
      variant: 'error'
    });
  };



  const handleSaveAsset = (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    
    if (modalMode === 'create') {
      const newAsset: Asset = {
        ...assetData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      setAssets(prev => [...prev, newAsset]);
    } else if (modalMode === 'edit' && selectedAsset) {
      setAssets(prev => prev.map(a => 
        a.id === selectedAsset.id 
          ? { ...a, ...assetData, updatedAt: now }
          : a
      ));
    }
    
    setIsAssetModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={false}
          onToggle={() => {}}
          activeSection="ativos"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Ativos</h1>
                  <p className="text-gray-400">Gerenciamento de máquinas e equipamentos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tooltip content="Importar ativos">
                  <button className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                    <Upload className="w-5 h-5 text-gray-300" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Exportar ativos">
                  <button className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-300" />
                  </button>
                </Tooltip>

                <Tooltip content="Adicionar novo ativo">
                  <button
                    onClick={handleCreateAsset}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 text-white font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Novo Ativo</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* Filters and Search */}
          <div className="bg-gray-800/30 border-b border-gray-700/50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por modelo, tipo, código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="manutencao">Manutenção</option>
                  </select>
                </div>

                <div className="text-sm text-gray-400">
                  {filteredAssets.length} de {assets.length} ativos
                </div>
              </div>
            </div>
          </div>

          {/* Assets Table */}
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>Modelo</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4" />
                          <span>Tipo</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4" />
                          <span>Código</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <IdCard className="w-4 h-4" />
                          <span>Matrícula</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4" />
                          <span>Apelido</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filteredAssets.map((asset) => (
                      <motion.tr
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{asset.modelo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{asset.tipo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-300">{asset.codigo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-300">{asset.matricula}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{asset.apelido}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(asset.status)}`}>
                            {getStatusLabel(asset.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Tooltip content="Editar ativo">
                              <button
                                onClick={() => handleEditAsset(asset)}
                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            
                            <Tooltip content="Excluir ativo">
                              <button
                                onClick={() => handleDeleteAsset(asset)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            
                            <Tooltip content="Mais opções">
                              <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum ativo encontrado</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'todos'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece adicionando seu primeiro ativo'}
                  </p>
                  {!searchTerm && statusFilter === 'todos' && (
                    <button
                      onClick={handleCreateAsset}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 text-white font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Adicionar Primeiro Ativo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Modal */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setSelectedAsset(null);
        }}
        onSave={handleSaveAsset}
        asset={selectedAsset}
        mode={modalMode}
      />
    </div>
  );
}

export default function AssetsPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <AssetsPageContent />
      </ModalProvider>
    </NotificationProvider>
  );
}
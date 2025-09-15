'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity, 
  Download,
  Search,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { NotificationProvider, useToast } from '@/components/NotificationToast';
import { ModalProvider } from '@/components/SmartModal';
import { VisualFeedbackProvider } from '@/components/VisualFeedback';
import { StatusBadge } from '@/components/VisualFeedback';
import UserModal, { UserFormData } from '@/components/UserModal';

function UsuariosContent() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const toast = useToast();

  const userMetrics = [
    {
      title: 'Total de Usuários',
      value: '247',
      trend: '+12',
      description: 'Novos este mês',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40',
      borderColor: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      trendBg: 'bg-green-500/20',
      trendColor: 'text-green-400'
    },
    {
      title: 'Usuários Ativos',
      value: '189',
      trend: '+8',
      description: 'Últimas 24h',
      icon: Activity,
      bgColor: 'bg-gradient-to-br from-green-900/40 to-emerald-900/40',
      borderColor: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      trendBg: 'bg-green-500/20',
      trendColor: 'text-green-400'
    },
    {
      title: 'Administradores',
      value: '8',
      trend: '+1',
      description: 'Acesso total',
      icon: Shield,
      bgColor: 'bg-gradient-to-br from-purple-900/40 to-violet-900/40',
      borderColor: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      trendBg: 'bg-green-500/20',
      trendColor: 'text-green-400'
    },
    {
      title: 'Sessões Ativas',
      value: '156',
      trend: '+23',
      description: 'Conectados agora',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-orange-900/40 to-red-900/40',
      borderColor: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      trendBg: 'bg-green-500/20',
      trendColor: 'text-green-400'
    }
  ];

  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@vulcan.com',
      role: 'Administrador',
      department: 'TI',
      phone: '(11) 99999-9999',
      status: 'active' as 'active' | 'inactive',
      lastLogin: '2 min ago',
      permissions: ['read', 'write', 'admin'],
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@vulcan.com',
      role: 'Operador',
      department: 'Produção',
      phone: '(11) 88888-8888',
      status: 'active' as 'active' | 'inactive',
      lastLogin: '15 min ago',
      permissions: ['read', 'write'],
      avatar: 'MS'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@vulcan.com',
      role: 'Supervisor',
      department: 'Qualidade',
      phone: '(11) 77777-7777',
      status: 'inactive' as 'active' | 'inactive',
      lastLogin: '2 days ago',
      permissions: ['read', 'write'],
      avatar: 'CO'
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana.costa@vulcan.com',
      role: 'Analista',
      department: 'Analytics',
      status: 'active',
      lastLogin: '1 hour ago',
      permissions: ['read'],
      avatar: 'AC'
    },
    {
      id: 5,
      name: 'Pedro Ferreira',
      email: 'pedro.ferreira@vulcan.com',
      role: 'Técnico',
      department: 'Manutenção',
      status: 'active',
      lastLogin: '30 min ago',
      permissions: ['read', 'write'],
      avatar: 'PF'
    },
    {
      id: 6,
      name: 'Lucia Rodrigues',
      email: 'lucia.rodrigues@vulcan.com',
      role: 'Gerente',
      department: 'Operações',
      status: 'active',
      lastLogin: '5 min ago',
      permissions: ['read', 'write', 'manage'],
      avatar: 'LR'
    }
  ];

  const roleStats = [
    { role: 'Administrador', count: 8, color: 'bg-red-500', percentage: 3 },
    { role: 'Gerente', count: 15, color: 'bg-purple-500', percentage: 6 },
    { role: 'Supervisor', count: 32, color: 'bg-blue-500', percentage: 13 },
    { role: 'Operador', count: 145, color: 'bg-green-500', percentage: 59 },
    { role: 'Analista', count: 28, color: 'bg-yellow-500', percentage: 11 },
    { role: 'Técnico', count: 19, color: 'bg-orange-500', percentage: 8 }
  ];

  const [usersList, setUsersList] = useState(users);

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const recentActivities = [
    {
      user: 'João Silva',
      action: 'Login realizado',
      timestamp: '14:32:15',
      ip: '192.168.1.100',
      device: 'Chrome/Windows'
    },
    {
      user: 'Maria Santos',
      action: 'Dados de produção atualizados',
      timestamp: '14:28:42',
      ip: '192.168.1.105',
      device: 'Firefox/Windows'
    },
    {
      user: 'Ana Costa',
      action: 'Relatório gerado',
      timestamp: '14:25:11',
      ip: '192.168.1.112',
      device: 'Chrome/Windows'
    },
    {
      user: 'Pedro Ferreira',
      action: 'Configuração alterada',
      timestamp: '14:20:33',
      ip: '192.168.1.108',
      device: 'Edge/Windows'
    },
    {
      user: 'Lucia Rodrigues',
      action: 'Usuário criado',
      timestamp: '14:15:22',
      ip: '192.168.1.101',
      device: 'Chrome/Windows'
    }
  ];

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUserAction = (action: string, userId: number) => {
    const user = usersList.find(u => u.id === userId);
    
    switch (action) {
      case 'Editar':
        if (user) {
          setEditingUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            phone: user.phone || '',
            status: user.status as 'active' | 'inactive',
            permissions: user.permissions
          });
          setIsUserModalOpen(true);
        }
        break;
      
      case 'Excluir':
        if (user && window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
          setUsersList(prev => prev.filter(u => u.id !== userId));
          toast.success('Usuário Excluído', `${user.name} foi removido do sistema`);
        }
        break;
      
      case 'Bloquear':
        setUsersList(prev => prev.map(u =>
          u.id === userId ? { ...u, status: 'inactive' as 'active' | 'inactive' } : u
        ));
        toast.success('Usuário Bloqueado', `${user?.name} foi bloqueado`);
        break;
      
      case 'Desbloquear':
        setUsersList(prev => prev.map(u =>
          u.id === userId ? { ...u, status: 'active' as 'active' | 'inactive' } : u
        ));
        toast.success('Usuário Desbloqueado', `${user?.name} foi desbloqueado`);
        break;
      
      default:
        toast.success(
          'Ação do Usuário',
          `${action} realizada para ${user?.name}`
        );
    }
  };

  const handleSaveUser = (userData: UserFormData) => {
    if (editingUser) {
      // Editar usuário existente
      setUsersList(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: userData.name,
              email: userData.email,
              role: userData.role,
              department: userData.department,
              phone: userData.phone,
              status: userData.status,
              permissions: userData.permissions
            }
          : user
      ));
      toast.success('Usuário Atualizado', `${userData.name} foi atualizado com sucesso`);
    } else {
      // Criar novo usuário
      const newUser = {
        id: Math.max(...usersList.map(u => u.id)) + 1,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        status: userData.status,
        lastLogin: 'Nunca',
        permissions: userData.permissions,
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        phone: userData.phone
      };
      setUsersList(prev => [...prev, newUser]);
      toast.success('Usuário Criado', `${userData.name} foi adicionado ao sistema`);
    }
    
    setEditingUser(null);
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Nome', 'Email', 'Função', 'Departamento', 'Status', 'Último Login'].join(','),
      ...usersList.map(user => [
        user.name,
        user.email,
        user.role,
        user.department,
        user.status === 'active' ? 'Ativo' : 'Inativo',
        user.lastLogin
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exportação Concluída', 'Relatório de usuários exportado com sucesso');
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
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900 pointer-events-none" />

      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
          activeSection="usuarios"
          onSectionChange={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Gestão de Usuários</h1>
                  <p className="text-gray-400">Administração de usuários e permissões - {mounted && currentTime ? currentTime.toLocaleString('pt-BR') : '--:--:--'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => {
                    setEditingUser(null);
                    setIsUserModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">Novo Usuário</span>
                </button>
                <button 
                  onClick={handleExportUsers}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Exportar</span>
                </button>
                <StatusBadge status="online" label="Sistema Online" pulse />
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
              </div>
            </div>
          </header>

          {/* User Management Content */}
          <main className="p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userMetrics.map((metric, index) => {
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

            {/* Role Distribution and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Distribution */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Distribuição por Função</h2>
                <div className="space-y-4">
                  {roleStats.map((role, index) => (
                    <div key={role.role} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{role.role}</span>
                        <span className="text-white font-medium">{role.count} ({role.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${role.percentage}%` }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className={`h-2 rounded-full ${role.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Atividades Recentes</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/30 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium text-sm">{activity.user}</h3>
                        <span className="text-gray-400 text-xs">{activity.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{activity.action}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{activity.ip}</span>
                        <span>{activity.device}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Lista de Usuários</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-64"
                    />
                  </div>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="all">Todas as Funções</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Operador">Operador</option>
                    <option value="Analista">Analista</option>
                    <option value="Técnico">Técnico</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 font-medium py-3">Usuário</th>
                      <th className="text-left text-gray-300 font-medium py-3">Função</th>
                      <th className="text-left text-gray-300 font-medium py-3">Departamento</th>
                      <th className="text-left text-gray-300 font-medium py-3">Status</th>
                      <th className="text-left text-gray-300 font-medium py-3">Último Login</th>
                      <th className="text-left text-gray-300 font-medium py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{user.avatar}</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Administrador' ? 'bg-red-500/20 text-red-400' :
                            user.role === 'Gerente' ? 'bg-purple-500/20 text-purple-400' :
                            user.role === 'Supervisor' ? 'bg-blue-500/20 text-blue-400' :
                            user.role === 'Operador' ? 'bg-green-500/20 text-green-400' :
                            user.role === 'Analista' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">{user.department}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300 text-sm">{user.lastLogin}</td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleUserAction('Visualizar', user.id)}
                              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleUserAction('Editar', user.id)}
                              className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4 text-green-400" />
                            </button>
                            <button 
                              onClick={() => handleUserAction(user.status === 'active' ? 'Bloquear' : 'Desbloquear', user.id)}
                              className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg transition-colors"
                            >
                              {user.status === 'active' ? 
                                <Lock className="w-4 h-4 text-yellow-400" /> :
                                <Unlock className="w-4 h-4 text-yellow-400" />
                              }
                            </button>
                            <button 
                              onClick={() => handleUserAction('Excluir', user.id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editUser={editingUser}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
      />
    </div>
  );
}

export default function UsuariosPage() {
  return (
    <NotificationProvider>
      <ModalProvider>
        <VisualFeedbackProvider>
          <UsuariosContent />
        </VisualFeedbackProvider>
      </ModalProvider>
    </NotificationProvider>
  );
}
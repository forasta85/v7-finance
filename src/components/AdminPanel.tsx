import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Activity,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Shield,
  Calendar,
  Fingerprint,
  CreditCard,
  Target,
  RefreshCw,
  AlertCircle,
  UserPlus,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface AdminPanelProps {
  accessToken: string;
}

interface Stats {
  users: {
    total: number;
    withBiometric: number;
    withoutBiometric: number;
  };
  transactions: {
    total: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  features: {
    goals: number;
    savingsGoals: number;
    creditCards: number;
    installmentDebts: number;
    accounts: number;
    recurringTransactions: number;
  };
  averages: {
    transactionsPerUser: string;
    goalsPerUser: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignIn: string | null;
  blocked?: boolean;  // Status de bloqueio (opcional)
  stats: {
    transactionsCount: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    goalsCount: number;
    savingsGoalsCount: number;
    hasBiometric: boolean;
  };
}

export function AdminPanel({ accessToken }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'metrics'>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: '', name: '' });
  const [createdUserCredentials, setCreatedUserCredentials] = useState<{
    email: string;
    tempPassword: string;
    name: string;
    emailSent?: boolean; // Tornar opcional para não quebrar o código existente
  } | null>(null);

  // Verificar se é admin ao carregar
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/check`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const data = await response.json();
      
      if (!data.isAdmin) {
        setError('Você não tem permissão de administrador');
        setLoading(false);
        return;
      }

      // Se é admin, carregar dados
      await loadDashboardData();
    } catch (err) {
      console.error('Erro ao verificar admin:', err);
      setError('Erro ao verificar permissões');
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/stats`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/users`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ]);

      if (!statsRes.ok || !usersRes.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData.stats);
      setUsers(usersData.users);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do painel');
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${userEmail}?\n\nEsta ação não pode ser desfeita!`)) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erro ao deletar usuário - Response:', data);
        throw new Error(data.error || 'Erro ao deletar usuário');
      }

      console.log('✅ Usuário deletado com sucesso:', data);
      alert('Usuário deletado com sucesso!');
      await loadDashboardData(); // Recarregar dados
    } catch (err: any) {
      console.error('❌ Erro ao deletar usuário:', err);
      alert(`Erro ao deletar usuário: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const addUser = async () => {
    if (!newUserData.email) {
      alert('Email é obrigatório');
      return;
    }

    try {
      console.log('🔍 DEBUG: Criando usuário...', newUserData);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(newUserData)
        }
      );

      const data = await response.json();
      
      console.log('🔍 DEBUG: Resposta do servidor:', data);
      console.log('🔍 DEBUG: emailSent?', data.user?.emailSent);

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      setShowAddUserModal(false);
      
      // SEMPRE mostrar o modal - mas com mensagens diferentes
      console.log('🔑 DEBUG: Sempre mostrando modal - emailSent:', data.user.emailSent);
      
      setCreatedUserCredentials({
        email: data.user.email,
        tempPassword: data.user.tempPassword || '', // Vazio se email foi enviado
        name: data.user.name,
        emailSent: data.user.emailSent || false // Flag para saber se email foi enviado
      });
      
      setNewUserData({ email: '', name: '' });
      await loadDashboardData();
    } catch (err: any) {
      console.error('❌ Erro ao criar usuário:', err);
      alert(`❌ Erro: ${err.message || 'Não foi possível criar o usuário'}`);
    }
  };

  const toggleBlockUser = async (userId: string, userEmail: string, currentlyBlocked: boolean) => {
    const action = currentlyBlocked ? 'desbloquear' : 'bloquear';
    
    if (!confirm(`Tem certeza que deseja ${action} o usuário ${userEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/users/${userId}/block`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ blocked: !currentlyBlocked })
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao ${action} usuário`);
      }

      alert(`Usuário ${action}do com sucesso!`);
      await loadDashboardData();
    } catch (err) {
      console.error(`Erro ao ${action} usuário:`, err);
      alert(`Erro ao ${action} usuário`);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-red-600" size={48} />
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={24} />
          <div>
            <h3 className="font-semibold">Acesso Negado</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-gray-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={32} />
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
        </div>
        <p className="text-red-100">Visão geral e gerenciamento do V7 Finance</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-1 flex gap-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-red-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="inline mr-2" size={18} />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-red-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="inline mr-2" size={18} />
          Usuários ({users.length})
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-blue-500" size={24} />
                <span className="text-2xl font-bold text-gray-900">{stats.users.total}</span>
              </div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Fingerprint size={14} />
                <span>{stats.users.withBiometric} com biometria</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-green-500" size={24} />
                <span className="text-2xl font-bold text-gray-900">{stats.transactions.total}</span>
              </div>
              <p className="text-sm text-gray-600">Total de Transações</p>
              <div className="mt-2 text-xs text-gray-500">
                Média: {stats.averages.transactionsPerUser}/usuário
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="text-emerald-500" size={24} />
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.transactions.totalIncome)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Receitas Totais</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <Activity className="text-red-500" size={24} />
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.transactions.totalExpense)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Despesas Totais</p>
            </div>
          </div>

          {/* Features Usage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Uso de Funcionalidades
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-purple-600" size={20} />
                  <span className="font-semibold text-purple-900">{stats.features.goals}</span>
                </div>
                <p className="text-sm text-purple-700">Metas de Gastos</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-indigo-600" size={20} />
                  <span className="font-semibold text-indigo-900">{stats.features.savingsGoals}</span>
                </div>
                <p className="text-sm text-indigo-700">Metas de Poupança</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-blue-600" size={20} />
                  <span className="font-semibold text-blue-900">{stats.features.creditCards}</span>
                </div>
                <p className="text-sm text-blue-700">Cartões de Crédito</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-orange-600" size={20} />
                  <span className="font-semibold text-orange-900">{stats.features.installmentDebts}</span>
                </div>
                <p className="text-sm text-orange-700">Dívidas Parceladas</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-teal-600" size={20} />
                  <span className="font-semibold text-teal-900">{stats.features.accounts}</span>
                </div>
                <p className="text-sm text-teal-700">Contas Bancárias</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="text-pink-600" size={20} />
                  <span className="font-semibold text-pink-900">{stats.features.recurringTransactions}</span>
                </div>
                <p className="text-sm text-pink-700">Transações Recorrentes</p>
              </div>
            </div>
          </div>

          {/* Balance Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-red-900 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Resumo Financeiro Geral</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-1">Receitas</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats.transactions.totalIncome)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">Despesas</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(stats.transactions.totalExpense)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">Saldo Geral</p>
                <p className={`text-2xl font-bold ${stats.transactions.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(stats.transactions.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Total de Usuários</h3>
              <p className="text-sm text-gray-600">{users.length} usuários cadastrados</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus size={18} />
                Adicionar Usuário
              </button>
              <button
                onClick={loadDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={18} />
                Atualizar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.flatMap((user) => {
                    const isExpanded = expandedUserId === user.id;
                    const rows = [
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {user.name}
                                {user.stats.hasBiometric && (
                                  <Fingerprint size={14} className="text-green-600" title="Biometria ativada" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                          {user.lastSignIn && (
                            <div className="text-xs text-gray-500">
                              Último acesso: {formatDate(user.lastSignIn)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.stats.transactionsCount}</div>
                          <div className="text-xs text-gray-500">
                            {user.stats.goalsCount} metas
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${user.stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(user.stats.balance)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleBlockUser(user.id, user.email, user.blocked || false)}
                              className={`${
                                user.blocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'
                              } flex items-center gap-1`}
                              title={user.blocked ? 'Desbloquear usuário' : 'Bloquear usuário'}
                            >
                              {user.blocked ? (
                                <><Unlock size={16} /> Desbloquear</>
                              ) : (
                                <><Lock size={16} /> Bloquear</>
                              )}
                            </button>
                            <button
                              onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              {isExpanded ? (
                                <><ChevronUp size={16} /> Ocultar</>
                              ) : (
                                <><ChevronDown size={16} /> Detalhes</>
                              )}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id, user.email)}
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ];

                    if (isExpanded) {
                      rows.push(
                        <tr key={`${user.id}-details`}>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Receitas</p>
                                <p className="text-sm font-semibold text-green-600">
                                  {formatCurrency(user.stats.totalIncome)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Despesas</p>
                                <p className="text-sm font-semibold text-red-600">
                                  {formatCurrency(user.stats.totalExpense)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Metas de Gastos</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {user.stats.goalsCount}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Metas de Poupança</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {user.stats.savingsGoalsCount}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return rows;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Convidar Novo Usuário</h3>
            <p className="text-sm text-gray-600 mb-4">
              Um email será enviado com link para criar senha
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="usuario@exemplo.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome (opcional)</label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="Nome do usuário"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Atenção:</strong> Como o servidor de email não está configurado, uma senha temporária será gerada e você deverá enviá-la manualmente ao usuário.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUserData({ email: '', name: '' });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addUser}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Criar Usuário
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {createdUserCredentials && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Header fixo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-base md:text-lg font-bold text-green-600 flex items-center gap-2">
                <Shield size={20} className="md:size-6" />
                Usuário Criado!
              </h3>
              <button
                onClick={() => setCreatedUserCredentials(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Conteúdo com scroll */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {/* Se EMAIL FOI ENVIADO */}
              {createdUserCredentials.emailSent ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">✅</span>
                      <p className="text-sm md:text-base font-bold text-green-900">
                        Email de convite enviado com sucesso!
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-green-800 mt-2">
                      Um email foi enviado para:
                    </p>
                    <p className="text-sm md:text-base font-semibold text-green-900 mt-1 break-all">
                      {createdUserCredentials.email}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-xs md:text-sm text-blue-800">
                      📧 O usuário <strong>{createdUserCredentials.name}</strong> receberá um email com um link para criar sua própria senha de acesso ao V7 Finance.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>⏰ Atenção:</strong> O link do email expira em 24 horas. Se o usuário não criar a senha nesse período, você precisará reenviar o convite.
                    </p>
                  </div>
                </>
              ) : (
                /* Se SENHA TEMPORÁRIA foi gerada */
                <>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-xs md:text-sm text-green-800 mb-2">
                      ✅ Envie as credenciais abaixo para:
                    </p>
                    <p className="text-sm md:text-base font-semibold text-green-900 break-words">
                      {createdUserCredentials.name}
                    </p>
                    <p className="text-xs text-green-700 break-all">
                      {createdUserCredentials.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2.5">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email:</label>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs md:text-sm font-mono text-gray-900 break-all flex-1">{createdUserCredentials.email}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(createdUserCredentials.email);
                            alert('Email copiado!');
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2.5">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Senha Temporária:</label>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs md:text-sm font-mono text-red-600 font-bold break-all flex-1">{createdUserCredentials.tempPassword}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(createdUserCredentials.tempPassword);
                            alert('Senha copiada!');
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2.5">
                    <p className="text-xs text-yellow-800">
                      <strong>⚠️ IMPORTANTE:</strong> Esta senha só será exibida uma vez. Copie e envie ao usuário com segurança.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-2.5">
                    <p className="text-xs text-blue-800 mb-2 font-semibold">
                      📧 Mensagem pronta:
                    </p>
                    <div className="bg-white p-2 rounded text-[10px] md:text-xs text-gray-700 font-mono whitespace-pre-wrap border border-blue-200 max-h-32 overflow-y-auto">
{`Olá ${createdUserCredentials.name},

Seu acesso ao V7 Finance foi criado!

Email: ${createdUserCredentials.email}
Senha: ${createdUserCredentials.tempPassword}

Por favor, altere sua senha após o primeiro login.

Acesse: ${window.location.origin}`}
                    </div>
                    <button
                      onClick={() => {
                        const message = `Olá ${createdUserCredentials.name},\n\nSeu acesso ao V7 Finance foi criado!\n\nEmail: ${createdUserCredentials.email}\nSenha: ${createdUserCredentials.tempPassword}\n\nPor favor, altere sua senha após o primeiro login.\n\nAcesse: ${window.location.origin}`;
                        navigator.clipboard.writeText(message);
                        alert('Mensagem copiada!');
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      📋 Copiar mensagem completa
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer fixo */}
            <div className="flex justify-end p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setCreatedUserCredentials(null)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
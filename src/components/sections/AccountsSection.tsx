import React, { useState } from 'react';
import { Account } from '../../App';
import { Wallet, Plus, Trash2, CreditCard, PiggyBank, Banknote, TrendingUp, DollarSign } from 'lucide-react';

interface AccountsSectionProps {
  accounts: Account[];
  transactions: { id: string; type: 'income' | 'expense'; amount: number; accountId?: string }[];
  onAddAccount: (account: Omit<Account, 'id' | 'balance'>) => void;
  onDeleteAccount: (id: string) => void;
  onTransferBetweenAccounts?: (fromAccountId: string, toAccountId: string, amount: number) => void;
}

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Conta Corrente', icon: Wallet, color: '#3b82f6' },
  { value: 'savings', label: 'Poupança', icon: PiggyBank, color: '#10b981' },
  { value: 'cash', label: 'Dinheiro', icon: Banknote, color: '#f59e0b' },
  { value: 'credit', label: 'Cartão de Crédito', icon: CreditCard, color: '#8b5cf6' },
  { value: 'investment', label: 'Investimentos', icon: TrendingUp, color: '#ec4899' },
] as const;

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#f43f5e'
];

export function AccountsSection({
  accounts,
  transactions,
  onAddAccount,
  onDeleteAccount,
}: AccountsSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<Account['type']>('checking');
  const [newAccountColor, setNewAccountColor] = useState(PRESET_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;

    const accountType = ACCOUNT_TYPES.find((t) => t.value === newAccountType);
    const icon = accountType?.icon.name || 'Wallet';

    onAddAccount({
      name: newAccountName.trim(),
      type: newAccountType,
      color: newAccountColor,
      icon: icon,
    });

    // Resetar form
    setNewAccountName('');
    setNewAccountType('checking');
    setNewAccountColor(PRESET_COLORS[0]);
    setShowAddModal(false);
  };

  // Calcular saldo de cada conta baseado nas transações
  const getAccountBalance = (accountId: string) => {
    return transactions
      .filter((t) => t.accountId === accountId)
      .reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
  };

  // Calcular saldo total
  const totalBalance = accounts.reduce((sum, acc) => {
    return sum + getAccountBalance(acc.id);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header com Total Geral */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-white flex items-center gap-2">
            <DollarSign className="text-red-400" size={24} />
            Saldo Total
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Conta
          </button>
        </div>
        <p className="text-4xl font-bold text-white">
          R$ {totalBalance.toFixed(2)}
        </p>
        <p className="text-gray-400 mt-1">
          {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'}
        </p>
      </div>

      {/* Lista de Contas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
            <Wallet className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">Nenhuma conta cadastrada</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar Primeira Conta
            </button>
          </div>
        ) : (
          accounts.map((account) => {
            const balance = getAccountBalance(account.id);
            const accountType = ACCOUNT_TYPES.find((t) => t.value === account.type);
            const Icon = accountType?.icon || Wallet;

            return (
              <div
                key={account.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                style={{
                  borderTopColor: account.color,
                  borderTopWidth: '4px',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${account.color}20` }}
                    >
                      <Icon size={24} style={{ color: account.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-500">{accountType?.label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir a conta "${account.name}"?`)) {
                        onDeleteAccount(account.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Saldo Atual</p>
                  <p
                    className={`text-2xl font-bold ${
                      balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    R$ {balance.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <div className="flex-1 text-center py-2 px-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Transações</p>
                    <p className="font-semibold text-gray-900">
                      {transactions.filter((t) => t.accountId === account.id).length}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Adicionar Conta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nova Conta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome da Conta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Conta
                </label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Ex: Nubank, Caixa, Carteira..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Tipo de Conta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewAccountType(type.value)}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                          newAccountType === type.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={20} style={{ color: type.color }} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewAccountColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        newAccountColor === color
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { RecurringTransaction, Account, CreditCard, PaymentMethod } from '../../App';
import { Repeat, Plus, Trash2, Play, Pause, Calendar, DollarSign, CreditCard as CreditCardIcon, Wallet } from 'lucide-react';

interface RecurringSectionProps {
  recurringTransactions: RecurringTransaction[];
  accounts: Account[];
  creditCards: CreditCard[];
  paymentMethods: PaymentMethod[];
  expenseCategories: string[];
  incomeCategories: string[];
  onAddRecurring: (recurring: Omit<RecurringTransaction, 'id' | 'lastProcessed'>) => void;
  onToggleActive: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
}

const FREQUENCIES = [
  { value: 'daily', label: 'Diária', desc: 'Todo dia' },
  { value: 'weekly', label: 'Semanal', desc: 'Toda semana' },
  { value: 'monthly', label: 'Mensal', desc: 'Todo mês' },
  { value: 'yearly', label: 'Anual', desc: 'Todo ano' },
] as const;

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export function RecurringSection({
  recurringTransactions,
  accounts,
  creditCards,
  paymentMethods,
  expenseCategories,
  incomeCategories,
  onAddRecurring,
  onToggleActive,
  onDeleteRecurring,
}: RecurringSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    description: '',
    amount: '',
    category: '',
    accountId: '',
    paymentMethodId: '',
    paymentMethodType: 'other' as 'card' | 'other',
    frequency: 'monthly' as RecurringTransaction['frequency'],
    dayOfMonth: 1,
    dayOfWeek: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    tags: [] as string[],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || !formData.category) return;

    onAddRecurring({
      type: formData.type,
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      accountId: formData.accountId || undefined,
      paymentMethodId: formData.paymentMethodId || undefined,
      paymentMethodType: formData.paymentMethodId ? formData.paymentMethodType : undefined,
      frequency: formData.frequency,
      dayOfMonth: formData.frequency === 'monthly' ? formData.dayOfMonth : undefined,
      dayOfWeek: formData.frequency === 'weekly' ? formData.dayOfWeek : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      isActive: true,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      notes: formData.notes.trim() || undefined,
    });

    // Resetar form
    setFormData({
      type: 'expense',
      description: '',
      amount: '',
      category: '',
      accountId: '',
      paymentMethodId: '',
      paymentMethodType: 'other',
      frequency: 'monthly',
      dayOfMonth: 1,
      dayOfWeek: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      tags: [],
      notes: '',
    });
    setShowAddModal(false);
  };

  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;

  // Calcular próximo lançamento
  const getNextDate = (recurring: RecurringTransaction) => {
    const lastProcessed = recurring.lastProcessed ? new Date(recurring.lastProcessed) : new Date(recurring.startDate);
    const next = new Date(lastProcessed);

    switch (recurring.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next.toLocaleDateString('pt-BR');
  };

  const activeRecurring = recurringTransactions.filter((r) => r.isActive);
  const inactiveRecurring = recurringTransactions.filter((r) => !r.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-white flex items-center gap-2">
            <Repeat className="text-red-400" size={24} />
            Transações Recorrentes
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Recorrente
          </button>
        </div>
        <div className="flex gap-4 text-white">
          <div>
            <p className="text-gray-400 text-sm">Ativas</p>
            <p className="text-2xl font-bold">{activeRecurring.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Pausadas</p>
            <p className="text-2xl font-bold">{inactiveRecurring.length}</p>
          </div>
        </div>
      </div>

      {/* Transações Ativas */}
      {activeRecurring.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Ativas</h3>
          <div className="space-y-3">
            {activeRecurring.map((recurring) => (
              <div
                key={recurring.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{recurring.description}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          recurring.type === 'income'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {recurring.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{recurring.category}</p>
                  </div>
                  <p
                    className={`text-xl font-bold ${
                      recurring.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    R$ {recurring.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{FREQUENCIES.find((f) => f.value === recurring.frequency)?.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>Próximo: {getNextDate(recurring)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleActive(recurring.id)}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Pause size={16} />
                    Pausar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir "${recurring.description}"?`)) {
                        onDeleteRecurring(recurring.id);
                      }
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transações Pausadas */}
      {inactiveRecurring.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Pausadas</h3>
          <div className="space-y-3">
            {inactiveRecurring.map((recurring) => (
              <div
                key={recurring.id}
                className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 opacity-60"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{recurring.description}</h4>
                    <p className="text-sm text-gray-500">{recurring.category}</p>
                  </div>
                  <p className="text-xl font-bold text-gray-600">
                    R$ {recurring.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onToggleActive(recurring.id)}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Play size={16} />
                    Reativar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente excluir "${recurring.description}"?`)) {
                        onDeleteRecurring(recurring.id);
                      }
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {recurringTransactions.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <Repeat className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">Nenhuma transação recorrente cadastrada</p>
          <p className="text-sm text-gray-500 mb-6">
            Configure transações recorrentes como salário, aluguel, Netflix, etc.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Adicionar Primeira Recorrente
          </button>
        </div>
      )}

      {/* Modal Adicionar */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nova Transação Recorrente
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tipo */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    formData.type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Receita
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Aluguel, Salário, Netflix..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frequência */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as RecurringTransaction['frequency'],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    {FREQUENCIES.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label} - {freq.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dia do Mês (para mensais) */}
                {formData.frequency === 'monthly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dia do Mês
                    </label>
                    <input
                      type="number"
                      value={formData.dayOfMonth}
                      onChange={(e) =>
                        setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) || 1 })
                      }
                      min="1"
                      max="31"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}

                {/* Dia da Semana (para semanais) */}
                {formData.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dia da Semana
                    </label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) =>
                        setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      {DAYS_OF_WEEK.map((day, index) => (
                        <option key={index} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Data Início */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                {/* Conta (opcional) */}
                {accounts.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conta (Opcional)
                    </label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Sem conta</option>
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Método de Pagamento Unificado (cartões + outros) */}
                {(creditCards.length > 0 || paymentMethods.length > 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pagamento (Opcional)
                    </label>
                    <select
                      value={formData.paymentMethodId}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isCard = creditCards.some(c => c.id === value);
                        setFormData({ 
                          ...formData, 
                          paymentMethodId: value,
                          paymentMethodType: isCard ? 'card' : 'other'
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Sem método de pagamento</option>
                      {creditCards.length > 0 && (
                        <optgroup label="💳 Cartões de Crédito">
                          {creditCards.map((cc) => (
                            <option key={cc.id} value={cc.id}>
                              {cc.issuer} {cc.brand} ****{cc.lastFourDigits}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {paymentMethods.length > 0 && (
                        <optgroup label="💰 Outros Métodos">
                          {paymentMethods.map((pm) => (
                            <option key={pm.id} value={pm.id}>
                              {pm.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (Opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
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
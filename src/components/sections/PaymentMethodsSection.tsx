import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CreditCard, Wallet, TrendingUp, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import type { CreditCard as CreditCardType, PaymentMethod, InstallmentDebt, RecurringTransaction } from '../../App';

interface PaymentMethodsSectionProps {
  creditCards: CreditCardType[];
  paymentMethods: PaymentMethod[];
  installmentDebts: InstallmentDebt[];
  recurringTransactions: RecurringTransaction[];
  onAddPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdDate'>) => void;
  onDeletePaymentMethod: (id: string) => void;
}

const PAYMENT_METHOD_ICONS = {
  cash: '💵',
  pix: '🔷',
  debit: '💳',
  other: '💰',
};

const PAYMENT_METHOD_COLORS = [
  '#10b981', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16', // Lime
];

export function PaymentMethodsSection({
  creditCards,
  paymentMethods,
  installmentDebts,
  recurringTransactions,
  onAddPaymentMethod,
  onDeletePaymentMethod,
}: PaymentMethodsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash' | 'pix' | 'debit' | 'other'>('pix');
  const [selectedColor, setSelectedColor] = useState(PAYMENT_METHOD_COLORS[0]);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, informe um nome para o método de pagamento.');
      return;
    }

    onAddPaymentMethod({
      name: name.trim(),
      type,
      icon: PAYMENT_METHOD_ICONS[type],
      color: selectedColor,
    });

    // Resetar form
    setName('');
    setType('pix');
    setSelectedColor(PAYMENT_METHOD_COLORS[0]);
    setIsAdding(false);
  };

  // Calcular gastos por método de pagamento
  const paymentMethodStats = useMemo(() => {
    const stats: Record<string, {
      id: string;
      name: string;
      type: 'card' | 'other';
      icon: string;
      color: string;
      installments: InstallmentDebt[];
      recurring: RecurringTransaction[];
      totalMonthly: number;
      totalDebt: number;
    }> = {};

    // Adicionar cartões
    creditCards.forEach((card) => {
      const cardInstallments = installmentDebts.filter((d) => d.cardId === card.id && d.isActive);
      const cardRecurring = recurringTransactions.filter((r) => 
        r.paymentMethodId === card.id && r.paymentMethodType === 'card' && r.isActive
      );

      const totalMonthly = 
        cardInstallments.reduce((sum, d) => sum + d.installmentAmount, 0) +
        cardRecurring.reduce((sum, r) => sum + (r.frequency === 'monthly' ? r.amount : 0), 0);

      const totalDebt = cardInstallments.reduce((sum, d) => 
        sum + (d.installmentAmount * d.remainingInstallments), 0
      );

      stats[`card-${card.id}`] = {
        id: card.id,
        name: `${card.issuer} ${card.brand} ****${card.lastFourDigits}`,
        type: 'card',
        icon: '💳',
        color: card.color,
        installments: cardInstallments,
        recurring: cardRecurring,
        totalMonthly,
        totalDebt,
      };
    });

    // Adicionar outros métodos
    paymentMethods.forEach((method) => {
      const methodInstallments = installmentDebts.filter((d) => d.paymentMethodId === method.id && d.isActive);
      const methodRecurring = recurringTransactions.filter((r) => 
        r.paymentMethodId === method.id && r.paymentMethodType === 'other' && r.isActive
      );

      const totalMonthly = 
        methodInstallments.reduce((sum, d) => sum + d.installmentAmount, 0) +
        methodRecurring.reduce((sum, r) => sum + (r.frequency === 'monthly' ? r.amount : 0), 0);

      const totalDebt = methodInstallments.reduce((sum, d) => 
        sum + (d.installmentAmount * d.remainingInstallments), 0
      );

      stats[`method-${method.id}`] = {
        id: method.id,
        name: method.name,
        type: 'other',
        icon: method.icon,
        color: method.color,
        installments: methodInstallments,
        recurring: methodRecurring,
        totalMonthly,
        totalDebt,
      };
    });

    return stats;
  }, [creditCards, paymentMethods, installmentDebts, recurringTransactions]);

  const totalStats = useMemo(() => {
    const allStats = Object.values(paymentMethodStats);
    return {
      totalMonthly: allStats.reduce((sum, s) => sum + s.totalMonthly, 0),
      totalDebt: allStats.reduce((sum, s) => sum + s.totalDebt, 0),
      totalMethods: allStats.length,
    };
  }, [paymentMethodStats]);

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Total de Métodos</p>
            <Wallet size={20} className="text-blue-200" />
          </div>
          <p className="text-3xl font-bold">{totalStats.totalMethods}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm font-medium">Gasto Mensal Total</p>
            <Calendar size={20} className="text-orange-200" />
          </div>
          <p className="text-3xl font-bold">
            R$ {totalStats.totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100 text-sm font-medium">Dívida Total</p>
            <TrendingUp size={20} className="text-red-200" />
          </div>
          <p className="text-3xl font-bold">
            R$ {totalStats.totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Métodos de Pagamento</h2>
          <p className="text-sm text-gray-600 mt-1">
            Veja todos os gastos vinculados a cada método de pagamento
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Novo Método
        </button>
      </div>

      {/* Formulário de Adicionar Método */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet size={20} className="text-red-600" />
            Cadastrar Novo Método de Pagamento
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Método *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dinheiro, PIX Nubank, Débito Inter..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'cash' | 'pix' | 'debit' | 'other')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="pix">💷 PIX</option>
                  <option value="cash">💵 Dinheiro</option>
                  <option value="debit">💳 Débito</option>
                  <option value="other">💰 Outro</option>
                </select>
              </div>

              {/* Cor */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor de Identificação
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHOD_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        selectedColor === color
                          ? 'ring-4 ring-red-500 ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Cadastrar Método
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setName('');
                  setType('pix');
                  setSelectedColor(PAYMENT_METHOD_COLORS[0]);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Métodos de Pagamento com Gastos */}
      {Object.keys(paymentMethodStats).length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Wallet size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum método cadastrado</h3>
          <p className="text-gray-600 mb-4">
            Cadastre cartões de crédito ou outros métodos de pagamento para acompanhar seus gastos
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Adicionar Primeiro Método
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(paymentMethodStats).map(([key, method]) => {
            const isExpanded = expandedMethod === key;
            const hasItems = method.installments.length > 0 || method.recurring.length > 0;

            return (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Header do Método */}
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedMethod(isExpanded ? null : key)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                        style={{ backgroundColor: `${method.color}20`, color: method.color }}
                      >
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{method.name}</h4>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-gray-600">
                            💳 {method.installments.length} parcelamento(s)
                          </span>
                          <span className="text-gray-600">
                            🔄 {method.recurring.length} recorrente(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 mb-1">Gasto Mensal</p>
                      <p className="text-xl font-bold text-gray-900">
                        R$ {method.totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {method.totalDebt > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                          Dívida: R$ {method.totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>

                    {hasItems && (
                      <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Detalhes Expandidos */}
                {isExpanded && hasItems && (
                  <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-4">
                    {/* Parcelamentos */}
                    {method.installments.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <DollarSign size={16} />
                          Parcelamentos ({method.installments.length})
                        </h5>
                        <div className="space-y-2">
                          {method.installments.map((debt) => (
                            <div
                              key={debt.id}
                              className="bg-white rounded-lg p-3 border border-gray-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{debt.description}</p>
                                  <p className="text-sm text-gray-600">
                                    Parcela {debt.currentInstallment}/{debt.installments} • 
                                    R$ {debt.installmentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">
                                    Restante: R$ {(debt.installmentAmount * debt.remainingInstallments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recorrentes */}
                    {method.recurring.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Calendar size={16} />
                          Recorrentes ({method.recurring.length})
                        </h5>
                        <div className="space-y-2">
                          {method.recurring.map((recurring) => (
                            <div
                              key={recurring.id}
                              className="bg-white rounded-lg p-3 border border-gray-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{recurring.description}</p>
                                  <p className="text-sm text-gray-600 capitalize">
                                    {recurring.frequency === 'daily' && 'Diária'}
                                    {recurring.frequency === 'weekly' && 'Semanal'}
                                    {recurring.frequency === 'monthly' && 'Mensal'}
                                    {recurring.frequency === 'yearly' && 'Anual'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-medium ${recurring.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    R$ {recurring.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botão Excluir (somente para métodos não-cartão) */}
                    {method.type === 'other' && (
                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (method.installments.length > 0 || method.recurring.length > 0) {
                              alert('Não é possível excluir um método que possui gastos vinculados. Remova os gastos primeiro.');
                              return;
                            }
                            if (window.confirm(`Tem certeza que deseja excluir o método "${method.name}"?`)) {
                              onDeletePaymentMethod(method.id);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Trash2 size={16} />
                          Excluir Método
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

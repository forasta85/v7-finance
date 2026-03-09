import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CreditCard, CheckCircle, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import type { InstallmentDebt, CreditCard as CreditCardType, PaymentMethod } from '../../App';

interface InstallmentsSectionProps {
  installmentDebts: InstallmentDebt[];
  creditCards: CreditCardType[];
  paymentMethods: PaymentMethod[];
  expenseCategories: string[];
  onAddDebt: (debt: Omit<InstallmentDebt, 'id' | 'currentInstallment' | 'remainingInstallments'>) => void;
  onPayInstallment: (id: string) => void;
  onDeleteDebt: (id: string) => void;
}

export function InstallmentsSection({
  installmentDebts,
  creditCards,
  paymentMethods,
  expenseCategories,
  onAddDebt,
  onPayInstallment,
  onDeleteDebt,
}: InstallmentsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [cardId, setCardId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [paymentMethodType, setPaymentMethodType] = useState<'card' | 'other'>('card');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Cálculo automático do valor da parcela
  const installmentAmount = useMemo(() => {
    const total = parseFloat(totalAmount) || 0;
    const count = parseInt(installments) || 0;
    if (total > 0 && count > 0) {
      return total / count;
    }
    return 0;
  }, [totalAmount, installments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !totalAmount || !installments || !category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const total = parseFloat(totalAmount);
    const count = parseInt(installments);

    if (total <= 0) {
      alert('O valor total deve ser maior que zero.');
      return;
    }

    if (count <= 0) {
      alert('O número de parcelas deve ser maior que zero.');
      return;
    }

    onAddDebt({
      description,
      totalAmount: total,
      installments: count,
      installmentAmount: total / count,
      cardId: paymentMethodType === 'card' ? cardId || undefined : undefined,
      paymentMethodId: paymentMethodType === 'other' ? paymentMethodId || undefined : undefined,
      category,
      startDate,
      notes: notes || undefined,
      isActive: true,
    });

    // Resetar form
    setDescription('');
    setTotalAmount('');
    setInstallments('');
    setCardId('');
    setPaymentMethodId('');
    setPaymentMethodType('card');
    setCategory('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsAdding(false);
  };

  // Estatísticas
  const stats = useMemo(() => {
    const active = installmentDebts.filter((d) => d.isActive);
    const totalOwed = active.reduce((sum, d) => sum + d.installmentAmount * d.remainingInstallments, 0);
    const monthlyTotal = active.reduce((sum, d) => sum + d.installmentAmount, 0);
    const totalDebts = active.length;

    return { totalOwed, monthlyTotal, totalDebts };
  }, [installmentDebts]);

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-100 text-sm font-medium">Total em Dívidas</p>
            <TrendingDown size={20} className="text-red-200" />
          </div>
          <p className="text-3xl font-bold">
            R$ {stats.totalOwed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm font-medium">Gasto Mensal</p>
            <Calendar size={20} className="text-orange-200" />
          </div>
          <p className="text-3xl font-bold">
            R$ {stats.monthlyTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Dívidas Ativas</p>
            <CreditCard size={20} className="text-blue-200" />
          </div>
          <p className="text-3xl font-bold">{stats.totalDebts}</p>
        </div>
      </div>

      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dívidas Parceladas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie suas compras parceladas e acompanhe os pagamentos
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nova Dívida
        </button>
      </div>

      {/* Formulário de Adicionar */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-red-600" />
            Cadastrar Nova Dívida Parcelada
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Notebook Dell, TV Samsung 55..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Valor Total */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Total *
                </label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Número de Parcelas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Parcelas *
                </label>
                <input
                  type="number"
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  placeholder="12"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Valor da Parcela (calculado automaticamente) */}
              {installmentAmount > 0 && (
                <div className="md:col-span-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Valor de cada parcela:</span>{' '}
                      <span className="text-lg font-bold">
                        R$ {installmentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Método de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pagamento
                </label>
                <select
                  value={paymentMethodType}
                  onChange={(e) => setPaymentMethodType(e.target.value as 'card' | 'other')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="card">Cartão de Crédito</option>
                  <option value="other">Outro Método</option>
                </select>
              </div>

              {/* Cartão */}
              {paymentMethodType === 'card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cartão de Crédito
                  </label>
                  <select
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Sem cartão vinculado</option>
                    {creditCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.issuer} - {card.brand} ****{card.lastFourDigits}
                      </option>
                    ))}
                  </select>
                  {creditCards.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Cadastre um cartão na seção de Cartões para vincular
                    </p>
                  )}
                </div>
              )}

              {/* Outro Método de Pagamento */}
              {paymentMethodType === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outro Método de Pagamento
                  </label>
                  <select
                    value={paymentMethodId}
                    onChange={(e) => setPaymentMethodId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione um método</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                  {paymentMethods.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Cadastre um método de pagamento na seção de Métodos de Pagamento para vincular
                    </p>
                  )}
                </div>
              )}

              {/* Data de Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Compra *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Notas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a dívida..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Cadastrar Dívida
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setDescription('');
                  setTotalAmount('');
                  setInstallments('');
                  setCardId('');
                  setPaymentMethodId('');
                  setPaymentMethodType('card');
                  setCategory('');
                  setStartDate(new Date().toISOString().split('T')[0]);
                  setNotes('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Dívidas */}
      {installmentDebts.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma dívida cadastrada</h3>
          <p className="text-gray-600 mb-4">
            Cadastre suas compras parceladas para acompanhar os pagamentos
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Adicionar Primeira Dívida
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Dívidas Ativas */}
          {installmentDebts.filter((d) => d.isActive).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dívidas Ativas</h3>
              <div className="space-y-3">
                {installmentDebts
                  .filter((d) => d.isActive)
                  .map((debt) => {
                    const card = creditCards.find((c) => c.id === debt.cardId);
                    const progress = ((debt.installments - debt.remainingInstallments) / debt.installments) * 100;

                    return (
                      <div
                        key={debt.id}
                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {debt.description}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {debt.category}
                              </span>
                              {card && (
                                <>
                                  <span>•</span>
                                  <span
                                    className="flex items-center gap-1"
                                    style={{ color: card.color }}
                                  >
                                    <CreditCard size={14} />
                                    {card.brand} ****{card.lastFourDigits}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Tem certeza que deseja excluir a dívida "${debt.description}"?`
                                )
                              ) {
                                onDeleteDebt(debt.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Progresso */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              Parcela {debt.currentInstallment} de {debt.installments}
                            </span>
                            <span className="font-medium text-gray-900">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Valores */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-600 mb-0.5">Valor da Parcela</p>
                            <p className="text-sm font-bold text-gray-900">
                              R$ {debt.installmentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-600 mb-0.5">Total da Dívida</p>
                            <p className="text-sm font-bold text-gray-900">
                              R$ {debt.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-2">
                            <p className="text-xs text-orange-700 mb-0.5">Restante</p>
                            <p className="text-sm font-bold text-orange-900">
                              R${' '}
                              {(debt.installmentAmount * debt.remainingInstallments).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-xs text-green-700 mb-0.5">Pago</p>
                            <p className="text-sm font-bold text-green-900">
                              R${' '}
                              {(
                                debt.installmentAmount *
                                (debt.installments - debt.remainingInstallments)
                              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>

                        {/* Notas */}
                        {debt.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                            <p className="text-xs text-blue-800">{debt.notes}</p>
                          </div>
                        )}

                        {/* Botão de Pagar Parcela */}
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Confirmar pagamento da parcela ${debt.currentInstallment}/${debt.installments}?`
                              )
                            ) {
                              onPayInstallment(debt.id);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                        >
                          <CheckCircle size={18} />
                          Pagar Parcela {debt.currentInstallment}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Dívidas Finalizadas */}
          {installmentDebts.filter((d) => !d.isActive).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                Dívidas Finalizadas
              </h3>
              <div className="space-y-3">
                {installmentDebts
                  .filter((d) => !d.isActive)
                  .map((debt) => {
                    const card = creditCards.find((c) => c.id === debt.cardId);

                    return (
                      <div
                        key={debt.id}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 opacity-75"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 mb-1 line-through">
                              {debt.description}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs font-medium">
                                PAGA
                              </span>
                              <span>
                                {debt.installments}x de R${' '}
                                {debt.installmentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              {card && (
                                <span className="flex items-center gap-1" style={{ color: card.color }}>
                                  <CreditCard size={14} />
                                  {card.brand} ****{card.lastFourDigits}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Tem certeza que deseja excluir a dívida "${debt.description}" do histórico?`
                                )
                              ) {
                                onDeleteDebt(debt.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
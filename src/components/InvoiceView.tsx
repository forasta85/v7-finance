import React, { useMemo, useState } from 'react';
import { X, Calendar, DollarSign, CreditCard, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { CreditCard as CreditCardType, InstallmentDebt, RecurringTransaction } from '../App';
import {
  getInvoiceMonthYear,
  calculateInvoiceTotal,
  getNextDueDate,
  formatDateBR,
  getDueStatus,
} from '../utils/creditCardUtils';

interface InvoiceViewProps {
  card: CreditCardType;
  installmentDebts: InstallmentDebt[];
  recurringTransactions: RecurringTransaction[];
  onClose: () => void;
}

export function InvoiceView({
  card,
  installmentDebts,
  recurringTransactions,
  onClose,
}: InvoiceViewProps) {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = mês atual, 1 = próximo mês, -1 = mês anterior

  // Calcular mês/ano da fatura baseado no offset
  const invoicePeriod = useMemo(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + monthOffset);
    return getInvoiceMonthYear(card.dueDay, today);
  }, [card.dueDay, monthOffset]);

  // Calcular data de vencimento
  const dueDate = useMemo(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + monthOffset);
    return getNextDueDate(card.dueDay, today);
  }, [card.dueDay, monthOffset]);

  // Status do vencimento (apenas para mês atual)
  const dueStatus = monthOffset === 0 ? getDueStatus(card.dueDay) : null;

  // Filtrar gastos ativos do cartão
  const cardInstallments = useMemo(
    () => installmentDebts.filter((d) => d.cardId === card.id && d.isActive),
    [installmentDebts, card.id]
  );

  const cardRecurring = useMemo(
    () =>
      recurringTransactions.filter(
        (r) =>
          r.paymentMethodId === card.id &&
          r.paymentMethodType === 'card' &&
          r.isActive &&
          r.type === 'expense'
      ),
    [recurringTransactions, card.id]
  );

  // Calcular total da fatura
  const invoiceTotal = useMemo(() => {
    let total = 0;

    // Somar parcelamentos
    cardInstallments.forEach((debt) => {
      total += debt.installmentAmount;
    });

    // Somar recorrentes mensais
    cardRecurring.forEach((recurring) => {
      if (recurring.frequency === 'monthly') {
        total += recurring.amount;
      }
    });

    return total;
  }, [cardInstallments, cardRecurring]);

  // Agrupar por categoria
  const byCategory = useMemo(() => {
    const groups: Record<string, { items: any[]; total: number }> = {};

    cardInstallments.forEach((debt) => {
      if (!groups[debt.category]) {
        groups[debt.category] = { items: [], total: 0 };
      }
      groups[debt.category].items.push({ ...debt, type: 'installment' });
      groups[debt.category].total += debt.installmentAmount;
    });

    cardRecurring.forEach((recurring) => {
      if (recurring.frequency === 'monthly') {
        if (!groups[recurring.category]) {
          groups[recurring.category] = { items: [], total: 0 };
        }
        groups[recurring.category].items.push({ ...recurring, type: 'recurring' });
        groups[recurring.category].total += recurring.amount;
      }
    });

    return groups;
  }, [cardInstallments, cardRecurring]);

  const handleExport = () => {
    // Preparar dados para exportação
    const lines: string[] = [];
    lines.push(`Fatura - ${card.issuer} ${card.brand} ****${card.lastFourDigits}`);
    lines.push(`Período: ${invoicePeriod.label}`);
    lines.push(`Vencimento: ${formatDateBR(dueDate)}`);
    lines.push('');
    lines.push('Descrição;Categoria;Valor');

    Object.entries(byCategory).forEach(([category, data]) => {
      data.items.forEach((item) => {
        if (item.type === 'installment') {
          lines.push(
            `${item.description} (${item.currentInstallment}/${item.installments});${category};R$ ${item.installmentAmount.toFixed(2)}`
          );
        } else {
          lines.push(`${item.description} (Recorrente);${category};R$ ${item.amount.toFixed(2)}`);
        }
      });
    });

    lines.push('');
    lines.push(`TOTAL;; R$ ${invoiceTotal.toFixed(2)}`);

    // Criar e baixar arquivo
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fatura_${card.brand}_${invoicePeriod.month + 1}_${invoicePeriod.year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-gray-200"
          style={{ backgroundColor: `${card.color}10` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                style={{ backgroundColor: card.color }}
              >
                <CreditCard size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Fatura - {card.issuer} {card.brand}
                </h2>
                <p className="text-sm text-gray-600">****{card.lastFourDigits}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navegação de Mês */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMonthOffset(monthOffset - 1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{invoicePeriod.label}</p>
              <p className="text-sm text-gray-600">
                Vencimento: {formatDateBR(dueDate)}
                {dueStatus && monthOffset === 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      dueStatus.status === 'danger'
                        ? 'bg-red-100 text-red-700'
                        : dueStatus.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {dueStatus.message}
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => setMonthOffset(monthOffset + 1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Resumo da Fatura */}
        <div className="px-6 py-6 bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Total da Fatura</p>
              <p className="text-4xl font-bold text-blue-900">
                R$ {invoiceTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              Exportar CSV
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Parcelamentos</p>
              <p className="text-lg font-bold text-gray-900">{cardInstallments.length}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Recorrentes</p>
              <p className="text-lg font-bold text-gray-900">{cardRecurring.length}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {Object.keys(byCategory).length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum gasto nesta fatura</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(byCategory)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([category, data]) => (
                  <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header da Categoria */}
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{category}</h3>
                        <p className="font-bold text-gray-900">
                          R$ {data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    {/* Itens da Categoria */}
                    <div className="divide-y divide-gray-200">
                      {data.items.map((item, index) => (
                        <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.description}</p>
                              <p className="text-sm text-gray-600">
                                {item.type === 'installment' ? (
                                  <>
                                    Parcela {item.currentInstallment}/{item.installments}
                                    {item.notes && ` • ${item.notes}`}
                                  </>
                                ) : (
                                  <>
                                    Recorrente Mensal
                                    {item.notes && ` • ${item.notes}`}
                                  </>
                                )}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-gray-900 ml-4">
                              R${' '}
                              {(item.type === 'installment'
                                ? item.installmentAmount
                                : item.amount
                              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {Object.keys(byCategory).length} categoria(s) • {cardInstallments.length + cardRecurring.length} item(ns)
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

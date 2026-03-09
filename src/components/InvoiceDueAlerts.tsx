import React from 'react';
import { AlertTriangle, CreditCard, Calendar, DollarSign } from 'lucide-react';
import type { CreditCard as CreditCardType, InstallmentDebt, RecurringTransaction } from '../App';
import { getDueStatus, calculateInvoiceTotal, formatDateBR, getNextDueDate } from '../utils/creditCardUtils';

interface InvoiceDueAlertsProps {
  creditCards: CreditCardType[];
  installmentDebts: InstallmentDebt[];
  recurringTransactions: RecurringTransaction[];
  onNavigateToCards?: () => void;
}

export function InvoiceDueAlerts({
  creditCards,
  installmentDebts,
  recurringTransactions,
  onNavigateToCards,
}: InvoiceDueAlertsProps) {
  // Verificar quais cartões têm vencimento próximo ou atrasado
  const cardsWithAlerts = creditCards
    .map((card) => {
      const dueStatus = getDueStatus(card.dueDay);
      const invoiceTotal = calculateInvoiceTotal(
        card.id,
        new Date().getMonth(),
        new Date().getFullYear(),
        installmentDebts,
        recurringTransactions
      );
      const nextDue = getNextDueDate(card.dueDay);

      return {
        card,
        dueStatus,
        invoiceTotal,
        nextDue,
      };
    })
    .filter((item) => item.dueStatus.status === 'danger' || item.dueStatus.status === 'warning')
    .sort((a, b) => a.dueStatus.daysUntilDue - b.dueStatus.daysUntilDue);

  if (cardsWithAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {cardsWithAlerts.map(({ card, dueStatus, invoiceTotal, nextDue }) => (
        <div
          key={card.id}
          className={`border rounded-lg p-4 ${
            dueStatus.status === 'danger'
              ? 'bg-red-50 border-red-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Ícone */}
            <div
              className={`flex-shrink-0 ${
                dueStatus.status === 'danger' ? 'text-red-600' : 'text-yellow-600'
              }`}
            >
              <AlertTriangle size={24} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4
                    className={`font-semibold text-base ${
                      dueStatus.status === 'danger' ? 'text-red-900' : 'text-yellow-900'
                    }`}
                  >
                    Fatura {card.issuer} {card.brand}
                  </h4>
                  <p
                    className={`text-sm ${
                      dueStatus.status === 'danger' ? 'text-red-700' : 'text-yellow-700'
                    }`}
                  >
                    ****{card.lastFourDigits}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      dueStatus.status === 'danger' ? 'text-red-800' : 'text-yellow-800'
                    }`}
                  >
                    {dueStatus.message}
                  </p>
                  <p
                    className={`text-xs ${
                      dueStatus.status === 'danger' ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  >
                    {formatDateBR(nextDue)}
                  </p>
                </div>
              </div>

              {/* Valor da Fatura */}
              {invoiceTotal > 0 && (
                <div
                  className={`flex items-center gap-2 mb-3 p-3 rounded-lg ${
                    dueStatus.status === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}
                >
                  <DollarSign
                    size={20}
                    className={dueStatus.status === 'danger' ? 'text-red-700' : 'text-yellow-700'}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        dueStatus.status === 'danger' ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    >
                      Valor estimado da fatura
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        dueStatus.status === 'danger' ? 'text-red-900' : 'text-yellow-900'
                      }`}
                    >
                      R$ {invoiceTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}

              {/* Informações de gastos */}
              <div className="flex flex-wrap gap-3 text-xs mb-3">
                {(() => {
                  const cardInstallments = installmentDebts.filter(
                    (d) => d.cardId === card.id && d.isActive
                  );
                  const cardRecurring = recurringTransactions.filter(
                    (r) =>
                      r.paymentMethodId === card.id &&
                      r.paymentMethodType === 'card' &&
                      r.isActive &&
                      r.type === 'expense'
                  );

                  return (
                    <>
                      {cardInstallments.length > 0 && (
                        <span
                          className={`flex items-center gap-1 ${
                            dueStatus.status === 'danger' ? 'text-red-700' : 'text-yellow-700'
                          }`}
                        >
                          <CreditCard size={14} />
                          {cardInstallments.length} parcelamento(s)
                        </span>
                      )}
                      {cardRecurring.length > 0 && (
                        <span
                          className={`flex items-center gap-1 ${
                            dueStatus.status === 'danger' ? 'text-red-700' : 'text-yellow-700'
                          }`}
                        >
                          <Calendar size={14} />
                          {cardRecurring.length} recorrente(s)
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Botão de ação */}
              {onNavigateToCards && (
                <button
                  onClick={onNavigateToCards}
                  className={`text-sm font-medium underline ${
                    dueStatus.status === 'danger'
                      ? 'text-red-800 hover:text-red-900'
                      : 'text-yellow-800 hover:text-yellow-900'
                  }`}
                >
                  Ver detalhes do cartão →
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

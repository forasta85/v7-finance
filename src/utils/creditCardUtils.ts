/**
 * Utilitários para cálculos relacionados a cartões de crédito
 */

/**
 * Calcula a data de vencimento da fatura atual baseado no dia de vencimento do cartão
 * @param dueDay - Dia de vencimento (1-31)
 * @param referenceDate - Data de referência (opcional, padrão = hoje)
 * @returns Data de vencimento da próxima fatura
 */
export function getNextDueDate(dueDay: number, referenceDate: Date = new Date()): Date {
  const today = new Date(referenceDate);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();

  // Se ainda não passou o dia de vencimento deste mês, retorna este mês
  if (currentDay < dueDay) {
    return new Date(currentYear, currentMonth, dueDay);
  }
  
  // Caso contrário, retorna o próximo mês
  return new Date(currentYear, currentMonth + 1, dueDay);
}

/**
 * Calcula a data de fechamento da fatura (geralmente 7 dias antes do vencimento)
 * @param dueDay - Dia de vencimento (1-31)
 * @param closingDaysBefore - Dias antes do vencimento para fechamento (padrão = 7)
 * @param referenceDate - Data de referência (opcional, padrão = hoje)
 * @returns Data de fechamento da fatura
 */
export function getClosingDate(
  dueDay: number,
  closingDaysBefore: number = 7,
  referenceDate: Date = new Date()
): Date {
  const nextDue = getNextDueDate(dueDay, referenceDate);
  const closing = new Date(nextDue);
  closing.setDate(closing.getDate() - closingDaysBefore);
  return closing;
}

/**
 * Verifica se uma compra entrará na fatura atual ou na próxima
 * @param purchaseDate - Data da compra
 * @param dueDay - Dia de vencimento do cartão
 * @param closingDaysBefore - Dias antes do vencimento para fechamento
 * @returns Objeto com informações sobre qual fatura a compra pertence
 */
export function getInvoicePeriod(
  purchaseDate: Date,
  dueDay: number,
  closingDaysBefore: number = 7
): {
  closingDate: Date;
  dueDate: Date;
  isCurrentInvoice: boolean;
  daysUntilClosing: number;
} {
  const closing = getClosingDate(dueDay, closingDaysBefore, purchaseDate);
  const due = getNextDueDate(dueDay, purchaseDate);
  
  const purchaseTime = purchaseDate.getTime();
  const closingTime = closing.getTime();
  
  // Se a compra foi feita antes do fechamento, entra na fatura atual
  const isCurrentInvoice = purchaseTime <= closingTime;
  
  const now = new Date();
  const daysUntilClosing = Math.ceil((closingTime - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    closingDate: closing,
    dueDate: due,
    isCurrentInvoice,
    daysUntilClosing,
  };
}

/**
 * Calcula quantos dias faltam para o vencimento da fatura
 * @param dueDay - Dia de vencimento (1-31)
 * @param referenceDate - Data de referência (opcional, padrão = hoje)
 * @returns Número de dias até o vencimento
 */
export function getDaysUntilDue(dueDay: number, referenceDate: Date = new Date()): number {
  const nextDue = getNextDueDate(dueDay, referenceDate);
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  nextDue.setHours(0, 0, 0, 0);
  
  const diffTime = nextDue.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Formata uma data no formato brasileiro
 * @param date - Data a ser formatada
 * @returns String formatada (DD/MM/YYYY)
 */
export function formatDateBR(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Calcula o valor total da fatura de um cartão para um mês específico
 * @param cardId - ID do cartão
 * @param month - Mês (0-11)
 * @param year - Ano
 * @param installmentDebts - Array de dívidas parceladas
 * @param recurringTransactions - Array de transações recorrentes
 * @returns Valor total da fatura
 */
export function calculateInvoiceTotal(
  cardId: string,
  month: number,
  year: number,
  installmentDebts: any[],
  recurringTransactions: any[]
): number {
  let total = 0;

  // Somar parcelamentos ativos do cartão
  installmentDebts.forEach((debt) => {
    if (debt.cardId === cardId && debt.isActive) {
      total += debt.installmentAmount;
    }
  });

  // Somar recorrentes mensais do cartão
  recurringTransactions.forEach((recurring) => {
    if (
      recurring.paymentMethodId === cardId &&
      recurring.paymentMethodType === 'card' &&
      recurring.isActive &&
      recurring.type === 'expense'
    ) {
      if (recurring.frequency === 'monthly') {
        total += recurring.amount;
      }
    }
  });

  return total;
}

/**
 * Obtém o status do vencimento (ok, próximo, atrasado)
 * @param dueDay - Dia de vencimento
 * @param referenceDate - Data de referência
 * @returns Status e informações
 */
export function getDueStatus(
  dueDay: number,
  referenceDate: Date = new Date()
): {
  status: 'ok' | 'warning' | 'danger';
  message: string;
  daysUntilDue: number;
} {
  const daysUntilDue = getDaysUntilDue(dueDay, referenceDate);
  
  if (daysUntilDue < 0) {
    return {
      status: 'danger',
      message: `Venceu há ${Math.abs(daysUntilDue)} dia(s)`,
      daysUntilDue,
    };
  }
  
  if (daysUntilDue === 0) {
    return {
      status: 'danger',
      message: 'Vence hoje!',
      daysUntilDue,
    };
  }
  
  if (daysUntilDue <= 3) {
    return {
      status: 'danger',
      message: `Vence em ${daysUntilDue} dia(s)`,
      daysUntilDue,
    };
  }
  
  if (daysUntilDue <= 7) {
    return {
      status: 'warning',
      message: `Vence em ${daysUntilDue} dia(s)`,
      daysUntilDue,
    };
  }
  
  return {
    status: 'ok',
    message: `Vence em ${daysUntilDue} dia(s)`,
    daysUntilDue,
  };
}

/**
 * Calcula o período da fatura (mês/ano) baseado no dia de vencimento
 * @param dueDay - Dia de vencimento
 * @param referenceDate - Data de referência
 * @returns Objeto com mês e ano da fatura
 */
export function getInvoiceMonthYear(
  dueDay: number,
  referenceDate: Date = new Date()
): {
  month: number;
  year: number;
  label: string;
} {
  const today = new Date(referenceDate);
  const currentDay = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  
  // Se já passou o dia de vencimento, a fatura atual é do próximo mês
  if (currentDay >= dueDay) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return {
    month,
    year,
    label: `${monthNames[month]}/${year}`,
  };
}

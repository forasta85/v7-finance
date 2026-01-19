import { Transaction, Goal, Alert } from '../App';

/**
 * Gera alertas inteligentes baseados em transações, metas e padrões de gastos
 */
export function generateSmartAlerts(
  transactions: Transaction[],
  goals: Goal[],
  balanceLimit: number | null,
  balanceLimitEnabled: boolean
): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  // 1. Alerta de Meta Atingindo Limite (80% da meta)
  const monthlyExpenses = getMonthlyExpensesByCategory(transactions, currentMonth);
  
  goals.forEach((goal) => {
    const spent = monthlyExpenses[goal.category] || 0;
    const percentUsed = (spent / goal.monthlyLimit) * 100;

    if (percentUsed >= 80 && percentUsed < 100) {
      alerts.push({
        id: `goal-warning-${goal.id}`,
        type: 'warning',
        title: `Meta de ${goal.category} em 80%`,
        message: `Você já gastou R$ ${spent.toFixed(2)} de R$ ${goal.monthlyLimit.toFixed(2)} este mês`,
        date: now.toISOString(),
        isRead: false,
        actionLabel: 'Ver Metas',
        actionTarget: 'goals',
      });
    } else if (percentUsed >= 100) {
      alerts.push({
        id: `goal-exceeded-${goal.id}`,
        type: 'danger',
        title: `Meta de ${goal.category} excedida!`,
        message: `Você gastou R$ ${spent.toFixed(2)}, ultrapassando o limite de R$ ${goal.monthlyLimit.toFixed(2)}`,
        date: now.toISOString(),
        isRead: false,
        actionLabel: 'Ver Metas',
        actionTarget: 'goals',
      });
    }
  });

  // 2. Alerta de Saldo Mínimo
  if (balanceLimitEnabled && balanceLimit !== null) {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    if (balance <= balanceLimit && balance > 0) {
      alerts.push({
        id: `balance-warning`,
        type: 'warning',
        title: 'Saldo Baixo',
        message: `Seu saldo atual é R$ ${balance.toFixed(2)}, abaixo do limite de R$ ${balanceLimit.toFixed(2)}`,
        date: now.toISOString(),
        isRead: false,
        actionLabel: 'Ver Dashboard',
        actionTarget: 'dashboard',
      });
    } else if (balance < 0) {
      alerts.push({
        id: `balance-negative`,
        type: 'danger',
        title: 'Saldo Negativo!',
        message: `Atenção! Seu saldo está negativo: R$ ${balance.toFixed(2)}`,
        date: now.toISOString(),
        isRead: false,
        actionLabel: 'Ver Dashboard',
        actionTarget: 'dashboard',
      });
    }
  }

  // 3. Alerta de Gasto Acima da Média
  const last3MonthsAvg = getAverageExpensesLast3Months(transactions);
  const currentMonthExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
  
  if (currentMonthExpenses > last3MonthsAvg * 1.3 && last3MonthsAvg > 0) {
    alerts.push({
      id: `spending-above-avg`,
      type: 'warning',
      title: 'Gastos Acima da Média',
      message: `Este mês você gastou R$ ${currentMonthExpenses.toFixed(2)}, 30% acima da sua média de R$ ${last3MonthsAvg.toFixed(2)}`,
      date: now.toISOString(),
      isRead: false,
      actionLabel: 'Ver Relatório',
      actionTarget: 'reports',
    });
  }

  // 4. Alerta de Categoria com Maior Gasto
  const topCategory = Object.entries(monthlyExpenses)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (topCategory && topCategory[1] > 0) {
    const [category, amount] = topCategory;
    const percentOfTotal = (amount / currentMonthExpenses) * 100;

    if (percentOfTotal > 40) {
      alerts.push({
        id: `top-category-alert`,
        type: 'info',
        title: `${category} é sua maior despesa`,
        message: `${percentOfTotal.toFixed(0)}% do seu orçamento (R$ ${amount.toFixed(2)}) vai para ${category}`,
        date: now.toISOString(),
        isRead: false,
        actionLabel: 'Ver Transações',
        actionTarget: 'transactions',
      });
    }
  }

  // 5. Alerta de Sequência Positiva
  const lastDaysBalance = getLast7DaysBalance(transactions);
  if (lastDaysBalance > 0 && transactions.length > 0) {
    alerts.push({
      id: `positive-streak`,
      type: 'success',
      title: 'Parabéns! Sequência positiva',
      message: `Você economizou R$ ${lastDaysBalance.toFixed(2)} nos últimos 7 dias`,
      date: now.toISOString(),
      isRead: false,
      actionLabel: 'Ver Dashboard',
      actionTarget: 'dashboard',
    });
  }

  return alerts;
}

/**
 * Obtém despesas mensais agrupadas por categoria
 */
function getMonthlyExpensesByCategory(
  transactions: Transaction[],
  month: string
): Record<string, number> {
  return transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(month))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
}

/**
 * Calcula a média de despesas dos últimos 3 meses
 */
function getAverageExpensesLast3Months(transactions: Transaction[]): number {
  const now = new Date();
  const months: string[] = [];
  
  for (let i = 1; i <= 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7));
  }

  const monthlyTotals = months.map((month) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const sum = monthlyTotals.reduce((a, b) => a + b, 0);
  return sum / 3;
}

/**
 * Calcula o balanço dos últimos 7 dias
 */
function getLast7DaysBalance(transactions: Transaction[]): number {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date + 'T00:00:00');
    return tDate >= sevenDaysAgo;
  });

  const income = recentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = recentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return income - expense;
}

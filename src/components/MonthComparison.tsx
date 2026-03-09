import { useMemo } from 'react';
import { Transaction } from '../App';
import { TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface MonthComparisonProps {
  transactions: Transaction[];
}

export function MonthComparison({ transactions }: MonthComparisonProps) {
  const comparisonData = useMemo(() => {
    const now = new Date();
    const months: string[] = [];
    
    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7));
    }

    const monthlyData = months.map((month) => {
      const monthTransactions = transactions.filter((t) => t.date.startsWith(month));
      
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const balance = income - expense;

      // Obter nome do mês
      const date = new Date(month + '-01');
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });

      return {
        month,
        monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        income,
        expense,
        balance,
      };
    });

    return monthlyData;
  }, [transactions]);

  // Comparar último mês com penúltimo
  const lastMonth = comparisonData[comparisonData.length - 1];
  const previousMonth = comparisonData[comparisonData.length - 2];

  const incomeChange = lastMonth && previousMonth
    ? ((lastMonth.income - previousMonth.income) / previousMonth.income) * 100
    : 0;

  const expenseChange = lastMonth && previousMonth
    ? ((lastMonth.expense - previousMonth.expense) / previousMonth.expense) * 100
    : 0;

  const balanceChange = lastMonth && previousMonth
    ? lastMonth.balance - previousMonth.balance
    : 0;

  // Insights automáticos
  const insights = useMemo(() => {
    const tips: { type: 'success' | 'warning' | 'info'; message: string }[] = [];

    if (expenseChange > 20) {
      tips.push({
        type: 'warning',
        message: `Suas despesas aumentaram ${expenseChange.toFixed(0)}% em relação ao mês passado`,
      });
    } else if (expenseChange < -10) {
      tips.push({
        type: 'success',
        message: `Parabéns! Você reduziu despesas em ${Math.abs(expenseChange).toFixed(0)}%`,
      });
    }

    if (incomeChange < -10) {
      tips.push({
        type: 'warning',
        message: `Suas receitas caíram ${Math.abs(incomeChange).toFixed(0)}% este mês`,
      });
    } else if (incomeChange > 15) {
      tips.push({
        type: 'success',
        message: `Excelente! Suas receitas aumentaram ${incomeChange.toFixed(0)}%`,
      });
    }

    if (balanceChange > 0) {
      tips.push({
        type: 'success',
        message: `Você economizou R$ ${Math.abs(balanceChange).toFixed(2)} a mais que o mês passado`,
      });
    } else if (balanceChange < 0 && lastMonth.balance < 0) {
      tips.push({
        type: 'warning',
        message: 'Atenção! Seu balanço está negativo neste mês',
      });
    }

    // Tendência dos últimos 3 meses
    const last3Months = comparisonData.slice(-3);
    const avgExpense = last3Months.reduce((sum, m) => sum + m.expense, 0) / 3;
    
    if (lastMonth && lastMonth.expense > avgExpense * 1.2) {
      tips.push({
        type: 'info',
        message: `Seus gastos este mês estão 20% acima da média dos últimos 3 meses`,
      });
    }

    return tips;
  }, [comparisonData, expenseChange, incomeChange, balanceChange, lastMonth]);

  if (comparisonData.length === 0 || !lastMonth) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600">Dados insuficientes para comparação mensal</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Comparação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receitas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Receitas</h3>
            {incomeChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  incomeChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {incomeChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(incomeChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            R$ {lastMonth.income.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {previousMonth && (
              <>
                Anterior: R$ {previousMonth.income.toFixed(2)}
              </>
            )}
          </p>
        </div>

        {/* Despesas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Despesas</h3>
            {expenseChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  expenseChange < 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {expenseChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(expenseChange).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            R$ {lastMonth.expense.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {previousMonth && (
              <>
                Anterior: R$ {previousMonth.expense.toFixed(2)}
              </>
            )}
          </p>
        </div>

        {/* Balanço */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Balanço</h3>
            {balanceChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  balanceChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {balanceChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                R$ {Math.abs(balanceChange).toFixed(2)}
              </div>
            )}
          </div>
          <p
            className={`text-2xl font-bold mb-1 ${
              lastMonth.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            R$ {lastMonth.balance.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {previousMonth && (
              <>
                Anterior: R$ {previousMonth.balance.toFixed(2)}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Insights Automáticos */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-red-600" size={20} />
            Insights
          </h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-start gap-2 ${
                  insight.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <ArrowRight size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico de Barras - Receitas vs Despesas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          Receitas vs Despesas (Últimos 6 Meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="monthName" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="income" name="Receitas" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Linha - Evolução do Saldo */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          Evolução do Saldo
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="monthName" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

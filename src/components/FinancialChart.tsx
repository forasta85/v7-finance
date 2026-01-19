import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Transaction } from '../App';
import { useState } from 'react';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, Layers, Activity } from 'lucide-react';

interface FinancialChartProps {
  transactions: Transaction[];
  chartType?: ChartType;
}

const COLORS = ['#dc2626', '#ea580c', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type ChartType = 'bar' | 'stackedBar' | 'line' | 'area' | 'pie' | 'incomeVsExpense';

export const chartOptions = [
  { 
    type: 'bar' as ChartType, 
    label: 'Barras Agrupadas', 
    icon: BarChart3,
    description: 'Comparação mensal' 
  },
  { 
    type: 'stackedBar' as ChartType, 
    label: 'Barras Empilhadas', 
    icon: Layers,
    description: 'Total mensal' 
  },
  { 
    type: 'line' as ChartType, 
    label: 'Linhas', 
    icon: LineChartIcon,
    description: 'Tendência temporal' 
  },
  { 
    type: 'area' as ChartType, 
    label: 'Área', 
    icon: Activity,
    description: 'Evolução visual' 
  },
  { 
    type: 'pie' as ChartType, 
    label: 'Pizza', 
    icon: PieChartIcon,
    description: 'Despesas por categoria' 
  },
  { 
    type: 'incomeVsExpense' as ChartType, 
    label: 'Saldo Mensal', 
    icon: TrendingUp,
    description: 'Receitas - Despesas' 
  },
];

export type { ChartType };

export function FinancialChart({ transactions, chartType = 'bar' }: FinancialChartProps) {
  // Processar dados mensais
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { month, receitas: 0, despesas: 0, saldo: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].receitas += transaction.amount;
    } else {
      acc[month].despesas += transaction.amount;
    }
    
    acc[month].saldo = acc[month].receitas - acc[month].despesas;
    
    return acc;
  }, {} as Record<string, { month: string; receitas: number; despesas: number; saldo: number }>);

  const chartData = Object.values(monthlyData);

  // Dados por categoria (despesas)
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesas" fill="#dc2626" name="Despesas" radius={[8, 8, 0, 0]} />
          </BarChart>
        );

      case 'stackedBar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="receitas" stackId="a" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesas" stackId="a" fill="#dc2626" name="Despesas" radius={[0, 0, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="receitas" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Receitas"
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line 
              type="monotone" 
              dataKey="despesas" 
              stroke="#dc2626" 
              strokeWidth={3}
              name="Despesas"
              dot={{ fill: '#dc2626', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="receitas" 
              stroke="#10b981" 
              fill="#10b981"
              fillOpacity={0.6}
              strokeWidth={2}
              name="Receitas"
            />
            <Area 
              type="monotone" 
              dataKey="despesas" 
              stroke="#dc2626" 
              fill="#dc2626"
              fillOpacity={0.6}
              strokeWidth={2}
              name="Despesas"
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
          </PieChart>
        );

      case 'incomeVsExpense':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6b7280" />
            <Tooltip 
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="saldo" 
              fill="#3b82f6" 
              name="Saldo (Receitas - Despesas)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">📊 Análise Financeira</h2>
        
        {/* Descrição do gráfico atual */}
        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              {chartOptions.find(opt => opt.type === chartType)?.label}:
            </span>{' '}
            {chartOptions.find(opt => opt.type === chartType)?.description}
          </p>
        </div>
      </div>

      {/* Área do gráfico */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
        {transactions.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <div className="text-center">
              <PieChartIcon size={48} className="mx-auto mb-2 opacity-30" />
              <p>Nenhuma transação para exibir</p>
              <p className="text-sm mt-1">Adicione transações para visualizar os gráficos</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>

      {/* Estatísticas rápidas */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-green-600 mb-1">Total Receitas</p>
            <p className="text-green-700">
              {formatCurrency(chartData.reduce((sum, d) => sum + d.receitas, 0))}
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <p className="text-xs text-red-600 mb-1">Total Despesas</p>
            <p className="text-red-700">
              {formatCurrency(chartData.reduce((sum, d) => sum + d.despesas, 0))}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-blue-600 mb-1">Saldo</p>
            <p className={chartData.reduce((sum, d) => sum + d.saldo, 0) >= 0 ? 'text-blue-700' : 'text-red-700'}>
              {formatCurrency(chartData.reduce((sum, d) => sum + d.saldo, 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
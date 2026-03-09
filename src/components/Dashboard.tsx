import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function Dashboard({ totalIncome, totalExpense, balance }: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Receitas</p>
            <p className="text-gray-900 mt-2">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <TrendingUp className="text-gray-800" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Despesas</p>
            <p className="text-red-600 mt-2">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-full">
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Saldo</p>
            <p className={`mt-2 ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-gray-100' : 'bg-red-50'}`}>
            <DollarSign className={balance >= 0 ? 'text-gray-800' : 'text-red-600'} size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Trash2 } from 'lucide-react';
import { Transaction } from '../App';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma transação registrada
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-900">{transaction.description}</span>
              <span
                className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
              >
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{formatDate(transaction.date)}</span>
            </div>
          </div>
          <button
            onClick={() => onDelete(transaction.id)}
            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Deletar transação"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

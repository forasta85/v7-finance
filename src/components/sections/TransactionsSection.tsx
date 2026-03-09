import { useState } from 'react';
import { TransactionList } from '../TransactionList';
import { TransactionForm } from '../TransactionForm';
import { TourGuide, TourStep } from '../TourGuide';
import { Transaction } from '../../App';
import { Plus } from 'lucide-react';

interface TransactionsSectionProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionsSection({
  transactions,
  onAddTransaction,
  onDeleteTransaction
}: TransactionsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (transaction: Omit<Transaction, 'id'>) => {
    onAddTransaction(transaction);
    setShowForm(false);
  };

  // 📚 Definir passos do tour guiado
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="new-transaction-btn"]',
      title: '➕ Adicionar Transação',
      content: 'Clique aqui para adicionar uma nova receita ou despesa. Você pode registrar todas as suas movimentações financeiras!',
      position: 'bottom'
    },
    {
      target: '[data-tour="transaction-list"]',
      title: '📋 Lista de Transações',
      content: 'Aqui aparecem todas as suas transações registradas. Você pode ver detalhes, editar ou excluir cada uma delas.',
      position: 'top'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Transações</h2>
          <button
            data-tour="new-transaction-btn"
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            {showForm ? 'Cancelar' : 'Nova'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <TransactionForm onSubmit={handleSubmit} />
          </div>
        )}

        <div data-tour="transaction-list">
          <TransactionList 
            transactions={transactions}
            onDelete={onDeleteTransaction}
          />
        </div>
      </div>

      {/* 📚 Tour Guiado */}
      <TourGuide
        tourId="transactions-tour"
        steps={tourSteps}
        autoStart={true}
      />
    </div>
  );
}
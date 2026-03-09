import { useState } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { Transaction } from '../App';

export interface Goal {
  id: string;
  category: string;
  limit: number;
  month: string;
}

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
  transactions: Transaction[];
  expenseCategories: string[];
}

export function Goals({ goals, onAddGoal, onDeleteGoal, transactions, expenseCategories }: GoalsProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !limit) return;

    onAddGoal({
      category,
      limit: parseFloat(limit),
      month
    });

    setCategory('');
    setLimit('');
    setMonth(new Date().toISOString().slice(0, 7));
    setShowForm(false);
  };

  const getSpentAmount = (goal: Goal) => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === goal.category && 
        t.date.startsWith(goal.month)
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div data-tour="goals-header" className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-gray-700" />
          <h2 className="text-gray-900">Metas de Gastos</h2>
        </div>
        <button
          data-tour="add-goal-btn"
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          {showForm ? 'Cancelar' : 'Nova Meta'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2">Limite Mensal</label>
              <input
                type="number"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Mês</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Adicionar Meta
          </button>
        </form>
      )}

      <div data-tour="goals-list" className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma meta definida
          </div>
        ) : (
          goals.map((goal) => {
            const spent = getSpentAmount(goal);
            const percentage = (spent / goal.limit) * 100;
            const isOverBudget = spent > goal.limit;

            return (
              <div key={goal.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-gray-900">{goal.category}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(goal.month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Deletar meta"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isOverBudget ? 'text-red-600' : 'text-gray-700'}>
                      {formatCurrency(spent)} de {formatCurrency(goal.limit)}
                    </span>
                    <span className={isOverBudget ? 'text-red-600' : 'text-gray-700'}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOverBudget ? 'bg-red-600' : percentage > 80 ? 'bg-red-400' : 'bg-gray-800'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {isOverBudget && (
                  <div className="text-sm text-red-600">
                    ⚠️ Limite excedido em {formatCurrency(spent - goal.limit)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
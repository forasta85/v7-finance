import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Plus, Tag, FileText, Wallet } from 'lucide-react';
import { Transaction, Account } from '../App';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  expenseCategories: string[];
  incomeCategories: string[];
  initialType?: 'income' | 'expense';
  accounts?: Account[]; // 💳 NOVO
}

export function QuickAddModal({ isOpen, onClose, onAddTransaction, expenseCategories, incomeCategories, initialType = 'expense', accounts }: QuickAddModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // 💳 NOVO

  // Atualizar tipo quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setCategory('');
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      setSelectedAccount(null); // 💳 NOVO
    }
  }, [isOpen, initialType]);

  const handleCategoryChange = (value: string) => {
    if (value === '__new__') {
      setShowNewCategoryInput(true);
      setCategory('');
    } else {
      setShowNewCategoryInput(false);
      setCategory(value);
      setNewCategoryName('');
    }
  };

  const handleNewCategoryConfirm = () => {
    if (newCategoryName.trim()) {
      setCategory(newCategoryName.trim());
      setShowNewCategoryInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se está no modo de nova categoria, usar o nome digitado
    const finalCategory = showNewCategoryInput ? newCategoryName.trim() : category;
    
    console.log('📝 Submitting transaction:', {
      type,
      description,
      amount,
      category: finalCategory,
      date,
      showNewCategoryInput,
      newCategoryName
    });
    
    if (!description || !amount || !finalCategory) {
      alert('Preencha todos os campos');
      return;
    }

    onAddTransaction({
      type,
      description,
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      accountId: selectedAccount?.id, // 💳 NOVO
    });

    // Limpar formulário
    setDescription('');
    setAmount('');
    setCategory('');
    setNewCategoryName('');
    setShowNewCategoryInput(false);
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold">Nova Transação</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('');
                  setShowNewCategoryInput(false);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <TrendingUp size={20} />
                <span className="font-medium">Entrada</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('');
                  setShowNewCategoryInput(false);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <TrendingDown size={20} />
                <span className="font-medium">Saída</span>
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compras no supermercado"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            
            {!showNewCategoryInput ? (
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Selecione uma categoria</option>
                {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__new__" className="font-medium text-red-600">
                  ➕ Adicionar nova categoria...
                </option>
              </select>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nome da nova categoria"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleNewCategoryConfirm}
                    className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center"
                    title="Confirmar"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategoryName('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Voltar para categorias existentes
                </button>
              </div>
            )}

            {/* Mostrar categoria selecionada quando for nova */}
            {showNewCategoryInput && newCategoryName.trim() && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700">
                  <span className="font-medium">Nova categoria:</span> {newCategoryName.trim()}
                </p>
              </div>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Conta (opcional) */}
          {accounts && accounts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conta
              </label>
              <select
                value={selectedAccount ? selectedAccount.id : ''}
                onChange={(e) => setSelectedAccount(accounts.find(acc => acc.id === e.target.value) || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { Filter } from 'lucide-react';

interface FiltersProps {
  selectedType: string;
  selectedCategory: string;
  selectedPeriod: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onPeriodChange: (period: string) => void;
  categories: string[];
}

export function Filters({
  selectedType,
  selectedCategory,
  selectedPeriod,
  onTypeChange,
  onCategoryChange,
  onPeriodChange,
  categories
}: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-700" />
        <h2 className="text-gray-900">Filtros</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 text-sm mb-2">Tipo</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Todas</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">Período</label>
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Todos</option>
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
          </select>
        </div>
      </div>
    </div>
  );
}

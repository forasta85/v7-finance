import { Plus, FileText, User, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface TopActionBarProps {
  onQuickAddIncome: () => void;
  onQuickAddExpense: () => void;
  onOpenReports: () => void;
  onOpenProfile: () => void;
}

export function TopActionBar({ 
  onQuickAddIncome, 
  onQuickAddExpense, 
  onOpenReports, 
  onOpenProfile
}: TopActionBarProps) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const handleAddIncome = () => {
    console.log('🟢 Botão Nova Entrada clicado');
    onQuickAddIncome();
  };

  const handleAddExpense = () => {
    console.log('🔴 Botão Nova Saída clicado');
    onQuickAddExpense();
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[73px] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Título/Info */}
          <div className="hidden md:block">
            <h2 className="text-sm text-gray-500">Ações Rápidas</h2>
          </div>

          {/* Botões de Ação - Desktop */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {/* Adicionar Entrada */}
            <button
              onClick={handleAddIncome}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
            >
              <TrendingUp size={18} />
              <span>Nova Entrada</span>
            </button>

            {/* Adicionar Saída */}
            <button
              onClick={handleAddExpense}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
            >
              <TrendingDown size={18} />
              <span>Nova Saída</span>
            </button>

            {/* Relatórios */}
            <button
              onClick={onOpenReports}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
            >
              <FileText size={18} />
              <span>Relatórios</span>
            </button>

            {/* Perfil */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
            >
              <User size={18} />
              <span>Meu Perfil</span>
            </button>
          </div>

          {/* Botões Mobile - Menu Expandível */}
          <div className="md:hidden w-full relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md"
            >
              <Plus size={20} />
              <span className="font-medium">Ações Rápidas</span>
            </button>

            {/* Menu Dropdown Mobile */}
            {showQuickMenu && (
              <>
                {/* Overlay para fechar */}
                <div 
                  className="fixed inset-0 z-30"
                  onClick={() => setShowQuickMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-40">
                  <button
                    onClick={() => {
                      handleAddIncome();
                      setShowQuickMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Nova Entrada</p>
                      <p className="text-xs text-gray-500">Adicionar receita</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleAddExpense();
                      setShowQuickMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-100"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown size={20} className="text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Nova Saída</p>
                      <p className="text-xs text-gray-500">Adicionar despesa</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenReports();
                      setShowQuickMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Relatórios</p>
                      <p className="text-xs text-gray-500">Visualizar e exportar</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenProfile();
                      setShowQuickMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Meu Perfil</p>
                      <p className="text-xs text-gray-500">Dados da conta</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
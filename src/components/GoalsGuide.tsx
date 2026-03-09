import React from 'react';
import { Target, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export function GoalsGuide() {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Target className="text-red-600" size={40} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Metas de Gastos</h2>
          <p className="text-gray-600">Tutorial completo em desenvolvimento</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 font-semibold">🚧 Em Construção</p>
        <p className="text-sm text-yellow-700 mt-2">
          Este tutorial detalhado está sendo desenvolvido. Em breve você aprenderá a:
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-red-500 pl-4">
          <h3 className="font-bold text-gray-900 mb-2">📝 O que você vai aprender:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <Target className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Definir limites mensais por categoria</span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingDown className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Acompanhar progresso dos gastos em tempo real</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Receber alertas quando ultrapassar limites</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Ajustar metas conforme necessário</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>💡 Dica Rápida:</strong> Comece definindo metas para categorias onde você gasta mais, como Alimentação e Lazer!
          </p>
        </div>
      </div>
    </div>
  );
}

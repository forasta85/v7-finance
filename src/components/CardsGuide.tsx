import React from 'react';
import { CreditCard, Calendar, DollarSign, Bell } from 'lucide-react';

export function CardsGuide() {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="text-purple-600" size={40} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cartões de Crédito e Faturas</h2>
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
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-bold text-gray-900 mb-2">📝 O que você vai aprender:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CreditCard className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Cadastrar e gerenciar seus cartões de crédito</span>
            </li>
            <li className="flex items-start gap-2">
              <DollarSign className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Acompanhar faturas e limites disponíveis</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Controlar datas de vencimento</span>
            </li>
            <li className="flex items-start gap-2">
              <Bell className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Receber alertas de vencimento</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>💡 Dica Rápida:</strong> Configure seus cartões na seção "Cartões" do menu para começar a acompanhar suas faturas!
          </p>
        </div>
      </div>
    </div>
  );
}

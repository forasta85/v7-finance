import React from 'react';
import { Bell, MessageSquare, Clock, Settings } from 'lucide-react';

export function AlertsGuide() {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-orange-600" size={40} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Alertas</h2>
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
        <div className="border-l-4 border-orange-500 pl-4">
          <h3 className="font-bold text-gray-900 mb-2">📝 O que você vai aprender:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <Settings className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Configurar alertas automáticos personalizados</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageSquare className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Receber notificações via E-mail</span>
            </li>
            <li className="flex items-start gap-2">
              <Bell className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Tipos de alertas: limites, vencimentos, metas</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Definir horários e frequência</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>💡 Dica Rápida:</strong> Configure alertas de vencimento de faturas para nunca mais esquecer um pagamento!
          </p>
        </div>
      </div>
    </div>
  );
}
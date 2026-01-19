import React from 'react';
import { FileText, Download, BarChart3, Filter } from 'lucide-react';

export function ReportsGuide() {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-indigo-600" size={40} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios e Exportação</h2>
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
        <div className="border-l-4 border-indigo-500 pl-4">
          <h3 className="font-bold text-gray-900 mb-2">📝 O que você vai aprender:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <Filter className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Filtrar transações por período e categoria</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Visualizar dados em gráficos interativos</span>
            </li>
            <li className="flex items-start gap-2">
              <Download className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Exportar relatórios em CSV e PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
              <span>Enviar relatórios via E-mail</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>💡 Dica Rápida:</strong> Use a seção "Relatórios" para gerar análises mensais e compartilhar com seu contador!
          </p>
        </div>
      </div>
    </div>
  );
}
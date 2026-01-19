import { AutomationSettings } from '../AutomationSettings';
import { BiometricSettings } from '../BiometricSettings';
import { AlertTriangle, DollarSign, BarChart3, MessageCircle, Key, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { chartOptions, ChartType } from '../FinancialChart';

interface SettingsSectionProps {
  accessToken: string;
  userEmail: string; // 🔐 NOVO: Adicionar email do usuário
  balanceLimit: number | null;
  balanceLimitEnabled: boolean;
  onBalanceLimitChange: (limit: number | null) => void;
  onBalanceLimitEnabledChange: (enabled: boolean) => void;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export function SettingsSection({ 
  accessToken,
  userEmail, // 🔐 NOVO
  balanceLimit, 
  balanceLimitEnabled,
  onBalanceLimitChange,
  onBalanceLimitEnabledChange,
  chartType,
  onChartTypeChange
}: SettingsSectionProps) {
  const [limitInput, setLimitInput] = useState(balanceLimit?.toString() || '500');

  const handleSaveLimit = () => {
    const value = parseFloat(limitInput);
    if (!isNaN(value) && value > 0) {
      onBalanceLimitChange(value);
      alert('Limite de saldo salvo com sucesso!');
    } else {
      alert('Por favor, insira um valor válido.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuração de Limite de Saldo */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Alerta de Saldo Mínimo</h2>
            <p className="text-sm text-gray-500">Configure avisos quando seu saldo estiver baixo</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Toggle para ativar/desativar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Ativar alertas de saldo</p>
              <p className="text-sm text-gray-500">Receba avisos quando o saldo ficar abaixo do limite</p>
            </div>
            <button
              onClick={() => onBalanceLimitEnabledChange(!balanceLimitEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                balanceLimitEnabled ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  balanceLimitEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Configuração do valor limite */}
          {balanceLimitEnabled && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Mínimo de Saldo
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={limitInput}
                      onChange={(e) => setLimitInput(e.target.value)}
                      placeholder="500.00"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSaveLimit}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Salvar
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Você será alertado quando seu saldo ficar abaixo deste valor
                </p>
              </div>

              {/* Preview do alerta */}
              {balanceLimit !== null && (
                <div className="bg-white rounded-lg p-4 border border-red-300">
                  <p className="text-xs font-medium text-gray-700 mb-2">📋 Níveis de Alerta:</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-gray-600">
                        Saldo entre {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceLimit * 0.5)} e {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceLimit)} - Atenção
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-gray-600">
                        Saldo entre {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceLimit * 0.2)} e {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceLimit * 0.5)} - Aviso
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <span className="text-gray-600">
                        Saldo abaixo de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanceLimit * 0.2)} - Crítico
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Configurações de Automação */}
      <AutomationSettings accessToken={accessToken} />

      {/* Configurações de Gráfico Financeiro */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <BarChart3 size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-900">Configurações de Gráfico Financeiro</h2>
            <p className="text-sm text-gray-500">Selecione o tipo de gráfico para visualizar seus dados financeiros</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Seleção do tipo de gráfico */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Gráfico
              </label>
              
              {/* Grid de opções de gráfico */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chartOptions.map(option => {
                  const Icon = option.icon;
                  const isActive = chartType === option.type;
                  
                  return (
                    <button
                      key={option.type}
                      onClick={() => onChartTypeChange(option.type)}
                      className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md shadow-blue-500/20'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      title={option.description}
                    >
                      <Icon size={24} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                      <span className="text-sm text-center leading-tight font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500 text-center">{option.description}</span>
                    </button>
                  );
                })}
              </div>
              
              <p className="text-xs text-gray-600 mt-3">
                O gráfico selecionado será aplicado no dashboard principal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔐 NOVO: Configurações de Biometria */}
      <BiometricSettings accessToken={accessToken} userEmail={userEmail} />
    </div>
  );
}
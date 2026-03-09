import { AlertTriangle, X, TrendingDown } from 'lucide-react';

interface BalanceAlertProps {
  balance: number;
  balanceLimit: number;
  onNavigateToSettings?: () => void;
}

export function BalanceAlert({ balance, balanceLimit, onNavigateToSettings }: BalanceAlertProps) {
  if (balance >= balanceLimit) return null;

  const percentage = (balance / balanceLimit) * 100;
  const isCritical = percentage < 20; // Abaixo de 20% do limite
  const isWarning = percentage < 50 && percentage >= 20; // Entre 20% e 50%

  return (
    <div
      className={`rounded-2xl border-2 p-6 mb-6 shadow-lg ${
        isCritical
          ? 'bg-red-50 border-red-300'
          : isWarning
          ? 'bg-orange-50 border-orange-300'
          : 'bg-yellow-50 border-yellow-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Ícone */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            isCritical
              ? 'bg-red-100 text-red-600'
              : isWarning
              ? 'bg-orange-100 text-orange-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {isCritical ? (
            <AlertTriangle size={24} className="animate-pulse" />
          ) : (
            <TrendingDown size={24} />
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className={`font-bold mb-1 ${
                  isCritical
                    ? 'text-red-900'
                    : isWarning
                    ? 'text-orange-900'
                    : 'text-yellow-900'
                }`}
              >
                {isCritical
                  ? '⚠️ Atenção: Saldo Crítico!'
                  : isWarning
                  ? '⚡ Aviso: Saldo Baixo'
                  : '💡 Atenção ao Saldo'}
              </h3>
              <p
                className={`text-sm ${
                  isCritical
                    ? 'text-red-700'
                    : isWarning
                    ? 'text-orange-700'
                    : 'text-yellow-700'
                }`}
              >
                {isCritical
                  ? 'Seu saldo está criticamente baixo!'
                  : isWarning
                  ? 'Seu saldo está abaixo de 50% do limite configurado.'
                  : 'Seu saldo está se aproximando do limite mínimo.'}
              </p>
            </div>

            {/* Botão fechar */}
            {onNavigateToSettings && (
              <button
                onClick={onNavigateToSettings}
                className={`text-gray-400 hover:text-gray-600 transition-colors ${
                  isCritical ? 'text-red-400 hover:text-red-600' : ''
                }`}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Detalhes */}
          <div className="space-y-3">
            {/* Valores */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Saldo Atual</p>
                <p
                  className={`font-bold ${
                    isCritical
                      ? 'text-red-900'
                      : isWarning
                      ? 'text-orange-900'
                      : 'text-yellow-900'
                  }`}
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(balance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Limite Configurado</p>
                <p className="font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(balanceLimit)}
                </p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">
                  {percentage.toFixed(0)}% do limite
                </span>
                <span
                  className={`text-xs font-medium ${
                    isCritical
                      ? 'text-red-700'
                      : isWarning
                      ? 'text-orange-700'
                      : 'text-yellow-700'
                  }`}
                >
                  {balance < 0 ? 'Negativo!' : `Faltam ${new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(balanceLimit - balance)}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    isCritical
                      ? 'bg-red-600'
                      : isWarning
                      ? 'bg-orange-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Recomendações */}
            <div
              className={`rounded-lg p-3 ${
                isCritical
                  ? 'bg-red-100 border border-red-200'
                  : isWarning
                  ? 'bg-orange-100 border border-orange-200'
                  : 'bg-yellow-100 border border-yellow-200'
              }`}
            >
              <p className="text-xs text-gray-700">
                <span className="font-medium">💡 Recomendação:</span>
                {isCritical
                  ? ' Evite novas despesas até aumentar seu saldo. Considere adicionar receitas ou revisar gastos urgentemente.'
                  : isWarning
                  ? ' Monitore seus gastos nos próximos dias e considere reduzir despesas não essenciais.'
                  : ' Fique atento aos seus gastos para não ultrapassar o limite estabelecido.'}
              </p>
            </div>

            {/* Botão de configurações */}
            {onNavigateToSettings && (
              <button
                onClick={onNavigateToSettings}
                className={`text-sm font-medium underline ${
                  isCritical
                    ? 'text-red-700 hover:text-red-900'
                    : isWarning
                    ? 'text-orange-700 hover:text-orange-900'
                    : 'text-yellow-700 hover:text-yellow-900'
                }`}
              >
                Ajustar limite nas configurações →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
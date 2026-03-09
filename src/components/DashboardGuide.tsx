import React, { useState } from 'react';
import { TrendingUp, DollarSign, TrendingDown, Wallet, BarChart3, PieChart, Calendar, CheckCircle, ChevronRight } from 'lucide-react';

export function DashboardGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    {
      number: 1,
      title: 'Visão Geral do Dashboard',
      description: 'O Dashboard é a tela principal onde você visualiza um resumo completo das suas finanças.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Quando você abre o V7 Finance, o <strong>Dashboard</strong> é a primeira tela que aparece. 
            Ela foi projetada para dar uma visão geral rápida da sua situação financeira.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Todos os dados mostrados no Dashboard são atualizados automaticamente 
              sempre que você adiciona, edita ou remove uma transação!
            </p>
          </div>
        </div>
      )
    },
    {
      number: 2,
      title: 'Cards de Resumo Financeiro',
      description: 'Entenda os 4 cards principais que mostram seu saldo, receitas, despesas e economia.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Na parte superior do Dashboard você encontra <strong>4 cards coloridos</strong> com informações essenciais:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Saldo Total */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={20} />
                <span className="text-sm font-medium">Saldo Total</span>
              </div>
              <div className="text-2xl font-bold">R$ 5.432,00</div>
              <p className="text-xs text-blue-100 mt-2">Seu saldo atual (Receitas - Despesas)</p>
            </div>

            {/* Card Receitas */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-medium">Receitas</span>
              </div>
              <div className="text-2xl font-bold">R$ 8.500,00</div>
              <p className="text-xs text-green-100 mt-2">Total de entradas no período</p>
            </div>

            {/* Card Despesas */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={20} />
                <span className="text-sm font-medium">Despesas</span>
              </div>
              <div className="text-2xl font-bold">R$ 3.068,00</div>
              <p className="text-xs text-red-100 mt-2">Total de saídas no período</p>
            </div>

            {/* Card Economia */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} />
                <span className="text-sm font-medium">Economia</span>
              </div>
              <div className="text-2xl font-bold">64%</div>
              <p className="text-xs text-purple-100 mt-2">Percentual economizado</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>📊 Como funciona:</strong> Os valores mudam automaticamente baseados no 
              <strong> Período</strong> selecionado (Mês Atual, Últimos 30 dias, etc.)
            </p>
          </div>
        </div>
      )
    },
    {
      number: 3,
      title: 'Gráficos Interativos',
      description: 'Visualize seus dados através de gráficos de pizza, barras, linha e muito mais.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Logo abaixo dos cards, você encontra <strong>gráficos interativos</strong> que ajudam 
            a entender melhor como seu dinheiro está distribuído:
          </p>

          <div className="space-y-3">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="text-purple-600" size={24} />
                <h4 className="font-bold text-gray-900">Gráfico de Pizza</h4>
              </div>
              <p className="text-sm text-gray-600">
                Mostra a <strong>proporção de despesas por categoria</strong>. Exemplo: 30% Alimentação, 
                20% Transporte, etc.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-blue-600" size={24} />
                <h4 className="font-bold text-gray-900">Gráfico de Barras</h4>
              </div>
              <p className="text-sm text-gray-600">
                Compara <strong>Receitas vs Despesas</strong> ao longo do tempo (por mês, semana, etc.)
              </p>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-green-600" size={24} />
                <h4 className="font-bold text-gray-900">Outros Gráficos</h4>
              </div>
              <p className="text-sm text-gray-600">
                Você pode alternar entre <strong>diferentes tipos de visualização</strong> clicando 
                nos botões acima de cada gráfico.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>✨ Interatividade:</strong> Passe o mouse sobre os gráficos para ver 
              detalhes de cada categoria ou período!
            </p>
          </div>
        </div>
      )
    },
    {
      number: 4,
      title: 'Transações Recentes',
      description: 'Veja as últimas movimentações financeiras direto do Dashboard.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Na parte inferior do Dashboard, você encontra a lista de <strong>Transações Recentes</strong>:
          </p>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">Últimas Transações</h4>
            
            {/* Exemplo de transação de receita */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <TrendingUp className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Salário</p>
                  <p className="text-xs text-gray-500">15/01/2026 • Trabalho</p>
                </div>
              </div>
              <span className="font-bold text-green-600">+R$ 5.000,00</span>
            </div>

            {/* Exemplo de transação de despesa */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-2">
                  <TrendingDown className="text-red-600" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Supermercado</p>
                  <p className="text-xs text-gray-500">14/01/2026 • Alimentação</p>
                </div>
              </div>
              <span className="font-bold text-red-600">-R$ 320,00</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            As transações são <strong>ordenadas por data</strong>, mostrando as mais recentes primeiro. 
            Você pode clicar em qualquer transação para editar ou deletar.
          </p>
        </div>
      )
    },
    {
      number: 5,
      title: 'Filtros de Período',
      description: 'Personalize a visualização dos dados escolhendo diferentes períodos.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            No topo do Dashboard, você encontra os <strong>Filtros de Período</strong> que 
            permitem visualizar dados de diferentes intervalos de tempo:
          </p>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">
                Mês Atual
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                Últimos 30 dias
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                Últimos 90 dias
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                Este Ano
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                Tudo
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>🗓️ Mês Atual:</strong> Mostra dados apenas do mês corrente (Janeiro 2026)
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>📅 Últimos 30 dias:</strong> Últimos 30 dias corridos (independente do mês)
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>📆 Este Ano:</strong> Todos os dados de 2026
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>🌐 Tudo:</strong> Todas as transações desde o início
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="text-green-600" size={24} />
              <h4 className="font-bold text-gray-900">Parabéns!</h4>
            </div>
            <p className="text-gray-700 mb-2">
              Agora você sabe como usar o Dashboard! 🎉
            </p>
            <p className="text-sm text-gray-600">
              <strong>Próximo passo:</strong> Aprenda a adicionar transações no tutorial 
              <strong> "Gerenciar Transações"</strong>
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={32} />
          <h1 className="text-2xl font-bold">Como Usar o Dashboard</h1>
        </div>
        <p className="text-blue-100">
          Aprenda a navegar e entender todas as informações do painel principal
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Passo {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% completo
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
            {currentStepData.number}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
          </div>
        </div>

        <div className="mt-6">
          {currentStepData.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          ← Anterior
        </button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index + 1)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentStep === index + 1
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
          disabled={currentStep === totalSteps}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            currentStep === totalSteps
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentStep === totalSteps ? 'Concluído' : 'Próximo'}
          {currentStep !== totalSteps && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BookOpen, Wallet, CreditCard, Target, PiggyBank, FileText, TrendingUp, Bell, ArrowLeft, ChevronRight, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { DashboardGuide } from '../DashboardGuide';
import { TransactionsGuide } from '../TransactionsGuide';
import { CardsGuide } from '../CardsGuide';
import { GoalsGuide } from '../GoalsGuide';
import { SavingsGuide } from '../SavingsGuide';
import { ReportsGuide } from '../ReportsGuide';
import { AlertsGuide } from '../AlertsGuide';

type TutorialView = 'menu' | 'transactions' | 'cards' | 'goals' | 'savings' | 'reports' | 'alerts' | 'dashboard';

export function TutorialsSection() {
  const [currentView, setCurrentView] = useState<TutorialView>('menu');

  const tutorials = [
    {
      id: 'dashboard' as const,
      title: 'Como Usar o Dashboard',
      description: 'Entenda todas as informações e gráficos do painel principal',
      icon: <TrendingUp className="text-blue-600" size={32} />,
      difficulty: 'Iniciante',
      time: '5 min',
      topics: ['Visão Geral', 'Saldo', 'Gráficos', 'Transações Recentes']
    },
    {
      id: 'transactions' as const,
      title: 'Gerenciar Transações',
      description: 'Aprenda a adicionar, editar e deletar receitas e despesas',
      icon: <Wallet className="text-green-600" size={32} />,
      difficulty: 'Iniciante',
      time: '8 min',
      topics: ['Adicionar', 'Editar', 'Deletar', 'Categorias', 'Contas']
    },
    {
      id: 'cards' as const,
      title: 'Cartões de Crédito e Faturas',
      description: 'Configure cartões, gerencie faturas e acompanhe vencimentos',
      icon: <CreditCard className="text-purple-600" size={32} />,
      difficulty: 'Intermediário',
      time: '10 min',
      topics: ['Criar Cartão', 'Faturas', 'Vencimentos', 'Pagamentos']
    },
    {
      id: 'goals' as const,
      title: 'Metas de Gastos',
      description: 'Defina limites mensais por categoria e controle seus gastos',
      icon: <Target className="text-red-600" size={32} />,
      difficulty: 'Iniciante',
      time: '7 min',
      topics: ['Criar Meta', 'Acompanhar', 'Alertas', 'Ajustar']
    },
    {
      id: 'savings' as const,
      title: 'Metas de Poupança',
      description: 'Crie objetivos de economia e acompanhe seu progresso',
      icon: <PiggyBank className="text-yellow-600" size={32} />,
      difficulty: 'Iniciante',
      time: '6 min',
      topics: ['Criar Objetivo', 'Progresso', 'Prazo', 'Valor']
    },
    {
      id: 'reports' as const,
      title: 'Relatórios e Exportação',
      description: 'Gere relatórios detalhados em CSV e PDF',
      icon: <FileText className="text-indigo-600" size={32} />,
      difficulty: 'Intermediário',
      time: '8 min',
      topics: ['Filtros', 'Gráficos', 'CSV', 'PDF', 'E-mail']
    },
    {
      id: 'alerts' as const,
      title: 'Sistema de Alertas',
      description: 'Configure notificações automáticas e receba por e-mail',
      icon: <Bell className="text-orange-600" size={32} />,
      difficulty: 'Avançado',
      time: '10 min',
      topics: ['Configurar', 'E-mail', 'Tipos', 'Horários']
    }
  ];

  const renderTutorialContent = () => {
    // Carrega o componente dinamicamente baseado na view
    try {
      switch (currentView) {
        case 'dashboard':
          return <DashboardGuide />;
        case 'transactions':
          return <TransactionsGuide />;
        case 'cards':
          return <CardsGuide />;
        case 'goals':
          return <GoalsGuide />;
        case 'savings':
          return <SavingsGuide />;
        case 'reports':
          return <ReportsGuide />;
        case 'alerts':
          return <AlertsGuide />;
        default:
          return null;
      }
    } catch (error) {
      console.error('Erro ao carregar tutorial:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erro ao carregar tutorial. Verifique o console.</p>
        </div>
      );
    }
  };

  if (currentView !== 'menu') {
    return (
      <div className="space-y-4">
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('menu')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Voltar para Tutoriais</span>
        </button>

        {/* Tutorial Content */}
        <div>
          {renderTutorialContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={32} />
          <h1 className="text-2xl font-bold">Central de Tutoriais</h1>
        </div>
        <p className="text-red-100">
          Aprenda a usar todas as funcionalidades do V7 Finance
        </p>
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Se você é novo no V7 Finance, 
            comece pelo tutorial <strong>"Como Usar o Dashboard"</strong> para entender o básico!
          </div>
        </div>
      </div>

      {/* Recommended Path */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-600" size={24} />
          Caminho Recomendado para Iniciantes
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Como Usar o Dashboard</p>
              <p className="text-xs text-gray-500">Entenda a tela principal e os gráficos</p>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Iniciar
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Gerenciar Transações</p>
              <p className="text-xs text-gray-500">Adicione suas primeiras receitas e despesas</p>
            </div>
            <button
              onClick={() => setCurrentView('transactions')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Ver Tutorial
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Metas de Gastos</p>
              <p className="text-xs text-gray-500">Configure limites e controle seus gastos</p>
            </div>
            <button
              onClick={() => setCurrentView('goals')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Ver Tutorial
            </button>
          </div>
        </div>
      </div>

      {/* All Tutorials Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Todos os Tutoriais</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="bg-white border-2 border-gray-300 hover:border-red-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setCurrentView(tutorial.id)}
            >
              {/* Icon */}
              <div className="mb-4">
                {tutorial.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                {tutorial.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {tutorial.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span className={`px-2 py-1 rounded-full ${
                  tutorial.difficulty === 'Iniciante' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {tutorial.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {tutorial.time}
                </span>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-4">
                {tutorial.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button className="w-full bg-gray-100 group-hover:bg-red-600 text-gray-700 group-hover:text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                Ver Tutorial
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <AlertCircle className="text-gray-600" size={20} />
          Precisa de Ajuda?
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Está com dúvidas sobre como usar o V7 Finance? Escolha o tutorial certo:
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Primeiro uso:</strong> Comece pelo "Como Usar o Dashboard"</p>
          <p>• <strong>Adicionar dados:</strong> Veja "Gerenciar Transações"</p>
          <p>• <strong>Controlar gastos:</strong> Configure "Metas de Gastos"</p>
          <p>• <strong>Usar cartão de crédito:</strong> Tutorial "Cartões de Crédito e Faturas"</p>
          <p>• <strong>Receber notificações:</strong> Configure o "Sistema de Alertas"</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">{tutorials.length}</div>
          <div className="text-xs text-gray-600">Tutoriais Disponíveis</div>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">~54</div>
          <div className="text-xs text-gray-600">Minutos Total</div>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
          <div className="text-xs text-gray-600">Passo a Passo</div>
        </div>
      </div>
    </div>
  );
}
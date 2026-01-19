import { useState } from 'react';
import { PiggyBank, Plus, Trash2, TrendingUp, Calendar, Target, DollarSign, History, Award, AlertCircle } from 'lucide-react';
import { SavingsGoal } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[];
  onAddSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdDate' | 'monthlyHistory'>) => void;
  onUpdateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteSavingsGoal: (id: string) => void;
  onContributeSavingsGoal: (id: string, amount: number) => void;
}

export function SavingsGoals({
  savingsGoals,
  onAddSavingsGoal,
  onUpdateSavingsGoal,
  onDeleteSavingsGoal,
  onContributeSavingsGoal,
}: SavingsGoalsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formTargetAmount, setFormTargetAmount] = useState('');
  const [formDeadline, setFormDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetAmount = parseFloat(formTargetAmount);
    const deadline = new Date(formDeadline);
    const now = new Date();
    const monthsToDeadline = Math.max(
      1,
      Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );

    const monthlyTarget = targetAmount / monthsToDeadline;

    onAddSavingsGoal({
      name: formName,
      targetAmount,
      currentAmount: 0,
      deadline: formDeadline,
      monthlyTarget,
    });

    // Reset form
    setFormName('');
    setFormTargetAmount('');
    setFormDeadline('');
    setIsFormOpen(false);
  };

  const handleContribute = () => {
    if (selectedGoalId && contributionAmount) {
      onContributeSavingsGoal(selectedGoalId, parseFloat(contributionAmount));
      setContributionAmount('');
      setIsContributeModalOpen(false);
      setSelectedGoalId(null);
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 75) return 'text-green-600 bg-green-100 border-green-300';
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calcular estatísticas gerais
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoals = savingsGoals.filter(g => g.currentAmount >= g.targetAmount).length;
  const activeGoals = savingsGoals.filter(g => g.currentAmount < g.targetAmount).length;

  // Preparar dados para o gráfico de histórico
  const prepareChartData = () => {
    const allMonths = new Set<string>();
    savingsGoals.forEach(goal => {
      goal.monthlyHistory.forEach(h => allMonths.add(h.month));
    });

    const sortedMonths = Array.from(allMonths).sort();
    
    return sortedMonths.map(month => {
      const dataPoint: any = { month };
      let totalSavedInMonth = 0;
      
      savingsGoals.forEach(goal => {
        const monthData = goal.monthlyHistory.find(h => h.month === month);
        const saved = monthData?.saved || 0;
        dataPoint[goal.name] = saved;
        totalSavedInMonth += saved;
      });
      
      dataPoint.total = totalSavedInMonth;
      return dataPoint;
    });
  };

  const chartData = prepareChartData();
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">Total Economizado</span>
            <TrendingUp className="text-green-100" size={20} />
          </div>
          <p className="text-3xl font-bold">
            {totalSaved.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Meta Total</span>
            <Target className="text-blue-100" size={20} />
          </div>
          <p className="text-3xl font-bold">
            {totalTarget.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Metas Ativas</span>
            <PiggyBank className="text-purple-100" size={20} />
          </div>
          <p className="text-3xl font-bold">{activeGoals}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-100">Metas Concluídas</span>
            <Award className="text-yellow-100" size={20} />
          </div>
          <p className="text-3xl font-bold">{completedGoals}</p>
        </div>
      </div>

      {/* Gráfico de Histórico Mensal */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="flex items-center gap-2 mb-4">
            <History size={20} className="text-gray-700" />
            <span>Histórico de Economia Mensal</span>
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => 
                    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  }
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#000000" 
                  strokeWidth={3}
                  name="Total"
                />
                {savingsGoals.map((goal, index) => (
                  <Line
                    key={goal.id}
                    type="monotone"
                    dataKey={goal.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Header com botão de adicionar */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Crie objetivos específicos e acompanhe seu progresso de economia
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md"
        >
          <Plus size={20} />
          Nova Meta
        </button>
      </div>

      {/* Formulário de Adição */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
          <h3 className="flex items-center gap-2 mb-4">
            <PiggyBank size={20} className="text-red-600" />
            <span>Nova Meta de Poupança</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Nome do Objetivo
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Viagem para Europa, Fundo de Emergência..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Valor Alvo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formTargetAmount}
                  onChange={(e) => setFormTargetAmount(e.target.value)}
                  placeholder="5000.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Data Limite
                </label>
                <input
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
              >
                Criar Meta
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setFormName('');
                  setFormTargetAmount('');
                  setFormDeadline('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Metas */}
      {savingsGoals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <PiggyBank size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">
            Nenhuma meta de poupança criada
          </h3>
          <p className="text-gray-400">
            Comece criando sua primeira meta de economia!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savingsGoals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all hover:shadow-lg ${
                  isCompleted ? 'border-green-400 bg-green-50' : 'border-gray-200'
                }`}
              >
                {/* Header da Meta */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="flex items-center gap-2 mb-1">
                      {isCompleted && <Award size={20} className="text-green-600" />}
                      <span className={isCompleted ? 'text-green-700' : ''}>{goal.name}</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      Criado em: {new Date(goal.createdDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteSavingsGoal(goal.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    title="Excluir meta"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className={`text-sm font-semibold ${
                      isCompleted ? 'text-green-600' : 'text-gray-700'
                    }`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressBarColor(progress)} ${
                        isCompleted ? 'bg-green-500' : ''
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Informações da Meta */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign size={16} />
                      <span className="text-xs">Economizado</span>
                    </div>
                    <p className="font-semibold text-green-600">
                      {goal.currentAmount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Target size={16} />
                      <span className="text-xs">Meta Total</span>
                    </div>
                    <p className="font-semibold text-blue-600">
                      {goal.targetAmount.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <TrendingUp size={16} />
                      <span className="text-xs">Meta Mensal</span>
                    </div>
                    <p className="font-semibold text-purple-600">
                      {goal.monthlyTarget.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar size={16} />
                      <span className="text-xs">Dias Restantes</span>
                    </div>
                    <p className={`font-semibold ${
                      daysRemaining < 30 ? 'text-red-600' : 
                      daysRemaining < 90 ? 'text-yellow-600' : 'text-gray-700'
                    }`}>
                      {daysRemaining > 0 ? `${daysRemaining} dias` : 'Expirado'}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                {!isCompleted && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-4 ${getStatusColor(progress)}`}>
                    <AlertCircle size={16} />
                    <span className="text-sm">
                      Faltam <strong>{remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> para atingir a meta
                    </span>
                  </div>
                )}

                {/* Botão de Contribuir */}
                {!isCompleted && (
                  <button
                    onClick={() => {
                      setSelectedGoalId(goal.id);
                      setIsContributeModalOpen(true);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Adicionar Contribuição
                  </button>
                )}

                {isCompleted && (
                  <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 text-center">
                    <p className="text-green-700 flex items-center justify-center gap-2">
                      <Award size={20} />
                      <strong>Meta Concluída! 🎉</strong>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Contribuição */}
      {isContributeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h3 className="flex items-center gap-2 mb-4">
              <DollarSign size={20} className="text-green-600" />
              <span>Adicionar Contribuição</span>
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Valor da Contribuição (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="100.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleContribute}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setIsContributeModalOpen(false);
                  setSelectedGoalId(null);
                  setContributionAmount('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

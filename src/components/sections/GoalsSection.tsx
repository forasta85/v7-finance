import { Goals, Goal } from '../Goals';
import { TourGuide, TourStep } from '../TourGuide';
import { Transaction } from '../../App';

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
  transactions: Transaction[];
  expenseCategories: string[];
}

export function GoalsSection({
  goals,
  onAddGoal,
  onDeleteGoal,
  transactions,
  expenseCategories
}: GoalsSectionProps) {
  // 📚 Definir passos do tour guiado
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="goals-header"]',
      title: '🎯 Metas de Gastos',
      content: 'Defina limites mensais de gastos por categoria e acompanhe seu progresso em tempo real. Isso ajuda a controlar despesas e manter o orçamento!',
      position: 'bottom'
    },
    {
      target: '[data-tour="add-goal-btn"]',
      title: '➕ Criar Nova Meta',
      content: 'Clique aqui para definir uma nova meta de gastos. Escolha a categoria e o valor máximo que deseja gastar no mês.',
      position: 'bottom'
    },
    {
      target: '[data-tour="goals-list"]',
      title: '📊 Acompanhamento de Metas',
      content: 'Aqui você vê todas as suas metas com barras de progresso. Verde = dentro da meta, Amarelo = próximo do limite, Vermelho = ultrapassou!',
      position: 'top'
    }
  ];

  return (
    <div className="space-y-6">
      <Goals
        goals={goals}
        onAddGoal={onAddGoal}
        onDeleteGoal={onDeleteGoal}
        transactions={transactions}
        expenseCategories={expenseCategories}
      />

      {/* 📚 Tour Guiado */}
      <TourGuide
        tourId="goals-tour"
        steps={tourSteps}
        autoStart={true}
      />
    </div>
  );
}
import { SavingsGoals } from '../SavingsGoals';
import { SavingsGoal } from '../../App';

interface SavingsSectionProps {
  savingsGoals: SavingsGoal[];
  onAddSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdDate' | 'monthlyHistory'>) => void;
  onUpdateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteSavingsGoal: (id: string) => void;
  onContributeSavingsGoal: (id: string, amount: number) => void;
}

export function SavingsSection({
  savingsGoals,
  onAddSavingsGoal,
  onUpdateSavingsGoal,
  onDeleteSavingsGoal,
  onContributeSavingsGoal,
}: SavingsSectionProps) {
  return (
    <div className="space-y-6">
      <SavingsGoals
        savingsGoals={savingsGoals}
        onAddSavingsGoal={onAddSavingsGoal}
        onUpdateSavingsGoal={onUpdateSavingsGoal}
        onDeleteSavingsGoal={onDeleteSavingsGoal}
        onContributeSavingsGoal={onContributeSavingsGoal}
      />
    </div>
  );
}

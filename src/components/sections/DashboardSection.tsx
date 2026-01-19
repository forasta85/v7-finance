import { Dashboard } from '../Dashboard';
import { FinancialChart, ChartType } from '../FinancialChart';
import { Filters } from '../Filters';
import { BalanceAlert } from '../BalanceAlert';
import { InvoiceDueAlerts } from '../InvoiceDueAlerts';
import { TourGuide, TourStep } from '../TourGuide';
import { Transaction, CreditCard, InstallmentDebt, RecurringTransaction } from '../../App';

interface DashboardSectionProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  filteredTransactions: Transaction[];
  selectedType: string;
  selectedCategory: string;
  selectedPeriod: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onPeriodChange: (period: string) => void;
  allCategories: string[];
  balanceLimit?: number | null;
  balanceLimitEnabled?: boolean;
  onNavigateToSettings?: () => void;
  chartType: ChartType;
  creditCards: CreditCard[];
  installmentDebts: InstallmentDebt[];
  recurringTransactions: RecurringTransaction[];
  onNavigateToCards?: () => void;
}

export function DashboardSection({
  totalIncome,
  totalExpense,
  balance,
  filteredTransactions,
  selectedType,
  selectedCategory,
  selectedPeriod,
  onTypeChange,
  onCategoryChange,
  onPeriodChange,
  allCategories,
  balanceLimit,
  balanceLimitEnabled,
  onNavigateToSettings,
  chartType,
  creditCards,
  installmentDebts,
  recurringTransactions,
  onNavigateToCards
}: DashboardSectionProps) {
  // Debug para verificar configurações
  console.log('🚨 DEBUG BalanceAlert:', {
    balanceLimitEnabled,
    balanceLimit,
    balance,
    shouldShow: balanceLimitEnabled && balanceLimit !== null && balance < balanceLimit
  });

  // 📚 Definir passos do tour guiado
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="dashboard-cards"]',
      title: '💰 Visão Geral Financeira',
      content: 'Aqui você vê seu saldo atual, total de receitas e despesas do período. Os cartões mudam de cor conforme seu saldo!',
      position: 'bottom'
    },
    {
      target: '[data-tour="filters"]',
      title: '🔍 Filtros Inteligentes',
      content: 'Use os filtros para analisar suas finanças por tipo (receita/despesa), categoria específica e período de tempo.',
      position: 'bottom'
    },
    {
      target: '[data-tour="chart"]',
      title: '📊 Gráfico Interativo',
      content: 'Visualize suas transações de forma gráfica. Você pode mudar o tipo de gráfico nas configurações!',
      position: 'top'
    },
    {
      target: '[data-tour="invoice-alerts"]',
      title: '🔔 Alertas de Faturas',
      content: 'Quando você tiver faturas próximas do vencimento, elas aparecerão aqui para você não esquecer de pagar!',
      position: 'bottom'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alertas de Vencimento de Fatura - PRIMEIRO */}
      <div data-tour="invoice-alerts">
        <InvoiceDueAlerts
          creditCards={creditCards}
          installmentDebts={installmentDebts}
          recurringTransactions={recurringTransactions}
          onNavigateToCards={onNavigateToCards}
        />
      </div>

      {/* Alerta de Saldo - SEGUNDO */}
      {balanceLimitEnabled && balanceLimit !== null && balance < balanceLimit && (
        <BalanceAlert
          balance={balance}
          balanceLimit={balanceLimit}
          onNavigateToSettings={onNavigateToSettings}
        />
      )}

      <div data-tour="dashboard-cards">
        <Dashboard 
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
        />
      </div>

      <div data-tour="filters">
        <Filters
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          selectedPeriod={selectedPeriod}
          onTypeChange={onTypeChange}
          onCategoryChange={onCategoryChange}
          onPeriodChange={onPeriodChange}
          categories={allCategories}
        />
      </div>

      <div data-tour="chart" className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <FinancialChart transactions={filteredTransactions} chartType={chartType} />
      </div>

      {/* 📚 Tour Guiado */}
      <TourGuide
        tourId="dashboard-tour"
        steps={tourSteps}
        autoStart={true}
      />
    </div>
  );
}
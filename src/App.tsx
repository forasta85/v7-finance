import React, { useState, useMemo, useEffect } from 'react';
import { DashboardSection } from "./components/sections/DashboardSection";
import { TransactionsSection } from "./components/sections/TransactionsSection";
import { GoalsSection } from "./components/sections/GoalsSection";
import { ReportsSection } from "./components/sections/ReportsSection";
import { SettingsSection } from "./components/sections/SettingsSection";
import { SavingsSection } from "./components/sections/SavingsSection";
import { AccountsSection } from "./components/sections/AccountsSection"; // 💳 NOVO
import { RecurringSection } from "./components/sections/RecurringSection"; // 🔄 NOVO
import { QuickAddModal } from "./components/QuickAddModal";
import { CardsSection } from "./components/sections/CardsSection"; // 💳 NOVO
import { InstallmentsSection } from "./components/sections/InstallmentsSection"; // 💰 NOVO
import { PaymentMethodsSection } from "./components/sections/PaymentMethodsSection"; // 💰 NOVO
import { TutorialsSection } from "./components/sections/TutorialsSection"; // 📚 NOVO
import { AdminPanel } from "./components/AdminPanel"; // 👑 ADMIN
import { LoadingScreen } from './components/LoadingScreen';
import { Logo } from './components/Logo';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { ResetPassword } from './components/Auth/ResetPassword';
import { ChangePasswordModal } from './components/Auth/ChangePasswordModal'; // 🔐 NOVO
import { MobileMenu } from './components/MobileMenu';
import { TopActionBar } from './components/TopActionBar';
import { UserProfileModal } from './components/UserProfileModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PWASetup } from './components/PWASetup';
import { IOSIconFix } from './components/IOSIconFix';
import { BiometricSetupModal } from './components/BiometricSetupModal';
import { isBiometricAvailable } from './utils/biometric';
import { Menu } from 'lucide-react';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';

type ChartType = 'bar' | 'pie' | 'line' | 'area' | 'radar' | 'donut';

export interface Transaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string;
  accountId?: string; // 💳 NOVO: Conta associada
  tags?: string[]; // 🏷️ NOVO: Tags para organização
  notes?: string; // 📝 NOVO: Notas/observações
  isRecurring?: boolean; // 🔄 NOVO: Se veio de recorrente
  recurringId?: string; // 🔄 NOVO: ID da transação recorrente
}

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "cash" | "credit" | "investment";
  balance: number;
  color: string;
  icon: string;
}

export interface RecurringTransaction {
  id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  accountId?: string;
  paymentMethodId?: string; // 💳 NOVO: ID do método de pagamento (cartão ou outro)
  paymentMethodType?: 'card' | 'other'; // 💳 NOVO: Tipo do método
  tags?: string[];
  notes?: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  dayOfMonth?: number; // Para mensais: dia do mês (1-31)
  dayOfWeek?: number; // Para semanais: dia da semana (0-6)
  startDate: string;
  endDate?: string;
  isActive: boolean;
  lastProcessed?: string; // Última vez que foi processado
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "danger";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionLabel?: string;
  actionTarget?: string; // Seção para navegar
}

export interface Goal {
  id: string;
  category: string;
  monthlyLimit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  monthlyTarget: number;
  createdDate: string; // ISO date string
  monthlyHistory: { month: string; saved: number }[]; // Histórico mensal
}

// 💳 Cartão de Crédito
export interface CreditCard {
  id: string;
  brand: string; // Visa, Mastercard, Elo, etc.
  issuer: string; // Banco emissor (Nubank, Itaú, etc.)
  lastFourDigits: string; // Últimos 4 dígitos
  color: string; // Cor para identificação visual
  expiryMonth: string; // Mês de validade (01-12)
  expiryYear: string; // Ano de validade (YYYY)
  dueDay: number; // Dia de vencimento da fatura (1-31)
  createdDate: string;
}

// 💰 Dívida Parcelada
export interface InstallmentDebt {
  id: string;
  description: string;
  totalAmount: number; // Valor total da dívida
  installments: number; // Número de parcelas
  installmentAmount: number; // Valor de cada parcela
  remainingInstallments: number; // Parcelas restantes
  currentInstallment: number; // Parcela atual (1, 2, 3...)
  cardId?: string; // ID do cartão vinculado (opcional)
  paymentMethodId?: string; // 💳 NOVO: ID do método de pagamento (cartão ou outro)
  paymentMethodType?: 'card' | 'other'; // 💳 NOVO: Tipo do método
  startDate: string; // Data da compra
  category: string; // Categoria da despesa
  notes?: string; // Observações
  isActive: boolean; // Se ainda está ativa
}

// 💳 NOVO: Métodos de Pagamento Adicionais (além de cartões)
export interface PaymentMethod {
  id: string;
  name: string; // Ex: Dinheiro, PIX, Débito Nubank
  type: 'cash' | 'pix' | 'debit' | 'other';
  icon: string;
  color: string;
  createdDate: string;
}

// Array vazio por padrão - dados serão carregados do servidor para cada usuário
const initialTransactions: Transaction[] = [];

const defaultExpenseCategories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Contas",
  "Outros",
];

const defaultIncomeCategories = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Outros",
];

type AuthScreen = "login" | "signup" | "reset";

export default function App() {
  const [authScreen, setAuthScreen] =
    useState<AuthScreen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<
    Transaction[]
  >(initialTransactions);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>(defaultExpenseCategories);
  const [incomeCategories, setIncomeCategories] = useState<string[]>(defaultIncomeCategories);
  
  // 💳 NOVO: Estados para Contas
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  // 🔄 NOVO: Estados para Transações Recorrentes
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  
  // 🔔 NOVO: Estados para Alertas
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // 💳 NOVO: Estados para Cartões
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  
  // 💰 NOVO: Estados para Dívidas Parceladas
  const [installmentDebts, setInstallmentDebts] = useState<InstallmentDebt[]>([]);
  
  // 💳 NOVO: Estados para Métodos de Pagamento
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  const [currentSection, setCurrentSection] =
    useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Configurações de alertas
  const [balanceLimit, setBalanceLimit] = useState<number | null>(null);
  const [balanceLimitEnabled, setBalanceLimitEnabled] = useState(false);
  
  // Configurações de gráfico
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Estados dos modais
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense'>('expense');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // 🔐 NOVO: Estado para modal de biometria
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [biometricSkipped, setBiometricSkipped] = useState(false);
  
  // 🔐 NOVO: Estado para modal de alteração de senha (primeiro acesso)
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Filtros
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Verificar sessão ao carregar
  useEffect(() => {
    console.log('🚀 App iniciando...');
    
    // Verificar sessão existente
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log('🔍 Verificando sessão existente...');
      
      // 🆕 IMPORTANTE: Verificar se há um hash na URL (token de convite)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      console.log('🔗 URL Hash:', window.location.hash);
      console.log('🔗 Access Token na URL:', accessToken ? 'SIM' : 'NÃO');
      console.log('🔗 Type:', type);
      
      // Se há token na URL, deixar o Supabase processar primeiro
      if (accessToken) {
        console.log('⏳ Token detectado na URL - aguardando processamento do Supabase...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo
      }
      
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        setInitError(error.message);
        setLoading(false);
        return;
      }

      console.log('📦 Sessão obtida:', data.session ? 'Sessão ativa' : 'Sem sessão');
      
      if (data.session) {
        // Usuário já está logado - carregar app normalmente
        const user = data.session.user;
        
        console.log('👤 Usuário detectado:', user.email);
        console.log('📋 User metadata completo:', JSON.stringify(user.user_metadata, null, 2));
        console.log('🔍 needsPasswordChange =', user.user_metadata?.needsPasswordChange);
        
        console.log('✅ Login normal - carregando app...');
        setAccessToken(data.session.access_token);
        setUserEmail(data.session.user?.email || "");
        setIsAuthenticated(true);
        await loadUserData(data.session.access_token);
      } else {
        console.log('ℹ️ Nenhuma sessão ativa - mostrando tela de login');
      }
    } catch (error) {
      console.error("❌ Erro crítico ao verificar sessão:", error);
      setInitError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (token: string) => {
    try {
      console.log('📊 Carregando dados do usuário...');
      
      // 🚀 OTIMIZAÇÃO: Fazer todas as requisições em paralelo
      const [
        transactionsRes,
        goalsRes,
        savingsGoalsRes,
        accountsRes,
        recurringRes,
        alertsRes,
        creditCardsRes,
        installmentDebtsRes,
        paymentMethodsRes
      ] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/goals`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/savings-goals`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/accounts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/recurring-transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/alerts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/credit-cards`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/installment-debts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/payment-methods`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Processar transações
      if (transactionsRes.ok) {
        const data = await transactionsRes.json();
        setTransactions(data.transactions || []);
      } else {
        setTransactions([]);
      }

      // Processar metas
      if (goalsRes.ok) {
        const data = await goalsRes.json();
        setGoals(data.goals || []);
      } else {
        setGoals([]);
      }

      // Processar metas de poupança
      if (savingsGoalsRes.ok) {
        const data = await savingsGoalsRes.json();
        setSavingsGoals(data.savingsGoals || []);
      } else {
        setSavingsGoals([]);
      }

      // Processar contas
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts || []);
      } else {
        setAccounts([]);
      }

      // Processar transações recorrentes
      if (recurringRes.ok) {
        const data = await recurringRes.json();
        setRecurringTransactions(data.recurringTransactions || []);
      } else {
        setRecurringTransactions([]);
      }

      // Processar alertas
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.alerts || []);
      } else {
        setAlerts([]);
      }

      // Processar cartões de crédito
      if (creditCardsRes.ok) {
        const data = await creditCardsRes.json();
        setCreditCards(data.creditCards || []);
      } else {
        setCreditCards([]);
      }

      // Processar dívidas parceladas
      if (installmentDebtsRes.ok) {
        const data = await installmentDebtsRes.json();
        setInstallmentDebts(data.installmentDebts || []);
      } else {
        setInstallmentDebts([]);
      }

      // Processar métodos de pagamento
      if (paymentMethodsRes.ok) {
        const data = await paymentMethodsRes.json();
        setPaymentMethods(data.paymentMethods || []);
      } else {
        setPaymentMethods([]);
      }

      console.log('✅ Todos os dados carregados com sucesso!');
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      // Em caso de erro, limpar dados para não mostrar dados de outros usuários
      setTransactions([]);
      setGoals([]);
      setSavingsGoals([]);
      setAccounts([]);
      setRecurringTransactions([]);
      setAlerts([]);
      setCreditCards([]);
      setInstallmentDebts([]);
      setPaymentMethods([]);
    }
  };

  const saveTransactions = async (
    newTransactions: Transaction[],
  ) => {
    if (!isAuthenticated) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            transactions: newTransactions,
          }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar transações:", error);
    }
  };

  const saveGoals = async (newGoals: Goal[]) => {
    if (!isAuthenticated) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ goals: newGoals }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar metas:", error);
    }
  };

  const handleLoginSuccess = async (token: string, email: string) => {
    console.log('🔐 handleLoginSuccess: Verificando necessidade de troca de senha...');
    
    // Buscar dados do usuário para verificar metadata
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      setAccessToken(token);
      setUserEmail(email);
      setIsAuthenticated(true);
      loadUserData(token);
      return;
    }
    
    console.log('👤 User metadata no login:', user.user_metadata);
    console.log('🔍 needsPasswordChange:', user.user_metadata?.needsPasswordChange);
    
    // Verificar se usuário precisa trocar senha (primeiro acesso)
    if (user.user_metadata?.needsPasswordChange === true) {
      console.log('🔐 ✅ PRIMEIRO ACESSO DETECTADO! Mostrando modal de troca de senha...');
      setAccessToken(token);
      setUserEmail(email);
      setIsAuthenticated(true);
      setShowChangePassword(true); // Mostrar modal
      return;
    }
    
    setAccessToken(token);
    setUserEmail(email);
    setIsAuthenticated(true);
    
    // 🚀 OTIMIZAÇÃO: Carregar dados em background (não esperar)
    loadUserData(token);
  };

  const askToRegisterBiometric = (email: string, token: string) => {
    setShowBiometricSetup(true);
  };

  const handleSignupSuccess = () => {
    setAuthScreen("login");
    alert(
      "Conta criada com sucesso! Faça login para continuar.",
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAccessToken("");
    setUserEmail("");
    // Limpar todos os dados ao fazer logout
    setTransactions([]);
    setGoals([]);
    setSavingsGoals([]);
    setAccounts([]); // 💳 NOVO
    setRecurringTransactions([]); // 🔄 NOVO
    setAlerts([]); // 🔔 NOVO
    setCreditCards([]); // 💳 NOVO
    setInstallmentDebts([]); // 💰 NOVO
    setPaymentMethods([]); // 💳 NOVO
    setAuthScreen("login");
  };

  const addTransaction = (
    transaction: Omit<Transaction, "id">,
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    
    // Adicionar categoria à lista se for nova
    addCategory(transaction.category, transaction.type);
  };

  const addCategory = (category: string, type: 'income' | 'expense') => {
    console.log('🏷️ Adicionando categoria:', { category, type });
    console.log('📋 Categorias atuais (despesas):', expenseCategories);
    console.log('📋 Categorias atuais (receitas):', incomeCategories);
    
    if (type === 'expense') {
      if (!expenseCategories.includes(category)) {
        const newCategories = [...expenseCategories, category].sort();
        console.log('✅ Nova categoria de despesa adicionada:', newCategories);
        setExpenseCategories(newCategories);
      } else {
        console.log('⚠️ Categoria de despesa já existe');
      }
    } else {
      if (!incomeCategories.includes(category)) {
        const newCategories = [...incomeCategories, category].sort();
        console.log('✅ Nova categoria de receita adicionada:', newCategories);
        setIncomeCategories(newCategories);
      } else {
        console.log('⚠️ Categoria de receita já existe');
      }
    }
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const saveSavingsGoals = async (newSavingsGoals: SavingsGoal[]) => {
    if (!isAuthenticated) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/savings-goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ savingsGoals: newSavingsGoals }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar metas de poupança:", error);
    }
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, "id" | "createdDate" | "monthlyHistory">) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
      monthlyHistory: [],
    };
    const updated = [...savingsGoals, newGoal];
    setSavingsGoals(updated);
    saveSavingsGoals(updated);
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    const updated = savingsGoals.map((g) =>
      g.id === id ? { ...g, ...updates } : g
    );
    setSavingsGoals(updated);
    saveSavingsGoals(updated);
  };

  const deleteSavingsGoal = (id: string) => {
    const updated = savingsGoals.filter((g) => g.id !== id);
    setSavingsGoals(updated);
    saveSavingsGoals(updated);
  };

  const contributeSavingsGoal = (id: string, amount: number) => {
    const goal = savingsGoals.find((g) => g.id === id);
    if (!goal) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const existingMonthIndex = goal.monthlyHistory.findIndex(
      (h) => h.month === currentMonth
    );

    let updatedHistory = [...goal.monthlyHistory];
    if (existingMonthIndex >= 0) {
      updatedHistory[existingMonthIndex].saved += amount;
    } else {
      updatedHistory.push({ month: currentMonth, saved: amount });
    }

    const updated = savingsGoals.map((g) =>
      g.id === id
        ? {
            ...g,
            currentAmount: g.currentAmount + amount,
            monthlyHistory: updatedHistory,
          }
        : g
    );
    setSavingsGoals(updated);
    saveSavingsGoals(updated);
  };

  // 💳 NOVO: Funções para gerenciar Contas
  const saveAccounts = async (newAccounts: Account[]) => {
    if (!isAuthenticated) return;
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ accounts: newAccounts }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar contas:", error);
    }
  };

  const addAccount = (account: Omit<Account, "id" | "balance">) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      balance: 0, // Saldo inicial será calculado pelas transações
    };
    const updated = [...accounts, newAccount];
    setAccounts(updated);
    saveAccounts(updated);
  };

  const deleteAccount = (id: string) => {
    const updated = accounts.filter((a) => a.id !== id);
    setAccounts(updated);
    saveAccounts(updated);
  };

  // 🔄 NOVO: Funções para gerenciar Transações Recorrentes
  const saveRecurringTransactions = async (newRecurring: RecurringTransaction[]) => {
    if (!isAuthenticated) return;
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/recurring-transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ recurringTransactions: newRecurring }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar transações recorrentes:", error);
    }
  };

  const addRecurringTransaction = (recurring: Omit<RecurringTransaction, "id" | "lastProcessed">) => {
    const newRecurring: RecurringTransaction = {
      ...recurring,
      id: Date.now().toString(),
      lastProcessed: undefined,
    };
    const updated = [...recurringTransactions, newRecurring];
    setRecurringTransactions(updated);
    saveRecurringTransactions(updated);
  };

  const toggleRecurringActive = (id: string) => {
    const updated = recurringTransactions.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    setRecurringTransactions(updated);
    saveRecurringTransactions(updated);
  };

  const deleteRecurringTransaction = (id: string) => {
    const updated = recurringTransactions.filter((r) => r.id !== id);
    setRecurringTransactions(updated);
    saveRecurringTransactions(updated);
  };

  // 🔔 NOVO: Funções para gerenciar Alertas
  const dismissAlert = (alertId: string) => {
    const updated = alerts.map((a) =>
      a.id === alertId ? { ...a, isRead: true } : a
    );
    setAlerts(updated);
  };

  const handleAlertClick = (alert: Alert) => {
    dismissAlert(alert.id);
    if (alert.actionTarget) {
      setCurrentSection(alert.actionTarget);
    }
  };

  // 💳 NOVO: Funções para gerenciar Cartões de Crédito
  const saveCreditCards = async (newCards: CreditCard[]) => {
    if (!isAuthenticated) return;
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/credit-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ creditCards: newCards }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar cartões de crédito:", error);
    }
  };

  const addCreditCard = (card: Omit<CreditCard, "id" | "createdDate">) => {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
    };
    const updated = [...creditCards, newCard];
    setCreditCards(updated);
    saveCreditCards(updated);
  };

  const deleteCreditCard = (id: string) => {
    const updated = creditCards.filter((c) => c.id !== id);
    setCreditCards(updated);
    saveCreditCards(updated);
  };

  const updateCreditCard = (id: string, updatedCard: Omit<CreditCard, "id" | "createdDate">) => {
    const updated = creditCards.map((card) =>
      card.id === id
        ? { ...card, ...updatedCard }
        : card
    );
    setCreditCards(updated);
    saveCreditCards(updated);
  };

  // 💰 NOVO: Funções para gerenciar Dívidas Parceladas
  const saveInstallmentDebts = async (newDebts: InstallmentDebt[]) => {
    if (!isAuthenticated) return;
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/installment-debts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ installmentDebts: newDebts }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar dívidas parceladas:", error);
    }
  };

  const addInstallmentDebt = (debt: Omit<InstallmentDebt, "id" | "currentInstallment" | "remainingInstallments">) => {
    const newDebt: InstallmentDebt = {
      ...debt,
      id: Date.now().toString(),
      currentInstallment: 1,
      remainingInstallments: debt.installments,
    };
    const updated = [...installmentDebts, newDebt];
    setInstallmentDebts(updated);
    saveInstallmentDebts(updated);
  };

  const payInstallment = (id: string) => {
    const debt = installmentDebts.find((d) => d.id === id);
    if (!debt || !debt.isActive) return;

    const newCurrent = debt.currentInstallment + 1;
    const newRemaining = debt.remainingInstallments - 1;

    const updated = installmentDebts.map((d) =>
      d.id === id
        ? {
            ...d,
            currentInstallment: newCurrent,
            remainingInstallments: newRemaining,
            isActive: newRemaining > 0, // Desativa quando terminar
          }
        : d
    );
    setInstallmentDebts(updated);
    saveInstallmentDebts(updated);
  };

  const deleteInstallmentDebt = (id: string) => {
    const updated = installmentDebts.filter((d) => d.id !== id);
    setInstallmentDebts(updated);
    saveInstallmentDebts(updated);
  };

  // 💳 NOVO: Funções para gerenciar Métodos de Pagamento
  const savePaymentMethods = async (newMethods: PaymentMethod[]) => {
    if (!isAuthenticated) return;
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/payment-methods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ paymentMethods: newMethods }),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar métodos de pagamento:", error);
    }
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, "id" | "createdDate">) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
    };
    const updated = [...paymentMethods, newMethod];
    setPaymentMethods(updated);
    savePaymentMethods(updated);
  };

  const deletePaymentMethod = (id: string) => {
    const updated = paymentMethods.filter((m) => m.id !== id);
    setPaymentMethods(updated);
    savePaymentMethods(updated);
  };

  // Função para filtrar transações
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filtro por tipo
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (t) => t.type === selectedType,
      );
    }

    // Filtro por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (t) => t.category === selectedCategory,
      );
    }

    // Filtro por período
    if (selectedPeriod !== "all") {
      const now = new Date();
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date + "T00:00:00");

        switch (selectedPeriod) {
          case "today":
            return transactionDate >= today;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return transactionDate >= monthAgo;
          case "year":
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return transactionDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    transactions,
    selectedType,
    selectedCategory,
    selectedPeriod,
  ]);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Obter todas as categorias únicas
  const allCategories = useMemo(() => {
    const categories = new Set(
      transactions.map((t) => t.category),
    );
    return Array.from(categories).sort();
  }, [transactions]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Se houver erro de inicialização
  if (initError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="mb-6">
            <Logo size={80} showText={false} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Erro de Conexão
          </h1>
          <p className="text-gray-400 mb-6">
            Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.
          </p>
          <div className="bg-gray-950/80 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm font-mono break-words">
              {initError}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Telas de autenticação
  if (!isAuthenticated) {
    if (authScreen === "signup") {
      return (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setAuthScreen("login")}
        />
      );
    }

    if (authScreen === "reset") {
      return (
        <ResetPassword
          onBackToLogin={() => setAuthScreen("login")}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthScreen("signup")}
        onSwitchToReset={() => setAuthScreen("reset")}
      />
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return (
          <DashboardSection
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
            filteredTransactions={filteredTransactions}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            selectedPeriod={selectedPeriod}
            onTypeChange={setSelectedType}
            onCategoryChange={setSelectedCategory}
            onPeriodChange={setSelectedPeriod}
            allCategories={allCategories}
            balanceLimit={balanceLimit}
            balanceLimitEnabled={balanceLimitEnabled}
            onNavigateToSettings={() => setCurrentSection('settings')}
            chartType={chartType}
            creditCards={creditCards}
            installmentDebts={installmentDebts}
            recurringTransactions={recurringTransactions}
            onNavigateToCards={() => setCurrentSection('cards')}
          />
        );
      case "transactions":
        return (
          <TransactionsSection
            transactions={filteredTransactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        );
      case "goals":
        return (
          <GoalsSection
            goals={goals}
            onAddGoal={addGoal}
            onDeleteGoal={deleteGoal}
            transactions={transactions}
            expenseCategories={expenseCategories}
          />
        );
      case "reports":
        return (
          <ReportsSection
            transactions={filteredTransactions}
            accessToken={accessToken}
          />
        );
      case "settings":
        return (
          <SettingsSection 
            accessToken={accessToken}
            userEmail={userEmail} // 🔐 NOVO
            balanceLimit={balanceLimit}
            balanceLimitEnabled={balanceLimitEnabled}
            onBalanceLimitChange={setBalanceLimit}
            onBalanceLimitEnabledChange={setBalanceLimitEnabled}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        );
      case "savings":
        return (
          <SavingsSection
            savingsGoals={savingsGoals}
            onAddSavingsGoal={addSavingsGoal}
            onUpdateSavingsGoal={updateSavingsGoal}
            onDeleteSavingsGoal={deleteSavingsGoal}
            onContributeSavingsGoal={contributeSavingsGoal}
          />
        );
      case "accounts":
        return (
          <AccountsSection
            accounts={accounts}
            transactions={transactions}
            onAddAccount={addAccount}
            onDeleteAccount={deleteAccount}
          />
        );
      case "recurring":
        return (
          <RecurringSection
            recurringTransactions={recurringTransactions}
            accounts={accounts}
            creditCards={creditCards}
            paymentMethods={paymentMethods}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            onAddRecurring={addRecurringTransaction}
            onToggleActive={toggleRecurringActive}
            onDeleteRecurring={deleteRecurringTransaction}
          />
        );
      case "cards":
        return (
          <CardsSection
            creditCards={creditCards}
            installmentDebts={installmentDebts}
            recurringTransactions={recurringTransactions}
            onAddCard={addCreditCard}
            onDeleteCard={deleteCreditCard}
            onUpdateCard={updateCreditCard}
          />
        );
      case "installments":
        return (
          <InstallmentsSection
            installmentDebts={installmentDebts}
            creditCards={creditCards}
            paymentMethods={paymentMethods}
            expenseCategories={expenseCategories}
            onAddDebt={addInstallmentDebt}
            onPayInstallment={payInstallment}
            onDeleteDebt={deleteInstallmentDebt}
          />
        );
      case "payment-methods":
        return (
          <PaymentMethodsSection
            creditCards={creditCards}
            paymentMethods={paymentMethods}
            installmentDebts={installmentDebts}
            recurringTransactions={recurringTransactions}
            onAddPaymentMethod={addPaymentMethod}
            onDeletePaymentMethod={deletePaymentMethod}
          />
        );
      case "tutorials":
        return (
          <TutorialsSection />
        );
      case "admin":
        return (
          <AdminPanel accessToken={accessToken} />
        );
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      transactions: "Transações",
      goals: "Metas de Gastos",
      reports: "Relatórios",
      settings: "Configurações",
      savings: "Metas de Poupança",
      accounts: "Contas", // 💳 NOVO
      recurring: "Transações Recorrentes", // 🔄 NOVO
      cards: "Cartões de Crédito", // 💳 NOVO
      installments: "Dívidas Parceladas", // 💰 NOVO
      "payment-methods": "Métodos de Pagamento", // 💰 NOVO
      tutorials: "Tutoriais", // 📚 NOVO
      admin: "Administração", // 👑 ADMIN
    };
    return titles[currentSection] || "Dashboard";
  };

  // App principal
  return (
    <ErrorBoundary>
      <PWASetup />
      <IOSIconFix />
      <div className="min-h-screen bg-gray-50">
        {/* Menu Mobile */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onLogout={handleLogout}
          userEmail={userEmail}
          accessToken={accessToken}
        />

        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Botão Menu - TODAS AS TELAS */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="text-white hover:text-red-400 transition-colors p-2"
                >
                  <Menu size={24} />
                </button>

                {/* Logo apenas ícone - TODAS AS TELAS */}
                <Logo
                  size={32}
                  showText={false}
                />
              </div>

              {/* Botão Sair simples - TODAS AS TELAS */}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Barra de Ações Rápidas */}
        <TopActionBar
          onQuickAddIncome={() => {
            console.log('📱 App: Abrindo modal de entrada');
            setQuickAddType('income');
            setIsQuickAddModalOpen(true);
          }}
          onQuickAddExpense={() => {
            console.log('📱 App: Abrindo modal de despesa');
            setQuickAddType('expense');
            setIsQuickAddModalOpen(true);
          }}
          onOpenReports={() => setCurrentSection('reports')}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Título da Seção - TODAS AS TELAS */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {getSectionTitle()}
            </h1>
          </div>

          {/* Conteúdo */}
          {renderSection()}
        </main>

        {/* Modal de Adição Rápida */}
        <QuickAddModal
          isOpen={isQuickAddModalOpen}
          onClose={() => setIsQuickAddModalOpen(false)}
          onAddTransaction={addTransaction}
          expenseCategories={expenseCategories}
          incomeCategories={incomeCategories}
          initialType={quickAddType}
          accounts={accounts} // 💳 NOVO
        />

        {/* Modal de Perfil do Usuário */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userEmail={userEmail}
        />
        
        {/* 🔐 NOVO: Modal de Configuração de Biometria */}
        {showBiometricSetup && userEmail && accessToken && (
          <BiometricSetupModal
            isOpen={showBiometricSetup}
            onClose={() => {
              console.log('🔐 Modal de biometria fechado'); // DEBUG
              setShowBiometricSetup(false);
            }}
            userEmail={userEmail}
            accessToken={accessToken}
          />
        )}
        
        {/* 🔐 NOVO: Modal de Alteração de Senha (primeiro acesso) */}
        {showChangePassword && userEmail && accessToken && (
          <ChangePasswordModal
            isOpen={showChangePassword}
            userEmail={userEmail}
            onSuccess={() => {
              console.log('🔑 Senha alterada - recarregando dados...');
              setShowChangePassword(false);
              loadUserData(accessToken);
            }}
            onClose={() => {
              console.log('🔑 Modal de troca de senha fechado'); // DEBUG
              setShowChangePassword(false);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
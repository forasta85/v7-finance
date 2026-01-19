import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CreditCard as CreditCardIcon, AlertTriangle, Eye, Edit2 } from 'lucide-react';
import type { CreditCard as CreditCardType, InstallmentDebt, RecurringTransaction } from '../../App';
import { InvoiceView } from '../InvoiceView';
import { EditCardModal } from '../EditCardModal';
import { TourGuide, TourStep } from '../TourGuide';

interface CardsSectionProps {
  creditCards: CreditCardType[];
  installmentDebts: InstallmentDebt[];
  recurringTransactions: RecurringTransaction[];
  onAddCard: (card: Omit<CreditCardType, 'id' | 'createdDate'>) => void;
  onDeleteCard: (id: string) => void;
  onUpdateCard: (id: string, card: Omit<CreditCardType, 'id' | 'createdDate'>) => void;
}

const CARD_BRANDS = [
  'Visa',
  'Mastercard',
  'Elo',
  'American Express',
  'Hipercard',
  'Diners Club',
  'Discover',
  'Outro',
];

const CARD_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#dc2626', // dark red
  '#991b1b', // darker red
  '#1f2937', // dark gray
  '#111827', // black
  '#fbbf24', // yellow
  '#14b8a6', // teal
  '#a855f7', // purple
  '#f43f5e', // rose
  '#0ea5e9', // sky blue
  '#84cc16', // lime
  '#f97316', // orange
  '#64748b', // slate
];

// Função para obter o logo/ícone da bandeira
const getBrandLogo = (brand: string) => {
  const logos: Record<string, { icon: JSX.Element; bg: string }> = {
    'Visa': {
      icon: (
        <div className="text-white font-bold text-xl tracking-wide italic" style={{ fontFamily: 'Arial, sans-serif' }}>
          VISA
        </div>
      ),
      bg: 'bg-blue-600'
    },
    'Mastercard': {
      icon: (
        <div className="flex items-center gap-[-4px] w-12 h-8">
          <div className="w-5 h-5 rounded-full bg-red-500 opacity-80" />
          <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-80 -ml-2" />
        </div>
      ),
      bg: 'bg-gray-800'
    },
    'Elo': {
      icon: (
        <div className="text-white font-bold text-lg tracking-wider">ELO</div>
      ),
      bg: 'bg-yellow-500'
    },
    'American Express': {
      icon: (
        <div className="text-white font-bold text-base tracking-tight">AMEX</div>
      ),
      bg: 'bg-blue-700'
    },
    'Hipercard': {
      icon: (
        <div className="text-white font-bold text-sm tracking-wider">HIPER</div>
      ),
      bg: 'bg-red-600'
    },
    'Diners Club': {
      icon: (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-white" />
          <div className="w-4 h-4 rounded-full border-2 border-white -ml-2" />
        </div>
      ),
      bg: 'bg-blue-900'
    },
    'Discover': {
      icon: (
        <div className="text-white font-bold text-sm tracking-wider">DISCOVER</div>
      ),
      bg: 'bg-orange-600'
    },
    'Outro': {
      icon: (
        <CreditCard size={20} className="text-white" />
      ),
      bg: 'bg-gray-600'
    },
  };

  return logos[brand] || logos['Outro'];
};

export function CardsSection({ creditCards, installmentDebts, recurringTransactions, onAddCard, onDeleteCard, onUpdateCard }: CardsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [brand, setBrand] = useState('');
  const [issuer, setIssuer] = useState('');
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [color, setColor] = useState(CARD_COLORS[0]);
  const [expiryDate, setExpiryDate] = useState(''); // Formato: MM/YYYY
  const [dueDay, setDueDay] = useState(''); // Dia de vencimento da fatura (1-31)
  const [selectedCardForInvoice, setSelectedCardForInvoice] = useState<CreditCardType | null>(null);
  const [cardToEdit, setCardToEdit] = useState<CreditCardType | null>(null);

  // 📚 Tour guiado
  const tourSteps: TourStep[] = [
    {
      target: '[data-tour="cards-header"]',
      title: '💳 Cartões de Crédito',
      content: 'Cadastre seus cartões e gerencie faturas. Você pode vincular dívidas parceladas e recorrências a cada cartão!',
      position: 'bottom'
    },
    {
      target: '[data-tour="add-card-btn"]',
      title: '➕ Adicionar Cartão',
      content: 'Clique aqui para cadastrar um novo cartão. Cadastre todos os seus cartões para organizar melhor suas finanças.',
      position: 'left'
    },
    {
      target: '[data-tour="cards-list"]',
      title: '📋 Seus Cartões',
      content: 'Aqui aparecem todos os seus cartões. Você pode ver a fatura, editar ou excluir cada um. Cartões expirando aparecem com alertas coloridos!',
      position: 'top'
    }
  ];

  // Função para formatar a data de validade enquanto digita
  const handleExpiryChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata MM/YYYY
    if (numbers.length <= 2) {
      setExpiryDate(numbers);
    } else if (numbers.length <= 6) {
      setExpiryDate(`${numbers.slice(0, 2)}/${numbers.slice(2)}`);
    }
  };

  // Função para verificar se o cartão está expirado ou próximo de expirar
  const getExpiryStatus = (month: string, year: string) => {
    if (!month || !year) return null;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    
    const cardYear = parseInt(year);
    const cardMonth = parseInt(month);
    
    // Cartão expirado
    if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
      return { status: 'expired', message: 'Cartão expirado' };
    }
    
    // Expira este mês
    if (cardYear === currentYear && cardMonth === currentMonth) {
      return { status: 'expiring-soon', message: 'Expira este mês' };
    }
    
    // Expira nos próximos 3 meses
    const monthsUntilExpiry = (cardYear - currentYear) * 12 + (cardMonth - currentMonth);
    if (monthsUntilExpiry <= 3) {
      return { status: 'expiring-soon', message: `Expira em ${monthsUntilExpiry} ${monthsUntilExpiry === 1 ? 'mês' : 'meses'}` };
    }
    
    return { status: 'valid', message: '' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!brand || !issuer || !lastFourDigits || !expiryDate || !dueDay) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (lastFourDigits.length !== 4 || !/^\d{4}$/.test(lastFourDigits)) {
      alert('Os últimos 4 dígitos devem conter exatamente 4 números.');
      return;
    }

    // Validar formato da data MM/YYYY
    const expiryMatch = expiryDate.match(/^(\d{2})\/(\d{4})$/);
    if (!expiryMatch) {
      alert('Data de validade inválida. Use o formato MM/AAAA.');
      return;
    }

    const [, month, year] = expiryMatch;
    const monthNum = parseInt(month);
    
    if (monthNum < 1 || monthNum > 12) {
      alert('Mês inválido. Use valores entre 01 e 12.');
      return;
    }

    const expiryStatus = getExpiryStatus(month, year);
    if (expiryStatus?.status === 'expired') {
      if (!window.confirm('Este cartão está expirado. Deseja cadastrá-lo mesmo assim?')) {
        return;
      }
    }

    onAddCard({
      brand,
      issuer,
      lastFourDigits,
      color,
      expiryMonth: month,
      expiryYear: year,
      dueDay: parseInt(dueDay),
    });

    // Resetar form
    setBrand('');
    setIssuer('');
    setLastFourDigits('');
    setColor(CARD_COLORS[0]);
    setExpiryDate('');
    setDueDay('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between" data-tour="cards-header">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Meus Cartões de Crédito</h2>
          <p className="text-sm text-gray-600 mt-1">
            Cadastre seus cartões para vincular dívidas parceladas
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          data-tour="add-card-btn"
        >
          <Plus size={20} />
          Novo Cartão
        </button>
      </div>

      {/* Alerta de Cartões Expirados/Expirando */}
      {creditCards.length > 0 && (() => {
        const expiredCards = creditCards.filter(card => {
          const status = getExpiryStatus(card.expiryMonth, card.expiryYear);
          return status?.status === 'expired';
        });
        
        const expiringSoonCards = creditCards.filter(card => {
          const status = getExpiryStatus(card.expiryMonth, card.expiryYear);
          return status?.status === 'expiring-soon';
        });

        if (expiredCards.length === 0 && expiringSoonCards.length === 0) return null;

        return (
          <div className={`border rounded-lg p-4 ${
            expiredCards.length > 0 
              ? 'bg-red-50 border-red-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className={
                  expiredCards.length > 0 ? 'text-red-600' : 'text-yellow-600'
                } size={20} />
              </div>
              <div className={`text-sm ${
                expiredCards.length > 0 ? 'text-red-800' : 'text-yellow-800'
              }`}>
                <p className="font-medium mb-1">
                  {expiredCards.length > 0 
                    ? '⚠️ Atenção: Cartões Expirados' 
                    : '⏰ Aviso: Cartões Expirando em Breve'}
                </p>
                <div className="space-y-1">
                  {expiredCards.map(card => (
                    <p key={card.id}>
                      • {card.brand} ****{card.lastFourDigits} ({card.issuer}) - <strong>Expirado</strong>
                    </p>
                  ))}
                  {expiringSoonCards.map(card => {
                    const status = getExpiryStatus(card.expiryMonth, card.expiryYear);
                    return (
                      <p key={card.id}>
                        • {card.brand} ****{card.lastFourDigits} ({card.issuer}) - {status?.message}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Formulário de Adicionar */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-red-600" />
            Cadastrar Novo Cartão
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Bandeira */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bandeira *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Selecione a bandeira</option>
                {CARD_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Emissor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emissor (Banco) *
              </label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Ex: Nubank, Itaú, Bradesco..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Últimos 4 dígitos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Últimos 4 Dígitos *
              </label>
              <input
                type="text"
                value={lastFourDigits}
                onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Identificação
              </label>
              <div className="flex gap-2 flex-wrap">
                {CARD_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      color === c ? 'border-gray-900 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Data de Expiração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validade (MM/AAAA) *
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="Ex: 12/2028"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o mês e ano de expiração do cartão
              </p>
            </div>

            {/* Dia de Vencimento da Fatura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dia de Vencimento da Fatura *
              </label>
              <input
                type="number"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                placeholder="Ex: 15"
                min="1"
                max="31"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o dia do mês em que a fatura do cartão vence
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Adicionar Cartão
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setBrand('');
                  setIssuer('');
                  setLastFourDigits('');
                  setColor(CARD_COLORS[0]);
                  setExpiryDate('');
                  setDueDay('');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Cartões */}
      {creditCards.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <CreditCardIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum cartão cadastrado
          </h3>
          <p className="text-gray-600 mb-4">
            Cadastre seus cartões de crédito para vincular dívidas parceladas
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Adicionar Primeiro Cartão
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tour="cards-list">
          {creditCards.map((card) => {
            const expiryStatus = getExpiryStatus(card.expiryMonth, card.expiryYear);
            
            return (
            <div
              key={card.id}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg overflow-hidden"
              style={{
                borderLeft: `4px solid ${card.color}`,
              }}
            >
              {/* Padrão de fundo decorativo */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: card.color, transform: 'translate(30%, -30%)' }}
              />

              {/* Badge de Status de Expiração */}
              {expiryStatus && expiryStatus.status !== 'valid' && (
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold ${
                  expiryStatus.status === 'expired' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-yellow-500 text-gray-900'
                }`}>
                  {expiryStatus.message}
                </div>
              )}

              <div className="relative z-10">
                {/* Header com ícone e botões */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <CreditCard
                      size={24}
                      style={{ color: card.color }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCardToEdit(card)}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      title="Editar cartão"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Tem certeza que deseja excluir o cartão ${card.brand} ****${card.lastFourDigits}?`
                          )
                        ) {
                          onDeleteCard(card.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Excluir cartão"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Emissor e Bandeira */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Emissor</p>
                  <p className="text-lg font-bold">{card.issuer}</p>
                </div>

                {/* Número do cartão */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                  </div>
                  <span className="font-mono text-lg font-bold tracking-wider">
                    {card.lastFourDigits}
                  </span>
                </div>

                {/* Validade, Vencimento e Bandeira */}
                <div className="flex items-end justify-between gap-3 mb-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Validade</p>
                      <p className="text-sm font-mono font-semibold">
                        {card.expiryMonth?.padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Vencimento</p>
                      <p className="text-sm font-mono font-semibold">
                        Dia {card.dueDay}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center justify-center px-3 py-1.5 rounded-lg ${getBrandLogo(card.brand).bg}`}>
                    {getBrandLogo(card.brand).icon}
                  </div>
                </div>

                {/* Botão Ver Fatura */}
                <button
                  onClick={() => setSelectedCardForInvoice(card)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye size={16} />
                  Ver Fatura
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Info adicional */}
      {creditCards.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <CreditCardIcon className="text-blue-600" size={20} />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Seus dados estão seguros</p>
              <p className="text-blue-700">
                Armazenamos apenas as informações necessárias para identificação. Nunca pedimos o
                número completo do cartão ou CVV.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Fatura */}
      {selectedCardForInvoice && (
        <InvoiceView
          card={selectedCardForInvoice}
          installmentDebts={installmentDebts}
          recurringTransactions={recurringTransactions}
          onClose={() => setSelectedCardForInvoice(null)}
        />
      )}

      {/* Modal de Edição de Cartão */}
      {cardToEdit && (
        <EditCardModal
          card={cardToEdit}
          onSave={onUpdateCard}
          onClose={() => setCardToEdit(null)}
        />
      )}

      {/* Tour Guiado */}
      <TourGuide
        tourId="cards-tour"
        steps={tourSteps}
        autoStart={true}
      />
    </div>
  );
}
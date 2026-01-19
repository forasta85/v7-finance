import React, { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import type { CreditCard as CreditCardType } from '../App';

interface EditCardModalProps {
  card: CreditCardType;
  onClose: () => void;
  onSave: (id: string, updatedCard: Omit<CreditCardType, 'id' | 'createdDate'>) => void;
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

export function EditCardModal({ card, onClose, onSave }: EditCardModalProps) {
  const [brand, setBrand] = useState(card.brand);
  const [issuer, setIssuer] = useState(card.issuer);
  const [lastFourDigits, setLastFourDigits] = useState(card.lastFourDigits);
  const [color, setColor] = useState(card.color);
  const [expiryDate, setExpiryDate] = useState(`${card.expiryMonth}/${card.expiryYear}`);
  const [dueDay, setDueDay] = useState(card.dueDay.toString());

  // Função para formatar a data de validade enquanto digita
  const handleExpiryChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      setExpiryDate(numbers);
    } else if (numbers.length <= 6) {
      setExpiryDate(`${numbers.slice(0, 2)}/${numbers.slice(2)}`);
    }
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

    const dueDayNum = parseInt(dueDay);
    if (dueDayNum < 1 || dueDayNum > 31) {
      alert('Dia de vencimento inválido. Use valores entre 1 e 31.');
      return;
    }

    onSave(card.id, {
      brand,
      issuer,
      lastFourDigits,
      color,
      expiryMonth: month,
      expiryYear: year,
      dueDay: dueDayNum,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard size={24} className="text-red-600" />
            Editar Cartão
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

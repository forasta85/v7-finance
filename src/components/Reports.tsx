import React from 'react';
import { FileDown, Mail, Printer } from 'lucide-react';
import { Transaction } from '../App';
import { projectId } from '../utils/supabase/info';

interface ReportsProps {
  transactions: Transaction[];
  accessToken?: string;
}

export function Reports({ transactions, accessToken }: ReportsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getReportData = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactions
    };
  };

  const sendEmailReport = async () => {
    if (!accessToken) {
      alert('Você precisa estar logado para enviar relatórios');
      return;
    }

    const email = prompt('Digite o e-mail de destino:');
    if (!email) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/send-email-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            email,
            reportData: getReportData()
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
      } else {
        alert('Erro ao enviar relatório: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      alert('Erro ao enviar relatório');
    }
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor'];
    const rows = transactions.map(t => [
      new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR'),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.description,
      t.category,
      t.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório Financeiro', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;

    doc.setFontSize(12);
    doc.text('Resumo:', 14, 45);
    doc.setFontSize(10);
    doc.text(`Total de Receitas: ${formatCurrency(totalIncome)}`, 14, 52);
    doc.text(`Total de Despesas: ${formatCurrency(totalExpense)}`, 14, 59);
    doc.text(`Saldo: ${formatCurrency(balance)}`, 14, 66);

    const tableData = transactions.map(t => [
      new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR'),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.description,
      t.category,
      formatCurrency(t.amount)
    ]);

    (doc as any).autoTable({
      head: [['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor']],
      body: tableData,
      startY: 75,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} className="text-gray-700" />
        <h2 className="text-gray-900">Relatórios</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-900 mb-3">Resumo Geral</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Transações:</span>
              <span className="text-gray-900">{transactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Receitas:</span>
              <span className="text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de Despesas:</span>
              <span className="text-red-600">{formatCurrency(totalExpense)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="text-gray-900">Saldo:</span>
              <span className={totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-red-600'}>
                {formatCurrency(totalIncome - totalExpense)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-900 mb-3">Despesas por Categoria</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
                <div key={category} className="flex justify-between">
                  <span className="text-gray-600">{category}:</span>
                  <span className="text-gray-900">{formatCurrency(amount)}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Exportar CSV
            </button>
            <button
              onClick={exportToPDF}
              className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Exportar PDF
            </button>
          </div>

          {accessToken && (
            <div className="flex gap-3">
              <button
                onClick={sendEmailReport}
                className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Enviar por E-mail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import {
  X,
  LayoutDashboard,
  Receipt,
  Target,
  FileText,
  Settings,
  PiggyBank,
  CreditCard,
  DollarSign,
  Wallet,
  Repeat,
  BookOpen,
  Shield,
  LogOut
} from 'lucide-react';
import { Logo } from './Logo';
import { projectId } from '../utils/supabase/info';

// 🔄 VERSÃO ATUALIZADA: 2026-01-08 com Tutoriais e Admin

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userEmail: string;
  accessToken: string; // 🔐 NOVO: Token de acesso
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  currentSection, 
  onSectionChange, 
  onLogout,
  userEmail,
  accessToken
}: MobileMenuProps) {
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Verificar se é admin
  React.useEffect(() => {
    if (isOpen) {
      checkAdmin();
    }
  }, [isOpen]);

  const checkAdmin = async () => {
    try {
      console.log('🔐 Verificando status admin...', { 
        hasToken: !!accessToken, 
        projectId,
        userEmail 
      });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/admin/check`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
      console.log('🔐 Resposta do servidor:', { 
        status: response.status, 
        ok: response.ok 
      });
      
      const data = await response.json();
      
      console.log('🔐 Dados recebidos:', data);
      
      setIsAdmin(data.isAdmin || false);
      
      if (data.isAdmin) {
        console.log('✅ Usuário É ADMIN!');
      } else {
        console.log('❌ Usuário NÃO é admin');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar admin:', error);
      setIsAdmin(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'accounts', label: 'Contas', icon: Wallet },
    { id: 'transactions', label: 'Transações', icon: Receipt },
    { id: 'recurring', label: 'Recorrentes', icon: Repeat },
    { id: 'cards', label: 'Cartões', icon: CreditCard },
    { id: 'installments', label: 'Parcelamentos', icon: DollarSign },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'savings', label: 'Poupança', icon: PiggyBank },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'tutorials', label: 'Tutoriais', icon: BookOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
    ...(isAdmin ? [{ id: 'admin', label: 'Administração', icon: Shield }] : []),
  ];

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Lateral */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header do Menu */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <Logo size={40} showText={true} className="[&>svg]:mr-0 [&>div>span:first-child]:text-white [&>div>span:last-child]:text-gray-400" />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>
          <div className="text-sm text-gray-400 truncate">{userEmail}</div>
        </div>

        {/* Items do Menu - COM SCROLL */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 menu-scroll">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            const isNew = item.id === 'tutorials';
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isNew && !isActive && (
                  <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                    NOVO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer do Menu */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}
import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface ChangePasswordModalProps {
  isOpen: boolean;
  userEmail: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, userEmail, onSuccess, onClose }: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validatePassword = () => {
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Alterando senha...');

      // Atualizar senha no Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('❌ Erro ao atualizar senha:', updateError);
        setError(updateError.message || 'Erro ao atualizar senha');
        setLoading(false);
        return;
      }

      console.log('✅ Senha atualizada com sucesso');

      // Atualizar metadata para remover flag de troca de senha
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          needsPasswordChange: false,
        },
      });

      if (metadataError) {
        console.error('⚠️ Erro ao atualizar metadata:', metadataError);
        // Não falhar se metadata não atualizar
      }

      alert('✅ Senha alterada com sucesso!');
      onSuccess();
    } catch (err: any) {
      console.error('❌ Erro ao alterar senha:', err);
      setError(err.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-red-900 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Lock className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Alterar Senha
                </h2>
                <p className="text-sm text-gray-300">
                  Por segurança, defina uma nova senha
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleChangePassword} className="p-6 space-y-6">
          {/* Aviso */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Primeiro acesso
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Você está usando uma senha temporária. Por favor, defina uma nova senha segura para sua conta.
                </p>
              </div>
            </div>
          </div>

          {/* Email (apenas exibição) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sua conta
            </label>
            <input
              type="text"
              value={userEmail}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mínimo de 6 caracteres
            </p>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente sua senha"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
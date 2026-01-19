import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Logo } from '../Logo';

interface ResetPasswordProps {
  onBackToLogin: () => void;
}

export function ResetPassword({ onBackToLogin }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao enviar e-mail de recuperação');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao solicitar reset:', err);
      setError('Erro ao solicitar recuperação. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={64} showText={false} />
          </div>
          <h1 className="text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-600 mt-2">
            {success 
              ? 'Instruções enviadas!' 
              : 'Digite seu e-mail para receber instruções'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              <p className="text-sm">
                Um e-mail foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
              <p className="text-sm mt-2">
                Verifique sua caixa de entrada e spam.
              </p>
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full bg-gradient-to-r from-gray-800 to-red-600 text-white py-3 rounded-lg hover:from-gray-900 hover:to-red-700 transition-colors"
            >
              Voltar para Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-800 to-red-600 text-white py-3 rounded-lg hover:from-gray-900 hover:to-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Instruções'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
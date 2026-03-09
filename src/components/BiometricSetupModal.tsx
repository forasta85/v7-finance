import React, { useState } from 'react';
import { X, Fingerprint, Smartphone, AlertCircle } from 'lucide-react';
import { registerBiometric } from '../utils/biometric';

interface BiometricSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string; // 🔧 CORRIGIDO: era 'email', agora 'userEmail'
  accessToken: string;
}

export function BiometricSetupModal({
  isOpen,
  onClose,
  userEmail, // 🔧 CORRIGIDO
  accessToken,
}: BiometricSetupModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    // 🔧 NOVO: Validação
    if (!userEmail || !accessToken) {
      setError('Dados de autenticação inválidos');
      return;
    }

    setIsRegistering(true);
    setError(null);

    const result = await registerBiometric(userEmail, accessToken);

    setIsRegistering(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Disparar evento customizado para atualizar tela de login
        window.dispatchEvent(new CustomEvent('biometric-registered'));
      }, 2000);
    } else {
      setError(result.error || 'Erro ao cadastrar biometria');
    }
  };

  const handleSkip = () => {
    // Salvar que o usuário pulou para não mostrar novamente
    localStorage.setItem('biometric_setup_skipped', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {success ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="text-green-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ✅ Biometria Ativada!
            </h3>
            <p className="text-gray-600">
              Agora você pode fazer login com impressão digital, Face ID ou Touch ID
            </p>
          </div>
        ) : (
          // Setup State
          <>
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <Fingerprint className="text-red-600" size={40} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Ative o Login por Biometria
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Faça login mais rápido e seguro usando impressão digital, Face ID ou Touch ID
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Login instantâneo</p>
                  <p className="text-sm text-gray-600">Sem precisar digitar senha</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mais seguro</p>
                  <p className="text-sm text-gray-600">Seus dados biométricos ficam no dispositivo</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Funciona offline</p>
                  <p className="text-sm text-gray-600">Sem precisar de internet</p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Device Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Smartphone size={16} />
                <span>
                  Funciona com Face ID, Touch ID, Windows Hello e mais
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Aguarde...
                  </>
                ) : (
                  <>
                    <Fingerprint size={20} />
                    Ativar Biometria
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                disabled={isRegistering}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Agora Não
              </button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Você pode ativar ou desativar a biometria depois nas Configurações
            </p>
          </>
        )}
      </div>
    </div>
  );
}
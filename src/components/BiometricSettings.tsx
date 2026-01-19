import React, { useState, useEffect } from 'react';
import { Fingerprint, Smartphone, Trash2, Plus, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { 
  isBiometricAvailable, 
  registerBiometric,
  clearBiometricData 
} from '../utils/biometric';
import { projectId } from '../utils/supabase/info';

interface BiometricCredential {
  credentialId: string;
  deviceName: string;
  createdAt: string;
}

interface BiometricSettingsProps {
  accessToken: string;
  userEmail: string;
}

export function BiometricSettings({ accessToken, userEmail }: BiometricSettingsProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [credentials, setCredentials] = useState<BiometricCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    checkBiometric();
    loadCredentials();
  }, []);

  const checkBiometric = () => {
    const available = isBiometricAvailable();
    setIsAvailable(available);
  };

  const loadCredentials = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/biometric/credentials`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCredentials(data.credentials || []);
      }
    } catch (err) {
      console.error('Erro ao carregar credenciais:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBiometric = async () => {
    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    const result = await registerBiometric(userEmail, accessToken);

    setIsRegistering(false);

    if (result.success) {
      setSuccess('Biometria cadastrada com sucesso!');
      await loadCredentials();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || 'Erro ao cadastrar biometria');
    }
  };

  const handleRemoveCredential = async (credentialId: string) => {
    if (!confirm('Tem certeza que deseja remover este dispositivo?')) {
      return;
    }

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/biometric/credentials/${encodeURIComponent(credentialId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        setSuccess('Dispositivo removido com sucesso!');
        await loadCredentials();
        
        // Se removeu a última credencial, limpar dados locais
        if (credentials.length === 1) {
          clearBiometricData();
        }
        
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Erro ao remover dispositivo');
      }
    } catch (err) {
      console.error('Erro ao remover credencial:', err);
      setError('Erro ao remover dispositivo');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!isAvailable) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Fingerprint size={20} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-gray-900">Login por Biometria</h2>
            <p className="text-sm text-gray-500">Acesso rápido e seguro</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-gray-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Biometria não disponível
            </p>
            <p className="text-xs text-gray-600">
              Seu navegador ou dispositivo não suporta autenticação biométrica.
              Tente usar um dispositivo com Face ID, Touch ID ou Windows Hello.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <Fingerprint size={20} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-gray-900">Login por Biometria</h2>
          <p className="text-sm text-gray-500">Gerencie seus dispositivos autorizados</p>
        </div>
      </div>

      {/* Mensagens de Sucesso/Erro */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Informações sobre Biometria */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-200">
        <div className="flex items-start gap-3">
          <Shield className="text-purple-600 flex-shrink-0 mt-1" size={20} />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              ✨ Faça login instantâneo com biometria
            </p>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                <span>Sem precisar digitar senha</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                <span>Seus dados ficam seguros no dispositivo</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                <span>Funciona com Face ID, Touch ID e Windows Hello</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lista de Dispositivos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Dispositivos Autorizados ({credentials.length})
          </h3>
          <button
            onClick={handleAddBiometric}
            disabled={isRegistering || loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isRegistering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Cadastrando...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Adicionar Dispositivo</span>
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : credentials.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <Smartphone className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-sm font-medium text-gray-900 mb-1">
              Nenhum dispositivo cadastrado
            </p>
            <p className="text-xs text-gray-600">
              Clique em "Adicionar Dispositivo" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {credentials.map((cred) => (
              <div
                key={cred.credentialId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <Smartphone size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {cred.deviceName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cadastrado em {formatDate(cred.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCredential(cred.credentialId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover dispositivo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informação Adicional */}
      {credentials.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>💡 Dica:</strong> Você pode ter biometria cadastrada em vários dispositivos. 
            Remova dispositivos antigos que você não usa mais para manter sua conta segura.
          </p>
        </div>
      )}
    </div>
  );
}

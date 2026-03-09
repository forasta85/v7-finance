import React, { useState, useEffect } from 'react';
import { Mail, Lock, Fingerprint, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';
import { Logo } from '../Logo';
import { 
  isBiometricAvailable, 
  loginWithBiometric, 
  getSavedBiometricEmail,
  checkBiometricAvailable 
} from '../../utils/biometric';

interface LoginProps {
  onLoginSuccess: (accessToken: string, userEmail: string) => void;
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
}

export function Login({ onLoginSuccess, onSwitchToSignup, onSwitchToReset }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordStep, setShowPasswordStep] = useState(false); // 🆕 Controlar etapa de senha
  
  // 🔐 NOVO: Estados para biometria
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometricSetup, setHasBiometricSetup] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // 🆕 Controlar se mostra formulário
  
  // 🐛 DEBUG: Logs visuais para iPhone
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugModal, setShowDebugModal] = useState(false);
  
  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Verificar se biometria está disponível ao carregar
  useEffect(() => {
    const checkBiometric = async () => {
      const available = isBiometricAvailable();
      setBiometricAvailable(available);
      addDebugLog('📱 Dispositivo: ' + navigator.userAgent);
      addDebugLog('🔐 Biometria disponível no navegador? ' + available);
      
      if (available) {
        const savedBiometricEmail = getSavedBiometricEmail();
        setSavedEmail(savedBiometricEmail);
        
        if (savedBiometricEmail) {
          setEmail(savedBiometricEmail);
          const hasSetup = await checkBiometricAvailable(savedBiometricEmail);
          setHasBiometricSetup(hasSetup);
          addDebugLog('🔐 Email salvo com biometria detectado: ' + savedBiometricEmail + ' Setup: ' + hasSetup);
        }
      }
    };
    
    // 🆕 Escutar eventos de log do biometric.ts
    const handleBiometricLog = (event: any) => {
      addDebugLog(event.detail);
    };
    
    window.addEventListener('biometric-log', handleBiometricLog);
    checkBiometric();
    
    return () => {
      window.removeEventListener('biometric-log', handleBiometricLog);
    };
  }, []);

  // 🔐 NOVO: Verificar biometria quando o email mudar
  useEffect(() => {
    const recheckBiometric = async () => {
      if (!biometricAvailable || !email) {
        setHasBiometricSetup(false);
        return;
      }
      
      // ✅ Verificar apenas se email tem formato válido completo
      // Deve ter @ seguido de domínio e extensão (.com, .br, etc)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        setHasBiometricSetup(false);
        return;
      }
      
      addDebugLog('🔍 Verificando biometria para: ' + email); // DEBUG
      const hasSetup = await checkBiometricAvailable(email);
      addDebugLog('✅ Tem biometria? ' + hasSetup); // DEBUG
      setHasBiometricSetup(hasSetup);
    };
    
    // Adicionar delay de 1000ms (1 segundo) para não fazer muitas chamadas
    const timer = setTimeout(recheckBiometric, 1000);
    return () => clearTimeout(timer);
  }, [email, biometricAvailable]);

  // 🔐 NOVO: Listener para quando biometria for registrada
  useEffect(() => {
    const handleBiometricRegistered = async () => {
      addDebugLog('🎉 Biometria registrada! Atualizando tela de login...');
      // Recarregar email salvo
      const savedBiometricEmail = getSavedBiometricEmail();
      if (savedBiometricEmail) {
        setEmail(savedBiometricEmail);
        setSavedEmail(savedBiometricEmail);
        const hasSetup = await checkBiometricAvailable(savedBiometricEmail);
        setHasBiometricSetup(hasSetup);
        addDebugLog('✅ Login atualizado com biometria: ' + hasSetup);
      }
    };

    window.addEventListener('biometric-registered', handleBiometricRegistered);
    return () => window.removeEventListener('biometric-registered', handleBiometricRegistered);
  }, []);

  // 🔐 NOVO: Atualizar email quando mudar
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Limpar erro ao mudar email
  };

  // 🆕 Função para avançar para etapa de senha
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowPasswordStep(true);
      setError('');
    }
  };

  // 🆕 Voltar para etapa de email
  const handleBackToEmail = () => {
    setShowPasswordStep(false);
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        onLoginSuccess(data.session.access_token, email);
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  // 🔐 Função para login biométrico com validação e oferta de cadastro
  const handleBiometricLogin = async () => {
    // Usar email salvo ou email digitado
    const emailToUse = email || savedEmail;
    
    if (!emailToUse) {
      setError('Nenhum e-mail cadastrado com biometria. Digite seu e-mail primeiro.');
      return;
    }

    setBiometricLoading(true);
    setError('');

    try {
      addDebugLog('🔐 Iniciando login biométrico para: ' + emailToUse);
      
      // Verificar se tem biometria cadastrada
      const hasSetup = await checkBiometricAvailable(emailToUse);
      addDebugLog('🔍 Biometria cadastrada? ' + hasSetup);

      if (!hasSetup) {
        // Não tem biometria cadastrada - oferecer cadastro
        const wantToRegister = confirm(
          `Biometria não cadastrada para ${emailToUse}.\n\n` +
          'Deseja cadastrar sua biometria agora?\n\n' +
          'Você precisará fazer login com senha primeiro para confirmar sua identidade.'
        );
        
        if (wantToRegister) {
          addDebugLog('✅ Usuário aceitou cadastrar biometria');
          // Preencher o email no formulário
          if (!email) {
            setEmail(emailToUse);
          }
          setError('Por favor, faça login com sua senha primeiro. Após o login, você poderá cadastrar a biometria nas configurações.');
        } else {
          addDebugLog('❌ Usuário recusou cadastrar biometria');
        }
        setBiometricLoading(false);
        return;
      }

      // Tem biometria cadastrada - fazer login
      const result = await loginWithBiometric(emailToUse);
      addDebugLog('📦 Resultado do login biométrico: ' + JSON.stringify(result));

      if (result.success && result.accessToken) {
        addDebugLog('✅ Login biométrico bem-sucedido!');
        onLoginSuccess(result.accessToken, emailToUse);
      } else {
        addDebugLog('❌ Login biométrico falhou: ' + result.error);
        setError(result.error || 'Erro ao fazer login com biometria');
      }
    } catch (err) {
      addDebugLog('❌ Erro no login biométrico: ' + err);
      addDebugLog('❌ Stack: ' + (err instanceof Error ? err.stack : 'N/A'));
      setError('Erro ao fazer login com biometria. Detalhes no console.');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={64} showText={false} />
          </div>
          <h1 className="text-gray-900">Bem-vindo ao V7 Finance</h1>
          <p className="text-gray-600 mt-2">Faça login para continuar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 🔐 BOTÃO DE BIOMETRIA FIXO */}
        {biometricAvailable && (
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={biometricLoading || loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg font-semibold"
            >
              {biometricLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verificando biometria...</span>
                </>
              ) : (
                <>
                  <Fingerprint size={24} />
                  <span>Login com Biometria</span>
                </>
              )}
            </button>
            {(email || savedEmail) && hasBiometricSetup && (
              <div className="mt-2 text-xs flex items-center justify-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Biometria configurada para {email || savedEmail}</span>
              </div>
            )}
          </div>
        )}

        {biometricAvailable && (
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        )}

        {/* 🆕 ETAPA 1: Apenas Email */}
        {!showPasswordStep ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                  placeholder="seu@email.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email || loading || biometricLoading}
              className="w-full bg-gradient-to-r from-gray-800 to-red-600 text-white py-3 rounded-lg hover:from-gray-900 hover:to-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              Continuar
            </button>
          </form>
        ) : (
          /* 🆕 ETAPA 2: Senha */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mostrar email (só leitura) */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Trocar
                </button>
              </div>
            </div>

            {/* Campo de senha */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onSwitchToReset}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Esqueceu sua senha?
            </button>

            <button
              type="submit"
              disabled={loading || biometricLoading}
              className="w-full bg-gradient-to-r from-gray-800 to-red-600 text-white py-3 rounded-lg hover:from-gray-900 hover:to-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Cadastre-se
            </button>
          </p>
        </div>
        
        {/* 🐛 DEBUG: Botão para ver logs (apenas iPhone/dispositivos móveis) */}
        {debugLogs.length > 0 && (
          <button
            type="button"
            onClick={() => setShowDebugModal(true)}
            className="mt-4 w-full text-xs text-gray-500 hover:text-gray-700 py-2 border border-gray-300 rounded"
          >
            🐛 Ver Logs de Debug ({debugLogs.length})
          </button>
        )}
      </div>
      
      {/* 🐛 DEBUG: Modal de logs */}
      {showDebugModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowDebugModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">🐛 Debug Logs</h3>
              <button
                onClick={() => setShowDebugModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
              <div className="space-y-2 font-mono text-xs">
                {debugLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={
                      log.includes('❌') ? 'text-red-600' : 
                      log.includes('✅') ? 'text-green-600' : 
                      log.includes('🔐') || log.includes('🔍') ? 'text-blue-600' : 
                      'text-gray-700'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(debugLogs.join('\n'));
                  alert('Logs copiados!');
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                📋 Copiar Logs
              </button>
              <button
                onClick={() => {
                  setDebugLogs([]);
                  setShowDebugModal(false);
                }}
                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                🗑️ Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
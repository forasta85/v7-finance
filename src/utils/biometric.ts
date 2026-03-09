import { projectId, publicAnonKey } from '../utils/supabase/info';

// Verificar se o navegador suporta WebAuthn
export function isBiometricAvailable(): boolean {
  // Verificar se está em um iframe sem permissões adequadas
  try {
    const isInIframe = window.self !== window.top;
    
    // Se está em iframe, verificar se tem permissões
    if (isInIframe) {
      // A biometria não funcionará em iframe sem Permissions Policy adequada
      // Retornar false silenciosamente para não mostrar o botão
      return false;
    }
  } catch (e) {
    // Se der erro ao verificar, provavelmente está em iframe de domínio diferente
    return false;
  }
  
  // Verificar se está em contexto seguro (HTTPS ou localhost)
  const isSecureContext = window.isSecureContext;
  
  // Verificar se as APIs estão disponíveis
  const hasWebAuthn = 
    window?.PublicKeyCredential !== undefined &&
    navigator?.credentials !== undefined;
  
  if (!isSecureContext) {
    return false;
  }
  
  if (!hasWebAuthn) {
    return false;
  }
  
  return true;
}

// Gerar desafio aleatório
function generateChallenge(): Uint8Array {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge;
}

// Converter ArrayBuffer para Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Converter Base64 para ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Registrar credencial biométrica
export async function registerBiometric(email: string, accessToken: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // 🔧 NOVO: Validações
    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Email inválido',
      };
    }

    if (!accessToken || typeof accessToken !== 'string') {
      return {
        success: false,
        error: 'Token de acesso inválido',
      };
    }

    if (!isBiometricAvailable()) {
      return {
        success: false,
        error: 'Biometria não disponível neste navegador',
      };
    }

    console.log('🔐 Iniciando registro de biometria...', {
      email,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent
    }); // DEBUG

    // Gerar challenge
    const challenge = generateChallenge();

    // 🍎 NOVO: Hostname compatível com iOS
    const rpId = window.location.hostname.includes('localhost') 
      ? 'localhost' 
      : window.location.hostname;

    console.log('🔐 rpId configurado:', rpId); // DEBUG

    // Criar credencial
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'V7 Finance',
          id: rpId,
        },
        user: {
          id: new TextEncoder().encode(email),
          name: email,
          displayName: email.split('@')[0], // 🔧 Agora validado
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Usar autenticador do dispositivo
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential;

    if (!credential) {
      console.error('❌ Falha ao criar credencial'); // DEBUG
      return {
        success: false,
        error: 'Falha ao criar credencial',
      };
    }

    console.log('✅ Credencial criada com sucesso!'); // DEBUG

    // Extrair dados da credencial
    const response = credential.response as AuthenticatorAttestationResponse;
    const credentialId = arrayBufferToBase64(credential.rawId);
    const publicKey = arrayBufferToBase64(response.getPublicKey()!);

    // Detectar nome do dispositivo
    const deviceName = getDeviceName();

    console.log('📤 Enviando para servidor...', { deviceName }); // DEBUG

    // Salvar no servidor
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/biometric/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          credentialId,
          publicKey,
          deviceName,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Erro do servidor:', data); // DEBUG
      return {
        success: false,
        error: data.error || 'Erro ao registrar biometria',
      };
    }

    // Salvar email localmente para facilitar login
    localStorage.setItem('biometric_email', email);
    localStorage.setItem('biometric_credential_id', credentialId);

    console.log('✅ Biometria registrada com sucesso!', {
      email,
      credentialId: credentialId.substring(0, 10) + '...'
    });

    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao registrar biometria:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    
    if (error.name === 'NotAllowedError') {
      return {
        success: false,
        error: 'Operação cancelada pelo usuário',
      };
    }
    
    if (error.name === 'NotSupportedError') {
      return {
        success: false,
        error: 'Biometria não suportada neste dispositivo',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
    };
  }
}

// Login com biometria
export async function loginWithBiometric(email: string): Promise<{
  success: boolean;
  accessToken?: string;
  error?: string;
}> {
  try {
    const msg1 = '🔐 loginWithBiometric: Iniciando para ' + email;
    console.log(msg1);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg1 }));

    // Verificar se biometria está disponível
    if (!isBiometricAvailable()) {
      const msg2 = '❌ loginWithBiometric: Biometria não disponível no navegador';
      console.error(msg2);
      window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg2 }));
      return {
        success: false,
        error: 'Biometria não disponível neste navegador',
      };
    }

    // Buscar credencial salva
    const savedCredentialId = localStorage.getItem('biometric_credential_id');
    const msg3 = '🔍 loginWithBiometric: Credencial salva: ' + (savedCredentialId ? savedCredentialId.substring(0, 20) + '...' : 'NENHUMA');
    console.log(msg3);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg3 }));

    if (!savedCredentialId) {
      const msg4 = '❌ loginWithBiometric: Credencial não encontrada no localStorage';
      console.error(msg4);
      window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg4 }));
      return {
        success: false,
        error: 'Credencial não encontrada localmente. Cadastre a biometria novamente.',
      };
    }

    // Gerar challenge
    const challenge = generateChallenge();
    const msg5 = '🔑 loginWithBiometric: Challenge gerado';
    console.log(msg5);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg5 }));

    // 🍎 NOVO: Hostname compatível com iOS
    const rpId = window.location.hostname.includes('localhost') 
      ? 'localhost' 
      : window.location.hostname;

    const msg6 = '🌐 loginWithBiometric: rpId = ' + rpId;
    console.log(msg6);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg6 }));

    // Solicitar autenticação
    const msg7 = '👆 loginWithBiometric: Solicitando autenticação biométrica...';
    console.log(msg7);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg7 }));

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: rpId,
        allowCredentials: [
          {
            type: 'public-key',
            id: base64ToArrayBuffer(savedCredentialId),
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential | null;

    if (!credential) {
      const msg8 = '❌ loginWithBiometric: Credencial não obtida (usuário cancelou ou erro)';
      console.error(msg8);
      window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg8 }));
      return {
        success: false,
        error: 'Falha ao obter credencial',
      };
    }

    const msg9 = '✅ loginWithBiometric: Credencial obtida com sucesso!';
    console.log(msg9);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg9 }));

    // Extrair dados da assinatura
    const response = credential.response as AuthenticatorAssertionResponse;
    const signature = arrayBufferToBase64(response.signature);
    const authenticatorData = arrayBufferToBase64(response.authenticatorData);
    const clientDataJSON = arrayBufferToBase64(response.clientDataJSON);

    const msg10 = '📤 loginWithBiometric: Enviando para servidor...';
    console.log(msg10);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg10 }));

    // Verificar no servidor
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/biometric/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // 🔧 CORRIGIDO
        },
        body: JSON.stringify({
          email,
          credentialId: savedCredentialId,
          signature,
          authenticatorData,
          clientDataJSON,
        }),
      }
    );

    const msg11 = '📡 loginWithBiometric: Status da resposta: ' + res.status;
    console.log(msg11);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg11 }));

    const data = await res.json();
    const msg12 = '📦 loginWithBiometric: Dados recebidos: ' + JSON.stringify(data);
    console.log(msg12);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg12 }));

    if (!res.ok) {
      const msg13 = '❌ loginWithBiometric: Erro HTTP ' + res.status + ' - ' + (data.error || 'Erro desconhecido');
      console.error(msg13);
      window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg13 }));
      return {
        success: false,
        error: data.error || 'Erro ao verificar biometria',
      };
    }

    const msg14 = '✅ loginWithBiometric: Login bem-sucedido!';
    console.log(msg14);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg14 }));

    return {
      success: true,
      accessToken: data.accessToken,
    };
  } catch (error: any) {
    const msg15 = '❌ loginWithBiometric: Erro capturado: ' + error;
    const msg16 = '❌ Error name: ' + error.name;
    const msg17 = '❌ Error message: ' + error.message;
    const msg18 = '❌ Stack: ' + (error.stack || 'N/A');
    console.error(msg15);
    console.error(msg16);
    console.error(msg17);
    console.error(msg18);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg15 }));
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg16 }));
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg17 }));
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg18 }));

    if (error.name === 'NotAllowedError') {
      return {
        success: false,
        error: 'Operação cancelada pelo usuário',
      };
    }

    return {
      success: false,
      error: error.message || 'Erro ao fazer login com biometria',
    };
  }
}

// Verificar se o usuário tem biometria cadastrada
export async function checkBiometricAvailable(email: string): Promise<boolean> {
  try {
    // 🔧 NOVO: Validação
    if (!email || typeof email !== 'string') {
      const msg = '❌ checkBiometricAvailable: Email inválido ' + email;
      console.log(msg);
      window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg }));
      return false;
    }

    const msg1 = '🔍 checkBiometricAvailable: Consultando servidor para ' + email;
    console.log(msg1);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg1 }));

    const url = `https://${projectId}.supabase.co/functions/v1/make-server-7f44b203/biometric/check/${encodeURIComponent(email)}`;
    const msg2 = '📡 URL: ' + url;
    console.log(msg2);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg2 }));

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`, // 🔧 CORRIGIDO: Adicionar header obrigatório
      },
    });
    
    const msg3 = '📡 checkBiometricAvailable: Status da resposta: ' + res.status;
    console.log(msg3);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg3 }));
    
    if (!res.ok) {
      const errorText = await res.text();
      const msg4 = '❌ checkBiometricAvailable: Erro HTTP ' + res.status + ' ' + errorText;
      console.error(msg4);
      window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg4 }));
      return false;
    }
    
    const data = await res.json();
    const msg5 = '📦 checkBiometricAvailable: Dados recebidos: ' + JSON.stringify(data);
    console.log(msg5);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg5 }));
    
    return data.hasBiometric || false;
  } catch (error) {
    const msg6 = '❌ Erro ao verificar biometria: ' + error;
    const msg7 = '❌ Stack trace: ' + (error instanceof Error ? error.stack : 'N/A');
    console.error(msg6);
    console.error(msg7);
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg6 }));
    window.dispatchEvent(new CustomEvent('biometric-log', { detail: msg7 }));
    return false;
  }
}

// Detectar nome do dispositivo
function getDeviceName(): string {
  const userAgent = navigator.userAgent;
  
  if (/iPhone/.test(userAgent)) return 'iPhone';
  if (/iPad/.test(userAgent)) return 'iPad';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Mac/.test(userAgent)) return 'Mac';
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Linux/.test(userAgent)) return 'Linux';
  
  return 'Dispositivo';
}

// Obter email salvo localmente
export function getSavedBiometricEmail(): string | null {
  return localStorage.getItem('biometric_email');
}

// Limpar dados biométricos locais
export function clearBiometricData(): void {
  localStorage.removeItem('biometric_email');
  localStorage.removeItem('biometric_credential_id');
}
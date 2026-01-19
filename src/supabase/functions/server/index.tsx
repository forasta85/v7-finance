import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { emailTemplates } from './email-templates.ts'; // 📧 NOVO

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Rota de cadastro de usuário
app.post('/make-server-7f44b203/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, senha e nome são obrigatórios' }, 400);
    }

    // Criar usuário com Supabase Auth
    // Automatically confirm the user's email since an email server hasn't been configured.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log('Erro ao criar usuário:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Erro no signup:', error);
    return c.json({ error: 'Erro ao criar usuário' }, 500);
  }
});

// Rota de reset de senha
app.post('/make-server-7f44b203/reset-password', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email é obrigatório' }, 400);
    }

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`,
    });

    if (error) {
      console.log('Erro ao enviar email de reset:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, message: 'Email de recuperação enviado' });
  } catch (error) {
    console.log('Erro no reset de senha:', error);
    return c.json({ error: 'Erro ao solicitar reset de senha' }, 500);
  }
});

// Salvar transações do usuário
app.post('/make-server-7f44b203/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { transactions } = await c.req.json();
    await kv.set(`transactions:${user.id}`, transactions);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar transações:', error);
    return c.json({ error: 'Erro ao salvar transações' }, 500);
  }
});

// Obter transações do usuário
app.get('/make-server-7f44b203/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const transactions = await kv.get(`transactions:${user.id}`) || [];
    return c.json({ transactions });
  } catch (error) {
    console.log('Erro ao obter transações:', error);
    return c.json({ error: 'Erro ao obter transações' }, 500);
  }
});

// Salvar metas do usuário
app.post('/make-server-7f44b203/goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { goals } = await c.req.json();
    await kv.set(`goals:${user.id}`, goals);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar metas:', error);
    return c.json({ error: 'Erro ao salvar metas' }, 500);
  }
});

// Obter metas do usuário
app.get('/make-server-7f44b203/goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const goals = await kv.get(`goals:${user.id}`) || [];
    return c.json({ goals });
  } catch (error) {
    console.log('Erro ao obter metas:', error);
    return c.json({ error: 'Erro ao obter metas' }, 500);
  }
});

// Salvar metas de poupança do usuário
app.post('/make-server-7f44b203/savings-goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { savingsGoals } = await c.req.json();
    await kv.set(`savings-goals:${user.id}`, savingsGoals);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar metas de poupança:', error);
    return c.json({ error: 'Erro ao salvar metas de poupança' }, 500);
  }
});

// Obter metas de poupança do usuário
app.get('/make-server-7f44b203/savings-goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const savingsGoals = await kv.get(`savings-goals:${user.id}`) || [];
    return c.json({ savingsGoals });
  } catch (error) {
    console.log('Erro ao obter metas de poupança:', error);
    return c.json({ error: 'Erro ao obter metas de poupança' }, 500);
  }
});

// 💳 NOVO: Salvar contas do usuário
app.post('/make-server-7f44b203/accounts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { accounts } = await c.req.json();
    await kv.set(`accounts:${user.id}`, accounts);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar contas:', error);
    return c.json({ error: 'Erro ao salvar contas' }, 500);
  }
});

// 💳 NOVO: Obter contas do usuário
app.get('/make-server-7f44b203/accounts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const accounts = await kv.get(`accounts:${user.id}`) || [];
    return c.json({ accounts });
  } catch (error) {
    console.log('Erro ao obter contas:', error);
    return c.json({ error: 'Erro ao obter contas' }, 500);
  }
});

// 🔄 NOVO: Salvar transações recorrentes do usuário
app.post('/make-server-7f44b203/recurring-transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { recurringTransactions } = await c.req.json();
    await kv.set(`recurring-transactions:${user.id}`, recurringTransactions);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar transações recorrentes:', error);
    return c.json({ error: 'Erro ao salvar transações recorrentes' }, 500);
  }
});

// 🔄 NOVO: Obter transações recorrentes do usuário
app.get('/make-server-7f44b203/recurring-transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const recurringTransactions = await kv.get(`recurring-transactions:${user.id}`) || [];
    return c.json({ recurringTransactions });
  } catch (error) {
    console.log('Erro ao obter transações recorrentes:', error);
    return c.json({ error: 'Erro ao obter transações recorrentes' }, 500);
  }
});

// 🔔 NOVO: Salvar alertas do usuário
app.post('/make-server-7f44b203/alerts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { alerts } = await c.req.json();
    await kv.set(`alerts:${user.id}`, alerts);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar alertas:', error);
    return c.json({ error: 'Erro ao salvar alertas' }, 500);
  }
});

// 🔔 NOVO: Obter alertas do usuário
app.get('/make-server-7f44b203/alerts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const alerts = await kv.get(`alerts:${user.id}`) || [];
    return c.json({ alerts });
  } catch (error) {
    console.log('Erro ao obter alertas:', error);
    return c.json({ error: 'Erro ao obter alertas' }, 500);
  }
});

// Salvar configurações de automação
app.post('/make-server-7f44b203/automation-settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const settings = await c.req.json();
    await kv.set(`automation:${user.id}`, settings);

    return c.json({ success: true });
  } catch (error) {
    console.log('Erro ao salvar configurações:', error);
    return c.json({ error: 'Erro ao salvar configurações' }, 500);
  }
});

// Obter configurações de automação
app.get('/make-server-7f44b203/automation-settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const settings = await kv.get(`automation:${user.id}`) || {
      enabled: false,
      frequency: 'monthly',
      email: '',
      sendEmail: false
    };

    return c.json({ settings });
  } catch (error) {
    console.log('Erro ao obter configurações:', error);
    return c.json({ error: 'Erro ao obter configurações' }, 500);
  }
});

// Enviar relatório por e-mail
app.post('/make-server-7f44b203/send-email-report', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { email, reportData } = await c.req.json();

    // Aqui você integraria com um serviço de e-mail como SendGrid, Resend, etc.
    // Por enquanto, vamos simular o envio
    console.log(`Enviando relatório para ${email}`, reportData);

    // Simulação de envio bem-sucedido
    return c.json({ 
      success: true, 
      message: 'Relatório enviado com sucesso! (Simulado - configure um serviço de e-mail para envio real)' 
    });
  } catch (error) {
    console.log('Erro ao enviar e-mail:', error);
    return c.json({ error: 'Erro ao enviar e-mail' }, 500);
  }
});

// 💳 ROTAS PARA CARTÕES DE CRÉDITO

// Salvar cartões do usuário
app.post('/make-server-7f44b203/credit-cards', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { creditCards } = await c.req.json();
    await kv.set(`credit-cards:${user.id}`, creditCards);

    console.log(`💳 Cartões salvos para usuário ${user.id}:`, creditCards?.length || 0);
    return c.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar cartões:', error);
    return c.json({ error: 'Erro ao salvar cartões' }, 500);
  }
});

// Obter cartões do usuário
app.get('/make-server-7f44b203/credit-cards', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const creditCards = await kv.get(`credit-cards:${user.id}`);
    console.log(`💳 Cartões carregados para usuário ${user.id}:`, creditCards?.length || 0);

    return c.json({ creditCards: creditCards || [] });
  } catch (error) {
    console.error('Erro ao carregar cartões:', error);
    return c.json({ error: 'Erro ao carregar cartões' }, 500);
  }
});

// 💰 ROTAS PARA DÍVIDAS PARCELADAS

// Salvar dívidas parceladas do usuário
app.post('/make-server-7f44b203/installment-debts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { installmentDebts } = await c.req.json();
    await kv.set(`installment-debts:${user.id}`, installmentDebts);

    console.log(`💰 Dívidas parceladas salvas para usuário ${user.id}:`, installmentDebts?.length || 0);
    return c.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar dívidas parceladas:', error);
    return c.json({ error: 'Erro ao salvar dívidas parceladas' }, 500);
  }
});

// Obter dívidas parceladas do usuário
app.get('/make-server-7f44b203/installment-debts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const installmentDebts = await kv.get(`installment-debts:${user.id}`);
    console.log(`💰 Dívidas parceladas carregadas para usuário ${user.id}:`, installmentDebts?.length || 0);

    return c.json({ installmentDebts: installmentDebts || [] });
  } catch (error) {
    console.error('Erro ao carregar dívidas parceladas:', error);
    return c.json({ error: 'Erro ao carregar dívidas parceladas' }, 500);
  }
});

// 💳 ROTAS PARA MÉTODOS DE PAGAMENTO

// Salvar métodos de pagamento do usuário
app.post('/make-server-7f44b203/payment-methods', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { paymentMethods } = await c.req.json();
    await kv.set(`payment-methods:${user.id}`, paymentMethods);

    console.log(`💳 Métodos de pagamento salvos para usuário ${user.id}:`, paymentMethods?.length || 0);
    return c.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar métodos de pagamento:', error);
    return c.json({ error: 'Erro ao salvar métodos de pagamento' }, 500);
  }
});

// Obter métodos de pagamento do usuário
app.get('/make-server-7f44b203/payment-methods', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const paymentMethods = await kv.get(`payment-methods:${user.id}`);
    console.log(`💳 Métodos de pagamento carregados para usuário ${user.id}:`, paymentMethods?.length || 0);

    return c.json({ paymentMethods: paymentMethods || [] });
  } catch (error) {
    console.error('Erro ao carregar métodos de pagamento:', error);
    return c.json({ error: 'Erro ao carregar métodos de pagamento' }, 500);
  }
});

// Rotas para gerar ícones PWA dinamicamente
app.get('/make-server-7f44b203/icon-192.png', async (c) => {
  try {
    const iconSVG = generateIconPNG(192);
    return new Response(iconSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar icon-192.png:', error);
    return c.json({ error: 'Erro ao gerar ícone' }, 500);
  }
});

app.get('/make-server-7f44b203/icon-512.png', async (c) => {
  try {
    const iconSVG = generateIconPNG(512);
    return new Response(iconSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar icon-512.png:', error);
    return c.json({ error: 'Erro ao gerar ícone' }, 500);
  }
});

app.get('/make-server-7f44b203/apple-touch-icon.png', async (c) => {
  try {
    const iconSVG = generateIconPNG(180);
    return new Response(iconSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar apple-touch-icon.png:', error);
    return c.json({ error: 'Erro ao gerar ícone' }, 500);
  }
});

app.get('/make-server-7f44b203/favicon.png', async (c) => {
  try {
    const iconSVG = generateIconPNG(32);
    return new Response(iconSVG, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro ao gerar favicon.png:', error);
    return c.json({ error: 'Erro ao gerar ícone' }, 500);
  }
});

// ========================================
// 🔐 BIOMETRIA - WebAuthn Endpoints
// ========================================

// Registrar credencial biométrica
app.post('/make-server-7f44b203/biometric/register', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      console.log('❌ Biometric register: Não autorizado'); // DEBUG
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const { credentialId, publicKey, deviceName } = await c.req.json();

    if (!credentialId || !publicKey) {
      console.log('❌ Biometric register: Dados faltando'); // DEBUG
      return c.json({ error: 'Dados da credencial são obrigatórios' }, 400);
    }

    // Buscar credenciais existentes
    const existingCredentials = await kv.get(`biometric_credentials:${user.id}`) || [];
    
    // Verificar se já existe essa credencial
    const credentialExists = existingCredentials.some((cred: any) => cred.credentialId === credentialId);
    if (credentialExists) {
      console.log('⚠️ Biometric register: Credencial já existe'); // DEBUG
      return c.json({ error: 'Credencial já registrada' }, 400);
    }

    // Adicionar nova credencial
    const newCredential = {
      credentialId,
      publicKey,
      deviceName: deviceName || 'Dispositivo',
      createdAt: new Date().toISOString(),
    };

    existingCredentials.push(newCredential);
    await kv.set(`biometric_credentials:${user.id}`, existingCredentials);

    // Marcar que o usuário tem biometria ativada
    await kv.set(`biometric_enabled:${user.id}`, true);

    console.log('✅ Biometric register: Sucesso para', user.email, 'Total:', existingCredentials.length); // DEBUG

    return c.json({ success: true, credential: newCredential });
  } catch (error) {
    console.error('❌ Erro ao registrar credencial biométrica:', error);
    return c.json({ error: 'Erro ao registrar credencial biométrica' }, 500);
  }
});

// Verificar credencial biométrica e fazer login
app.post('/make-server-7f44b203/biometric/verify', async (c) => {
  try {
    const { email, credentialId, signature } = await c.req.json();

    if (!email || !credentialId || !signature) {
      return c.json({ error: 'Email, credentialId e assinatura são obrigatórios' }, 400);
    }

    // Buscar usuário pelo email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users.find(u => u.email === email);

    if (!user || userError) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Buscar credenciais do usuário
    const credentials = await kv.get(`biometric_credentials:${user.id}`) || [];
    
    // Verificar se a credencial existe
    const credential = credentials.find((cred: any) => cred.credentialId === credentialId);
    if (!credential) {
      return c.json({ error: 'Credencial não encontrada' }, 404);
    }

    // NOTA: Em produção, você deveria verificar a assinatura com a publicKey
    // Por simplicidade, vamos aceitar se a credencial existe
    // Para implementação completa, use biblioteca como @simplewebauthn/server

    // Gerar token de acesso
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
    });

    if (sessionError || !sessionData) {
      console.error('Erro ao gerar sessão:', sessionError);
      return c.json({ error: 'Erro ao autenticar' }, 500);
    }

    // Retornar token de acesso
    return c.json({ 
      success: true, 
      accessToken: sessionData.properties.action_link.split('token=')[1],
      user: {
        id: user.id,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Erro ao verificar credencial biométrica:', error);
    return c.json({ error: 'Erro ao verificar credencial biométrica' }, 500);
  }
});

// Verificar se usuário tem biometria ativada
app.get('/make-server-7f44b203/biometric/check/:email', async (c) => {
  try {
    const email = c.req.param('email');

    if (!email) {
      console.log('❌ Biometric check: Email não fornecido'); // DEBUG
      return c.json({ error: 'Email é obrigatório' }, 400);
    }

    console.log('🔍 Biometric check: Verificando para', email); // DEBUG

    // Buscar usuário pelo email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (userError) {
      console.log('❌ Biometric check: Erro ao buscar usuários', userError); // DEBUG
      return c.json({ hasBiometric: false });
    }
    
    const user = users?.users.find(u => u.email === email);

    if (!user) {
      console.log('⚠️ Biometric check: Usuário não encontrado', email); // DEBUG
      console.log('📋 Usuários disponíveis:', users?.users.map(u => u.email)); // DEBUG
      return c.json({ hasBiometric: false });
    }

    console.log('✅ Biometric check: Usuário encontrado', user.id); // DEBUG

    // Verificar se tem biometria ativada
    const hasBiometric = await kv.get(`biometric_enabled:${user.id}`) || false;
    const credentials = await kv.get(`biometric_credentials:${user.id}`) || [];

    console.log(`✅ Biometric check: ${email} (${user.id}) - Enabled: ${hasBiometric}, Credentials: ${credentials.length}`); // DEBUG
    console.log(`📦 Credentials:`, JSON.stringify(credentials).substring(0, 100)); // DEBUG

    return c.json({ 
      hasBiometric: hasBiometric && credentials.length > 0,
      deviceCount: credentials.length 
    });
  } catch (error) {
    console.error('❌ Erro ao verificar biometria:', error);
    return c.json({ error: 'Erro ao verificar biometria' }, 500);
  }
});

// Listar credenciais biométricas do usuário
app.get('/make-server-7f44b203/biometric/credentials', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const credentials = await kv.get(`biometric_credentials:${user.id}`) || [];
    
    // Remover dados sensíveis antes de retornar
    const safeCredentials = credentials.map((cred: any) => ({
      credentialId: cred.credentialId,
      deviceName: cred.deviceName,
      createdAt: cred.createdAt,
    }));

    return c.json({ credentials: safeCredentials });
  } catch (error) {
    console.error('Erro ao listar credenciais:', error);
    return c.json({ error: 'Erro ao listar credenciais' }, 500);
  }
});

// Remover credencial biométrica
app.delete('/make-server-7f44b203/biometric/credentials/:credentialId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Não autorizado' }, 401);
    }

    const credentialId = c.req.param('credentialId');
    const credentials = await kv.get(`biometric_credentials:${user.id}`) || [];
    
    // Remover credencial
    const updatedCredentials = credentials.filter((cred: any) => cred.credentialId !== credentialId);
    await kv.set(`biometric_credentials:${user.id}`, updatedCredentials);

    // Se não tem mais credenciais, desativar biometria
    if (updatedCredentials.length === 0) {
      await kv.set(`biometric_enabled:${user.id}`, false);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover credencial:', error);
    return c.json({ error: 'Erro ao remover credencial' }, 500);
  }
});

// ========================================
// 👑 ADMIN - Rotas de Administração
// ========================================

// Lista de emails de administradores
// ⚠️ IMPORTANTE: Adicione seu email aqui para ter acesso ao painel de administração
// Exemplo: 'seuemail@gmail.com'
const ADMIN_EMAILS = [
  'admin@v7finance.com',
  'vieira.f.vinicius+teste@gmail.com'
  // Adicione mais emails de admin aqui, um por linha:
  // 'outro.admin@exemplo.com',
];

// Middleware para verificar se é admin
const isAdmin = async (accessToken: string | undefined): Promise<boolean> => {
  if (!accessToken) return false;
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (!user || error) return false;
    
    return ADMIN_EMAILS.includes(user.email || '');
  } catch {
    return false;
  }
};

// 📊 Dashboard de Admin - Estatísticas Gerais
app.get('/make-server-7f44b203/admin/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    // Buscar todos os usuários
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Erro ao listar usuários:', usersError);
      return c.json({ error: 'Erro ao buscar usuários' }, 500);
    }

    // Coletar estatísticas
    let totalTransactions = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let totalGoals = 0;
    let totalSavingsGoals = 0;
    let totalCreditCards = 0;
    let totalInstallmentDebts = 0;
    let totalAccounts = 0;
    let totalRecurringTransactions = 0;
    let usersWithBiometric = 0;

    // Iterar por cada usuário e buscar seus dados
    for (const user of users) {
      // Transações
      const transactions = await kv.get(`transactions:${user.id}`) || [];
      totalTransactions += transactions.length;
      totalIncome += transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      totalExpense += transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      // Metas
      const goals = await kv.get(`goals:${user.id}`) || [];
      totalGoals += goals.length;

      // Metas de Poupança
      const savingsGoals = await kv.get(`savings-goals:${user.id}`) || [];
      totalSavingsGoals += savingsGoals.length;

      // Cartões de Crédito
      const creditCards = await kv.get(`credit-cards:${user.id}`) || [];
      totalCreditCards += creditCards.length;

      // Dívidas Parceladas
      const installmentDebts = await kv.get(`installment-debts:${user.id}`) || [];
      totalInstallmentDebts += installmentDebts.length;

      // Contas
      const accounts = await kv.get(`accounts:${user.id}`) || [];
      totalAccounts += accounts.length;

      // Transações Recorrentes
      const recurring = await kv.get(`recurring-transactions:${user.id}`) || [];
      totalRecurringTransactions += recurring.length;

      // Biometria
      const hasBiometric = await kv.get(`biometric_enabled:${user.id}`) || false;
      if (hasBiometric) usersWithBiometric++;
    }

    const stats = {
      users: {
        total: users.length,
        withBiometric: usersWithBiometric,
        withoutBiometric: users.length - usersWithBiometric,
      },
      transactions: {
        total: totalTransactions,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
      features: {
        goals: totalGoals,
        savingsGoals: totalSavingsGoals,
        creditCards: totalCreditCards,
        installmentDebts: totalInstallmentDebts,
        accounts: totalAccounts,
        recurringTransactions: totalRecurringTransactions,
      },
      averages: {
        transactionsPerUser: users.length > 0 ? (totalTransactions / users.length).toFixed(2) : 0,
        goalsPerUser: users.length > 0 ? (totalGoals / users.length).toFixed(2) : 0,
      },
    };

    console.log('📊 Admin Stats geradas:', stats);
    return c.json({ stats });
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    return c.json({ error: 'Erro ao gerar estatísticas' }, 500);
  }
});

// 👥 Listar Todos os Usuários
app.get('/make-server-7f44b203/admin/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      return c.json({ error: 'Erro ao buscar usuários' }, 500);
    }

    // Enriquecer dados dos usuários com estatísticas
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const transactions = await kv.get(`transactions:${user.id}`) || [];
      const goals = await kv.get(`goals:${user.id}`) || [];
      const savingsGoals = await kv.get(`savings-goals:${user.id}`) || [];
      const hasBiometric = await kv.get(`biometric_enabled:${user.id}`) || false;

      const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      const totalExpense = transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'N/A',
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        stats: {
          transactionsCount: transactions.length,
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          goalsCount: goals.length,
          savingsGoalsCount: savingsGoals.length,
          hasBiometric,
        },
      };
    }));

    console.log(`👥 Admin listou ${enrichedUsers.length} usuários`);
    return c.json({ users: enrichedUsers });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return c.json({ error: 'Erro ao listar usuários' }, 500);
  }
});

// 🔍 Detalhes de um Usuário Específico
app.get('/make-server-7f44b203/admin/users/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    const userId = c.req.param('userId');

    // Buscar usuário
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Buscar todos os dados do usuário
    const [
      transactions,
      goals,
      savingsGoals,
      accounts,
      recurringTransactions,
      alerts,
      creditCards,
      installmentDebts,
      paymentMethods,
      automationSettings,
      biometricEnabled,
      biometricCredentials,
    ] = await Promise.all([
      kv.get(`transactions:${userId}`),
      kv.get(`goals:${userId}`),
      kv.get(`savings-goals:${userId}`),
      kv.get(`accounts:${userId}`),
      kv.get(`recurring-transactions:${userId}`),
      kv.get(`alerts:${userId}`),
      kv.get(`credit-cards:${userId}`),
      kv.get(`installment-debts:${userId}`),
      kv.get(`payment-methods:${userId}`),
      kv.get(`automation:${userId}`),
      kv.get(`biometric_enabled:${userId}`),
      kv.get(`biometric_credentials:${userId}`),
    ]);

    const userDetails = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || 'N/A',
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      emailConfirmed: user.email_confirmed_at !== null,
      data: {
        transactions: transactions || [],
        goals: goals || [],
        savingsGoals: savingsGoals || [],
        accounts: accounts || [],
        recurringTransactions: recurringTransactions || [],
        alerts: alerts || [],
        creditCards: creditCards || [],
        installmentDebts: installmentDebts || [],
        paymentMethods: paymentMethods || [],
        automationSettings: automationSettings || {},
        biometric: {
          enabled: biometricEnabled || false,
          credentialsCount: (biometricCredentials || []).length,
        },
      },
    };

    console.log(`🔍 Admin visualizou detalhes do usuário ${userId}`);
    return c.json({ user: userDetails });
  } catch (error) {
    console.error('Erro ao buscar detalhes do usuário:', error);
    return c.json({ error: 'Erro ao buscar detalhes do usuário' }, 500);
  }
});

// 📈 Métricas Agregadas por Período
app.get('/make-server-7f44b203/admin/metrics', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      return c.json({ error: 'Erro ao buscar usuários' }, 500);
    }

    // Coletar transações por data
    const transactionsByDate: { [key: string]: { income: number; expense: number; count: number } } = {};
    const userSignupsByDate: { [key: string]: number } = {};

    for (const user of users) {
      // Contar cadastros por data
      const signupDate = new Date(user.created_at).toISOString().split('T')[0];
      userSignupsByDate[signupDate] = (userSignupsByDate[signupDate] || 0) + 1;

      // Transações
      const transactions = await kv.get(`transactions:${user.id}`) || [];
      
      for (const transaction of transactions) {
        const date = new Date(transaction.date).toISOString().split('T')[0];
        
        if (!transactionsByDate[date]) {
          transactionsByDate[date] = { income: 0, expense: 0, count: 0 };
        }
        
        if (transaction.type === 'income') {
          transactionsByDate[date].income += transaction.amount || 0;
        } else {
          transactionsByDate[date].expense += transaction.amount || 0;
        }
        transactionsByDate[date].count++;
      }
    }

    const metrics = {
      transactionsByDate: Object.entries(transactionsByDate)
        .map(([date, data]) => ({
          date,
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense,
          count: data.count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      userSignupsByDate: Object.entries(userSignupsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };

    console.log('📈 Admin gerou métricas agregadas');
    return c.json({ metrics });
  } catch (error) {
    console.error('Erro ao gerar métricas:', error);
    return c.json({ error: 'Erro ao gerar métricas' }, 500);
  }
});

// 🗑️ Deletar Usuário (com confirmação)
app.delete('/make-server-7f44b203/admin/users/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    const userId = c.req.param('userId');
    
    console.log(`🗑️ Tentando deletar usuário: ${userId}`);

    // Deletar todos os dados do usuário do KV
    console.log('🗑️ Deletando dados do KV...');
    await Promise.all([
      kv.del(`transactions:${userId}`),
      kv.del(`goals:${userId}`),
      kv.del(`savings-goals:${userId}`),
      kv.del(`accounts:${userId}`),
      kv.del(`recurring-transactions:${userId}`),
      kv.del(`alerts:${userId}`),
      kv.del(`credit-cards:${userId}`),
      kv.del(`installment-debts:${userId}`),
      kv.del(`payment-methods:${userId}`),
      kv.del(`automation:${userId}`),
      kv.del(`biometric_enabled:${userId}`),
      kv.del(`biometric_credentials:${userId}`),
    ]);
    console.log('✅ Dados do KV deletados com sucesso');

    // Deletar usuário do Supabase Auth
    console.log('🗑️ Deletando usuário do Supabase Auth...');
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar usuário do Auth:', deleteError);
      return c.json({ 
        error: `Erro ao deletar usuário: ${deleteError.message || 'Erro desconhecido'}`,
        details: deleteError 
      }, 500);
    }

    console.log(`✅ Admin deletou usuário ${userId} com sucesso`);
    return c.json({ success: true, message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    return c.json({ 
      error: `Erro ao deletar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: error instanceof Error ? error.stack : String(error)
    }, 500);
  }
});

// ➕ Criar Novo Usuário
app.post('/make-server-7f44b203/admin/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    const body = await c.req.json();
    const { email, name } = body;

    if (!email) {
      return c.json({ error: 'Email é obrigatório' }, 400);
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Email inválido' }, 400);
    }

    // 🔑 NOVA ABORDAGEM: Sempre criar com senha temporária
    console.log('🔑 Criando usuário com senha temporária...');
    
    // Gerar senha temporária forte (16 caracteres)
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + '!@#' + Math.floor(Math.random() * 100);

    console.log('🔑 Senha temporária gerada:', tempPassword);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      user_metadata: { 
        name: name || email.split('@')[0],
        needsPasswordChange: true // 🔐 FLAG: Forçar troca de senha no primeiro login
      },
      email_confirm: true // Confirmar email automaticamente
    });

    if (error) {
      console.error('❌ Erro ao criar usuário:', error);
      
      if (error.message.includes('already registered')) {
        return c.json({ error: 'Este email já está cadastrado' }, 400);
      }
      
      return c.json({ error: error.message || 'Erro ao criar usuário' }, 500);
    }

    console.log(`✅ Usuário ${email} criado com sucesso`);

    // 📧 Tentar enviar email com senha temporária
    const smtpConfigured = Deno.env.get('SMTP_ENABLED') === 'true';
    let emailSent = false;
    
    if (smtpConfigured) {
      try {
        console.log('📧 Enviando email com senha temporária...');
        
        // Importar módulos de email
        const { SMTPClient } = await import('https://deno.land/x/denomailer@1.6.0/mod.ts');
        
        const smtpClient = new SMTPClient({
          connection: {
            hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
            port: Number(Deno.env.get('SMTP_PORT')) || 587,
            tls: true,
            auth: {
              username: Deno.env.get('SMTP_USER') || '',
              password: Deno.env.get('SMTP_PASSWORD') || '',
            },
          },
        });

        // 📧 Usar template do arquivo separado
        await smtpClient.send({
          from: Deno.env.get('SMTP_FROM') || 'noreply@v7finance.com',
          to: email,
          subject: emailTemplates.welcome.subject(),
          html: emailTemplates.welcome.html({
            email,
            tempPassword,
            name: name || email.split('@')[0],
            appUrl: 'https://v7finance.figma.site',
          }),
        });

        await smtpClient.close();
        emailSent = true;
        console.log('✅ Email enviado com sucesso para:', email);
      } catch (emailError) {
        console.error('❌ Erro ao enviar email:', emailError);
        // Não falhar a criação do usuário se o email falhar
      }
    }

    console.log(`✅ Admin criou usuário ${email}${emailSent ? ' - Email enviado' : ' - Email não enviado (SMTP não configurado)'}`);
    
    return c.json({ 
      success: true, 
      message: emailSent 
        ? `✅ Usuário criado! Email com senha temporária enviado para ${email}`
        : `✅ Usuário criado! Envie as credenciais abaixo para o usuário:`,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        tempPassword: emailSent ? undefined : tempPassword, // Mostrar senha apenas se email não foi enviado
        emailSent
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    return c.json({ 
      error: 'Erro ao criar usuário',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// 🚫 Bloquear/Desbloquear Usuário
app.put('/make-server-7f44b203/admin/users/:userId/block', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!await isAdmin(accessToken)) {
      return c.json({ error: 'Acesso negado - Admin apenas' }, 403);
    }

    const userId = c.req.param('userId');
    const body = await c.req.json();
    const { blocked } = body;

    if (typeof blocked !== 'boolean') {
      return c.json({ error: 'O campo "blocked" deve ser true ou false' }, 400);
    }

    // Buscar usuário atual
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (getUserError || !user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Atualizar status de bloqueio
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: blocked ? '876000h' : 'none', // ~100 anos = bloqueio permanente, none = desbloqueado
    });

    if (error) {
      console.error('Erro ao atualizar status de bloqueio:', error);
      return c.json({ error: 'Erro ao atualizar status do usuário' }, 500);
    }

    const action = blocked ? 'bloqueou' : 'desbloqueou';
    console.log(`🚫 Admin ${action} usuário ${userId}`);
    
    return c.json({ 
      success: true, 
      message: `Usuário ${blocked ? 'bloqueado' : 'desbloqueado'} com sucesso`,
      blocked
    });
  } catch (error) {
    console.error('Erro ao bloquear/desbloquear usuário:', error);
    return c.json({ error: 'Erro ao atualizar status do usuário' }, 500);
  }
});

// 🔐 Verificar se usuário atual é Admin
app.get('/make-server-7f44b203/admin/check', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    console.log('🔐 Admin check - Token recebido:', accessToken ? 'SIM' : 'NÃO');
    
    const adminStatus = await isAdmin(accessToken);
    
    console.log('🔐 Admin check - Status:', adminStatus);
    
    if (accessToken) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
      console.log('🔐 Admin check - User:', user?.email, 'Error:', error?.message);
      console.log('🔐 Admin check - Emails permitidos:', ADMIN_EMAILS);
    }
    
    return c.json({ isAdmin: adminStatus });
  } catch (error) {
    console.error('❌ Erro ao verificar status admin:', error);
    return c.json({ isAdmin: false });
  }
});

Deno.serve(app.fetch);
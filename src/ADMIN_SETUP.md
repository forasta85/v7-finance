# 🔧 Guia de Configuração para Administrador - V7 Finance WhatsApp

Este guia é **APENAS para o administrador do aplicativo**. Os usuários finais NÃO precisam fazer nada além de vincular o número.

---

## 🎯 Visão Geral

O V7 Finance agora possui um **Bot WhatsApp Inteligente** que permite aos usuários consultar suas informações financeiras via mensagens de texto.

**Como funciona:**
1. **Você (admin)** configura as credenciais da API do WhatsApp UMA VEZ
2. **Usuários finais** apenas vinculam seus números no app
3. **Sistema funciona automaticamente** para todos os usuários

---

## 🚀 Configuração Rápida (5 minutos)

### Opção 1: Twilio (Recomendado - Mais Fácil)

#### Passo 1: Criar Conta Twilio
1. Acesse: https://www.twilio.com/try-twilio
2. Crie uma conta gratuita (você ganhará $15 de crédito)
3. Verifique seu email

#### Passo 2: Ativar WhatsApp Sandbox
1. No Console Twilio, vá em: **Messaging → Try it out → Send a WhatsApp message**
2. Você verá:
   - Número sandbox (ex: `+1 415 523 8886`)
   - Código de join (ex: `join orange-tiger`)
3. **IMPORTANTE:** Anote o número sandbox

#### Passo 3: Obter Credenciais
No Dashboard do Twilio, copie:
- **Account SID** (ex: `ACxxxxxxxxxxxxxxxxxxxxx`)
- **Auth Token** (clique em "Show" para ver)
- **WhatsApp Number** (número sandbox, ex: `+14155238886`)

#### Passo 4: Configurar Variáveis de Ambiente no Supabase
1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em: **Settings → Edge Functions → Secrets**
3. Adicione as seguintes variáveis:

```
TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN = seu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER = +14155238886
```

4. Clique em **"Add Secret"** para cada uma

#### Passo 5: Configurar Webhook no Twilio
1. No Console Twilio, vá em: **Messaging → Settings → WhatsApp Sandbox Settings**
2. No campo **"WHEN A MESSAGE COMES IN"**, cole:
```
https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook
```
3. ⚠️ **Substitua `SEU_PROJECT_ID`** pelo ID do seu projeto Supabase
4. Método HTTP: **POST**
5. Clique em **Save**

#### Passo 6: Reiniciar Edge Function
1. No Supabase, vá em **Edge Functions**
2. Encontre `make-server-7f44b203`
3. Clique em **Restart**

### ✅ Pronto!

Agora **TODOS os usuários** do V7 Finance podem:
1. Ir em **Configurações → Assistente WhatsApp**
2. Vincular seus números
3. Enviar comandos e receber respostas automaticamente

---

## 📱 Como os Usuários Usam (Após Você Configurar)

Os usuários precisam fazer apenas 2 coisas:

### 1. Conectar ao Sandbox (primeira vez)
- Adicionar o número sandbox nos contatos
- Enviar a mensagem: `join orange-tiger` (ou o código que aparece no Twilio)

### 2. Vincular no App
- Ir em **Configurações → Assistente WhatsApp**
- Digitar o número no formato: `+5511999999999`
- Clicar em **Vincular**

### 3. Usar Comandos
Enviar qualquer comando para o número sandbox:
- `saldo` - Ver saldo atual
- `relatório` - Relatório completo
- `metas` - Ver metas de poupança
- `transações` - Últimas transações
- `ajuda` - Lista de comandos

---

## 🔧 Opção 2: Meta WhatsApp Business API (Mais Complexo)

Se preferir usar a API oficial da Meta:

### Passo 1: Criar Aplicativo
1. Acesse: https://developers.facebook.com/
2. Crie um novo aplicativo tipo **"Business"**

### Passo 2: Adicionar WhatsApp
1. No painel do app, adicione o produto **"WhatsApp"**
2. Configure o número de teste

### Passo 3: Obter Credenciais
Copie:
- **Access Token** (temporário ou permanente)
- **Phone Number ID**

### Passo 4: Configurar no Supabase
Adicione as variáveis de ambiente:
```
WHATSAPP_ACCESS_TOKEN = seu_access_token
WHATSAPP_PHONE_NUMBER_ID = seu_phone_number_id
WHATSAPP_VERIFY_TOKEN = V7_FINANCE_2024
```

### Passo 5: Configurar Webhook
1. No Meta for Developers, vá em **WhatsApp → Configuration**
2. Configure Webhook:
   - **URL**: `https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook-meta`
   - **Verify Token**: `V7_FINANCE_2024`
   - **Fields**: Marque `messages`
3. Clique em **Verify and Save**

### Passo 6: Reiniciar Edge Function
Mesmo processo do Twilio

---

## 💰 Custos

### Twilio (Recomendado)
- ✅ **$15 de crédito gratuito** ao criar conta
- ✅ **Sandbox gratuito** para desenvolvimento/testes
- 💰 **Produção**: ~$0.005 por mensagem
- 📊 **Estimativa**: 3000 mensagens com crédito inicial

### Meta WhatsApp Business
- ✅ **1.000 conversas gratuitas** por mês
- 💰 **Após limite**: varia por região
- 📊 **Ideal para**: Volume baixo/médio

---

## 🔒 Segurança

✅ **As credenciais ficam APENAS no Supabase** (ambiente seguro)  
✅ **Usuários NÃO têm acesso** às credenciais  
✅ **Cada usuário vê APENAS seus dados**  
✅ **Comunicação criptografada** end-to-end  

---

## 📊 Monitoramento

### Ver logs no Supabase:
1. Vá em **Edge Functions → Logs**
2. Procure por: `make-server-7f44b203`
3. Você verá todas as interações do bot

### Estatísticas no Twilio:
1. Dashboard do Twilio → **Monitor → Logs**
2. Veja mensagens enviadas/recebidas
3. Acompanhe uso de créditos

---

## ❓ Troubleshooting

### Bot não responde?
1. **Verifique logs no Supabase** (Edge Functions → Logs)
2. **Confirme variáveis de ambiente** estão corretas
3. **Teste webhook manualmente** com Postman/Insomnia
4. **Reinicie Edge Function**

### Usuário não consegue vincular?
1. **Formato do número** deve ser internacional (+5511999999999)
2. **Verificar se usuário está logado** no app

### Erro "Unauthorized" no webhook?
1. **Verificar URL do webhook** está correta
2. **Confirmar método é POST**
3. **Checar se Edge Function está ativa**

### Mensagens não chegam?
**Para Twilio:**
- Usuário precisa enviar `join [código]` primeiro
- Verificar se número sandbox está correto

**Para Meta:**
- Verificar se número está na lista de teste
- Confirmar Access Token é válido

---

## 🎉 Resultado Final

Após configurar, seus usuários terão:
- ✅ Assistente financeiro pessoal no WhatsApp
- ✅ Consultas instantâneas de saldo
- ✅ Relatórios sob demanda
- ✅ Acompanhamento de metas
- ✅ Acesso sem abrir o app

**Tudo funcionando automaticamente, 24/7!** 🚀

---

## 📞 Suporte

- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **Meta WhatsApp Docs**: https://developers.facebook.com/docs/whatsapp
- **Supabase Docs**: https://supabase.com/docs

---

## ✨ Dicas Extras

### Personalizar Mensagens
Edite `/supabase/functions/server/index.tsx` para customizar:
- Formato das respostas
- Emojis
- Texto dos comandos

### Adicionar Novos Comandos
No webhook, adicione novos blocos `if/else`:
```typescript
else if (message.includes('novo-comando')) {
  responseMsg = 'Sua resposta aqui';
}
```

### Modo Produção (Twilio)
Para sair do sandbox e usar seu próprio número:
1. Twilio Console → WhatsApp → Senders
2. Solicite aprovação do número
3. Atualizar `TWILIO_WHATSAPP_NUMBER`

---

**Configuração única, benefício para todos os usuários! 🎯**

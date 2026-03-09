# 🤖 Configuração do Bot WhatsApp - V7 Finance

## 🎯 O que é o Bot WhatsApp?

O V7 Finance agora tem um **Bot WhatsApp Inteligente** que responde comandos de texto automaticamente!

Envie mensagens como "saldo", "relatório" ou "metas" direto no WhatsApp e receba suas informações financeiras instantaneamente.

---

## 🚀 Configuração Rápida

### Passo 1: Configurar API do WhatsApp

Primeiro, configure a API do WhatsApp seguindo as instruções em **Configurações → WhatsApp Business** no app.

**Recomendado:** Use Twilio (mais fácil)

### Passo 2: Configurar Webhook (Twilio)

Para o bot funcionar, você precisa configurar o webhook do Twilio:

1. **Acesse o Console do Twilio**
   - Vá em: https://console.twilio.com/

2. **Configure o Webhook do WhatsApp**
   - Navegue para: **Messaging → Try it out → WhatsApp Sandbox Settings**
   - Ou vá em: **Messaging → Settings → WhatsApp Sandbox Settings**

3. **Configure a URL do Webhook**
   - No campo **"WHEN A MESSAGE COMES IN"**, cole a URL:
   ```
   https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook
   ```
   - ⚠️ **Substitua `SEU_PROJECT_ID`** pelo ID do seu projeto Supabase
   - Método HTTP: **POST**

4. **Salve as configurações**
   - Clique em **Save**

### Passo 3: Vincular seu Número no V7 Finance

1. Acesse **Configurações → WhatsApp Business** no V7 Finance
2. Role até a seção **"Bot WhatsApp Inteligente"**
3. Digite seu número no formato internacional: `+5511999999999`
4. Clique em **Vincular**
5. Pronto! ✅

---

## 📱 Como Usar o Bot

Após vincular seu número, basta enviar comandos de texto para o número sandbox do Twilio:

### Comandos Disponíveis:

| Comando | Descrição |
|---------|-----------|
| `relatório` | Ver relatório financeiro completo |
| `saldo` | Ver saldo atual |
| `metas` | Ver metas de poupança e progresso |
| `transações` | Ver últimas 5 transações |
| `ajuda` | Ver lista de comandos |

### Exemplos de Uso:

1. **Consultar Saldo:**
   - Você: `saldo`
   - Bot: `💵 Seu Saldo Atual: R$ 1.800,00...`

2. **Ver Relatório:**
   - Você: `relatório`
   - Bot: `📊 Relatório Financeiro - V7 Finance...`

3. **Ver Metas:**
   - Você: `metas`
   - Bot: `🎯 Suas Metas de Poupança...`

---

## 🔧 Configuração Avançada (Meta WhatsApp Business API)

Se você está usando a Meta WhatsApp Business API ao invés do Twilio:

### Passo 1: Configurar Webhook no Meta for Developers

1. Acesse: https://developers.facebook.com/
2. Vá no seu aplicativo → **WhatsApp → Configuration**
3. Na seção **Webhooks**, clique em **Edit**

### Passo 2: Adicionar URL do Webhook

1. **Callback URL:**
   ```
   https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook-meta
   ```

2. **Verify Token:**
   ```
   V7_FINANCE_2024
   ```

3. **Webhook Fields:** Selecione `messages`

4. Clique em **Verify and Save**

---

## 🎯 Exemplo de Conversa com o Bot

```
[Você] saldo

[V7 Bot] 💵 Seu Saldo Atual

R$ 1.800,00

💰 Receitas: R$ 5.000,00
💸 Despesas: R$ 3.200,00
```

```
[Você] metas

[V7 Bot] 🎯 Suas Metas de Poupança

1. Viagem para Europa
   Progresso: 45.2%
   Economizado: R$ 2.260,00
   Meta: R$ 5.000,00
   Faltam: R$ 2.740,00

2. Fundo de Emergência
   Progresso: 72.5%
   Economizado: R$ 7.250,00
   Meta: R$ 10.000,00
   Faltam: R$ 2.750,00
```

---

## 🔒 Segurança

- ✅ Apenas números vinculados podem consultar dados
- ✅ Cada usuário vê apenas suas próprias informações
- ✅ Todas as comunicações são criptografadas
- ✅ Webhook valida autenticidade das mensagens

---

## ❓ Troubleshooting

### Bot não responde?

1. **Verifique se o webhook está configurado:**
   - URL correta no Twilio/Meta
   - Método HTTP é POST
   - Edge Function está ativa no Supabase

2. **Verifique se seu número está vinculado:**
   - Vá em Configurações → WhatsApp Business
   - Confirme que seu número aparece como "Vinculado"

3. **Verifique se enviou o código join:**
   - Para Twilio Sandbox, você precisa enviar `join [código]` primeiro
   - Só depois pode usar os comandos

### Comando não reconhecido?

- Envie `ajuda` para ver todos os comandos
- Os comandos não diferenciam maiúsculas/minúsculas
- Pode escrever com ou sem acento (ex: "relatorio" ou "relatório")

### Erro ao vincular número?

- Use formato internacional: `+5511999999999`
- Não use parênteses, traços ou espaços
- Inclua o código do país (+55 para Brasil)

---

## 🎉 Pronto!

Agora você tem um assistente financeiro pessoal no WhatsApp! 

Envie `ajuda` a qualquer momento para ver os comandos disponíveis.

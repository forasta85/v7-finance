# 📱 Guia de Configuração - WhatsApp Business API

## ✅ O que foi implementado

O V7 Finance agora suporta **envio real de relatórios financeiros via WhatsApp** usando duas opções de API:

1. **Twilio WhatsApp API** (Recomendado) - Mais fácil de configurar
2. **Meta WhatsApp Business API** - API oficial do WhatsApp

---

## 🚀 Opção 1: Configuração com Twilio (Recomendado)

### Passo 1: Criar Conta no Twilio
1. Acesse [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Crie uma conta gratuita (você ganhará créditos para testes)
3. Verifique seu email e faça login

### Passo 2: Ativar WhatsApp Sandbox
1. No Console do Twilio, vá em: **Messaging → Try it out → Send a WhatsApp message**
2. Você verá um número sandbox (ex: `+1 415 523 8886`) e um código (ex: `join orange-tiger`)
3. **Conecte seu WhatsApp pessoal:**
   - Abra o WhatsApp no seu celular
   - Adicione o número sandbox nos seus contatos
   - Envie a mensagem com o código (ex: `join orange-tiger`)
   - Você receberá uma confirmação de que está conectado ao sandbox

### Passo 3: Obter Credenciais
1. No Dashboard do Twilio, você verá:
   - **Account SID** (ex: `ACxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** (clique em "Show" para ver)
   - **WhatsApp Number** (o número sandbox, ex: `+14155238886`)
2. Copie esses valores

### Passo 4: Configurar no Supabase
1. Acesse seu projeto no Supabase Dashboard
2. Vá em: **Settings → Edge Functions → Secrets**
3. Adicione as seguintes variáveis de ambiente:
   ```
   TWILIO_ACCOUNT_SID = seu_account_sid_aqui
   TWILIO_AUTH_TOKEN = seu_auth_token_aqui
   TWILIO_WHATSAPP_NUMBER = +14155238886
   ```
4. Clique em "Add Secret" para cada uma

### Passo 5: Reiniciar Edge Function
1. No Supabase, vá em **Edge Functions**
2. Encontre a função `make-server-7f44b203`
3. Clique em **Restart** para aplicar as novas variáveis

### Passo 6: Testar
1. No V7 Finance, vá em **Relatórios**
2. Clique em **Enviar por WhatsApp**
3. Digite seu número com código do país (ex: `+5511999999999`)
4. Você receberá o relatório no WhatsApp!

---

## 🔧 Opção 2: Configuração com Meta WhatsApp Business API

### Passo 1: Criar Aplicativo Meta
1. Acesse [developers.facebook.com](https://developers.facebook.com/)
2. Crie um novo aplicativo do tipo "Business"
3. Dê um nome ao seu aplicativo

### Passo 2: Adicionar Produto WhatsApp
1. No painel do aplicativo, clique em **Add Product**
2. Selecione **WhatsApp** e configure
3. Siga o wizard de configuração

### Passo 3: Configurar Número de Teste
1. Na seção WhatsApp, você verá um número de teste fornecido pela Meta
2. Use este número para desenvolvimento
3. Adicione seu número pessoal à lista de números de teste

### Passo 4: Obter Credenciais
1. Na seção **WhatsApp → Configuration**, você verá:
   - **Access Token** (token temporário ou permanente)
   - **Phone Number ID** (ID do número de telefone)
2. Copie esses valores

### Passo 5: Configurar no Supabase
1. Acesse seu projeto no Supabase Dashboard
2. Vá em: **Settings → Edge Functions → Secrets**
3. Adicione as seguintes variáveis de ambiente:
   ```
   WHATSAPP_ACCESS_TOKEN = seu_access_token_aqui
   WHATSAPP_PHONE_NUMBER_ID = seu_phone_number_id_aqui
   ```
4. Clique em "Add Secret" para cada uma

### Passo 6: Reiniciar Edge Function
1. No Supabase, vá em **Edge Functions**
2. Encontre a função `make-server-7f44b203`
3. Clique em **Restart** para aplicar as novas variáveis

### Passo 7: Testar
1. No V7 Finance, vá em **Relatórios**
2. Clique em **Enviar por WhatsApp**
3. Digite seu número com código do país (ex: `+5511999999999`)
4. Você receberá o relatório no WhatsApp!

---

## 📋 Formato do Número de Telefone

O número deve estar no formato internacional:
- ✅ Correto: `+5511999999999` (Brasil)
- ✅ Correto: `+1234567890` (EUA)
- ❌ Errado: `11999999999`
- ❌ Errado: `(11) 99999-9999`

---

## 🎯 Exemplo de Mensagem Recebida

Quando você enviar um relatório, receberá algo assim no WhatsApp:

```
📊 Relatório Financeiro - V7 Finance

💰 Receitas: R$ 5.000,00
💸 Despesas: R$ 3.200,00
💵 Saldo: R$ 1.800,00

📅 Período: Últimos 30 dias
📈 Total de Transações: 45
```

---

## 🆓 Custos e Limites

### Twilio (Sandbox)
- ✅ **Gratuito** para testes
- ✅ Créditos iniciais de $15
- ⚠️ Limite de mensagens no sandbox
- 💰 Produção: ~$0.005 por mensagem

### Meta WhatsApp Business API
- ✅ **1.000 conversas gratuitas** por mês
- ✅ Ideal para pequenos volumes
- 💰 Após o limite: taxas por conversa

---

## 🔍 Troubleshooting

### Erro: "WhatsApp não configurado"
- Verifique se você adicionou as variáveis de ambiente no Supabase
- Certifique-se de ter reiniciado a Edge Function

### Erro: "Twilio API error"
- Verifique se o Account SID e Auth Token estão corretos
- Confirme que você enviou o código `join` para o sandbox

### Erro: "WhatsApp API error"
- Verifique se o Access Token é válido
- Confirme que o Phone Number ID está correto
- Certifique-se de que o número de destino está na lista de teste

### Não recebo a mensagem
- Verifique se o número está no formato internacional correto
- Para Twilio: confirme que você conectou seu WhatsApp ao sandbox
- Para Meta: confirme que o número está na lista de números de teste

---

## 📚 Documentação Oficial

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp/quickstart)
- [Meta WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)

---

## 🎉 Pronto!

Após configurar, você pode enviar relatórios financeiros diretamente para seu WhatsApp!

Para facilitar o uso:
1. Vá em **Configurações → WhatsApp Business**
2. Siga o guia interativo passo a passo
3. Teste enviando seu primeiro relatório!

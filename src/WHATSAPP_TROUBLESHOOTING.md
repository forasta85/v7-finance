# 🔧 Troubleshooting - WhatsApp V7 Finance

## ❌ Problema: WhatsApp não está funcionando

Se o bot WhatsApp não está respondendo suas mensagens, siga este guia passo a passo.

---

## ✅ Checklist de Configuração

### 1️⃣ Verificar Variáveis de Ambiente no Supabase

As credenciais DEVEM estar configuradas no Supabase:

1. **Acesse**: https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em**: Settings → Edge Functions → Secrets
4. **Verifique se TODAS as 3 variáveis existem**:

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
```

#### ⚠️ ATENÇÃO:
- Os nomes DEVEM ser EXATAMENTE iguais (maiúsculas)
- Não pode ter espaços antes ou depois
- Valores devem estar corretos (sem aspas extras)

#### Como verificar se está correto:

**TWILIO_ACCOUNT_SID**
- ✅ Deve começar com `AC`
- ✅ Deve ter 34 caracteres
- ✅ Exemplo: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**TWILIO_AUTH_TOKEN**
- ✅ Deve ter 32 caracteres
- ✅ Exemplo: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**TWILIO_WHATSAPP_NUMBER**
- ✅ Formato: `+14155238886` (Twilio Sandbox)
- ✅ Ou seu número próprio no formato `+5511999999999`
- ⚠️ DEVE incluir o `+` no início
- ⚠️ NÃO usar espaços, parênteses ou traços

---

### 2️⃣ Configurar Webhook no Twilio

O Twilio precisa saber para onde enviar as mensagens recebidas.

1. **Acesse**: https://console.twilio.com/
2. **Vá em**: Messaging → Try it out → Send a WhatsApp message
3. **Role até**: Sandbox Settings
4. **No campo "WHEN A MESSAGE COMES IN"**, cole:

```
https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook
```

⚠️ **IMPORTANTE**: Substitua `SEU_PROJECT_ID` pelo ID real do seu projeto Supabase!

**Como encontrar o Project ID:**
- URL do Supabase: `https://AQUI-É-O-ID.supabase.co`
- Exemplo: Se a URL é `https://abcd1234.supabase.co`, então use:
  ```
  https://abcd1234.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook
  ```

5. **Método HTTP**: Selecione **POST**
6. **Clique em Save**

---

### 3️⃣ Reiniciar Edge Function

Após configurar as variáveis de ambiente, você DEVE reiniciar a Edge Function:

1. **Acesse Supabase**: https://supabase.com/dashboard
2. **Vá em**: Edge Functions
3. **Encontre**: `make-server-7f44b203`
4. **Clique em**: Restart (ícone de reload/refresh)
5. **Aguarde**: 10-20 segundos

---

### 4️⃣ Conectar ao Sandbox do Twilio

Antes de usar, você precisa "se inscrever" no sandbox:

1. **Abra WhatsApp** no celular
2. **Adicione o número** `+1 415 523 8886` aos contatos
3. **Envie a mensagem**: `join orange-tiger`
4. **Aguarde confirmação** do Twilio

⚠️ **Nota**: O código pode ser diferente (ex: `join happy-dog`). Veja no console do Twilio qual é o código atual.

---

### 5️⃣ Vincular seu Número no App

1. **Abra o V7 Finance**
2. **Vá em**: Configurações → Assistente WhatsApp
3. **Digite seu número** no formato: `+5511999999999`
4. **Clique em**: Vincular
5. **Aguarde**: Confirmação de sucesso

---

## 🧪 Testar Configuração

### Teste 1: Verificar se o webhook está ativo

Abra o terminal e execute:

```bash
curl -X POST https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+5511999999999&Body=ajuda"
```

**Resultado esperado**: Status 200 OK

---

### Teste 2: Verificar logs da Edge Function

1. **Supabase Dashboard** → Edge Functions → Logs
2. **Procure por**: `make-server-7f44b203`
3. **Veja se aparecem logs** quando você envia mensagens

**O que deve aparecer:**
```
📱 Mensagem recebida do WhatsApp
De: +5511999999999, Mensagem: oi
```

---

### Teste 3: Enviar mensagem de teste

1. **Abra WhatsApp**
2. **Envie para** `+1 415 523 8886`
3. **Digite**: `ajuda`
4. **Aguarde**: Resposta em até 5 segundos

**Resposta esperada:**
```
🤖 Comandos Disponíveis

📊 relatório - Ver relatório completo
💵 saldo - Ver saldo atual
🎯 metas - Ver metas de poupança
📝 transações - Ver últimas transações
❓ ajuda - Ver esta mensagem

Basta enviar o comando por WhatsApp!
```

---

## 🐛 Erros Comuns e Soluções

### Erro: "Não autorizado" / "Unauthorized"

**Causa**: Credenciais do Twilio incorretas

**Solução**:
1. Verifique se TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN estão corretos
2. No Twilio, vá em: Account → Account Info
3. Copie novamente Account SID e Auth Token
4. Cole no Supabase (Settings → Edge Functions → Secrets)
5. Reinicie a Edge Function

---

### Erro: Bot não responde

**Possíveis causas**:

1. **Webhook não configurado**
   - Vá no Twilio → Sandbox Settings
   - Configure o webhook corretamente
   - Método deve ser POST

2. **Número não vinculado**
   - Abra o app → Configurações → WhatsApp
   - Verifique se seu número está vinculado
   - Se não, vincule novamente

3. **Não conectou ao sandbox**
   - Envie `join orange-tiger` para o número Twilio
   - Aguarde confirmação
   - Tente enviar comando novamente

4. **Edge Function com erro**
   - Veja os logs no Supabase
   - Procure por erros em vermelho
   - Reinicie a Edge Function

---

### Erro: "WhatsApp não configurado"

**Causa**: Variáveis de ambiente não foram encontradas

**Solução**:
1. Vá em Supabase → Settings → Edge Functions → Secrets
2. Adicione as 3 variáveis:
   ```
   TWILIO_ACCOUNT_SID = ACxxxxx...
   TWILIO_AUTH_TOKEN = xxxxx...
   TWILIO_WHATSAPP_NUMBER = +14155238886
   ```
3. Clique em "Add Secret" para cada uma
4. Reinicie a Edge Function
5. Aguarde 20 segundos
6. Teste novamente

---

### Erro: "Failed to send message"

**Causa**: Número de WhatsApp não está no sandbox

**Solução**:
1. Abra WhatsApp
2. Envie `join orange-tiger` para `+1 415 523 8886`
3. Aguarde confirmação: "You are all set!"
4. Agora envie comandos normalmente

---

### Erro: Recebe mensagens mas bot não responde

**Causa**: Webhook recebe mas não consegue enviar resposta

**Solução**:
1. Verifique logs da Edge Function
2. Procure por erros tipo "Twilio API error"
3. Verifique se TWILIO_WHATSAPP_NUMBER está correto
4. Deve incluir `+` no início
5. Exemplo correto: `+14155238886`
6. Exemplo ERRADO: `14155238886` (sem +)

---

## 🔍 Como Ver os Logs

### Logs da Edge Function (Supabase):

1. Dashboard → Edge Functions → Logs
2. Filtrar por: `make-server-7f44b203`
3. Ver últimos logs em tempo real

**O que procurar:**
- ✅ `📱 Mensagem recebida do WhatsApp` - Webhook funcionando
- ✅ `De: +5511..., Mensagem: saldo` - Processando comando
- ✅ `✅ Relatório enviado via Twilio` - Resposta enviada
- ❌ `Erro Twilio:` - Problema com API Twilio
- ❌ `Authorization error` - Credenciais inválidas

### Logs do Twilio:

1. Console Twilio → Monitor → Logs → Messaging
2. Ver últimas mensagens enviadas/recebidas
3. Status deve ser "delivered"

---

## 📱 Fluxo Completo de Teste

Siga este roteiro para testar tudo:

```
┌─────────────────────────────────────────┐
│ 1. Configurar variáveis no Supabase     │
│    ✓ TWILIO_ACCOUNT_SID                 │
│    ✓ TWILIO_AUTH_TOKEN                  │
│    ✓ TWILIO_WHATSAPP_NUMBER             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. Configurar webhook no Twilio         │
│    URL: https://PROJECT.supabase.co/... │
│    Método: POST                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. Reiniciar Edge Function              │
│    Supabase → Edge Functions → Restart  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. Conectar ao Sandbox                  │
│    WhatsApp: join orange-tiger          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 5. Vincular número no app               │
│    Configurações → WhatsApp → Vincular  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 6. Testar comando                       │
│    WhatsApp: saldo                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 7. ✅ Receber resposta                  │
│    Bot: 💵 Seu Saldo Atual: R$ ...      │
└─────────────────────────────────────────┘
```

---

## 🆘 Ainda não funciona?

Se depois de seguir TODOS os passos ainda não funcionar:

### 1. Copie as informações:
- Project ID do Supabase
- Últimos logs da Edge Function
- Screenshot das variáveis de ambiente
- Screenshot do webhook configurado no Twilio

### 2. Verifique:
- ✅ As 3 variáveis estão configuradas?
- ✅ Webhook está configurado com POST?
- ✅ Edge Function foi reiniciada?
- ✅ Enviou "join orange-tiger"?
- ✅ Número está vinculado no app?

### 3. Teste manualmente:

Execute no terminal:

```bash
# Testar webhook
curl -X POST https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+5511999999999&Body=ajuda"

# Deve retornar: OK
```

Se retornar erro, copie a mensagem de erro completa.

---

## ✅ Checklist Final

Antes de reportar que não funciona, confirme:

- [ ] TWILIO_ACCOUNT_SID começa com "AC" e tem 34 caracteres
- [ ] TWILIO_AUTH_TOKEN tem 32 caracteres
- [ ] TWILIO_WHATSAPP_NUMBER tem "+" no início (+14155238886)
- [ ] Webhook configurado no Twilio com método POST
- [ ] URL do webhook tem o Project ID correto
- [ ] Edge Function foi reiniciada após configurar variáveis
- [ ] Enviou "join orange-tiger" no WhatsApp
- [ ] Recebeu confirmação do Twilio "You are all set!"
- [ ] Número está vinculado no app (Configurações → WhatsApp)
- [ ] Esperou pelo menos 10 segundos após reiniciar Edge Function

---

**Se tudo acima estiver ✅ e ainda não funcionar, verifique os logs da Edge Function para ver o erro específico!**

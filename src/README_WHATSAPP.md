# 🤖 Assistente WhatsApp V7 Finance - Documentação Completa

## 📋 Visão Geral

O V7 Finance agora possui um **Assistente WhatsApp Inteligente** que permite aos usuários consultar informações financeiras através de comandos de texto simples.

### ✨ Funcionamento:

```
👨‍💼 Administrador                     👥 Usuários Finais
     |                                      |
     |-- Configura API (1x)                |-- Vinculam número
     |-- Define webhook                    |-- Enviam comandos
     |                                      |-- Recebem respostas
     └--> Sistema automático <--------------┘
```

---

## 📚 Documentação

### Para Administradores
📘 **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Configuração única do sistema
- Como configurar Twilio ou Meta WhatsApp API
- Variáveis de ambiente
- Configuração de webhooks
- Custos e limites

### Para Usuários Finais
📗 **[WHATSAPP_USUARIO_FINAL.md](./WHATSAPP_USUARIO_FINAL.md)** - Guia de uso simples
- Como vincular número
- Comandos disponíveis
- Exemplos práticos
- Troubleshooting

### Documentação Técnica Original
📕 **[WHATSAPP_CONFIG.md](./WHATSAPP_CONFIG.md)** - Detalhes técnicos completos
📙 **[WHATSAPP_BOT_SETUP.md](./WHATSAPP_BOT_SETUP.md)** - Setup detalhado do bot

---

## 🚀 Quick Start

### Para Administradores (5 minutos)

```bash
# 1. Criar conta Twilio (grátis)
https://www.twilio.com/try-twilio

# 2. Obter credenciais
Account SID: ACxxxxxxxxxxxxx
Auth Token: xxxxxxxxxxxxxxxxx
WhatsApp Number: +14155238886

# 3. Configurar no Supabase
# Settings → Edge Functions → Secrets
TWILIO_ACCOUNT_SID = seu_account_sid
TWILIO_AUTH_TOKEN = seu_auth_token
TWILIO_WHATSAPP_NUMBER = +14155238886

# 4. Configurar Webhook no Twilio
URL: https://seu-project-id.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook
Método: POST

# 5. Reiniciar Edge Function no Supabase
```

✅ **Pronto!** Todos os usuários já podem usar.

### Para Usuários (2 minutos)

```bash
# 1. Conectar ao WhatsApp V7
Adicionar contato: +1 415 523 8886
Enviar mensagem: "join orange-tiger"

# 2. Vincular no App
App → Configurações → Assistente WhatsApp
Digitar: +5511999999999
Clicar: Vincular

# 3. Usar
Enviar: "saldo"
Receber: "💵 Seu Saldo Atual: R$ 1.800,00..."
```

✅ **Pronto!** Comece a usar os comandos.

---

## 🤖 Comandos Disponíveis

| Comando | Descrição | Resposta |
|---------|-----------|----------|
| `relatório` | Relatório completo | Receitas, despesas, saldo, total de transações |
| `saldo` | Saldo atual | Saldo + resumo de receitas e despesas |
| `metas` | Metas de poupança | Lista de metas com progresso |
| `transações` | Últimas 5 transações | Histórico recente |
| `ajuda` | Lista de comandos | Todos os comandos disponíveis |

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   WhatsApp      │
│   (Usuário)     │
└────────┬────────┘
         │ Mensagem
         ↓
┌─────────────────┐
│  Twilio/Meta    │
│   WhatsApp API  │
└────────┬────────┘
         │ Webhook POST
         ↓
┌─────────────────┐
│  Supabase       │
│  Edge Function  │
│  (Backend)      │
└────────┬────────┘
         │ Processa comando
         ↓
┌─────────────────┐
│   Key-Value     │
│   Database      │
│   (Dados)       │
└────────┬────────┘
         │ Retorna dados
         ↓
┌─────────────────┐
│   Resposta      │
│   formatada     │
└────────┬────────┘
         │ Envia via API
         ↓
┌─────────────────┐
│   WhatsApp      │
│   (Usuário)     │
└─────────────────┘
```

---

## 📊 Recursos Implementados

### Backend (`/supabase/functions/server/index.tsx`)
- ✅ Webhook Twilio (`/whatsapp-webhook`)
- ✅ Webhook Meta (`/whatsapp-webhook-meta`)
- ✅ Vinculação de número (`/link-whatsapp`)
- ✅ Consulta de número vinculado (`/linked-whatsapp`)
- ✅ Processamento de comandos inteligente
- ✅ Segurança por usuário
- ✅ Função auxiliar de envio de mensagens

### Frontend (`/components/WhatsAppConfig.tsx`)
- ✅ Interface de vinculação de número
- ✅ Validação de formato
- ✅ Status de vinculação
- ✅ Lista visual de comandos
- ✅ Guia de uso
- ✅ Design responsivo

### Comandos Suportados
- ✅ `relatório` - Relatório completo
- ✅ `saldo` - Consulta de saldo
- ✅ `metas` - Metas de poupança
- ✅ `transações` - Histórico recente
- ✅ `ajuda` - Lista de comandos
- ✅ Mensagem de boas-vindas para novos usuários

---

## 🔒 Segurança

### Nível de Aplicação
- ✅ Vinculação número → usuário no banco de dados
- ✅ Cada usuário acessa apenas seus próprios dados
- ✅ Validação de autenticação em todas as requisições
- ✅ Credenciais API protegidas em variáveis de ambiente

### Nível de Comunicação
- ✅ Webhooks validados por Twilio/Meta
- ✅ HTTPS obrigatório
- ✅ Edge Functions isoladas no Supabase
- ✅ Logs completos para auditoria

---

## 💰 Custos

### Twilio (Recomendado)
- **Gratuito**: $15 de crédito inicial
- **Sandbox**: Ilimitado para desenvolvimento
- **Produção**: ~$0.005 por mensagem
- **Estimativa**: 3.000 mensagens com crédito gratuito

### Meta WhatsApp Business
- **Gratuito**: 1.000 conversas/mês
- **Após limite**: Varia por região
- **Ideal**: Volume baixo/médio

---

## 📈 Estatísticas de Uso

### Exemplo de Volume
Para 100 usuários ativos:
- **Média**: 5-10 comandos/usuário/dia
- **Total**: 500-1.000 mensagens/dia
- **Mensal**: 15.000-30.000 mensagens
- **Custo Twilio**: ~$75-150/mês

### Otimização
- Cache de respostas frequentes
- Limitar comandos por minuto
- Usar mensagens proativas apenas quando necessário

---

## 🛠️ Tecnologias

- **Backend**: Deno + Supabase Edge Functions
- **API WhatsApp**: Twilio ou Meta
- **Database**: Supabase Key-Value Store
- **Frontend**: React + TypeScript + Tailwind
- **Webhook**: HTTP POST
- **Auth**: Supabase Auth

---

## 🔄 Fluxo de Dados

### Receber Comando:
```typescript
1. Usuário envia "saldo" no WhatsApp
2. Twilio/Meta recebe mensagem
3. Twilio/Meta envia POST para webhook
4. Backend valida e identifica usuário
5. Backend busca dados do usuário
6. Backend formata resposta
7. Backend envia via API do Twilio/Meta
8. Usuário recebe resposta no WhatsApp
```

### Vincular Número:
```typescript
1. Usuário digita número no app
2. Frontend envia POST /link-whatsapp
3. Backend valida formato
4. Backend salva vinculação no KV:
   - whatsapp-phone:+5511999999999 → userId
   - user-whatsapp:userId → +5511999999999
5. Backend confirma vinculação
6. Frontend atualiza UI
```

---

## 🧪 Testes

### Testar Webhook Manualmente:
```bash
curl -X POST https://seu-project-id.supabase.co/functions/v1/make-server-7f44b203/whatsapp-webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=whatsapp:+5511999999999&Body=saldo"
```

### Testar Vinculação:
```bash
curl -X POST https://seu-project-id.supabase.co/functions/v1/make-server-7f44b203/link-whatsapp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{"phoneNumber": "+5511999999999"}'
```

---

## 📱 Exemplo de Conversa Real

```
[10:23] Usuário: bom dia

[10:23] V7 Bot: 🤔 Não entendi o comando "bom dia".

Envie *ajuda* para ver os comandos disponíveis.

[10:23] Usuário: ajuda

[10:23] V7 Bot: 🤖 Comandos Disponíveis

📊 relatório - Ver relatório completo
💵 saldo - Ver saldo atual
🎯 metas - Ver metas de poupança
📝 transações - Ver últimas transações
❓ ajuda - Ver esta mensagem

Basta enviar o comando por WhatsApp!

[10:24] Usuário: saldo

[10:24] V7 Bot: 💵 Seu Saldo Atual

R$ 2.350,00

💰 Receitas: R$ 6.500,00
💸 Despesas: R$ 4.150,00

[10:25] Usuário: metas

[10:25] V7 Bot: 🎯 Suas Metas de Poupança

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

## 🎯 Próximos Passos (Roadmap)

### Curto Prazo
- [ ] Adicionar comando de adicionar transação
- [ ] Notificações proativas (alertas de saldo baixo)
- [ ] Comando para criar metas
- [ ] Relatórios por período (semanal, mensal)

### Médio Prazo
- [ ] Gráficos em imagem
- [ ] Exportação de relatório PDF
- [ ] Lembretes personalizados
- [ ] Análise de gastos por categoria

### Longo Prazo
- [ ] IA para insights financeiros
- [ ] Previsão de gastos
- [ ] Sugestões de economia
- [ ] Integração com bancos

---

## 📞 Suporte

### Documentação Oficial
- **Twilio**: https://www.twilio.com/docs/whatsapp
- **Meta WhatsApp**: https://developers.facebook.com/docs/whatsapp
- **Supabase**: https://supabase.com/docs

### Logs e Debug
- **Supabase**: Dashboard → Edge Functions → Logs
- **Twilio**: Console → Monitor → Logs
- **Meta**: Meta for Developers → App → Logs

---

## 🎉 Status Atual

✅ **Sistema 100% funcional e pronto para uso!**

- ✅ Backend completo com todos os comandos
- ✅ Frontend com interface intuitiva
- ✅ Documentação completa
- ✅ Segurança implementada
- ✅ Pronto para produção

**Basta o administrador configurar as credenciais e os usuários já podem usar!** 🚀

---

**Desenvolvido com ❤️ para o V7 Finance**

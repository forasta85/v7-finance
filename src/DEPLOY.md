# 🚀 V7 Finance - Deploy no Vercel

Sistema completo de gestão financeira com autenticação, dashboard interativo, controle de receitas/despesas, metas de gastos, relatórios e muito mais!

---

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Projeto Supabase configurado

---

## 🎯 Passo a Passo para Deploy

### **1️⃣ Preparar o Supabase**

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings** → **API**
3. Copie as seguintes informações:
   - ✅ **Project URL** (ex: `https://xxxxx.supabase.co`)
   - ✅ **anon/public key**
   - ✅ **service_role key** (⚠️ mantenha seguro!)

4. Vá em **Edge Functions** e faça deploy da função `make-server`:
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Deploy da Edge Function
supabase functions deploy make-server
```

---

### **2️⃣ Configurar Email (SMTP) - Opcional**

Para envio de emails de senha temporária:

1. No Supabase Dashboard → **Settings** → **Secrets**
2. Adicionar as seguintes secrets:

```env
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-de-app
SMTP_FROM=noreply@v7finance.com
```

**💡 Gmail:** Gerar senha de app em https://myaccount.google.com/apppasswords

---

### **3️⃣ Deploy no Vercel**

#### **Opção A: Via GitHub (Recomendado)**

1. **Publicar no GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - V7 Finance"
git remote add origin https://github.com/SEU_USUARIO/v7-finance.git
git push -u origin main
```

2. **Conectar no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em **"Add New Project"**
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente (próximo passo)

#### **Opção B: Via Vercel CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir as instruções interativas
```

---

### **4️⃣ Configurar Variáveis de Ambiente no Vercel**

No dashboard do Vercel, vá em **Settings** → **Environment Variables** e adicione:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Chave pública (anon key) |

⚠️ **IMPORTANTE:** Não adicione a `service_role_key` aqui! Ela fica apenas no Supabase.

---

### **5️⃣ Redeploy**

Após configurar as variáveis:

```bash
# Via CLI
vercel --prod

# Ou pelo Dashboard
# Settings → Deployments → Redeploy
```

---

## ✅ Verificar se está Funcionando

1. **Acessar URL do Vercel** (ex: `https://v7-finance.vercel.app`)
2. **Testar login** com usuário existente
3. **Verificar console** do navegador (F12) para erros
4. **Testar funcionalidades:**
   - ✅ Login/Logout
   - ✅ Adicionar transação
   - ✅ Ver dashboard
   - ✅ Criar meta de gastos
   - ✅ Gerar relatório PDF

---

## 🔧 Troubleshooting

### **Erro: "Failed to fetch"**
- Verificar se as variáveis de ambiente estão corretas
- Verificar se Edge Function está deployed no Supabase

### **Erro: "Invalid API key"**
- Verificar se está usando a `anon key` correta
- Não usar `service_role_key` no frontend

### **Email não está sendo enviado**
- Verificar se SMTP está configurado no Supabase
- Verificar logs da Edge Function: `supabase functions logs make-server`

### **Erro 500 no servidor**
- Ver logs no Supabase Dashboard → Edge Functions → Logs
- Verificar se todas as secrets estão configuradas

---

## 🎨 Customização

### **Domínio Personalizado**

1. No Vercel Dashboard → **Settings** → **Domains**
2. Adicionar seu domínio (ex: `v7finance.com`)
3. Configurar DNS conforme instruções

### **Analytics**

Vercel Analytics já vem integrado! Para ativar:
1. Dashboard → **Analytics** → Enable

---

## 📦 Estrutura do Projeto

```
v7-finance/
├── src/
│   ├── components/      # Componentes React
│   ├── utils/          # Utilitários
│   └── App.tsx         # App principal
├── supabase/
│   └── functions/
│       └── server/     # Edge Functions (backend)
├── public/            # Arquivos estáticos
├── vercel.json        # Configuração Vercel
└── package.json       # Dependências
```

---

## 🔐 Segurança

- ✅ Variáveis sensíveis no Supabase Secrets
- ✅ RLS (Row Level Security) habilitado
- ✅ CORS configurado corretamente
- ✅ Auth com JWT tokens
- ✅ HTTPS em produção

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Issues:** [GitHub Issues](https://github.com/SEU_USUARIO/v7-finance/issues)

---

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando React + Supabase + Vercel**

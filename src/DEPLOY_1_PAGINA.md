# 🚀 Deploy V7 Finance - 1 Página

## ⚡ Começar em 60 Segundos

---

## 🎯 MÉTODO 1: Script Automático (MAIS FÁCIL!)

### Linux/Mac:
```bash
bash deploy-vercel.sh
```

### Windows:
```cmd
deploy-vercel.bat
```

**Pronto! O script faz tudo sozinho.** ✅

---

## 🎯 MÉTODO 2: Manual Rápido (5 minutos)

### 1️⃣ Build Local
```bash
npm install
npm run build
```

### 2️⃣ Git + GitHub
```bash
git init
git add .
git commit -m "Deploy V7"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/v7-finance.git
git push -u origin main
```

### 3️⃣ Conectar Vercel
1. https://vercel.com → **Add New Project**
2. Importar repositório GitHub
3. **NÃO CLICAR EM DEPLOY AINDA!**

### 4️⃣ Configurar Variáveis
```
VITE_SUPABASE_URL
https://oajntbrqzjbgfwyuocdi.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs

Marcar: ✅ Production ✅ Preview ✅ Development
```

### 5️⃣ Deploy!
Clicar em **Deploy** e aguardar 2-3 minutos.

---

## 🎯 MÉTODO 3: Vercel CLI

```bash
# Instalar
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Depois configurar variáveis no dashboard!**

---

## ✅ Verificar Funcionamento

1. Abrir URL do Vercel
2. Fazer login
3. Adicionar transação
4. Ver dashboard

**Funcionou? 🎉 Parabéns!**

**Não funcionou?** → Ver abaixo ⬇️

---

## 🔧 Problemas Comuns

### ❌ Tela Branca
**Causa:** Variáveis não configuradas  
**Fix:** Vercel → Settings → Environment Variables → Adicionar variáveis → Redeploy

### ❌ Failed to fetch
**Causa:** URL ou chave errada  
**Fix:** Verificar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### ❌ Build Failed
**Causa:** Erro no código  
**Fix:** `npm run build` local → Corrigir erros → Push novamente

### ⚠️ Warnings de chunk size
**Fix:** IGNORE! É normal.

---

## 📚 Guias Completos

**Primeiro deploy?** → [INICIO_DEPLOY.md](INICIO_DEPLOY.md)

**Quer detalhes?** → [DEPLOY_VERCEL_RAPIDO.md](DEPLOY_VERCEL_RAPIDO.md)

**Com problemas?** → [TROUBLESHOOTING_DEPLOY.md](TROUBLESHOOTING_DEPLOY.md)

**Dúvidas?** → [FAQ_DEPLOY.md](FAQ_DEPLOY.md)

**Todos os guias:** → [INDICE_DEPLOY.md](INDICE_DEPLOY.md)

---

## 🔗 Links Úteis

- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard/project/oajntbrqzjbgfwyuocdi
- **Novo Projeto:** https://vercel.com/new

---

## 💡 Dica Final

**Use o script automático!** Ele faz tudo:
```bash
bash deploy-vercel.sh  # Linux/Mac
deploy-vercel.bat      # Windows
```

---

**🎉 Boa sorte com seu deploy! 🎉**

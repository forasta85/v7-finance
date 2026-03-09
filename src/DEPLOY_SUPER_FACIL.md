# 🚀 Deploy SUPER FÁCIL - 3 Passos

## ⚡ Método Mais Fácil Possível

---

## PASSO 1: Criar Repositório no GitHub (30 segundos)

### 1. Abra este link:
👉 **https://github.com/new**

### 2. Preencha apenas 1 campo:
```
Repository name: v7-finance
```

### 3. Clique em:
```
[ Create repository ]
```

### 4. Copie a URL que apareceu:
```
https://github.com/SEU_USUARIO/v7-finance.git
```

**✅ PRONTO! Repositório criado.**

---

## PASSO 2: Executar Script (1 minuto)

### No terminal, na pasta do projeto:

**Windows:**
```cmd
deploy-vercel.bat
```

**Linux/Mac:**
```bash
bash deploy-vercel.sh
```

### O script vai perguntar:
```
Cole a URL do repositório GitHub:
```

### Cole a URL que você copiou:
```
https://github.com/SEU_USUARIO/v7-finance.git
```

**✅ O script faz o resto sozinho!**

---

## PASSO 3: Configurar no Vercel (2 minutos)

### O script vai abrir o Vercel automaticamente.

### 1. No Vercel, clique em:
```
[ Import ]
```

### 2. Adicione as variáveis:

**Variável 1:**
```
Nome:  VITE_SUPABASE_URL
Valor: https://oajntbrqzjbgfwyuocdi.supabase.co
Marcar: ✅ Todos os ambientes
```

**Variável 2:**
```
Nome:  VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs
Marcar: ✅ Todos os ambientes
```

### 3. Clique em:
```
[ Deploy ]
```

**✅ PRONTO! Aguarde 2-3 minutos.**

---

## 🎉 FIM! SEU APP ESTÁ NO AR!

URL: `https://v7-finance.vercel.app`

---

## 🆘 Precisa de Ajuda?

**Problema no Passo 1 (GitHub)?**
- Certifique-se de estar logado no GitHub
- Use exatamente este nome: `v7-finance`

**Problema no Passo 2 (Script)?**
- Certifique-se de estar na pasta do projeto
- Windows: Clique com botão direito → "Executar como Administrador"
- Mac/Linux: Use `bash deploy-vercel.sh`

**Problema no Passo 3 (Vercel)?**
- Certifique-se de estar logado no Vercel
- Copie e cole as variáveis SEM espaços extras
- Marque TODOS os ambientes (Production, Preview, Development)

---

## 📹 Passo a Passo Visual

### PASSO 1: GitHub
```
1. Abrir: github.com/new
2. Nome: v7-finance
3. [Create repository]
4. Copiar URL
```

### PASSO 2: Script
```
1. Abrir terminal
2. cd pasta-do-projeto
3. bash deploy-vercel.sh (ou .bat)
4. Colar URL quando pedir
5. Aguardar
```

### PASSO 3: Vercel
```
1. Vercel abre automaticamente
2. Clicar [Import]
3. Adicionar variáveis
4. [Deploy]
5. Aguardar
```

**TOTAL: ~5 minutos**

---

## 💡 Ainda Mais Fácil: Vercel CLI

Se preferir, pode pular GitHub e usar apenas Vercel CLI:

```bash
npm install -g vercel
vercel login
vercel --prod
```

Depois configurar variáveis no dashboard.

---

**🚀 Boa sorte!**

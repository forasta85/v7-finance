# 🚀 GitHub do ZERO - V7 Finance

## 📋 PASSO A PASSO COMPLETO

---

## ✅ PARTE 1: Criar Conta no GitHub

### **1. Acessar GitHub**

Vá em: https://github.com

### **2. Criar conta (se não tem)**

1. Clique em **"Sign up"**
2. Preencha:
   - **Email:** seu-email@exemplo.com
   - **Password:** Crie uma senha forte
   - **Username:** escolha um nome de usuário
3. Verifique o email
4. ✅ Conta criada!

### **3. Fazer login**

Se já tem conta, clique em **"Sign in"**.

---

## ✅ PARTE 2: Criar Repositório no GitHub

### **1. Criar novo repositório**

1. No GitHub, clique no **+** (canto superior direito)
2. Clique em **"New repository"**

### **2. Preencher informações**

```
Repository name: v7-finance
Description: Sistema completo de gestão financeira pessoal
```

### **3. Configurações importantes**

- ✅ **Public** (ou Private, como preferir)
- ❌ **NÃO marque** "Add a README file"
- ❌ **NÃO marque** "Add .gitignore"
- ❌ **NÃO marque** "Choose a license"

### **4. Criar repositório**

Clique em **"Create repository"**

### **5. Copiar URL do repositório**

Você verá uma página com comandos.

Copie a URL que aparece, será algo como:
```
https://github.com/SEU_USUARIO/v7-finance.git
```

**⚠️ COPIE ESTA URL! Você vai usar depois!**

---

## ✅ PARTE 3: Instalar Git no Windows

### **1. Verificar se Git já está instalado**

Abra o CMD (Win + R → cmd → Enter) e digite:

```cmd
git --version
```

Se aparecer algo como `git version 2.43.0`, **pule para PARTE 4**.

Se aparecer "não reconhecido", **continue aqui**.

### **2. Baixar Git**

1. Vá em: https://git-scm.com/download/win
2. Clique em **"Click here to download"**
3. Aguarde o download

### **3. Instalar Git**

1. Execute o arquivo baixado
2. Use todas as **opções padrão** (só clique "Next")
3. Clique em "Install"
4. Aguarde a instalação
5. Clique em "Finish"

### **4. Verificar instalação**

**⚠️ IMPORTANTE:** Feche e abra novamente o CMD!

Digite novamente:
```cmd
git --version
```

Deve aparecer: `git version 2.43.0.windows.1`

✅ Git instalado!

---

## ✅ PARTE 4: Configurar Git

### **1. Configurar nome**

No CMD, execute:

```cmd
git config --global user.name "Seu Nome Completo"
```

Exemplo:
```cmd
git config --global user.name "João Silva"
```

### **2. Configurar email**

```cmd
git config --global user.email "seu-email@exemplo.com"
```

**⚠️ Use o MESMO email da conta do GitHub!**

### **3. Verificar configuração**

```cmd
git config --global --list
```

Deve aparecer:
```
user.name=João Silva
user.email=joao@exemplo.com
```

✅ Git configurado!

---

## ✅ PARTE 5: Inicializar Git no Projeto

### **1. Abrir CMD na pasta do projeto**

**Forma 1 - Pelo CMD:**

```cmd
cd C:\Users\SeuNome\Documents\v7-finance
```

**Forma 2 - Pelo Windows Explorer:**

1. Abra a pasta `v7-finance`
2. Digite `cmd` na barra de endereço
3. Pressione Enter

### **2. Verificar se está na pasta certa**

Digite:
```cmd
dir
```

Você deve ver:
```
 pasta       src
 arquivo     package.json
 arquivo     vercel.json
 arquivo     README.md
```

Se não ver, você está na pasta errada!

### **3. Inicializar Git**

```cmd
git init
```

Deve aparecer:
```
Initialized empty Git repository in C:/Users/.../v7-finance/.git/
```

✅ Git inicializado!

### **4. Verificar status**

```cmd
git status
```

Deve mostrar muitos arquivos em vermelho.

---

## ✅ PARTE 6: Conectar ao GitHub

### **1. Adicionar remote**

Use a URL que você copiou na **PARTE 2**.

```cmd
git remote add origin https://github.com/SEU_USUARIO/v7-finance.git
```

**⚠️ TROQUE `SEU_USUARIO` pelo seu nome de usuário do GitHub!**

Exemplo:
```cmd
git remote add origin https://github.com/joaosilva/v7-finance.git
```

### **2. Verificar remote**

```cmd
git remote -v
```

Deve aparecer:
```
origin  https://github.com/SEU_USUARIO/v7-finance.git (fetch)
origin  https://github.com/SEU_USUARIO/v7-finance.git (push)
```

✅ Remote configurado!

---

## ✅ PARTE 7: Primeiro Commit e Push

### **1. Verificar repositórios aninhados**

Antes de adicionar arquivos, vamos limpar:

```cmd
git rm --cached desktop-tutorial 2>nul
rmdir /s /q desktop-tutorial 2>nul
```

Isso remove a pasta `desktop-tutorial` que causava erro.

### **2. Adicionar todos os arquivos**

```cmd
git add .
```

O ponto `.` significa "todos os arquivos".

### **3. Verificar arquivos adicionados**

```cmd
git status
```

Agora os arquivos devem aparecer em **verde**.

### **4. Fazer primeiro commit**

```cmd
git commit -m "Initial commit: V7 Finance - Sistema completo de gestão financeira"
```

Deve aparecer algo como:
```
[main (root-commit) a1b2c3d] Initial commit...
 150 files changed, 5000 insertions(+)
```

✅ Commit criado!

### **5. Renomear branch para main**

```cmd
git branch -M main
```

Isso garante que a branch se chama `main`.

### **6. Fazer push para GitHub**

```cmd
git push -u origin main
```

**⚠️ Primeira vez:** Pode pedir credenciais!

---

## ✅ PARTE 8: Autenticação no GitHub

### **Quando pedir credenciais:**

```
Username for 'https://github.com':
```

Digite seu **nome de usuário** do GitHub.

```
Password for 'https://joaosilva@github.com':
```

**⚠️ NÃO USE SUA SENHA DO GITHUB!**

Use um **Personal Access Token**.

---

## 🔑 CRIAR PERSONAL ACCESS TOKEN

### **1. Ir para Settings**

1. No GitHub, clique na sua **foto** (canto superior direito)
2. Clique em **"Settings"**

### **2. Ir para Developer settings**

1. Role até o final da página
2. Clique em **"Developer settings"**

### **3. Criar token**

1. Clique em **"Personal access tokens"**
2. Clique em **"Tokens (classic)"**
3. Clique em **"Generate new token"**
4. Clique em **"Generate new token (classic)"**

### **4. Configurar token**

```
Note: V7 Finance Deploy
Expiration: 90 days (ou No expiration)
```

**Marque estas permissões:**
- ✅ `repo` (todos os checkboxes)
- ✅ `workflow`

### **5. Gerar token**

1. Clique em **"Generate token"**
2. **COPIE O TOKEN!** (você só verá UMA VEZ!)

Token será algo como:
```
ghp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8
```

### **6. Usar token como senha**

Quando o Git pedir senha, **cole o token**.

---

## ✅ PARTE 9: Finalizar Push

Depois de colar o token:

```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 1.23 MiB | 2.45 MiB/s, done.
Total 150 (delta 30), reused 0 (delta 0), pack-reused 0
To https://github.com/joaosilva/v7-finance.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **PUSH REALIZADO COM SUCESSO!**

---

## ✅ PARTE 10: Verificar no GitHub

### **1. Atualizar página do repositório**

Vá em: `https://github.com/SEU_USUARIO/v7-finance`

### **2. Você deve ver:**

```
v7-finance
├── src/
├── supabase/
├── public/
├── package.json
├── vercel.json
├── README.md
└── ...
```

✅ **CÓDIGO NO GITHUB!** 🎉

---

## ✅ PARTE 11: Deploy no Vercel

Agora que o código está no GitHub, vamos fazer deploy!

### **1. Acessar Vercel**

Vá em: https://vercel.com

### **2. Fazer login**

Clique em **"Sign Up"** ou **"Login"**

Escolha: **"Continue with GitHub"**

### **3. Autorizar Vercel**

Clique em **"Authorize Vercel"**

### **4. Importar projeto**

1. Clique em **"Add New..."**
2. Clique em **"Project"**
3. Encontre **"v7-finance"** na lista
4. Clique em **"Import"**

### **5. Configurar projeto**

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **6. Adicionar variáveis de ambiente**

Clique em **"Environment Variables"**

Adicione:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-publica-aqui
```

**⚠️ Pegue esses valores no Supabase!**

### **7. Deploy!**

Clique em **"Deploy"**

Aguarde 2-3 minutos...

```
🔨 Building...
✅ Build completed
✅ Deploying...
✅ Deployment ready!

🌐 https://v7-finance.vercel.app
```

✅ **APP NO AR!** 🎉🎉🎉

---

## 🎯 COMANDOS RESUMIDOS

**Para próximos commits e pushes:**

```cmd
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

**Ou use o script:**

```cmd
fix-tudo-e-deploy.bat
```

---

## 🆘 ERROS COMUNS

### ❌ "Permission denied (publickey)"

**Solução:** Use HTTPS em vez de SSH.

```cmd
git remote set-url origin https://github.com/SEU_USUARIO/v7-finance.git
```

### ❌ "Authentication failed"

**Solução:** Crie um Personal Access Token (veja PARTE 8).

### ❌ "Remote origin already exists"

**Solução:** Remova e adicione novamente.

```cmd
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/v7-finance.git
```

### ❌ "refusing to merge unrelated histories"

**Solução:** Force o primeiro push.

```cmd
git push -u origin main --force
```

---

## ✅ CHECKLIST COMPLETO

```
□ Criei conta no GitHub
□ Criei repositório v7-finance
□ Instalei Git no Windows
□ Configurei user.name e user.email
□ Rodei git init na pasta do projeto
□ Adicionei remote do GitHub
□ Removi repositórios aninhados
□ Fiz git add .
□ Fiz primeiro commit
□ Criei Personal Access Token
□ Fiz git push -u origin main
□ Código apareceu no GitHub
□ Conectei Vercel ao GitHub
□ Adicionei variáveis de ambiente
□ Fiz deploy no Vercel
□ App está online!
```

---

## 🎉 PRONTO!

Você agora tem:
- ✅ Código versionado no GitHub
- ✅ App deployado no Vercel
- ✅ Deploy automático a cada push

**Próximos passos:**

1. Faça mudanças no código
2. Execute: `git add . && git commit -m "Descrição" && git push`
3. Vercel faz deploy automático!

---

**Última atualização:** 2026-03-09  
**Tempo total:** ~15 minutos

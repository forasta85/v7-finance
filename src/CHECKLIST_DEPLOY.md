# ✅ Checklist de Deploy - V7 Finance

## 📋 Use este checklist para garantir um deploy perfeito!

---

## ANTES DO DEPLOY

### 1. Verificar Arquivos Locais
- [ ] `package.json` existe e está correto
- [ ] `vercel.json` existe
- [ ] `vite.config.ts` existe
- [ ] Pasta `dist/` foi gerada (rodar `npm run build` para testar)

### 2. Testar Build Local
```bash
# Instalar dependências
npm install

# Build
npm run build

# Preview
npm run preview
```

- [ ] Build rodou sem ERROS (warnings são OK!)
- [ ] Preview abriu no navegador (http://localhost:4173)
- [ ] App carrega corretamente no preview
- [ ] Login funciona no preview

### 3. Preparar Credenciais
- [ ] Tenho a URL do Supabase: `https://oajntbrqzjbgfwyuocdi.supabase.co`
- [ ] Tenho a ANON_KEY do Supabase (copiar de Settings → API)

---

## DURANTE O DEPLOY

### OPÇÃO A: Via GitHub (Recomendado)

#### Passo 1: Criar Repositório no GitHub
- [ ] Acessei https://github.com/new
- [ ] Criei repositório chamado `v7-finance`
- [ ] **NÃO** marquei "Initialize with README"

#### Passo 2: Push para GitHub
```bash
git init
git add .
git commit -m "🚀 Deploy V7 Finance"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/v7-finance.git
git push -u origin main
```

- [ ] Executei os comandos acima
- [ ] Código está no GitHub
- [ ] Posso ver os arquivos em https://github.com/SEU_USUARIO/v7-finance

#### Passo 3: Importar no Vercel
- [ ] Acessei https://vercel.com
- [ ] Fiz login (GitHub, GitLab ou Email)
- [ ] Cliquei em "Add New Project"
- [ ] Importei repositório `v7-finance`
- [ ] Cliquei em "Deploy" (NÃO configurar variáveis ainda)

---

### OPÇÃO B: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

- [ ] Instalei Vercel CLI
- [ ] Fiz login
- [ ] Executei `vercel`
- [ ] Deploy foi concluído
- [ ] Tenho a URL do projeto

---

## CONFIGURAR VARIÁVEIS DE AMBIENTE

### No Vercel Dashboard

1. **Acessar Configurações**
   - [ ] Abri o projeto no Vercel Dashboard
   - [ ] Cliquei em "Settings"
   - [ ] Cliquei em "Environment Variables"

2. **Adicionar Variáveis**

   **Variável 1:**
   - [ ] Name: `VITE_SUPABASE_URL`
   - [ ] Value: `https://oajntbrqzjbgfwyuocdi.supabase.co`
   - [ ] Marcado: ✅ Production ✅ Preview ✅ Development
   - [ ] Cliquei em "Save"

   **Variável 2:**
   - [ ] Name: `VITE_SUPABASE_ANON_KEY`
   - [ ] Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs`
   - [ ] Marcado: ✅ Production ✅ Preview ✅ Development
   - [ ] Cliquei em "Save"

3. **Redeploy**
   - [ ] Cliquei em "Deployments"
   - [ ] Cliquei nos 3 pontinhos do último deployment
   - [ ] Cliquei em "Redeploy"
   - [ ] Aguardei o build completar (1-3 minutos)

---

## APÓS O DEPLOY

### 1. Acessar o Site
- [ ] Copiei a URL do Vercel (ex: `https://v7-finance.vercel.app`)
- [ ] Abri em uma aba anônima/privada do navegador
- [ ] A página carregou (sem tela branca)

### 2. Testar Funcionalidades Básicas

#### Login/Auth
- [ ] Consigo ver a tela de login
- [ ] Consigo fazer login com usuário existente
- [ ] Após login, sou redirecionado para o dashboard

#### Dashboard
- [ ] Dashboard aparece corretamente
- [ ] Gráficos são carregados
- [ ] Não há erros no console (F12 → Console)

#### Transações
- [ ] Consigo adicionar uma transação teste
- [ ] Transação aparece na lista
- [ ] Consigo deletar a transação teste

#### Categorias
- [ ] Consigo ver categorias
- [ ] Filtros funcionam

### 3. Verificar Console (F12)
- [ ] Abri DevTools (F12)
- [ ] Aba Console
- [ ] **NÃO** há erros vermelhos críticos
- [ ] Se houver warnings, são apenas sobre chunks/dependencies (OK!)

### 4. Testar em Dispositivos

#### Desktop
- [ ] Chrome: ✅ Funciona
- [ ] Firefox: ✅ Funciona
- [ ] Safari/Edge: ✅ Funciona

#### Mobile
- [ ] Abri no celular
- [ ] Layout responsivo está OK
- [ ] Consigo navegar normalmente

---

## VERIFICAÇÕES DE SEGURANÇA

### Headers de Segurança
- [ ] HTTPS está ativo (cadeado no navegador)
- [ ] Headers configurados no `vercel.json` estão funcionando

### Variáveis de Ambiente
- [ ] `VITE_SUPABASE_URL` está configurada
- [ ] `VITE_SUPABASE_ANON_KEY` está configurada
- [ ] **NÃO** expus `service_role_key` no frontend ⚠️

### Supabase
- [ ] Row Level Security (RLS) está habilitado
- [ ] Policies estão configuradas corretamente

---

## CONFIGURAÇÕES OPCIONAIS

### Domínio Personalizado
- [ ] Settings → Domains → Add Domain
- [ ] Configurei DNS
- [ ] Domínio está ativo

### Analytics
- [ ] Analytics → Enable
- [ ] Analytics está coletando dados

### Preview Deployments
- [ ] Testei fazer um PR no GitHub
- [ ] Vercel criou preview automático

---

## TROUBLESHOOTING

### ❌ Se o site não carrega (tela branca)

1. **Verificar Console do Navegador**
   - [ ] Abri F12 → Console
   - [ ] Copiei a mensagem de erro
   - [ ] Procurei por "VITE_SUPABASE" nos erros

2. **Verificar Variáveis**
   - [ ] Settings → Environment Variables
   - [ ] Ambas variáveis estão lá
   - [ ] Não há espaços extras
   - [ ] Estão marcadas para Production

3. **Verificar Build Logs**
   - [ ] Deployments → Último deployment → View Build Logs
   - [ ] Build completou com sucesso (status: Ready)
   - [ ] Não há erros (apenas warnings é OK)

### ❌ Se login não funciona

1. **Verificar URL do Supabase**
   - [ ] URL está correta: `https://oajntbrqzjbgfwyuocdi.supabase.co`
   - [ ] Não tem `/` no final
   - [ ] Está com `https://`

2. **Verificar ANON_KEY**
   - [ ] Key está completa (começa com `eyJhbGc...`)
   - [ ] Não tem espaços ou quebras de linha
   - [ ] É a chave `anon/public`, NÃO a `service_role`

3. **Verificar Network**
   - [ ] F12 → Network → Filtrar por "supabase"
   - [ ] Requests estão indo para URL correta
   - [ ] Status 200 ou 201 (não 401 ou 403)

### ❌ Warnings de chunk size

✅ **Isso é NORMAL!** O projeto já está otimizado.

Warnings que podem aparecer (IGNORE):
- `(!) Some chunks are larger than 500 kB after minification`
- `(!) Circular dependency`
- Deprecated warnings de dependências

Esses warnings NÃO afetam o funcionamento!

---

## 🎉 DEPLOY CONCLUÍDO!

### ✅ Checklist Final

- [ ] Site está no ar
- [ ] Login funciona
- [ ] Transações funcionam
- [ ] Dashboard carrega
- [ ] Gráficos aparecem
- [ ] Sem erros críticos no console
- [ ] Testado em desktop e mobile
- [ ] URL acessível publicamente

---

## 📊 Informações do Deploy

**URL do Projeto:** ___________________________________

**URL do GitHub:** ___________________________________

**Data do Deploy:** ___________________________________

**Versão:** 1.0.0

**Status:** 
- [ ] ✅ Produção (tudo funcionando)
- [ ] ⚠️ Staging (testando)
- [ ] ❌ Erro (precisa correção)

---

## 📞 Próximos Passos

Após deploy bem-sucedido:

1. **Compartilhar**
   - [ ] Enviei URL para testers
   - [ ] Coletei feedback inicial

2. **Monitorar**
   - [ ] Configurei alertas do Vercel
   - [ ] Adicionei Analytics

3. **Manutenção**
   - [ ] Configurei backup do Supabase
   - [ ] Documentei processo de deploy
   - [ ] Criei roadmap de melhorias

---

## 🚀 Comandos Úteis Pós-Deploy

```bash
# Ver status do projeto
vercel ls

# Ver logs em tempo real
vercel logs -f

# Criar novo deployment
vercel --prod

# Remover deployment antigo
vercel remove DEPLOYMENT_URL
```

---

**🎉 PARABÉNS! SEU V7 FINANCE ESTÁ NO AR! 🎉**

---

**Dica:** Salve este checklist para futuros deploys ou updates!

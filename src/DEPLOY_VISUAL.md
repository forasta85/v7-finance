# 🎨 Guia Visual - Deploy V7 Finance

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🚀 DEPLOY V7 FINANCE NO VERCEL                     ║
║                                                               ║
║           Guia Visual Passo a Passo                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📍 ESCOLHA SEU CAMINHO

```
        ┌─────────────────────────────────────┐
        │   QUAL É SEU PERFIL?               │
        └──────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐          ┌─────────┐
   │INICIANTE│          │EXPERIENTE│
   └────┬────┘          └────┬─────┘
        │                    │
        │                    │
        ▼                    ▼
```

---

## 🟢 CAMINHO A: INICIANTE (Script Automático)

```
╔═══════════════════════════════════════════════════════════════╗
║  PASSO 1: Abrir Terminal                                     ║
╚═══════════════════════════════════════════════════════════════╝

   📁 Navegar até pasta do projeto
   
   Windows:        cd C:\projetos\v7-finance
   Mac/Linux:      cd ~/projetos/v7-finance


╔═══════════════════════════════════════════════════════════════╗
║  PASSO 2: Executar Script                                    ║
╚═══════════════════════════════════════════════════════════════╝

   Windows:        deploy-vercel.bat
   Mac/Linux:      bash deploy-vercel.sh


╔═══════════════════════════════════════════════════════════════╗
║  PASSO 3: Seguir Instruções Interativas                     ║
╚═══════════════════════════════════════════════════════════════╝

   O script vai perguntar:
   
   ┌─────────────────────────────────────┐
   │ Deseja reinstalar dependências?    │
   │ (s/n):                             │
   └─────────────────────────────────────┘
   
   Digite: s  ← se for primeira vez
           n  ← se já instalou


╔═══════════════════════════════════════════════════════════════╗
║  PASSO 4: Aguardar Deploy                                    ║
╚═══════════════════════════════════════════════════════════════╝

   ┌─────────────────────────────────────┐
   │  [████████████████████████] 100%   │
   │                                     │
   │  ✅ Deploy concluído!              │
   │                                     │
   │  URL: https://v7-finance.vercel.app│
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  PASSO 5: Configurar Variáveis no Vercel                    ║
╚═══════════════════════════════════════════════════════════════╝

   1. Abrir: https://vercel.com/dashboard
   
   2. Clicar em seu projeto
   
   3. Settings → Environment Variables
   
   4. Adicionar:
   
      ┌──────────────────────────────────────┐
      │ VITE_SUPABASE_URL                   │
      ├──────────────────────────────────────┤
      │ https://oajntbrqzjbgfwyuocdi...     │
      └──────────────────────────────────────┘
      
      ┌──────────────────────────────────────┐
      │ VITE_SUPABASE_ANON_KEY              │
      ├──────────────────────────────────────┤
      │ eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...   │
      └──────────────────────────────────────┘
   
   5. Marcar: ✅ Production ✅ Preview ✅ Development
   
   6. Clicar "Save"


╔═══════════════════════════════════════════════════════════════╗
║  PASSO 6: Redeploy                                           ║
╚═══════════════════════════════════════════════════════════════╝

   Deployments → ... → Redeploy
   
   ┌─────────────────────────────────────┐
   │  [████████████████████████] 100%   │
   │                                     │
   │  ✅ Redeploy concluído!            │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  🎉 PRONTO! SEU APP ESTÁ NO AR!                             ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🔵 CAMINHO B: EXPERIENTE (Manual)

```
╔═══════════════════════════════════════════════════════════════╗
║  ETAPA 1: Build Local                                        ║
╚═══════════════════════════════════════════════════════════════╝

   Terminal:
   
   $ npm install
   ┌─────────────────────────────────────┐
   │  Installing dependencies...         │
   │  ✅ 23 packages installed           │
   └─────────────────────────────────────┘
   
   $ npm run build
   ┌─────────────────────────────────────┐
   │  Building production bundle...      │
   │  ✅ Build completed in 42.3s        │
   │  📦 dist/ folder created            │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  ETAPA 2: Git + GitHub                                       ║
╚═══════════════════════════════════════════════════════════════╝

   $ git init
   $ git add .
   $ git commit -m "Deploy V7 Finance"
   $ git branch -M main
   
   $ git remote add origin https://github.com/USER/v7-finance.git
   $ git push -u origin main
   
   ┌─────────────────────────────────────┐
   │  Enumerating objects: 157, done.   │
   │  Counting objects: 100% (157/157)  │
   │  Writing objects: 100% (157/157)   │
   │  ✅ Push successful                │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  ETAPA 3: Conectar Vercel                                    ║
╚═══════════════════════════════════════════════════════════════╝

   Browser: https://vercel.com
   
   ┌─────────────────────────────────────┐
   │                                     │
   │    🚀 Add New Project              │
   │                                     │
   │    Import Git Repository           │
   │    ↓                                │
   │    [ v7-finance ]                  │
   │                                     │
   │    [  Import  ]                    │
   │                                     │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  ETAPA 4: Configurar Projeto                                 ║
╚═══════════════════════════════════════════════════════════════╝

   ┌─────────────────────────────────────┐
   │  Configure Project                  │
   ├─────────────────────────────────────┤
   │                                     │
   │  Project Name:                      │
   │  [v7-finance           ]            │
   │                                     │
   │  Framework Preset:                  │
   │  [Vite                 ▼]           │
   │                                     │
   │  Root Directory:                    │
   │  [./                   ]            │
   │                                     │
   │  Build Command:                     │
   │  [npm run build        ]            │
   │                                     │
   │  Output Directory:                  │
   │  [dist                 ]            │
   │                                     │
   │  Install Command:                   │
   │  [npm install          ]            │
   │                                     │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  ETAPA 5: Environment Variables                              ║
╚═══════════════════════════════════════════════════════════════╝

   ▼ Environment Variables (2)
   
   ┌─────────────────────────────────────┐
   │  Key                                │
   │  [VITE_SUPABASE_URL      ]         │
   │                                     │
   │  Value                              │
   │  [https://oajntbrqzjbgfwyuocdi...] │
   │                                     │
   │  ✅ Production                      │
   │  ✅ Preview                         │
   │  ✅ Development                     │
   │                                     │
   │  [ Add ]                            │
   └─────────────────────────────────────┘
   
   ┌─────────────────────────────────────┐
   │  Key                                │
   │  [VITE_SUPABASE_ANON_KEY ]         │
   │                                     │
   │  Value                              │
   │  [eyJhbGciOiJIUzI1NiIsInR5cCI...] │
   │                                     │
   │  ✅ Production                      │
   │  ✅ Preview                         │
   │  ✅ Development                     │
   │                                     │
   │  [ Add ]                            │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  ETAPA 6: Deploy!                                            ║
╚═══════════════════════════════════════════════════════════════╝

   ┌─────────────────────────────────────┐
   │                                     │
   │        [ Deploy ]                   │
   │                                     │
   └─────────────────────────────────────┘
   
   ↓
   
   ┌─────────────────────────────────────┐
   │  🔨 Building...                     │
   │  [████████░░░░░░░░░░░░░░] 42%      │
   └─────────────────────────────────────┘
   
   ↓
   
   ┌─────────────────────────────────────┐
   │  ✅ Deployment Ready!               │
   │                                     │
   │  🌐 https://v7-finance.vercel.app  │
   │                                     │
   │  [ Visit ]                          │
   └─────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════╗
║  🎉 DEPLOY CONCLUÍDO!                                        ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## ✅ VERIFICAÇÃO PÓS-DEPLOY

```
╔═══════════════════════════════════════════════════════════════╗
║  CHECKLIST DE VERIFICAÇÃO                                    ║
╚═══════════════════════════════════════════════════════════════╝

   Abrir: https://seu-app.vercel.app
   
   ┌─────────────────────────────────────┐
   │  V7 FINANCE                         │
   │  ════════════                       │
   │                                     │
   │  Email:    [____________]           │
   │  Password: [____________]           │
   │                                     │
   │  [ Login ]                          │
   └─────────────────────────────────────┘
   
   ✅ Página carregou (não está em branco)
   ✅ Formulário de login aparece
   ✅ Não há erros no console (F12)


╔═══════════════════════════════════════════════════════════════╗
║  TESTE DE LOGIN                                              ║
╚═══════════════════════════════════════════════════════════════╝

   Fazer login com usuário existente
   
   ┌─────────────────────────────────────┐
   │  Bem-vindo, Admin! 👋              │
   │                                     │
   │  📊 Dashboard                       │
   │  ┌─────────┬─────────┬─────────┐  │
   │  │Receitas │Despesas │ Saldo   │  │
   │  │R$ 5.000 │R$ 3.200 │R$ 1.800 │  │
   │  └─────────┴─────────┴─────────┘  │
   │                                     │
   │  📈 [Gráfico de Pizza]             │
   │                                     │
   └─────────────────────────────────────┘
   
   ✅ Login funcionou
   ✅ Dashboard apareceu
   ✅ Dados carregaram


╔═══════════════════════════════════════════════════════════════╗
║  TESTE DE TRANSAÇÃO                                          ║
╚═══════════════════════════════════════════════════════════════╝

   Adicionar nova transação
   
   ┌─────────────────────────────────────┐
   │  Nova Transação                     │
   │  ─────────────────                  │
   │                                     │
   │  Tipo:       (•) Despesa            │
   │  Valor:      [100.00     ]          │
   │  Categoria:  [Alimentação▼]         │
   │  Data:       [2026-03-09 ]          │
   │                                     │
   │  [  Salvar  ]  [Cancelar]          │
   └─────────────────────────────────────┘
   
   ✅ Modal abre
   ✅ Formulário funciona
   ✅ Transação é salva
   ✅ Aparece na lista


╔═══════════════════════════════════════════════════════════════╗
║  TESTE MOBILE                                                ║
╚═══════════════════════════════════════════════════════════════╝

   Abrir no celular
   
   ┌─────────────┐
   │ V7 FINANCE  │
   │ ═══════════ │
   │             │
   │ ☰  Dashboard│
   │             │
   │ ┌─────────┐ │
   │ │ Receitas│ │
   │ │ R$ 5k   │ │
   │ └─────────┘ │
   │             │
   │ ┌─────────┐ │
   │ │ Despesas│ │
   │ │ R$ 3.2k │ │
   │ └─────────┘ │
   │             │
   │ [+ Nova]    │
   └─────────────┘
   
   ✅ Layout responsivo
   ✅ Menu mobile funciona
   ✅ Botões acessíveis


╔═══════════════════════════════════════════════════════════════╗
║  ✅ TUDO FUNCIONANDO!                                        ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🆘 TROUBLESHOOTING VISUAL

```
╔═══════════════════════════════════════════════════════════════╗
║  PROBLEMA: Tela Branca                                       ║
╚═══════════════════════════════════════════════════════════════╝

   Sintoma:
   ┌─────────────────────────────────────┐
   │                                     │
   │                                     │
   │           (vazio)                   │
   │                                     │
   │                                     │
   └─────────────────────────────────────┘
   
   Solução:
   1. F12 → Console → Ver erros
   2. Vercel → Settings → Environment Variables
   3. Adicionar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
   4. Redeploy


╔═══════════════════════════════════════════════════════════════╗
║  PROBLEMA: Failed to fetch                                   ║
╚═══════════════════════════════════════════════════════════════╝

   Sintoma:
   ┌─────────────────────────────────────┐
   │  ❌ Erro ao carregar dados         │
   │                                     │
   │  Failed to fetch                    │
   │                                     │
   │  [ Tentar Novamente ]              │
   └─────────────────────────────────────┘
   
   Solução:
   1. Verificar URL do Supabase (sem / no final)
   2. Verificar anon key (completa, sem espaços)
   3. Testar: https://oajntbrqzjbgfwyuocdi.supabase.co


╔═══════════════════════════════════════════════════════════════╗
║  PROBLEMA: Login não funciona                                ║
╚═══════════════════════════════════════════════════════════════╝

   Sintoma:
   ┌─────────────────────────────────────┐
   │  ❌ Credenciais inválidas          │
   │                                     │
   │  Verifique email e senha           │
   │                                     │
   │  [   OK   ]                        │
   └─────────────────────────────────────┘
   
   Solução:
   1. Verificar se usuário existe no Supabase
   2. Supabase → Authentication → Users
   3. Criar usuário teste manualmente
   4. Tentar login novamente
```

---

## 📊 FLUXOGRAMA COMPLETO

```
                      START
                        ↓
           ┌────────────────────────┐
           │   Escolher Método      │
           └──────┬─────────────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Script  │  │ GitHub  │  │   CLI   │
│Automático│  │Dashboard│  │         │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Build Local    │
         │ npm run build  │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │ Git + GitHub   │
         │ git push       │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │ Deploy Vercel  │
         │ vercel --prod  │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │ Configurar ENV │
         │ Variables      │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │   Redeploy     │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │    Testar      │
         └────────┬───────┘
                  │
           ┌──────┴──────┐
           │             │
           ▼             ▼
      ┌────────┐   ┌────────────┐
      │ Sucesso│   │Troubleshoot│
      │   🎉   │   │     🔧     │
      └────────┘   └──────┬─────┘
                          │
                          ▼
                   ┌────────────┐
                   │  Corrigir  │
                   └──────┬─────┘
                          │
                          ↑
                          └─────┐
                                │
                         (volta ao teste)
```

---

## 🎯 PRÓXIMOS PASSOS

```
╔═══════════════════════════════════════════════════════════════╗
║  APÓS DEPLOY BEM-SUCEDIDO                                    ║
╚═══════════════════════════════════════════════════════════════╝

   1. Domínio Personalizado
      ┌─────────────────────────────────────┐
      │  v7finance.com                      │
      │  ↓                                  │
      │  Vercel → Settings → Domains        │
      └─────────────────────────────────────┘

   2. Analytics
      ┌─────────────────────────────────────┐
      │  📊 1.2k visitors                   │
      │  ↓                                  │
      │  Vercel → Analytics → Enable        │
      └─────────────────────────────────────┘

   3. Alertas
      ┌─────────────────────────────────────┐
      │  🔔 Error monitoring                │
      │  ↓                                  │
      │  Integrar Sentry/LogRocket          │
      └─────────────────────────────────────┘

   4. Backup
      ┌─────────────────────────────────────┐
      │  💾 Database backup                 │
      │  ↓                                  │
      │  Supabase → SQL Editor → Dump       │
      └─────────────────────────────────────┘

   5. Testar com Usuários
      ┌─────────────────────────────────────┐
      │  👥 Beta testers                    │
      │  ↓                                  │
      │  Coletar feedback e iterar          │
      └─────────────────────────────────────┘
```

---

## 📚 RECURSOS

```
┌─────────────────────────────────────────────────────────────┐
│  📄 Guias de Deploy                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚡ DEPLOY_1_PAGINA.md        - Resumo em 1 página        │
│  🚀 INICIO_DEPLOY.md          - 3 métodos simples          │
│  📋 DEPLOY_RESUMO.md          - Comparação                 │
│  📖 DEPLOY_VERCEL_RAPIDO.md   - Guia completo              │
│  ✅ CHECKLIST_DEPLOY.md       - Checklist                  │
│  🔧 TROUBLESHOOTING_DEPLOY.md - Problemas                  │
│  ❓ FAQ_DEPLOY.md             - Perguntas                  │
│  📚 INDICE_DEPLOY.md          - Navegação                  │
│  🎨 DEPLOY_VISUAL.md          - Este guia                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**🎉 PARABÉNS! VOCÊ ESTÁ PRONTO PARA FAZER DEPLOY! 🎉**

---

**Última atualização:** 2026-03-09  
**Versão:** 1.0.0

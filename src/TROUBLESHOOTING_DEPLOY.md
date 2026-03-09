# 🔧 Troubleshooting - Deploy V7 Finance

## 🆘 Problemas Comuns e Soluções

---

## 1. ❌ Tela Branca Após Deploy

### Sintomas:
- Site carrega mas fica em branco
- Console mostra erro: `Cannot read property of undefined`
- Network tab mostra erros 401 ou 403

### Causas Possíveis:
1. Variáveis de ambiente não configuradas
2. Variáveis configuradas incorretamente
3. Build não incluiu variáveis

### Soluções:

#### Solução 1: Verificar Variáveis de Ambiente

```bash
# 1. Acessar Vercel Dashboard
https://vercel.com/dashboard

# 2. Selecionar projeto V7 Finance

# 3. Settings → Environment Variables

# 4. Verificar se existem:
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# 5. Verificar se estão marcadas:
✅ Production
✅ Preview  
✅ Development
```

#### Solução 2: Recriar Variáveis

```bash
# 1. Deletar variáveis antigas

# 2. Adicionar novamente:
Nome: VITE_SUPABASE_URL
Valor: https://oajntbrqzjbgfwyuocdi.supabase.co
Marcar: ✅ Todos os ambientes

Nome: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs
Marcar: ✅ Todos os ambientes

# 3. Redeploy
```

#### Solução 3: Redeploy Completo

```bash
# Via Dashboard:
Deployments → ... → Redeploy

# Via CLI:
vercel --prod --force
```

#### Solução 4: Verificar Console do Navegador

```bash
# 1. Abrir DevTools (F12)
# 2. Aba Console
# 3. Procurar por erros vermelhos
# 4. Se aparecer "supabase is not defined" → Problema com variáveis
# 5. Se aparecer "Failed to fetch" → Problema de CORS ou URL
```

---

## 2. ❌ Erro: "Failed to fetch" / "Network Error"

### Sintomas:
- Login não funciona
- Erro ao carregar dados
- Console mostra: `Failed to fetch` ou `Network request failed`

### Causas Possíveis:
1. URL do Supabase incorreta
2. CORS não configurado
3. Supabase project offline
4. Edge Function não deployada

### Soluções:

#### Solução 1: Verificar URL do Supabase

```bash
# URL correta:
https://oajntbrqzjbgfwyuocdi.supabase.co

# ❌ Erros comuns:
https://oajntbrqzjbgfwyuocdi.supabase.co/  ← Barra no final
http://oajntbrqzjbgfwyuocdi.supabase.co   ← HTTP em vez de HTTPS
https://supabase.com/...                  ← URL errada
```

#### Solução 2: Testar URL do Supabase

```bash
# No terminal:
curl https://oajntbrqzjbgfwyuocdi.supabase.co/rest/v1/

# Deve retornar erro 401 (esperado - significa que está funcionando)
# Se retornar timeout ou connection refused → Problema com Supabase
```

#### Solução 3: Verificar Status do Supabase

```bash
# 1. Acessar: https://status.supabase.com
# 2. Verificar se há incidentes
# 3. Verificar seu projeto: https://supabase.com/dashboard/project/oajntbrqzjbgfwyuocdi
```

#### Solução 4: Verificar CORS

```bash
# F12 → Console
# Se aparecer erro de CORS:
"Access to fetch at '...' from origin '...' has been blocked by CORS"

# Solução: Verificar configuração no Supabase
# Dashboard → Settings → API → CORS
```

---

## 3. ❌ Erro: "Invalid API key"

### Sintomas:
- Erro 401 Unauthorized
- Console: `Invalid API key`
- Login falha imediatamente

### Causas Possíveis:
1. Anon key incorreta
2. Usando service_role_key no frontend (ERRO GRAVE!)
3. Chave expirada
4. Espaços ou caracteres extras na chave

### Soluções:

#### Solução 1: Copiar Chave Novamente

```bash
# 1. Acessar Supabase Dashboard
https://supabase.com/dashboard/project/oajntbrqzjbgfwyuocdi

# 2. Settings → API

# 3. Copiar "Project API keys" → "anon" → "public"
# (NÃO copiar a service_role!)

# 4. Colar no Vercel (sem espaços extras)

# 5. Redeploy
```

#### Solução 2: Verificar Se Não Está Usando service_role

```bash
# ❌ NUNCA use service_role_key no frontend!

# Chave anon começa com:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24i...

# Se tiver "service_role" no token decodificado → ERRO!
```

#### Solução 3: Verificar Espaços/Quebras de Linha

```bash
# Verificar se não há:
- Espaços antes ou depois da chave
- Quebras de linha
- Caracteres invisíveis

# Copiar direto do Supabase Dashboard
# Não copiar de arquivo de texto (pode ter formatação)
```

---

## 4. ❌ Build Failed / Erro de Compilação

### Sintomas:
- Deploy falha na etapa de build
- Logs mostram erros TypeScript/ESLint
- Erro: `Command "npm run build" exited with 1`

### Causas Possíveis:
1. Erro de sintaxe no código
2. Dependências faltando
3. TypeScript errors
4. Erro de importação

### Soluções:

#### Solução 1: Testar Build Local

```bash
# 1. No terminal, na pasta do projeto:
npm install

# 2. Rodar build:
npm run build

# 3. Se aparecer erros:
# - Ler mensagem de erro
# - Ir ao arquivo indicado
# - Corrigir erro
# - Testar novamente

# 4. Quando build local funcionar:
git add .
git commit -m "Fix build errors"
git push
```

#### Solução 2: Limpar Cache e Reinstalar

```bash
# 1. Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json

# 2. Reinstalar
npm install

# 3. Testar build
npm run build

# 4. Se funcionar, fazer push
```

#### Solução 3: Verificar Logs do Vercel

```bash
# 1. Vercel Dashboard → Deployments
# 2. Clicar no deployment falhado
# 3. Clicar em "View Build Logs"
# 4. Procurar por erros (linhas em vermelho)
# 5. Corrigir no código local
# 6. Push novamente
```

---

## 5. ⚠️ Warnings de Chunk Size

### Sintomas:
- Build completa mas mostra warnings
- `(!) Some chunks are larger than 500 kB after minification`
- Site funciona normalmente

### Solução:
✅ **IGNORE!** Isso é NORMAL e não afeta o funcionamento.

Esses warnings aparecem porque:
- Recharts é uma biblioteca grande
- jsPDF também é pesado
- Supabase client tem muitas funcionalidades

O projeto já está otimizado com code splitting no `vite.config.ts`.

Se REALMENTE quiser remover os warnings:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Aumentar limite
  },
});
```

Mas isso é cosmético - não melhora performance.

---

## 6. ❌ Login/Signup Não Funciona

### Sintomas:
- Formulário de login não responde
- Erro ao criar conta
- Redirecionamento não funciona

### Causas Possíveis:
1. Supabase Auth não configurado
2. Email confirmation habilitado
3. RLS (Row Level Security) muito restritivo
4. Redirect URLs não configuradas

### Soluções:

#### Solução 1: Verificar Auth no Supabase

```bash
# 1. Supabase Dashboard → Authentication → Settings

# 2. Verificar:
✅ Enable Email Confirmations → DESABILITADO (para teste)
✅ Secure email change → Pode deixar habilitado

# 3. Site URL:
https://seu-app.vercel.app

# 4. Redirect URLs:
https://seu-app.vercel.app/**
https://seu-app.vercel.app/reset-password
```

#### Solução 2: Criar Usuário Manualmente (Teste)

```bash
# 1. Supabase Dashboard → Authentication → Users

# 2. Add User → Criar manualmente

# 3. Testar login com esse usuário

# Se funcionar → Problema no signup
# Se não funcionar → Problema no login/auth
```

#### Solução 3: Verificar Console

```bash
# F12 → Console
# Procurar por:

# ❌ "User not found" → Usuário não existe
# ❌ "Invalid credentials" → Senha errada
# ❌ "Email not confirmed" → Email precisa ser confirmado
```

---

## 7. ❌ Dados Não Aparecem / Lista Vazia

### Sintomas:
- Dashboard vazio
- Transações não aparecem
- Gráficos sem dados

### Causas Possíveis:
1. Dados não foram criados
2. RLS bloqueando acesso
3. Filtros muito restritivos
4. Erro ao buscar dados

### Soluções:

#### Solução 1: Adicionar Dados Teste

```bash
# 1. Fazer login

# 2. Adicionar transação manualmente

# 3. Se aparecer → OK
# 4. Se não aparecer → Problema de RLS ou fetch
```

#### Solução 2: Verificar RLS (Row Level Security)

```bash
# 1. Supabase Dashboard → Table Editor

# 2. Selecionar tabela kv_store_7f44b203

# 3. RLS → View policies

# 4. Verificar se há policies criadas
# 5. Se não houver → Criar policies básicas

# Policy SELECT:
CREATE POLICY "Users can view own data"
ON kv_store_7f44b203
FOR SELECT
USING (true);  -- Temporário para teste

# Policy INSERT:
CREATE POLICY "Users can insert data"
ON kv_store_7f44b203
FOR INSERT
WITH CHECK (true);  -- Temporário para teste
```

#### Solução 3: Verificar Network Tab

```bash
# F12 → Network → Filtrar "supabase"

# Verificar requests:
# ✅ Status 200 → Sucesso
# ❌ Status 401 → Não autorizado (problema de auth)
# ❌ Status 403 → Proibido (problema de RLS)
# ❌ Status 500 → Erro no servidor
```

---

## 8. ❌ Deploy Fica "Building" Infinitamente

### Sintomas:
- Build não completa
- Fica em "Building..." por mais de 5 minutos
- Não mostra progresso

### Causas Possíveis:
1. Timeout no build
2. Build script com erro infinito
3. Problema no Vercel

### Soluções:

#### Solução 1: Cancelar e Tentar Novamente

```bash
# 1. Vercel Dashboard → Deployments

# 2. Clicar no deployment em andamento

# 3. ... → Cancel Deployment

# 4. Fazer novo deployment
```

#### Solução 2: Verificar package.json

```json
{
  "scripts": {
    "build": "vite build"  // Deve ser simples
  }
}
```

#### Solução 3: Contatar Suporte Vercel

```bash
# Se problema persistir:
https://vercel.com/support

# Ou verificar status:
https://www.vercel-status.com
```

---

## 9. 🔍 Como Debugar Qualquer Problema

### Passo a Passo Universal:

#### 1. Verificar Console do Navegador
```bash
F12 → Console → Procurar erros em vermelho
```

#### 2. Verificar Network Tab
```bash
F12 → Network → Ver requests falhados
```

#### 3. Verificar Build Logs do Vercel
```bash
Vercel Dashboard → Deployments → Ver logs
```

#### 4. Verificar Function Logs do Supabase
```bash
Supabase Dashboard → Edge Functions → Logs
```

#### 5. Testar Localmente
```bash
npm install
npm run build
npm run preview
```

#### 6. Comparar Funcionamento
```bash
Local funciona + Vercel não = Problema de variáveis
Local não funciona + Vercel não = Problema de código
```

---

## 10. 📞 Quando Pedir Ajuda

### Informações para Fornecer:

```markdown
**Problema:**
[Descreva o problema]

**URL do Deploy:**
https://seu-app.vercel.app

**Console Errors:**
[Cole erros do console]

**Build Logs:**
[Cole logs relevantes]

**Passos para Reproduzir:**
1. Acessar URL
2. Fazer login
3. ...

**Já Tentei:**
- [ ] Verificar variáveis de ambiente
- [ ] Redeploy
- [ ] Testar localmente
- [ ] Ver console/network
- [ ] ...
```

---

## 🔗 Links Úteis

- **Vercel Status:** https://www.vercel-status.com
- **Supabase Status:** https://status.supabase.com
- **Vercel Docs:** https://vercel.com/docs/errors
- **Supabase Troubleshooting:** https://supabase.com/docs/guides/troubleshooting

---

## 📋 Checklist de Troubleshooting

Antes de pedir ajuda, verifique:

```
□ Build local funciona (npm run build)
□ Variáveis de ambiente configuradas
□ Variáveis marcadas para Production
□ URL do Supabase está correta
□ Anon key está correta (não service_role!)
□ Redeploy foi feito após configurar variáveis
□ Console do navegador foi verificado
□ Network tab foi verificada
□ Build logs foram verificados
□ Supabase está online (status.supabase.com)
□ Vercel está online (vercel-status.com)
```

---

**Última atualização:** 2026-03-09
**Versão:** 1.0.0

🎯 **Lembre-se:** 90% dos problemas são variáveis de ambiente mal configuradas!

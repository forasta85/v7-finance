# ❓ FAQ - Deploy V7 Finance no Vercel

## Perguntas Frequentes sobre Deploy

---

## 🚀 Antes do Deploy

### **P: Preciso pagar para usar Vercel?**
**R:** Não! O plano gratuito (Hobby) é suficiente para o V7 Finance.

Limites do plano gratuito:
- 100 GB bandwidth/mês
- Builds ilimitados
- Deploy automático
- HTTPS grátis
- Domínio personalizado grátis

---

### **P: Preciso pagar para usar Supabase?**
**R:** Não! O plano gratuito é suficiente para começar.

Limites do plano gratuito:
- 500 MB database
- 1 GB file storage
- 50.000 monthly active users
- Edge Functions grátis (2 milhões de invocações/mês)

---

### **P: Quanto tempo leva o deploy?**
**R:** Depende do método:
- Script automático: ~2 minutos
- GitHub + Vercel: ~5 minutos
- Vercel CLI: ~3 minutos

Build do projeto: 1-3 minutos

---

### **P: Preciso saber programar para fazer deploy?**
**R:** Não! Use o script automático:
```bash
bash deploy-vercel.sh  # Linux/Mac
deploy-vercel.bat      # Windows
```

Ou siga o guia passo a passo visual.

---

## 🔧 Durante o Deploy

### **P: Qual método de deploy devo usar?**
**R:** Depende do seu perfil:

| Perfil | Método Recomendado |
|--------|-------------------|
| Iniciante | 🤖 Script Automático |
| Intermediário | 📖 GitHub + Dashboard |
| Avançado | ⚡ Vercel CLI |
| Quer CI/CD | 📖 GitHub (deploy automático) |

---

### **P: Devo fazer deploy via GitHub ou CLI?**
**R:** GitHub é recomendado porque:

✅ Deploy automático em cada push
✅ Preview automático para PRs
✅ Histórico de deployments
✅ Rollback fácil
✅ Colaboração facilitada

CLI é bom para:
✅ Deploy rápido único
✅ Testes locais
✅ Projetos sem Git

---

### **P: Como sei se o deploy foi bem-sucedido?**
**R:** Verifique:

1. **Vercel Dashboard mostra "Ready"** (não "Error")
2. **URL abre sem tela branca**
3. **Login funciona**
4. **Console sem erros críticos** (F12)

---

### **P: Por que preciso configurar variáveis de ambiente?**
**R:** As variáveis contêm:
- URL do Supabase (onde está o banco de dados)
- Chave de acesso (para autenticar requests)

Sem elas, o app não consegue se conectar ao backend.

---

## ⚠️ Problemas Comuns

### **P: Deploy deu certo mas o site fica em branco. Por quê?**
**R:** 99% das vezes: **variáveis de ambiente faltando ou incorretas**.

Solução:
1. Vercel → Settings → Environment Variables
2. Adicionar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Marcar ✅ Production
4. Redeploy

---

### **P: Como faço redeploy?**
**R:** Três formas:

**Via Dashboard:**
```
Deployments → ... → Redeploy
```

**Via CLI:**
```bash
vercel --prod
```

**Via Git (se conectou GitHub):**
```bash
git commit --allow-empty -m "Redeploy"
git push
```

---

### **P: Dá erro "Failed to fetch". O que fazer?**
**R:** Causas comuns:

1. **URL do Supabase errada**
   - Verificar: `https://oajntbrqzjbgfwyuocdi.supabase.co`
   - Não pode ter `/` no final

2. **Anon key errada**
   - Copiar do Supabase Dashboard → Settings → API
   - Usar a chave `anon`, não `service_role`

3. **Supabase offline**
   - Verificar: https://status.supabase.com

---

### **P: Warnings de "chunk size". Devo me preocupar?**
**R:** **NÃO!** Warnings são normais e não afetam funcionamento.

Exemplos de warnings OK:
- `Some chunks are larger than 500 kB`
- `Circular dependency`
- Deprecated warnings de libs

Apenas ERRORS são problema.

---

### **P: Build falhou. Como corrigir?**
**R:** Passo a passo:

```bash
# 1. Testar build local
npm run build

# 2. Ver erros no terminal

# 3. Corrigir erros

# 4. Testar novamente
npm run build

# 5. Quando funcionar local:
git add .
git commit -m "Fix build"
git push
```

---

## 🔐 Segurança

### **P: Quais chaves do Supabase devo usar?**
**R:** 

✅ **NO FRONTEND (Vercel):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (chave pública)

❌ **NUNCA NO FRONTEND:**
- `SUPABASE_SERVICE_ROLE_KEY` (apenas no backend)

A service_role_key tem poderes administrativos! Se vazar, alguém pode deletar seu banco de dados.

---

### **P: Minhas variáveis de ambiente estão seguras?**
**R:** Sim! O Vercel:

✅ Criptografa variáveis
✅ Não expõe em logs públicos
✅ Apenas seu time tem acesso

Mas lembre-se:
⚠️ Variáveis `VITE_*` vão para o código do navegador
⚠️ Por isso use apenas chaves públicas

---

### **P: Alguém pode ver minha anon key no código?**
**R:** Sim, a anon key é pública por design.

Mas é seguro porque:
- Anon key tem permissões limitadas
- RLS (Row Level Security) do Supabase protege dados
- Não permite operações administrativas

A service_role_key é que deve ser secreta!

---

## 📱 Funcionalidades

### **P: O app funciona offline após deploy?**
**R:** Parcialmente. Como PWA:

✅ Interface carrega offline
✅ Dados em cache ficam disponíveis
❌ Novas operações precisam de internet (Supabase)

Para offline completo, precisaria de:
- Service Worker avançado
- IndexedDB para cache
- Sincronização quando voltar online

---

### **P: Posso instalar como app no celular?**
**R:** Sim! É um PWA (Progressive Web App).

**Android:**
1. Abrir no Chrome
2. Menu → "Adicionar à tela inicial"

**iOS:**
1. Abrir no Safari
2. Compartilhar → "Adicionar à Tela de Início"

---

### **P: Push notifications funcionam?**
**R:** Estrutura está pronta, mas precisa configurar:
1. Firebase Cloud Messaging (FCM)
2. Implementar service worker
3. Solicitar permissão do usuário

Não incluído por padrão para manter simples.

---

## 🔄 Atualizações

### **P: Como atualizar o app após fazer mudanças?**
**R:** Depende do método de deploy:

**Se usou GitHub:**
```bash
git add .
git commit -m "Atualização"
git push
```
✅ Deploy automático!

**Se usou CLI:**
```bash
vercel --prod
```

---

### **P: Posso voltar para versão anterior?**
**R:** Sim! No Vercel Dashboard:

```
Deployments → Escolher deployment antigo → ... → Promote to Production
```

---

### **P: Como testar mudanças sem afetar produção?**
**R:** Use Preview Deployments:

**Com GitHub:**
1. Criar branch: `git checkout -b teste`
2. Fazer mudanças e push
3. Vercel cria preview automático
4. Testar no preview URL
5. Se OK, merge para main

**Com CLI:**
```bash
vercel  # Deploy em preview (não production)
```

---

## 💰 Custos

### **P: Quando precisarei pagar?**
**R:** Plano gratuito suporta:
- Até ~1000 usuários/mês
- Tráfego moderado
- Projeto pessoal ou pequeno

Upgrade necessário se:
- > 100 GB bandwidth/mês
- Precisa de Analytics avançado
- Quer remover branding Vercel
- Equipe com múltiplos membros

---

### **P: Quanto custa upgrade?**
**R:** Vercel Pro: $20/mês
- 1 TB bandwidth
- Analytics incluído
- Password protection
- Suporte prioritário

Supabase Pro: $25/mês
- 8 GB database
- 100 GB file storage
- Daily backups

---

## 🌐 Domínio

### **P: Posso usar meu próprio domínio?**
**R:** Sim! E é grátis:

```
Vercel → Settings → Domains → Add Domain
```

Exemplos:
- `v7finance.com`
- `app.meusistema.com.br`

Precisa configurar DNS (instruções aparecem no Vercel).

---

### **P: Como funciona domínio personalizado?**
**R:** 

1. **Comprar domínio** (GoDaddy, Registro.br, etc)
2. **Adicionar no Vercel**
3. **Configurar DNS** conforme instruções
4. **Aguardar** propagação (5 min - 48h)
5. **Pronto!** HTTPS automático

---

## 📊 Performance

### **P: O site vai ser rápido?**
**R:** Sim! Vercel usa:

✅ CDN global (Edge Network)
✅ Compressão automática
✅ Cache inteligente
✅ HTTP/2 e HTTP/3

Resultado: load time < 2s na maioria dos casos.

---

### **P: Suporta quantos usuários simultâneos?**
**R:** Depende de vários fatores:

Plano gratuito:
- ~50-100 usuários simultâneos (estimativa)
- Serverless auto-scale
- Supabase: 50k MAU (monthly active users)

Para mais, considere upgrade.

---

## 🔍 Monitoramento

### **P: Como ver quantas pessoas estão usando?**
**R:** Várias opções:

**Vercel Analytics (pago):**
- Pageviews em tempo real
- Métricas de performance
- Origem do tráfego

**Supabase Dashboard:**
- Número de usuários cadastrados
- API requests
- Database usage

**Google Analytics (grátis):**
- Adicionar tag no `index.html`
- Relatórios detalhados

---

### **P: Como ver erros que usuários enfrentam?**
**R:** 

**Console local:**
- Pedir para usuário enviar screenshot do console (F12)

**Sentry (grátis para projetos pequenos):**
- Error tracking automático
- Stack traces
- User info

**Vercel Logs:**
- Function logs (se usar Edge Functions)

---

## 🆘 Suporte

### **P: Onde consigo ajuda se travar?**
**R:** Ordem recomendada:

1. **Consultar documentação**
   - TROUBLESHOOTING_DEPLOY.md
   - DEPLOY_VERCEL_RAPIDO.md

2. **Ver logs**
   - Console do navegador (F12)
   - Vercel build logs
   - Supabase function logs

3. **Comunidade**
   - Vercel Discord: https://vercel.com/discord
   - Supabase Discord: https://discord.supabase.com

4. **Suporte oficial**
   - Vercel: https://vercel.com/support
   - Supabase: https://supabase.com/support

---

### **P: Posso contratar alguém para fazer deploy pra mim?**
**R:** Pode, mas não é necessário! 

O script automático faz tudo:
```bash
bash deploy-vercel.sh
```

Ou siga o guia visual passo a passo.

Se mesmo assim precisar de ajuda profissional:
- Upwork
- Fiverr
- Freelancer

Custo estimado: $20-50 USD para um deploy simples.

---

## 🎯 Boas Práticas

### **P: Devo testar antes de fazer deploy?**
**R:** SIM! Sempre:

```bash
npm run build
npm run preview
```

Se funcionar local → OK para deploy
Se não funcionar local → NÃO deploy (vai falhar)

---

### **P: Preciso fazer backup do banco de dados?**
**R:** Recomendado!

**Supabase Pro ($25/mês):**
- Backups diários automáticos

**Plano gratuito:**
- Export manual regular
- SQL Dump: `supabase db dump`

---

### **P: Como organizar múltiplos ambientes (dev, staging, prod)?**
**R:** Estratégias:

**Opção 1: Branches + Vercel**
- `main` → Production
- `staging` → Preview
- `dev` → Development

**Opção 2: Múltiplos projetos Vercel**
- v7-finance-dev
- v7-finance-staging  
- v7-finance-prod

**Opção 3: Environment variables**
- Diferentes `.env` por ambiente

---

## 🎓 Aprendizado

### **P: Preciso saber React para manter o projeto?**
**R:** Para uso básico: Não

Para customizações: Sim, recomendado aprender:
- React basics
- TypeScript
- Tailwind CSS

Recursos gratuitos:
- https://react.dev/learn
- https://www.typescriptlang.org/docs
- https://tailwindcss.com/docs

---

### **P: Onde aprender mais sobre Vercel?**
**R:** 
- **Docs oficial:** https://vercel.com/docs
- **YouTube:** Canal Vercel
- **Blog:** https://vercel.com/blog
- **Templates:** https://vercel.com/templates

---

### **P: Onde aprender mais sobre Supabase?**
**R:**
- **Docs oficial:** https://supabase.com/docs
- **YouTube:** Canal Supabase
- **Blog:** https://supabase.com/blog
- **Exemplos:** https://github.com/supabase/supabase/tree/master/examples

---

## 📞 Contato

**Encontrou um bug no V7 Finance?**
Abra uma issue no GitHub (se o projeto estiver público)

**Dúvidas sobre o código?**
Consulte a documentação inline nos arquivos

**Precisa de feature específica?**
Considere contribuir via Pull Request

---

## ✅ Checklist Final

Antes de considerar deploy completo:

```
□ Site abre sem tela branca
□ Login funciona
□ Consegue adicionar transação
□ Dashboard mostra dados
□ Gráficos aparecem
□ Relatórios podem ser gerados
□ Mobile funciona bem
□ Console sem erros críticos
□ Variáveis de ambiente configuradas
□ HTTPS está ativo
□ URL personalizada (opcional)
□ Testado com usuários reais
```

---

**Ainda tem dúvidas?**

📖 Consulte: **TROUBLESHOOTING_DEPLOY.md**
🚀 Guia completo: **DEPLOY_VERCEL_RAPIDO.md**
✅ Passo a passo: **CHECKLIST_DEPLOY.md**

---

**Última atualização:** 2026-03-09
**Versão:** 1.0.0

🎉 **Boa sorte com seu deploy!**

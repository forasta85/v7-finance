# 💰 V7 Finance

> Sistema completo de gestão financeira pessoal com dashboard interativo, controle de receitas/despesas, metas de gastos, cartões de crédito, parcelamentos e muito mais!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/v7-finance)

---

## ✨ Funcionalidades

### 📊 **Dashboard Inteligente**
- Resumo financeiro em tempo real
- Gráficos interativos (barras, pizza, linha, área, radar, donut)
- Filtros por período e categoria
- Indicadores visuais de saúde financeira

### 💳 **Gestão de Transações**
- Adicionar receitas e despesas rapidamente
- Categorização automática
- Tags personalizadas
- Notas e observações
- Busca e filtros avançados

### 🎯 **Metas Financeiras**
- Metas de gastos mensais por categoria
- Indicadores de progresso visual
- Alertas quando ultrapassar limite
- Metas de poupança com deadline

### 💰 **Cartões e Parcelamentos**
- Cadastro de múltiplos cartões de crédito
- Controle de dívidas parceladas
- Vínculo de parcelamentos a cartões
- Visualização de parcelas restantes
- Alertas de vencimento

### 🔄 **Transações Recorrentes**
- Configurar receitas/despesas fixas
- Frequência diária, semanal, mensal, anual
- Processamento automático
- Vínculo a métodos de pagamento

### 📈 **Relatórios Detalhados**
- Exportação em PDF e CSV
- Análise por período
- Gráficos de evolução
- Relatórios personalizados

### 👥 **Sistema de Administração**
- Painel admin completo
- Criar e gerenciar usuários
- Sistema de convite por email
- Senha temporária no primeiro acesso
- Logs de atividades

### 🔐 **Autenticação Completa**
- Login/Signup com Supabase Auth
- Recuperação de senha
- Troca de senha obrigatória (primeiro acesso)
- Sessões seguras com JWT

### 📱 **PWA (Progressive Web App)**
- Instalável em dispositivos móveis
- Funciona offline
- Notificações push
- Experiência nativa

---

## 🚀 Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase Edge Functions (Deno)
- **Database:** PostgreSQL (Supabase)
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage
- **Estilização:** Tailwind CSS v4
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **PDF:** jsPDF
- **Hospedagem:** Vercel (frontend) + Supabase (backend)

---

## 📦 Instalação Local

```bash
# Clonar repositório
git clone https://github.com/SEU_USUARIO/v7-finance.git
cd v7-finance

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env na raiz:
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## 🌐 Deploy

### **Deploy no Vercel (Frontend)**

1. Faça fork/clone do repositório
2. Conecte ao Vercel
3. Configure as variáveis de ambiente
4. Deploy automático! 🎉

**Guia completo:** [DEPLOY.md](./DEPLOY.md)

### **Deploy Supabase (Backend)**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref SEU_PROJECT_ID

# Deploy Edge Functions
supabase functions deploy make-server
```

---

## 📚 Documentação

- [Guia de Deploy](./DEPLOY.md) - Como fazer deploy completo
- [Estrutura do Projeto](#estrutura) - Organização dos arquivos
- [API Backend](./docs/API.md) - Endpoints disponíveis *(em breve)*
- [Contribuindo](./CONTRIBUTING.md) - Como contribuir *(em breve)*

---

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/1f2937/dc2626?text=Dashboard+V7+Finance)

### Transações
![Transações](https://via.placeholder.com/800x450/1f2937/dc2626?text=Gestão+de+Transações)

### Relatórios
![Relatórios](https://via.placeholder.com/800x450/1f2937/dc2626?text=Relatórios+Detalhados)

---

## 🗂️ Estrutura {#estrutura}

```
v7-finance/
├── src/
│   ├── components/
│   │   ├── Auth/              # Componentes de autenticação
│   │   ├── sections/          # Seções da aplicação
│   │   ├── AdminPanel.tsx     # Painel administrativo
│   │   └── ...
│   ├── utils/
│   │   ├── supabase/          # Configuração Supabase
│   │   └── ...
│   └── App.tsx                # Componente principal
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx      # Edge Function principal
│           ├── email-templates.ts  # Templates de email
│           └── kv_store.tsx   # Database helpers
├── public/                    # Arquivos estáticos
├── vercel.json               # Configuração Vercel
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

---

## 🔧 Configuração

### **Variáveis de Ambiente (Frontend)**

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### **Secrets do Supabase (Backend)**

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (⚠️ NUNCA EXPOR!)
SUPABASE_DB_URL=postgresql://...

# Email (Opcional)
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=senha-de-app
SMTP_FROM=noreply@v7finance.com
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

- **GitHub:** [@SEU_USUARIO](https://github.com/SEU_USUARIO)
- **Email:** seu-email@exemplo.com
- **Issues:** [Reportar Bug](https://github.com/SEU_USUARIO/v7-finance/issues)

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) - Backend e autenticação
- [Vercel](https://vercel.com) - Hospedagem frontend
- [Tailwind CSS](https://tailwindcss.com) - Estilização
- [Recharts](https://recharts.org) - Gráficos
- [Lucide](https://lucide.dev) - Ícones

---

**Desenvolvido com ❤️ e ☕**

⭐ Se este projeto te ajudou, considere dar uma estrela!

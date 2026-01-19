# 🚀 Início Rápido - Testes de Carga

## ⚡ Método Mais Rápido (Recomendado)

### 1️⃣ Obter suas credenciais automaticamente:
```bash
chmod +x get-token.sh
./get-token.sh
```

Digite seu email e senha quando solicitado, e pronto! ✨

---

## 📋 Suas Credenciais

### PROJECT_ID (já configurado):
```
oajntbrqzjbgfwyuocdi
```

### AUTH_TOKEN:
Você precisa obter fazendo login. Use uma das opções abaixo:

---

## 🎯 3 Formas de Obter o AUTH_TOKEN

### ⭐ Opção 1: Script Automático (Mais Fácil)
```bash
./get-token.sh
```
- Digite email e senha
- Token será exibido e copiado automaticamente
- Pode salvar em arquivo `.env.test`

### 💻 Opção 2: Console do Navegador (Rápido)
1. Abra o app: https://oajntbrqzjbgfwyuocdi.supabase.co
2. Faça login
3. Pressione **F12** (abrir console)
4. Cole e execute:
```javascript
supabase.auth.getSession().then(({data}) => {
  console.log('🎫 AUTH_TOKEN:');
  console.log(data.session.access_token);
  navigator.clipboard.writeText(data.session.access_token);
  console.log('✅ Copiado!');
});
```

### 🔧 Opção 3: Via cURL (Programático)
```bash
curl -X POST \
  'https://oajntbrqzjbgfwyuocdi.supabase.co/auth/v1/token?grant_type=password' \
  -H 'Content-Type: application/json' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs' \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }'
```

---

## 🧪 Executar Testes de Carga

### Teste Profissional (k6):
```bash
# 1. Instalar k6
brew install k6  # Mac
# ou wget https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz

# 2. Editar load-test.js
# Linha 15: const PROJECT_ID = 'oajntbrqzjbgfwyuocdi';
# Linha 16: const AUTH_TOKEN = 'cole_seu_token_aqui';

# 3. Executar
k6 run load-test.js
```

### Teste Simples (bash):
```bash
# 1. Dar permissão
chmod +x test-simple.sh

# 2. Editar test-simple.sh
# Linha 12: PROJECT_ID="oajntbrqzjbgfwyuocdi"
# Linha 13: AUTH_TOKEN="cole_seu_token_aqui"

# 3. Executar
./test-simple.sh
```

---

## 📊 O que será testado?

- ✅ GET /transactions (ler transações)
- ✅ POST /transactions (criar transações)
- ✅ Latência (tempo de resposta)
- ✅ Taxa de erro
- ✅ Throughput (req/s)
- ✅ Performance sob carga (10-100 usuários simultâneos)

---

## 📈 Interpretando Resultados

### ✅ Excelente
```
✅ Latência P95 < 500ms
✅ Taxa de erro < 1%
✅ Throughput > 100 req/s
```

### ⚠️ Bom
```
⚠️ Latência P95 < 1000ms
⚠️ Taxa de erro < 5%
⚠️ Throughput > 50 req/s
```

### ❌ Requer Atenção
```
❌ Latência P95 > 1000ms
❌ Taxa de erro > 5%
❌ Throughput < 50 req/s
```

---

## 🎯 Exemplo Completo (Passo a Passo)

```bash
# Passo 1: Obter token
./get-token.sh
# Saída: seu_token_aqui_muito_longo...

# Passo 2: Editar script de teste
nano load-test.js
# Ou: code load-test.js
# Cole o token na linha 16

# Passo 3: Executar teste
k6 run load-test.js

# Passo 4: Analisar resultados
# Veja no terminal as métricas:
# - http_req_duration (latência)
# - http_req_failed (% de erros)
# - http_reqs (req/s)
```

---

## 💡 Dicas Importantes

### ⏰ Token Expira
- Tokens duram ~1 hora
- Se der erro 401, gere novo token
- Use `./get-token.sh` novamente

### 🔒 Segurança
- ⚠️ NÃO faça commit do token
- ⚠️ NÃO compartilhe publicamente
- ✅ Use `.env.test` (já no .gitignore)

### 📦 Começe Pequeno
```bash
# Primeiro teste: 10 requisições
# Depois: 100 requisições
# Por fim: 1000+ requisições
```

### 📊 Monitore o Supabase
- Dashboard: https://supabase.com/dashboard/project/oajntbrqzjbgfwyuocdi
- Veja uso em tempo real
- Verifique limites do plano

---

## 🆘 Problemas Comuns

### ❌ "Permission denied"
```bash
chmod +x get-token.sh
chmod +x test-simple.sh
```

### ❌ "k6: command not found"
```bash
brew install k6
```

### ❌ "jq: command not found"
```bash
brew install jq  # Opcional, mas recomendado
```

### ❌ Erro 401 (Unauthorized)
```bash
# Token expirou, gere novo:
./get-token.sh
```

---

## 📁 Arquivos do Projeto

```
📦 V7 Finance - Testes de Carga
├── 📄 TESTE_DE_CARGA.md           # Guia completo
├── 📄 COMO_OBTER_CREDENCIAIS.md   # Como obter PROJECT_ID e TOKEN
├── 📄 INICIO_RAPIDO_TESTES.md     # Este arquivo (guia rápido)
├── 📄 get-token.sh                # Script para obter token automaticamente
├── 📄 load-test.js                # Teste profissional (k6)
└── 📄 test-simple.sh              # Teste simples (bash)
```

---

## 🎉 Tudo Pronto!

Agora você tem:
- ✅ PROJECT_ID configurado
- ✅ 3 formas de obter AUTH_TOKEN
- ✅ 2 scripts de teste prontos
- ✅ Documentação completa

**Comece agora:**
```bash
./get-token.sh
```

---

## 📞 Próximos Passos

1. ✅ Obter credenciais (`./get-token.sh`)
2. ✅ Configurar scripts de teste
3. ✅ Executar primeiro teste (pequeno)
4. ✅ Analisar resultados
5. ✅ Aumentar carga gradualmente
6. ✅ Otimizar se necessário

**Boa sorte com seus testes! 🚀**

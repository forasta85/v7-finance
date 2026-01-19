# 🚀 Guia de Teste de Carga - V7 Finance

## ✅ SIM, você consegue fazer testes de carga!

Este guia explica como testar a performance e capacidade do seu aplicativo V7 Finance.

---

## 📊 O que você pode testar

### 1. **Performance do Backend**
- Velocidade de resposta das APIs
- Capacidade de requisições simultâneas
- Tempo de processamento de transações
- Latência do banco de dados

### 2. **Limites do Supabase**
- Plano Free: ~500 requisições/segundo
- Plano Pro: ~2.000 requisições/segundo
- Plano Enterprise: Customizado

### 3. **Endpoints disponíveis**
```
POST /signup - Criar usuário
POST /reset-password - Reset de senha
GET/POST /transactions - Transações
GET/POST /goals - Metas de gastos
GET/POST /savings-goals - Metas de poupança
GET/POST /accounts - Contas
GET/POST /recurring-transactions - Transações recorrentes
POST /send-email-report - Enviar relatório por email
POST /send-whatsapp-report - Enviar relatório por WhatsApp
```

---

## 🛠️ Ferramentas Recomendadas

### 1. **Apache Bench (ab)** - Simples e rápido
```bash
# Instalar (Mac/Linux)
brew install apache2  # ou apt-get install apache2-utils

# Teste básico: 100 requisições, 10 concorrentes
ab -n 100 -c 10 \
   -H "Authorization: Bearer SEU_TOKEN_AQUI" \
   https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203/transactions
```

### 2. **Artillery** - Avançado com cenários
```bash
# Instalar
npm install -g artillery

# Criar arquivo de teste: artillery-test.yml
artillery run artillery-test.yml
```

### 3. **k6** - Moderno e poderoso
```bash
# Instalar (Mac)
brew install k6

# Executar teste
k6 run load-test.js
```

### 4. **Postman** - Interface gráfica
- Collection Runner
- Performance Testing
- Monitoring

---

## 📝 Exemplo de Teste com Artillery

Crie um arquivo `artillery-test.yml`:

```yaml
config:
  target: "https://SEU_PROJECT_ID.supabase.co"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      name: "Ramp up load"
    - duration: 60
      arrivalRate: 20
      name: "Spike test"
  processor: "./auth-processor.js"

scenarios:
  - name: "Testar transações"
    flow:
      - function: "getAuthToken"
      - get:
          url: "/functions/v1/make-server-7f44b203/transactions"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - think: 2
      - post:
          url: "/functions/v1/make-server-7f44b203/transactions"
          headers:
            Authorization: "Bearer {{ authToken }}"
            Content-Type: "application/json"
          json:
            transactions:
              - id: "{{ $randomString() }}"
                type: "expense"
                description: "Teste de carga"
                amount: 100
                category: "Outros"
                date: "2024-12-23"
```

---

## 🧪 Exemplo de Teste com k6

Crie um arquivo `load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Subir para 20 usuários
    { duration: '1m', target: 50 },   // Subir para 50 usuários
    { duration: '30s', target: 0 },   // Voltar para 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições < 500ms
    http_req_failed: ['rate<0.05'],   // Taxa de erro < 5%
  },
};

const BASE_URL = 'https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-7f44b203';
const AUTH_TOKEN = 'SEU_TOKEN_AQUI';

export default function () {
  // Teste GET transações
  const getRes = http.get(`${BASE_URL}/transactions`, {
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
    },
  });

  check(getRes, {
    'GET status 200': (r) => r.status === 200,
    'GET tempo < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Teste POST transações
  const payload = JSON.stringify({
    transactions: [
      {
        id: `test-${Date.now()}`,
        type: 'expense',
        description: 'Teste de carga',
        amount: 100,
        category: 'Outros',
        date: new Date().toISOString().split('T')[0],
      },
    ],
  });

  const postRes = http.post(`${BASE_URL}/transactions`, payload, {
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  check(postRes, {
    'POST status 200': (r) => r.status === 200,
    'POST tempo < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(2);
}
```

---

## 📈 Métricas Importantes

### 1. **Latência**
- P50 (mediana): 50% das requisições
- P95: 95% das requisições
- P99: 99% das requisições
- Meta: < 500ms para P95

### 2. **Taxa de Throughput**
- Requisições por segundo (RPS)
- Transações por minuto (TPM)
- Meta: Mínimo 100 RPS

### 3. **Taxa de Erro**
- Erros 4xx (cliente)
- Erros 5xx (servidor)
- Meta: < 1% de erros

### 4. **Concorrência**
- Usuários simultâneos
- Conexões ativas
- Meta: 100+ usuários simultâneos

---

## ⚠️ Limitações e Cuidados

### 1. **Supabase Free Tier**
- 500 MB de banco de dados
- 1 GB de transferência
- 2 GB de armazenamento
- 50.000 usuários ativos mensais

### 2. **Rate Limiting**
- Limite de requisições por IP
- Limite de requisições por usuário
- Cuidado com bloqueios temporários

### 3. **Custos**
- Tráfego adicional pode gerar custos
- Edge Functions têm limite de execução
- Monitore o uso em tempo real

### 4. **Ambiente de Produção**
- NÃO teste em produção!
- Use ambiente de staging
- Avise os usuários se necessário

---

## 🎯 Cenários de Teste Recomendados

### 1. **Teste de Fumaça** (Smoke Test)
```
- 1-5 usuários
- 1-2 minutos
- Verificar se tudo funciona
```

### 2. **Teste de Carga** (Load Test)
```
- 10-100 usuários
- 10-30 minutos
- Verificar performance normal
```

### 3. **Teste de Estresse** (Stress Test)
```
- 100-500 usuários
- 30-60 minutos
- Encontrar limites do sistema
```

### 4. **Teste de Pico** (Spike Test)
```
- 0 → 500 → 0 usuários em segundos
- 5-10 minutos
- Verificar recuperação
```

### 5. **Teste de Resistência** (Soak Test)
```
- 50-100 usuários
- 2-24 horas
- Verificar memory leaks
```

---

## 📊 Como Interpretar Resultados

### ✅ Bom
```
- Latência P95 < 500ms
- Taxa de erro < 1%
- Throughput > 100 RPS
- CPU < 70%
- Memória < 80%
```

### ⚠️ Atenção
```
- Latência P95 500ms-1s
- Taxa de erro 1-5%
- Throughput 50-100 RPS
- CPU 70-85%
- Memória 80-90%
```

### ❌ Crítico
```
- Latência P95 > 1s
- Taxa de erro > 5%
- Throughput < 50 RPS
- CPU > 85%
- Memória > 90%
```

---

## 🔧 Otimizações Possíveis

### 1. **Backend**
- Adicionar cache Redis
- Otimizar queries do banco
- Comprimir respostas (gzip)
- Usar CDN para assets

### 2. **Banco de Dados**
- Criar índices adequados
- Usar connection pooling
- Particionar tabelas grandes
- Implementar sharding

### 3. **Frontend**
- Lazy loading de componentes
- Debounce em buscas
- Paginação de resultados
- Service Worker para cache

---

## 📞 Próximos Passos

1. **Escolha uma ferramenta** (recomendo k6 ou Artillery)
2. **Configure o ambiente de teste**
3. **Execute testes incrementais**
4. **Analise os resultados**
5. **Otimize gargalos**
6. **Repita o processo**

---

## 💡 Dica Final

Comece pequeno e aumente gradualmente a carga. Não pule direto para 1000 usuários!

Um teste de carga bem feito pode:
- ✅ Prevenir crashes em produção
- ✅ Identificar gargalos antes dos usuários
- ✅ Validar escalabilidade
- ✅ Justificar upgrades de infraestrutura
- ✅ Dar confiança no deploy

---

**Boa sorte com seus testes! 🚀**

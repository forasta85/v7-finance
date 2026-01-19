// 🚀 Script de Teste de Carga - V7 Finance
// Ferramenta: k6 (https://k6.io)
// 
// Como usar:
// 1. Instale o k6: brew install k6 (Mac) ou https://k6.io/docs/getting-started/installation/
// 2. Configure as variáveis abaixo (PROJECT_ID e AUTH_TOKEN)
// 3. Execute: k6 run load-test.js

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ========================================
// 🔧 CONFIGURAÇÃO - EDITE AQUI
// ========================================

const PROJECT_ID = 'SEU_PROJECT_ID_AQUI'; // Ex: 'abcdefghijklmnop'
const AUTH_TOKEN = 'SEU_ACCESS_TOKEN_AQUI'; // Token de autenticação

// ========================================
// 📊 CONFIGURAÇÃO DO TESTE
// ========================================

export const options = {
  // Cenários de carga
  stages: [
    { duration: '30s', target: 10 },   // Aquecimento: sobe para 10 usuários
    { duration: '1m', target: 30 },    // Carga normal: sobe para 30 usuários
    { duration: '1m', target: 50 },    // Carga alta: sobe para 50 usuários
    { duration: '30s', target: 100 },  // Pico: 100 usuários
    { duration: '30s', target: 0 },    // Cooldown: volta para 0
  ],
  
  // Limites aceitáveis (o teste falha se ultrapassar)
  thresholds: {
    // 95% das requisições devem ser mais rápidas que 1 segundo
    'http_req_duration': ['p(95)<1000'],
    
    // 99% das requisições devem ser mais rápidas que 2 segundos
    'http_req_duration{name:GET_transactions}': ['p(99)<2000'],
    
    // Taxa de erro deve ser menor que 5%
    'http_req_failed': ['rate<0.05'],
    
    // Checks devem passar em 95% dos casos
    'checks': ['rate>0.95'],
  },
};

// ========================================
// 📈 MÉTRICAS CUSTOMIZADAS
// ========================================

const errorRate = new Rate('errors');
const transactionTrend = new Trend('transaction_duration');
const transactionCount = new Counter('transactions_total');

// ========================================
// 🌐 CONFIGURAÇÃO BASE
// ========================================

const BASE_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-7f44b203`;

const headers = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json',
};

// ========================================
// 🎯 FUNÇÃO PRINCIPAL DO TESTE
// ========================================

export default function () {
  // Grupo 1: Leitura de Transações
  group('GET Transações', () => {
    const response = http.get(`${BASE_URL}/transactions`, {
      headers: headers,
      tags: { name: 'GET_transactions' },
    });

    const success = check(response, {
      'GET status é 200': (r) => r.status === 200,
      'GET tempo < 1s': (r) => r.timings.duration < 1000,
      'GET retorna JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
      'GET tem transactions': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.transactions);
        } catch {
          return false;
        }
      },
    });

    errorRate.add(!success);
    transactionTrend.add(response.timings.duration);
    
    if (!success) {
      console.error(`❌ GET falhou: Status ${response.status}`);
    }
  });

  sleep(1); // Pausa de 1 segundo entre operações

  // Grupo 2: Leitura de Metas
  group('GET Metas', () => {
    const response = http.get(`${BASE_URL}/goals`, {
      headers: headers,
      tags: { name: 'GET_goals' },
    });

    check(response, {
      'GET goals status é 200': (r) => r.status === 200,
      'GET goals tempo < 1s': (r) => r.timings.duration < 1000,
    });
  });

  sleep(1);

  // Grupo 3: Criar Transação (simulação)
  group('POST Transação', () => {
    const newTransaction = {
      transactions: [
        {
          id: `load-test-${Date.now()}-${Math.random()}`,
          type: Math.random() > 0.5 ? 'income' : 'expense',
          description: `Teste de Carga ${new Date().toISOString()}`,
          amount: Math.floor(Math.random() * 1000) + 10,
          category: ['Alimentação', 'Transporte', 'Saúde', 'Lazer'][Math.floor(Math.random() * 4)],
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };

    const response = http.post(
      `${BASE_URL}/transactions`,
      JSON.stringify(newTransaction),
      {
        headers: headers,
        tags: { name: 'POST_transactions' },
      }
    );

    const success = check(response, {
      'POST status é 200': (r) => r.status === 200,
      'POST tempo < 2s': (r) => r.timings.duration < 2000,
      'POST retorna success': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true;
        } catch {
          return false;
        }
      },
    });

    if (success) {
      transactionCount.add(1);
    } else {
      console.error(`❌ POST falhou: Status ${response.status}, Body: ${response.body}`);
    }

    errorRate.add(!success);
  });

  sleep(2); // Pausa de 2 segundos antes da próxima iteração
}

// ========================================
// 🏁 FUNÇÃO DE SETUP (executa 1x no início)
// ========================================

export function setup() {
  console.log('🚀 Iniciando teste de carga V7 Finance...');
  console.log(`📍 URL Base: ${BASE_URL}`);
  console.log(`⏱️  Duração total: ~4 minutos`);
  console.log('');
  
  // Validar configuração
  if (PROJECT_ID === 'SEU_PROJECT_ID_AQUI') {
    throw new Error('❌ Configure o PROJECT_ID no script!');
  }
  
  if (AUTH_TOKEN === 'SEU_ACCESS_TOKEN_AQUI') {
    throw new Error('❌ Configure o AUTH_TOKEN no script!');
  }

  // Testar conectividade
  const testResponse = http.get(`${BASE_URL}/transactions`, { headers });
  
  if (testResponse.status === 401) {
    throw new Error('❌ Token de autenticação inválido!');
  }
  
  if (testResponse.status >= 500) {
    throw new Error(`❌ Servidor retornou erro ${testResponse.status}`);
  }

  console.log('✅ Configuração validada!');
  console.log('✅ Conectividade OK!');
  console.log('');
  
  return { startTime: new Date() };
}

// ========================================
// 🏆 FUNÇÃO DE TEARDOWN (executa 1x no final)
// ========================================

export function teardown(data) {
  const endTime = new Date();
  const duration = (endTime - data.startTime) / 1000;
  
  console.log('');
  console.log('🏁 Teste de carga concluído!');
  console.log(`⏱️  Duração: ${duration.toFixed(2)}s`);
  console.log('');
  console.log('📊 Verifique o relatório acima para métricas detalhadas.');
  console.log('');
}

// ========================================
// 💡 DICAS DE USO
// ========================================

/*

COMANDOS ÚTEIS:

1. Executar teste básico:
   k6 run load-test.js

2. Executar com relatório HTML:
   k6 run --out json=results.json load-test.js
   k6 report results.json --out html=report.html

3. Executar com menos usuários (desenvolvimento):
   k6 run --vus 5 --duration 30s load-test.js

4. Executar com mais usuários (stress test):
   k6 run --stage 1m:200 load-test.js

5. Ver métricas em tempo real:
   k6 run --out influxdb=http://localhost:8086/k6 load-test.js


MÉTRICAS IMPORTANTES:

- http_req_duration: Tempo de resposta das requisições
  - p(95): 95% das requisições foram mais rápidas que este valor
  - p(99): 99% das requisições foram mais rápidas que este valor

- http_req_failed: Taxa de falhas (%)

- http_reqs: Total de requisições por segundo (RPS)

- vus: Número de usuários virtuais simultâneos

- checks: Porcentagem de verificações que passaram


INTERPRETAÇÃO DOS RESULTADOS:

✅ EXCELENTE:
   - http_req_duration p(95) < 500ms
   - http_req_failed < 1%
   - checks > 99%

⚠️ BOM:
   - http_req_duration p(95) < 1000ms
   - http_req_failed < 5%
   - checks > 95%

❌ REQUER ATENÇÃO:
   - http_req_duration p(95) > 1000ms
   - http_req_failed > 5%
   - checks < 95%


PRÓXIMOS PASSOS:

1. Se os resultados forem ruins:
   - Verifique logs do servidor
   - Analise queries do banco de dados
   - Considere adicionar cache
   - Otimize código backend

2. Se os resultados forem bons:
   - Aumente gradualmente a carga
   - Teste cenários mais complexos
   - Adicione monitoramento contínuo
   - Configure alertas de performance

*/

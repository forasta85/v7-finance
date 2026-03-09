#!/bin/bash

# 🚀 Script Simples de Teste de Carga - V7 Finance
# Usa apenas cURL e bash (disponível em qualquer sistema Unix/Mac)
#
# Como usar:
# 1. chmod +x test-simple.sh
# 2. ./test-simple.sh

# ========================================
# 🔧 CONFIGURAÇÃO - EDITE AQUI
# ========================================

PROJECT_ID="SEU_PROJECT_ID_AQUI"
AUTH_TOKEN="SEU_ACCESS_TOKEN_AQUI"

# ========================================
# 📊 CONFIGURAÇÃO DO TESTE
# ========================================

REQUESTS=100          # Número total de requisições
CONCURRENT=10         # Requisições simultâneas
URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-7f44b203/transactions"

# ========================================
# 🎨 CORES
# ========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ========================================
# ✅ VALIDAÇÃO
# ========================================

echo -e "${BLUE}🚀 V7 Finance - Teste de Carga Simples${NC}"
echo ""

if [ "$PROJECT_ID" = "SEU_PROJECT_ID_AQUI" ]; then
    echo -e "${RED}❌ Configure o PROJECT_ID no script!${NC}"
    exit 1
fi

if [ "$AUTH_TOKEN" = "SEU_ACCESS_TOKEN_AQUI" ]; then
    echo -e "${RED}❌ Configure o AUTH_TOKEN no script!${NC}"
    exit 1
fi

# Verificar se curl está instalado
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ cURL não está instalado!${NC}"
    exit 1
fi

# ========================================
# 🧪 TESTE DE CONECTIVIDADE
# ========================================

echo -e "${YELLOW}🔍 Testando conectividade...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer ${AUTH_TOKEN}" \
    "${URL}")

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${RED}❌ Token de autenticação inválido!${NC}"
    exit 1
fi

if [ "$HTTP_CODE" -ge "500" ]; then
    echo -e "${RED}❌ Servidor retornou erro ${HTTP_CODE}!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Conectividade OK! (HTTP ${HTTP_CODE})${NC}"
echo ""

# ========================================
# 🎯 FUNÇÃO DE TESTE
# ========================================

run_test() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📊 Teste: ${test_name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🎯 Endpoint: ${endpoint}"
    echo "📦 Requisições: ${REQUESTS}"
    echo "⚡ Concorrentes: ${CONCURRENT}"
    echo ""
    
    START_TIME=$(date +%s)
    
    # Arrays para armazenar tempos de resposta
    declare -a response_times
    success_count=0
    error_count=0
    total_time=0
    
    # Loop de requisições
    for ((i=1; i<=$REQUESTS; i++)); do
        # Executar em background se houver slots disponíveis
        (
            req_start=$(date +%s%N)
            
            if [ "$method" = "GET" ]; then
                HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
                    -H "Authorization: Bearer ${AUTH_TOKEN}" \
                    "${endpoint}")
            else
                HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
                    -X POST \
                    -H "Authorization: Bearer ${AUTH_TOKEN}" \
                    -H "Content-Type: application/json" \
                    -d "${data}" \
                    "${endpoint}")
            fi
            
            req_end=$(date +%s%N)
            req_time=$(( (req_end - req_start) / 1000000 )) # Converter para ms
            
            echo "${HTTP_CODE},${req_time}" >> /tmp/test_results_$$.txt
        ) &
        
        # Limitar concorrência
        if [ $(jobs -r | wc -l) -ge $CONCURRENT ]; then
            wait -n
        fi
        
        # Progress bar
        if [ $((i % 10)) -eq 0 ]; then
            echo -ne "${GREEN}▓${NC}"
        fi
    done
    
    # Esperar todas as requisições terminarem
    wait
    echo ""
    echo ""
    
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # Processar resultados
    while IFS=',' read -r code time; do
        if [ "$code" -ge 200 ] && [ "$code" -lt 300 ]; then
            ((success_count++))
        else
            ((error_count++))
        fi
        total_time=$((total_time + time))
        response_times+=($time)
    done < /tmp/test_results_$$.txt
    
    # Ordenar tempos de resposta
    IFS=$'\n' sorted_times=($(sort -n <<<"${response_times[*]}"))
    unset IFS
    
    # Calcular métricas
    avg_time=$((total_time / REQUESTS))
    min_time=${sorted_times[0]}
    max_time=${sorted_times[-1]}
    p50_index=$((REQUESTS / 2))
    p95_index=$((REQUESTS * 95 / 100))
    p99_index=$((REQUESTS * 99 / 100))
    p50_time=${sorted_times[$p50_index]}
    p95_time=${sorted_times[$p95_index]}
    p99_time=${sorted_times[$p99_index]}
    rps=$((REQUESTS / DURATION))
    
    # Limpar arquivo temporário
    rm /tmp/test_results_$$.txt
    
    # ========================================
    # 📈 RESULTADOS
    # ========================================
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ RESULTADOS${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Status das requisições
    echo -e "${YELLOW}📊 Status das Requisições:${NC}"
    echo "   ✅ Sucesso: ${success_count} ($(( success_count * 100 / REQUESTS ))%)"
    echo "   ❌ Erros:   ${error_count} ($(( error_count * 100 / REQUESTS ))%)"
    echo ""
    
    # Tempo de resposta
    echo -e "${YELLOW}⏱️  Tempo de Resposta (ms):${NC}"
    echo "   Mínimo: ${min_time}ms"
    echo "   Média:  ${avg_time}ms"
    echo "   Máximo: ${max_time}ms"
    echo "   P50:    ${p50_time}ms"
    echo "   P95:    ${p95_time}ms"
    echo "   P99:    ${p99_time}ms"
    echo ""
    
    # Performance
    echo -e "${YELLOW}🚀 Performance:${NC}"
    echo "   Duração total: ${DURATION}s"
    echo "   RPS (req/s):   ${rps}"
    echo ""
    
    # Avaliação
    echo -e "${YELLOW}📝 Avaliação:${NC}"
    if [ $avg_time -lt 500 ] && [ $error_count -eq 0 ]; then
        echo -e "   ${GREEN}✅ EXCELENTE - Sistema muito rápido e estável!${NC}"
    elif [ $avg_time -lt 1000 ] && [ $error_count -lt $((REQUESTS / 20)) ]; then
        echo -e "   ${GREEN}✅ BOM - Performance aceitável${NC}"
    elif [ $avg_time -lt 2000 ]; then
        echo -e "   ${YELLOW}⚠️  REGULAR - Considere otimizações${NC}"
    else
        echo -e "   ${RED}❌ RUIM - Requer otimização urgente${NC}"
    fi
    
    echo ""
}

# ========================================
# 🧪 EXECUTAR TESTES
# ========================================

# Teste 1: GET Transações
run_test "GET Transações" \
    "GET" \
    "${URL}"

# Teste 2: POST Transação
TIMESTAMP=$(date +%s)
DATA='{
  "transactions": [
    {
      "id": "test-'${TIMESTAMP}'",
      "type": "expense",
      "description": "Teste de Carga",
      "amount": 100,
      "category": "Outros",
      "date": "'$(date +%Y-%m-%d)'"
    }
  ]
}'

run_test "POST Transações" \
    "POST" \
    "${URL}" \
    "${DATA}"

# ========================================
# 🏁 CONCLUSÃO
# ========================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🏁 Teste de Carga Concluído!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}💡 Dicas:${NC}"
echo "   • Para mais requisições: edite REQUESTS no script"
echo "   • Para mais concorrência: edite CONCURRENT no script"
echo "   • Para testes profissionais: use k6 (load-test.js)"
echo ""

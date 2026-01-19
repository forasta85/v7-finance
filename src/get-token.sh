#!/bin/bash

# 🔑 Script para Obter AUTH_TOKEN Automaticamente
# V7 Finance - Sistema de Gestão Financeira
#
# Como usar:
# 1. chmod +x get-token.sh
# 2. ./get-token.sh

# ========================================
# 🎨 CORES
# ========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ========================================
# 📋 CONFIGURAÇÃO
# ========================================

PROJECT_ID="oajntbrqzjbgfwyuocdi"
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs"

# ========================================
# 🚀 INÍCIO
# ========================================

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔑 V7 Finance - Obter AUTH_TOKEN${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ========================================
# ✅ VERIFICAR DEPENDÊNCIAS
# ========================================

if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ Erro: curl não está instalado!${NC}"
    echo ""
    echo "Instale com:"
    echo "  Mac: brew install curl"
    echo "  Ubuntu/Debian: sudo apt-get install curl"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq não está instalado (recomendado para formatação)${NC}"
    echo ""
    echo "Instale com:"
    echo "  Mac: brew install jq"
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    echo ""
    echo -e "${CYAN}Continuando sem jq...${NC}"
    echo ""
    HAS_JQ=false
else
    HAS_JQ=true
fi

# ========================================
# 📝 SOLICITAR CREDENCIAIS
# ========================================

echo -e "${YELLOW}📧 Digite suas credenciais do V7 Finance:${NC}"
echo ""

# Solicitar email
read -p "Email: " EMAIL
if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Email não pode ser vazio!${NC}"
    exit 1
fi

# Solicitar senha (sem exibir na tela)
read -s -p "Senha: " PASSWORD
echo ""
if [ -z "$PASSWORD" ]; then
    echo -e "${RED}❌ Senha não pode ser vazia!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🔄 Autenticando...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ========================================
# 🔐 FAZER LOGIN
# ========================================

RESPONSE=$(curl -s -X POST \
  "https://${PROJECT_ID}.supabase.co/auth/v1/token?grant_type=password" \
  -H "Content-Type: application/json" \
  -H "apikey: ${API_KEY}" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\"
  }")

# ========================================
# 🔍 VERIFICAR RESPOSTA
# ========================================

# Verificar se houve erro
if echo "$RESPONSE" | grep -q '"error"'; then
    echo -e "${RED}❌ Erro ao autenticar!${NC}"
    echo ""
    
    if [ "$HAS_JQ" = true ]; then
        ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error_description // .message // .error')
        echo -e "${RED}Mensagem: ${ERROR_MSG}${NC}"
    else
        echo "Resposta do servidor:"
        echo "$RESPONSE"
    fi
    
    echo ""
    echo "Possíveis causas:"
    echo "  • Email ou senha incorretos"
    echo "  • Conta não existe"
    echo "  • Problemas de conexão"
    exit 1
fi

# ========================================
# ✅ EXTRAIR TOKEN
# ========================================

if [ "$HAS_JQ" = true ]; then
    ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')
    REFRESH_TOKEN=$(echo "$RESPONSE" | jq -r '.refresh_token')
    EXPIRES_IN=$(echo "$RESPONSE" | jq -r '.expires_in')
else
    # Extração manual sem jq (menos confiável)
    ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"//;s/"//')
    REFRESH_TOKEN=$(echo "$RESPONSE" | grep -o '"refresh_token":"[^"]*"' | sed 's/"refresh_token":"//;s/"//')
    EXPIRES_IN=$(echo "$RESPONSE" | grep -o '"expires_in":[0-9]*' | sed 's/"expires_in"://')
fi

# Verificar se conseguiu extrair o token
if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo -e "${RED}❌ Erro ao extrair token da resposta!${NC}"
    echo ""
    echo "Resposta do servidor:"
    echo "$RESPONSE"
    exit 1
fi

# ========================================
# 🎉 SUCESSO!
# ========================================

echo -e "${GREEN}✅ Autenticação bem-sucedida!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎫 SUAS CREDENCIAIS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# PROJECT_ID
echo -e "${YELLOW}📍 PROJECT_ID:${NC}"
echo "   ${PROJECT_ID}"
echo ""

# ACCESS_TOKEN
echo -e "${YELLOW}🎫 ACCESS_TOKEN (AUTH_TOKEN):${NC}"
echo "   ${ACCESS_TOKEN:0:50}...${ACCESS_TOKEN: -20}"
echo ""

# Validade
if [ -n "$EXPIRES_IN" ] && [ "$EXPIRES_IN" != "null" ]; then
    EXPIRES_HOURS=$((EXPIRES_IN / 3600))
    echo -e "${YELLOW}⏰ Validade:${NC}"
    echo "   ${EXPIRES_HOURS} horas (${EXPIRES_IN} segundos)"
    echo ""
fi

# ========================================
# 📋 COPIAR PARA CLIPBOARD (opcional)
# ========================================

if command -v pbcopy &> /dev/null; then
    # Mac
    echo "$ACCESS_TOKEN" | pbcopy
    echo -e "${GREEN}✅ Token copiado para área de transferência! (Mac)${NC}"
    echo ""
elif command -v xclip &> /dev/null; then
    # Linux com xclip
    echo "$ACCESS_TOKEN" | xclip -selection clipboard
    echo -e "${GREEN}✅ Token copiado para área de transferência! (Linux)${NC}"
    echo ""
elif command -v xsel &> /dev/null; then
    # Linux com xsel
    echo "$ACCESS_TOKEN" | xsel --clipboard
    echo -e "${GREEN}✅ Token copiado para área de transferência! (Linux)${NC}"
    echo ""
fi

# ========================================
# 💾 SALVAR EM ARQUIVO (opcional)
# ========================================

echo -e "${YELLOW}💾 Deseja salvar as credenciais em arquivo? (s/N):${NC}"
read -p "" SAVE_FILE

if [ "$SAVE_FILE" = "s" ] || [ "$SAVE_FILE" = "S" ]; then
    FILENAME=".env.test"
    
    cat > "$FILENAME" << EOF
# V7 Finance - Credenciais para Teste de Carga
# Gerado em: $(date)
# ATENÇÃO: Não compartilhe este arquivo!

PROJECT_ID=${PROJECT_ID}
AUTH_TOKEN=${ACCESS_TOKEN}
REFRESH_TOKEN=${REFRESH_TOKEN}

# Token expira em: ${EXPIRES_HOURS} horas
# Data de expiração: $(date -d "+${EXPIRES_IN} seconds" 2>/dev/null || date -v +${EXPIRES_IN}S 2>/dev/null)
EOF

    echo -e "${GREEN}✅ Credenciais salvas em: ${FILENAME}${NC}"
    echo ""
    echo -e "${RED}⚠️  IMPORTANTE: Adicione ao .gitignore para não fazer commit!${NC}"
    echo ""
    
    # Adicionar ao .gitignore se existir
    if [ -f ".gitignore" ]; then
        if ! grep -q ".env.test" ".gitignore"; then
            echo ".env.test" >> .gitignore
            echo -e "${GREEN}✅ Adicionado ao .gitignore${NC}"
            echo ""
        fi
    fi
fi

# ========================================
# 🚀 PRÓXIMOS PASSOS
# ========================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🚀 PRÓXIMOS PASSOS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "1. Copie o ACCESS_TOKEN acima"
echo ""

echo "2. Cole no script de teste:"
echo ""
echo -e "${YELLOW}   Para load-test.js (k6):${NC}"
echo "   const AUTH_TOKEN = '${ACCESS_TOKEN:0:50}...';"
echo ""
echo -e "${YELLOW}   Para test-simple.sh (bash):${NC}"
echo "   AUTH_TOKEN=\"${ACCESS_TOKEN:0:50}...\""
echo ""

echo "3. Execute o teste:"
echo ""
echo -e "${YELLOW}   Teste profissional:${NC}"
echo "   k6 run load-test.js"
echo ""
echo -e "${YELLOW}   Teste simples:${NC}"
echo "   ./test-simple.sh"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ========================================
# 🔄 EXPORTAR VARIÁVEIS (opcional)
# ========================================

echo -e "${YELLOW}🔄 Deseja exportar como variáveis de ambiente? (s/N):${NC}"
read -p "" EXPORT_ENV

if [ "$EXPORT_ENV" = "s" ] || [ "$EXPORT_ENV" = "S" ]; then
    export PROJECT_ID="$PROJECT_ID"
    export AUTH_TOKEN="$ACCESS_TOKEN"
    export REFRESH_TOKEN="$REFRESH_TOKEN"
    
    echo ""
    echo -e "${GREEN}✅ Variáveis exportadas para esta sessão!${NC}"
    echo ""
    echo "Use assim:"
    echo "  echo \$PROJECT_ID"
    echo "  echo \$AUTH_TOKEN"
    echo ""
    
    # Criar script de exportação para outras sessões
    cat > "export-env.sh" << EOF
#!/bin/bash
# Exportar credenciais V7 Finance
export PROJECT_ID="${PROJECT_ID}"
export AUTH_TOKEN="${ACCESS_TOKEN}"
export REFRESH_TOKEN="${REFRESH_TOKEN}"
echo "✅ Variáveis exportadas!"
EOF
    
    chmod +x export-env.sh
    echo -e "${GREEN}✅ Script 'export-env.sh' criado para outras sessões${NC}"
    echo ""
    echo "Para usar em outra sessão:"
    echo "  source ./export-env.sh"
    echo ""
fi

echo -e "${GREEN}🎉 Processo concluído com sucesso!${NC}"
echo ""

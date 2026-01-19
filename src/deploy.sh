#!/bin/bash

# 🚀 Script de Deploy Automático - V7 Finance
# Este script faz o deploy completo do projeto no Vercel + Supabase

echo "🚀 V7 Finance - Deploy Automático"
echo "=================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está na pasta raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na pasta raiz do projeto${NC}"
    exit 1
fi

# 1. Verificar dependências instaladas
echo "📦 Verificando dependências..."
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI não encontrado. Instalando...${NC}"
    npm install -g supabase
fi

echo -e "${GREEN}✅ Dependências verificadas${NC}"
echo ""

# 2. Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build. Verifique os erros acima.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído${NC}"
echo ""

# 3. Deploy Supabase Edge Functions
echo "☁️  Deploy das Edge Functions no Supabase..."
read -p "Deseja fazer deploy das Edge Functions? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    cd supabase/functions/server
    supabase functions deploy make-server
    cd ../../..
    echo -e "${GREEN}✅ Edge Functions deployed${NC}"
else
    echo -e "${YELLOW}⏭️  Pulando deploy das Edge Functions${NC}"
fi
echo ""

# 4. Deploy Vercel
echo "🌐 Deploy no Vercel..."
read -p "Deseja fazer deploy no Vercel? (s/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    vercel --prod
    echo -e "${GREEN}✅ Deploy no Vercel concluído${NC}"
else
    echo -e "${YELLOW}⏭️  Pulando deploy no Vercel${NC}"
fi
echo ""

# 5. Finalização
echo "=================================="
echo -e "${GREEN}🎉 Deploy finalizado!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "1. Verifique se as variáveis de ambiente estão configuradas no Vercel"
echo "2. Teste o login na aplicação"
echo "3. Verifique os logs das Edge Functions no Supabase"
echo ""
echo "🔗 Links úteis:"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • Supabase Dashboard: https://supabase.com/dashboard"
echo ""

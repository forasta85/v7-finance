#!/bin/bash

# 🔧 Fix Vercel Error & Deploy
# Script para corrigir erro do Vercel e fazer deploy

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}║   🔧 Fix Vercel Error & Deploy            ║${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Verificar Git
echo -e "${BLUE}[1/4]${NC} Verificando Git..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git OK!${NC}"
echo ""

# Verificar se há mudanças
echo -e "${BLUE}[2/4]${NC} Verificando mudanças..."
if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança detectada${NC}"
    echo ""
    echo "Arquivos corrigidos:"
    echo "  - vercel.json"
    echo "  - .vercelignore"
    echo "  - FIX_VERCEL_ERROR.md"
    echo ""
else
    echo -e "${GREEN}✅ Mudanças detectadas!${NC}"
    echo ""
    git status -s
fi
echo ""

# Adicionar arquivos
echo -e "${BLUE}[3/4]${NC} Adicionando arquivos corrigidos..."
git add vercel.json .vercelignore FIX_VERCEL_ERROR.md README.md 2>/dev/null || true
git add LEIA_PRIMEIRO.md COMECE_AQUI.md DEPLOY_SUPER_FACIL.md 2>/dev/null || true
git add setup-github.sh setup-github.bat 2>/dev/null || true
git add fix-and-deploy.sh fix-and-deploy.bat 2>/dev/null || true

if [[ -n $(git diff --cached --name-only) ]]; then
    echo -e "${GREEN}✅ Arquivos adicionados:${NC}"
    git diff --cached --name-only | sed 's/^/  - /'
else
    echo -e "${YELLOW}⚠️  Nenhum arquivo para adicionar${NC}"
fi
echo ""

# Commit
echo -e "${BLUE}[4/4]${NC} Fazendo commit..."
if git commit -m "Fix: Correção configuração Vercel para build correto

- Corrigido vercel.json com buildCommand correto
- Adicionado routes para SPA
- Corrigido URL do Supabase
- Criado .vercelignore
- Adicionado guia FIX_VERCEL_ERROR.md" 2>/dev/null; then
    echo -e "${GREEN}✅ Commit criado!${NC}"
else
    echo -e "${YELLOW}⚠️  Nada para commitar ou já commitado${NC}"
fi
echo ""

# Push
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Pronto para fazer push!${NC}"
echo ""

# Verificar se tem remote
if ! git remote get-url origin &> /dev/null; then
    echo -e "${RED}❌ Remote não configurado!${NC}"
    echo ""
    echo "Execute primeiro:"
    echo "  bash setup-github.sh"
    echo ""
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo -e "${BLUE}Remote:${NC} $REMOTE_URL"
echo ""

read -p "Fazer push agora? (s/n): " do_push

if [[ $do_push =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${CYAN}Fazendo push...${NC}"
    echo ""
    
    if git push origin main; then
        echo ""
        echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
        echo ""
        echo -e "${CYAN}════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${GREEN}🎉 Deploy iniciado automaticamente!${NC}"
        echo ""
        echo "O Vercel vai detectar as mudanças e fazer deploy."
        echo ""
        echo "Acompanhe em:"
        echo "  https://vercel.com/dashboard"
        echo ""
        echo "Aguarde 2-3 minutos e seu app estará atualizado!"
        echo ""
        
        # Oferecer abrir Vercel
        read -p "Deseja abrir o Vercel no navegador? (s/n): " open_vercel
        if [[ $open_vercel =~ ^[Ss]$ ]]; then
            if command -v xdg-open &> /dev/null; then
                xdg-open "https://vercel.com/dashboard" &> /dev/null &
            elif command -v open &> /dev/null; then
                open "https://vercel.com/dashboard" &> /dev/null &
            fi
            echo -e "${GREEN}✅ Abrindo Vercel...${NC}"
        fi
    else
        echo ""
        echo -e "${RED}❌ Erro ao fazer push!${NC}"
        echo ""
        echo "Tente manualmente:"
        echo "  git push origin main"
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}Push cancelado.${NC}"
    echo ""
    echo "Para fazer push depois, execute:"
    echo "  git push origin main"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📚 Documentação adicional:${NC}"
echo "  - FIX_VERCEL_ERROR.md - Guia completo do erro"
echo "  - COMECE_AQUI.md - Deploy passo a passo"
echo "  - DEPLOY_SUPER_FACIL.md - Guia rápido"
echo ""
echo -e "${GREEN}✅ Correções aplicadas com sucesso!${NC}"
echo ""

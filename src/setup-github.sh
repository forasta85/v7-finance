#!/bin/bash

# 🚀 Setup GitHub Automático - V7 Finance
# Este script prepara tudo para você subir no GitHub

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
echo -e "${CYAN}║     🚀 Setup GitHub - V7 Finance          ║${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}║     Vou te guiar passo a passo!           ║${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo ""
sleep 2

# Verificar Git
echo -e "${BLUE}[1/6]${NC} Verificando Git..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado!${NC}"
    echo "Instale em: https://git-scm.com"
    exit 1
fi
echo -e "${GREEN}✅ Git instalado!${NC}"
echo ""
sleep 1

# Verificar se já tem repositório
if [ -d ".git" ]; then
    echo -e "${YELLOW}[2/6]${NC} Repositório Git já existe!"
    echo ""
    
    # Verificar remote
    if git remote get-url origin &> /dev/null; then
        CURRENT_REMOTE=$(git remote get-url origin)
        echo -e "${GREEN}Remote atual: ${CURRENT_REMOTE}${NC}"
        echo ""
        
        read -p "Deseja manter este remote? (s/n): " keep_remote
        if [[ $keep_remote =~ ^[Nn]$ ]]; then
            git remote remove origin
            echo -e "${YELLOW}Remote removido${NC}"
            NEED_REMOTE=true
        else
            NEED_REMOTE=false
        fi
    else
        NEED_REMOTE=true
    fi
else
    echo -e "${YELLOW}[2/6]${NC} Inicializando Git..."
    git init
    git branch -M main
    echo -e "${GREEN}✅ Git inicializado!${NC}"
    NEED_REMOTE=true
fi
echo ""
sleep 1

# Instruções para criar repositório
if [ "$NEED_REMOTE" = true ]; then
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  ATENÇÃO: SIGA ESTAS INSTRUÇÕES           ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}PASSO 1:${NC} Abra este link no navegador:"
    echo ""
    echo -e "    ${BLUE}https://github.com/new${NC}"
    echo ""
    echo -e "${YELLOW}PASSO 2:${NC} Preencha apenas 1 campo:"
    echo ""
    echo -e "    Repository name: ${GREEN}v7-finance${NC}"
    echo ""
    echo -e "${YELLOW}PASSO 3:${NC} Clique em:"
    echo ""
    echo -e "    ${GREEN}[ Create repository ]${NC}"
    echo ""
    echo -e "${YELLOW}PASSO 4:${NC} Copie a URL que apareceu. Deve ser algo como:"
    echo ""
    echo -e "    ${BLUE}https://github.com/SEU_USUARIO/v7-finance.git${NC}"
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════${NC}"
    echo ""
    
    # Oferecer abrir automaticamente
    read -p "Deseja que eu abra o GitHub no navegador agora? (s/n): " open_browser
    if [[ $open_browser =~ ^[Ss]$ ]]; then
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://github.com/new" &> /dev/null &
        elif command -v open &> /dev/null; then
            open "https://github.com/new" &> /dev/null &
        else
            echo -e "${YELLOW}Não consegui abrir automaticamente. Abra manualmente:${NC}"
            echo "https://github.com/new"
        fi
        echo -e "${GREEN}✅ Abrindo navegador...${NC}"
    fi
    
    echo ""
    read -p "Pressione ENTER quando tiver criado o repositório e copiado a URL..."
    echo ""
    
    # Pedir URL do repositório
    while true; do
        read -p "Cole a URL do repositório aqui: " REPO_URL
        
        # Validar URL
        if [[ $REPO_URL =~ ^https://github.com/.+/.+\.git$ ]] || [[ $REPO_URL =~ ^git@github.com:.+/.+\.git$ ]]; then
            echo -e "${GREEN}✅ URL válida!${NC}"
            break
        else
            echo -e "${RED}❌ URL inválida!${NC}"
            echo "A URL deve ser algo como:"
            echo "  https://github.com/usuario/v7-finance.git"
            echo "ou"
            echo "  git@github.com:usuario/v7-finance.git"
            echo ""
        fi
    done
    
    # Adicionar remote
    echo ""
    echo -e "${YELLOW}[3/6]${NC} Adicionando remote..."
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✅ Remote adicionado!${NC}"
else
    echo -e "${GREEN}[3/6] Remote já configurado!${NC}"
fi
echo ""
sleep 1

# Verificar mudanças
echo -e "${YELLOW}[4/6]${NC} Verificando arquivos..."
if [[ -n $(git status -s) ]]; then
    echo -e "${BLUE}Arquivos modificados detectados${NC}"
    echo ""
    
    read -p "Deseja adicionar todos os arquivos? (s/n): " add_all
    if [[ $add_all =~ ^[Ss]$ ]]; then
        git add .
        echo -e "${GREEN}✅ Arquivos adicionados!${NC}"
    fi
else
    echo -e "${GREEN}✅ Nenhuma mudança pendente${NC}"
fi
echo ""
sleep 1

# Commit
echo -e "${YELLOW}[5/6]${NC} Criando commit..."
if [[ -n $(git status --porcelain) ]]; then
    read -p "Mensagem do commit [Deploy V7 Finance]: " commit_msg
    commit_msg=${commit_msg:-"Deploy V7 Finance"}
    
    git commit -m "$commit_msg"
    echo -e "${GREEN}✅ Commit criado!${NC}"
else
    echo -e "${BLUE}Nada para commitar${NC}"
fi
echo ""
sleep 1

# Push
echo -e "${YELLOW}[6/6]${NC} Fazendo push para GitHub..."
echo ""
echo -e "${CYAN}Enviando arquivos para GitHub...${NC}"
echo ""

if git push -u origin main; then
    echo ""
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
    echo ""
    
    # Extrair usuário e repo da URL
    if [[ $REPO_URL =~ github.com[:/]([^/]+)/([^.]+) ]]; then
        GITHUB_USER="${BASH_REMATCH[1]}"
        REPO_NAME="${BASH_REMATCH[2]}"
        GITHUB_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}"
        
        echo -e "${CYAN}════════════════════════════════════════════${NC}"
        echo ""
        echo -e "  📦 Seu repositório está em:"
        echo ""
        echo -e "     ${BLUE}${GITHUB_URL}${NC}"
        echo ""
        echo -e "${CYAN}════════════════════════════════════════════${NC}"
    fi
else
    echo ""
    echo -e "${RED}❌ Erro ao fazer push!${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "  - Credenciais inválidas"
    echo "  - Repositório não existe"
    echo "  - Sem permissão de escrita"
    echo ""
    echo "Tente:"
    echo "  git push -u origin main"
    exit 1
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}║     ✅ GITHUB CONFIGURADO COM SUCESSO!    ║${NC}"
echo -e "${CYAN}║                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Próximos passos
echo -e "${GREEN}🎉 Próximos passos:${NC}"
echo ""
echo "1️⃣  Acessar Vercel: ${BLUE}https://vercel.com/new${NC}"
echo ""
echo "2️⃣  Importar repositório do GitHub"
echo ""
echo "3️⃣  Configurar variáveis de ambiente:"
echo ""
echo "    ${YELLOW}VITE_SUPABASE_URL${NC}"
echo "    https://oajntbrqzjbgfwyuocdi.supabase.co"
echo ""
echo "    ${YELLOW}VITE_SUPABASE_ANON_KEY${NC}"
echo "    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo ""
echo "4️⃣  Clicar em Deploy"
echo ""
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo ""

read -p "Deseja que eu abra o Vercel no navegador agora? (s/n): " open_vercel
if [[ $open_vercel =~ ^[Ss]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://vercel.com/new" &> /dev/null &
    elif command -v open &> /dev/null; then
        open "https://vercel.com/new" &> /dev/null &
    fi
    echo -e "${GREEN}✅ Abrindo Vercel...${NC}"
fi

echo ""
echo -e "${BLUE}📚 Documentação completa:${NC}"
echo "  - DEPLOY_SUPER_FACIL.md"
echo "  - DEPLOY_VERCEL_RAPIDO.md"
echo "  - README_DEPLOY.md"
echo ""
echo -e "${GREEN}🚀 Boa sorte com seu deploy!${NC}"
echo ""

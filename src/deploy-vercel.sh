#!/bin/bash

# 🚀 Script de Deploy Automatizado - V7 Finance no Vercel
# Execute com: bash deploy-vercel.sh

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 V7 Finance - Deploy no Vercel       ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Função para perguntar sim/não
ask_yes_no() {
    while true; do
        read -p "$1 (s/n): " yn
        case $yn in
            [Ss]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Por favor responda s ou n.";;
        esac
    done
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Verificar Node.js
echo -e "${YELLOW}[1/8]${NC} Verificando Node.js..."
if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Instale em: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js instalado: ${NODE_VERSION}${NC}"

# 2. Verificar npm
echo -e "${YELLOW}[2/8]${NC} Verificando npm..."
if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm instalado: ${NPM_VERSION}${NC}"

# 3. Instalar dependências
echo ""
echo -e "${YELLOW}[3/8]${NC} Instalando dependências..."
if ask_yes_no "Deseja reinstalar dependências?"; then
    echo "Instalando pacotes..."
    npm install
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
else
    echo -e "${BLUE}⏭️  Pulando instalação de dependências${NC}"
fi

# 4. Build local
echo ""
echo -e "${YELLOW}[4/8]${NC} Testando build local..."
if ask_yes_no "Deseja testar o build localmente?"; then
    echo "Executando build..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
        
        # Verificar tamanho do build
        if [ -d "dist" ]; then
            BUILD_SIZE=$(du -sh dist | cut -f1)
            echo -e "${BLUE}📦 Tamanho do build: ${BUILD_SIZE}${NC}"
        fi
    else
        echo -e "${RED}❌ Erro no build!${NC}"
        echo "Corrija os erros antes de fazer deploy."
        exit 1
    fi
else
    echo -e "${BLUE}⏭️  Pulando build local${NC}"
fi

# 5. Git
echo ""
echo -e "${YELLOW}[5/8]${NC} Verificando Git..."
if ! command_exists git; then
    echo -e "${RED}❌ Git não encontrado!${NC}"
    echo "Instale em: https://git-scm.com"
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "Repositório Git não inicializado."
    if ask_yes_no "Deseja inicializar Git?"; then
        git init
        git add .
        git commit -m "🚀 Initial commit - V7 Finance"
        git branch -M main
        echo -e "${GREEN}✅ Git inicializado!${NC}"
    fi
else
    echo -e "${GREEN}✅ Git já inicializado${NC}"
    
    # Verificar mudanças
    if [[ -n $(git status -s) ]]; then
        echo ""
        echo -e "${YELLOW}Arquivos modificados:${NC}"
        git status -s
        echo ""
        
        if ask_yes_no "Deseja commitar as mudanças?"; then
            read -p "Digite a mensagem do commit: " commit_msg
            git add .
            git commit -m "$commit_msg"
            echo -e "${GREEN}✅ Commit realizado!${NC}"
        fi
    else
        echo -e "${GREEN}✅ Nenhuma mudança para commitar${NC}"
    fi
fi

# 6. GitHub
echo ""
echo -e "${YELLOW}[6/8]${NC} Configurando GitHub..."
if git remote get-url origin >/dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✅ Remote configurado: ${REMOTE_URL}${NC}"
    
    if ask_yes_no "Deseja fazer push para GitHub?"; then
        echo "Fazendo push..."
        git push -u origin main
        echo -e "${GREEN}✅ Push realizado!${NC}"
    fi
else
    echo "Remote não configurado."
    if ask_yes_no "Deseja configurar GitHub?"; then
        read -p "Cole a URL do repositório GitHub (ex: https://github.com/usuario/v7-finance.git): " repo_url
        git remote add origin "$repo_url"
        git push -u origin main
        echo -e "${GREEN}✅ GitHub configurado e push realizado!${NC}"
    fi
fi

# 7. Vercel CLI
echo ""
echo -e "${YELLOW}[7/8]${NC} Verificando Vercel CLI..."
if ! command_exists vercel; then
    echo "Vercel CLI não encontrado."
    if ask_yes_no "Deseja instalar Vercel CLI?"; then
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI instalado!${NC}"
    else
        echo -e "${YELLOW}⚠️  Você precisará instalar manualmente: npm install -g vercel${NC}"
    fi
fi

# 8. Deploy
echo ""
echo -e "${YELLOW}[8/8]${NC} Deploy no Vercel..."
echo ""
echo -e "${BLUE}Escolha o método de deploy:${NC}"
echo "1) Via Vercel CLI (recomendado para primeira vez)"
echo "2) Apenas mostrar instruções para deploy via Dashboard"
echo "3) Pular deploy (fazer depois)"
echo ""
read -p "Escolha (1/2/3): " deploy_choice

case $deploy_choice in
    1)
        if command_exists vercel; then
            echo ""
            echo -e "${BLUE}Iniciando deploy com Vercel CLI...${NC}"
            echo -e "${YELLOW}⚠️  IMPORTANTE: Configure as variáveis de ambiente após o deploy!${NC}"
            echo ""
            
            if ask_yes_no "Continuar com deploy?"; then
                vercel
                
                echo ""
                echo -e "${GREEN}✅ Deploy iniciado!${NC}"
                echo ""
                echo -e "${YELLOW}📋 PRÓXIMOS PASSOS IMPORTANTES:${NC}"
                echo -e "${BLUE}1.${NC} Acesse: https://vercel.com/dashboard"
                echo -e "${BLUE}2.${NC} Vá em Settings → Environment Variables"
                echo -e "${BLUE}3.${NC} Adicione:"
                echo "   - VITE_SUPABASE_URL = https://oajntbrqzjbgfwyuocdi.supabase.co"
                echo "   - VITE_SUPABASE_ANON_KEY = [sua chave anon]"
                echo -e "${BLUE}4.${NC} Redeploy o projeto"
                echo ""
                
                if ask_yes_no "Deseja fazer deploy em produção agora?"; then
                    vercel --prod
                    echo -e "${GREEN}✅ Deploy em produção concluído!${NC}"
                fi
            fi
        else
            echo -e "${RED}❌ Vercel CLI não está instalado!${NC}"
            echo "Instale com: npm install -g vercel"
        fi
        ;;
    2)
        echo ""
        echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║     📋 Instruções para Deploy Manual      ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}1.${NC} Acesse: ${BLUE}https://vercel.com/new${NC}"
        echo -e "${YELLOW}2.${NC} Clique em 'Import Git Repository'"
        echo -e "${YELLOW}3.${NC} Escolha seu repositório: v7-finance"
        echo -e "${YELLOW}4.${NC} Configure as variáveis de ambiente:"
        echo ""
        echo "   ${GREEN}VITE_SUPABASE_URL${NC}"
        echo "   https://oajntbrqzjbgfwyuocdi.supabase.co"
        echo ""
        echo "   ${GREEN}VITE_SUPABASE_ANON_KEY${NC}"
        echo "   [Cole sua chave anon do Supabase]"
        echo ""
        echo -e "${YELLOW}5.${NC} Marque: ✅ Production ✅ Preview ✅ Development"
        echo -e "${YELLOW}6.${NC} Clique em 'Deploy'"
        echo ""
        ;;
    3)
        echo -e "${BLUE}⏭️  Deploy pulado${NC}"
        echo "Execute este script novamente quando estiver pronto!"
        ;;
    *)
        echo -e "${RED}Opção inválida!${NC}"
        ;;
esac

# Resumo final
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            ✅ PROCESSO CONCLUÍDO!         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📦 Próximos passos:${NC}"
echo ""
echo "1️⃣  Se ainda não fez, configure as variáveis de ambiente no Vercel:"
echo "   → https://vercel.com/dashboard"
echo ""
echo "2️⃣  Acesse seu projeto e teste todas as funcionalidades"
echo ""
echo "3️⃣  Consulte os guias em:"
echo "   → DEPLOY_VERCEL_RAPIDO.md"
echo "   → CHECKLIST_DEPLOY.md"
echo ""
echo -e "${BLUE}📞 Links úteis:${NC}"
echo "   → Vercel: https://vercel.com/dashboard"
echo "   → Supabase: https://supabase.com/dashboard/project/oajntbrqzjbgfwyuocdi"
echo ""
echo -e "${GREEN}🎉 Boa sorte com seu deploy! 🎉${NC}"
echo ""

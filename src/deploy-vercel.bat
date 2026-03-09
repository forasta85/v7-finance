@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: 🚀 Script de Deploy Automatizado - V7 Finance no Vercel (Windows)
:: Execute com: deploy-vercel.bat

title V7 Finance - Deploy no Vercel

echo.
echo ╔════════════════════════════════════════════╗
echo ║   🚀 V7 Finance - Deploy no Vercel       ║
echo ╚════════════════════════════════════════════╝
echo.

:: Verificar Node.js
echo [1/8] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js instalado: %NODE_VERSION%

:: Verificar npm
echo [2/8] Verificando npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm instalado: %NPM_VERSION%

:: Instalar dependências
echo.
echo [3/8] Instalando dependências...
set /p INSTALL_DEPS="Deseja reinstalar dependências? (s/n): "
if /i "%INSTALL_DEPS%"=="s" (
    echo Instalando pacotes...
    call npm install
    if %errorlevel% equ 0 (
        echo ✅ Dependências instaladas!
    ) else (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
) else (
    echo ⏭️  Pulando instalação de dependências
)

:: Build local
echo.
echo [4/8] Testando build local...
set /p BUILD_LOCAL="Deseja testar o build localmente? (s/n): "
if /i "%BUILD_LOCAL%"=="s" (
    echo Executando build...
    call npm run build
    if %errorlevel% equ 0 (
        echo ✅ Build concluído com sucesso!
        if exist "dist" (
            echo 📦 Build gerado na pasta dist/
        )
    ) else (
        echo ❌ Erro no build!
        echo Corrija os erros antes de fazer deploy.
        pause
        exit /b 1
    )
) else (
    echo ⏭️  Pulando build local
)

:: Verificar Git
echo.
echo [5/8] Verificando Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado!
    echo Instale em: https://git-scm.com
    pause
    exit /b 1
)

if not exist ".git" (
    echo Repositório Git não inicializado.
    set /p INIT_GIT="Deseja inicializar Git? (s/n): "
    if /i "!INIT_GIT!"=="s" (
        git init
        git add .
        git commit -m "🚀 Initial commit - V7 Finance"
        git branch -M main
        echo ✅ Git inicializado!
    )
) else (
    echo ✅ Git já inicializado
    
    :: Verificar mudanças
    git status -s > temp_status.txt
    set /p GIT_STATUS=<temp_status.txt
    del temp_status.txt
    
    if not "!GIT_STATUS!"=="" (
        echo.
        echo Arquivos modificados detectados.
        set /p DO_COMMIT="Deseja commitar as mudanças? (s/n): "
        if /i "!DO_COMMIT!"=="s" (
            set /p COMMIT_MSG="Digite a mensagem do commit: "
            git add .
            git commit -m "!COMMIT_MSG!"
            echo ✅ Commit realizado!
        )
    ) else (
        echo ✅ Nenhuma mudança para commitar
    )
)

:: GitHub
echo.
echo [6/8] Configurando GitHub...
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
    echo ✅ Remote configurado: !REMOTE_URL!
    
    set /p DO_PUSH="Deseja fazer push para GitHub? (s/n): "
    if /i "!DO_PUSH!"=="s" (
        echo Fazendo push...
        git push -u origin main
        echo ✅ Push realizado!
    )
) else (
    echo Remote não configurado.
    set /p CONFIG_GITHUB="Deseja configurar GitHub? (s/n): "
    if /i "!CONFIG_GITHUB!"=="s" (
        set /p REPO_URL="Cole a URL do repositório GitHub: "
        git remote add origin !REPO_URL!
        git push -u origin main
        echo ✅ GitHub configurado e push realizado!
    )
)

:: Vercel CLI
echo.
echo [7/8] Verificando Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI não encontrado.
    set /p INSTALL_VERCEL="Deseja instalar Vercel CLI? (s/n): "
    if /i "!INSTALL_VERCEL!"=="s" (
        call npm install -g vercel
        echo ✅ Vercel CLI instalado!
    ) else (
        echo ⚠️  Você precisará instalar manualmente: npm install -g vercel
    )
) else (
    echo ✅ Vercel CLI instalado
)

:: Deploy
echo.
echo [8/8] Deploy no Vercel...
echo.
echo Escolha o método de deploy:
echo 1) Via Vercel CLI (recomendado para primeira vez)
echo 2) Apenas mostrar instruções para deploy via Dashboard
echo 3) Pular deploy (fazer depois)
echo.
set /p DEPLOY_CHOICE="Escolha (1/2/3): "

if "%DEPLOY_CHOICE%"=="1" (
    where vercel >nul 2>&1
    if %errorlevel% equ 0 (
        echo.
        echo Iniciando deploy com Vercel CLI...
        echo ⚠️  IMPORTANTE: Configure as variáveis de ambiente após o deploy!
        echo.
        
        set /p CONTINUE_DEPLOY="Continuar com deploy? (s/n): "
        if /i "!CONTINUE_DEPLOY!"=="s" (
            call vercel
            
            echo.
            echo ✅ Deploy iniciado!
            echo.
            echo 📋 PRÓXIMOS PASSOS IMPORTANTES:
            echo 1. Acesse: https://vercel.com/dashboard
            echo 2. Vá em Settings → Environment Variables
            echo 3. Adicione:
            echo    - VITE_SUPABASE_URL = https://oajntbrqzjbgfwyuocdi.supabase.co
            echo    - VITE_SUPABASE_ANON_KEY = [sua chave anon]
            echo 4. Redeploy o projeto
            echo.
            
            set /p DEPLOY_PROD="Deseja fazer deploy em produção agora? (s/n): "
            if /i "!DEPLOY_PROD!"=="s" (
                call vercel --prod
                echo ✅ Deploy em produção concluído!
            )
        )
    ) else (
        echo ❌ Vercel CLI não está instalado!
        echo Instale com: npm install -g vercel
    )
) else if "%DEPLOY_CHOICE%"=="2" (
    echo.
    echo ╔════════════════════════════════════════════╗
    echo ║     📋 Instruções para Deploy Manual      ║
    echo ╚════════════════════════════════════════════╝
    echo.
    echo 1. Acesse: https://vercel.com/new
    echo 2. Clique em 'Import Git Repository'
    echo 3. Escolha seu repositório: v7-finance
    echo 4. Configure as variáveis de ambiente:
    echo.
    echo    VITE_SUPABASE_URL
    echo    https://oajntbrqzjbgfwyuocdi.supabase.co
    echo.
    echo    VITE_SUPABASE_ANON_KEY
    echo    [Cole sua chave anon do Supabase]
    echo.
    echo 5. Marque: ✅ Production ✅ Preview ✅ Development
    echo 6. Clique em 'Deploy'
    echo.
) else if "%DEPLOY_CHOICE%"=="3" (
    echo ⏭️  Deploy pulado
    echo Execute este script novamente quando estiver pronto!
) else (
    echo ❌ Opção inválida!
)

:: Resumo final
echo.
echo ╔════════════════════════════════════════════╗
echo ║            ✅ PROCESSO CONCLUÍDO!         ║
echo ╚════════════════════════════════════════════╝
echo.
echo 📦 Próximos passos:
echo.
echo 1️⃣  Se ainda não fez, configure as variáveis de ambiente no Vercel:
echo    → https://vercel.com/dashboard
echo.
echo 2️⃣  Acesse seu projeto e teste todas as funcionalidades
echo.
echo 3️⃣  Consulte os guias em:
echo    → DEPLOY_VERCEL_RAPIDO.md
echo    → CHECKLIST_DEPLOY.md
echo.
echo 📞 Links úteis:
echo    → Vercel: https://vercel.com/dashboard
echo    → Supabase: https://supabase.com/dashboard/project/oajntbrqzjbgfwyuocdi
echo.
echo 🎉 Boa sorte com seu deploy! 🎉
echo.

pause

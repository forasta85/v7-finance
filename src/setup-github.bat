@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: 🚀 Setup GitHub Automático - V7 Finance (Windows)

title V7 Finance - Setup GitHub

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║     🚀 Setup GitHub - V7 Finance          ║
echo ║                                            ║
echo ║     Vou te guiar passo a passo!           ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.
timeout /t 2 > nul

:: Verificar Git
echo [1/6] Verificando Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado!
    echo Instale em: https://git-scm.com
    pause
    exit /b 1
)
echo ✅ Git instalado!
echo.
timeout /t 1 > nul

:: Verificar repositório
if exist ".git" (
    echo [2/6] Repositório Git já existe!
    echo.
    
    git remote get-url origin >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('git remote get-url origin') do set CURRENT_REMOTE=%%i
        echo Remote atual: !CURRENT_REMOTE!
        echo.
        
        set /p KEEP_REMOTE="Deseja manter este remote? (s/n): "
        if /i "!KEEP_REMOTE!"=="n" (
            git remote remove origin
            echo Remote removido
            set NEED_REMOTE=true
        ) else (
            set NEED_REMOTE=false
        )
    ) else (
        set NEED_REMOTE=true
    )
) else (
    echo [2/6] Inicializando Git...
    git init
    git branch -M main
    echo ✅ Git inicializado!
    set NEED_REMOTE=true
)
echo.
timeout /t 1 > nul

:: Instruções para criar repositório
if "!NEED_REMOTE!"=="true" (
    echo ╔════════════════════════════════════════════╗
    echo ║  ATENÇÃO: SIGA ESTAS INSTRUÇÕES           ║
    echo ╚════════════════════════════════════════════╝
    echo.
    echo PASSO 1: Abra este link no navegador:
    echo.
    echo     https://github.com/new
    echo.
    echo PASSO 2: Preencha apenas 1 campo:
    echo.
    echo     Repository name: v7-finance
    echo.
    echo PASSO 3: Clique em:
    echo.
    echo     [ Create repository ]
    echo.
    echo PASSO 4: Copie a URL que apareceu. Deve ser algo como:
    echo.
    echo     https://github.com/SEU_USUARIO/v7-finance.git
    echo.
    echo ════════════════════════════════════════════
    echo.
    
    set /p OPEN_BROWSER="Deseja que eu abra o GitHub no navegador agora? (s/n): "
    if /i "!OPEN_BROWSER!"=="s" (
        start https://github.com/new
        echo ✅ Abrindo navegador...
    )
    
    echo.
    pause
    echo.
    
    :: Pedir URL do repositório
    :ask_url
    set /p REPO_URL="Cole a URL do repositório aqui: "
    
    :: Validação básica
    echo !REPO_URL! | findstr /C:"github.com" >nul
    if %errorlevel% neq 0 (
        echo ❌ URL inválida!
        echo A URL deve conter github.com
        echo.
        goto ask_url
    )
    
    echo !REPO_URL! | findstr /C:".git" >nul
    if %errorlevel% neq 0 (
        echo ❌ URL inválida!
        echo A URL deve terminar com .git
        echo.
        goto ask_url
    )
    
    echo ✅ URL válida!
    echo.
    
    :: Adicionar remote
    echo [3/6] Adicionando remote...
    git remote add origin "!REPO_URL!"
    echo ✅ Remote adicionado!
) else (
    echo [3/6] Remote já configurado!
)
echo.
timeout /t 1 > nul

:: Verificar mudanças
echo [4/6] Verificando arquivos...
git status -s > temp_status.txt
set /p HAS_CHANGES=<temp_status.txt
del temp_status.txt

if not "!HAS_CHANGES!"=="" (
    echo Arquivos modificados detectados
    echo.
    
    set /p ADD_ALL="Deseja adicionar todos os arquivos? (s/n): "
    if /i "!ADD_ALL!"=="s" (
        git add .
        echo ✅ Arquivos adicionados!
    )
) else (
    echo ✅ Nenhuma mudança pendente
)
echo.
timeout /t 1 > nul

:: Commit
echo [5/6] Criando commit...
git status --porcelain > temp_status2.txt
set /p HAS_STAGED=<temp_status2.txt
del temp_status2.txt

if not "!HAS_STAGED!"=="" (
    set /p COMMIT_MSG="Mensagem do commit [Deploy V7 Finance]: "
    if "!COMMIT_MSG!"=="" set COMMIT_MSG=Deploy V7 Finance
    
    git commit -m "!COMMIT_MSG!"
    echo ✅ Commit criado!
) else (
    echo Nada para commitar
)
echo.
timeout /t 1 > nul

:: Push
echo [6/6] Fazendo push para GitHub...
echo.
echo Enviando arquivos para GitHub...
echo.

git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ✅ Push realizado com sucesso!
    echo.
    
    :: Extrair info do repo
    for /f "tokens=4 delims=/" %%a in ("!REPO_URL!") do set GITHUB_USER=%%a
    for /f "tokens=5 delims=/." %%a in ("!REPO_URL!") do set REPO_NAME=%%a
    
    echo ════════════════════════════════════════════
    echo.
    echo   📦 Seu repositório está em:
    echo.
    echo      https://github.com/!GITHUB_USER!/!REPO_NAME!
    echo.
    echo ════════════════════════════════════════════
) else (
    echo.
    echo ❌ Erro ao fazer push!
    echo.
    echo Possíveis causas:
    echo   - Credenciais inválidas
    echo   - Repositório não existe
    echo   - Sem permissão de escrita
    echo.
    echo Tente:
    echo   git push -u origin main
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║     ✅ GITHUB CONFIGURADO COM SUCESSO!    ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.

:: Próximos passos
echo 🎉 Próximos passos:
echo.
echo 1️⃣  Acessar Vercel: https://vercel.com/new
echo.
echo 2️⃣  Importar repositório do GitHub
echo.
echo 3️⃣  Configurar variáveis de ambiente:
echo.
echo     VITE_SUPABASE_URL
echo     https://oajntbrqzjbgfwyuocdi.supabase.co
echo.
echo     VITE_SUPABASE_ANON_KEY
echo     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
echo.
echo 4️⃣  Clicar em Deploy
echo.
echo ════════════════════════════════════════════
echo.

set /p OPEN_VERCEL="Deseja que eu abra o Vercel no navegador agora? (s/n): "
if /i "!OPEN_VERCEL!"=="s" (
    start https://vercel.com/new
    echo ✅ Abrindo Vercel...
)

echo.
echo 📚 Documentação completa:
echo   - DEPLOY_SUPER_FACIL.md
echo   - DEPLOY_VERCEL_RAPIDO.md
echo   - README_DEPLOY.md
echo.
echo 🚀 Boa sorte com seu deploy!
echo.

pause

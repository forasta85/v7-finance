@echo off
setlocal enabledelayedexpansion

:: Primeiro Push para GitHub - V7 Finance
:: Resolve: "GitHub repository does not contain the requested branch"

title V7 Finance - Primeiro Push

cls
echo.
echo ================================================
echo.
echo    PRIMEIRO PUSH PARA GITHUB
echo    (Resolve repositorio vazio)
echo.
echo ================================================
echo.

:: Verificar Git
echo [1/8] Verificando Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Git nao encontrado!
    echo.
    echo Instale Git em: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git encontrado!
echo.

:: Verificar se e repositorio
echo [2/8] Verificando repositorio...
if not exist ".git" (
    echo [AVISO] Nao e um repositorio Git!
    echo.
    echo Inicializando...
    git init
    echo [OK] Repositorio inicializado!
) else (
    echo [OK] Repositorio Git existe!
)
echo.

:: Verificar/configurar Git user
echo [3/8] Verificando configuracao Git...
for /f "tokens=*" %%i in ('git config --global user.name 2^>nul') do set GIT_USER=%%i
for /f "tokens=*" %%i in ('git config --global user.email 2^>nul') do set GIT_EMAIL=%%i

if "!GIT_USER!"=="" (
    echo [AVISO] Git user nao configurado!
    echo.
    set /p GIT_USER="Digite seu nome: "
    set /p GIT_EMAIL="Digite seu email: "
    
    git config --global user.name "!GIT_USER!"
    git config --global user.email "!GIT_EMAIL!"
    echo [OK] Git configurado!
) else (
    echo [OK] Git ja configurado!
    echo Nome: !GIT_USER!
    echo Email: !GIT_EMAIL!
)
echo.

:: Verificar remote
echo [4/8] Verificando remote...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Remote nao configurado!
    echo.
    echo Digite a URL do seu repositorio GitHub:
    echo Exemplo: https://github.com/usuario/v7-finance.git
    echo.
    set /p REPO_URL="URL: "
    
    git remote add origin !REPO_URL!
    echo [OK] Remote adicionado!
) else (
    for /f "tokens=*" %%i in ('git remote get-url origin') do set REPO_URL=%%i
    echo [OK] Remote ja configurado!
    echo URL: !REPO_URL!
)
echo.

:: Limpar repositorios aninhados
echo [5/8] Limpando repositorios aninhados...
if exist "desktop-tutorial\.git" (
    echo Removendo desktop-tutorial...
    git rm --cached desktop-tutorial 2>nul
    rmdir /s /q desktop-tutorial 2>nul
    echo [OK] Removido!
)
if exist "node_modules\.git" (
    echo Removendo .git de node_modules...
    rmdir /s /q node_modules\.git 2>nul
)
echo [OK] Limpeza concluida!
echo.

:: Adicionar todos os arquivos
echo [6/8] Adicionando arquivos...
git add .
echo [OK] Arquivos adicionados!
echo.

:: Criar primeiro commit
echo [7/8] Criando primeiro commit...
git commit -m "Initial commit: V7 Finance - Sistema completo de gestao financeira" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Commit criado!
) else (
    echo [AVISO] Commit ja existe ou nada para commitar
)
echo.

:: Configurar branch main
echo Configurando branch main...
git branch -M main
echo [OK] Branch configurada!
echo.

:: Push para GitHub
echo [8/8] Enviando para GitHub...
echo.
echo ================================================
echo.
echo ATENCAO:
echo.
echo O Git pode pedir suas credenciais:
echo.
echo Username: seu_usuario_github
echo Password: USE SEU PERSONAL ACCESS TOKEN
echo          (NAO sua senha do GitHub!)
echo.
echo Como criar token:
echo   1. https://github.com/settings/tokens
echo   2. Generate new token (classic)
echo   3. Marque: repo, workflow
echo   4. Generate token
echo   5. COPIE e use como senha
echo.
echo ================================================
echo.

set /p CONTINUE="Pronto para fazer push? (s/n): "

if /i "!CONTINUE!"=="s" (
    echo.
    echo Fazendo push...
    echo.
    
    git push -u origin main
    
    if %errorlevel% equ 0 (
        echo.
        echo ================================================
        echo.
        echo [OK] SUCESSO!
        echo.
        echo ================================================
        echo.
        echo Codigo enviado para GitHub!
        echo.
        echo Verifique em: !REPO_URL!
        echo.
        echo ================================================
        echo.
        echo PROXIMOS PASSOS:
        echo.
        echo 1. Va em: https://vercel.com
        echo 2. Login com GitHub
        echo 3. Import project
        echo 4. Escolha: v7-finance
        echo 5. Configure variaveis de ambiente:
        echo    VITE_SUPABASE_URL
        echo    VITE_SUPABASE_ANON_KEY
        echo 6. Deploy!
        echo.
        
        set /p OPEN_VERCEL="Abrir Vercel agora? (s/n): "
        if /i "!OPEN_VERCEL!"=="s" (
            start https://vercel.com/new
        )
    ) else (
        echo.
        echo [ERRO] Falha no push!
        echo.
        echo Possiveis causas:
        echo   1. Credenciais incorretas
        echo   2. Token invalido/expirado
        echo   3. URL do repositorio errada
        echo   4. Sem permissao no repositorio
        echo.
        echo Solucoes:
        echo.
        echo 1. Verificar URL:
        echo    git remote -v
        echo.
        echo 2. Atualizar URL:
        echo    git remote set-url origin https://github.com/usuario/repo.git
        echo.
        echo 3. Criar token:
        echo    https://github.com/settings/tokens
        echo.
        echo 4. Tentar novamente:
        echo    git push -u origin main
        echo.
        pause
        exit /b 1
    )
) else (
    echo.
    echo Push cancelado.
    echo.
    echo Para fazer push depois:
    echo   git push -u origin main
)

echo.
echo ================================================
echo.
echo Scripts disponiveis:
echo   - verificar-git.bat - Diagnostico
echo   - fix-tudo-e-deploy.bat - Proximos commits
echo.
echo [OK] Script finalizado!
echo.

pause

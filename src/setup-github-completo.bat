@echo off
setlocal enabledelayedexpansion

:: Setup GitHub COMPLETO - Do Zero ao Deploy
:: V7 Finance

title V7 Finance - Setup GitHub Completo

cls
echo.
echo ================================================
echo.
echo    SETUP GITHUB COMPLETO
echo    (Do Zero ao Deploy!)
echo.
echo ================================================
echo.
echo Este script vai:
echo   1. Verificar Git
echo   2. Configurar Git
echo   3. Inicializar repositorio local
echo   4. Conectar ao GitHub
echo   5. Fazer primeiro push
echo.
pause
cls

:: PARTE 1: Verificar Git
echo.
echo ================================================
echo   PARTE 1: Verificando Git
echo ================================================
echo.

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Git NAO esta instalado!
    echo.
    echo Por favor, instale Git:
    echo   1. Acesse: https://git-scm.com/download/win
    echo   2. Baixe e instale
    echo   3. Feche este CMD e abra novamente
    echo   4. Execute este script novamente
    echo.
    
    set /p OPEN_GIT="Deseja abrir a pagina de download? (s/n): "
    if /i "!OPEN_GIT!"=="s" (
        start https://git-scm.com/download/win
    )
    
    pause
    exit /b 1
)

git --version
echo.
echo [OK] Git instalado!
echo.
pause

:: PARTE 2: Configurar Git
cls
echo.
echo ================================================
echo   PARTE 2: Configurar Git
echo ================================================
echo.

:: Verificar se ja esta configurado
for /f "tokens=*" %%i in ('git config --global user.name 2^>nul') do set CURRENT_NAME=%%i
for /f "tokens=*" %%i in ('git config --global user.email 2^>nul') do set CURRENT_EMAIL=%%i

if not "!CURRENT_NAME!"=="" (
    echo Configuracao atual:
    echo   Nome:  !CURRENT_NAME!
    echo   Email: !CURRENT_EMAIL!
    echo.
    
    set /p USE_CURRENT="Usar esta configuracao? (s/n): "
    if /i "!USE_CURRENT!"=="s" (
        echo [OK] Usando configuracao existente!
        goto :skip_config
    )
)

echo.
echo Configure seu nome e email do GitHub:
echo.

set /p GIT_NAME="Digite seu nome completo: "
set /p GIT_EMAIL="Digite seu email do GitHub: "

echo.
echo Configurando...

git config --global user.name "!GIT_NAME!"
git config --global user.email "!GIT_EMAIL!"

echo.
echo [OK] Git configurado!
echo   Nome:  !GIT_NAME!
echo   Email: !GIT_EMAIL!
echo.

:skip_config
pause

:: PARTE 3: Verificar pasta do projeto
cls
echo.
echo ================================================
echo   PARTE 3: Verificar Projeto
echo ================================================
echo.

if not exist "package.json" (
    echo [ERRO] package.json nao encontrado!
    echo.
    echo Voce NAO esta na pasta do projeto!
    echo.
    echo Execute este script dentro da pasta v7-finance:
    echo   cd C:\caminho\para\v7-finance
    echo   setup-github-completo.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Pasta do projeto correta!
echo.

:: Verificar se ja e um repositorio Git
if exist ".git" (
    echo [AVISO] Este projeto JA e um repositorio Git!
    echo.
    
    :: Verificar se tem remote
    git remote get-url origin >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=*" %%i in ('git remote get-url origin') do set EXISTING_REMOTE=%%i
        echo Remote atual: !EXISTING_REMOTE!
        echo.
        
        set /p RECREATE="Deseja reconfigurar? (s/n): "
        if /i "!RECREATE!"=="n" (
            echo.
            echo Operacao cancelada.
            pause
            exit /b 0
        )
        
        echo.
        echo Removendo remote atual...
        git remote remove origin
    )
    
    echo [OK] Repositorio Git existente!
    goto :skip_init
)

echo Inicializando Git...
git init
echo.
echo [OK] Repositorio Git inicializado!

:skip_init
echo.
pause

:: PARTE 4: Conectar ao GitHub
cls
echo.
echo ================================================
echo   PARTE 4: Conectar ao GitHub
echo ================================================
echo.
echo ANTES DE CONTINUAR:
echo.
echo 1. Acesse: https://github.com/new
echo 2. Repository name: v7-finance
echo 3. NAO marque nenhuma opcao extra
echo 4. Clique em "Create repository"
echo 5. Copie a URL do repositorio
echo.
echo Exemplo de URL:
echo   https://github.com/SEU_USUARIO/v7-finance.git
echo.

set /p OPEN_GITHUB="Deseja abrir GitHub para criar repo? (s/n): "
if /i "!OPEN_GITHUB!"=="s" (
    start https://github.com/new
    echo.
    echo [AGUARDE] Aguardando voce criar o repositorio...
    echo.
)

set /p REPO_URL="Cole a URL do repositorio: "

echo.
echo Adicionando remote...

git remote add origin !REPO_URL! 2>nul

if %errorlevel% neq 0 (
    echo [AVISO] Remote ja existe, atualizando...
    git remote set-url origin !REPO_URL!
)

echo.
echo [OK] Remote configurado!
echo   URL: !REPO_URL!
echo.
pause

:: PARTE 5: Limpar problemas
cls
echo.
echo ================================================
echo   PARTE 5: Limpeza de Problemas
echo ================================================
echo.

echo Removendo repositorios aninhados...

:: Remover desktop-tutorial
if exist "desktop-tutorial\.git" (
    echo   - Removendo desktop-tutorial
    git rm --cached desktop-tutorial 2>nul
    rmdir /s /q desktop-tutorial 2>nul
)

:: Remover outros possiveis repositorios aninhados
if exist "node_modules\.git" (
    echo   - Removendo .git de node_modules
    rmdir /s /q node_modules\.git 2>nul
)

echo.
echo [OK] Limpeza concluida!
echo.
pause

:: PARTE 6: Primeiro Commit
cls
echo.
echo ================================================
echo   PARTE 6: Primeiro Commit
echo ================================================
echo.

echo Adicionando todos os arquivos...
git add .

echo.
echo Criando commit inicial...
git commit -m "Initial commit: V7 Finance - Sistema completo de gestao financeira" 2>nul

if %errorlevel% equ 0 (
    echo [OK] Commit criado!
) else (
    echo [AVISO] Nada para commitar (ja commitado ou erro)
)

echo.
echo Configurando branch main...
git branch -M main

echo [OK] Branch configurada!
echo.
pause

:: PARTE 7: Push para GitHub
cls
echo.
echo ================================================
echo   PARTE 7: Push para GitHub
echo ================================================
echo.
echo [ATENCAO]
echo.
echo O Git pode pedir credenciais:
echo.
echo Username: seu_usuario_github
echo Password: USE SEU PERSONAL ACCESS TOKEN
echo          (NAO USE SUA SENHA!)
echo.
echo Como criar token:
echo   1. https://github.com/settings/tokens
echo   2. Generate new token (classic)
echo   3. Marque: repo, workflow
echo   4. Generate token
echo   5. COPIE o token gerado
echo   6. Use como senha quando o Git pedir
echo.

set /p OPEN_TOKEN="Deseja abrir pagina de tokens? (s/n): "
if /i "!OPEN_TOKEN!"=="s" (
    start https://github.com/settings/tokens
    echo.
    echo [AGUARDE] Aguardando voce criar o token...
    echo.
    pause
)

echo.
echo Fazendo push...
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo.
    echo    SUCESSO!
    echo.
    echo ================================================
    echo.
    echo [OK] Codigo enviado para GitHub!
    echo.
    echo Verifique em:
    echo   !REPO_URL!
    echo.
    echo ================================================
    echo.
    echo PROXIMOS PASSOS:
    echo.
    echo 1. Acesse: https://vercel.com
    echo 2. Faca login com GitHub
    echo 3. Importe o projeto v7-finance
    echo 4. Configure variaveis de ambiente
    echo 5. Deploy!
    echo.
    
    set /p OPEN_VERCEL="Deseja abrir Vercel agora? (s/n): "
    if /i "!OPEN_VERCEL!"=="s" (
        start https://vercel.com/new
    )
) else (
    echo.
    echo [ERRO] Erro ao fazer push!
    echo.
    echo Possiveis causas:
    echo   1. Token invalido ou expirado
    echo   2. URL do repositorio incorreta
    echo   3. Sem permissao no repositorio
    echo.
    echo Tente novamente:
    echo   git push -u origin main
    echo.
)

echo.
echo ================================================
echo.
echo Documentacao:
echo   - GITHUB_DO_ZERO.md - Guia completo
echo   - EXECUTAR_AQUI.md - Onde executar scripts
echo.
echo Para futuros commits, use:
echo   fix-tudo-e-deploy.bat
echo.

pause

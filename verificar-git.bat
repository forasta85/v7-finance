@echo off
setlocal enabledelayedexpansion

:: Verificar Estado do Git - V7 Finance

title V7 Finance - Verificar Git

cls
echo.
echo ================================================
echo.
echo    VERIFICAR ESTADO DO GIT
echo    (Diagnostico completo)
echo.
echo ================================================
echo.

:: Verificar se e repositorio Git
echo [1/6] Verificando se e repositorio Git...
if not exist ".git" (
    echo [ERRO] Este projeto NAO e um repositorio Git!
    echo.
    echo Solucao: Execute setup-github-completo.bat
    echo.
    pause
    exit /b 1
)
echo [OK] E um repositorio Git!
echo.

:: Verificar remote
echo [2/6] Verificando remote...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Remote NAO configurado!
    echo.
    echo Solucao: Execute setup-github-completo.bat
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
echo [OK] Remote configurado!
echo URL: !REMOTE_URL!
echo.

:: Verificar branch atual
echo [3/6] Verificando branch...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if "!CURRENT_BRANCH!"=="" (
    echo [AVISO] Nenhuma branch ativa!
    echo.
    echo Isso significa que nenhum commit foi feito ainda.
    set CURRENT_BRANCH=nenhuma
) else (
    echo [OK] Branch atual: !CURRENT_BRANCH!
)
echo.

:: Verificar commits
echo [4/6] Verificando commits...
git log --oneline -1 >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Nenhum commit encontrado!
    echo.
    echo O repositorio local esta vazio.
    set HAS_COMMITS=0
) else (
    for /f "tokens=*" %%i in ('git log --oneline -1') do set LAST_COMMIT=%%i
    echo [OK] Ultimo commit: !LAST_COMMIT!
    set HAS_COMMITS=1
)
echo.

:: Verificar status
echo [5/6] Verificando arquivos...
git status --short > temp_status.txt
set /a FILE_COUNT=0
for /f %%i in ('type temp_status.txt ^| find /c /v ""') do set FILE_COUNT=%%i
del temp_status.txt

if !FILE_COUNT! gtr 0 (
    echo [AVISO] !FILE_COUNT! arquivo(s) modificado(s) nao commitado(s)
) else (
    echo [OK] Nenhum arquivo modificado
)
echo.

:: Verificar se GitHub esta vazio
echo [6/6] Verificando GitHub...
git ls-remote origin HEAD >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Repositorio no GitHub esta VAZIO!
    echo.
    echo Nenhum commit foi enviado ainda.
    set GITHUB_EMPTY=1
) else (
    echo [OK] GitHub tem commits!
    set GITHUB_EMPTY=0
)
echo.

:: Resumo e solucoes
echo ================================================
echo.
echo RESUMO:
echo.
echo Remote: !REMOTE_URL!
echo Branch local: !CURRENT_BRANCH!
echo Commits locais: !HAS_COMMITS!
echo Arquivos modificados: !FILE_COUNT!
echo GitHub vazio: !GITHUB_EMPTY!
echo.
echo ================================================
echo.

:: Sugerir solucao
if !GITHUB_EMPTY! equ 1 (
    echo [SOLUCAO NECESSARIA]
    echo.
    echo Seu repositorio GitHub esta VAZIO!
    echo.
    echo Execute UM destes scripts:
    echo.
    echo 1. primeiro-push.bat         (Recomendado!)
    echo 2. setup-github-completo.bat (Se tiver problemas)
    echo.
) else (
    if !FILE_COUNT! gtr 0 (
        echo [ACAO RECOMENDADA]
        echo.
        echo Voce tem arquivos modificados.
        echo.
        echo Execute: fix-tudo-e-deploy.bat
        echo.
    ) else (
        echo [OK] TUDO CERTO!
        echo.
        echo Seu repositorio esta sincronizado.
        echo.
    )
)

pause

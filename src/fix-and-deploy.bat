@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: 🔧 Fix Vercel Error & Deploy (Windows)

title V7 Finance - Fix & Deploy

cls
echo.
echo ╔════════════════════════════════════════════╗
echo ║                                            ║
echo ║   🔧 Fix Vercel Error ^& Deploy            ║
echo ║                                            ║
echo ╚════════════════════════════════════════════╝
echo.

:: Verificar Git
echo [1/4] Verificando Git...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não encontrado!
    pause
    exit /b 1
)
echo ✅ Git OK!
echo.

:: Verificar mudanças
echo [2/4] Verificando mudanças...
git status -s > temp_status.txt
set /p HAS_CHANGES=<temp_status.txt
del temp_status.txt

if "!HAS_CHANGES!"=="" (
    echo ⚠️  Nenhuma mudança detectada
    echo.
    echo Arquivos corrigidos:
    echo   - vercel.json
    echo   - .vercelignore
    echo   - FIX_VERCEL_ERROR.md
    echo.
) else (
    echo ✅ Mudanças detectadas!
    echo.
    git status -s
)
echo.

:: Adicionar arquivos
echo [3/4] Adicionando arquivos corrigidos...
git add vercel.json .vercelignore FIX_VERCEL_ERROR.md README.md 2>nul
git add LEIA_PRIMEIRO.md COMECE_AQUI.md DEPLOY_SUPER_FACIL.md 2>nul
git add setup-github.sh setup-github.bat 2>nul
git add fix-and-deploy.sh fix-and-deploy.bat 2>nul

echo ✅ Arquivos adicionados
echo.

:: Commit
echo [4/4] Fazendo commit...
git commit -m "Fix: Correção configuração Vercel para build correto" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Commit criado!
) else (
    echo ⚠️  Nada para commitar ou já commitado
)
echo.

:: Push
echo ════════════════════════════════════════════
echo.
echo Pronto para fazer push!
echo.

:: Verificar remote
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Remote não configurado!
    echo.
    echo Execute primeiro:
    echo   setup-github.bat
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
echo Remote: !REMOTE_URL!
echo.

set /p DO_PUSH="Fazer push agora? (s/n): "

if /i "!DO_PUSH!"=="s" (
    echo.
    echo Fazendo push...
    echo.
    
    git push origin main
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Push realizado com sucesso!
        echo.
        echo ════════════════════════════════════════════
        echo.
        echo 🎉 Deploy iniciado automaticamente!
        echo.
        echo O Vercel vai detectar as mudanças e fazer deploy.
        echo.
        echo Acompanhe em:
        echo   https://vercel.com/dashboard
        echo.
        echo Aguarde 2-3 minutos e seu app estará atualizado!
        echo.
        
        set /p OPEN_VERCEL="Deseja abrir o Vercel no navegador? (s/n): "
        if /i "!OPEN_VERCEL!"=="s" (
            start https://vercel.com/dashboard
            echo ✅ Abrindo Vercel...
        )
    ) else (
        echo.
        echo ❌ Erro ao fazer push!
        echo.
        echo Tente manualmente:
        echo   git push origin main
        pause
        exit /b 1
    )
) else (
    echo.
    echo Push cancelado.
    echo.
    echo Para fazer push depois, execute:
    echo   git push origin main
)

echo.
echo ════════════════════════════════════════════
echo.
echo 📚 Documentação adicional:
echo   - FIX_VERCEL_ERROR.md - Guia completo do erro
echo   - COMECE_AQUI.md - Deploy passo a passo
echo   - DEPLOY_SUPER_FACIL.md - Guia rápido
echo.
echo ✅ Correções aplicadas com sucesso!
echo.

pause

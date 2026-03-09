@echo off
setlocal enabledelayedexpansion

:: Fix TUDO & Deploy (Windows)
:: Corrige repositorio aninhado + erro Vercel + faz deploy

title V7 Finance - Fix Completo e Deploy

cls
echo.
echo ================================================
echo.
echo    FIX COMPLETO E DEPLOY
echo    (Corrige tudo automaticamente!)
echo.
echo ================================================
echo.

:: Verificar Git
echo [1/7] Verificando Git...
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

:: Verificar repositorios aninhados
echo [2/7] Verificando repositorios aninhados...
set FOUND_NESTED=0

if exist "desktop-tutorial\.git" (
    echo [AVISO] Encontrado: desktop-tutorial
    set FOUND_NESTED=1
)

if !FOUND_NESTED! equ 1 (
    echo.
    echo [ERRO] Repositorios aninhados encontrados!
    echo.
    echo Vou remover automaticamente...
    echo.
    
    :: Remover desktop-tutorial do Git
    git rm --cached desktop-tutorial 2>nul
    
    :: Deletar pasta desktop-tutorial
    if exist "desktop-tutorial" (
        echo Removendo pasta desktop-tutorial...
        rmdir /s /q desktop-tutorial 2>nul
        echo [OK] Pasta removida!
    )
    
    echo.
    echo [OK] Repositorios aninhados removidos!
) else (
    echo [OK] Nenhum repositorio aninhado encontrado!
)
echo.

:: Limpar outros possiveis problemas
echo [3/7] Limpando arquivos temporarios...
if exist "temp_status.txt" del /q temp_status.txt 2>nul
if exist "node_modules\.git" (
    rmdir /s /q node_modules\.git 2>nul
)
echo [OK] Limpeza concluida!
echo.

:: Verificar remote
echo [4/7] Verificando remote Git...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Remote nao configurado!
    echo.
    echo Execute primeiro:
    echo   setup-github-completo.bat
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
echo [OK] Remote configurado: !REMOTE_URL!
echo.

:: Adicionar todos os arquivos
echo [5/7] Adicionando arquivos corrigidos...
git add vercel.json
git add .vercelignore
git add test-build.bat
git add FIX_DIST_ERROR.md
git add ERRO_CORRIGIDO.md
git add EXECUTE_AGORA_CORRIGIDO.md
git add EXECUTAR_AQUI.md
git add COMANDOS_CORRETOS.md
git add ONDE_EXECUTAR.md
git add .
echo [OK] Arquivos adicionados!
echo.

:: Commit
echo [6/7] Fazendo commit...
git commit -m "Fix: Correcao completa - Repositorio aninhado + Vercel config" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Commit criado!
) else (
    echo [AVISO] Nada para commitar ou ja commitado
)
echo.

:: Push
echo [7/7] Pronto para fazer push!
echo.
echo ================================================
echo.
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
        echo [OK] Push realizado com sucesso!
        echo.
        echo ================================================
        echo.
        echo TUDO CORRIGIDO E DEPLOY INICIADO!
        echo.
        echo O que foi feito:
        echo   - Removido repositorio aninhado
        echo   - Corrigido vercel.json
        echo   - Commit e push realizados
        echo.
        echo O Vercel vai fazer deploy em 2-3 minutos!
        echo.
        echo Acompanhe em:
        echo   https://vercel.com/dashboard
        echo.
        
        set /p OPEN_VERCEL="Deseja abrir o Vercel no navegador? (s/n): "
        if /i "!OPEN_VERCEL!"=="s" (
            start https://vercel.com/dashboard
            echo [OK] Abrindo Vercel...
        )
    ) else (
        echo.
        echo [ERRO] Erro ao fazer push!
        echo.
        echo Possiveis causas:
        echo   1. Credenciais incorretas
        echo   2. Sem permissao no repositorio
        echo   3. Problemas de conexao
        echo.
        echo Tente manualmente:
        echo   git push origin main
        echo.
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
echo ================================================
echo.
echo Guias uteis:
echo   - FIX_REPOSITORIO_ANINHADO.md
echo   - WINDOWS_PASSO_A_PASSO.md
echo   - EXECUTAR_AQUI.md
echo.
echo [OK] Script finalizado!
echo.

pause
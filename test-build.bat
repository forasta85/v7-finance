@echo off
setlocal enabledelayedexpansion

:: Teste de Build Local - V7 Finance

title V7 Finance - Teste de Build

cls
echo.
echo ================================================
echo.
echo    TESTE DE BUILD LOCAL
echo    (Verifica se o build funciona)
echo.
echo ================================================
echo.

:: Verificar Node.js
echo [1/5] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Instale Node.js em: https://nodejs.org
    pause
    exit /b 1
)

node --version
npm --version
echo [OK] Node.js encontrado!
echo.

:: Verificar package.json
echo [2/5] Verificando package.json...
if not exist "package.json" (
    echo [ERRO] package.json nao encontrado!
    echo.
    echo Execute este script na pasta raiz do projeto!
    pause
    exit /b 1
)
echo [OK] package.json encontrado!
echo.

:: Limpar build anterior
echo [3/5] Limpando build anterior...
if exist "dist" (
    echo Removendo pasta dist antiga...
    rmdir /s /q dist
    echo [OK] Pasta dist removida!
) else (
    echo [OK] Nenhuma pasta dist anterior!
)
echo.

:: Instalar dependencias
echo [4/5] Instalando dependencias...
echo.
echo Isto pode levar alguns minutos...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [OK] Dependencias instaladas!
echo.

:: Build
echo [5/5] Executando build...
echo.
echo Isto pode levar 1-2 minutos...
echo.

npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Build falhou!
    echo.
    echo Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo ================================================
echo.
echo [OK] BUILD CONCLUIDO COM SUCESSO!
echo.
echo ================================================
echo.

:: Verificar pasta dist
if exist "dist" (
    echo [OK] Pasta dist criada com sucesso!
    echo.
    echo Conteudo da pasta dist:
    echo.
    dir dist
    echo.
    echo ================================================
    echo.
    echo TUDO CERTO! O build funciona!
    echo.
    echo Agora voce pode fazer deploy no Vercel.
    echo.
) else (
    echo [ERRO] Pasta dist NAO foi criada!
    echo.
    echo Algo deu errado no build.
    pause
    exit /b 1
)

pause

# Fix Vercel Error & Deploy - PowerShell Script
# V7 Finance - Windows Version

$ErrorActionPreference = "Continue"

# Cores
function Write-ColorText {
    param(
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

Clear-Host

Write-Host ""
Write-ColorText "╔════════════════════════════════════════════╗" "Cyan"
Write-ColorText "║                                            ║" "Cyan"
Write-ColorText "║   🔧 Fix Vercel Error & Deploy            ║" "Cyan"
Write-ColorText "║        (PowerShell - Windows)              ║" "Cyan"
Write-ColorText "║                                            ║" "Cyan"
Write-ColorText "╚════════════════════════════════════════════╝" "Cyan"
Write-Host ""

# Verificar Git
Write-ColorText "[1/5] Verificando Git..." "Blue"
$gitVersion = git --version 2>$null
if (-not $gitVersion) {
    Write-ColorText "❌ Git não encontrado!" "Red"
    Write-Host ""
    Write-ColorText "Instale Git em: https://git-scm.com/download/win" "Yellow"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-ColorText "✅ Git instalado: $gitVersion" "Green"
Write-Host ""
Start-Sleep -Seconds 1

# Verificar se está em um repositório Git
Write-ColorText "[2/5] Verificando repositório Git..." "Blue"
if (-not (Test-Path ".git")) {
    Write-ColorText "❌ Não é um repositório Git!" "Red"
    Write-Host ""
    Write-ColorText "Execute primeiro:" "Yellow"
    Write-ColorText "  git init" "White"
    Write-ColorText "  git add ." "White"
    Write-ColorText "  git commit -m 'Initial commit'" "White"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-ColorText "✅ Repositório Git encontrado!" "Green"
Write-Host ""
Start-Sleep -Seconds 1

# Verificar remote
Write-ColorText "[3/5] Verificando remote..." "Blue"
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-ColorText "❌ Remote não configurado!" "Red"
    Write-Host ""
    Write-ColorText "Configure o remote primeiro:" "Yellow"
    Write-ColorText "  git remote add origin https://github.com/USUARIO/v7-finance.git" "White"
    Write-Host ""
    Write-ColorText "Ou execute:" "Yellow"
    Write-ColorText "  .\setup-github.bat" "White"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-ColorText "✅ Remote configurado: $remote" "Green"
Write-Host ""
Start-Sleep -Seconds 1

# Adicionar arquivos
Write-ColorText "[4/5] Adicionando arquivos corrigidos..." "Blue"
git add vercel.json 2>$null
git add .vercelignore 2>$null
git add "FIX_VERCEL_ERROR.md" 2>$null
git add "SOLUCAO_ERRO_VERCEL.md" 2>$null
git add "WINDOWS_SOLUCAO.md" 2>$null
git add "README.md" 2>$null
git add "LEIA_PRIMEIRO.md" 2>$null
git add "COMECE_AQUI.md" 2>$null
git add "FACA_ISSO_AGORA.md" 2>$null
git add "fix-and-deploy-windows.ps1" 2>$null
git add "fix-and-deploy.bat" 2>$null
git add "setup-github.bat" 2>$null

$stagedFiles = git diff --cached --name-only 2>$null
if ($stagedFiles) {
    Write-ColorText "✅ Arquivos adicionados:" "Green"
    $stagedFiles | ForEach-Object { Write-ColorText "  - $_" "Gray" }
} else {
    Write-ColorText "⚠️  Nenhum arquivo para adicionar (já commitado?)" "Yellow"
}
Write-Host ""
Start-Sleep -Seconds 1

# Commit
Write-ColorText "[5/5] Fazendo commit..." "Blue"
$commitMessage = "Fix: Correção configuração Vercel para build correto

- Corrigido vercel.json com buildCommand correto
- Adicionado routes para SPA
- Corrigido URL do Supabase
- Criado .vercelignore
- Adicionados guias de deploy"

git commit -m $commitMessage 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-ColorText "✅ Commit criado!" "Green"
} else {
    Write-ColorText "⚠️  Nada para commitar ou já commitado" "Yellow"
}
Write-Host ""
Start-Sleep -Seconds 1

# Push
Write-ColorText "════════════════════════════════════════════" "Cyan"
Write-Host ""
Write-ColorText "Pronto para fazer push!" "Yellow"
Write-Host ""
Write-ColorText "Remote: $remote" "Gray"
Write-Host ""

$doPush = Read-Host "Fazer push agora? (s/n)"

if ($doPush -eq "s" -or $doPush -eq "S") {
    Write-Host ""
    Write-ColorText "Fazendo push..." "Cyan"
    Write-Host ""
    
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-ColorText "✅ Push realizado com sucesso!" "Green"
        Write-Host ""
        Write-ColorText "════════════════════════════════════════════" "Cyan"
        Write-Host ""
        Write-ColorText "🎉 Deploy iniciado automaticamente!" "Green"
        Write-Host ""
        Write-Host "O Vercel vai detectar as mudanças e fazer deploy."
        Write-Host ""
        Write-Host "Acompanhe em:"
        Write-ColorText "  https://vercel.com/dashboard" "Blue"
        Write-Host ""
        Write-Host "Aguarde 2-3 minutos e seu app estará atualizado!"
        Write-Host ""
        
        $openVercel = Read-Host "Deseja abrir o Vercel no navegador? (s/n)"
        if ($openVercel -eq "s" -or $openVercel -eq "S") {
            Start-Process "https://vercel.com/dashboard"
            Write-ColorText "✅ Abrindo Vercel..." "Green"
        }
    } else {
        Write-Host ""
        Write-ColorText "❌ Erro ao fazer push!" "Red"
        Write-Host ""
        Write-ColorText "Possíveis soluções:" "Yellow"
        Write-Host "1. Verifique suas credenciais do Git"
        Write-Host "2. Verifique se o remote está correto"
        Write-Host "3. Tente fazer push manualmente:"
        Write-ColorText "   git push origin main" "White"
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-ColorText "Push cancelado." "Yellow"
    Write-Host ""
    Write-Host "Para fazer push depois, execute:"
    Write-ColorText "  git push origin main" "White"
}

Write-Host ""
Write-ColorText "════════════════════════════════════════════" "Cyan"
Write-Host ""
Write-ColorText "📚 Documentação adicional:" "Blue"
Write-Host "  - WINDOWS_SOLUCAO.md - Guia para Windows"
Write-Host "  - FIX_VERCEL_ERROR.md - Guia completo do erro"
Write-Host "  - SOLUCAO_ERRO_VERCEL.md - Solução rápida"
Write-Host ""
Write-ColorText "✅ Script finalizado!" "Green"
Write-Host ""

Read-Host "Pressione Enter para sair"

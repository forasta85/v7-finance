# ⚡ EXECUTE ISTO - Windows

## 🎯 Você está no Windows? Use isto!

---

## 📝 PASSO 1: Abrir Prompt de Comando

Pressione as teclas:
```
Win + R
```

Digite:
```
cmd
```

Pressione Enter.

---

## 📝 PASSO 2: Ir para a pasta do projeto

No CMD que abriu, digite (ajuste o caminho):

```cmd
cd C:\Users\SeuNome\Documents\v7-finance
```

**⚠️ IMPORTANTE:** Troque pelo caminho correto!

Para descobrir o caminho:
1. Abra a pasta do projeto no Windows Explorer
2. Clique na barra de endereço
3. Copie o caminho completo
4. Cole no CMD após `cd `

---

## 📝 PASSO 3: Executar o script

Digite e pressione Enter:

```cmd
fix-and-deploy.bat
```

---

## 📝 PASSO 4: Seguir instruções

O script vai perguntar:
```
Fazer push agora? (s/n):
```

Digite: `s` e pressione Enter

---

## ✅ PRONTO!

Aguarde 2-3 minutos e seu app estará atualizado no Vercel!

---

## 🆘 PROBLEMAS?

### ❌ "git não é reconhecido"

**Instale o Git:**
1. Vá em: https://git-scm.com/download/win
2. Baixe e instale
3. **Feche e abra novamente** o CMD
4. Tente novamente

### ❌ "Remote não configurado"

**Execute primeiro:**
```cmd
setup-github.bat
```

Depois execute:
```cmd
fix-and-deploy.bat
```

### ❌ "Acesso negado" ou "Permission denied"

**Configure suas credenciais:**
```cmd
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 💡 ALTERNATIVA: Comandos Diretos

Se o script não funcionar, use comandos diretos:

```cmd
git add .
git commit -m "Fix: Correção Vercel"
git push origin main
```

---

## 🎯 EXEMPLO COMPLETO

```
C:\> cd C:\Users\João\Documents\v7-finance

C:\Users\João\Documents\v7-finance> fix-and-deploy.bat

╔════════════════════════════════════════════╗
║                                            ║
║   🔧 Fix Vercel Error & Deploy            ║
║                                            ║
╚════════════════════════════════════════════╝

[1/4] Verificando Git...
✅ Git OK!

[2/4] Verificando mudanças...
✅ Mudanças detectadas!

[3/4] Adicionando arquivos corrigidos...
✅ Arquivos adicionados

[4/4] Fazendo commit...
✅ Commit criado!

════════════════════════════════════════════

Pronto para fazer push!

Remote: https://github.com/joao/v7-finance.git

Fazer push agora? (s/n): s

Fazendo push...

✅ Push realizado com sucesso!

🎉 Deploy iniciado automaticamente!

Aguarde 2-3 minutos!

Deseja abrir o Vercel no navegador? (s/n): s
✅ Abrindo Vercel...
```

---

## 🎉 SUCESSO!

Depois do push, acesse:

**Vercel Dashboard:** https://vercel.com/dashboard

Você verá o build acontecendo!

---

**Última atualização:** 2026-03-09

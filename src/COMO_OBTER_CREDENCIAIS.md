# 🔑 Como Obter Credenciais para Teste de Carga

## 📍 PROJECT_ID

O **PROJECT_ID** já está disponível no seu projeto!

### Opção 1: Arquivo info.tsx (Recomendado)
```bash
# Abra o arquivo:
/utils/supabase/info.tsx
```

**Seu PROJECT_ID atual:**
```
oajntbrqzjbgfwyuocdi
```

### Opção 2: URL do Supabase
O PROJECT_ID também aparece na URL do seu projeto Supabase:
```
https://oajntbrqzjbgfwyuocdi.supabase.co
         ^^^^^^^^^^^^^^^^^^^^
         Este é o PROJECT_ID
```

---

## 🎫 AUTH_TOKEN

O **AUTH_TOKEN** é o token de acesso que você recebe ao fazer login no app. Existem duas formas de obtê-lo:

### Opção 1: Pelo Console do Navegador (Mais Fácil)

1. **Abra o app V7 Finance** no navegador
2. **Faça login** com seu email e senha
3. **Abra o Console do navegador:**
   - Chrome/Edge: `F12` ou `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - Firefox: `F12` ou `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - Safari: `Cmd+Option+C` (Mac)

4. **No Console, digite:**
   ```javascript
   // Copiar token de acesso
   supabase.auth.getSession().then(({data}) => {
     console.log('🎫 AUTH_TOKEN:');
     console.log(data.session.access_token);
     
     // Copiar para clipboard
     navigator.clipboard.writeText(data.session.access_token);
     console.log('✅ Token copiado para área de transferência!');
   });
   ```

5. **Cole o código acima** e pressione Enter
6. O token será exibido e copiado automaticamente! 🎉

### Opção 2: Pelo localStorage

1. **Abra o app V7 Finance** no navegador
2. **Faça login** com seu email e senha
3. **Abra o Console do navegador** (F12)
4. **Vá para a aba "Application"** (Chrome) ou "Storage" (Firefox)
5. **Clique em "Local Storage"** → selecione seu domínio
6. **Procure pela chave** que começa com `sb-oajntbrqzjbgfwyuocdi-auth-token`
7. **Copie o valor** do campo `access_token`

### Opção 3: Via Requisição HTTP (Programático)

```bash
# Fazer login e obter token
curl -X POST \
  'https://oajntbrqzjbgfwyuocdi.supabase.co/auth/v1/token?grant_type=password' \
  -H 'Content-Type: application/json' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs' \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }'

# O access_token estará no JSON de resposta
```

---

## 🔧 Configurar os Scripts de Teste

### Para load-test.js (k6):

Edite as linhas 15-16:
```javascript
const PROJECT_ID = 'oajntbrqzjbgfwyuocdi';  // ✅ Já está correto!
const AUTH_TOKEN = 'seu_token_aqui';        // ⚠️ Cole o token obtido acima
```

### Para test-simple.sh (bash):

Edite as linhas 12-13:
```bash
PROJECT_ID="oajntbrqzjbgfwyuocdi"  # ✅ Já está correto!
AUTH_TOKEN="seu_token_aqui"        # ⚠️ Cole o token obtido acima
```

---

## 📋 Exemplo Completo

Vou mostrar um exemplo passo a passo:

### 1. Obter o TOKEN via Console:

```javascript
// Cole no console do navegador (F12)
supabase.auth.getSession().then(({data}) => {
  console.log('🎫 Seu AUTH_TOKEN:');
  console.log(data.session.access_token);
});

// Exemplo de saída:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM1MDc2ODAwLCJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijk...
```

### 2. Configurar o script:

```javascript
// load-test.js
const PROJECT_ID = 'oajntbrqzjbgfwyuocdi';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM1MDc2ODAwLCJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijk...';
```

### 3. Executar o teste:

```bash
k6 run load-test.js
```

---

## ⚠️ Importante sobre o AUTH_TOKEN

### Validade do Token
- **Tokens expiram** após algumas horas (geralmente 1 hora)
- Se o teste falhar com erro 401, gere um novo token
- Para testes longos, implemente renovação automática

### Segurança
- ⚠️ **NÃO compartilhe** seu token publicamente
- ⚠️ **NÃO faça commit** do token no Git
- ✅ Use variáveis de ambiente em produção
- ✅ Gere tokens temporários para testes

### Renovação Automática (Opcional)

Se precisar de um token que não expire durante testes longos, adicione ao script:

```javascript
// Função para renovar token automaticamente
async function refreshToken() {
  const response = await fetch(
    `https://${PROJECT_ID}.supabase.co/auth/v1/token?grant_type=refresh_token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs',
      },
      body: JSON.stringify({ refresh_token: 'seu_refresh_token' }),
    }
  );
  
  const data = await response.json();
  return data.access_token;
}
```

---

## 🎯 Resumo Rápido

```
PROJECT_ID: oajntbrqzjbgfwyuocdi  ✅ (já configurado)

AUTH_TOKEN: 
1. Abra o app
2. Faça login
3. Pressione F12
4. Cole: supabase.auth.getSession().then(({data}) => console.log(data.session.access_token))
5. Copie o token exibido
6. Cole nos scripts de teste
```

---

## 🆘 Problemas Comuns

### ❌ Erro 401 (Unauthorized)
**Solução:** Gere um novo AUTH_TOKEN (o anterior expirou)

### ❌ supabase is not defined
**Solução:** Certifique-se de estar logado no app V7 Finance

### ❌ Erro de CORS
**Solução:** Execute os testes a partir de ferramentas CLI (k6, curl), não do navegador

### ❌ Token muito longo
**Solução:** Normal! Tokens JWT são longos. Cole tudo, incluindo os pontos (.)

---

## 💡 Dica Pro

Para facilitar, crie um script que obtém o token automaticamente:

```bash
#!/bin/bash
# get-token.sh

EMAIL="seu-email@exemplo.com"
PASSWORD="sua-senha"

curl -s -X POST \
  'https://oajntbrqzjbgfwyuocdi.supabase.co/auth/v1/token?grant_type=password' \
  -H 'Content-Type: application/json' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ham50YnJxempiZ2Z3eXVvY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzgyNzksImV4cCI6MjA3OTg1NDI3OX0.UpxbCSAi_i78luszqtcNfVdAiNFk-Rm_QbBIG8nj3Zs' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.access_token'
```

Depois use assim:
```bash
chmod +x get-token.sh
AUTH_TOKEN=$(./get-token.sh)
echo "Token: $AUTH_TOKEN"
```

---

**Pronto! Agora você tem todas as informações necessárias para executar os testes de carga! 🚀**

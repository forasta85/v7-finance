# 📸 Scanner de Nota Fiscal - V7 Finance

## ✨ Nova Funcionalidade!

Agora você pode escanear cupons e notas fiscais diretamente no V7 Finance e adicionar os valores automaticamente como despesas!

---

## 🚀 Como Usar

### 1. **Acessar o Scanner**

**Desktop:**
- Clique no botão **"Scanner"** na barra de ações rápidas (topo da página)

**Mobile:**
- Toque em **"Ações Rápidas"**
- Selecione **"Scanner"** → "Digitalizar recibos"

### 2. **Escolher a Foto**

Você tem duas opções:

**Opção 1: Upload de Arquivo**
- Clique na área de upload
- Selecione uma foto do seu computador/celular
- Formatos aceitos: JPG, PNG, JPEG
- Tamanho máximo: 10MB

**Opção 2: Tirar Foto (Mobile)**
- Clique em **"Tirar Foto com Câmera"**
- Aponte para a nota fiscal
- Tire a foto
- O scanner vai processar automaticamente

### 3. **Processar a Imagem**

- Após selecionar/tirar a foto, clique em **"Escanear Nota"**
- Aguarde o processamento (mostra % de progresso)
- O sistema vai extrair automaticamente:
  - ✅ **Valor Total**
  - ✅ **Nome do Estabelecimento**
  - ✅ **Data da Compra**

### 4. **Revisar e Editar**

- Verifique os dados extraídos
- Se necessário, clique em **"Editar"** para ajustar:
  - Valor
  - Descrição
  - Data
- Os dados podem não estar 100% precisos, sempre revise!

### 5. **Confirmar**

- Clique em **"Adicionar Despesa"**
- A transação será criada automaticamente
- Categoria padrão: "Outros" (você pode editar depois na lista de transações)

---

## 💡 Dicas para Melhor Resultado

### ✅ Faça:
- ✅ Tire fotos com **boa iluminação**
- ✅ Deixe a nota **reta e centralizada**
- ✅ Certifique-se que o **texto está legível**
- ✅ Foque especialmente na **área do valor total**
- ✅ Evite **reflexos e sombras**

### ❌ Evite:
- ❌ Fotos tremidas ou desfocadas
- ❌ Iluminação muito fraca ou muito forte
- ❌ Notas amassadas ou rasgadas
- ❌ Fotos muito de longe (texto muito pequeno)

---

## 🔍 O que o Scanner Reconhece

### Padrões Brasileiros Comuns:

**Valor Total:**
- "TOTAL: R$ 150,00"
- "VALOR TOTAL R$ 150,00"
- "VLR TOTAL: 150,00"
- "TOTAL A PAGAR: R$ 150,00"
- "R$ 150,00 TOTAL"

**Data:**
- DD/MM/AAAA (29/12/2024)
- DD-MM-AAAA (29-12-2024)
- AAAA/MM/DD (2024/12/29)
- AAAA-MM-DD (2024-12-29)

**Estabelecimento:**
- Primeira linha do cupom (geralmente o nome da loja)

---

## ⚙️ Tecnologia

O scanner usa **Tesseract.js (OCR)** diretamente no navegador:
- ✅ **100% Privado** - Tudo é processado no seu dispositivo
- ✅ **Offline** - Não precisa de conexão após carregar a página
- ✅ **Sem custos** - Não usa APIs externas pagas
- ✅ **Rápido** - Processamento em 5-15 segundos

---

## ⚠️ Limitações

### O Scanner Pode Falhar Se:
- A qualidade da imagem estiver ruim
- O texto estiver muito pequeno ou ilegível
- O layout da nota for muito não-padrão
- Houver muitos ruídos na imagem

### Se Isso Acontecer:
1. **Tente tirar outra foto** com melhor iluminação
2. **Edite manualmente** os valores após o escaneamento
3. **Use a entrada manual** (botões "Nova Entrada" ou "Nova Saída")

---

## 📊 Fluxo Completo

```
1. Clique em "Scanner"
   ↓
2. Selecione/Tire Foto
   ↓
3. Clique "Escanear Nota"
   ↓
4. Aguarde Processamento (5-15s)
   ↓
5. Revise Dados Extraídos
   ↓
6. Edite se necessário
   ↓
7. Clique "Adicionar Despesa"
   ↓
8. ✅ Transação Criada!
```

---

## 🎯 Casos de Uso

### Ideal Para:
- ✅ Cupons de supermercado
- ✅ Recibos de restaurantes
- ✅ Notas fiscais de compras
- ✅ Tickets de estacionamento
- ✅ Comprovantes de pagamento

### Menos Ideal Para:
- ❌ Documentos manuscritos
- ❌ Fotos de telas (dupla captura)
- ❌ Imagens muito complexas
- ❌ Notas muito apagadas

---

## 🔧 Solução de Problemas

### "Erro ao processar imagem"
**Solução:**
- Verifique se a imagem é válida (JPG/PNG)
- Reduza o tamanho se for muito grande (>10MB)
- Tente com melhor iluminação

### "Não foi possível identificar o valor total"
**Solução:**
- Clique em "Editar" e insira manualmente
- O valor pode estar em formato não reconhecido
- Tire nova foto focando no total

### "Valor extraído está incorreto"
**Solução:**
- Use o botão "Editar" para corrigir
- Sempre revise antes de adicionar
- O OCR pode confundir caracteres similares (0/O, 1/l)

### "Scanner muito lento"
**Normal:**
- Processamento OCR leva 5-15 segundos
- Depende da qualidade e tamanho da imagem
- Dispositivos mais lentos podem demorar mais

---

## 📱 Compatibilidade

### Navegadores Suportados:
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Câmera (Mobile):
- ✅ Funciona em todos os smartphones modernos
- ✅ Pede permissão para acessar câmera
- ✅ Usa câmera traseira por padrão

---

## 🎉 Benefícios

### ⏱️ **Economia de Tempo**
- Não precisa digitar valores manualmente
- Processamento em segundos
- Múltiplas notas em sequência

### 📊 **Precisão**
- Extração automática de valores
- Reduz erros de digitação
- Data extraída automaticamente

### 🔒 **Privacidade**
- Processamento 100% local
- Suas notas não saem do dispositivo
- Sem envio para servidores externos

### 📈 **Organização**
- Todas as despesas registradas
- Histórico completo
- Relatórios precisos

---

## 🚀 Próximas Melhorias (Futuro)

Funcionalidades planejadas:
- 🔄 Reconhecimento de categorias automático
- 🏷️ Extração de itens da nota (lista detalhada)
- 💳 Associação automática à conta/cartão
- 📊 Análise de padrões de compra
- 🤖 Machine Learning para melhor precisão

---

## 💬 Feedback

Teve problemas ou sugestões?
- Use o botão "Meu Perfil" para ver seus dados
- Reporte problemas com exemplos de notas que falharam
- Sugestões são sempre bem-vindas!

---

**Aproveite o Scanner de Nota Fiscal e simplifique sua gestão financeira! 📸💰**

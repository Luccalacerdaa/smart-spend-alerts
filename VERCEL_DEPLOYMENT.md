# 🚀 Deploy na Vercel - Configuração Completa

## ⚙️ **Variáveis de Ambiente Necessárias**

### **1. Acessar Configurações da Vercel**
```
1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto: smart-spend-alerts
3. Vá em: Settings → Environment Variables
```

### **2. Adicionar as Variáveis**

#### **Variáveis Obrigatórias:**
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://zztdqxjxjhqddtqpramt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGRxeGp4amhxZGR0cXByYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODEyNzksImV4cCI6MjA4MTU1NzI3OX0.fNqyP49ogguPOkhUo0HTLQjxSk3gfjrIDQQL4GFC8vA
```

#### **Como Adicionar na Vercel:**
1. **Name**: `VITE_SUPABASE_URL`
   **Value**: `https://zztdqxjxjhqddtqpramt.supabase.co`
   **Environments**: Production, Preview, Development

2. **Name**: `VITE_SUPABASE_ANON_KEY`
   **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGRxeGp4amhxZGR0cXByYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODEyNzksImV4cCI6MjA4MTU1NzI3OX0.fNqyP49ogguPOkhUo0HTLQjxSk3gfjrIDQQL4GFC8vA`
   **Environments**: Production, Preview, Development

### **3. Redeployar o Projeto**
Após adicionar as variáveis:
```
1. Vá em: Deployments
2. Clique nos "..." do último deploy
3. Clique em "Redeploy"
```

---

## 🔧 **2. Problema com Teste de Notificação no Localhost**

### **❌ Por que não funciona no localhost:**

#### **Problema Principal:**
- ✅ **Edge Function** está no Supabase (produção)
- ❌ **Seu app** está no localhost (desenvolvimento)
- ❌ **n8n** não consegue acessar localhost

#### **Fluxo Atual (Quebrado):**
```
1. 📱 App localhost clica "Testar Notificação"
2. 🔄 Chama Edge Function no Supabase
3. ⚡ Edge Function cria webhook no banco
4. 🌐 Edge Function tenta enviar para n8n
5. ❌ n8n não consegue acessar localhost
```

### **✅ Soluções:**

#### **Opção 1: Testar na Vercel (Recomendado)**
```
1. 🚀 Deploy na Vercel com variáveis configuradas
2. 🌐 Acesse: https://seu-app.vercel.app/app/perfil
3. 🧪 Teste a notificação (vai funcionar!)
```

#### **Opção 2: Usar ngrok para Localhost**
```bash
# 1. Instalar ngrok
npm install -g ngrok

# 2. Expor localhost
ngrok http 5173

# 3. Usar URL do ngrok para testar
# Exemplo: https://abc123.ngrok.io
```

#### **Opção 3: Testar Direto no Supabase**
```sql
-- No SQL Editor do Supabase, execute:
SELECT public.create_and_send_notification(
  'seu-user-id',
  '🧪 Teste Manual',
  'Teste direto do Supabase!',
  'payment_reminder',
  NULL,
  '{"test": true}'::jsonb
);
```

---

## 🎯 **Configuração Completa na Vercel**

### **Passo a Passo:**

#### **1. Configurar Variáveis de Ambiente**
```
Vercel Dashboard → Projeto → Settings → Environment Variables

Adicionar:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

#### **2. Configurar Build Settings (se necessário)**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### **3. Redeployar**
```
Deployments → Redeploy
```

#### **4. Testar na Produção**
```
1. Acesse: https://seu-app.vercel.app
2. Faça login/cadastro
3. Vá para /app/perfil
4. Configure WhatsApp e webhook n8n
5. Clique "Testar Notificação"
6. Deve funcionar perfeitamente!
```

---

## 🔔 **Configuração do n8n para Receber Webhooks**

### **URL do Webhook para Configurar:**
```
https://seu-n8n.com/webhook/smart-spend-alerts
```

### **Payload que o n8n vai receber:**
```json
{
  "notification_id": "uuid",
  "type": "payment_reminder",
  "title": "🧪 Teste de Notificação",
  "message": "Esta é uma notificação de teste!",
  "user": {
    "id": "user-uuid",
    "name": "Seu Nome",
    "whatsapp": "5531987654321@s.whatsapp.net"
  },
  "timestamp": "2024-01-15T10:00:00Z",
  "extra_data": {
    "test": true
  }
}
```

### **Workflow n8n Básico:**
```
1. Webhook Trigger → Recebe payload
2. Set Node → Extrair dados do usuário
3. WhatsApp Node → Enviar mensagem
4. HTTP Response → Confirmar recebimento
```

---

## 🧪 **Testando o Sistema Completo**

### **Fluxo de Teste na Produção:**
```
1. 🌐 Acesse app na Vercel
2. 🔐 Faça login no sistema
3. 👤 Vá para página de perfil
4. 📱 Configure WhatsApp (31987654321)
5. 🔗 Configure URL do webhook n8n
6. 🧪 Clique "Testar Notificação"
7. ✅ Verifique se chegou no WhatsApp
```

### **Debug se não Funcionar:**
```
1. 📊 Verifique logs na aba "Status de Envio"
2. 🔍 Verifique webhook logs no Supabase
3. 🌐 Verifique se n8n recebeu o payload
4. 📱 Verifique se WhatsApp está configurado
```

---

## ⚠️ **Importante:**

### **Localhost vs Produção:**
- ❌ **Localhost**: Notificações não funcionam (n8n não acessa)
- ✅ **Vercel**: Notificações funcionam perfeitamente

### **Variáveis Obrigatórias:**
- ✅ `VITE_SUPABASE_URL` - URL do projeto Supabase
- ✅ `VITE_SUPABASE_ANON_KEY` - Chave pública do Supabase

### **Teste Recomendado:**
1. 🚀 Deploy na Vercel com variáveis
2. 🧪 Teste na produção (não no localhost)
3. 🔔 Configure n8n para receber webhooks
4. 📱 Teste notificação completa

**Depois do deploy na Vercel, o sistema de notificações vai funcionar perfeitamente! 🎉**

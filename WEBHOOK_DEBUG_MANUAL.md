# 🔍 Debug Manual - Notificações WhatsApp

## ❌ **Problema Atual**
Notificações não estão chegando no webhook do n8n.

## 🕵️ **Checklist de Debug**

### **1. Verificar Configuração do Usuário**

Acesse o **SQL Editor** do Supabase e execute:

```sql
-- Verificar seu perfil
SELECT 
  id,
  full_name,
  whatsapp_number,
  whatsapp_formatted,
  notifications_enabled,
  notification_time_bills,
  notification_time_followup
FROM public.profiles 
WHERE id = auth.uid();
```

**✅ Deve retornar:**
- `notifications_enabled = true`
- `whatsapp_number` preenchido
- `whatsapp_formatted` no formato `55XXXXXXXXXXX@s.whatsapp.net`

---

### **2. Verificar Webhook Settings**

```sql
-- Verificar configurações de webhook
SELECT 
  user_id,
  webhook_url,
  is_active,
  created_at
FROM public.webhook_settings 
WHERE user_id = auth.uid();
```

**✅ Deve retornar:**
- `webhook_url` com sua URL do n8n
- `is_active = true`

---

### **3. Testar Criação de Notificação**

```sql
-- Criar notificação de teste
SELECT public.send_test_notification(auth.uid());
```

**✅ Deve retornar:** `success`

---

### **4. Verificar se Notificação foi Criada**

```sql
-- Ver últimas notificações
SELECT 
  id,
  title,
  message,
  type,
  created_at
FROM public.notifications 
WHERE user_id = auth.uid()
ORDER BY created_at DESC 
LIMIT 3;
```

**✅ Deve mostrar:** Notificação de teste criada

---

### **5. Verificar Logs de Webhook**

```sql
-- Ver tentativas de envio
SELECT 
  id,
  notification_id,
  webhook_url,
  response_status,
  success,
  error_message,
  sent_at
FROM public.webhook_logs 
WHERE user_id = auth.uid()
ORDER BY sent_at DESC 
LIMIT 3;
```

**✅ Verificar:**
- `success = true`
- `response_status = 200`
- `error_message` vazio

---

### **6. Testar Edge Function Diretamente**

Execute no terminal ou Postman:

```bash
curl -X POST https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGRxeGp4amhxZGR0cXByYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODEyNzksImV4cCI6MjA4MTU1NzI3OX0.fNqyP49ogguPOkhUo0HTLQjxSk3gfjrIDQQL4GFC8vA" \
  -d '{"action": "send_pending_webhooks"}'
```

**✅ Deve retornar:** `{"success": true, "processed": X}`

---

## 🔧 **Possíveis Problemas**

### **Problema 1: Webhook URL Incorreta**
- Verifique se a URL do n8n está correta
- Teste a URL diretamente no navegador

### **Problema 2: n8n Não Recebendo**
- Verifique se o workflow do n8n está ativo
- Teste com webhook.site primeiro

### **Problema 3: Cron Jobs Desabilitados**
- As notificações automáticas dependem de cron jobs
- Verifique se estão configurados no Supabase

### **Problema 4: Edge Function com Erro**
- Verifique logs da Edge Function
- Teste chamada manual da função

---

## 🚀 **Teste Rápido**

1. **Configure webhook.site:**
   ```
   https://webhook.site/SEU-ID-UNICO
   ```

2. **Atualize webhook settings:**
   ```sql
   UPDATE public.webhook_settings 
   SET webhook_url = 'https://webhook.site/SEU-ID-UNICO'
   WHERE user_id = auth.uid();
   ```

3. **Envie teste:**
   ```sql
   SELECT public.send_test_notification(auth.uid());
   ```

4. **Processe webhooks:**
   ```bash
   curl -X POST https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications \
     -H "Content-Type: application/json" \
     -d '{"action": "send_pending_webhooks"}'
   ```

5. **Verifique webhook.site** - Deve receber o payload!

---

## 📞 **Me Envie os Resultados**

Execute os SQLs acima e me envie:
1. Resultado do perfil
2. Resultado das webhook_settings  
3. Resultado dos webhook_logs
4. Se recebeu algo no webhook.site

Assim posso identificar exatamente onde está o problema! 🔍

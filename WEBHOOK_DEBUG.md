# 🔍 Debug - Notificações não chegam no Webhook

## ❌ **Problema Identificado**
Notificações não estão sendo enviadas para o webhook, mesmo testando via SQL no Supabase.

---

## 🕵️ **Diagnóstico Passo a Passo**

### **1. Verificar se a Notificação foi Criada**

#### **SQL para Verificar:**
```sql
-- Verificar últimas notificações criadas
SELECT 
  id,
  title,
  message,
  type,
  user_id,
  created_at
FROM public.notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

**Resultado Esperado:** Deve mostrar as notificações criadas

---

### **2. Verificar se o Webhook foi Registrado**

#### **SQL para Verificar:**
```sql
-- Verificar logs de webhook
SELECT 
  id,
  notification_id,
  webhook_url,
  payload,
  response_status,
  success,
  sent_at
FROM public.webhook_logs 
ORDER BY sent_at DESC 
LIMIT 10;
```

**Resultado Esperado:** Deve mostrar tentativas de envio

---

### **3. Verificar Configuração do Usuário**

#### **SQL para Verificar:**
```sql
-- Verificar perfil do usuário
SELECT 
  id,
  full_name,
  whatsapp_number,
  whatsapp_formatted,
  notifications_enabled
FROM public.profiles 
WHERE id = 'SEU_USER_ID';

-- Verificar configurações de webhook
SELECT 
  user_id,
  webhook_url,
  is_active
FROM public.webhook_settings 
WHERE user_id = 'SEU_USER_ID';
```

**Resultado Esperado:** 
- `notifications_enabled = true`
- `webhook_url` preenchida
- `is_active = true`

---

## 🔧 **Possíveis Problemas e Soluções**

### **Problema 1: Usuário sem Configuração**

#### **Sintoma:**
```sql
-- Se retornar vazio:
SELECT * FROM public.webhook_settings WHERE user_id = 'SEU_USER_ID';
```

#### **Solução:**
```sql
-- Inserir configuração de webhook
INSERT INTO public.webhook_settings (
  user_id,
  webhook_url,
  is_active
) VALUES (
  'SEU_USER_ID',
  'https://seu-n8n.com/webhook/smart-spend',
  true
);
```

---

### **Problema 2: Notificações Desabilitadas**

#### **Sintoma:**
```sql
-- Se notifications_enabled = false:
SELECT notifications_enabled FROM public.profiles WHERE id = 'SEU_USER_ID';
```

#### **Solução:**
```sql
-- Habilitar notificações
UPDATE public.profiles 
SET notifications_enabled = true 
WHERE id = 'SEU_USER_ID';
```

---

### **Problema 3: Edge Function não está Processando**

#### **Verificar Edge Function:**
```sql
-- Testar se a função está funcionando
SELECT public.create_and_send_notification(
  'SEU_USER_ID',
  '🧪 Teste Debug',
  'Testando se a função cria webhook',
  'payment_reminder',
  NULL,
  '{"debug": true}'::jsonb
);
```

#### **Verificar se Criou Webhook Log:**
```sql
-- Deve aparecer um novo registro
SELECT * FROM public.webhook_logs 
WHERE payload->>'title' = '🧪 Teste Debug';
```

---

### **Problema 4: Edge Function não está Enviando**

#### **Testar Edge Function Manualmente:**
```bash
# Fazer requisição direta para a Edge Function
curl -X POST https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dGRxeGp4amhxZGR0cXByYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODEyNzksImV4cCI6MjA4MTU1NzI3OX0.fNqyP49ogguPOkhUo0HTLQjxSk3gfjrIDQQL4GFC8vA" \
  -H "Content-Type: application/json" \
  -d '{"action": "send_pending_webhooks"}'
```

**Resultado Esperado:** 
```json
{
  "success": true,
  "action": "send_pending_webhooks",
  "processed_count": 1
}
```

---

## 🛠️ **Script de Debug Completo**

### **Execute este SQL no Supabase:**

```sql
-- 1. Verificar se usuário existe e tem configurações
DO $$
DECLARE
  user_record RECORD;
  webhook_record RECORD;
  test_notification_id UUID;
BEGIN
  -- Buscar primeiro usuário para teste
  SELECT id, full_name, notifications_enabled, whatsapp_formatted 
  INTO user_record
  FROM public.profiles 
  LIMIT 1;
  
  IF user_record.id IS NULL THEN
    RAISE NOTICE 'ERRO: Nenhum usuário encontrado na tabela profiles';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Usuário encontrado: % (ID: %)', user_record.full_name, user_record.id;
  RAISE NOTICE 'Notificações habilitadas: %', user_record.notifications_enabled;
  RAISE NOTICE 'WhatsApp: %', user_record.whatsapp_formatted;
  
  -- Verificar configuração de webhook
  SELECT webhook_url, is_active 
  INTO webhook_record
  FROM public.webhook_settings 
  WHERE user_id = user_record.id;
  
  IF webhook_record.webhook_url IS NULL THEN
    RAISE NOTICE 'ERRO: Usuário não tem webhook configurado';
    
    -- Criar configuração de teste
    INSERT INTO public.webhook_settings (user_id, webhook_url, is_active)
    VALUES (user_record.id, 'https://webhook.site/unique-id', true);
    
    RAISE NOTICE 'Webhook de teste criado: https://webhook.site/unique-id';
  ELSE
    RAISE NOTICE 'Webhook configurado: % (Ativo: %)', webhook_record.webhook_url, webhook_record.is_active;
  END IF;
  
  -- Criar notificação de teste
  SELECT public.create_and_send_notification(
    user_record.id,
    '🔍 Debug Test',
    'Teste de debug do sistema de notificações',
    'payment_reminder',
    NULL,
    '{"debug": true, "timestamp": "' || NOW() || '"}'::jsonb
  ) INTO test_notification_id;
  
  RAISE NOTICE 'Notificação de teste criada: %', test_notification_id;
  
  -- Verificar se webhook foi criado
  PERFORM pg_sleep(1); -- Aguardar 1 segundo
  
  IF EXISTS (
    SELECT 1 FROM public.webhook_logs 
    WHERE notification_id = test_notification_id
  ) THEN
    RAISE NOTICE 'SUCCESS: Webhook log criado para a notificação';
  ELSE
    RAISE NOTICE 'ERRO: Webhook log NÃO foi criado';
  END IF;
  
END $$;
```

---

## 🎯 **Checklist de Verificação**

### **Execute cada item e marque:**

- [ ] ✅ **Usuário existe** na tabela `profiles`
- [ ] ✅ **Notificações habilitadas** (`notifications_enabled = true`)
- [ ] ✅ **WhatsApp configurado** (`whatsapp_formatted` preenchido)
- [ ] ✅ **Webhook configurado** na tabela `webhook_settings`
- [ ] ✅ **Webhook ativo** (`is_active = true`)
- [ ] ✅ **Função cria notificação** (aparece na tabela `notifications`)
- [ ] ✅ **Função cria webhook log** (aparece na tabela `webhook_logs`)
- [ ] ✅ **Edge Function processa** (webhook é enviado)

---

## 🚨 **Soluções Rápidas**

### **Se Webhook não está Configurado:**
```sql
-- Substitua SEU_USER_ID e SUA_URL_WEBHOOK
INSERT INTO public.webhook_settings (user_id, webhook_url, is_active)
VALUES ('SEU_USER_ID', 'https://seu-n8n.com/webhook/smart-spend', true)
ON CONFLICT (user_id) DO UPDATE SET
  webhook_url = EXCLUDED.webhook_url,
  is_active = EXCLUDED.is_active;
```

### **Se Notificações estão Desabilitadas:**
```sql
-- Habilitar notificações para todos os usuários
UPDATE public.profiles SET notifications_enabled = true;
```

### **Se Edge Function não está Funcionando:**
```bash
# Testar manualmente
curl -X POST https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications \
  -H "Authorization: Bearer SUA_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "send_pending_webhooks"}'
```

---

## 📊 **Próximos Passos**

1. **Execute o script de debug** acima
2. **Verifique os resultados** de cada etapa
3. **Identifique onde está falhando**
4. **Aplique a solução correspondente**
5. **Teste novamente**

**Me envie os resultados do script de debug para eu te ajudar a identificar exatamente onde está o problema! 🔍**

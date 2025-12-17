# 📲 Sistema de Notificações via WhatsApp

## ✅ Funcionalidades Implementadas

### 🎯 **Tipos de Notificação Automática**

1. **💳 Contas Vencendo (Manhã)**
   - Enviada às 9h para contas que vencem no dia
   - Lembra o usuário de pagar a conta

2. **❓ Follow-up de Contas (Tarde)**
   - Enviada às 17h para contas que venciam no dia
   - Pergunta se o usuário já pagou

3. **📊 Alertas de Meta**
   - 75% da meta atingida
   - 90% da meta atingida  
   - Meta ultrapassada

4. **💸 Gastos Incomuns**
   - Detecta gastos 50% acima da média diária
   - Alerta sobre comportamento atípico

5. **💳 Limite do Cartão**
   - 80% do limite atingido
   - 95% do limite atingido

### 🔧 **Arquitetura do Sistema**

#### **Fluxo de Notificações:**
```
1. Função detecta evento (conta vencendo, meta atingida, etc.)
2. Cria notificação no banco + payload do webhook
3. Edge Function processa webhooks pendentes
4. Envia para seu webhook do n8n
5. n8n processa e envia para WhatsApp
```

#### **Tabelas Criadas:**
- ✅ `profiles` (expandida) - Configurações do usuário
- ✅ `webhook_settings` - URL do webhook do n8n
- ✅ `webhook_logs` - Log de webhooks enviados
- ✅ `notifications` (expandida) - Notificações do sistema

#### **Edge Function:**
- ✅ `process-notifications` - Processa e envia webhooks

---

## 🚀 **Como Configurar**

### 1. **Configurar Perfil do Usuário**

```typescript
import { supabase } from '@/lib/supabase';

// Atualizar perfil com WhatsApp
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'João Silva',
    whatsapp_number: '31897969210', // Será formatado automaticamente
    notifications_enabled: true,
    notification_time_bills: '09:00:00',
    notification_time_followup: '17:00:00',
    timezone: 'America/Sao_Paulo'
  })
  .eq('id', user.id);

// O sistema formata automaticamente para: 5531897969210@s.whatsapp.net
```

### 2. **Configurar Webhook do n8n**

```typescript
// Configurar URL do webhook
const { data, error } = await supabase
  .from('webhook_settings')
  .upsert({
    user_id: user.id,
    webhook_url: 'https://seu-n8n.com/webhook/whatsapp-notifications',
    webhook_secret: 'seu-token-secreto', // Opcional
    is_active: true
  });
```

### 3. **Agendar Execução das Notificações**

Você pode usar o **Supabase Cron** ou **n8n** para executar as funções:

#### **Opção 1: Supabase Cron (Recomendado)**
```sql
-- Executar notificações de manhã (9h)
SELECT cron.schedule(
  'morning-bill-notifications',
  '0 9 * * *', -- Todo dia às 9h
  'SELECT net.http_post(
    url := ''https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications'',
    headers := ''{"Content-Type": "application/json", "Authorization": "Bearer SEU_ANON_KEY"}'',
    body := ''{"action": "morning_bills"}''
  );'
);

-- Executar follow-up de tarde (17h)
SELECT cron.schedule(
  'followup-bill-notifications', 
  '0 17 * * *', -- Todo dia às 17h
  'SELECT net.http_post(
    url := ''https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications'',
    headers := ''{"Content-Type": "application/json", "Authorization": "Bearer SEU_ANON_KEY"}'',
    body := ''{"action": "followup_bills"}''
  );'
);

-- Verificar metas (todo dia às 20h)
SELECT cron.schedule(
  'goal-notifications',
  '0 20 * * *',
  'SELECT net.http_post(
    url := ''https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications'',
    headers := ''{"Content-Type": "application/json", "Authorization": "Bearer SEU_ANON_KEY"}'',
    body := ''{"action": "goal_notifications"}''
  );'
);

-- Processar webhooks pendentes (a cada 5 minutos)
SELECT cron.schedule(
  'process-webhooks',
  '*/5 * * * *',
  'SELECT net.http_post(
    url := ''https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications'',
    headers := ''{"Content-Type": "application/json", "Authorization": "Bearer SEU_ANON_KEY"}'',
    body := ''{"action": "send_pending_webhooks"}''
  );'
);
```

#### **Opção 2: n8n Workflow**
Criar workflows no n8n que executam as URLs acima nos horários desejados.

---

## 📋 **Payload do Webhook**

### **Formato Enviado para o n8n:**

```json
{
  "notification_id": "uuid-da-notificacao",
  "type": "due_date_morning",
  "title": "💳 Conta Vencendo Hoje!",
  "message": "Olá! Sua conta \"Internet\" de R$ 89.90 vence hoje. Não esqueça de pagar! 😊",
  "user": {
    "id": "uuid-do-usuario",
    "name": "João Silva", 
    "whatsapp": "5531897969210@s.whatsapp.net"
  },
  "timestamp": "2024-01-15T09:00:00.000Z",
  "extra_data": {
    "payment_name": "Internet",
    "amount": 89.90,
    "due_day": 15,
    "category": "contas"
  }
}
```

### **Tipos de Notificação:**

| Tipo | Quando Envia | Exemplo de Mensagem |
|------|--------------|---------------------|
| `due_date_morning` | 9h - contas vencendo hoje | "💳 Sua conta \"Internet\" de R$ 89.90 vence hoje!" |
| `due_date_followup` | 17h - contas que venciam hoje | "❓ Sua conta \"Internet\" vencia hoje. Já pagou?" |
| `budget_alert` | Meta ultrapassada | "🚨 Você ultrapassou sua meta mensal em 15%!" |
| `goal_warning` | 75% ou 90% da meta | "⚠️ Você já gastou 90% da sua meta mensal!" |
| `card_limit_warning` | 80% ou 95% do limite | "💳 Você usou 85% do limite do cartão Nubank!" |
| `unusual_spending` | Gasto 50% acima da média | "📈 Você gastou R$ 200 hoje, 60% acima da média!" |

---

## 🔧 **Configuração no n8n**

### **Workflow Sugerido:**

1. **Webhook Trigger** - Recebe payload do Supabase
2. **Switch Node** - Direciona por tipo de notificação
3. **Function Node** - Formata mensagem para WhatsApp
4. **WhatsApp Node** - Envia mensagem
5. **HTTP Request** - Confirma entrega (opcional)

### **Exemplo de Function Node:**

```javascript
// Formatar mensagem baseada no tipo
const payload = $json;
const user = payload.user;
const type = payload.type;

let whatsappMessage = '';
let emoji = '';

switch(type) {
  case 'due_date_morning':
    emoji = '💳';
    whatsappMessage = `${emoji} *Conta Vencendo Hoje!*\n\n` +
                     `Olá ${user.name}! 👋\n\n` +
                     `${payload.message}\n\n` +
                     `_Smart Spend Alerts 📱_`;
    break;
    
  case 'due_date_followup':
    emoji = '❓';
    whatsappMessage = `${emoji} *Lembrete de Pagamento*\n\n` +
                     `Oi ${user.name}! 😊\n\n` +
                     `${payload.message}\n\n` +
                     `_Smart Spend Alerts 📱_`;
    break;
    
  case 'budget_alert':
    emoji = '🚨';
    whatsappMessage = `${emoji} *ALERTA DE ORÇAMENTO*\n\n` +
                     `${user.name}, ${payload.message}\n\n` +
                     `_Smart Spend Alerts 📱_`;
    break;
    
  default:
    whatsappMessage = `${payload.title}\n\n${payload.message}\n\n_Smart Spend Alerts 📱_`;
}

return {
  chatId: user.whatsapp,
  message: whatsappMessage,
  originalPayload: payload
};
```

---

## 🎯 **Componentes Frontend Sugeridos**

### 1. **Aba de Perfil e Configurações**

```typescript
// UserProfile.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  full_name: string;
  whatsapp_number: string;
  notifications_enabled: boolean;
  notification_time_bills: string;
  notification_time_followup: string;
}

const UserProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile>();
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const updateProfile = async (data: Partial<UserProfile>) => {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);
      
    if (!error) {
      // Sucesso
    }
  };
  
  const updateWebhook = async (url: string) => {
    const { error } = await supabase
      .from('webhook_settings')
      .upsert({
        user_id: user.id,
        webhook_url: url,
        is_active: true
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações do Perfil</h2>
      
      {/* Dados Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
        
        <input
          type="text"
          placeholder="Nome completo"
          value={profile?.full_name || ''}
          onChange={(e) => setProfile(p => ({...p, full_name: e.target.value}))}
        />
        
        <input
          type="tel"
          placeholder="WhatsApp (31987654321)"
          value={profile?.whatsapp_number || ''}
          onChange={(e) => setProfile(p => ({...p, whatsapp_number: e.target.value}))}
        />
      </div>
      
      {/* Configurações de Notificação */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notificações</h3>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={profile?.notifications_enabled || false}
            onChange={(e) => setProfile(p => ({...p, notifications_enabled: e.target.checked}))}
          />
          <span>Receber notificações no WhatsApp</span>
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Horário - Contas vencendo</label>
            <input
              type="time"
              value={profile?.notification_time_bills || '09:00'}
              onChange={(e) => setProfile(p => ({...p, notification_time_bills: e.target.value}))}
            />
          </div>
          
          <div>
            <label>Horário - Follow-up</label>
            <input
              type="time"
              value={profile?.notification_time_followup || '17:00'}
              onChange={(e) => setProfile(p => ({...p, notification_time_followup: e.target.value}))}
            />
          </div>
        </div>
      </div>
      
      {/* Webhook Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Integração n8n</h3>
        
        <input
          type="url"
          placeholder="https://seu-n8n.com/webhook/whatsapp"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        
        <button onClick={() => updateWebhook(webhookUrl)}>
          Salvar Webhook
        </button>
      </div>
      
      <button onClick={() => updateProfile(profile)}>
        Salvar Configurações
      </button>
    </div>
  );
};
```

### 2. **Histórico de Notificações**

```typescript
// NotificationHistory.tsx
const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [webhookLogs, setWebhookLogs] = useState([]);
  
  useEffect(() => {
    // Buscar notificações
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setNotifications(data || []);
    };
    
    // Buscar logs de webhook
    const fetchWebhookLogs = async () => {
      const { data } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(20);
        
      setWebhookLogs(data || []);
    };
    
    fetchNotifications();
    fetchWebhookLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Histórico de Notificações</h2>
      
      {/* Lista de Notificações */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
                <span className="text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
              }`}>
                {notification.is_read ? 'Lida' : 'Nova'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Status dos Webhooks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status de Envio</h3>
        {webhookLogs.map((log) => (
          <div key={log.id} className="flex justify-between items-center p-2 border rounded">
            <span>{new Date(log.sent_at).toLocaleString()}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {log.success ? 'Enviado' : 'Falhou'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🔄 **Testando o Sistema**

### **1. Testar Manualmente:**

```typescript
// Criar notificação de teste
const { data } = await supabase.rpc('create_and_send_notification', {
  p_user_id: user.id,
  p_title: '🧪 Teste de Notificação',
  p_message: 'Esta é uma notificação de teste do sistema!',
  p_type: 'payment_reminder',
  p_extra_data: { test: true }
});
```

### **2. Executar Funções Manualmente:**

```bash
# Testar notificações de contas vencendo
curl -X POST https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "morning_bills"}'

# Processar webhooks pendentes  
curl -X POST https://zztdqxjxjhqddtqpramt.supabase.co/functions/v1/process-notifications \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "send_pending_webhooks"}'
```

---

## 📊 **Monitoramento**

### **Métricas Importantes:**
- Taxa de entrega de webhooks
- Tempo de resposta do n8n
- Notificações por tipo/dia
- Usuários com notificações habilitadas

### **Queries Úteis:**

```sql
-- Taxa de sucesso dos webhooks (últimos 7 dias)
SELECT 
  DATE(sent_at) as date,
  COUNT(*) as total_webhooks,
  COUNT(*) FILTER (WHERE success = true) as successful,
  ROUND(COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*), 2) as success_rate
FROM webhook_logs 
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(sent_at)
ORDER BY date DESC;

-- Notificações por tipo (último mês)
SELECT 
  type,
  COUNT(*) as count
FROM notifications 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY type
ORDER BY count DESC;
```

---

## ✅ **Sistema Completo Implementado!**

### **O que foi criado:**
- ✅ Sistema completo de notificações automáticas
- ✅ Formatação automática do WhatsApp (553189796921@s.whatsapp.net)
- ✅ 9 tipos diferentes de notificação
- ✅ Edge Function para processar webhooks
- ✅ Log completo de envios
- ✅ Configurações por usuário
- ✅ Integração pronta para n8n

### **Próximos passos:**
1. Criar a aba de perfil no frontend
2. Configurar o workflow no n8n
3. Configurar os cron jobs no Supabase
4. Testar o fluxo completo

O sistema está pronto para enviar notificações inteligentes via WhatsApp! 🚀📱

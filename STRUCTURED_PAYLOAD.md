# 📋 Payload Estruturado para n8n

## 🎯 **Novo Formato de Dados Separados**

O sistema agora envia os dados do webhook de forma estruturada, com parâmetros separados para facilitar o uso no n8n.

## 📱 **Estrutura do Payload**

### **Campos Principais:**
```json
{
  "notification_type": "payment_reminder",
  "notification_id": "uuid-da-notificacao",
  "timestamp": "2025-12-17T17:08:38.152061+00:00",
  "user_name": "Lucca Lacerda",
  "whatsapp_number": "5531989796921@s.whatsapp.net",
  "bill_name": "Conta de Luz",
  "bill_amount": 187.5,
  "due_day": 17,
  "title": "💡 Conta Vencendo Hoje!",
  "message": "Mensagem completa formatada",
  "is_test": false,
  "user_id": "22942282-7b89-4069-8ea2-55c609b188ed"
}
```

### **Descrição dos Campos:**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `notification_type` | string | Tipo da notificação | `"payment_reminder"` |
| `notification_id` | string | ID único da notificação | `"uuid-da-notificacao"` |
| `timestamp` | string | Data/hora da notificação | `"2025-12-17T17:08:38Z"` |
| `user_name` | string | **Nome do usuário** | `"Lucca Lacerda"` |
| `whatsapp_number` | string | **Número WhatsApp formatado** | `"5531989796921@s.whatsapp.net"` |
| `bill_name` | string | **Nome da conta cadastrada** | `"Conta de Luz"` |
| `bill_amount` | number | Valor da conta | `187.5` |
| `due_day` | number | Dia do vencimento | `17` |
| `title` | string | **Título da notificação** | `"💡 Conta Vencendo Hoje!"` |
| `message` | string | **Mensagem completa** | `"Olá Lucca! Sua Conta de Luz..."` |
| `is_test` | boolean | Se é uma notificação de teste | `false` |
| `user_id` | string | ID interno do usuário | `"uuid-do-usuario"` |

## 🎯 **Parâmetros Solicitados Disponíveis:**

✅ **Nome do usuário:** `user_name`  
✅ **Mensagem:** `message`  
✅ **Número formatado:** `whatsapp_number`  
✅ **Nome da conta:** `bill_name`  

## 📱 **Exemplos de Uso no n8n**

### **1. Notificação de Teste:**
```json
{
  "notification_type": "test",
  "user_name": "Lucca Lacerda",
  "whatsapp_number": "5531989796921@s.whatsapp.net",
  "bill_name": "Conta de Luz",
  "bill_amount": 187.5,
  "due_day": 17,
  "title": "🧪 Teste Edge Function",
  "message": "Esta é uma mensagem de teste!",
  "is_test": true
}
```

### **2. Notificação Real de Vencimento:**
```json
{
  "notification_type": "payment_reminder",
  "user_name": "Lucca Lacerda", 
  "whatsapp_number": "5531989796921@s.whatsapp.net",
  "bill_name": "Conta de Luz",
  "bill_amount": 187.5,
  "due_day": 17,
  "title": "💡 Conta Vencendo Hoje!",
  "message": "Olá Lucca Lacerda! Sua Conta de Luz no valor de R$ 187,50 vence hoje (dia 17). Número: 5531989796921@s.whatsapp.net",
  "is_test": false
}
```

### **3. Outros Tipos de Notificação:**
```json
{
  "notification_type": "budget_alert",
  "user_name": "Lucca Lacerda",
  "whatsapp_number": "5531989796921@s.whatsapp.net",
  "title": "⚠️ Meta de Gastos",
  "message": "Você já gastou 80% da sua meta mensal!",
  "is_test": false
}
```

## 🔧 **Como Usar no n8n**

### **Acessar os Dados:**
```javascript
// Nome do usuário
const userName = $json.user_name;

// Número do WhatsApp
const whatsappNumber = $json.whatsapp_number;

// Nome da conta
const billName = $json.bill_name;

// Mensagem completa
const message = $json.message;

// Valor da conta
const amount = $json.bill_amount;

// Verificar se é teste
const isTest = $json.is_test;
```

### **Exemplo de Workflow n8n:**
```javascript
// Verificar se não é teste
if (!$json.is_test) {
  // Enviar para WhatsApp
  return {
    to: $json.whatsapp_number,
    message: `Olá ${$json.user_name}! ${$json.message}`,
    bill: $json.bill_name,
    amount: $json.bill_amount
  };
}
```

## 🎯 **Tipos de Notificação Disponíveis:**

- `payment_reminder` - Lembrete de pagamento
- `due_date_morning` - Vencimento manhã
- `due_date_followup` - Follow-up vencimento
- `budget_alert` - Alerta de orçamento
- `goal_achieved` - Meta alcançada
- `goal_warning` - Aviso de meta
- `card_limit_warning` - Limite do cartão
- `unusual_spending` - Gasto incomum
- `monthly_summary` - Resumo mensal
- `test` - Teste

## ✅ **Vantagens do Novo Formato:**

1. **Dados Separados:** Cada informação em um campo específico
2. **Fácil Acesso:** `$json.user_name` em vez de parsing de string
3. **Tipagem Clara:** Números como number, booleans como boolean
4. **Flexibilidade:** Campos opcionais para diferentes tipos
5. **Compatibilidade:** Funciona perfeitamente com n8n
6. **Estruturado:** Ideal para automações complexas

## 🚀 **Status Atual:**

- ✅ **Payload estruturado** implementado
- ✅ **Todos os campos** solicitados disponíveis
- ✅ **Testado e funcionando** (Status 200)
- ✅ **n8n recebendo** dados estruturados
- ✅ **Interface web** gerando payload correto
- ✅ **Sistema 100% operacional**

**Agora você pode usar os dados separados no n8n com facilidade!** 🎉

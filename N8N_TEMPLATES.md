# 📱 Templates para n8n - WhatsApp

## 🎯 **Template Principal (Aprovado)**

### **Código para Function Node:**
```javascript
// Template para mensagem do WhatsApp
const template = `🏦 *${$json.title}*

👤 Olá, ${$json.user_name}!

📋 *Detalhes da Conta:*
• 🏷️ Conta: ${$json.bill_name}
• 💰 Valor: R$ ${$json.bill_amount.toFixed(2).replace('.', ',')}
• 📅 Vencimento: Dia ${$json.due_day}

⏰ *Lembrete:* ${$json.message}

${$json.is_test ? '🧪 *Esta é uma mensagem de teste*' : ''}

---
Smart Spend Alerts 📊`;

return {
  to: $json.phone_number,
  message: template
};
```

### **📱 Exemplo de Mensagem Gerada:**
```
🏦 💡 Conta Vencendo Hoje!

👤 Olá, Lucca Lacerda!

📋 Detalhes da Conta:
• 🏷️ Conta: Conta de Luz
• 💰 Valor: R$ 187,50
• 📅 Vencimento: Dia 17

⏰ Lembrete: Sua conta vence hoje, não esqueça de pagar!

---
Smart Spend Alerts 📊
```

## 📊 **Campos Disponíveis**

| Campo | Tipo | Exemplo | Descrição |
|-------|------|---------|-----------|
| `$json.user_name` | string | "Lucca Lacerda" | Nome do usuário |
| `$json.phone_number` | string | "5531989796921@s.whatsapp.net" | Número WhatsApp |
| `$json.bill_name` | string | "Conta de Luz" | Nome da conta |
| `$json.bill_amount` | number | 187.5 | Valor da conta |
| `$json.due_day` | number | 17 | Dia do vencimento |
| `$json.title` | string | "💡 Conta Vencendo Hoje!" | Título da notificação |
| `$json.message` | string | "Sua conta vence hoje..." | Mensagem personalizada |
| `$json.is_test` | boolean | true/false | Se é teste |
| `$json.notification_type` | string | "payment_reminder" | Tipo da notificação |

## 🎨 **Templates Alternativos**

### **Template Simples:**
```javascript
const simpleTemplate = `Olá ${$json.user_name}! 

Sua ${$json.bill_name} no valor de R$ ${$json.bill_amount.toFixed(2).replace('.', ',')} vence no dia ${$json.due_day}.

Não esqueça de pagar! 😊`;

return {
  to: $json.phone_number,
  message: simpleTemplate
};
```

### **Template Urgente (Follow-up):**
```javascript
const urgentTemplate = `🚨 *URGENTE* - ${$json.user_name}

Sua ${$json.bill_name} no valor de R$ ${$json.bill_amount.toFixed(2).replace('.', ',')} venceu hoje!

⚠️ Evite juros e multas, pague o quanto antes.

Smart Spend Alerts 📊`;

return {
  to: $json.phone_number,
  message: urgentTemplate
};
```

### **Template Meta de Gastos:**
```javascript
const goalTemplate = `📊 *Alerta de Meta* - ${$json.user_name}

${$json.message}

💰 Continue controlando seus gastos!

Smart Spend Alerts 📊`;

return {
  to: $json.phone_number,
  message: goalTemplate
};
```

## 🔧 **Configuração no n8n**

### **1. Webhook Trigger**
- URL: Recebe dados do Supabase
- Método: POST
- Resposta: JSON com todos os campos

### **2. Function Node**
- Nome: "Format WhatsApp Message"
- Código: Template aprovado (acima)

### **3. WhatsApp Node**
- Para: `$json.to`
- Mensagem: `$json.message`

## 🎯 **Tipos de Notificação**

### **Por Tipo:**
```javascript
// Personalizar mensagem por tipo
let template;

switch($json.notification_type) {
  case 'payment_reminder':
    template = `🏦 *Lembrete de Pagamento*...`;
    break;
  case 'budget_alert':
    template = `📊 *Alerta de Orçamento*...`;
    break;
  case 'goal_warning':
    template = `⚠️ *Meta de Gastos*...`;
    break;
  default:
    template = `🔔 *Notificação*...`;
}
```

## 💡 **Dicas de Formatação**

### **Valor Monetário:**
```javascript
// Formatar para R$ 187,50
const formatCurrency = (value) => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};
```

### **Data:**
```javascript
// Formatar data
const formatDate = (day) => {
  return `Dia ${day}`;
};
```

### **Condicional para Teste:**
```javascript
// Mostrar apenas em testes
${$json.is_test ? '🧪 *Esta é uma mensagem de teste*' : ''}
```

## ✅ **Status do Template**

- ✅ **Template aprovado** e funcionando
- ✅ **Todos os campos** disponíveis
- ✅ **Formatação** correta do valor
- ✅ **Emojis** para melhor visualização
- ✅ **Condicional** para mensagens de teste
- ✅ **Marca** Smart Spend Alerts

## 🚀 **Próximos Passos**

1. **Implementar** o template no n8n
2. **Testar** com diferentes tipos de notificação
3. **Personalizar** para outros cenários (metas, cartão, etc.)
4. **Monitorar** entrega das mensagens

**Template perfeito para uso em produção!** 🎉📱

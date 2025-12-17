# 💳 Funcionalidades Avançadas de Cartão de Crédito

## ✅ Novas Funcionalidades Implementadas

### 1. 📅 Sistema de Parcelas Automático

Agora quando você faz uma compra parcelada, o sistema automaticamente:
- ✅ Cria todas as parcelas futuras
- ✅ Distribui o valor corretamente pelos meses
- ✅ A primeira parcela fica no mês atual
- ✅ As demais parcelas vão para os meses seguintes

### 2. 📊 Histórico Detalhado do Cartão

- ✅ Visualização completa de todas as transações
- ✅ Identificação de parcelas (1/3, 2/3, etc.)
- ✅ Separação entre compras à vista e parceladas

### 3. 🔮 Visualização de Parcelas Futuras

- ✅ Ver todas as parcelas que ainda vão vencer
- ✅ Resumo por mês dos próximos 12 meses
- ✅ Planejamento financeiro antecipado

### 4. 📋 Controle de Faturas

- ✅ Tabela específica para faturas dos cartões
- ✅ Controle de pagamento das faturas
- ✅ Cálculo automático do valor total

---

## 🚀 Como Usar - Exemplos Práticos

### 1. Criar uma Compra Parcelada

```typescript
import { supabase } from '@/lib/supabase';

// Exemplo: Compra de R$ 300 em 3x no cartão
const { data: user } = await supabase.auth.getUser();

const { data: transactionIds, error } = await supabase
  .rpc('create_installment_transactions', {
    p_user_id: user.user.id,
    p_amount: 300.00,
    p_category: 'lazer',
    p_credit_card_id: 'seu-cartao-id',
    p_installments: 3,
    p_first_date: '2024-01-15', // Data da primeira parcela
    p_note: 'Fone de ouvido Bluetooth'
  });

// Resultado: 3 transações criadas automaticamente
// Parcela 1/3: R$ 100,00 - 15/01/2024
// Parcela 2/3: R$ 100,00 - 15/02/2024  
// Parcela 3/3: R$ 100,00 - 15/03/2024
```

### 2. Ver Histórico do Cartão

```typescript
// Buscar histórico completo do cartão
const { data: history, error } = await supabase
  .rpc('get_credit_card_history', {
    p_card_id: 'seu-cartao-id',
    p_limit: 50 // Últimas 50 transações
  });

// Resultado exemplo:
// [
//   {
//     date: '2024-01-15',
//     amount: 100.00,
//     category: 'lazer',
//     note: 'Fone de ouvido Bluetooth - Parcela 1/3',
//     installment_info: 'Parcela 1/3',
//     is_installment: true
//   },
//   {
//     date: '2024-01-10', 
//     amount: 45.00,
//     category: 'alimentacao',
//     note: 'Almoço',
//     installment_info: 'À vista',
//     is_installment: false
//   }
// ]
```

### 3. Ver Parcelas Futuras

```typescript
// Buscar todas as parcelas que ainda vão vencer
const { data: futureInstallments, error } = await supabase
  .rpc('get_future_installments', {
    p_card_id: 'seu-cartao-id',
    p_from_date: '2024-01-15' // A partir de hoje
  });

// Resultado exemplo:
// [
//   {
//     date: '2024-02-15',
//     amount: 100.00,
//     category: 'lazer', 
//     current_installment: 2,
//     total_installments: 3,
//     months_ahead: 1,
//     note: 'Fone de ouvido Bluetooth - Parcela 2/3'
//   },
//   {
//     date: '2024-03-15',
//     amount: 100.00,
//     category: 'lazer',
//     current_installment: 3, 
//     total_installments: 3,
//     months_ahead: 2,
//     note: 'Fone de ouvido Bluetooth - Parcela 3/3'
//   }
// ]
```

### 4. Resumo de Parcelas por Mês

```typescript
// Ver resumo das parcelas pelos próximos 12 meses
const { data: monthlyInstallments, error } = await supabase
  .rpc('get_installments_by_month', {
    p_card_id: 'seu-cartao-id',
    p_months_ahead: 12
  });

// Resultado exemplo:
// [
//   {
//     month_year: '02/2024',
//     month_date: '2024-02-01',
//     total_amount: 250.00,
//     installment_count: 3
//   },
//   {
//     month_year: '03/2024', 
//     month_date: '2024-03-01',
//     total_amount: 180.00,
//     installment_count: 2
//   }
// ]
```

### 5. Controlar Faturas do Cartão

```typescript
// Criar uma nova fatura
const { data, error } = await supabase
  .from('credit_card_statements')
  .insert({
    user_id: user.user.id,
    credit_card_id: 'seu-cartao-id',
    statement_date: '2024-01-25', // Data de fechamento
    due_date: '2024-02-10',       // Data de vencimento
    total_amount: 450.00,
    is_paid: false
  });

// Marcar fatura como paga
const { data, error } = await supabase
  .from('credit_card_statements')
  .update({ 
    is_paid: true, 
    paid_amount: 450.00 
  })
  .eq('id', 'fatura-id');

// Calcular total da fatura automaticamente
const { data: total, error } = await supabase
  .rpc('calculate_statement_total', {
    p_card_id: 'seu-cartao-id',
    p_statement_date: '2024-01-25'
  });
```

---

## 🎯 Componentes Sugeridos para o Frontend

### 1. Componente de Compra Parcelada

```typescript
// AddInstallmentExpense.tsx
interface InstallmentExpenseForm {
  amount: number;
  category: string;
  creditCardId: string;
  installments: number;
  firstDate: string;
  note?: string;
}

const AddInstallmentExpense = () => {
  const handleSubmit = async (data: InstallmentExpenseForm) => {
    const { data: transactionIds } = await supabase
      .rpc('create_installment_transactions', {
        p_user_id: user.id,
        p_amount: data.amount,
        p_category: data.category,
        p_credit_card_id: data.creditCardId,
        p_installments: data.installments,
        p_first_date: data.firstDate,
        p_note: data.note
      });
    
    // Mostrar sucesso e redirecionar
  };
};
```

### 2. Componente de Histórico do Cartão

```typescript
// CreditCardHistory.tsx
const CreditCardHistory = ({ cardId }: { cardId: string }) => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .rpc('get_credit_card_history', {
          p_card_id: cardId,
          p_limit: 50
        });
      setHistory(data || []);
    };
    
    fetchHistory();
  }, [cardId]);

  return (
    <div className="space-y-4">
      {history.map((transaction) => (
        <div key={transaction.id} className="border rounded p-4">
          <div className="flex justify-between">
            <span>{transaction.note}</span>
            <span>R$ {transaction.amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500">
            {transaction.installment_info} • {transaction.date}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 3. Componente de Parcelas Futuras

```typescript
// FutureInstallments.tsx
const FutureInstallments = ({ cardId }: { cardId: string }) => {
  const [futureInstallments, setFutureInstallments] = useState([]);
  
  useEffect(() => {
    const fetchFutureInstallments = async () => {
      const { data } = await supabase
        .rpc('get_future_installments', {
          p_card_id: cardId
        });
      setFutureInstallments(data || []);
    };
    
    fetchFutureInstallments();
  }, [cardId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Parcelas Futuras</h3>
      {futureInstallments.map((installment) => (
        <div key={installment.id} className="border rounded p-4">
          <div className="flex justify-between">
            <span>{installment.note}</span>
            <span>R$ {installment.amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500">
            {installment.date} • {installment.months_ahead} mês(es) à frente
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 4. Dashboard de Parcelas por Mês

```typescript
// InstallmentsDashboard.tsx
const InstallmentsDashboard = ({ cardId }: { cardId: string }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  
  useEffect(() => {
    const fetchMonthlyData = async () => {
      const { data } = await supabase
        .rpc('get_installments_by_month', {
          p_card_id: cardId,
          p_months_ahead: 12
        });
      setMonthlyData(data || []);
    };
    
    fetchMonthlyData();
  }, [cardId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {monthlyData.map((month) => (
        <div key={month.month_year} className="border rounded p-4">
          <h4 className="font-semibold">{month.month_year}</h4>
          <p className="text-2xl font-bold">R$ {month.total_amount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            {month.installment_count} parcela(s)
          </p>
        </div>
      ))}
    </div>
  );
};
```

---

## 📱 Fluxo de Uso Recomendado

### 1. **Adicionar Compra Parcelada**
1. Usuário vai em "Adicionar Despesa"
2. Seleciona o cartão de crédito
3. Marca "Parcelar compra"
4. Define número de parcelas
5. Sistema cria todas as parcelas automaticamente

### 2. **Visualizar Gastos do Cartão**
1. Usuário vai na página do cartão específico
2. Vê o histórico completo de transações
3. Pode filtrar por período
4. Vê claramente quais são parcelas e quais são à vista

### 3. **Planejar Gastos Futuros**
1. Usuário acessa "Parcelas Futuras"
2. Vê todas as parcelas que ainda vão vencer
3. Pode se planejar financeiramente
4. Recebe alertas próximo ao vencimento

### 4. **Controlar Faturas**
1. Sistema gera faturas automaticamente
2. Usuário marca como paga quando necessário
3. Acompanha histórico de pagamentos

---

## 🔄 Próximas Melhorias Sugeridas

Vou documentar mais sugestões na próxima seção...

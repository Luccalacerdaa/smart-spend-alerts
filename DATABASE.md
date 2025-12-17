# 📊 Estrutura do Banco de Dados - Smart Spend Alerts

Este documento descreve a estrutura completa do banco de dados Supabase para o sistema de controle financeiro.

## 🔐 Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` e renomeie para `.env.local`:

```bash
cp .env.example .env.local
```

As variáveis já estão configuradas para o projeto FINANCEIRO no Supabase.

## 📁 Tabelas

### 1. `profiles`
Perfis de usuários que estendem a tabela `auth.users` do Supabase.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do usuário (FK para auth.users) |
| `email` | TEXT | Email do usuário |
| `full_name` | TEXT | Nome completo |
| `avatar_url` | TEXT | URL do avatar |
| `phone` | TEXT | Telefone |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Características:**
- Criado automaticamente via trigger quando um usuário se registra
- RLS habilitado (usuários só veem seu próprio perfil)

---

### 2. `credit_cards`
Cartões de crédito dos usuários.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único do cartão |
| `user_id` | UUID | ID do usuário (FK) |
| `name` | TEXT | Nome do cartão |
| `card_limit` | DECIMAL(10,2) | Limite do cartão |
| `closing_day` | INTEGER | Dia de fechamento da fatura (1-31) |
| `due_day` | INTEGER | Dia de vencimento da fatura (1-31) |
| `color` | TEXT | Cor para identificação visual |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Características:**
- RLS habilitado
- Constraints para validar dias (1-31)
- Cor padrão: `#10b981` (verde)

---

### 3. `transactions`
Transações financeiras (receitas e despesas).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único da transação |
| `user_id` | UUID | ID do usuário (FK) |
| `type` | ENUM | Tipo: `income` ou `expense` |
| `amount` | DECIMAL(10,2) | Valor da transação |
| `category` | ENUM | Categoria (obrigatório para despesas) |
| `source` | TEXT | Fonte (obrigatório para receitas) |
| `note` | TEXT | Observações |
| `date` | DATE | Data da transação |
| `credit_card_id` | UUID | ID do cartão (FK, opcional) |
| `is_installment` | BOOLEAN | Se é parcelado |
| `installments` | INTEGER | Número de parcelas |
| `current_installment` | INTEGER | Parcela atual |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Enums:**
- `transaction_type`: `income`, `expense`
- `category_type`: `alimentacao`, `transporte`, `lazer`, `contas`, `outros`

**Características:**
- RLS habilitado
- Constraints para garantir integridade:
  - Despesas devem ter categoria
  - Receitas devem ter fonte
  - Parcelamentos validados
- Índices em: `user_id`, `type`, `date`, `credit_card_id`, `category`

---

### 4. `monthly_goals`
Metas mensais de gastos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único da meta |
| `user_id` | UUID | ID do usuário (FK) |
| `amount` | DECIMAL(10,2) | Valor da meta |
| `month` | DATE | Mês da meta (YYYY-MM-01) |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Características:**
- RLS habilitado
- UNIQUE constraint em (user_id, month)
- Armazena o primeiro dia do mês

---

### 5. `fixed_payments`
Pagamentos fixos recorrentes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único do pagamento |
| `user_id` | UUID | ID do usuário (FK) |
| `name` | TEXT | Nome do pagamento |
| `amount` | DECIMAL(10,2) | Valor |
| `due_day` | INTEGER | Dia de vencimento (1-31) |
| `category` | ENUM | Categoria |
| `is_paid` | BOOLEAN | Se foi pago |
| `month` | DATE | Mês (YYYY-MM-01) |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

**Características:**
- RLS habilitado
- Constraint para validar dia de vencimento (1-31)
- Índices em: `user_id`, `month`, `due_day`, `is_paid`

---

### 6. `notifications`
Notificações do sistema.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID único da notificação |
| `user_id` | UUID | ID do usuário (FK) |
| `title` | TEXT | Título |
| `message` | TEXT | Mensagem |
| `type` | TEXT | Tipo de notificação |
| `is_read` | BOOLEAN | Se foi lida |
| `related_id` | UUID | ID relacionado (opcional) |
| `created_at` | TIMESTAMPTZ | Data de criação |

**Tipos de Notificação:**
- `due_date` - Vencimento de conta
- `budget_alert` - Alerta de orçamento
- `payment_reminder` - Lembrete de pagamento

**Características:**
- RLS habilitado
- Índices em: `user_id`, `is_read`, `created_at`

---

## 🔧 Funções do Banco

### 1. `get_monthly_expenses(p_user_id, p_month)`
Retorna o total de despesas de um usuário em um mês.

```sql
SELECT public.get_monthly_expenses(
  'user-uuid',
  '2024-01-01'::DATE
);
```

### 2. `get_monthly_income(p_user_id, p_month)`
Retorna o total de receitas de um usuário em um mês.

```sql
SELECT public.get_monthly_income(
  'user-uuid',
  '2024-01-01'::DATE
);
```

### 3. `get_expenses_by_category(p_user_id, p_month)`
Retorna despesas agrupadas por categoria.

```sql
SELECT * FROM public.get_expenses_by_category(
  'user-uuid',
  '2024-01-01'::DATE
);
```

### 4. `get_card_expenses(p_card_id, p_month)`
Retorna o total gasto em um cartão específico no mês.

```sql
SELECT public.get_card_expenses(
  'card-uuid',
  '2024-01-01'::DATE
);
```

---

## 🔐 Segurança (RLS - Row Level Security)

Todas as tabelas possuem RLS habilitado com as seguintes políticas:

### Políticas Padrão (para todas as tabelas)

1. **SELECT**: Usuários podem ver apenas seus próprios dados
   ```sql
   auth.uid() = user_id
   ```

2. **INSERT**: Usuários podem inserir apenas para si mesmos
   ```sql
   auth.uid() = user_id
   ```

3. **UPDATE**: Usuários podem atualizar apenas seus próprios dados
   ```sql
   auth.uid() = user_id
   ```

4. **DELETE**: Usuários podem deletar apenas seus próprios dados
   ```sql
   auth.uid() = user_id
   ```

---

## 🎯 Triggers

### 1. `handle_new_user()`
Cria automaticamente um perfil quando um novo usuário se registra.

### 2. `handle_updated_at()`
Atualiza automaticamente o campo `updated_at` em todas as tabelas quando um registro é modificado.

---

## 📊 Relacionamentos

```
auth.users (Supabase Auth)
    │
    ├─→ profiles (1:1)
    │
    ├─→ credit_cards (1:N)
    │       │
    │       └─→ transactions (1:N)
    │
    ├─→ transactions (1:N)
    │
    ├─→ monthly_goals (1:N)
    │
    ├─→ fixed_payments (1:N)
    │
    └─→ notifications (1:N)
```

---

## 🚀 Como Usar no Código

### Exemplo: Buscar transações do usuário

```typescript
import { supabase } from '@/lib/supabase';

// Buscar todas as transações do mês
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .gte('date', '2024-01-01')
  .lt('date', '2024-02-01')
  .order('date', { ascending: false });
```

### Exemplo: Adicionar uma despesa

```typescript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    type: 'expense',
    amount: 50.00,
    category: 'alimentacao',
    date: '2024-01-15',
    note: 'Almoço',
    user_id: user.id
  });
```

### Exemplo: Buscar cartões com total gasto

```typescript
const { data: cards } = await supabase
  .from('credit_cards')
  .select('*');

for (const card of cards) {
  const { data: total } = await supabase
    .rpc('get_card_expenses', {
      p_card_id: card.id,
      p_month: '2024-01-01'
    });
  
  console.log(`${card.name}: R$ ${total}`);
}
```

---

## 🔄 Migrações Aplicadas

1. ✅ `create_users_table` - Tabela de perfis e triggers
2. ✅ `create_credit_cards_table` - Tabela de cartões
3. ✅ `create_categories_and_transactions_tables` - Transações e categorias
4. ✅ `create_monthly_goals_table` - Metas mensais
5. ✅ `create_fixed_payments_table` - Pagamentos fixos
6. ✅ `create_notifications_table` - Notificações
7. ✅ `create_functions_and_triggers` - Funções auxiliares
8. ✅ `fix_function_search_path_security` - Correção de segurança

---

## 📝 Tipos TypeScript

Todos os tipos do banco estão disponíveis em `src/types/database.ts`, gerados automaticamente a partir do schema do Supabase.

```typescript
import { Database } from '@/types/database';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
```

---

## 🌐 Projeto Supabase

- **Nome**: FINANCEIRO
- **URL**: https://zztdqxjxjhqddtqpramt.supabase.co
- **Região**: sa-east-1 (São Paulo)
- **Status**: ACTIVE_HEALTHY

---

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)


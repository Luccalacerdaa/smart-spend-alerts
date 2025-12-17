# 🚀 Setup do Projeto - Smart Spend Alerts

## ✅ Banco de Dados Configurado

O banco de dados Supabase foi criado com sucesso! Todas as tabelas, relacionamentos e políticas de segurança estão prontos.

## 📝 Próximos Passos

### 1. Configurar as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto e copie o conteúdo de `.env.example`:

```bash
cp .env.example .env.local
```

O arquivo já contém as credenciais corretas do Supabase:
- **URL**: `https://zztdqxjxjhqddtqpramt.supabase.co`
- **ANON KEY**: Chave pública para autenticação

### 2. Instalar Dependências

```bash
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas

1. ✅ **profiles** - Perfis de usuários
2. ✅ **credit_cards** - Cartões de crédito
3. ✅ **transactions** - Transações (receitas e despesas)
4. ✅ **monthly_goals** - Metas mensais
5. ✅ **fixed_payments** - Pagamentos fixos recorrentes
6. ✅ **notifications** - Notificações do sistema

### Características de Segurança

- ✅ **RLS (Row Level Security)** habilitado em todas as tabelas
- ✅ Políticas de segurança configuradas (usuários só acessam seus próprios dados)
- ✅ Triggers automáticos para `created_at` e `updated_at`
- ✅ Criação automática de perfil quando usuário se registra
- ✅ Constraints para validação de dados

### Funções Disponíveis

- `get_monthly_expenses(user_id, month)` - Total de despesas do mês
- `get_monthly_income(user_id, month)` - Total de receitas do mês
- `get_expenses_by_category(user_id, month)` - Despesas por categoria
- `get_card_expenses(card_id, month)` - Total gasto no cartão

## 🔧 Arquivos Criados

### 1. Tipos TypeScript
- **Arquivo**: `src/types/database.ts`
- **Descrição**: Tipos gerados automaticamente do schema Supabase
- **Uso**: Import types from `@/types/database`

### 2. Cliente Supabase
- **Arquivo**: `src/lib/supabase.ts`
- **Descrição**: Cliente configurado com autenticação
- **Uso**: Import `supabase` from `@/lib/supabase`

### 3. Documentação
- **Arquivo**: `DATABASE.md`
- **Descrição**: Documentação completa da estrutura do banco
- **Conteúdo**: 
  - Esquema de todas as tabelas
  - Relacionamentos
  - Exemplos de uso
  - Funções disponíveis

## 💡 Exemplo de Uso

### Autenticação

```typescript
import { supabase } from '@/lib/supabase';

// Registrar novo usuário
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@email.com',
  password: 'senha123',
  options: {
    data: {
      full_name: 'Nome do Usuário'
    }
  }
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'senha123'
});
```

### Adicionar Transação

```typescript
import { supabase } from '@/lib/supabase';

// Obter usuário atual
const { data: { user } } = await supabase.auth.getUser();

// Adicionar despesa
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: user.id,
    type: 'expense',
    amount: 50.00,
    category: 'alimentacao',
    date: '2024-01-15',
    note: 'Almoço'
  });
```

### Buscar Transações

```typescript
import { supabase } from '@/lib/supabase';

// Buscar transações do mês atual
const startOfMonth = new Date();
startOfMonth.setDate(1);
const endOfMonth = new Date(startOfMonth);
endOfMonth.setMonth(endOfMonth.getMonth() + 1);

const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .gte('date', startOfMonth.toISOString().split('T')[0])
  .lt('date', endOfMonth.toISOString().split('T')[0])
  .order('date', { ascending: false });
```

### Usar Funções do Banco

```typescript
import { supabase } from '@/lib/supabase';

// Total de despesas do mês
const { data: totalExpenses } = await supabase
  .rpc('get_monthly_expenses', {
    p_user_id: user.id,
    p_month: '2024-01-01'
  });

// Despesas por categoria
const { data: byCategory } = await supabase
  .rpc('get_expenses_by_category', {
    p_user_id: user.id,
    p_month: '2024-01-01'
  });
```

## 🔍 Status do Projeto Supabase

- **Nome**: FINANCEIRO
- **ID**: `zztdqxjxjhqddtqpramt`
- **Região**: sa-east-1 (São Paulo)
- **Status**: ✅ ACTIVE_HEALTHY
- **PostgreSQL**: v17.6
- **Tabelas**: 6
- **Funções**: 4
- **RLS**: ✅ Habilitado

## 📚 Recursos

- [Documentação Completa do Banco](./DATABASE.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ⚠️ Avisos de Performance

Os seguintes avisos são normais em um banco de dados novo e podem ser ignorados por enquanto:

1. **Índices não utilizados**: Os índices foram criados mas ainda não foram usados (normal em banco vazio)
2. **RLS Performance**: Otimização sugerida para policies RLS (só necessário em escala)

Esses avisos serão resolvidos naturalmente quando o sistema estiver em uso ou podem ser otimizados mais tarde se necessário.

## ✅ Tudo Pronto!

O banco de dados está 100% configurado e pronto para uso. Você pode começar a desenvolver as funcionalidades do frontend conectando-se ao Supabase através do cliente criado em `src/lib/supabase.ts`.

**Próximo passo recomendado**: Implementar a autenticação de usuários e criar as páginas de login/registro.


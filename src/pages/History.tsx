import { useNavigate } from 'react-router-dom';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { CATEGORY_ICONS, Expense, Income } from '@/types/finance';

export default function History() {
  const navigate = useNavigate();
  const { getMonthlyExpenses, getMonthlyIncome, deleteTransaction, currentMonth } = useFinanceContext();

  const expenses = getMonthlyExpenses();
  const income = getMonthlyIncome();
  
  // Combine and sort by date (most recent first)
  const transactions = [...expenses, ...income].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const monthName = new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Histórico</h1>
            <p className="text-sm opacity-80 capitalize">{monthName}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-4 shadow border flex items-center gap-3"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  t.type === 'expense' ? 'bg-red-100' : 'bg-emerald-100'
                }`}>
                  {t.type === 'expense' 
                    ? CATEGORY_ICONS[(t as Expense).category]
                    : '💰'
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {t.type === 'expense' ? (
                      <TrendingDown className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                    <p className="font-medium truncate">
                      {t.type === 'expense' 
                        ? (t as Expense).category.charAt(0).toUpperCase() + (t as Expense).category.slice(1)
                        : (t as Income).source.charAt(0).toUpperCase() + (t as Income).source.slice(1)
                      }
                    </p>
                  </div>
                  {t.note && (
                    <p className="text-xs text-muted-foreground truncate">{t.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                </div>

                {/* Amount */}
                <p className={`font-bold ${
                  t.type === 'expense' ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                </p>

                {/* Delete */}
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl">📝</span>
            <p className="text-muted-foreground mt-4">Nenhuma transação</p>
            <p className="text-sm text-muted-foreground">Adicione gastos ou receitas</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

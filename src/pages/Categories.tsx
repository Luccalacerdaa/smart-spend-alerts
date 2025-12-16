import { useNavigate } from 'react-router-dom';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS, Category } from '@/types/finance';

export default function Categories() {
  const navigate = useNavigate();
  const { getExpensesByCategory, getTotalExpenses, currentMonth } = useFinanceContext();

  const byCategory = getExpensesByCategory();
  const total = getTotalExpenses();

  const data = (Object.keys(byCategory) as Category[])
    .filter(cat => byCategory[cat] > 0)
    .map(cat => ({
      name: CATEGORY_LABELS[cat],
      value: byCategory[cat],
      icon: CATEGORY_ICONS[cat],
      color: CATEGORY_COLORS[cat],
      percentage: total > 0 ? ((byCategory[cat] / total) * 100).toFixed(1) : '0',
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const monthName = new Date(currentMonth + '-01').toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Gastos por Categoria</h1>
            <p className="text-sm opacity-80 capitalize">{monthName}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {data.length > 0 ? (
          <>
            {/* Pie Chart */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl p-4 shadow-lg border mb-4"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Total in center */}
              <div className="text-center -mt-40 mb-32">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{formatCurrency(total)}</p>
              </div>
            </motion.div>

            {/* Category List */}
            <div className="space-y-3">
              {data.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 shadow border flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">{cat.percentage}% do total</p>
                  </div>
                  <p className="font-bold text-lg">{formatCurrency(cat.value)}</p>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl">📊</span>
            <p className="text-muted-foreground mt-4">Nenhum gasto registrado</p>
            <p className="text-sm text-muted-foreground">Adicione gastos para ver o gráfico</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

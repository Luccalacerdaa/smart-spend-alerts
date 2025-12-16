import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    getTotalExpenses, 
    getTotalIncome, 
    getMonthlyGoal, 
    getRemainingBudget,
    getProgressPercentage,
    currentMonth 
  } = useFinanceContext();

  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();
  const goal = getMonthlyGoal();
  const remaining = getRemainingBudget();
  const progress = getProgressPercentage();

  const getProgressColor = () => {
    if (progress >= 90) return 'bg-red-500';
    if (progress >= 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStatusEmoji = () => {
    if (progress >= 90) return '🚨';
    if (progress >= 70) return '⚠️';
    return '✅';
  };

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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl"
      >
        <p className="text-sm opacity-80 capitalize">{monthName}</p>
        <h1 className="text-2xl font-bold mt-1">Olá! 👋</h1>
        
        {/* Balance Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Saldo do mês</p>
              <p className="text-3xl font-bold">{formatCurrency(totalIncome - totalExpenses)}</p>
            </div>
            <Wallet className="w-10 h-10 opacity-60" />
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-4 shadow-lg border"
          >
            <div className="flex items-center gap-2 text-emerald-500">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Receitas</span>
            </div>
            <p className="text-xl font-bold mt-2 text-foreground">{formatCurrency(totalIncome)}</p>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-4 shadow-lg border"
          >
            <div className="flex items-center gap-2 text-red-500">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm font-medium">Gastos</span>
            </div>
            <p className="text-xl font-bold mt-2 text-foreground">{formatCurrency(totalExpenses)}</p>
          </motion.div>
        </div>
      </div>

      {/* Goal Progress */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-4 mt-4 bg-card rounded-2xl p-5 shadow-lg border"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-semibold">Meta Mensal</span>
          </div>
          <span className="text-2xl">{getStatusEmoji()}</span>
        </div>

        {goal > 0 ? (
          <>
            <div className="relative mb-3">
              <Progress 
                value={progress} 
                className="h-4 bg-muted"
              />
              <div 
                className={`absolute inset-0 h-4 rounded-full transition-all ${getProgressColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(totalExpenses)} de {formatCurrency(goal)}
              </span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground">Ainda pode gastar:</p>
              <p className={`text-2xl font-bold ${remaining > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">Defina sua meta mensal</p>
            <Button onClick={() => navigate('/app/meta')} variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Definir Meta
            </Button>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="flex gap-3">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1"
          >
            <Button
              onClick={() => navigate('/app/gasto')}
              className="w-full h-14 text-lg bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg"
            >
              <TrendingDown className="w-5 h-5 mr-2" />
              Gasto
            </Button>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1"
          >
            <Button 
              onClick={() => navigate('/app/receita')}
              className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-lg"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Receita
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

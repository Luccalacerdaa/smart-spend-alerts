import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function MonthlyGoal() {
  const navigate = useNavigate();
  const { getMonthlyGoal, setMonthlyGoal, currentMonth } = useFinanceContext();
  
  const currentGoal = getMonthlyGoal();
  const [amount, setAmount] = useState(currentGoal > 0 ? currentGoal.toString() : '');

  const presetAmounts = [1000, 2000, 3000, 5000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    setMonthlyGoal(value);
    toast.success('Meta definida!');
    navigate('/');
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Meta Mensal</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center py-6"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        {/* Month Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground capitalize"
        >
          Definir meta para <span className="font-semibold text-foreground">{monthName}</span>
        </motion.p>

        {/* Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <Label className="text-muted-foreground text-sm">Limite de gastos</Label>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-3xl text-muted-foreground">R$</span>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-4xl font-bold text-center border-none shadow-none bg-transparent w-48 h-auto p-0 focus-visible:ring-0"
            />
          </div>
        </motion.div>

        {/* Preset Amounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="text-sm font-medium mb-3 block">Valores sugeridos</Label>
          <div className="grid grid-cols-2 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`p-3 rounded-xl border-2 transition-all ${
                  amount === preset.toString()
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-semibold text-foreground">{formatCurrency(preset)}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/50 p-4 rounded-xl"
        >
          <p className="text-sm text-muted-foreground text-center">
            💡 Defina um limite realista para seus gastos mensais. 
            Você receberá alertas visuais conforme se aproximar da meta.
          </p>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Button 
            type="submit" 
            className="w-full h-14 text-lg rounded-2xl"
          >
            <Check className="w-5 h-5 mr-2" />
            Salvar Meta
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

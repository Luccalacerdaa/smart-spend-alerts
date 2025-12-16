import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/finance';
import { toast } from 'sonner';

export default function AddExpense() {
  const navigate = useNavigate();
  const { addExpense } = useFinanceContext();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('outros');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const categories: Category[] = ['alimentacao', 'transporte', 'lazer', 'contas', 'outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    addExpense({
      amount: value,
      category,
      date,
      note: note || undefined,
    });

    toast.success('Gasto adicionado!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-red-500 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Adicionar Gasto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <Label className="text-muted-foreground text-sm">Valor</Label>
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

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label className="text-sm font-medium mb-3 block">Categoria</Label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  category === cat 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl block">{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs mt-1 block text-foreground">{CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="date" className="text-sm font-medium">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2"
          />
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="note" className="text-sm font-medium">Observação (opcional)</Label>
          <Textarea
            id="note"
            placeholder="Ex: Almoço no restaurante"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 resize-none"
            rows={2}
          />
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
            className="w-full h-14 text-lg bg-red-500 hover:bg-red-600 rounded-2xl"
          >
            <Check className="w-5 h-5 mr-2" />
            Salvar Gasto
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

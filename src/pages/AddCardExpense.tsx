import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Category, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/finance';
import { toast } from 'sonner';

export default function AddCardExpense() {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();
  const { addExpense, creditCards } = useFinanceContext();
  
  const card = creditCards.find(c => c.id === cardId);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('outros');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState('2');

  const categories: Category[] = ['alimentacao', 'transporte', 'lazer', 'contas', 'outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    const installmentCount = isInstallment ? parseInt(installments) : 1;
    if (isInstallment && (isNaN(installmentCount) || installmentCount < 2 || installmentCount > 48)) {
      toast.error('Número de parcelas inválido (2-48)');
      return;
    }

    const installmentValue = value / installmentCount;

    // Create expense for each installment
    for (let i = 0; i < installmentCount; i++) {
      const expenseDate = new Date(date);
      expenseDate.setMonth(expenseDate.getMonth() + i);
      
      addExpense({
        amount: installmentValue,
        category,
        date: expenseDate.toISOString().split('T')[0],
        note: isInstallment ? `${note ? note + ' - ' : ''}Parcela ${i + 1}/${installmentCount}` : note || undefined,
        creditCardId: cardId,
        isInstallment,
        installments: installmentCount,
        currentInstallment: i + 1,
      });
    }

    toast.success(isInstallment ? `${installmentCount} parcelas adicionadas!` : 'Gasto no cartão adicionado!');
    navigate('/app/cartoes');
  };

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cartão não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div 
        className="text-white p-4"
        style={{ backgroundColor: card.color }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Gasto no Cartão</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <CreditCard className="w-4 h-4" />
              {card.name}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <Label className="text-muted-foreground text-sm">Valor Total</Label>
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

        {/* Installment Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl"
        >
          <div>
            <Label className="text-sm font-medium">Parcelado?</Label>
            <p className="text-xs text-muted-foreground">Dividir em várias parcelas</p>
          </div>
          <Switch
            checked={isInstallment}
            onCheckedChange={setIsInstallment}
          />
        </motion.div>

        {/* Installments Number */}
        {isInstallment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Label htmlFor="installments" className="text-sm font-medium">Número de Parcelas</Label>
            <Input
              id="installments"
              type="number"
              min="2"
              max="48"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="mt-2"
            />
            {amount && !isNaN(parseFloat(amount.replace(',', '.'))) && (
              <p className="text-sm text-muted-foreground mt-2">
                {parseInt(installments) || 0}x de R$ {(parseFloat(amount.replace(',', '.')) / (parseInt(installments) || 1)).toFixed(2).replace('.', ',')}
              </p>
            )}
          </motion.div>
        )}

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
            placeholder="Ex: Compra na Amazon"
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
            className="w-full h-14 text-lg rounded-2xl"
            style={{ backgroundColor: card.color }}
          >
            <Check className="w-5 h-5 mr-2" />
            Salvar Gasto
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

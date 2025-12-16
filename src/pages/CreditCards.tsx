import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, CreditCard, Trash2, X, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CARD_COLORS } from '@/types/finance';
import { toast } from 'sonner';

export default function CreditCards() {
  const navigate = useNavigate();
  const { creditCards, addCreditCard, deleteCreditCard, getCardExpenses, currentMonth } = useFinanceContext();
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [selectedColor, setSelectedColor] = useState(CARD_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Digite o nome do cartão');
      return;
    }
    
    const limitValue = parseFloat(limit.replace(',', '.'));
    if (isNaN(limitValue) || limitValue <= 0) {
      toast.error('Digite um limite válido');
      return;
    }

    const closing = parseInt(closingDay);
    const due = parseInt(dueDay);
    if (isNaN(closing) || closing < 1 || closing > 31) {
      toast.error('Dia de fechamento inválido');
      return;
    }
    if (isNaN(due) || due < 1 || due > 31) {
      toast.error('Dia de vencimento inválido');
      return;
    }

    addCreditCard({
      name: name.trim(),
      limit: limitValue,
      closingDay: closing,
      dueDay: due,
      color: selectedColor,
    });

    toast.success('Cartão adicionado!');
    setShowForm(false);
    setName('');
    setLimit('');
    setClosingDay('');
    setDueDay('');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app/dashboard')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Cartões de Crédito</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Card Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="w-full p-4 border-2 border-dashed border-violet-300 rounded-2xl flex items-center justify-center gap-2 text-violet-600 hover:bg-violet-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Cartão
        </motion.button>

        {/* Cards List */}
        <AnimatePresence>
          {creditCards.map((card, index) => {
            const expenses = getCardExpenses(card.id, currentMonth);
            const used = expenses.reduce((sum, e) => sum + e.amount, 0);
            const percentage = (used / card.limit) * 100;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-5 text-white"
                style={{ backgroundColor: card.color }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-6 h-6" />
                      <span className="font-bold text-lg">{card.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        deleteCreditCard(card.id);
                        toast.success('Cartão removido');
                      }}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm opacity-90">
                      <span>Usado</span>
                      <span>{formatCurrency(used)} / {formatCurrency(card.limit)}</span>
                    </div>
                    <Progress value={percentage} className="h-2 bg-white/30" />
                  </div>

                  <div className="flex justify-between text-sm opacity-80 mb-3">
                    <span>Fecha dia {card.closingDay}</span>
                    <span>Vence dia {card.dueDay}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/app/cartoes/${card.id}/gasto`)}
                    className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar Gasto
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {creditCards.length === 0 && !showForm && (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Nenhum cartão cadastrado</p>
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-background rounded-t-3xl p-6 max-h-[90vh] overflow-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Novo Cartão</h2>
                <button onClick={() => setShowForm(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Nome do Cartão</Label>
                  <Input
                    placeholder="Ex: Nubank, Inter..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Limite</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Dia do Fechamento</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Ex: 15"
                      value={closingDay}
                      onChange={(e) => setClosingDay(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Dia do Vencimento</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Ex: 25"
                      value={dueDay}
                      onChange={(e) => setDueDay(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Cor do Cartão</Label>
                  <div className="flex gap-3 flex-wrap">
                    {CARD_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor === color ? 'ring-4 ring-offset-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg bg-violet-500 hover:bg-violet-600 rounded-2xl"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Salvar Cartão
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

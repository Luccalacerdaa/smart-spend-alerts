import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFixedPayments } from '@/hooks/useFixedPayments';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, Trash2, X, Check, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/finance';
import { toast } from 'sonner';

type Category = 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';

export default function FixedPayments() {
  console.log('🔵 [FixedPayments] Componente renderizado');
  
  const navigate = useNavigate();
  const { 
    fixedPayments, 
    loading, 
    addFixedPayment, 
    deleteFixedPayment, 
    toggleFixedPaymentPaid,
    getCurrentMonthPayments,
    getTotals
  } = useFixedPayments();

  console.log('📊 [FixedPayments] Estado atual:', {
    fixedPayments: fixedPayments.length,
    loading,
    payments: fixedPayments
  });
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [category, setCategory] = useState<Category>('contas');
  const [submitting, setSubmitting] = useState(false);

  const categories: Category[] = ['alimentacao', 'transporte', 'lazer', 'contas', 'outros'];

  const currentPayments = getCurrentMonthPayments();
  const sortedPayments = [...currentPayments].sort((a, b) => a.due_day - b.due_day);
  
  const today = new Date().getDate();
  const { totalPending, totalPaid } = getTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 [FixedPayments] Iniciando handleSubmit');
    
    if (!name.trim()) {
      console.log('❌ [FixedPayments] Nome vazio');
      toast.error('Digite o nome da conta');
      return;
    }
    
    const value = parseFloat(amount.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      console.log('❌ [FixedPayments] Valor inválido:', amount, value);
      toast.error('Digite um valor válido');
      return;
    }

    const day = parseInt(dueDay);
    if (isNaN(day) || day < 1 || day > 31) {
      console.log('❌ [FixedPayments] Dia inválido:', dueDay, day);
      toast.error('Dia de vencimento inválido');
      return;
    }

    const paymentData = {
      name: name.trim(),
      amount: value,
      due_day: day,
      category,
    };

    console.log('📤 [FixedPayments] Dados do pagamento:', paymentData);

    try {
      setSubmitting(true);
      console.log('🔄 [FixedPayments] Chamando addFixedPayment...');
      
      const result = await addFixedPayment(paymentData);
      
      console.log('✅ [FixedPayments] Pagamento adicionado:', result);

      setShowForm(false);
      setName('');
      setAmount('');
      setDueDay('');
      setCategory('contas');
      
      console.log('🎉 [FixedPayments] Formulário resetado');
    } catch (error) {
      console.error('❌ [FixedPayments] Erro no handleSubmit:', error);
    } finally {
      setSubmitting(false);
      console.log('🔵 [FixedPayments] handleSubmit finalizado');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusColor = (dueDay: number, isPaid: boolean) => {
    if (isPaid) return 'text-emerald-500';
    if (dueDay < today) return 'text-red-500';
    if (dueDay - today <= 3) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  const getStatusText = (dueDay: number, isPaid: boolean) => {
    if (isPaid) return 'Pago';
    if (dueDay < today) return 'Atrasado';
    if (dueDay === today) return 'Vence hoje!';
    if (dueDay - today <= 3) return `Vence em ${dueDay - today} dias`;
    return `Vence dia ${dueDay}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-500" />
          <p className="text-muted-foreground">Carregando pagamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app/dashboard')} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Pagamentos Fixos</h1>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-4">
            <p className="text-sm text-red-600 dark:text-red-400">A pagar</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-300">{formatCurrency(totalPending)}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Pago</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="w-full p-4 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-center gap-2 text-amber-600 hover:bg-amber-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Conta Fixa
        </motion.button>

        {/* Payments List */}
        <AnimatePresence>
          {sortedPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card rounded-2xl p-4 border transition-all ${
                payment.is_paid ? 'opacity-60 border-emerald-200' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFixedPaymentPaid(payment.id)}
                  className="flex-shrink-0"
                >
                  {payment.is_paid ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <Circle className="w-7 h-7 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{CATEGORY_ICONS[payment.category]}</span>
                    <span className={`font-medium ${payment.is_paid ? 'line-through text-muted-foreground' : ''}`}>
                      {payment.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className={`text-sm ${getStatusColor(payment.due_day, payment.is_paid)}`}>
                      {getStatusText(payment.due_day, payment.is_paid)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${payment.is_paid ? 'text-muted-foreground line-through' : ''}`}>
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                <button
                  onClick={() => deleteFixedPayment(payment.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {currentPayments.length === 0 && !showForm && (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Nenhuma conta fixa cadastrada</p>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
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
                <h2 className="text-xl font-bold">Nova Conta Fixa</h2>
                <button onClick={() => setShowForm(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Nome da Conta</Label>
                  <Input
                    placeholder="Ex: Netflix, Aluguel..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Valor</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Dia do Vencimento</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 10"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Categoria</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          category === cat 
                            ? 'border-amber-500 bg-amber-500/10' 
                            : 'border-border hover:border-amber-500/50'
                        }`}
                      >
                        <span className="text-xl block">{CATEGORY_ICONS[cat]}</span>
                        <span className="text-xs mt-1 block">{CATEGORY_LABELS[cat]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 rounded-2xl disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5 mr-2" />
                  )}
                  {submitting ? 'Salvando...' : 'Salvar Conta'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

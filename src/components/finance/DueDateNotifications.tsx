import { useEffect, useState } from 'react';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Clock, Bell } from 'lucide-react';
import { CATEGORY_ICONS } from '@/types/finance';

export default function DueDateNotifications() {
  const { fixedPayments, currentMonth, creditCards } = useFinanceContext();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const today = new Date();
  const todayDay = today.getDate();

  // Filter unpaid fixed payments that are due soon or overdue
  const urgentPayments = fixedPayments
    .filter(p => p.month === currentMonth && !p.isPaid)
    .filter(p => {
      const daysUntilDue = p.dueDay - todayDay;
      return daysUntilDue <= 3; // Due in 3 days or less (including overdue)
    })
    .filter(p => !dismissed.includes(p.id))
    .sort((a, b) => a.dueDay - b.dueDay);

  // Credit cards due soon
  const urgentCards = creditCards
    .filter(c => {
      const daysUntilDue = c.dueDay - todayDay;
      return daysUntilDue >= 0 && daysUntilDue <= 3;
    })
    .filter(c => !dismissed.includes(`card-${c.id}`));

  const hasNotifications = urgentPayments.length > 0 || urgentCards.length > 0;

  useEffect(() => {
    // Check localStorage for dismissed notifications today
    const today = new Date().toDateString();
    const savedDismissed = localStorage.getItem('dismissed_notifications');
    if (savedDismissed) {
      const { date, ids } = JSON.parse(savedDismissed);
      if (date === today) {
        setDismissed(ids);
      }
    }

    // Show notifications after a short delay
    if (hasNotifications) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasNotifications]);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('dismissed_notifications', JSON.stringify({
      date: new Date().toDateString(),
      ids: newDismissed,
    }));
  };

  const handleDismissAll = () => {
    setShow(false);
  };

  const getStatusInfo = (dueDay: number) => {
    const diff = dueDay - todayDay;
    if (diff < 0) return { text: 'Atrasado!', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-950' };
    if (diff === 0) return { text: 'Vence hoje!', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-950' };
    return { text: `Vence em ${diff} dia${diff > 1 ? 's' : ''}`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/50' };
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!hasNotifications || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center p-4"
        onClick={handleDismissAll}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-background rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                <h2 className="text-lg font-bold">Lembretes</h2>
              </div>
              <button 
                onClick={handleDismissAll}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
            {/* Fixed Payments */}
            {urgentPayments.map((payment) => {
              const status = getStatusInfo(payment.dueDay);
              return (
                <motion.div
                  key={payment.id}
                  layout
                  className={`${status.bg} rounded-xl p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{CATEGORY_ICONS[payment.category]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {payment.dueDay < todayDay ? (
                          <AlertTriangle className={`w-4 h-4 ${status.color}`} />
                        ) : (
                          <Clock className={`w-4 h-4 ${status.color}`} />
                        )}
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <p className="font-medium mt-1">{payment.name}</p>
                      <p className="text-lg font-bold">{formatCurrency(payment.amount)}</p>
                    </div>
                    <button
                      onClick={() => handleDismiss(payment.id)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Credit Cards */}
            {urgentCards.map((card) => {
              const status = getStatusInfo(card.dueDay);
              return (
                <motion.div
                  key={card.id}
                  layout
                  className={`${status.bg} rounded-xl p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-6 rounded"
                      style={{ backgroundColor: card.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          Fatura vence {status.text.toLowerCase()}
                        </span>
                      </div>
                      <p className="font-medium mt-1">Cartão {card.name}</p>
                    </div>
                    <button
                      onClick={() => handleDismiss(`card-${card.id}`)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleDismissAll}
              className="w-full py-3 text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Expense, Income, Transaction, MonthlyGoal, Category, CreditCard, FixedPayment } from '@/types/finance';

const STORAGE_KEYS = {
  transactions: 'finance_transactions',
  goals: 'finance_goals',
  creditCards: 'finance_credit_cards',
  fixedPayments: 'finance_fixed_payments',
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([]);
  const [currentMonth] = useState(getCurrentMonth());

  // Load from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.transactions);
    const savedGoals = localStorage.getItem(STORAGE_KEYS.goals);
    const savedCreditCards = localStorage.getItem(STORAGE_KEYS.creditCards);
    const savedFixedPayments = localStorage.getItem(STORAGE_KEYS.fixedPayments);
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedCreditCards) {
      setCreditCards(JSON.parse(savedCreditCards));
    }
    if (savedFixedPayments) {
      setFixedPayments(JSON.parse(savedFixedPayments));
    }
  }, []);

  // Save transactions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  // Save goals
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  }, [goals]);

  // Save credit cards
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.creditCards, JSON.stringify(creditCards));
  }, [creditCards]);

  // Save fixed payments
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.fixedPayments, JSON.stringify(fixedPayments));
  }, [fixedPayments]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'type'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      type: 'expense',
    };
    setTransactions(prev => [...prev, newExpense]);
  }, []);

  const addIncome = useCallback((income: Omit<Income, 'id' | 'type'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
      type: 'income',
    };
    setTransactions(prev => [...prev, newIncome]);
  }, []);

  const setMonthlyGoal = useCallback((amount: number, month: string = currentMonth) => {
    setGoals(prev => {
      const filtered = prev.filter(g => g.month !== month);
      return [...filtered, { amount, month }];
    });
  }, [currentMonth]);

  const getMonthlyGoal = useCallback((month: string = currentMonth) => {
    return goals.find(g => g.month === month)?.amount || 0;
  }, [goals, currentMonth]);

  const getMonthlyExpenses = useCallback((month: string = currentMonth) => {
    return transactions.filter(
      t => t.type === 'expense' && t.date.startsWith(month)
    ) as Expense[];
  }, [transactions, currentMonth]);

  const getMonthlyIncome = useCallback((month: string = currentMonth) => {
    return transactions.filter(
      t => t.type === 'income' && t.date.startsWith(month)
    ) as Income[];
  }, [transactions, currentMonth]);

  const getTotalExpenses = useCallback((month: string = currentMonth) => {
    return getMonthlyExpenses(month).reduce((sum, e) => sum + e.amount, 0);
  }, [getMonthlyExpenses, currentMonth]);

  const getTotalIncome = useCallback((month: string = currentMonth) => {
    return getMonthlyIncome(month).reduce((sum, i) => sum + i.amount, 0);
  }, [getMonthlyIncome, currentMonth]);

  const getExpensesByCategory = useCallback((month: string = currentMonth) => {
    const expenses = getMonthlyExpenses(month);
    const byCategory: Record<Category, number> = {
      alimentacao: 0,
      transporte: 0,
      lazer: 0,
      contas: 0,
      outros: 0,
    };
    
    expenses.forEach(e => {
      byCategory[e.category] += e.amount;
    });
    
    return byCategory;
  }, [getMonthlyExpenses, currentMonth]);

  const getProgressPercentage = useCallback((month: string = currentMonth) => {
    const goal = getMonthlyGoal(month);
    if (!goal) return 0;
    const spent = getTotalExpenses(month);
    return Math.min((spent / goal) * 100, 100);
  }, [getMonthlyGoal, getTotalExpenses, currentMonth]);

  const getRemainingBudget = useCallback((month: string = currentMonth) => {
    const goal = getMonthlyGoal(month);
    const spent = getTotalExpenses(month);
    return Math.max(goal - spent, 0);
  }, [getMonthlyGoal, getTotalExpenses, currentMonth]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Credit Card functions
  const addCreditCard = useCallback((card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = {
      ...card,
      id: crypto.randomUUID(),
    };
    setCreditCards(prev => [...prev, newCard]);
  }, []);

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards(prev => prev.filter(c => c.id !== id));
    // Also remove expenses associated with this card
    setTransactions(prev => prev.filter(t => {
      if (t.type === 'expense') {
        return (t as Expense).creditCardId !== id;
      }
      return true;
    }));
  }, []);

  const getCardExpenses = useCallback((cardId: string, month: string = currentMonth) => {
    return transactions.filter(
      t => t.type === 'expense' && (t as Expense).creditCardId === cardId && t.date.startsWith(month)
    ) as Expense[];
  }, [transactions, currentMonth]);

  // Fixed Payments functions
  const addFixedPayment = useCallback((payment: Omit<FixedPayment, 'id' | 'isPaid' | 'month'>) => {
    const newPayment: FixedPayment = {
      ...payment,
      id: crypto.randomUUID(),
      isPaid: false,
      month: currentMonth,
    };
    setFixedPayments(prev => [...prev, newPayment]);
  }, [currentMonth]);

  const deleteFixedPayment = useCallback((id: string) => {
    setFixedPayments(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleFixedPaymentPaid = useCallback((id: string) => {
    setFixedPayments(prev => prev.map(p => 
      p.id === id ? { ...p, isPaid: !p.isPaid } : p
    ));
  }, []);

  return {
    transactions,
    currentMonth,
    addExpense,
    addIncome,
    setMonthlyGoal,
    getMonthlyGoal,
    getMonthlyExpenses,
    getMonthlyIncome,
    getTotalExpenses,
    getTotalIncome,
    getExpensesByCategory,
    getProgressPercentage,
    getRemainingBudget,
    deleteTransaction,
    // Credit Cards
    creditCards,
    addCreditCard,
    deleteCreditCard,
    getCardExpenses,
    // Fixed Payments
    fixedPayments,
    addFixedPayment,
    deleteFixedPayment,
    toggleFixedPaymentPaid,
  };
}

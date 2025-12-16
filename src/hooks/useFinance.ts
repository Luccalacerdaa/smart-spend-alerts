import { useState, useEffect, useCallback } from 'react';
import { Expense, Income, Transaction, MonthlyGoal, Category } from '@/types/finance';

const STORAGE_KEYS = {
  transactions: 'finance_transactions',
  goals: 'finance_goals',
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [currentMonth] = useState(getCurrentMonth());

  // Load from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.transactions);
    const savedGoals = localStorage.getItem(STORAGE_KEYS.goals);
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
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
  };
}

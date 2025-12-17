import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';
  date: string;
  note?: string;
  credit_card_id?: string;
  installments?: number;
  current_installment?: number;
  created_at?: string;
  updated_at?: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch transactions from Supabase
  const fetchTransactions = useCallback(async () => {
    console.log('🔵 [useTransactions] Iniciando fetchTransactions');
    
    if (!user) {
      console.log('⚠️ [useTransactions] Usuário não encontrado, pulando fetch');
      return;
    }

    console.log('✅ [useTransactions] Buscando transações para usuário:', user.id);

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('❌ [useTransactions] Erro do Supabase no fetch:', error);
        throw error;
      }

      console.log('📥 [useTransactions] Dados recebidos do Supabase:', data);
      setTransactions(data || []);
      console.log('✅ [useTransactions] Estado atualizado com', (data || []).length, 'transações');
    } catch (error: any) {
      console.error('❌ [useTransactions] Erro ao carregar transações:', error);
      toast.error('Erro ao carregar transações: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
      console.log('🔵 [useTransactions] Fetch finalizado');
    }
  }, [user]);

  // Add new expense
  const addExpense = useCallback(async (expense: {
    amount: number;
    category: 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';
    date: string;
    note?: string;
    credit_card_id?: string;
    installments?: number;
    current_installment?: number;
  }) => {
    console.log('🔵 [useTransactions] Iniciando addExpense:', expense);
    
    if (!user) {
      console.error('❌ [useTransactions] Usuário não autenticado');
      toast.error('Usuário não autenticado');
      return;
    }

    console.log('✅ [useTransactions] Usuário autenticado:', user.id);

    try {
      const payloadToInsert = {
        user_id: user.id,
        type: 'expense' as const,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note,
        credit_card_id: expense.credit_card_id,
        installments: expense.installments,
        current_installment: expense.current_installment,
      };

      console.log('📤 [useTransactions] Enviando gasto para Supabase:', payloadToInsert);

      const { data, error } = await supabase
        .from('transactions')
        .insert(payloadToInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ [useTransactions] Erro do Supabase:', error);
        throw error;
      }

      console.log('✅ [useTransactions] Gasto salvo no Supabase:', data);

      setTransactions(prev => {
        const newList = [data, ...prev];
        console.log('🔄 [useTransactions] Lista atualizada:', newList.length, 'transações');
        return newList;
      });
      
      toast.success('Gasto adicionado!');
      console.log('🎉 [useTransactions] Operação de gasto concluída com sucesso');
      return data;
    } catch (error: any) {
      console.error('❌ [useTransactions] Erro ao adicionar gasto:', error);
      toast.error('Erro ao adicionar gasto: ' + (error.message || 'Erro desconhecido'));
      throw error;
    }
  }, [user]);

  // Add new income
  const addIncome = useCallback(async (income: {
    amount: number;
    source: string;
    date: string;
    note?: string;
  }) => {
    console.log('🔵 [useTransactions] Iniciando addIncome:', income);
    
    if (!user) {
      console.error('❌ [useTransactions] Usuário não autenticado');
      toast.error('Usuário não autenticado');
      return;
    }

    console.log('✅ [useTransactions] Usuário autenticado:', user.id);

    try {
      const payloadToInsert = {
        user_id: user.id,
        type: 'income' as const,
        amount: income.amount,
        category: 'outros' as const, // Income doesn't have category, using default
        date: income.date,
        note: income.note || income.source,
      };

      console.log('📤 [useTransactions] Enviando receita para Supabase:', payloadToInsert);

      const { data, error } = await supabase
        .from('transactions')
        .insert(payloadToInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ [useTransactions] Erro do Supabase:', error);
        throw error;
      }

      console.log('✅ [useTransactions] Receita salva no Supabase:', data);

      setTransactions(prev => {
        const newList = [data, ...prev];
        console.log('🔄 [useTransactions] Lista atualizada:', newList.length, 'transações');
        return newList;
      });
      
      toast.success('Receita adicionada!');
      console.log('🎉 [useTransactions] Operação de receita concluída com sucesso');
      return data;
    } catch (error: any) {
      console.error('❌ [useTransactions] Erro ao adicionar receita:', error);
      toast.error('Erro ao adicionar receita: ' + (error.message || 'Erro desconhecido'));
      throw error;
    }
  }, [user]);

  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    console.log('🔵 [useTransactions] Iniciando deleteTransaction:', id);
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ [useTransactions] Erro do Supabase no delete:', error);
        throw error;
      }

      setTransactions(prev => {
        const newList = prev.filter(t => t.id !== id);
        console.log('🔄 [useTransactions] Transação removida, nova lista:', newList.length, 'transações');
        return newList;
      });
      
      toast.success('Transação removida!');
      console.log('✅ [useTransactions] Transação deletada com sucesso');
    } catch (error: any) {
      console.error('❌ [useTransactions] Erro ao remover transação:', error);
      toast.error('Erro ao remover transação: ' + (error.message || 'Erro desconhecido'));
    }
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Helper functions
  const getMonthlyExpenses = useCallback((month: string) => {
    return transactions.filter(t => 
      t.type === 'expense' && t.date.startsWith(month)
    );
  }, [transactions]);

  const getMonthlyIncome = useCallback((month: string) => {
    return transactions.filter(t => 
      t.type === 'income' && t.date.startsWith(month)
    );
  }, [transactions]);

  const getTotalExpenses = useCallback((month: string) => {
    return getMonthlyExpenses(month).reduce((sum, t) => sum + t.amount, 0);
  }, [getMonthlyExpenses]);

  const getTotalIncome = useCallback((month: string) => {
    return getMonthlyIncome(month).reduce((sum, t) => sum + t.amount, 0);
  }, [getMonthlyIncome]);

  return {
    transactions,
    loading,
    addExpense,
    addIncome,
    deleteTransaction,
    fetchTransactions,
    getMonthlyExpenses,
    getMonthlyIncome,
    getTotalExpenses,
    getTotalIncome,
  };
}

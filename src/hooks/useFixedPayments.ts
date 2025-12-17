import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FixedPayment {
  id: string;
  name: string;
  amount: number;
  due_day: number;
  category: 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';
  is_paid: boolean;
  month: string; // YYYY-MM-DD format
  created_at?: string;
  updated_at?: string;
}

export function useFixedPayments() {
  const [fixedPayments, setFixedPayments] = useState<FixedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  };

  // Fetch fixed payments from Supabase
  const fetchFixedPayments = useCallback(async () => {
    console.log('🔵 [useFixedPayments] Iniciando fetchFixedPayments');
    
    if (!user) {
      console.log('⚠️ [useFixedPayments] Usuário não encontrado, pulando fetch');
      return;
    }

    console.log('✅ [useFixedPayments] Buscando pagamentos para usuário:', user.id);

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fixed_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('due_day', { ascending: true });

      if (error) {
        console.error('❌ [useFixedPayments] Erro do Supabase no fetch:', error);
        throw error;
      }

      console.log('📥 [useFixedPayments] Dados recebidos do Supabase:', data);
      setFixedPayments(data || []);
      console.log('✅ [useFixedPayments] Estado atualizado com', (data || []).length, 'pagamentos');
    } catch (error: any) {
      console.error('❌ [useFixedPayments] Erro ao carregar pagamentos fixos:', error);
      toast.error('Erro ao carregar pagamentos fixos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
      console.log('🔵 [useFixedPayments] Fetch finalizado');
    }
  }, [user]);

  // Add new fixed payment
  const addFixedPayment = useCallback(async (payment: {
    name: string;
    amount: number;
    due_day: number;
    category: 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';
  }) => {
    console.log('🔵 [useFixedPayments] Iniciando addFixedPayment:', payment);
    
    if (!user) {
      console.error('❌ [useFixedPayments] Usuário não autenticado');
      toast.error('Usuário não autenticado');
      return;
    }

    console.log('✅ [useFixedPayments] Usuário autenticado:', user.id);

    try {
      const payloadToInsert = {
        user_id: user.id,
        name: payment.name,
        amount: payment.amount,
        due_day: payment.due_day,
        category: payment.category,
        is_paid: false,
        month: getCurrentMonth(),
      };

      console.log('📤 [useFixedPayments] Enviando para Supabase:', payloadToInsert);

      const { data, error } = await supabase
        .from('fixed_payments')
        .insert(payloadToInsert)
        .select()
        .single();

      if (error) {
        console.error('❌ [useFixedPayments] Erro do Supabase:', error);
        throw error;
      }

      console.log('✅ [useFixedPayments] Pagamento salvo no Supabase:', data);

      setFixedPayments(prev => {
        const newList = [...prev, data];
        console.log('🔄 [useFixedPayments] Lista atualizada:', newList);
        return newList;
      });
      
      toast.success('Pagamento fixo adicionado!');
      console.log('🎉 [useFixedPayments] Operação concluída com sucesso');
      return data;
    } catch (error: any) {
      console.error('❌ [useFixedPayments] Erro ao adicionar pagamento fixo:', error);
      toast.error('Erro ao adicionar pagamento fixo: ' + (error.message || 'Erro desconhecido'));
      throw error;
    }
  }, [user]);

  // Delete fixed payment
  const deleteFixedPayment = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('fixed_payments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFixedPayments(prev => prev.filter(p => p.id !== id));
      toast.success('Pagamento fixo removido!');
    } catch (error: any) {
      console.error('Erro ao remover pagamento fixo:', error);
      toast.error('Erro ao remover pagamento fixo');
    }
  }, [user]);

  // Toggle payment status
  const toggleFixedPaymentPaid = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const payment = fixedPayments.find(p => p.id === id);
      if (!payment) return;

      const { error } = await supabase
        .from('fixed_payments')
        .update({ is_paid: !payment.is_paid })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFixedPayments(prev => prev.map(p => 
        p.id === id ? { ...p, is_paid: !p.is_paid } : p
      ));

      toast.success(payment.is_paid ? 'Marcado como não pago' : 'Marcado como pago');
    } catch (error: any) {
      console.error('Erro ao atualizar status do pagamento:', error);
      toast.error('Erro ao atualizar status do pagamento');
    }
  }, [user, fixedPayments]);

  // Load data when user changes
  useEffect(() => {
    fetchFixedPayments();
  }, [fetchFixedPayments]);

  // Get payments for current month
  const getCurrentMonthPayments = useCallback(() => {
    const currentMonth = getCurrentMonth();
    return fixedPayments.filter(p => p.month === currentMonth);
  }, [fixedPayments]);

  // Get totals
  const getTotals = useCallback(() => {
    const currentPayments = getCurrentMonthPayments();
    const totalPending = currentPayments.filter(p => !p.is_paid).reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = currentPayments.filter(p => p.is_paid).reduce((sum, p) => sum + p.amount, 0);
    
    return { totalPending, totalPaid };
  }, [getCurrentMonthPayments]);

  return {
    fixedPayments,
    loading,
    addFixedPayment,
    deleteFixedPayment,
    toggleFixedPaymentPaid,
    fetchFixedPayments,
    getCurrentMonthPayments,
    getTotals,
  };
}

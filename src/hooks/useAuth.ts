import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 [useAuth] Iniciando verificação de sessão');
    
    // Verificar sessão atual
    const getSession = async () => {
      try {
        console.log('🔄 [useAuth] Buscando sessão atual...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        console.log('📥 [useAuth] Sessão recebida:', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('❌ [useAuth] Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
        console.log('✅ [useAuth] Verificação de sessão finalizada');
      }
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [useAuth] Auth state changed:', event, {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fazer login
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fazer cadastro
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
      } else {
        toast.success('Cadastro realizado com sucesso!');
      }

      return data;
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Erro ao fazer cadastro');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fazer logout
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast.error(error.message || 'Erro ao fazer logout');
      throw error;
    }
  }, []);

  // Resetar senha
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email de recuperação enviado!');
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      throw error;
    }
  }, []);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };
}

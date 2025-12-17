import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { toast } from 'sonner';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type WebhookSettings = Database['public']['Tables']['webhook_settings']['Row'];
type WebhookSettingsInsert = Database['public']['Tables']['webhook_settings']['Insert'];

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [webhookSettings, setWebhookSettings] = useState<WebhookSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar perfil do usuário
  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Buscar configurações de webhook
      const { data: webhookData, error: webhookError } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (webhookError && webhookError.code !== 'PGRST116') {
        console.warn('Erro ao carregar webhook settings:', webhookError);
      }

      setProfile(profileData);
      setWebhookSettings(webhookData);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar perfil
  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success('Perfil atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  // Atualizar configurações de webhook
  const updateWebhookSettings = useCallback(async (settings: Omit<WebhookSettingsInsert, 'user_id'>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('webhook_settings')
        .upsert({
          ...settings,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setWebhookSettings(data);
      toast.success('Configurações de webhook atualizadas!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar webhook settings:', error);
      toast.error('Erro ao atualizar configurações de webhook');
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  // Testar notificação
  const testNotification = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase.rpc('create_and_send_notification', {
        p_user_id: user.id,
        p_title: '🧪 Teste de Notificação',
        p_message: 'Esta é uma notificação de teste do Smart Spend Alerts! Se você recebeu esta mensagem, tudo está funcionando perfeitamente! 🎉',
        p_type: 'payment_reminder',
        p_extra_data: { test: true, timestamp: new Date().toISOString() }
      });

      if (error) throw error;

      toast.success('Notificação de teste enviada! Verifique seu WhatsApp.');
      return data;
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
      throw error;
    }
  }, []);

  // Formatar número do WhatsApp
  const formatWhatsAppNumber = useCallback(async (phoneNumber: string) => {
    try {
      const { data, error } = await supabase.rpc('format_whatsapp_number', {
        phone_number: phoneNumber
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao formatar número:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    webhookSettings,
    loading,
    saving,
    updateProfile,
    updateWebhookSettings,
    testNotification,
    formatWhatsAppNumber,
    reloadProfile: loadProfile,
  };
}

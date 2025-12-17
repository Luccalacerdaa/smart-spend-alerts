import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Bell, Webhook, TestTube, Phone, Clock, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const {
    profile,
    webhookSettings,
    loading,
    saving,
    updateProfile,
    updateWebhookSettings,
    testNotification,
    formatWhatsAppNumber,
  } = useProfile();

  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp_number: '',
    notifications_enabled: true,
    notification_time_bills: '09:00',
    notification_time_followup: '17:00',
    timezone: 'America/Sao_Paulo',
  });

  const [webhookData, setWebhookData] = useState({
    webhook_url: '',
    webhook_secret: '',
    is_active: true,
  });

  const [testingNotification, setTestingNotification] = useState(false);

  // Atualizar form quando o perfil carregar
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        whatsapp_number: profile.whatsapp_number || '',
        notifications_enabled: profile.notifications_enabled ?? true,
        notification_time_bills: profile.notification_time_bills || '09:00',
        notification_time_followup: profile.notification_time_followup || '17:00',
        timezone: profile.timezone || 'America/Sao_Paulo',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (webhookSettings) {
      setWebhookData({
        webhook_url: webhookSettings.webhook_url || '',
        webhook_secret: webhookSettings.webhook_secret || '',
        is_active: webhookSettings.is_active ?? true,
      });
    }
  }, [webhookSettings]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: formData.full_name,
        whatsapp_number: formData.whatsapp_number,
        notifications_enabled: formData.notifications_enabled,
        notification_time_bills: formData.notification_time_bills,
        notification_time_followup: formData.notification_time_followup,
        timezone: formData.timezone,
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleSaveWebhook = async () => {
    try {
      await updateWebhookSettings({
        webhook_url: webhookData.webhook_url,
        webhook_secret: webhookData.webhook_secret || null,
        is_active: webhookData.is_active,
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleTestNotification = async () => {
    if (!formData.whatsapp_number) {
      toast.error('Configure seu número do WhatsApp primeiro!');
      return;
    }

    if (!webhookData.webhook_url) {
      toast.error('Configure a URL do webhook primeiro!');
      return;
    }

    setTestingNotification(true);
    try {
      await testNotification();
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setTestingNotification(false);
    }
  };

  const handleWhatsAppChange = async (value: string) => {
    setFormData(prev => ({ ...prev, whatsapp_number: value }));
    
    if (value.length >= 10) {
      const formatted = await formatWhatsAppNumber(value);
      if (formatted) {
        console.log('Formato WhatsApp:', formatted);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
          <p className="text-muted-foreground">
            Configure suas informações pessoais e preferências de notificação
          </p>
        </div>
        
        <Button
          onClick={handleTestNotification}
          disabled={testingNotification || !formData.whatsapp_number || !webhookData.webhook_url}
          variant="outline"
          className="gap-2"
        >
          {testingNotification ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TestTube className="h-4 w-4" />
          )}
          Testar Notificação
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="webhook" className="gap-2">
            <Webhook className="h-4 w-4" />
            Integração n8n
          </TabsTrigger>
        </TabsList>

        {/* Dados Pessoais */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Configure suas informações básicas e dados de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    placeholder="Seu nome completo"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp_number"
                    placeholder="31987654321"
                    value={formData.whatsapp_number}
                    onChange={(e) => handleWhatsAppChange(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Apenas números (será formatado automaticamente)
                  </p>
                  {profile?.whatsapp_formatted && (
                    <Badge variant="secondary" className="text-xs">
                      Formato: {profile.whatsapp_formatted}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Fuso Horário
                </Label>
                <select
                  id="timezone"
                  className="w-full p-2 border rounded-md"
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                </select>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Dados Pessoais'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificação */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
              <CardDescription>
                Configure quando e como receber notificações no WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Receber Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar/desativar todas as notificações do WhatsApp
                  </p>
                </div>
                <Switch
                  checked={formData.notifications_enabled}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, notifications_enabled: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notification_time_bills" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horário - Contas Vencendo
                  </Label>
                  <Input
                    id="notification_time_bills"
                    type="time"
                    value={formData.notification_time_bills}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      notification_time_bills: e.target.value 
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Horário para lembrar de contas que vencem no dia
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification_time_followup" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horário - Follow-up
                  </Label>
                  <Input
                    id="notification_time_followup"
                    type="time"
                    value={formData.notification_time_followup}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      notification_time_followup: e.target.value 
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Horário para perguntar se já pagou a conta
                  </p>
                </div>
              </div>

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tipos de notificação automática:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• 💳 Contas vencendo no dia</li>
                    <li>• ❓ Follow-up de contas não pagas</li>
                    <li>• 📊 Alertas de meta (75%, 90%, ultrapassada)</li>
                    <li>• 💳 Alertas de limite do cartão (80%, 95%)</li>
                    <li>• 📈 Gastos incomuns (50% acima da média)</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuração do Webhook */}
        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Integração com n8n
              </CardTitle>
              <CardDescription>
                Configure o webhook para envio de notificações via n8n
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Webhook className="h-4 w-4" />
                <AlertDescription>
                  Configure um workflow no n8n para receber as notificações e enviar para o WhatsApp.
                  O payload será enviado via POST para a URL configurada abaixo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook_url">URL do Webhook</Label>
                  <Input
                    id="webhook_url"
                    placeholder="https://seu-n8n.com/webhook/whatsapp-notifications"
                    value={webhookData.webhook_url}
                    onChange={(e) => setWebhookData(prev => ({ 
                      ...prev, 
                      webhook_url: e.target.value 
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    URL do webhook do n8n que receberá as notificações
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook_secret">Token Secreto (Opcional)</Label>
                  <Input
                    id="webhook_secret"
                    placeholder="seu-token-secreto"
                    value={webhookData.webhook_secret}
                    onChange={(e) => setWebhookData(prev => ({ 
                      ...prev, 
                      webhook_secret: e.target.value 
                    }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Token para autenticação adicional (opcional)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Webhook Ativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar/desativar envio de webhooks
                    </p>
                  </div>
                  <Switch
                    checked={webhookData.is_active}
                    onCheckedChange={(checked) => 
                      setWebhookData(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Exemplo de Payload:</h4>
                <pre className="text-xs overflow-x-auto">
{`{
  "notification_id": "uuid",
  "type": "due_date_morning",
  "title": "💳 Conta Vencendo Hoje!",
  "message": "Sua conta vence hoje!",
  "user": {
    "id": "uuid",
    "name": "${formData.full_name || 'Seu Nome'}",
    "whatsapp": "${profile?.whatsapp_formatted || '5531987654321@s.whatsapp.net'}"
  },
  "timestamp": "2024-01-15T09:00:00Z",
  "extra_data": { ... }
}`}
                </pre>
              </div>

              <Button onClick={handleSaveWebhook} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações do Webhook'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

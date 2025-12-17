import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Target,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Database } from '@/types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];
type WebhookLog = Database['public']['Tables']['webhook_logs']['Row'];

const notificationIcons = {
  due_date_morning: Calendar,
  due_date_followup: Clock,
  budget_alert: AlertTriangle,
  goal_achieved: Target,
  goal_warning: Target,
  payment_reminder: Bell,
  card_limit_warning: CreditCard,
  unusual_spending: TrendingUp,
  monthly_summary: Bell,
};

const notificationColors = {
  due_date_morning: 'bg-blue-100 text-blue-800',
  due_date_followup: 'bg-yellow-100 text-yellow-800',
  budget_alert: 'bg-red-100 text-red-800',
  goal_achieved: 'bg-green-100 text-green-800',
  goal_warning: 'bg-orange-100 text-orange-800',
  payment_reminder: 'bg-purple-100 text-purple-800',
  card_limit_warning: 'bg-red-100 text-red-800',
  unusual_spending: 'bg-yellow-100 text-yellow-800',
  monthly_summary: 'bg-gray-100 text-gray-800',
};

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const loadWebhookLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setWebhookLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs de webhook:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([loadNotifications(), loadWebhookLogs()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels = {
      due_date_morning: 'Conta Vencendo',
      due_date_followup: 'Follow-up',
      budget_alert: 'Alerta de Orçamento',
      goal_achieved: 'Meta Atingida',
      goal_warning: 'Aviso de Meta',
      payment_reminder: 'Lembrete',
      card_limit_warning: 'Limite do Cartão',
      unusual_spending: 'Gasto Incomum',
      monthly_summary: 'Resumo Mensal',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const successfulWebhooks = webhookLogs.filter(w => w.success).length;
  const failedWebhooks = webhookLogs.filter(w => !w.success).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Notificações</h2>
          <p className="text-muted-foreground">
            Acompanhe suas notificações e status de envio
          </p>
        </div>
        <Button onClick={refreshData} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Não Lidas</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Enviadas</p>
                <p className="text-2xl font-bold">{successfulWebhooks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Falharam</p>
                <p className="text-2xl font-bold">{failedWebhooks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="webhooks">Status de Envio</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações Recentes</CardTitle>
              <CardDescription>
                Últimas 50 notificações geradas pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma notificação encontrada</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => {
                      const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell;
                      const colorClass = notificationColors[notification.type as keyof typeof notificationColors] || 'bg-gray-100 text-gray-800';

                      return (
                        <div key={notification.id}>
                          <div 
                            className={`p-4 rounded-lg border transition-colors ${
                              !notification.is_read 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`p-2 rounded-full ${colorClass}`}>
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-sm">
                                      {notification.title}
                                    </h4>
                                    <Badge variant="secondary" className="text-xs">
                                      {getNotificationTypeLabel(notification.type)}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-2">
                                    {notification.message}
                                  </p>
                                  
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(notification.created_at!)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {!notification.is_read && (
                                  <Button
                                    onClick={() => markAsRead(notification.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs"
                                  >
                                    Marcar como lida
                                  </Button>
                                )}
                                
                                <Badge variant={notification.is_read ? "secondary" : "default"}>
                                  {notification.is_read ? 'Lida' : 'Nova'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {index < notifications.length - 1 && <Separator className="my-2" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Status de Envio dos Webhooks</CardTitle>
              <CardDescription>
                Últimos 30 webhooks enviados para o n8n
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {webhookLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum webhook encontrado</p>
                    </div>
                  ) : (
                    webhookLogs.map((log, index) => (
                      <div key={log.id}>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {log.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            
                            <div>
                              <p className="font-medium text-sm">
                                {formatDate(log.sent_at!)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Status: {log.response_status || 'N/A'}
                              </p>
                              {log.response_body && (
                                <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                                  {log.response_body}
                                </p>
                              )}
                            </div>
                          </div>

                          <Badge variant={log.success ? "default" : "destructive"}>
                            {log.success ? 'Sucesso' : 'Falhou'}
                          </Badge>
                        </div>
                        
                        {index < webhookLogs.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Bell, X, Heart, Hospital, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'new_match' | 'match_accepted' | 'match_declined' | 'urgent_request';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const createNotification = (type: Notification['type'], title: string, message: string, data?: any) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      data
    };

    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_match':
        return <Heart className="h-4 w-4 text-primary" />;
      case 'match_accepted':
        return <Heart className="h-4 w-4 text-success" />;
      case 'match_declined':
        return <X className="h-4 w-4 text-muted-foreground" />;
      case 'urgent_request':
        return <Clock className="h-4 w-4 text-emergency" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Set up real-time listeners for notifications
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('notification-triggers')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        async (payload) => {
          // Check if this match is for the current user
          if (profile.role === 'donor') {
            const { data: donorData } = await supabase
              .from('donors')
              .select('id')
              .eq('user_id', profile.id)
              .single();

            if (donorData && payload.new.donor_id === donorData.id) {
              // Get request details for the notification
              const { data: requestData } = await supabase
                .from('requests')
                .select(`
                  *,
                  hospitals (name)
                `)
                .eq('id', payload.new.request_id)
                .single();

              if (requestData) {
                createNotification(
                  'new_match',
                  'New Match Found!',
                  `You've been matched with a ${requestData.urgency} priority ${requestData.organ_needed} request from ${requestData.hospitals?.name}`,
                  { requestId: requestData.id, matchId: payload.new.id }
                );
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches'
        },
        async (payload) => {
          // Notify hospitals when donors respond
          if (profile.role === 'hospital' && payload.new.status !== payload.old.status) {
            const { data: requestData } = await supabase
              .from('requests')
              .select(`
                *,
                hospitals (user_id)
              `)
              .eq('id', payload.new.request_id)
              .single();

            if (requestData && requestData.hospitals?.user_id === profile.id) {
              const { data: donorData } = await supabase
                .from('donors')
                .select(`
                  *,
                  profiles (full_name)
                `)
                .eq('id', payload.new.donor_id)
                .single();

              if (donorData) {
                createNotification(
                  payload.new.status === 'accepted' ? 'match_accepted' : 'match_declined',
                  `Donor ${payload.new.status === 'accepted' ? 'Accepted' : 'Declined'} Match`,
                  `${donorData.profiles?.full_name || 'A donor'} has ${payload.new.status} the match for ${requestData.patient_name}`,
                  { requestId: requestData.id, matchId: payload.new.id }
                );
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emergency"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50 card-shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer hover:bg-secondary/50 transition-colors ${
                      !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from './DashboardCard';
import { BookOpen, MessageSquare, Bell, TrendingUp } from 'lucide-react';

const StatsOverview = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [enrollmentsResult, messagesResult, notificationsResult, kidsWorkResult] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, status')
          .eq('customer_id', user.id),
        supabase
          .from('messages')
          .select('id, status, recipient_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`),
        supabase
          .from('notifications')
          .select('id, read')
          .eq('user_id', user.id),
        supabase
          .from('kids_work')
          .select('id')
          .eq('parent_customer_id', user.id)
      ]);

      const enrollments = enrollmentsResult.data || [];
      const messages = messagesResult.data || [];
      const notifications = notificationsResult.data || [];
      const kidsWork = kidsWorkResult.data || [];

      return {
        enrollments: {
          total: enrollments.length,
          active: enrollments.filter(e => e.status === 'active').length
        },
        messages: {
          total: messages.length,
          unread: messages.filter(m => m.status === 'unread' && m.recipient_id === user.id).length
        },
        notifications: {
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length
        },
        kidsWork: {
          total: kidsWork.length
        }
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl h-32 border border-gray-200"></div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Active Programs"
        value={stats.enrollments.active}
        description={`${stats.enrollments.total} total enrollments`}
        icon={<BookOpen className="h-5 w-5" />}
        trend={{ value: 12, isPositive: true }}
      />
      
      <DashboardCard
        title="Messages"
        value={stats.messages.unread}
        description={`${stats.messages.total} total messages`}
        icon={<MessageSquare className="h-5 w-5" />}
      />
      
      <DashboardCard
        title="Notifications"
        value={stats.notifications.unread}
        description={`${stats.notifications.total} total notifications`}
        icon={<Bell className="h-5 w-5" />}
      />

      <DashboardCard
        title="Kids Work"
        value={stats.kidsWork.total}
        description="Creative projects uploaded"
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </div>
  );
};

export default StatsOverview;

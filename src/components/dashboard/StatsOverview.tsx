
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from './DashboardCard';
import { BookOpen, Image, MessageSquare, Bell } from 'lucide-react';

const StatsOverview = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [enrollmentsResult, kidsWorkResult, messagesResult, notificationsResult] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, status')
          .eq('customer_id', user.id),
        supabase
          .from('kids_work')
          .select('id')
          .eq('parent_customer_id', user.id),
        supabase
          .from('messages')
          .select('id, status')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`),
        supabase
          .from('notifications')
          .select('id, read')
          .eq('user_id', user.id)
      ]);

      const enrollments = enrollmentsResult.data || [];
      const kidsWork = kidsWorkResult.data || [];
      const messages = messagesResult.data || [];
      const notifications = notificationsResult.data || [];

      return {
        enrollments: {
          total: enrollments.length,
          active: enrollments.filter(e => e.status === 'active').length
        },
        kidsWork: kidsWork.length,
        messages: {
          total: messages.length,
          unread: messages.filter(m => m.status === 'unread').length
        },
        notifications: {
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length
        }
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-32"></div>
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
        gradient="bg-gradient-to-r from-blue-500 to-blue-600"
      />
      
      <DashboardCard
        title="Kids Work"
        value={stats.kidsWork}
        description="Uploaded projects"
        icon={<Image className="h-5 w-5" />}
        trend={{ value: 8, isPositive: true }}
        gradient="bg-gradient-to-r from-green-500 to-green-600"
      />
      
      <DashboardCard
        title="Messages"
        value={stats.messages.unread}
        description={`${stats.messages.total} total messages`}
        icon={<MessageSquare className="h-5 w-5" />}
        gradient="bg-gradient-to-r from-purple-500 to-purple-600"
      />
      
      <DashboardCard
        title="Notifications"
        value={stats.notifications.unread}
        description={`${stats.notifications.total} total notifications`}
        icon={<Bell className="h-5 w-5" />}
        gradient="bg-gradient-to-r from-orange-500 to-orange-600"
      />
    </div>
  );
};

export default StatsOverview;

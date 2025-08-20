
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from './DashboardCard';
import { MessageSquare, Bell, Users, FileText } from 'lucide-react';

const StatsOverview = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [messagesResult, notificationsResult, customersResult, contactSubmissionsResult] = await Promise.all([
        supabase
          .from('messages')
          .select('id, status, recipient_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`),
        supabase
          .from('notifications')
          .select('id, read')
          .eq('user_id', user.id),
        supabase
          .from('profiles')
          .select('id')
          .eq('role', 'customer'),
        supabase
          .from('contact_submissions')
          .select('id, status')
      ]);

      const messages = messagesResult.data || [];
      const notifications = notificationsResult.data || [];
      const customers = customersResult.data || [];
      const contactSubmissions = contactSubmissionsResult.data || [];

      return {
        messages: {
          total: messages.length,
          unread: messages.filter(m => m.status === 'unread' && m.recipient_id === user.id).length
        },
        notifications: {
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length
        },
        customers: {
          total: customers.length
        },
        contactSubmissions: {
          total: contactSubmissions.length,
          pending: contactSubmissions.filter(cs => cs.status === 'unread').length
        }
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl h-32 border border-black"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-4 text-center p-8 bg-white border border-black rounded-lg">
          <p className="text-black">Unable to load statistics. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-4 text-center p-8 bg-white border border-black rounded-lg">
          <p className="text-black">Please log in to view your statistics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Customers"
        value={stats.customers?.total || 0}
        description="Registered users"
        icon={<Users className="h-5 w-5" />}
      />
      
      <DashboardCard
        title="Messages"
        value={stats.messages?.unread || 0}
        description={`${stats.messages?.total || 0} total messages`}
        icon={<MessageSquare className="h-5 w-5" />}
      />
      
      <DashboardCard
        title="Notifications"
        value={stats.notifications?.unread || 0}
        description={`${stats.notifications?.total || 0} total notifications`}
        icon={<Bell className="h-5 w-5" />}
      />

      <DashboardCard
        title="Contact Forms"
        value={stats.contactSubmissions?.pending || 0}
        description={`${stats.contactSubmissions?.total || 0} total submissions`}
        icon={<FileText className="h-5 w-5" />}
      />
    </div>
  );
};

export default StatsOverview;

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Image, MessageSquare, Bell, ArrowRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'kids_work' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const ActivityTimeline = () => {
  const { user } = useAuth();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['dashboard-activities', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const [enrollmentsResult, kidsWorkResult, messagesResult, notificationsResult] = await Promise.all([
        supabase
          .from('enrollments')
          .select(`
            id,
            enrolled_at,
            status,
            child_name,
            programs(title)
          `)
          .eq('customer_id', user.id)
          .order('enrolled_at', { ascending: false })
          .limit(5),
        supabase
          .from('kids_work')
          .select('id, title, created_at')
          .eq('parent_customer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('messages')
          .select('id, subject, created_at, status, sender_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('notifications')
          .select('id, title, message, created_at, read')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      const activities: ActivityItem[] = [];

      // Add enrollments
      (enrollmentsResult.data || []).forEach(enrollment => {
        activities.push({
          id: enrollment.id,
          type: 'enrollment',
          title: `Enrolled in ${(enrollment as any).programs?.title || 'Program'}`,
          description: `Child: ${enrollment.child_name}`,
          timestamp: enrollment.enrolled_at || new Date().toISOString(),
          status: enrollment.status
        });
      });

      // Add kids work
      (kidsWorkResult.data || []).forEach(work => {
        activities.push({
          id: work.id,
          type: 'kids_work',
          title: 'New Kids Work Uploaded',
          description: work.title,
          timestamp: work.created_at || new Date().toISOString()
        });
      });

      // Add messages
      (messagesResult.data || []).forEach(message => {
        const isReceived = message.sender_id !== user.id;
        activities.push({
          id: message.id,
          type: 'message',
          title: isReceived ? 'Message Received' : 'Message Sent',
          description: message.subject,
          timestamp: message.created_at || new Date().toISOString(),
          status: message.status
        });
      });

      // Add notifications
      (notificationsResult.data || []).forEach(notification => {
        activities.push({
          id: notification.id,
          type: 'notification',
          title: notification.title,
          description: notification.message,
          timestamp: notification.created_at,
          status: notification.read ? 'read' : 'unread'
        });
      });

      // Sort by timestamp and return top 10
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    enabled: !!user?.id
  });

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (type) {
      case 'enrollment': return <BookOpen {...iconProps} />;
      case 'kids_work': return <Image {...iconProps} />;
      case 'message': return <MessageSquare {...iconProps} />;
      case 'notification': return <Bell {...iconProps} />;
      default: return <Clock {...iconProps} />;
    }
  };

  const getStatusBadge = (type: string, status?: string) => {
    if (!status) return null;
    
    const getVariant = () => {
      switch (status) {
        case 'confirmed':
        case 'completed':
        case 'read': return 'default';
        case 'pending':
        case 'unread': return 'secondary';
        case 'cancelled': return 'destructive';
        default: return 'outline';
      }
    };

    return (
      <Badge variant={getVariant()} className="text-xs px-2 py-1 font-medium">
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors">
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-500 mb-4">Start by enrolling in programs or uploading kids work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                      {activity.title}
                    </h4>
                    {getStatusBadge(activity.type, activity.status)}
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, MessageSquare, Users, Upload } from 'lucide-react';
import { format } from 'date-fns';

const ActivityTimeline = () => {
  const { user } = useAuth();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity-timeline', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch recent activities from various tables
      const [
        kidsWorkResult,
        messagesResult,
        enrollmentsResult,
        notificationsResult
      ] = await Promise.all([
        supabase
          .from('kids_work')
          .select('id, title, created_at, file_type')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('messages')
          .select('id, subject, created_at, sender_id, recipient_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('enrollments')
          .select('id, child_name, enrolled_at, status')
          .eq('customer_id', user.id)
          .order('enrolled_at', { ascending: false })
          .limit(3),
        supabase
          .from('notifications')
          .select('id, title, message, created_at, type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Combine and sort all activities
      const allActivities = [
        ...(kidsWorkResult.data || []).map(item => ({
          id: `work-${item.id}`,
          type: 'kids_work',
          title: `New work uploaded: ${item.title}`,
          description: `${item.file_type ? item.file_type.split('/')[0] : 'File'} uploaded`,
          timestamp: item.created_at,
          icon: FileText
        })),
        ...(messagesResult.data || []).map(item => ({
          id: `message-${item.id}`,
          type: 'message',
          title: item.sender_id === user.id ? `Message sent: ${item.subject}` : `Message received: ${item.subject}`,
          description: item.sender_id === user.id ? 'You sent a message' : 'You received a message',
          timestamp: item.created_at,
          icon: MessageSquare
        })),
        ...(enrollmentsResult.data || []).map(item => ({
          id: `enrollment-${item.id}`,
          type: 'enrollment',
          title: `Enrolled: ${item.child_name}`,
          description: `Status: ${item.status}`,
          timestamp: item.enrolled_at,
          icon: Users
        })),
        ...(notificationsResult.data || []).map(item => ({
          id: `notification-${item.id}`,
          type: 'notification',
          title: item.title,
          description: item.message,
          timestamp: item.created_at,
          icon: Calendar
        }))
      ];

      // Sort by timestamp and return top 10
      return allActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    enabled: !!user?.id
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'kids_work': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'message': return 'bg-green-100 text-green-800 border-green-200';
      case 'enrollment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'notification': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-white text-black border-black';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-black">
        <CardHeader>
          <CardTitle className="text-black">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-black">
      <CardHeader>
        <CardTitle className="flex items-center text-black">
          <Calendar className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-white border border-black rounded-full">
                      <IconComponent className="h-4 w-4 text-black" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-black truncate">
                        {activity.title}
                      </p>
                      <Badge className={getActivityColor(activity.type)}>
                        {activity.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-black mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-black mt-1">
                      {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-black mx-auto mb-4" />
            <p className="text-black">No recent activity</p>
            <p className="text-sm text-black">Your activity will appear here as you use the platform</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;

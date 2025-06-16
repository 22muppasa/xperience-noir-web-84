
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  User, 
  UserPlus, 
  FileText, 
  MessageSquare,
  Settings,
  Calendar
} from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  user_name: string;
  timestamp: string;
  details: string;
  type: 'user' | 'content' | 'system' | 'program';
}

const ActivityLog = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin-activity-log'],
    queryFn: async () => {
      // Simulate activity log data since we don't have a dedicated table yet
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          action: 'User Registration',
          user_name: 'John Doe',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          details: 'New customer account created',
          type: 'user'
        },
        {
          id: '2',
          action: 'Program Created',
          user_name: 'Admin User',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          details: 'Art Workshop program added',
          type: 'program'
        },
        {
          id: '3',
          action: 'Kids Work Uploaded',
          user_name: 'Jane Smith',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          details: 'New artwork submission for Sarah',
          type: 'content'
        },
        {
          id: '4',
          action: 'System Settings Updated',
          user_name: 'Admin User',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          details: 'Email notification settings modified',
          type: 'system'
        },
        {
          id: '5',
          action: 'Message Sent',
          user_name: 'Admin User',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          details: 'Welcome message to new parent',
          type: 'content'
        }
      ];

      return mockActivities;
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'content': return FileText;
      case 'system': return Settings;
      case 'program': return Calendar;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'content': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-orange-100 text-orange-800';
      case 'program': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
        <CardTitle className="text-black flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-full bg-gray-100">
                  <Icon className="h-4 w-4 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-black">{activity.action}</p>
                    <Badge className={getActivityColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-black">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {activity.user_name} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;

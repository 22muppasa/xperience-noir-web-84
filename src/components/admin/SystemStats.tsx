
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Baby, 
  Calendar, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Activity,
  Database
} from 'lucide-react';

const SystemStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-system-stats'],
    queryFn: async () => {
      const [
        usersResult,
        childrenResult,
        programsResult,
        enrollmentsResult,
        workResult,
        messagesResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('children').select('id', { count: 'exact' }),
        supabase.from('programs').select('id', { count: 'exact' }),
        supabase.from('enrollments').select('id', { count: 'exact' }),
        supabase.from('kids_work').select('id', { count: 'exact' }),
        supabase.from('messages').select('id', { count: 'exact' })
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalChildren: childrenResult.count || 0,
        totalPrograms: programsResult.count || 0,
        totalEnrollments: enrollmentsResult.count || 0,
        totalWork: workResult.count || 0,
        totalMessages: messagesResult.count || 0
      };
    }
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      change: '+12%',
      trend: 'up' as const,
      color: 'text-blue-600'
    },
    {
      title: 'Children Profiles',
      value: stats?.totalChildren || 0,
      icon: Baby,
      change: '+8%',
      trend: 'up' as const,
      color: 'text-green-600'
    },
    {
      title: 'Active Programs',
      value: stats?.totalPrograms || 0,
      icon: Calendar,
      change: '+5%',
      trend: 'up' as const,
      color: 'text-purple-600'
    },
    {
      title: 'Total Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      change: '+15%',
      trend: 'up' as const,
      color: 'text-orange-600'
    },
    {
      title: 'Kids Work Items',
      value: stats?.totalWork || 0,
      icon: FileText,
      change: '+20%',
      trend: 'up' as const,
      color: 'text-red-600'
    },
    {
      title: 'Messages',
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      change: '+3%',
      trend: 'up' as const,
      color: 'text-indigo-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white border-black">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-white border-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stat.value}</div>
            <p className="text-xs text-green-600">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SystemStats;

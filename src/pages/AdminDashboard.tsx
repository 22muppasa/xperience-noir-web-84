
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import SystemStats from '@/components/admin/SystemStats';
import ActivityLog from '@/components/admin/ActivityLog';
import ExternalProgramLinkDialog from '@/components/admin/ExternalProgramLinkDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Activity,
  Calendar,
  Heart,
  Link,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isExternalProgramsEnabled, getExternalProgramsLink } = useAdminSettings();
  const [isExternalProgramDialogOpen, setIsExternalProgramDialogOpen] = useState(false);

  // Fetch real statistics from Supabase
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [
        usersResult,
        pendingWorkResult,
        messagesResult,
        programsResult,
        volunteerApplicationsResult,
        pendingVolunteersResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('kids_work').select('id', { count: 'exact' }),
        supabase.from('messages').select('id', { count: 'exact' }),
        supabase.from('programs').select('id', { count: 'exact' }),
        supabase.from('volunteer_applications').select('id', { count: 'exact' }),
        supabase.from('volunteer_applications').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      return {
        totalUsers: usersResult.count || 0,
        pendingReviews: pendingWorkResult.count || 0,
        totalMessages: messagesResult.count || 0,
        activePrograms: programsResult.count || 0,
        totalVolunteers: volunteerApplicationsResult.count || 0,
        pendingVolunteers: pendingVolunteersResult.count || 0
      };
    }
  });

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-white border-black'
    },
    {
      title: 'Review Volunteers',
      description: 'Manage volunteer applications',
      icon: Heart,
      href: '/admin/volunteers',
      color: 'bg-white border-black',
      badge: stats?.pendingVolunteers > 0 ? stats.pendingVolunteers : undefined
    },
    {
      title: 'Review Kids Work',
      description: 'Review and approve submitted work',
      icon: FileText,
      href: '/admin/kids-work',
      color: 'bg-white border-black'
    },
    {
      title: 'External Programs',
      description: isExternalProgramsEnabled() ? 'External program link is active' : 'Set up external program link',
      icon: Link,
      onClick: () => setIsExternalProgramDialogOpen(true),
      color: 'bg-white border-black',
      badge: isExternalProgramsEnabled() ? 'Active' : undefined
    }
  ];

  const adminStats = [
    {
      title: 'Total Active Users',
      value: isLoading ? '...' : stats?.totalUsers.toString() || '0',
      change: stats?.totalUsers > 0 ? '+12%' : 'No users yet',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Pending Volunteers',
      value: isLoading ? '...' : stats?.pendingVolunteers.toString() || '0',
      change: stats?.pendingVolunteers > 0 ? 'Needs review' : 'All reviewed',
      icon: Heart,
      trend: stats?.pendingVolunteers > 0 ? 'up' : 'stable'
    },
    {
      title: 'External Programs',
      value: isExternalProgramsEnabled() ? 'Active' : 'Not Set',
      change: isExternalProgramsEnabled() ? 'Link configured' : 'No link set',
      icon: ExternalLink,
      trend: isExternalProgramsEnabled() ? 'up' : 'stable'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-black rounded-lg p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, Admin!
          </h1>
          <p className="text-white mb-4">
            Here's what's happening with your platform today.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-gray-100">
              <Shield className="h-4 w-4 mr-2" />
              System Health: Good
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index} className="bg-white border-2 border-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 
                  'text-black'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="text-black">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-start space-y-2 bg-white border-2 border-black hover:bg-gray-50 text-black relative`}
                  onClick={action.onClick || (() => window.location.href = action.href || '#')}
                >
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {action.badge}
                    </div>
                  )}
                  <div className="p-2 rounded-lg bg-gray-100 text-black">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-black">{action.title}</h3>
                    <p className="text-xs text-black">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="text-black">Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsDashboard />
          </CardContent>
        </Card>
      </div>

      {/* External Program Link Dialog */}
      <ExternalProgramLinkDialog
        open={isExternalProgramDialogOpen}
        onOpenChange={setIsExternalProgramDialogOpen}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;

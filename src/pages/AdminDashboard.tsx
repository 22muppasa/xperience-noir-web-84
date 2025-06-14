
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  Activity,
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-blue-500'
    },
    {
      title: 'Review Kids Work',
      description: 'Review and approve submitted work',
      icon: FileText,
      href: '/admin/kids-work',
      color: 'bg-green-500'
    },
    {
      title: 'Messages',
      description: 'Manage user communications',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-purple-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  const adminStats = [
    {
      title: 'Total Active Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5%',
      icon: FileText,
      trend: 'down'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 'Excellent',
      icon: Activity,
      trend: 'stable'
    },
    {
      title: 'Active Programs',
      value: '8',
      change: '+2 this month',
      icon: Calendar,
      trend: 'up'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, Admin!
          </h1>
          <p className="text-blue-100 mb-4">
            Here's what's happening with your platform today.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              System Health: Good
            </Button>
            <Button variant="secondary" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                  onClick={() => window.location.href = action.href}
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsDashboard />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

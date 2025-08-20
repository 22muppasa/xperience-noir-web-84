
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import { Users, Baby, BookOpen, MessageSquare, Settings, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const quickActions = [
    {
      title: 'Manage Customers',
      description: 'View and manage customer accounts',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Children',
      description: 'View and manage children profiles',
      icon: Baby,
      href: '/admin/children',
      color: 'bg-green-500'
    },
    {
      title: 'Manage Programs',
      description: 'Create and edit programs',
      icon: BookOpen,
      href: '/admin/programs',
      color: 'bg-purple-500'
    },
    {
      title: 'Messages',
      description: 'Send and manage messages',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-orange-500'
    },
    {
      title: 'Volunteers',
      description: 'Manage volunteer applications',
      icon: UserPlus,
      href: '/admin/volunteers',
      color: 'bg-pink-500'
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your organization's programs and users</p>
        </div>

        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-black">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-black">Recent Activity</h2>
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

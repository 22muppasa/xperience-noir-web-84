
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  Heart,
  Calendar,
  BookOpen,
  Baby,
  Briefcase,
  BarChart3,
  Mail
} from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const adminMenuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      title: 'Users',
      href: '/admin/customers',
      icon: Users,
      description: 'Manage user accounts'
    },
    {
      title: 'Children',
      href: '/admin/children',
      icon: Baby,
      description: 'Manage child profiles'
    },
    {
      title: 'Programs',
      href: '/admin/programs',
      icon: Calendar,
      description: 'Manage programs'
    },
    {
      title: 'Kids Work',
      href: '/admin/kids-work',
      icon: FileText,
      description: 'Review submissions'
    },
    {
      title: 'Volunteers',
      href: '/admin/volunteers',
      icon: Heart,
      description: 'Volunteer applications'
    },
    {
      title: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      description: 'Communication center'
    },
    {
      title: 'Portfolio',
      href: '/admin/portfolio',
      icon: Briefcase,
      description: 'Manage portfolio items'
    },
    {
      title: 'Social Posts',
      href: '/admin/social-posts',
      icon: BarChart3,
      description: 'Social media management'
    },
    {
      title: 'Contact Forms',
      href: '/admin/contact-forms',
      icon: Mail,
      description: 'Contact submissions'
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System settings'
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="w-64 bg-white border-r-2 border-black min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black mb-2">Admin Panel</h2>
        <p className="text-sm text-gray-600">Welcome, {user.email}</p>
      </div>
      
      <nav className="space-y-2">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              location.pathname === item.href
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <item.icon className="h-4 w-4" />
            <div>
              <div>{item.title}</div>
              <div className={cn(
                'text-xs',
                location.pathname === item.href
                  ? 'text-gray-300'
                  : 'text-gray-500'
              )}>
                {item.description}
              </div>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;

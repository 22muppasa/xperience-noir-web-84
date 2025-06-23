import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  Settings,
  MessageSquare,
  BookOpen,
  Calendar,
  Upload,
  UserCheck,
  Mail,
  Share2,
  BarChart3,
  Briefcase,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DashboardSidebarProps {
  userRole: string | undefined;
}

const DashboardSidebar = ({ userRole }: DashboardSidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const adminNavItems: NavItem[] = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/children', label: 'Children', icon: Users },
    { path: '/admin/customers', label: 'Customers', icon: UserCheck },
    { path: '/admin/programs', label: 'Programs', icon: BookOpen },
    { path: '/admin/enrollments', label: 'Enrollments', icon: Calendar },
    { path: '/admin/kids-work', label: "Kids' Work", icon: Upload },
    { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { path: '/admin/contact-forms', label: 'Contact Forms', icon: Mail },
    { path: '/admin/volunteers', label: 'Volunteers', icon: Share2 },
    { path: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const customerNavItems: NavItem[] = [
    { path: '/customer', label: 'Dashboard', icon: BarChart3 },
    { path: '/customer/children', label: 'Children', icon: Users },
    { path: '/customer/programs', label: 'Programs', icon: BookOpen },
    { path: '/customer/kids-work', label: "Kids' Work", icon: Upload },
    { path: '/customer/messages', label: 'Messages', icon: MessageSquare },
    { path: '/customer/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : customerNavItems;

  return (
    <div className="w-64 bg-gray-900 text-gray-200 flex flex-col h-full">
      <div className="p-4">
        <Link to="/" className="block font-bold text-lg text-white">
          LearnAtHome
        </Link>
      </div>
      <nav className="flex-grow p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition-colors block',
              isActive(item.path) ? 'bg-gray-800 text-white' : ''
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <a href="/logout" className="block hover:bg-gray-800 p-2 rounded-md transition-colors">
          Logout
        </a>
      </div>
    </div>
  );
};

export default DashboardSidebar;

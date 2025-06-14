
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Image, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail
} from 'lucide-react';

interface DashboardSidebarProps {
  userRole: string | null;
}

const DashboardSidebar = ({ userRole }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const customerNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Programs', href: '/dashboard/programs', icon: BookOpen },
    { name: 'Kids Work', href: '/dashboard/kids-work', icon: Image },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Programs', href: '/admin/programs', icon: BookOpen },
    { name: 'Kids Work', href: '/admin/kids-work', icon: Image },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Contact Forms', href: '/admin/contact', icon: Mail },
    { name: 'Social Posts', href: '/admin/social-posts', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : customerNavItems;

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and Collapse Button */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-gray-900">
            XPerience
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Role Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {userRole || 'Loading...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;

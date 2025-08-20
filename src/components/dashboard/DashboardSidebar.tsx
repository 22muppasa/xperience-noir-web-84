
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Users,
  Baby,
  MessageSquare,
  Settings,
  User,
  BookOpen,
  FileText,
  UserPlus,
  Instagram,
  Briefcase,
  Layout
} from 'lucide-react';

const DashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  const customerMenuItems = [
    {
      title: "Dashboard",
      href: "/customer",
      icon: Layout,
    },
    {
      title: "Profile", 
      href: "/customer/profile",
      icon: User,
    },
    {
      title: "Children",
      href: "/customer/children", 
      icon: Baby,
    },
    {
      title: "Messages",
      href: "/customer/messages",
      icon: MessageSquare,
    },
    {
      title: "Kids Work",
      href: "/customer/kids-work",
      icon: BookOpen,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Layout,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Children", 
      href: "/admin/children",
      icon: Baby,
    },
    {
      title: "Programs",
      href: "/admin/programs",
      icon: BookOpen,
    },
    {
      title: "Messages",
      href: "/admin/messages", 
      icon: MessageSquare,
    },
    {
      title: "Kids Work",
      href: "/admin/kids-work",
      icon: FileText,
    },
    {
      title: "Contact Forms",
      href: "/admin/contact-forms",
      icon: MessageSquare,
    },
    {
      title: "Volunteers",
      href: "/admin/volunteers",
      icon: UserPlus,
    },
    {
      title: "Social Posts",
      href: "/admin/social-posts",
      icon: Instagram,
    },
    {
      title: "Portfolio",
      href: "/admin/portfolio",
      icon: Briefcase,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-black">
          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
        </h2>
      </div>
      
      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;

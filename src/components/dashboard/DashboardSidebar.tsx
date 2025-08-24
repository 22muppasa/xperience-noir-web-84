
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText,
  Users,
  Image,
  Send,
  Heart,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardSidebar = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/customers' },
    { icon: Heart, label: 'Volunteers', path: '/admin/volunteers' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Send, label: 'Social Posts', path: '/admin/social-posts' },
    { icon: FileText, label: 'Contact Forms', path: '/admin/contact-forms' },
    { icon: Briefcase, label: 'Portfolio', path: '/admin/portfolio' },
  ];

  return (
    <div className="w-64 bg-white border-r border-black h-screen flex flex-col">
      <div className="p-6 border-b border-black">
        <h2 className="text-xl font-bold text-black">
          Admin Dashboard
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                isActive 
                  ? 'bg-black text-white' 
                  : 'text-black hover:bg-gray-100 hover:text-black'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;

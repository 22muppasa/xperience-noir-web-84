
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  User, 
  FileText,
  Users,
  Image,
  Send,
  Baby,
  UserCog,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardSidebar = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = userRole === 'admin';

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Baby, label: 'Children', path: '/admin/children' },
    { icon: Calendar, label: 'Programs', path: '/admin/programs' },
    { icon: UserCheck, label: 'Enrollments', path: '/admin/enrollments' },
    { icon: Image, label: 'Kids Work', path: '/admin/kids-work' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Send, label: 'Social Posts', path: '/admin/social-posts' },
    { icon: FileText, label: 'Contact Forms', path: '/admin/contact-forms' },
  ];

  const customerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/customer' },
    { icon: Calendar, label: 'Programs', path: '/customer/programs' },
    { icon: Baby, label: 'My Children', path: '/customer/children' },
    { icon: Image, label: 'Kids Work', path: '/customer/kids-work' },
    { icon: MessageSquare, label: 'Messages', path: '/customer/messages' },
    { icon: User, label: 'Profile', path: '/customer/profile' },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  return (
    <div className="w-64 bg-white border-r border-black h-screen flex flex-col">
      <div className="p-6 border-b border-black">
        <h2 className="text-xl font-bold text-black">
          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
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

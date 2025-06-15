
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

const DashboardHeader = () => {
  const { user, signOut, userRole } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.email?.split('@')[0]}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationBell />
          
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <User className="h-4 w-4" />
            <span className="font-medium capitalize">{userRole}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

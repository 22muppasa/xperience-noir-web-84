
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Search, Bell } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

const DashboardHeader = () => {
  const { user, signOut, userRole } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">
              {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
            </h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{user?.email?.split('@')[0]}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          

          {/* Notifications */}
          <div className="relative">
            <NotificationBell />
          </div>
          
          {/* User info */}
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900 capitalize">{userRole}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

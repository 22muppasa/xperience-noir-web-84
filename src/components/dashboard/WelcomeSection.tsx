
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Sun, Moon, Sunset } from 'lucide-react';

const WelcomeSection = () => {
  const { user } = useAuth();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: Sun, color: 'text-yellow-500' };
    if (hour < 17) return { greeting: 'Good afternoon', icon: Sun, color: 'text-orange-500' };
    if (hour < 20) return { greeting: 'Good evening', icon: Sunset, color: 'text-purple-500' };
    return { greeting: 'Good night', icon: Moon, color: 'text-blue-500' };
  };

  const { greeting, icon: TimeIcon, color } = getTimeBasedGreeting();
  const userName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <TimeIcon className={`h-6 w-6 ${color}`} />
            <h1 className="text-3xl font-bold font-poppins">
              {greeting}, {userName}!
            </h1>
          </div>
        </div>
        
        <p className="text-blue-100 text-lg mb-6 max-w-2xl">
          Welcome to your learning dashboard. Track your progress, explore new programs, and celebrate your achievements.
        </p>
        
        <div className="flex items-center space-x-2 text-blue-200">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            Last login: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;


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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
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

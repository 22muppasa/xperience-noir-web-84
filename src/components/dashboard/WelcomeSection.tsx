
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Sun, Moon, Sunset, ChevronRight } from 'lucide-react';

const WelcomeSection = () => {
  const { user } = useAuth();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: Sun, color: 'text-gray-600' };
    if (hour < 17) return { greeting: 'Good afternoon', icon: Sun, color: 'text-gray-600' };
    if (hour < 20) return { greeting: 'Good evening', icon: Sunset, color: 'text-gray-600' };
    return { greeting: 'Good night', icon: Moon, color: 'text-gray-600' };
  };

  const { greeting, icon: TimeIcon, color } = getTimeBasedGreeting();
  const userName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="relative overflow-hidden bg-black rounded-2xl p-8 text-white shadow-lg border border-gray-900">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TimeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-poppins tracking-tight">
                {greeting}, {userName}!
              </h1>
              <p className="text-gray-300 text-lg">
                Welcome to your learning dashboard
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-gray-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <p className="text-gray-300 text-base mb-6 max-w-2xl leading-relaxed">
          Track your progress, explore new programs, and celebrate your achievements in one unified space.
        </p>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">All systems operational</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors cursor-pointer group">
            <span className="text-sm">Quick actions</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;

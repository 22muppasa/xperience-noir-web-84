
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import { BookOpen, Image, MessageSquare, User } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Browse Programs",
      description: "Discover new learning opportunities and creative workshops",
      icon: BookOpen,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      onClick: () => console.log("Navigate to programs")
    },
    {
      title: "View Kids Work",
      description: "See your latest creative projects and achievements",
      icon: Image,
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      onClick: () => console.log("Navigate to kids work"),
      badge: "New"
    },
    {
      title: "Send Message",
      description: "Contact your instructors and get support",
      icon: MessageSquare,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      onClick: () => console.log("Navigate to messages"),
      badge: "2"
    },
    {
      title: "Update Profile",
      description: "Manage your account settings and preferences",
      icon: User,
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600",
      onClick: () => console.log("Navigate to profile")
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Stats Overview */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Overview</h2>
          <StatsOverview />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Activity Timeline */}
          <div className="xl:col-span-2">
            <ActivityTimeline />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={action.title}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100 + 400}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <QuickActionCard {...action} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
            <h3 className="font-semibold text-gray-900 mb-2">Upcoming Events</h3>
            <p className="text-sm text-gray-600 mb-4">Art Workshop: Advanced Techniques</p>
            <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block">
              Tomorrow, 2:00 PM
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Learning Streak</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">7 days</p>
            <p className="text-xs text-gray-600">Keep up the great work!</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-2">Next Milestone</h3>
            <p className="text-sm text-gray-600 mb-2">Complete 3 more projects</p>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;


import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import ProgramsGrid from '@/components/programs/ProgramsGrid';
import MessageComposer from '@/components/messaging/MessageComposer';
import KidsWorkUpload from '@/components/file-upload/KidsWorkUpload';
import { BookOpen, Image, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'programs' | 'messages'>('overview');

  // Get upcoming events
  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcoming-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          programs(title, start_date)
        `)
        .eq('customer_id', user.id)
        .eq('status', 'confirmed')
        .gte('programs.start_date', new Date().toISOString().split('T')[0])
        .order('programs.start_date', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const quickActions = [
    {
      title: "Browse Programs",
      description: "Discover new learning opportunities and creative workshops",
      icon: BookOpen,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      onClick: () => setActiveSection('programs')
    },
    {
      title: "Upload Kids Work",
      description: "Share your child's latest creative projects",
      icon: Image,
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      onClick: () => {}, // This will be handled by the KidsWorkUpload component
      isComponent: true
    },
    {
      title: "Send Message",
      description: "Contact your instructors and get support",
      icon: MessageSquare,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      onClick: () => setActiveSection('messages')
    },
    {
      title: "Update Profile",
      description: "Manage your account settings and preferences",
      icon: User,
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600",
      onClick: () => console.log("Navigate to profile")
    }
  ];

  if (activeSection === 'programs') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Programs</h1>
              <p className="text-gray-600">Enroll in programs for your children</p>
            </div>
            <button
              onClick={() => setActiveSection('overview')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
          <ProgramsGrid />
        </div>
      </DashboardLayout>
    );
  }

  if (activeSection === 'messages') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Communicate with administrators</p>
            </div>
            <div className="flex space-x-4">
              <MessageComposer />
              <button
                onClick={() => setActiveSection('overview')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation with an administrator</p>
              <MessageComposer />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
                  {action.title === "Upload Kids Work" ? (
                    <KidsWorkUpload onUploadComplete={() => {
                      // Refresh the dashboard data
                      window.location.reload();
                    }} />
                  ) : (
                    <QuickActionCard {...action} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
            <h3 className="font-semibold text-gray-900 mb-2">Upcoming Events</h3>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map((event: any) => (
                  <div key={event.id} className="text-sm">
                    <p className="font-medium">{event.programs?.title}</p>
                    <p className="text-gray-600">Child: {event.child_name}</p>
                    <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block mt-1">
                      {new Date(event.programs?.start_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No upcoming events</p>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Learning Progress</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">Growing!</p>
            <p className="text-xs text-gray-600">Keep up the great work with enrollments and activities!</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="font-semibold text-gray-900 mb-2">Get Started</h3>
            <p className="text-sm text-gray-600 mb-2">Ready to begin your journey?</p>
            <button
              onClick={() => setActiveSection('programs')}
              className="text-green-600 hover:text-green-800 font-medium text-sm"
            >
              Browse Programs →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;

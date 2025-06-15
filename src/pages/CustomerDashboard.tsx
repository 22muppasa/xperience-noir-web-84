
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import ProgramsGrid from '@/components/programs/ProgramsGrid';
import MessageComposer from '@/components/messaging/MessageComposer';
import KidsWorkUpload from '@/components/file-upload/KidsWorkUpload';
import { BookOpen, Image, MessageSquare, User, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        .eq('status', 'active')
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
      onClick: () => setActiveSection('programs')
    },
    {
      title: "Upload Kids Work",
      description: "Share your child's latest creative projects",
      icon: Image,
      onClick: () => {},
      isComponent: true
    },
    {
      title: "Send Message",
      description: "Contact your instructors and get support",
      icon: MessageSquare,
      onClick: () => setActiveSection('messages')
    },
    {
      title: "Update Profile",
      description: "Manage your account settings and preferences",
      icon: User,
      onClick: () => console.log("Navigate to profile")
    }
  ];

  if (activeSection === 'programs') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Available Programs</h1>
              <p className="text-gray-600 mt-1">Enroll in programs for your children</p>
            </div>
            <button
              onClick={() => setActiveSection('overview')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
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
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
              <p className="text-gray-600 mt-1">Communicate with administrators</p>
            </div>
            <div className="flex space-x-3">
              <MessageComposer />
              <button
                onClick={() => setActiveSection('overview')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
          <Card className="bg-white border border-gray-200 rounded-xl shadow-none">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Start a conversation with an administrator to get help with programs or general questions.</p>
              <MessageComposer />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Stats Overview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Your Overview
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>Last 30 days</span>
            </div>
          </div>
          <StatsOverview />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Activity Timeline */}
          <div className="xl:col-span-2">
            <ActivityTimeline />
          </div>
          
          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <div className="w-8 h-1 bg-black rounded-full"></div>
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={action.title} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  {action.title === "Upload Kids Work" ? (
                    <KidsWorkUpload onUploadComplete={() => window.location.reload()} />
                  ) : (
                    <QuickActionCard {...action} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-none hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
              </div>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 2).map((event: any) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 text-sm">{event.programs?.title}</p>
                      <p className="text-xs text-gray-600 mt-1">Child: {event.child_name}</p>
                      <div className="text-xs text-gray-500 mt-2 flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.programs?.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-none hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Learning Progress</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">Growing!</span>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-8 h-full bg-black rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Keep up the great work with enrollments and activities!</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-none hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Get Started</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Ready to begin your learning journey? Explore our programs and find the perfect fit.
                </p>
                <button
                  onClick={() => setActiveSection('programs')}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Browse Programs →
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;

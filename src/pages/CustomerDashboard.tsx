
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
      gradient: "", // No color
      onClick: () => setActiveSection('programs')
    },
    {
      title: "Upload Kids Work",
      description: "Share your child's latest creative projects",
      icon: Image,
      gradient: "",
      onClick: () => {},
      isComponent: true
    },
    {
      title: "Send Message",
      description: "Contact your instructors and get support",
      icon: MessageSquare,
      gradient: "",
      onClick: () => setActiveSection('messages')
    },
    {
      title: "Update Profile",
      description: "Manage your account settings and preferences",
      icon: User,
      gradient: "",
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
              <p className="text-gray-500">Enroll in programs for your children</p>
            </div>
            <button
              onClick={() => setActiveSection('overview')}
              className="text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition"
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
              <p className="text-gray-500">Communicate with administrators</p>
            </div>
            <div className="flex space-x-4">
              <MessageComposer />
              <button
                onClick={() => setActiveSection('overview')}
                className="text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
          <Card className="bg-white border border-gray-100 rounded-xl shadow-none">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-gray-500 mb-4">Start a conversation with an administrator</p>
              <MessageComposer />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Stats Overview */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
            Your Overview
          </h2>
          <StatsOverview />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Activity Timeline */}
          <div className="xl:col-span-2">
            <ActivityTimeline />
          </div>
          {/* Quick Actions */}
          <div className="space-y-5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 rounded-xl shadow-none">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Upcoming Events</h3>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvents.slice(0, 2).map((event: any) => (
                    <div key={event.id} className="text-sm">
                      <p className="font-medium">{event.programs?.title}</p>
                      <p className="text-gray-500">Child: {event.child_name}</p>
                      <div className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                        {new Date(event.programs?.start_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 rounded-xl shadow-none">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Learning Progress</h3>
              <p className="text-2xl font-bold text-gray-800 mb-2">Growing!</p>
              <p className="text-xs text-gray-500">Keep up the great work with enrollments and activities!</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 rounded-xl shadow-none">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-sm text-gray-500 mb-2">
                Ready to begin your journey?
              </p>
              <button
                onClick={() => setActiveSection('programs')}
                className="text-gray-800 border border-gray-200 rounded px-4 py-2 font-medium hover:bg-gray-50 transition text-sm"
              >
                Browse Programs →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;

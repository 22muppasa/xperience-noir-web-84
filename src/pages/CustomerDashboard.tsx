
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import ProgramsGrid from '@/components/programs/ProgramsGrid';
import MessageComposer from '@/components/messaging/MessageComposer';
import { BookOpen, MessageSquare, User, Calendar, TrendingUp } from 'lucide-react';
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

  // Get real messages
  const { data: messages } = useQuery({
    queryKey: ['user-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Get user enrollments
  const { data: enrollments } = useQuery({
    queryKey: ['user-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          status,
          enrolled_at,
          programs(title, start_date)
        `)
        .eq('customer_id', user.id)
        .order('enrolled_at', { ascending: false });
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
              <h1 className="text-3xl font-bold text-black tracking-tight">Available Programs</h1>
              <p className="text-black mt-1">Enroll in programs for your children</p>
            </div>
            <button
              onClick={() => setActiveSection('overview')}
              className="px-4 py-2 text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
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
              <h1 className="text-3xl font-bold text-black tracking-tight">Messages</h1>
              <p className="text-black mt-1">Communicate with administrators</p>
            </div>
            <div className="flex space-x-3">
              <MessageComposer />
              <button
                onClick={() => setActiveSection('overview')}
                className="px-4 py-2 text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
          
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="bg-white border border-gray-200 rounded-xl shadow-none hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-black mb-2">{message.subject}</h3>
                        <p className="text-sm text-black mb-2">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-black line-clamp-3">{message.content}</p>
                      </div>
                      {message.status === 'unread' && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">New</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border border-gray-200 rounded-xl shadow-none">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">No New Messages</h3>
                <p className="text-black mb-6 max-w-md mx-auto">Start a conversation with an administrator to get help with programs or general questions.</p>
                <MessageComposer />
              </CardContent>
            </Card>
          )}
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
            <h2 className="text-2xl font-semibold text-black tracking-tight">
              Your Overview
            </h2>
            <div className="flex items-center space-x-2 text-sm text-black">
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
              <h2 className="text-xl font-semibold text-black">Quick Actions</h2>
              <div className="w-8 h-1 bg-black rounded-full"></div>
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={action.title} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <QuickActionCard {...action} />
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
                  <Calendar className="h-5 w-5 text-black" />
                </div>
                <h3 className="font-semibold text-black">Upcoming Events</h3>
              </div>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 2).map((event: any) => (
                    <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-black text-sm">{event.programs?.title}</p>
                      <p className="text-xs text-black mt-1">Child: {event.child_name}</p>
                      <div className="text-xs text-black mt-2 flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.programs?.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-black">No upcoming events</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-none hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-black" />
                </div>
                <h3 className="font-semibold text-black">My Programs</h3>
              </div>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-3">
                  {enrollments.slice(0, 2).map((enrollment: any) => (
                    <div key={enrollment.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-black text-sm">{enrollment.programs?.title}</p>
                      <p className="text-xs text-black mt-1">Child: {enrollment.child_name}</p>
                      <p className="text-xs text-black mt-1 capitalize">Status: {enrollment.status}</p>
                    </div>
                  ))}
                  {enrollments.length > 2 && (
                    <button
                      onClick={() => setActiveSection('programs')}
                      className="text-xs text-black hover:underline"
                    >
                      View all {enrollments.length} enrollments →
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-black mb-3">No programs enrolled yet</p>
                  <button
                    onClick={() => setActiveSection('programs')}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    Browse Programs →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 rounded-xl shadow-none hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-black" />
                </div>
                <h3 className="font-semibold text-black">Recent Messages</h3>
              </div>
              {messages && messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.slice(0, 2).map((message: any) => (
                    <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-black text-sm line-clamp-1">{message.subject}</p>
                      <p className="text-xs text-black mt-1">{new Date(message.created_at).toLocaleDateString()}</p>
                      {message.status === 'unread' && (
                        <span className="inline-block mt-1 text-xs bg-black text-white px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                  ))}
                  {messages.length > 2 && (
                    <button
                      onClick={() => setActiveSection('messages')}
                      className="text-xs text-black hover:underline"
                    >
                      View all messages →
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-black mb-3">No new messages</p>
                  <button
                    onClick={() => setActiveSection('messages')}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    Send Message →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;

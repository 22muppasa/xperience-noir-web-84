
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Inbox, Reply, Clock, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MessageComposer from '@/components/messaging/MessageComposer';
import { useToast } from '@/hooks/use-toast';

interface MessageWithProfiles {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  status: string;
  created_at: string;
  read_at: string | null;
  sender: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  recipient: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReply, setSelectedReply] = useState<MessageWithProfiles | null>(null);

  // Get messages with a simpler query approach
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get the basic messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) throw messagesError;
      if (!messagesData) return [];

      // Get all unique user IDs from messages
      const userIds = new Set<string>();
      messagesData.forEach(msg => {
        if (msg.sender_id) userIds.add(msg.sender_id);
        if (msg.recipient_id) userIds.add(msg.recipient_id);
      });

      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Create a map of profiles for quick lookup
      const profilesMap = new Map();
      (profilesData || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Combine messages with profile data
      const messagesWithProfiles: MessageWithProfiles[] = messagesData.map(msg => ({
        ...msg,
        sender: msg.sender_id ? profilesMap.get(msg.sender_id) || null : null,
        recipient: msg.recipient_id ? profilesMap.get(msg.recipient_id) || null : null,
      }));

      return messagesWithProfiles;
    },
    enabled: !!user?.id
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('recipient_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id] });
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read.",
      });
    }
  });

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const handleReply = (message: MessageWithProfiles) => {
    setSelectedReply(message);
  };

  const getSenderName = (message: MessageWithProfiles) => {
    if (message.sender_id === user?.id) {
      return "You";
    }
    if (message.sender) {
      return `${message.sender.first_name} ${message.sender.last_name}`;
    }
    return "Admin";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread' && m.recipient_id === user?.id).length;
  const thisWeekCount = messages.filter(m => {
    const messageDate = new Date(m.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return messageDate >= weekAgo;
  }).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Messages</h1>
            <p className="text-gray-700 text-base mt-1">Communicate with camp administrators and instructors</p>
          </div>
          <MessageComposer replyTo={selectedReply} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Inbox className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Messages</p>
                  <p className="text-3xl font-bold text-black">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Unread</p>
                  <p className="text-3xl font-bold text-black">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Send className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">This Week</p>
                  <p className="text-3xl font-bold text-black">{thisWeekCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="bg-gray-200 border border-gray-300">
            <TabsTrigger value="inbox" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-400 font-medium">
              <div className="flex items-center space-x-2">
                <span>Inbox</span>
                {unreadCount > 0 && (
                  <Badge className="bg-red-600 text-white border-0 px-2 py-0.5 text-xs font-bold">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-400 font-medium">
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4 mt-6">
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages
                  .filter(m => m.recipient_id === user?.id)
                  .map((message) => (
                    <Card 
                      key={message.id} 
                      className={`bg-white transition-all duration-200 hover:shadow-xl ${
                        message.status === 'unread' 
                          ? 'border-2 border-blue-400 bg-blue-50 shadow-lg' 
                          : 'border-2 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="font-bold text-xl text-black">{message.subject}</h3>
                              {message.status === 'unread' && (
                                <Badge className="bg-red-600 text-white border-0 px-3 py-1 text-sm font-bold">
                                  NEW
                                </Badge>
                              )}
                              {message.status === 'read' && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-800 mb-4">
                              <span className="font-semibold">From: {getSenderName(message)}</span>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-700" />
                                <span className="font-medium">{formatTime(message.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-6">
                          <p className="text-gray-800 whitespace-pre-wrap line-clamp-3 text-base leading-relaxed">{message.content}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button 
                            onClick={() => handleReply(message)}
                            size="sm" 
                            className="bg-blue-700 hover:bg-blue-800 text-white border-0 shadow-md px-4 py-2 font-semibold"
                          >
                            <Reply className="h-5 w-5 mr-2" />
                            Reply
                          </Button>
                          {message.status === 'unread' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleMarkAsRead(message.id)}
                              className="border-2 border-gray-400 text-gray-900 hover:bg-gray-100 hover:border-gray-500 px-4 py-2 font-semibold"
                              disabled={markAsReadMutation.isPending}
                            >
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              {markAsReadMutation.isPending ? 'Marking...' : 'Mark as Read'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="bg-white border-2 border-gray-300">
                  <CardContent className="p-12 text-center">
                    <div className="p-4 bg-gray-200 rounded-full w-fit mx-auto mb-6">
                      <MessageSquare className="h-12 w-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">No messages yet</h3>
                    <p className="text-gray-700 text-base">Messages from administrators will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 mt-6">
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages
                  .filter(m => m.sender_id === user?.id)
                  .map((message) => (
                    <Card key={message.id} className="bg-white border-2 border-gray-300 hover:shadow-xl hover:border-gray-400 transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-black mb-3">{message.subject}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-800 mb-4">
                              <span className="font-semibold">
                                To: {message.recipient ? `${message.recipient.first_name} ${message.recipient.last_name}` : 'Admin'}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Send className="h-4 w-4 text-gray-700" />
                                <span className="font-medium">Sent: {formatTime(message.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge 
                            className={`text-sm font-semibold px-3 py-1 ${
                              message.status === 'read' 
                                ? 'bg-green-600 text-white border-0' 
                                : 'bg-gray-600 text-white border-0'
                            }`}
                          >
                            {message.status === 'read' ? 'Read' : 'Delivered'}
                          </Badge>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap line-clamp-3 text-base leading-relaxed">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="bg-white border-2 border-gray-300">
                  <CardContent className="p-12 text-center">
                    <div className="p-4 bg-gray-200 rounded-full w-fit mx-auto mb-6">
                      <Send className="h-12 w-12 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">No sent messages yet</h3>
                    <p className="text-gray-700 text-base">Messages you send will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Messages;

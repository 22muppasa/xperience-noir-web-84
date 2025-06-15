
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Inbox, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [isComposing, setIsComposing] = useState(false);

  // Get real messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleSendMessage = () => {
    // Handle sending message
    setIsComposing(false);
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
            <h1 className="text-2xl font-bold text-black">Messages</h1>
            <p className="text-black">Communicate with camp administrators and instructors</p>
          </div>
          <Button onClick={() => setIsComposing(!isComposing)}>
            <Edit className="h-4 w-4 mr-2 text-black" />
            Compose
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Inbox className="h-5 w-5 text-black" />
                <div>
                  <p className="text-sm text-black">Total Messages</p>
                  <p className="text-2xl font-bold text-black">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-black" />
                <div>
                  <p className="text-sm text-black">Unread</p>
                  <p className="text-2xl font-bold text-black">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-black">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-black" />
                <div>
                  <p className="text-sm text-black">This Week</p>
                  <p className="text-2xl font-bold text-black">{thisWeekCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            {/* Compose Message */}
            {isComposing && (
              <Card className="bg-white border-black">
                <CardHeader>
                  <CardTitle className="text-black">Compose Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Subject" className="bg-white text-black border-gray-300" />
                  <Textarea 
                    placeholder="Your message..." 
                    className="min-h-32 bg-white text-black border-gray-300"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4 mr-2 text-black" />
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={() => setIsComposing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Messages List */}
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages
                  .filter(m => m.recipient_id === user?.id)
                  .map((message) => (
                    <Card key={message.id} className="bg-white border-black hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg text-black">{message.subject}</h3>
                              {message.status === 'unread' && (
                                <Badge variant="destructive" className="text-xs bg-black text-white">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-black mb-2">
                              {new Date(message.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-black line-clamp-3">{message.content}</p>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="text-white bg-black border-black hover:bg-gray-800">
                            View Full Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="bg-white border-black">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-black mx-auto mb-4" />
                    <p className="text-black">No new messages</p>
                    <p className="text-sm text-black">Messages from administrators will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages
                  .filter(m => m.sender_id === user?.id)
                  .map((message) => (
                    <Card key={message.id} className="bg-white border-black hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-black mb-2">{message.subject}</h3>
                            <p className="text-sm text-black mb-2">
                              Sent: {new Date(message.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-black line-clamp-3">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="bg-white border-black">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-black mx-auto mb-4" />
                    <p className="text-black">No sent messages yet</p>
                    <p className="text-sm text-black">Messages you send will appear here</p>
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

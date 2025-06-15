
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MessageSquare, Send, Users, Mail, Clock, Reply, Trash2 } from 'lucide-react';

const AdminMessages = () => {
  const [isComposing, setIsComposing] = useState(false);
  const [newMessage, setNewMessage] = useState({ recipient: '', subject: '', content: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real messages from Supabase
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(first_name, last_name, email),
          recipient:recipient_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch customers for recipient selection
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'customer');

      if (error) throw error;
      return data || [];
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { recipient_id: string; subject: string; content: string }) => {
      const { error } = await supabase
        .from('messages')
        .insert([{
          recipient_id: messageData.recipient_id,
          subject: messageData.subject,
          content: messageData.content,
          sender_id: null // Admin messages
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      setNewMessage({ recipient: '', subject: '', content: '' });
      setIsComposing(false);
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      recipient_id: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content
    });
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;
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
            <h1 className="text-2xl font-bold text-black">Message Center</h1>
            <p className="text-black">Manage customer communications</p>
          </div>
          <Button 
            onClick={() => setIsComposing(!isComposing)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Send className="mr-2 h-4 w-4" />
            Compose Message
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-black">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{messages.length}</div>
              <div className="text-sm text-black">Total Messages</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-black">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{unreadCount}</div>
              <div className="text-sm text-black">Unread Messages</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-black">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{thisWeekCount}</div>
              <div className="text-sm text-black">This Week</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-black">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-black">{customers.length}</div>
              <div className="text-sm text-black">Total Customers</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList>
            <TabsTrigger value="inbox">All Messages</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            {/* Messages List */}
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  All Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">From/To</TableHead>
                        <TableHead className="text-black">Subject</TableHead>
                        <TableHead className="text-black">Date</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div className="text-black">
                              <div className="font-medium">
                                {message.sender ? 
                                  `${message.sender.first_name} ${message.sender.last_name}` : 
                                  'Admin'
                                }
                              </div>
                              <div className="text-sm">
                                {message.sender?.email || 'System'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-black">{message.subject}</TableCell>
                          <TableCell className="text-black">
                            {new Date(message.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={message.status === 'unread' ? 'destructive' : 'default'}
                              className="text-white"
                            >
                              {message.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-black text-black">
                                <Reply className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-black text-red-600 hover:bg-red-50"
                                onClick={() => deleteMessageMutation.mutate(message.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-black mx-auto mb-4" />
                    <p className="text-black">No messages yet</p>
                    <p className="text-sm text-black">Customer messages will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="space-y-4">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Compose New Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">To</label>
                  <select 
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                    className="w-full p-2 border border-black rounded-lg bg-white text-black"
                  >
                    <option value="">Select recipient...</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} ({customer.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Subject</label>
                  <Input 
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    placeholder="Enter subject..."
                    className="bg-white text-black border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Message</label>
                  <Textarea 
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    rows={6}
                    placeholder="Enter your message..."
                    className="bg-white text-black border-black"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsComposing(false)}
                    className="border-black text-black"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminMessages;

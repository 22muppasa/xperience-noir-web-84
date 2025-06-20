
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
import { MessageSquare, Send, Users, Mail, Clock, Reply, Trash2, CheckCircle2, Eye, Plus } from 'lucide-react';

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

interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminMessages = () => {
  const [isComposing, setIsComposing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState({ recipient: '', subject: '', content: '' });
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages with a simpler query approach
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      // First get the basic messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
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
      return (data || []) as CustomerProfile[];
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { recipient_id: string; subject: string; content: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('messages')
        .insert([{
          recipient_id: messageData.recipient_id,
          subject: messageData.subject,
          content: messageData.content,
          sender_id: user.id,
          status: 'unread'
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
      setReplyingTo(null);
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

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read.",
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

  const handleReply = (message: MessageWithProfiles) => {
    const senderInfo = getUserInfo(message.sender_id);
    setReplyingTo(message.id);
    setNewMessage({
      recipient: message.sender_id || '',
      subject: `Re: ${message.subject}`,
      content: `\n\n--- Original Message ---\nFrom: ${senderInfo.name}\nDate: ${new Date(message.created_at).toLocaleString()}\nSubject: ${message.subject}\n\n${message.content}`
    });
    setIsComposing(true);
  };

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  // Helper function to get user info
  const getUserInfo = (userId: string | null) => {
    if (!userId) return { name: 'System', email: 'system' };
    
    // Find user in messages
    const message = messages.find(m => m.sender_id === userId || m.recipient_id === userId);
    if (message?.sender && message.sender_id === userId) {
      return {
        name: `${message.sender.first_name} ${message.sender.last_name}`,
        email: message.sender.email
      };
    }
    if (message?.recipient && message.recipient_id === userId) {
      return {
        name: `${message.recipient.first_name} ${message.recipient.last_name}`,
        email: message.recipient.email
      };
    }
    
    // Fallback to customers list
    const customer = customers.find(c => c.id === userId);
    if (customer) {
      return {
        name: `${customer.first_name} ${customer.last_name}`,
        email: customer.email
      };
    }
    
    return { name: 'Unknown User', email: 'Unknown' };
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
            <h1 className="text-2xl font-bold text-gray-900">Message Center</h1>
            <p className="text-gray-600">Manage customer communications</p>
          </div>
          <Button 
            onClick={() => {
              setIsComposing(!isComposing);
              setReplyingTo(null);
              setNewMessage({ recipient: '', subject: '', content: '' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Compose Message
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
                  <div className="text-sm text-gray-600">Total Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
                  <div className="text-sm text-gray-600">Unread Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{thisWeekCount}</div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compose Message Form */}
        {isComposing && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {replyingTo ? 'Reply to Message' : 'Compose New Message'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">To *</label>
                <select 
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!!replyingTo}
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
                <label className="block text-sm font-medium mb-2 text-gray-700">Subject *</label>
                <Input 
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Enter subject..."
                  className="bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Message *</label>
                <Textarea 
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  rows={8}
                  placeholder="Enter your message..."
                  className="bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsComposing(false);
                    setReplyingTo(null);
                    setNewMessage({ recipient: '', subject: '', content: '' });
                  }}
                  className="border-gray-300 text-white hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages List */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <MessageSquare className="mr-2 h-5 w-5" />
              All Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-3 text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {messages.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-gray-700 font-medium">From/To</TableHead>
                      <TableHead className="text-gray-700 font-medium">Subject</TableHead>
                      <TableHead className="text-gray-700 font-medium">Date</TableHead>
                      <TableHead className="text-gray-700 font-medium">Status</TableHead>
                      <TableHead className="text-gray-700 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => {
                      const senderInfo = getUserInfo(message.sender_id);
                      const recipientInfo = getUserInfo(message.recipient_id);
                      const isFromUser = message.sender_id === user?.id;
                      
                      return (
                        <TableRow 
                          key={message.id} 
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            message.status === 'unread' && !isFromUser ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <TableCell>
                            <div className="text-gray-900">
                              <div className="font-medium">
                                {isFromUser ? `To: ${recipientInfo.name}` : `From: ${senderInfo.name}`}
                              </div>
                              <div className="text-sm text-gray-600">
                                {isFromUser ? recipientInfo.email : senderInfo.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900 font-medium">{message.subject}</div>
                            <div className="text-sm text-gray-600 line-clamp-1">
                              {message.content.substring(0, 60)}...
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {formatTime(message.created_at)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={message.status === 'unread' ? 'destructive' : 'default'}
                              className={`text-xs ${
                                message.status === 'unread' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {message.status === 'unread' ? 'Unread' : 'Read'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {!isFromUser && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                                  onClick={() => handleReply(message)}
                                >
                                  <Reply className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                              )}
                              {message.status === 'unread' && !isFromUser && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                                  onClick={() => handleMarkAsRead(message.id)}
                                  disabled={markAsReadMutation.isPending}
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Read
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                                onClick={() => deleteMessageMutation.mutate(message.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">Customer messages will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminMessages;

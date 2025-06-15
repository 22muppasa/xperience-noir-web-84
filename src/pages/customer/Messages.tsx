
import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Inbox, Edit } from 'lucide-react';

const Messages = () => {
  const [isComposing, setIsComposing] = useState(false);

  // Mock data for messages
  const messages = [
    {
      id: 1,
      subject: 'Welcome to Summer Art Camp!',
      sender: 'Camp Administrator',
      content: 'Welcome! We\'re excited to have Emma in our Summer Art Camp. Here are some important details...',
      timestamp: '2024-06-15 10:30 AM',
      status: 'read',
      isFromAdmin: true
    },
    {
      id: 2,
      subject: 'Emma\'s Progress Update',
      sender: 'Ms. Sarah (Art Instructor)',
      content: 'Emma is doing wonderfully in art camp! She completed a beautiful butterfly painting today...',
      timestamp: '2024-06-18 3:45 PM',
      status: 'read',
      isFromAdmin: true
    },
    {
      id: 3,
      subject: 'New Artwork Upload',
      sender: 'Camp Administrator',
      content: 'We\'ve uploaded Emma\'s latest artwork to your gallery. You can view and download it from the Kids Work section.',
      timestamp: '2024-06-20 11:15 AM',
      status: 'unread',
      isFromAdmin: true
    }
  ];

  const handleSendMessage = () => {
    // Handle sending message
    setIsComposing(false);
  };

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
                  <p className="text-2xl font-bold text-black">
                    {messages.filter(m => m.status === 'unread').length}
                  </p>
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
                  <p className="text-2xl font-bold text-black">5</p>
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
              {messages.map((message) => (
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
                        <p className="text-sm text-black mb-2">From: {message.sender}</p>
                        <p className="text-sm text-black">{message.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-black line-clamp-3">{message.content}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="text-black border-black">
                        View Full Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            <Card className="bg-white border-black">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-black mx-auto mb-4" />
                <p className="text-black">No sent messages yet</p>
                <p className="text-sm text-black">Messages you send will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Messages;

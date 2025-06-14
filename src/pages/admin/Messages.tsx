
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { MessageSquare, Send, Users, Mail, Clock, Reply } from 'lucide-react';

const AdminMessages = () => {
  // Mock data for messages
  const messages = [
    {
      id: 1,
      subject: 'Question about Summer Camp',
      from: 'Sarah Johnson',
      fromEmail: 'sarah@email.com',
      content: 'Hi, I wanted to ask about the schedule for the summer art camp...',
      receivedAt: '2024-06-15 10:30 AM',
      status: 'unread',
      priority: 'normal'
    },
    {
      id: 2,
      subject: 'Schedule Change Request',
      from: 'Mike Chen',
      fromEmail: 'mike@email.com',
      content: 'Hello, we need to discuss changing Alex\'s program schedule...',
      receivedAt: '2024-06-14 2:15 PM',
      status: 'read',
      priority: 'high'
    },
    {
      id: 3,
      subject: 'Thank you!',
      from: 'Emily Davis',
      fromEmail: 'emily@email.com',
      content: 'Thank you so much for the wonderful experience...',
      receivedAt: '2024-06-13 4:45 PM',
      status: 'replied',
      priority: 'normal'
    }
  ];

  const templates = [
    {
      id: 1,
      name: 'Welcome Message',
      subject: 'Welcome to XPerience Camp!',
      category: 'enrollment'
    },
    {
      id: 2,
      name: 'Program Reminder',
      subject: 'Upcoming Program Reminder',
      category: 'reminder'
    },
    {
      id: 3,
      name: 'Payment Confirmation',
      subject: 'Payment Received - Thank You!',
      category: 'payment'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Message Center</h1>
            <p className="text-gray-600">Manage customer communications</p>
          </div>
          <Button className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Compose Message
          </Button>
        </div>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="group">Group Message</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Unread Messages</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Replied Today</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">45m</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.from}</div>
                            <div className="text-sm text-gray-500">{message.fromEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.subject}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {message.content}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {message.receivedAt}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              message.status === 'unread' ? 'destructive' : 
                              message.status === 'replied' ? 'default' : 'secondary'
                            }
                          >
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={message.priority === 'high' ? 'destructive' : 'outline'}>
                            {message.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compose New Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <input 
                    type="email" 
                    placeholder="Enter recipient email..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Enter subject..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Enter your message..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button>Send Message</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                        <Badge variant="outline" className="mt-1">{template.category}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4">Create New Template</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="group" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Group Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Send to</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>All Customers</option>
                    <option>Summer Art Camp Participants</option>
                    <option>STEM Workshop Participants</option>
                    <option>Active Enrollments Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Enter subject..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Enter your message..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button>Send to Group</Button>
                  <Button variant="outline">Preview</Button>
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

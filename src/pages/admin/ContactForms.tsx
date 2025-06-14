
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
import { Mail, Clock, User, Archive, Reply } from 'lucide-react';

const AdminContactForms = () => {
  // Mock data for contact form submissions
  const submissions = [
    {
      id: 1,
      name: 'Jennifer Wilson',
      email: 'jennifer@email.com',
      subject: 'Inquiry about Programs',
      message: 'I\'m interested in enrolling my daughter in your summer programs...',
      submittedAt: '2024-06-15 9:30 AM',
      status: 'unread',
      priority: 'normal'
    },
    {
      id: 2,
      name: 'Robert Taylor',
      email: 'robert@email.com',
      subject: 'Partnership Opportunity',
      message: 'We are a local business looking to partner with your camp...',
      submittedAt: '2024-06-14 3:20 PM',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Maria Garcia',
      email: 'maria@email.com',
      subject: 'Schedule Question',
      message: 'What are the typical daily hours for the art camp?',
      submittedAt: '2024-06-13 11:15 AM',
      status: 'responded',
      priority: 'normal'
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@email.com',
      subject: 'Special Needs Accommodation',
      message: 'My son has special dietary needs. Can you accommodate?',
      submittedAt: '2024-06-12 4:45 PM',
      status: 'responded',
      priority: 'high'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'destructive';
      case 'in_progress': return 'default';
      case 'responded': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Form Management</h1>
          <p className="text-gray-600">Manage and respond to contact form submissions</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {submissions.filter(s => s.status === 'unread').length}
                  </div>
                  <div className="text-sm text-gray-600">Unread</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {submissions.filter(s => s.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {submissions.filter(s => s.status === 'responded').length}
                  </div>
                  <div className="text-sm text-gray-600">Responded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {submissions.filter(s => s.priority === 'high').length}
                  </div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Form Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {submission.name}
                            </div>
                            <div className="text-sm text-gray-500">{submission.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{submission.subject}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {submission.message}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {submission.submittedAt}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(submission.status)}>
                            {submission.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={submission.priority === 'high' ? 'destructive' : 'outline'}>
                            {submission.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unread Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'unread').map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{submission.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-gray-500">{submission.submittedAt}</p>
                        </div>
                        <Badge variant={submission.priority === 'high' ? 'destructive' : 'outline'}>
                          {submission.priority}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{submission.message}</p>
                      <div className="flex space-x-2">
                        <Button size="sm">Reply</Button>
                        <Button size="sm" variant="outline">Mark as Read</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'in_progress').map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg border-blue-200 bg-blue-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{submission.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-gray-500">{submission.submittedAt}</p>
                        </div>
                        <Badge variant={submission.priority === 'high' ? 'destructive' : 'outline'}>
                          {submission.priority}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{submission.message}</p>
                      <div className="flex space-x-2">
                        <Button size="sm">Continue</Button>
                        <Button size="sm" variant="outline">Mark as Responded</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responded" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Responded Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.filter(s => s.status === 'responded').map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{submission.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-sm text-gray-500">{submission.submittedAt}</p>
                        </div>
                        <Badge variant="secondary">Responded</Badge>
                      </div>
                      <p className="text-sm mb-3">{submission.message}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Response</Button>
                        <Button size="sm" variant="outline">Archive</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminContactForms;

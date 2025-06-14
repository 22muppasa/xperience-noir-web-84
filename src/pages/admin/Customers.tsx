
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
import { Users, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

const AdminCustomers = () => {
  // Mock data for customers
  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      joinDate: '2024-01-15',
      status: 'active',
      enrollments: 2,
      lastActivity: '2 days ago'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@email.com',
      phone: '(555) 987-6543',
      joinDate: '2024-02-20',
      status: 'active',
      enrollments: 1,
      lastActivity: '1 week ago'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@email.com',
      phone: '(555) 456-7890',
      joinDate: '2024-03-10',
      status: 'inactive',
      enrollments: 0,
      lastActivity: '3 weeks ago'
    }
  ];

  const pendingEnrollments = [
    {
      id: 1,
      customerName: 'Sarah Johnson',
      programName: 'Summer Art Camp',
      childName: 'Emma Johnson',
      submittedDate: '2024-06-10',
      status: 'pending'
    },
    {
      id: 2,
      customerName: 'Mike Chen',
      programName: 'STEM Workshop',
      childName: 'Alex Chen',
      submittedDate: '2024-06-12',
      status: 'pending'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customers and their enrollments</p>
        </div>

        <Tabs defaultValue="customers" className="w-full">
          <TabsList>
            <TabsTrigger value="customers">All Customers</TabsTrigger>
            <TabsTrigger value="enrollments">Pending Enrollments</TabsTrigger>
            <TabsTrigger value="messages">Customer Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Customer Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{customer.phone}</div>
                        </TableCell>
                        <TableCell>{customer.joinDate}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.enrollments}</TableCell>
                        <TableCell>{customer.lastActivity}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              View
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

          <TabsContent value="enrollments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{enrollment.programName}</h3>
                        <p className="text-sm text-gray-600">
                          Customer: {enrollment.customerName} | Child: {enrollment.childName}
                        </p>
                        <p className="text-sm text-gray-500">Submitted: {enrollment.submittedDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="destructive">Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Recent Customer Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Question about Summer Camp</h3>
                      <p className="text-sm text-gray-600">From: Sarah Johnson</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <Button size="sm">Reply</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Schedule Change Request</h3>
                      <p className="text-sm text-gray-600">From: Mike Chen</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                    <Button size="sm">Reply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminCustomers;

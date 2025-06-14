
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
import { BookOpen, Plus, Users, Calendar, Edit, Trash2 } from 'lucide-react';

const AdminPrograms = () => {
  // Mock data for programs
  const programs = [
    {
      id: 1,
      title: 'Summer Art Camp',
      description: 'Creative arts program for kids aged 6-12',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      price: 299,
      maxParticipants: 20,
      enrolled: 15,
      status: 'active'
    },
    {
      id: 2,
      title: 'STEM Workshop',
      description: 'Science, Technology, Engineering, and Math activities',
      startDate: '2024-07-08',
      endDate: '2024-07-12',
      price: 199,
      maxParticipants: 15,
      enrolled: 12,
      status: 'active'
    },
    {
      id: 3,
      title: 'Winter Sports Camp',
      description: 'Outdoor winter activities and sports',
      startDate: '2024-12-15',
      endDate: '2024-12-22',
      price: 399,
      maxParticipants: 25,
      enrolled: 0,
      status: 'draft'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
            <p className="text-gray-600">Create and manage camp programs</p>
          </div>
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Programs</TabsTrigger>
            <TabsTrigger value="active">Active Programs</TabsTrigger>
            <TabsTrigger value="draft">Draft Programs</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollment Report</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  All Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Enrollment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{program.title}</div>
                            <div className="text-sm text-gray-500">{program.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{program.startDate}</div>
                            <div>to {program.endDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>${program.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {program.enrolled}/{program.maxParticipants}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                            {program.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
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

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {programs.filter(p => p.status === 'active').map((program) => (
                    <Card key={program.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                        <div className="space-y-1 text-sm">
                          <div>Start: {program.startDate}</div>
                          <div>End: {program.endDate}</div>
                          <div>Price: ${program.price}</div>
                          <div>Enrolled: {program.enrolled}/{program.maxParticipants}</div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.filter(p => p.status === 'draft').map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{program.title}</h3>
                        <p className="text-sm text-gray-600">{program.description}</p>
                        <p className="text-sm text-gray-500">
                          {program.startDate} - {program.endDate} | ${program.price}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm">Publish</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">27</div>
                    <div className="text-sm text-gray-600">Total Enrollments</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$7,973</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">68%</div>
                    <div className="text-sm text-gray-600">Average Fill Rate</div>
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

export default AdminPrograms;

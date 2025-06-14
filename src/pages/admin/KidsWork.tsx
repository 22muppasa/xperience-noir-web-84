
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
import { Image, Upload, Eye, MessageCircle, Calendar, User } from 'lucide-react';

const AdminKidsWork = () => {
  // Mock data for kids work
  const kidsWork = [
    {
      id: 1,
      title: 'Rainbow Painting',
      childName: 'Emma Johnson',
      programName: 'Summer Art Camp',
      uploadDate: '2024-06-15',
      fileType: 'image',
      status: 'approved',
      comments: 3
    },
    {
      id: 2,
      title: 'Science Experiment Report',
      childName: 'Alex Chen',
      programName: 'STEM Workshop',
      uploadDate: '2024-06-14',
      fileType: 'document',
      status: 'pending',
      comments: 1
    },
    {
      id: 3,
      title: 'Clay Sculpture',
      childName: 'Sophie Williams',
      programName: 'Summer Art Camp',
      uploadDate: '2024-06-13',
      fileType: 'image',
      status: 'approved',
      comments: 5
    }
  ];

  const recentUploads = [
    {
      id: 1,
      title: 'Sunset Drawing',
      childName: 'Emma Johnson',
      uploadedAt: '2 hours ago',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Robot Design',
      childName: 'Alex Chen',
      uploadedAt: '4 hours ago',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Nature Collage',
      childName: 'Sophie Williams',
      uploadedAt: '1 day ago',
      thumbnail: '/placeholder.svg'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kids Work Management</h1>
            <p className="text-gray-600">Manage and showcase children's work</p>
          </div>
          <Button className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Upload Work
          </Button>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList>
            <TabsTrigger value="gallery">Work Gallery</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  All Kids Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Child</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kidsWork.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">{work.title}</TableCell>
                        <TableCell>{work.childName}</TableCell>
                        <TableCell>{work.programName}</TableCell>
                        <TableCell>{work.uploadDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{work.fileType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={work.status === 'approved' ? 'default' : 'secondary'}>
                            {work.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {work.comments}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4" />
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

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kidsWork.filter(work => work.status === 'pending').map((work) => (
                    <div key={work.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{work.title}</h3>
                          <p className="text-sm text-gray-600">
                            by {work.childName} | {work.programName}
                          </p>
                          <p className="text-sm text-gray-500">Uploaded: {work.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Approve</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentUploads.map((upload) => (
                    <Card key={upload.id}>
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="font-medium">{upload.title}</h3>
                        <p className="text-sm text-gray-600">by {upload.childName}</p>
                        <p className="text-sm text-gray-500">{upload.uploadedAt}</p>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Recent Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">On "Rainbow Painting"</h4>
                        <p className="text-sm text-gray-600">by Sarah Johnson (Parent)</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm">"This is absolutely beautiful! Emma worked so hard on this piece."</p>
                    <Button size="sm" variant="outline" className="mt-2">Reply</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">On "Science Experiment Report"</h4>
                        <p className="text-sm text-gray-600">by Lisa Chen (Parent)</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-sm">"Great job Alex! Your hypothesis was very well thought out."</p>
                    <Button size="sm" variant="outline" className="mt-2">Reply</Button>
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

export default AdminKidsWork;


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
import { FileText, Plus, Calendar, Eye, Edit, Trash2, Clock } from 'lucide-react';

const AdminSocialPosts = () => {
  // Mock data for social posts
  const posts = [
    {
      id: 1,
      title: 'Summer Camp Registration Open!',
      content: 'Exciting news! Registration for our summer programs is now open. Early bird pricing available until...',
      status: 'published',
      scheduledFor: null,
      publishedAt: '2024-06-15 10:00 AM',
      createdAt: '2024-06-14',
      views: 1250,
      engagement: 89
    },
    {
      id: 2,
      title: 'Kids Art Showcase',
      content: 'Check out these amazing artworks created by our talented young artists in the recent...',
      status: 'scheduled',
      scheduledFor: '2024-06-20 2:00 PM',
      publishedAt: null,
      createdAt: '2024-06-15',
      views: 0,
      engagement: 0
    },
    {
      id: 3,
      title: 'STEM Workshop Highlights',
      content: 'Our STEM workshop participants built incredible robots and conducted fascinating experiments...',
      status: 'draft',
      scheduledFor: null,
      publishedAt: null,
      createdAt: '2024-06-13',
      views: 0,
      engagement: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Social Posts Management</h1>
            <p className="text-gray-600">Create and manage social media posts</p>
          </div>
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {posts.filter(p => p.status === 'published').length}
                  </div>
                  <div className="text-sm text-gray-600">Published</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {posts.filter(p => p.status === 'scheduled').length}
                  </div>
                  <div className="text-sm text-gray-600">Scheduled</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {posts.filter(p => p.status === 'draft').length}
                  </div>
                  <div className="text-sm text-gray-600">Drafts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {posts.reduce((sum, post) => sum + post.views, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  All Social Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Scheduled/Published</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {post.content}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.createdAt}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {post.status === 'published' && post.publishedAt}
                            {post.status === 'scheduled' && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {post.scheduledFor}
                              </div>
                            )}
                            {post.status === 'draft' && '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views}
                          </div>
                        </TableCell>
                        <TableCell>{post.engagement}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
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

          <TabsContent value="published" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.filter(p => p.status === 'published').map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant="default">Published</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Published: {post.publishedAt}</span>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.views} views
                            </span>
                            <span>{post.engagement} interactions</span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Analytics</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.filter(p => p.status === 'scheduled').map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant="secondary">Scheduled</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          Scheduled for: {post.scheduledFor}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm">Publish Now</Button>
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
                <CardTitle>Draft Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.filter(p => p.status === 'draft').map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{post.title}</h3>
                          <Badge variant="outline">Draft</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                        <div className="text-sm text-gray-500 mb-3">
                          Created: {post.createdAt}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Schedule</Button>
                          <Button size="sm">Publish Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,250</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                    <div className="text-xs text-green-600">+12% this week</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-gray-600">Total Engagement</div>
                    <div className="text-xs text-green-600">+8% this week</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">7.1%</div>
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                    <div className="text-xs text-red-600">-2% this week</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Posts This Month</div>
                    <div className="text-xs text-gray-600">Same as last month</div>
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

export default AdminSocialPosts;

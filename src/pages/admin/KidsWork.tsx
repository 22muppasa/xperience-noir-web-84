
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
import { Image, Upload, Eye, MessageCircle, Calendar, User, Download } from 'lucide-react';
import KidsWorkUpload from '@/components/file-upload/KidsWorkUpload';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminKidsWork = () => {
  const { toast } = useToast();

  // Fetch all kids work for admin
  const { data: kidsWork = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-kids-work'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kids_work')
        .select(`
          *,
          enrollments(
            id,
            child_name,
            programs(
              title
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch recent uploads
  const { data: recentUploads = [] } = useQuery({
    queryKey: ['recent-uploads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kids_work')
        .select(`
          *,
          enrollments(
            child_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    }
  });

  const handleDownload = async (fileUrl: string, title: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType?.startsWith('image/')) return 'Image';
    if (fileType === 'application/pdf') return 'PDF';
    if (fileType?.startsWith('video/')) return 'Video';
    return 'File';
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading kids work...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Kids Work Management</h1>
            <p className="text-gray-600">Manage and showcase children's work</p>
          </div>
          <KidsWorkUpload onUploadComplete={() => refetch()} />
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList>
            <TabsTrigger value="gallery">Work Gallery</TabsTrigger>
            <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  All Kids Work ({kidsWork.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kidsWork.length === 0 ? (
                  <div className="text-center py-8">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No work uploaded yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Child</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kidsWork.map((work) => (
                        <TableRow key={work.id}>
                          <TableCell className="font-medium">{work.title}</TableCell>
                          <TableCell>{work.enrollments?.child_name || 'Unknown'}</TableCell>
                          <TableCell>{work.enrollments?.programs?.title || 'Unknown'}</TableCell>
                          <TableCell>{new Date(work.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getFileTypeLabel(work.file_type)}</Badge>
                          </TableCell>
                          <TableCell>
                            {work.file_size ? `${Math.round(work.file_size / 1024)}KB` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(work.file_url, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownload(work.file_url, work.title)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          {upload.file_type?.startsWith('image/') ? (
                            <img 
                              src={upload.file_url} 
                              alt={upload.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <h3 className="font-medium line-clamp-2">{upload.title}</h3>
                        <p className="text-sm text-gray-600">by {upload.enrollments?.child_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(upload.file_url, '_blank')}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownload(upload.file_url, upload.title)}
                          >
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{kidsWork.length}</div>
                  <div className="text-sm text-gray-600">Total Works</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {kidsWork.filter(w => w.file_type?.startsWith('image/')).length}
                  </div>
                  <div className="text-sm text-gray-600">Images</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {kidsWork.filter(w => w.file_type === 'application/pdf').length}
                  </div>
                  <div className="text-sm text-gray-600">PDFs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {kidsWork.filter(w => w.file_type?.startsWith('video/')).length}
                  </div>
                  <div className="text-sm text-gray-600">Videos</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>File Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Storage Used:</span>
                    <span className="font-medium">
                      {Math.round(kidsWork.reduce((sum, work) => sum + (work.file_size || 0), 0) / 1024 / 1024)}MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average File Size:</span>
                    <span className="font-medium">
                      {kidsWork.length > 0 
                        ? Math.round(kidsWork.reduce((sum, work) => sum + (work.file_size || 0), 0) / kidsWork.length / 1024)
                        : 0}KB
                    </span>
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

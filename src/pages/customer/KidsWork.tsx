
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Download, Eye, MessageSquare } from 'lucide-react';
import KidsWorkUpload from '@/components/file-upload/KidsWorkUpload';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const KidsWork = () => {
  const { toast } = useToast();

  // Fetch kids work data
  const { data: kidsWork = [], isLoading, refetch } = useQuery({
    queryKey: ['kids-work'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('kids_work')
        .select(`
          *,
          enrollments!inner(
            id,
            child_name,
            programs!inner(
              title
            )
          )
        `)
        .eq('enrollments.customer_id', user.user.id)
        .order('created_at', { ascending: false });

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

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    }
    return <Image className="h-5 w-5" />;
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
            <h1 className="text-2xl font-bold text-gray-900">Kids Work</h1>
            <p className="text-gray-600">View and download your children's creative work</p>
          </div>
          <KidsWorkUpload onUploadComplete={() => refetch()} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Image className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Works</p>
                  <p className="text-2xl font-bold">{kidsWork.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">
                    {kidsWork.filter(work => {
                      const workDate = new Date(work.created_at);
                      const now = new Date();
                      return workDate.getMonth() === now.getMonth() && 
                             workDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Available Downloads</p>
                  <p className="text-2xl font-bold">{kidsWork.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kids Work Gallery */}
        {kidsWork.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work uploaded yet</h3>
              <p className="text-gray-600 mb-4">
                Start uploading your children's creative work to showcase their progress.
              </p>
              <KidsWorkUpload onUploadComplete={() => refetch()} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kidsWork.map((work) => (
              <Card key={work.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{work.title}</CardTitle>
                    {getFileIcon(work.file_type)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {work.file_type?.startsWith('image/') ? (
                      <img 
                        src={work.file_url} 
                        alt={work.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        {getFileIcon(work.file_type)}
                        <p className="text-sm text-gray-500 mt-2">
                          {work.file_type === 'application/pdf' ? 'PDF Document' : 'Media File'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Work Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {work.enrollments?.programs?.title || 'Unknown Program'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(work.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {work.description && (
                      <p className="text-sm text-gray-600">{work.description}</p>
                    )}
                    <p className="text-sm font-medium">
                      By: {work.enrollments?.child_name || 'Unknown Child'}
                    </p>
                    {work.file_size && (
                      <p className="text-xs text-gray-500">
                        Size: {Math.round(work.file_size / 1024)}KB
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(work.file_url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(work.file_url, work.title)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KidsWork;


import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Download, Eye, MessageSquare, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const KidsWork = () => {
  const { toast } = useToast();

  // Fetch kids work data for customer
  const { data: kidsWork = [], isLoading, refetch } = useQuery({
    queryKey: ['customer-kids-work'],
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
            customer_id,
            programs!inner(title)
          )
        `)
        .or(`parent_customer_id.eq.${user.user.id},enrollments.customer_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch notifications for this user
  const { data: notifications = [] } = useQuery({
    queryKey: ['customer-notifications'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('type', 'kids_work')
        .order('created_at', { ascending: false })
        .limit(5);

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
      return <Image className="h-5 w-5 text-black" />;
    }
    return <Image className="h-5 w-5 text-black" />;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-black">Loading kids work...</p>
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
            <h1 className="text-3xl font-bold text-black">Kids Work Gallery</h1>
            <p className="text-black mt-1">View and download your children's creative work</p>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <Card className="border-black bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-black">
                <Bell className="h-5 w-5 mr-2 text-black" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="text-sm text-black">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-black ml-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-black bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Image className="h-8 w-8 text-black" />
                <div>
                  <p className="text-sm font-medium text-black">Total Works</p>
                  <p className="text-2xl font-bold text-black">{kidsWork.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-black bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-black" />
                <div>
                  <p className="text-sm font-medium text-black">This Month</p>
                  <p className="text-2xl font-bold text-black">
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
          <Card className="border-black bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Download className="h-8 w-8 text-black" />
                <div>
                  <p className="text-sm font-medium text-black">Available Downloads</p>
                  <p className="text-2xl font-bold text-black">{kidsWork.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kids Work Gallery */}
        {kidsWork.length === 0 ? (
          <Card className="border-black bg-white">
            <CardContent className="p-12 text-center">
              <Image className="mx-auto h-16 w-16 text-black mb-4" />
              <h3 className="text-xl font-medium text-black mb-2">No work uploaded yet</h3>
              <p className="text-black mb-6 max-w-md mx-auto">
                Your children's creative work will appear here when uploaded by our instructors. 
                Check back soon to see their amazing creations!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kidsWork.map((work) => (
              <Card key={work.id} className="hover:shadow-lg transition-shadow border-black bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 text-black">{work.title}</CardTitle>
                    {getFileIcon(work.file_type)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div className="aspect-video bg-white rounded-lg flex items-center justify-center border border-black">
                    {work.file_type?.startsWith('image/') ? (
                      <img 
                        src={work.file_url} 
                        alt={work.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center p-4">
                        {getFileIcon(work.file_type)}
                        <p className="text-sm text-black mt-2">
                          {work.file_type === 'application/pdf' ? 'PDF Document' : 'Media File'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Work Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-black border-black bg-white">
                        {work.enrollments?.programs?.title || 'Unknown Program'}
                      </Badge>
                      <span className="text-sm text-black">
                        {new Date(work.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {work.description && (
                      <p className="text-sm text-black bg-white border border-black p-3 rounded">{work.description}</p>
                    )}
                    <p className="text-sm font-medium text-black">
                      Created by: {work.enrollments?.child_name || 'Unknown Child'}
                    </p>
                    {work.file_size && (
                      <p className="text-xs text-black">
                        File size: {Math.round(work.file_size / 1024)}KB
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(work.file_url, '_blank')}
                      className="flex-1 border-black text-black hover:bg-gray-50 bg-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(work.file_url, work.title)}
                      className="flex-1 border-black text-black hover:bg-gray-50 bg-white"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
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

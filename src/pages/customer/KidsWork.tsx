import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Download, Eye, MessageSquare, Bell, Baby, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const KidsWork = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch kids work data for customer using new child-based associations
  const { data: kidsWork = [], isLoading, refetch } = useQuery({
    queryKey: ['customer-kids-work', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('kids_work')
        .select(`
          *,
          children(
            id,
            first_name,
            last_name
          ),
          enrollments(
            id,
            child_name,
            programs(title)
          )
        `)
        .or(`parent_customer_id.eq.${user.id},child_id.in.(select child_id from parent_child_relationships where parent_id = ${user.id} and can_view_work = true)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch notifications for this user
  const { data: notifications = [] } = useQuery({
    queryKey: ['customer-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'kids_work')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch user's children for grouping
  const { data: myChildren = [] } = useQuery({
    queryKey: ['my-children-for-work', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          child_id,
          children!inner(
            id,
            first_name,
            last_name
          )
        `)
        .eq('parent_id', user.id)
        .eq('can_view_work', true);
      
      if (error) throw error;
      return data.map(rel => rel.children);
    },
    enabled: !!user?.id
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

  const handleViewInGoogleDrive = (googleDriveLink: string) => {
    window.open(googleDriveLink, '_blank');
  };

  const getGoogleDrivePreviewUrl = (work: any) => {
    if (work.google_drive_file_id) {
      return `https://drive.google.com/file/d/${work.google_drive_file_id}/preview`;
    }
    return null;
  };

  const getGoogleDriveThumbnailUrl = (work: any) => {
    if (work.google_drive_file_id) {
      return `https://drive.google.com/thumbnail?id=${work.google_drive_file_id}&sz=w400`;
    }
    return null;
  };

  const getFileIcon = (work: any) => {
    // For Google Drive links, show a generic icon
    if (work.google_drive_link) {
      return <ExternalLink className="h-5 w-5 text-black" />;
    }
    // Legacy file type handling
    if (work.file_type?.startsWith('image/')) {
      return <Image className="h-5 w-5 text-black" />;
    }
    return <Image className="h-5 w-5 text-black" />;
  };

  const getChildName = (work: any) => {
    // Try to get name from new children relationship
    if (work.children) {
      return `${work.children.first_name} ${work.children.last_name}`;
    }
    // Fallback to enrollment child_name for backwards compatibility
    if (work.enrollments?.child_name) {
      return work.enrollments.child_name;
    }
    return 'Unknown Child';
  };

  const groupWorkByChild = () => {
    const grouped: { [key: string]: any[] } = {};
    
    kidsWork.forEach(work => {
      const childKey = work.child_id || 'legacy';
      const childName = getChildName(work);
      
      if (!grouped[childKey]) {
        grouped[childKey] = [];
      }
      grouped[childKey].push({ ...work, childName });
    });
    
    return grouped;
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

  const groupedWork = groupWorkByChild();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Kids Work Gallery</h1>
            <p className="text-black mt-1">View and access your children's creative work</p>
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
                <Baby className="h-8 w-8 text-black" />
                <div>
                  <p className="text-sm font-medium text-black">Children</p>
                  <p className="text-2xl font-bold text-black">{myChildren.length}</p>
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
        </div>

        {/* Kids Work Gallery - Grouped by Child */}
        {Object.keys(groupedWork).length === 0 ? (
          <Card className="border-black bg-white">
            <CardContent className="p-12 text-center">
              <Image className="mx-auto h-16 w-16 text-black mb-4" />
              <h3 className="text-xl font-medium text-black mb-2">No work shared yet</h3>
              <p className="text-black mb-6 max-w-md mx-auto">
                Your children's creative work will appear here when shared by our instructors. 
                Check back soon to see their amazing creations!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedWork).map(([childKey, works]) => (
              <div key={childKey}>
                <div className="flex items-center space-x-2 mb-4">
                  <Baby className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-black">
                    {works[0]?.childName || 'Unknown Child'}
                  </h2>
                  <Badge variant="outline" className="text-black border-black bg-white">
                    {works.length} work{works.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {works.map((work) => (
                    <Card key={work.id} className="hover:shadow-lg transition-shadow border-black bg-white">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2 text-black">{work.title}</CardTitle>
                          {getFileIcon(work)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Preview */}
                        <div className="aspect-video bg-white rounded-lg flex items-center justify-center border border-black">
                          {work.google_drive_link ? (
                            <div className="w-full h-full">
                              {getGoogleDrivePreviewUrl(work) ? (
                                <iframe
                                  src={getGoogleDrivePreviewUrl(work)}
                                  className="w-full h-full rounded-lg"
                                  title={work.title}
                                />
                              ) : (
                                <div className="text-center p-4 flex flex-col items-center justify-center h-full">
                                  <ExternalLink className="h-12 w-12 text-black mb-2" />
                                  <p className="text-sm text-black">Google Drive Content</p>
                                  <p className="text-xs text-gray-600 mt-1">Click to view</p>
                                </div>
                              )}
                            </div>
                          ) : work.file_type?.startsWith('image/') ? (
                            <img 
                              src={work.file_url} 
                              alt={work.title}
                              className="max-w-full max-h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="text-center p-4">
                              {getFileIcon(work)}
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
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 pt-2">
                          {work.google_drive_link ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewInGoogleDrive(work.google_drive_link)}
                                className="flex-1 border-black text-black hover:bg-gray-50 bg-white"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Open in Drive
                              </Button>
                            </>
                          ) : (
                            <>
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
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = work.file_url;
                                  a.download = work.title;
                                  a.click();
                                }}
                                className="border-black text-black hover:bg-gray-50 bg-white"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KidsWork;

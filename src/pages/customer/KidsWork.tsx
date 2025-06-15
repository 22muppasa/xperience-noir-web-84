import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Download, Eye, MessageSquare, Bell, Baby, Folder, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import WorkCollections from '@/components/collections/WorkCollections';
import ChildMilestones from '@/components/milestones/ChildMilestones';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

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
          ),
          kids_work_tags(
            work_tags(name, color)
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

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) {
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
            <h1 className="text-3xl font-bold text-black">Kids Work & Progress</h1>
            <p className="text-black mt-1">View work, track milestones, and manage collections</p>
          </div>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-black">
            <TabsTrigger value="gallery" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Image className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="collections" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Folder className="h-4 w-4 mr-2" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="milestones" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Award className="h-4 w-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
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
                  <h3 className="text-xl font-medium text-black mb-2">No work uploaded yet</h3>
                  <p className="text-black mb-6 max-w-md mx-auto">
                    Your children's creative work will appear here when uploaded by our instructors. 
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
                              
                              {/* Tags */}
                              {work.kids_work_tags && work.kids_work_tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {work.kids_work_tags.map((tag: any, index: number) => (
                                    <Badge 
                                      key={index}
                                      variant="outline" 
                                      className="text-xs"
                                      style={{ 
                                        backgroundColor: tag.work_tags.color + '20',
                                        borderColor: tag.work_tags.color,
                                        color: tag.work_tags.color
                                      }}
                                    >
                                      {tag.work_tags.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {work.description && (
                                <p className="text-sm text-black bg-white border border-black p-3 rounded">{work.description}</p>
                              )}
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
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="collections">
            <WorkCollections />
          </TabsContent>

          <TabsContent value="milestones">
            <ChildMilestones />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default KidsWork;

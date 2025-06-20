
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminKidsWorkUpload from '@/components/file-upload/AdminKidsWorkUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Image, 
  Video, 
  Download, 
  Trash2, 
  Upload,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Link
} from 'lucide-react';
import { format } from 'date-fns';

interface KidsWork {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  google_drive_link: string;
  google_drive_file_id: string;
  link_status: string;
  created_at: string;
  enrollment_id: string;
  child_id: string;
  parent_customer_id: string;
  enrollments: {
    child_name: string;
    customer_id: string;
  };
  children?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

const AdminKidsWork = () => {
  const [selectedWork, setSelectedWork] = useState<KidsWork | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<KidsWork | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all kids work with enrollment and children data
  const { data: kidsWork = [], isLoading, error: workError } = useQuery({
    queryKey: ['admin-kids-work'],
    queryFn: async () => {
      console.log('Fetching admin kids work...');
      
      const { data, error } = await supabase
        .from('kids_work')
        .select(`
          *,
          enrollments (
            child_name,
            customer_id
          ),
          children (
            id,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin kids work:', error);
        throw error;
      }
      
      console.log('Admin kids work fetched successfully:', data);
      return data as KidsWork[];
    }
  });

  // Fetch parent profiles separately if needed for display
  const { data: parentProfiles = {} } = useQuery({
    queryKey: ['parent-profiles', kidsWork],
    queryFn: async () => {
      if (!kidsWork.length) return {};
      
      const customerIds = [...new Set(kidsWork.map(work => work.enrollments?.customer_id).filter(Boolean))];
      
      if (customerIds.length === 0) return {};
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', customerIds);
      
      if (error) {
        console.error('Error fetching parent profiles:', error);
        return {};
      }
      
      const profileMap: { [key: string]: { first_name?: string; last_name?: string } } = {};
      data?.forEach(profile => {
        profileMap[profile.id] = profile;
      });
      
      return profileMap;
    },
    enabled: kidsWork.length > 0
  });

  // Delete kids work mutation
  const deleteMutation = useMutation({
    mutationFn: async (workId: string) => {
      const { error } = await supabase
        .from('kids_work')
        .delete()
        .eq('id', workId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Kids work deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-kids-work'] });
      queryClient.invalidateQueries({ queryKey: ['customer-kids-work'] });
      setIsDeleteDialogOpen(false);
      setWorkToDelete(null);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete kids work. Please try again.",
        variant: "destructive"
      });
    }
  });

  const getFileIcon = (work: KidsWork) => {
    if (work.google_drive_link) return <Link className="h-5 w-5 text-white" />;
    if (work.file_type?.startsWith('image/')) return <Image className="h-5 w-5 text-black" />;
    if (work.file_type?.startsWith('video/')) return <Video className="h-5 w-5 text-black" />;
    return <FileText className="h-5 w-5 text-black" />;
  };

  const getFileTypeColor = (work: KidsWork) => {
    if (work.google_drive_link) return 'bg-white text-black border-black';
    if (work.file_type?.startsWith('image/')) return 'bg-white text-black border-black';
    if (work.file_type?.startsWith('video/')) return 'bg-white text-black border-black';
    return 'bg-white text-black border-black';
  };

  const getFileTypeLabel = (work: KidsWork) => {
    if (work.google_drive_link) return 'Google Drive';
    if (work.file_type?.startsWith('image/')) return 'image';
    if (work.file_type?.startsWith('video/')) return 'video';
    return 'file';
  };

  const getChildName = (work: KidsWork) => {
    if (work.children) {
      return `${work.children.first_name} ${work.children.last_name}`;
    }
    return work.enrollments?.child_name || 'Unknown Child';
  };

  const getParentName = (work: KidsWork) => {
    const profile = parentProfiles[work.enrollments?.customer_id];
    if (profile) {
      return `${profile.first_name || 'Unknown'} ${profile.last_name || 'Parent'}`;
    }
    return 'Unknown Parent';
  };

  const handleView = (work: KidsWork) => {
    setSelectedWork(work);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (work: KidsWork) => {
    setWorkToDelete(work);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenLink = (work: KidsWork) => {
    if (work.google_drive_link) {
      window.open(work.google_drive_link, '_blank');
    } else if (work.file_url) {
      window.open(work.file_url, '_blank');
    }
  };

  const renderFilePreview = (work: KidsWork) => {
    if (work.google_drive_link && work.google_drive_file_id) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${work.google_drive_file_id}/preview`}
          className="w-full h-96 rounded-lg border border-black"
          title={work.title}
        />
      );
    }
    
    if (work.file_type?.startsWith('image/')) {
      return (
        <img 
          src={work.file_url} 
          alt={work.title}
          className="max-w-full max-h-96 object-contain rounded-lg border border-black"
        />
      );
    }
    
    if (work.file_type?.startsWith('video/')) {
      return (
        <video 
          src={work.file_url} 
          controls
          className="max-w-full max-h-96 rounded-lg border border-black"
        />
      );
    }
    
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-black">
        <div className="text-center">
          <FileText className="h-16 w-16 text-black mx-auto mb-4" />
          <p className="text-black">Preview not available for this file type</p>
          <Button 
            onClick={() => handleOpenLink(work)}
            className="mt-4 bg-black text-white hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open File
          </Button>
        </div>
      </div>
    );
  };

  const navigateToUpload = () => {
    const uploadTab = document.querySelector('[data-value="upload"]') as HTMLButtonElement;
    if (uploadTab) {
      uploadTab.click();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-black">Loading kids work...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (workError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h3 className="text-lg font-medium text-black mb-2">Error Loading Kids Work</h3>
            <p className="text-black mb-4">There was an error loading the kids work. Please try again.</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-kids-work'] })} 
              className="bg-black text-white hover:bg-gray-800"
            >
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Kids Work Management</h1>
          <p className="text-black mt-2">Share children's creative work and projects via Google Drive</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="upload" data-value="upload" className="flex items-center space-x-2 text-black">
              <Upload className="h-4 w-4" />
              <span>Share Work</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center space-x-2 text-black">
              <Eye className="h-4 w-4" />
              <span>Manage Work</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black">Share New Kids Work</CardTitle>
                <CardDescription className="text-black">
                  Share Google Drive links to children's creative work and projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminKidsWorkUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">All Kids Work</h2>
                <Badge variant="secondary" className="text-sm bg-white text-black border-black">
                  {kidsWork.length} items
                </Badge>
              </div>

              {kidsWork.length === 0 ? (
                <Card className="p-8 bg-white border-black">
                  <div className="text-center">
                    <Upload className="h-16 w-16 text-black mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">No kids work shared yet</h3>
                    <p className="text-black mb-4">Start by sharing some children's creative work and projects.</p>
                    <Button onClick={navigateToUpload} className="bg-black text-white hover:bg-gray-800">
                      Share First Work
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kidsWork.map((work) => (
                    <Card key={work.id} className="hover:shadow-md transition-shadow bg-white border-black">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(work)}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-black truncate">{work.title}</h3>
                              <p className="text-sm text-black">
                                {getChildName(work)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getFileTypeColor(work)}>
                            {getFileTypeLabel(work)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-black">
                            <User className="h-4 w-4" />
                            <span>
                              Parent: {getParentName(work)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-black">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(work.created_at), 'MMM d, yyyy')}</span>
                          </div>

                          {work.google_drive_link && work.link_status && (
                            <div className="flex items-center space-x-2 text-sm">
                              <span className={`w-2 h-2 rounded-full ${work.link_status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="text-black">
                                Link {work.link_status}
                              </span>
                            </div>
                          )}
                        </div>

                        {work.description && (
                          <p className="text-sm text-black line-clamp-2">{work.description}</p>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(work)}
                            className="flex-1 border-black text-white hover:text-black hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenLink(work)}
                            className="border-black text-white hover:text-black hover:bg-gray-50"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(work)}
                            className="text-red-600 hover:text-red-700 border-black hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">{selectedWork?.title}</DialogTitle>
              <DialogDescription className="text-black">
                Work by {selectedWork ? getChildName(selectedWork) : ''} • 
                Shared {selectedWork ? format(new Date(selectedWork.created_at), 'MMM d, yyyy') : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedWork?.description && (
                <div>
                  <h4 className="font-medium text-black mb-2">Description</h4>
                  <p className="text-black">{selectedWork.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-black mb-2">Preview</h4>
                {selectedWork && renderFilePreview(selectedWork)}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="border-black text-black">
                Close
              </Button>
              {selectedWork && (
                <Button onClick={() => handleOpenLink(selectedWork)} className="bg-black text-white hover:bg-gray-800">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Delete Kids Work</DialogTitle>
              <DialogDescription className="text-black">
                Are you sure you want to delete "{workToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-black text-black">
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => workToDelete && deleteMutation.mutate(workToDelete.id)}
                disabled={deleteMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminKidsWork;

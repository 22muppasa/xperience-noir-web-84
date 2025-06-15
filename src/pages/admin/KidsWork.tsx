
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
  User
} from 'lucide-react';
import { format } from 'date-fns';

interface KidsWork {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  created_at: string;
  enrollment_id: string;
  enrollments: {
    child_name: string;
    customer_id: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
}

const AdminKidsWork = () => {
  const [selectedWork, setSelectedWork] = useState<KidsWork | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState<KidsWork | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all kids work with enrollment and profile data
  const { data: kidsWork = [], isLoading } = useQuery({
    queryKey: ['admin-kids-work'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kids_work')
        .select(`
          *,
          enrollments!inner (
            child_name,
            customer_id,
            profiles!enrollments_customer_id_fkey (
              first_name,
              last_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KidsWork[];
    }
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (fileType.startsWith('video/')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleView = (work: KidsWork) => {
    setSelectedWork(work);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (work: KidsWork) => {
    setWorkToDelete(work);
    setIsDeleteDialogOpen(true);
  };

  const handleDownload = (work: KidsWork) => {
    window.open(work.file_url, '_blank');
  };

  const renderFilePreview = (work: KidsWork) => {
    if (work.file_type.startsWith('image/')) {
      return (
        <img 
          src={work.file_url} 
          alt={work.title}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      );
    }
    
    if (work.file_type.startsWith('video/')) {
      return (
        <video 
          src={work.file_url} 
          controls
          className="max-w-full max-h-96 rounded-lg"
        />
      );
    }
    
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Preview not available for this file type</p>
          <Button 
            onClick={() => handleDownload(work)}
            className="mt-4"
          >
            <Download className="h-4 w-4 mr-2" />
            Download File
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading kids work...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kids Work Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage children's creative work and projects</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" data-value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Work</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Manage Work</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Kids Work</CardTitle>
                <CardDescription>
                  Upload photos, videos, or documents of children's creative work and projects
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
                <h2 className="text-xl font-semibold text-gray-900">All Kids Work</h2>
                <Badge variant="secondary" className="text-sm">
                  {kidsWork.length} items
                </Badge>
              </div>

              {kidsWork.length === 0 ? (
                <Card className="p-8">
                  <div className="text-center">
                    <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No kids work uploaded yet</h3>
                    <p className="text-gray-600 mb-4">Start by uploading some children's creative work and projects.</p>
                    <Button onClick={navigateToUpload}>
                      Upload First Work
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kidsWork.map((work) => (
                    <Card key={work.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(work.file_type)}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 truncate">{work.title}</h3>
                              <p className="text-sm text-gray-600">
                                {work.enrollments.child_name}
                              </p>
                            </div>
                          </div>
                          <Badge className={getFileTypeColor(work.file_type)}>
                            {work.file_type.split('/')[0]}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>
                              Parent: {work.enrollments.profiles?.first_name || 'Unknown'} {work.enrollments.profiles?.last_name || 'Parent'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(work.created_at), 'MMM d, yyyy')}</span>
                          </div>
                        </div>

                        {work.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">{work.description}</p>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(work)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(work)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(work)}
                            className="text-red-600 hover:text-red-700"
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedWork?.title}</DialogTitle>
              <DialogDescription>
                Work by {selectedWork?.enrollments.child_name} • 
                Uploaded {selectedWork ? format(new Date(selectedWork.created_at), 'MMM d, yyyy') : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedWork?.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedWork.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                {selectedWork && renderFilePreview(selectedWork)}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              {selectedWork && (
                <Button onClick={() => handleDownload(selectedWork)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Kids Work</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{workToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => workToDelete && deleteMutation.mutate(workToDelete.id)}
                disabled={deleteMutation.isPending}
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

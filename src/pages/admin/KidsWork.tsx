
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image, Download, Eye, Search, Upload, Trash2 } from 'lucide-react';
import AdminKidsWorkUpload from '@/components/file-upload/AdminKidsWorkUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const AdminKidsWork = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

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
            customer_id,
            programs(title),
            profiles!enrollments_customer_id_fkey(first_name, last_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Delete kids work mutation
  const deleteWorkMutation = useMutation({
    mutationFn: async (workId: string) => {
      const { error } = await supabase
        .from('kids_work')
        .delete()
        .eq('id', workId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Work deleted",
        description: "Kids work has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-kids-work'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete work",
        variant: "destructive",
      });
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

  const handleDelete = (workId: string) => {
    if (window.confirm('Are you sure you want to delete this work? This action cannot be undone.')) {
      deleteWorkMutation.mutate(workId);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-600" />;
    }
    return <Image className="h-5 w-5 text-gray-600" />;
  };

  // Filter kids work based on search term
  const filteredKidsWork = kidsWork.filter(work => 
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.enrollments?.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.enrollments?.programs?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-900">Loading kids work...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Kids Work Management</h1>
            <p className="text-gray-700 mt-1">Upload and manage children's creative work</p>
          </div>
          <AdminKidsWorkUpload onUploadComplete={() => refetch()} />
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-gray-200">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, child, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Upload className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Works</p>
                  <p className="text-xl font-bold text-gray-900">{kidsWork.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">This Week</p>
                  <p className="text-xl font-bold text-gray-900">
                    {kidsWork.filter(work => {
                      const workDate = new Date(work.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return workDate > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Download className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Images</p>
                  <p className="text-xl font-bold text-gray-900">
                    {kidsWork.filter(work => work.file_type?.startsWith('image/')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kids Work Gallery */}
        {filteredKidsWork.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching results' : 'No work uploaded yet'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Start uploading children\'s creative work to showcase their progress and achievements.'
                }
              </p>
              {!searchTerm && <AdminKidsWorkUpload onUploadComplete={() => refetch()} />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKidsWork.map((work) => (
              <Card key={work.id} className="hover:shadow-lg transition-shadow border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2 text-gray-900">{work.title}</CardTitle>
                    {getFileIcon(work.file_type)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border">
                    {work.file_type?.startsWith('image/') ? (
                      <img 
                        src={work.file_url} 
                        alt={work.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center p-3">
                        {getFileIcon(work.file_type)}
                        <p className="text-xs text-gray-600 mt-1">
                          {work.file_type === 'application/pdf' ? 'PDF' : 'Media'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Work Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {work.enrollments?.programs?.title || 'No Program'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(work.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="font-medium text-gray-900">
                        {work.enrollments?.child_name || 'Unknown Child'}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Parent: {work.enrollments?.profiles?.first_name} {work.enrollments?.profiles?.last_name}
                      </p>
                    </div>

                    {work.description && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
                        {work.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(work.file_url, '_blank')}
                      className="flex-1 text-xs h-8"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(work.file_url, work.title)}
                      className="flex-1 text-xs h-8"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(work.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
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

export default AdminKidsWork;

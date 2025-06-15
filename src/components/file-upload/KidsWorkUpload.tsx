
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image } from 'lucide-react';
import FileUpload from './FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

interface KidsWorkUploadProps {
  onUploadComplete?: () => void;
}

const KidsWorkUpload: React.FC<KidsWorkUploadProps> = ({ onUploadComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ['user-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          programs(title)
        `)
        .eq('customer_id', user.id)
        .eq('status', 'confirmed');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleFileUpload = async (result: { path: string; url: string }) => {
    if (!title || !enrollmentId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get file info from the upload
      const response = await fetch(result.url, { method: 'HEAD' });
      const fileSize = parseInt(response.headers.get('content-length') || '0');
      const fileType = response.headers.get('content-type') || '';

      const { error } = await supabase.from('kids_work').insert({
        title,
        description,
        enrollment_id: enrollmentId,
        file_url: result.url,
        storage_path: result.path,
        file_type: fileType,
        file_size: fileSize,
        uploaded_by: user.user.id,
        parent_customer_id: user.user.id
      });

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: "Kids work has been uploaded successfully",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setEnrollmentId('');
      setIsOpen(false);
      onUploadComplete?.();

    } catch (error: any) {
      console.error('Error saving kids work:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save work",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md group">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300">
            <Image className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
            Upload Kids Work
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Share your child's latest creative projects and achievements
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Work
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Kids Work</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter work title"
                />
              </div>

              <div>
                <Label htmlFor="enrollment">Program Enrollment *</Label>
                <Select value={enrollmentId} onValueChange={setEnrollmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select enrollment" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollments.map((enrollment: any) => (
                      <SelectItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.programs?.title} - {enrollment.child_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the work..."
                  rows={3}
                />
              </div>

              <div>
                <Label>File Upload *</Label>
                <FileUpload
                  bucket="kids-work"
                  maxSize={50 * 1024 * 1024} // 50MB
                  allowedTypes={[
                    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                    'application/pdf', 'video/mp4', 'video/quicktime'
                  ]}
                  accept={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
                    'application/pdf': ['.pdf'],
                    'video/*': ['.mp4', '.mov']
                  }}
                  onUploadComplete={handleFileUpload}
                  className="mt-2"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default KidsWorkUpload;

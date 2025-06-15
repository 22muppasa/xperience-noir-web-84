
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import FileUpload from './FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface AdminKidsWorkUploadProps {
  onUploadComplete?: () => void;
}

const AdminKidsWorkUpload: React.FC<AdminKidsWorkUploadProps> = ({ onUploadComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch all enrollments for admin
  const { data: enrollments = [] } = useQuery({
    queryKey: ['admin-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          customer_id,
          programs!inner(title),
          profiles!enrollments_customer_id_fkey(first_name, last_name)
        `)
        .eq('status', 'active')
        .order('child_name');

      if (error) throw error;
      return data || [];
    }
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

      // Get enrollment details to find the parent
      const selectedEnrollment = enrollments.find(e => e.id === enrollmentId);
      if (!selectedEnrollment) throw new Error('Enrollment not found');

      // Get file info from the upload
      const response = await fetch(result.url, { method: 'HEAD' });
      const fileSize = parseInt(response.headers.get('content-length') || '0');
      const fileType = response.headers.get('content-type') || '';

      const { error } = await supabase.from('kids_work').insert({
        title,
        description,
        enrollment_id: enrollmentId,
        parent_customer_id: selectedEnrollment.customer_id,
        file_url: result.url,
        storage_path: result.path,
        file_type: fileType,
        file_size: fileSize,
        uploaded_by: user.user.id
      });

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: `Kids work uploaded for ${selectedEnrollment.child_name}`,
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center bg-gray-900 hover:bg-gray-800">
          <Upload className="mr-2 h-4 w-4" />
          Upload Kids Work
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Upload Kids Work (Admin)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-900">
              Work Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter work title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="enrollment" className="text-sm font-medium text-gray-900">
              Select Child/Program *
            </Label>
            <Select value={enrollmentId} onValueChange={setEnrollmentId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select child and program" />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.id} value={enrollment.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{enrollment.child_name}</span>
                      <span className="text-sm text-gray-500">
                        {enrollment.programs?.title} - Parent: {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-900">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work or add notes..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">File Upload *</Label>
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
  );
};

export default AdminKidsWorkUpload;

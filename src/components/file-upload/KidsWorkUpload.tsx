
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

  // Mock enrollments - in a real app, fetch from Supabase
  const enrollments = [
    { id: '1', program: 'Summer Art Camp', child: 'Emma Johnson' },
    { id: '2', program: 'STEM Workshop', child: 'Alex Chen' },
  ];

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
        uploaded_by: user.user.id
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Upload className="mr-2 h-4 w-4" />
          Upload Kids Work
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
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.id} value={enrollment.id}>
                    {enrollment.program} - {enrollment.child}
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
  );
};

export default KidsWorkUpload;

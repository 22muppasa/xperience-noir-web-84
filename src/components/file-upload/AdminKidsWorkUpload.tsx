
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface Enrollment {
  id: string;
  child_name: string;
  customer_id: string;
  program_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  } | null;
}

const AdminKidsWorkUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch enrollments with customer profiles
  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments-with-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          customer_id,
          program_id,
          profiles:customer_id (
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      return data as Enrollment[];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadData: {
      files: File[];
      enrollmentId: string;
      title: string;
      description: string;
    }) => {
      const { files, enrollmentId, title, description } = uploadData;
      
      // Find the enrollment to get customer info
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (!enrollment) throw new Error('Enrollment not found');

      const uploadPromises = files.map(async (file) => {
        // Upload file to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${enrollmentId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('kids-work')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('kids-work')
          .getPublicUrl(filePath);

        // Insert record into kids_work table
        const { error: insertError } = await supabase
          .from('kids_work')
          .insert({
            enrollment_id: enrollmentId,
            parent_customer_id: enrollment.customer_id,
            title: title || file.name,
            description,
            file_url: publicUrl,
            file_type: file.type,
            storage_path: filePath
          });

        if (insertError) throw insertError;
      });

      await Promise.all(uploadPromises);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Kids work uploaded successfully and parents notified!"
      });
      
      // Reset form
      setSelectedFiles([]);
      setSelectedEnrollment('');
      setTitle('');
      setDescription('');
      setIsUploading(false);
      
      // Refresh relevant queries
      queryClient.invalidateQueries({ queryKey: ['kids-work'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload kids work. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedEnrollment || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select an enrollment and at least one file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate({
      files: selectedFiles,
      enrollmentId: selectedEnrollment,
      title,
      description
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Kids Work</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="enrollment" className="text-sm font-medium text-gray-900">
              Select Child
            </Label>
            <Select value={selectedEnrollment} onValueChange={setSelectedEnrollment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a child to upload work for..." />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.id} value={enrollment.id}>
                    {enrollment.child_name} - {enrollment.profiles?.first_name || 'Unknown'} {enrollment.profiles?.last_name || 'Parent'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-900">
              Title (optional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this work..."
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-900">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description or note about this work..."
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="files" className="text-sm font-medium text-gray-900">
              Select Files
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-gray-900 hover:text-gray-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  Images, videos, PDFs, and documents up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-900">Selected Files</Label>
              <div className="mt-2 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedEnrollment || selectedFiles.length === 0}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isUploading ? 'Uploading...' : 'Upload Kids Work'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminKidsWorkUpload;

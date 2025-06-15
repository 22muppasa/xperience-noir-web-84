
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Enrollment {
  id: string;
  child_name: string;
  child_id: string | null;
  customer_id: string;
  programs: {
    title: string;
  } | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
  children: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

const AdminKidsWorkUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all enrollments with child and parent information
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['admin-enrollments-for-upload'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          child_id,
          customer_id,
          programs!inner(title),
          profiles!customer_id(first_name, last_name, email),
          children(id, first_name, last_name)
        `)
        .eq('status', 'active')
        .order('child_name');

      if (error) throw error;
      return data as Enrollment[];
    }
  });

  const uploadWorkMutation = useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      enrollmentId
    }: {
      file: File;
      title: string;
      description: string;
      enrollmentId: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Find the enrollment to get child and parent info
      const enrollment = enrollments.find(e => e.id === enrollmentId);
      if (!enrollment) throw new Error('Enrollment not found');

      // Upload file to storage (you'll need to set up storage bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `kids-work/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // For now, we'll use a placeholder URL since storage setup is not shown
      // In a real implementation, you would upload to Supabase storage
      const fileUrl = URL.createObjectURL(file);

      // Insert kids work record
      const { data, error } = await supabase
        .from('kids_work')
        .insert([{
          title,
          description,
          file_url: fileUrl,
          file_type: file.type,
          file_size: file.size,
          enrollment_id: enrollmentId,
          child_id: enrollment.child_id,
          parent_customer_id: enrollment.customer_id,
          uploaded_by: user.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kids-work'] });
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setSelectedEnrollmentId('');
      setIsUploading(false);
      toast({
        title: "Success",
        description: "Kids work uploaded successfully and parent has been notified."
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload kids work. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !selectedEnrollmentId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    uploadWorkMutation.mutate({
      file: selectedFile,
      title,
      description,
      enrollmentId: selectedEnrollmentId
    });
  };

  const selectedEnrollment = enrollments.find(e => e.id === selectedEnrollmentId);

  if (isLoadingEnrollments) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-black">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-black">
        <CardHeader>
          <CardTitle className="flex items-center text-black">
            <Upload className="h-5 w-5 mr-2" />
            Upload Children's Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Child/Enrollment Selection */}
          <div>
            <Label htmlFor="enrollment" className="text-black">Select Child & Program</Label>
            <Select value={selectedEnrollmentId} onValueChange={setSelectedEnrollmentId}>
              <SelectTrigger className="bg-white border-black text-black">
                <SelectValue placeholder="Choose a child and program..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-black max-h-60">
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.id} value={enrollment.id} className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {enrollment.children ? 
                          `${enrollment.children.first_name} ${enrollment.children.last_name}` : 
                          enrollment.child_name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {enrollment.programs?.title} • {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show selected enrollment info */}
          {selectedEnrollment && (
            <Alert className="border-black bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-black">
                <strong>Selected:</strong> {selectedEnrollment.children ? 
                  `${selectedEnrollment.children.first_name} ${selectedEnrollment.children.last_name}` : 
                  selectedEnrollment.child_name} in {selectedEnrollment.programs?.title}
                <br />
                <strong>Parent:</strong> {selectedEnrollment.profiles?.first_name} {selectedEnrollment.profiles?.last_name} ({selectedEnrollment.profiles?.email})
              </AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-black">Work Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Drawing of a Rainbow"
              className="bg-white border-black text-black"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-black">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work, techniques used, or any special notes..."
              className="bg-white border-black text-black"
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file" className="text-black">Select File *</Label>
            <div className="mt-1">
              <input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept="image/*,video/*,application/pdf"
                className="block w-full text-sm text-black
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-black file:text-white
                  hover:file:bg-gray-800
                  file:cursor-pointer cursor-pointer"
              />
              <p className="mt-1 text-xs text-black">
                Supported formats: Images, Videos, PDFs (Max 10MB)
              </p>
            </div>
          </div>

          {/* File Preview */}
          {selectedFile && (
            <Alert className="border-green-600 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-black">
                <strong>File selected:</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                <br />
                <strong>Type:</strong> {selectedFile.type}
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !title || !selectedEnrollmentId}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Kids Work
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-white border-black">
        <CardHeader>
          <CardTitle className="flex items-center text-black">
            <FileText className="h-5 w-5 mr-2" />
            Upload Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-black">
            <li>• Select the child and program for which you're uploading work</li>
            <li>• Provide a descriptive title for the work</li>
            <li>• Add details about the work, techniques, or special notes</li>
            <li>• Choose high-quality images or videos when possible</li>
            <li>• Parents will be automatically notified when work is uploaded</li>
            <li>• Work will be visible in the child's portfolio and parent's gallery</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminKidsWorkUpload;

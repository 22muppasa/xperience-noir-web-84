
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminKidsWorkUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch enrollments with child and program data
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['enrollments-for-upload'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          child_id,
          customer_id,
          programs!inner(
            title
          ),
          children(
            id,
            first_name,
            last_name
          )
        `);

      if (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
      }

      // Transform the data to ensure proper typing
      return data.map(enrollment => ({
        id: enrollment.id,
        child_name: enrollment.child_name,
        child_id: enrollment.child_id,
        customer_id: enrollment.customer_id,
        programs: enrollment.programs,
        children: enrollment.children
      }));
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedChild || !title || selectedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a child, add a title, and choose files to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        // Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `kids-work/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('kids-work')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('kids-work')
          .getPublicUrl(filePath);

        // Find the enrollment to get the child_id
        const selectedEnrollment = enrollments.find(e => e.id === selectedChild);
        
        // Create kids_work record
        const { error: dbError } = await supabase
          .from('kids_work')
          .insert({
            title,
            description: description || null,
            file_url: publicUrl,
            file_type: file.type,
            enrollment_id: selectedChild,
            child_id: selectedEnrollment?.child_id || null,
            parent_customer_id: selectedEnrollment?.customer_id || null,
          });

        if (dbError) throw dbError;
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Upload Successful",
        description: `${selectedFiles.length} file(s) uploaded successfully.`,
      });

      // Reset form
      setSelectedFiles([]);
      setSelectedChild('');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div>Loading enrollments...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Kids' Work</CardTitle>
        <CardDescription>
          Upload artwork, projects, or other work from children in the programs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="child-select">Select Child</Label>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a child from enrollments" />
            </SelectTrigger>
            <SelectContent>
              {enrollments.map((enrollment) => (
                <SelectItem key={enrollment.id} value={enrollment.id}>
                  {enrollment.children 
                    ? `${enrollment.children.first_name} ${enrollment.children.last_name}` 
                    : enrollment.child_name
                  } - {enrollment.programs?.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this work"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
          />
        </div>

        <div className="space-y-4">
          <Label>Upload Files</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Images, videos, and PDFs up to 10MB each
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Files:</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !selectedChild || !title || selectedFiles.length === 0}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminKidsWorkUpload;

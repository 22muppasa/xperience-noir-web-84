
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WorkTagManager from '@/components/tags/WorkTagManager';

const EnhancedKidsWorkUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
        const { data: workData, error: dbError } = await supabase
          .from('kids_work')
          .insert({
            title,
            description: description || null,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
            enrollment_id: selectedChild,
            child_id: selectedEnrollment?.child_id || null,
            parent_customer_id: selectedEnrollment?.customer_id || null,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        // Add tags to the work
        if (selectedTags.length > 0 && workData) {
          const tagPromises = selectedTags.map(tagId =>
            supabase
              .from('kids_work_tags')
              .insert({ work_id: workData.id, tag_id: tagId })
          );
          await Promise.all(tagPromises);
        }

        return workData;
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Upload Successful",
        description: `${selectedFiles.length} file(s) uploaded successfully with tags.`,
      });

      // Reset form
      setSelectedFiles([]);
      setSelectedChild('');
      setTitle('');
      setDescription('');
      setSelectedTags([]);
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
    <Card className="w-full max-w-2xl mx-auto border-black bg-white">
      <CardHeader>
        <CardTitle className="text-black">Upload Kids' Work</CardTitle>
        <CardDescription className="text-black">
          Upload artwork, projects, or other work from children in the programs with enhanced tagging.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="child-select" className="text-black">Select Child</Label>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="border-black">
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
          <Label htmlFor="title" className="text-black">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this work"
            className="border-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-black">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            className="border-black"
          />
        </div>

        <WorkTagManager
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          showCreateNew={true}
        />

        <div className="space-y-4">
          <Label className="text-black">Upload Files</Label>
          <div className="border-2 border-dashed border-black rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-black mb-4" />
              <p className="text-sm text-black">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-black mt-1">
                Images, videos, and PDFs up to 10MB each
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-black">Selected Files:</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 border border-black p-2 rounded">
                  <span className="text-sm text-black truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-black hover:bg-gray-100"
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
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedKidsWorkUpload;

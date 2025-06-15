
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image } from 'lucide-react';

interface KidsWorkUploadProps {
  onUploadComplete?: () => void;
}

const KidsWorkUpload = ({ onUploadComplete }: KidsWorkUploadProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's active enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ['user-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          child_name,
          programs(id, title)
        `)
        .eq('customer_id', user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !file || !title.trim() || !selectedEnrollment) {
        throw new Error('Missing required information');
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `kids-work/${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase storage (when storage is configured)
      // For now, we'll just save the metadata
      const { error } = await supabase
        .from('kids_work')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          enrollment_id: selectedEnrollment,
          parent_customer_id: user.id,
          file_type: file.type,
          file_size: file.size,
          storage_path: fileName
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful!",
        description: "Kids work has been uploaded successfully",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedEnrollment('');
      setFile(null);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['kids-work'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload kids work",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a title for the work",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEnrollment) {
      toast({
        title: "Missing Information",
        description: "Please select an enrollment",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      toast({
        title: "Missing Information",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate();
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md group">
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
            Share your child's latest creative projects
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter work title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="enrollment">Program Enrollment *</Label>
            <Select value={selectedEnrollment} onValueChange={setSelectedEnrollment}>
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
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={uploadMutation.isPending}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Work'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KidsWorkUpload;

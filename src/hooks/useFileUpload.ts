
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FileUploadOptions {
  bucket: string;
  maxSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File,
    options: FileUploadOptions
  ): Promise<{ path: string; url: string } | null> => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(options.maxSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Allowed types: ${options.allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      // Track upload in database
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase.from('file_uploads').insert({
          user_id: user.user.id,
          bucket_name: options.bucket,
          file_path: filePath,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          upload_status: 'completed',
          completed_at: new Date().toISOString()
        });
      }

      setProgress(100);
      
      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      });

      return {
        path: filePath,
        url: urlData.publicUrl
      };

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      toast({
        title: "File deleted",
        description: "File has been deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress
  };
};

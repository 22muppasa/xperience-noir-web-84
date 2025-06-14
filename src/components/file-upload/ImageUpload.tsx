
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ImageUploadProps {
  bucket: string;
  currentImageUrl?: string;
  onImageUpload?: (url: string, path: string) => void;
  onImageRemove?: () => void;
  maxSize?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = ""
}) => {
  const { uploadFile, uploading, progress } = useFileUpload();
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const result = await uploadFile(file, {
      bucket,
      maxSize,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });

    if (result) {
      onImageUpload?.(result.url, result.path);
    } else {
      setPreview(currentImageUrl || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageRemove?.();
  };

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {uploading ? `Uploading... ${progress}%` : 'Click to upload image'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Max size: {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </label>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;

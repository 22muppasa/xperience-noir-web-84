
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminKidsWorkUpload = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [linkPreview, setLinkPreview] = useState<string | null>(null);
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

  const extractGoogleDriveFileId = (url: string): string | null => {
    // Handle various Google Drive URL formats
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/d\/([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const validateGoogleDriveLink = (url: string): boolean => {
    return url.includes('drive.google.com') && extractGoogleDriveFileId(url) !== null;
  };

  const generatePreviewLink = (url: string): string | null => {
    const fileId = extractGoogleDriveFileId(url);
    if (!fileId) return null;
    
    // Generate preview URL that works in iframe
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const handleLinkChange = (value: string) => {
    setGoogleDriveLink(value);
    
    if (value && validateGoogleDriveLink(value)) {
      const preview = generatePreviewLink(value);
      setLinkPreview(preview);
    } else {
      setLinkPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedChild || !title || !googleDriveLink) {
      toast({
        title: "Missing Information",
        description: "Please select a child, add a title, and provide a Google Drive link.",
        variant: "destructive",
      });
      return;
    }

    if (!validateGoogleDriveLink(googleDriveLink)) {
      toast({
        title: "Invalid Link",
        description: "Please provide a valid Google Drive sharing link.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const selectedEnrollment = enrollments.find(e => e.id === selectedChild);
      const fileId = extractGoogleDriveFileId(googleDriveLink);
      
      const { error: dbError } = await supabase
        .from('kids_work')
        .insert({
          title,
          description: description || null,
          google_drive_link: googleDriveLink,
          google_drive_file_id: fileId,
          link_status: 'active',
          enrollment_id: selectedChild,
          child_id: selectedEnrollment?.child_id || null,
          parent_customer_id: selectedEnrollment?.customer_id || null,
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful",
        description: "Google Drive link has been added successfully.",
      });

      // Reset form
      setSelectedChild('');
      setTitle('');
      setDescription('');
      setGoogleDriveLink('');
      setLinkPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error saving the Google Drive link. Please try again.",
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
        <CardTitle>Share Kids' Work via Google Drive</CardTitle>
        <CardDescription>
          Share Google Drive links to children's work, projects, or artwork.
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
          <Label>Google Drive Link</Label>
          <div className="space-y-2">
            <Input
              value={googleDriveLink}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="Paste Google Drive sharing link here..."
            />
            <div className="flex items-center space-x-2 text-sm">
              {googleDriveLink && (
                <>
                  {validateGoogleDriveLink(googleDriveLink) ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={validateGoogleDriveLink(googleDriveLink) ? "text-green-600" : "text-red-600"}>
                    {validateGoogleDriveLink(googleDriveLink) ? "Valid Google Drive link" : "Invalid link format"}
                  </span>
                </>
              )}
            </div>
          </div>

          {linkPreview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <iframe
                src={linkPreview}
                width="100%"
                height="200"
                className="border rounded"
                title="Google Drive Preview"
              />
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How to get a Google Drive sharing link:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Upload your file to Google Drive</li>
            <li>2. Right-click the file and select "Share"</li>
            <li>3. Change permissions to "Anyone with the link can view"</li>
            <li>4. Copy the link and paste it above</li>
          </ol>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !selectedChild || !title || !validateGoogleDriveLink(googleDriveLink)}
          className="w-full"
        >
          <Link className="h-4 w-4 mr-2" />
          {isUploading ? 'Saving...' : 'Save Google Drive Link'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminKidsWorkUpload;

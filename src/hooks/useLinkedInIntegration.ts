
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LinkedInPost {
  id: string;
  platform: 'linkedin';
  content: string;
  image?: string;
  date: string;
  likes: number;
  comments: number;
  link: string;
}

export const useLinkedInIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const connectLinkedIn = () => {
    const clientId = 'YOUR_LINKEDIN_CLIENT_ID'; // Will be set via environment
    const redirectUri = encodeURIComponent(window.location.origin + '/admin/social-posts');
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const state = Math.random().toString(36).substring(7);
    
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    
    window.location.href = linkedInAuthUrl;
  };

  const handleLinkedInCallback = async (code: string, state: string) => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-auth', {
        body: { code, state }
      });

      if (error) throw error;

      toast({
        title: "LinkedIn Connected",
        description: "Successfully connected to LinkedIn. You can now fetch your posts.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to LinkedIn",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchLinkedInPosts = async (): Promise<LinkedInPost[]> => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-posts');

      if (error) throw error;

      return data.posts || [];
    } catch (error: any) {
      toast({
        title: "Fetch Failed",
        description: error.message || "Failed to fetch LinkedIn posts",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsFetching(false);
    }
  };

  const checkLinkedInConnection = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'linkedin_access_token')
        .single();

      return !!data?.setting_value?.access_token;
    } catch {
      return false;
    }
  };

  return {
    isConnecting,
    isFetching,
    connectLinkedIn,
    handleLinkedInCallback,
    fetchLinkedInPosts,
    checkLinkedInConnection
  };
};

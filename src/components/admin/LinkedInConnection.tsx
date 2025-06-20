
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Linkedin, RefreshCw, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { useLinkedInIntegration } from '@/hooks/useLinkedInIntegration';
import { useToast } from '@/hooks/use-toast';

const LinkedInConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  const { connectLinkedIn, fetchLinkedInPosts, checkLinkedInConnection, isConnecting, isFetching } = useLinkedInIntegration();
  const { toast } = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setConnectionStatus('checking');
    try {
      const connected = await checkLinkedInConnection();
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      
      if (connected) {
        // Check last sync time from localStorage or database
        const lastSyncTime = localStorage.getItem('linkedin_last_sync');
        setLastSync(lastSyncTime);
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Error checking LinkedIn connection:', error);
    }
  };

  const handleConnect = () => {
    connectLinkedIn();
  };

  const handleManualSync = async () => {
    try {
      await fetchLinkedInPosts();
      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('linkedin_last_sync', now);
      
      toast({
        title: "Sync Complete",
        description: "LinkedIn posts have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync LinkedIn posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatSyncTime = (syncTime: string | null) => {
    if (!syncTime) return 'Never';
    
    const date = new Date(syncTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-white border-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          <Linkedin className="h-5 w-5" />
          LinkedIn Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-black">Connection Status:</span>
            {connectionStatus === 'checking' ? (
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Checking...
              </Badge>
            ) : connectionStatus === 'connected' ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
          
          <Button
            onClick={checkStatus}
            variant="outline"
            size="sm"
            disabled={connectionStatus === 'checking'}
            className="border-black text-black hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
        </div>

        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-sm text-black">
              Connect your LinkedIn account to display your latest posts in the Social Hub.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">Before connecting:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Make sure you have a LinkedIn Developer App set up</li>
                <li>• Configure the OAuth redirect URL in your LinkedIn app</li>
                <li>• Set the required environment variables in Supabase</li>
              </ul>
            </div>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-[#0077B5] hover:bg-[#005885] text-white"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Linkedin className="h-4 w-4 mr-2" />
                  Connect LinkedIn
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Last Sync:</span>
              <span className="text-gray-600">{formatSyncTime(lastSync)}</span>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleManualSync}
                disabled={isFetching}
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-gray-50"
              >
                {isFetching ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Sync Now
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => window.open('https://www.linkedin.com/developers/apps', '_blank')}
                variant="outline"
                size="sm"
                className="border-black text-black hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                LinkedIn Developer
              </Button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✓ LinkedIn is connected and your posts will appear in the Social Hub.
              </p>
            </div>
          </div>
        )}

        <div className="border-t pt-3">
          <h4 className="font-medium text-black mb-2">Setup Instructions:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>1. Create a LinkedIn Developer App at developers.linkedin.com</p>
            <p>2. Set the OAuth redirect URL to: <code className="bg-gray-100 px-1 rounded">{window.location.origin}/admin/social-posts</code></p>
            <p>3. Add these secrets in Supabase:</p>
            <ul className="ml-4 space-y-1">
              <li>• LINKEDIN_CLIENT_ID</li>
              <li>• LINKEDIN_CLIENT_SECRET</li>
              <li>• LINKEDIN_REDIRECT_URI</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInConnection;

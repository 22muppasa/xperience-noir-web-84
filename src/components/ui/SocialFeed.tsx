
import { useState, useEffect } from 'react';
import { Linkedin, Facebook, Instagram, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLinkedInIntegration } from '@/hooks/useLinkedInIntegration';
import { useToast } from '@/hooks/use-toast';

interface SocialPost {
  id: string;
  platform: 'linkedin' | 'facebook' | 'instagram';
  content: string;
  image?: string;
  date: string;
  likes: number;
  comments: number;
  link: string;
}

const SocialFeed = () => {
  const [filter, setFilter] = useState<string>('all');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  
  const { fetchLinkedInPosts, checkLinkedInConnection, isFetching } = useLinkedInIntegration();
  const { toast } = useToast();
  
  // Check LinkedIn connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Load posts when component mounts
  useEffect(() => {
    loadAllPosts();
  }, []);

  // Apply filter when filter or posts change
  useEffect(() => {
    filterPosts(filter);
  }, [posts, filter]);

  const checkConnection = async () => {
    const connected = await checkLinkedInConnection();
    setIsLinkedInConnected(connected);
  };

  const loadAllPosts = async () => {
    setLoading(true);
    try {
      let allPosts: SocialPost[] = [];

      // Fetch LinkedIn posts if connected
      if (await checkLinkedInConnection()) {
        const linkedInPosts = await fetchLinkedInPosts();
        allPosts = [...allPosts, ...linkedInPosts];
        setIsLinkedInConnected(true);
      }

      // Add mock posts for other platforms (for now)
      const mockPosts: SocialPost[] = [
        {
          id: 'mock-ig-1',
          platform: 'instagram',
          content: 'Behind the scenes at our latest workshop. #CodingWorkshop #XPerience',
          image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544',
          date: '2025-01-15',
          likes: 89,
          comments: 12,
          link: 'https://instagram.com'
        },
        {
          id: 'mock-fb-1',
          platform: 'facebook',
          content: "Congratulations to our latest graduates! So proud of what you've accomplished.",
          image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
          date: '2025-01-10',
          likes: 210,
          comments: 45,
          link: 'https://facebook.com'
        }
      ];

      allPosts = [...allPosts, ...mockPosts];
      
      // Sort by date (newest first)
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error",
        description: "Failed to load social media posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async () => {
    await loadAllPosts();
    toast({
      title: "Posts Refreshed",
      description: "Social media posts have been updated",
    });
  };
  
  const filterPosts = (platform: string) => {
    setFilter(platform);
    setPage(1);
    
    const filtered = platform === 'all' 
      ? posts 
      : posts.filter(post => post.platform === platform);
    
    setVisiblePosts(filtered.slice(0, 3));
  };
  
  const loadMorePosts = () => {
    const filtered = filter === 'all' 
      ? posts 
      : posts.filter(post => post.platform === filter);
    
    const nextPosts = filtered.slice(0, (page + 1) * 3);
    setVisiblePosts(nextPosts);
    setPage(page + 1);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'facebook':
        return <Facebook size={18} />;
      case 'instagram':
        return <Instagram size={18} />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getFilteredCount = (platform: string) => {
    if (platform === 'all') return posts.length;
    return posts.filter(post => post.platform === platform).length;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? "default" : "outline"}
            onClick={() => filterPosts('all')}
            className="flex items-center gap-2"
          >
            All ({getFilteredCount('all')})
          </Button>
          <Button 
            variant={filter === 'linkedin' ? "default" : "outline"}
            onClick={() => filterPosts('linkedin')}
            className="flex items-center gap-2"
            disabled={!isLinkedInConnected}
          >
            <Linkedin size={18} /> 
            LinkedIn ({getFilteredCount('linkedin')})
            {!isLinkedInConnected && <span className="text-xs text-gray-500">(Not connected)</span>}
          </Button>
          <Button 
            variant={filter === 'facebook' ? "default" : "outline"}
            onClick={() => filterPosts('facebook')}
            className="flex items-center gap-2"
          >
            <Facebook size={18} /> Facebook ({getFilteredCount('facebook')})
          </Button>
          <Button 
            variant={filter === 'instagram' ? "default" : "outline"}
            onClick={() => filterPosts('instagram')}
            className="flex items-center gap-2"
          >
            <Instagram size={18} /> Instagram ({getFilteredCount('instagram')})
          </Button>
        </div>
        
        <Button
          onClick={refreshPosts}
          disabled={loading || isFetching}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading || isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {!isLinkedInConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>LinkedIn not connected:</strong> To display real LinkedIn posts, an admin needs to connect LinkedIn in the dashboard.
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post) => (
              <div 
                key={post.id}
                className="border rounded-lg overflow-hidden hover-scale bg-white"
              >
                {post.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={`${post.platform} post`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="text-sm font-medium capitalize">{post.platform}</span>
                      {post.platform === 'linkedin' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
                  </div>
                  
                  <p className="mb-4 text-sm leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                    <a 
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-medium hover:underline"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Linkedin size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-medium">No posts found</h3>
                <p>Connect social media accounts to display posts here</p>
              </div>
            </div>
          )}
          
          {visiblePosts.length < (filter === 'all' ? posts.length : posts.filter(post => post.platform === filter).length) && (
            <div className="flex justify-center mt-10">
              <Button 
                onClick={loadMorePosts}
                disabled={loading}
                variant="outline"
                size="lg"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SocialFeed;

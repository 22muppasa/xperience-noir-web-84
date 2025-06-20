
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLinkedInIntegration } from '@/hooks/useLinkedInIntegration';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, ExternalLink, RefreshCw, Calendar } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'internal' | 'linkedin';
  content: string;
  image?: string;
  date: string;
  likes?: number;
  comments?: number;
  link?: string;
  title?: string;
}

const SocialFeed = () => {
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { fetchLinkedInPosts, checkLinkedInConnection } = useLinkedInIntegration();

  // Fetch internal posts
  const { data: internalPosts = [], isLoading: loadingInternal } = useQuery({
    queryKey: ['social-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(post => ({
        id: post.id,
        platform: 'internal' as const,
        content: post.content,
        image: post.image_url,
        date: post.published_at || post.created_at,
        title: post.title,
      }));
    }
  });

  // Fetch LinkedIn posts
  const { data: linkedInPosts = [], isLoading: loadingLinkedIn, refetch: refetchLinkedIn } = useQuery({
    queryKey: ['linkedin-posts'],
    queryFn: async () => {
      const isConnected = await checkLinkedInConnection();
      if (!isConnected) {
        return [];
      }
      return await fetchLinkedInPosts();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Combine and sort posts
  const allPosts: SocialPost[] = [...internalPosts, ...linkedInPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedPosts = allPosts.slice(0, visiblePosts);
  const hasMorePosts = allPosts.length > visiblePosts;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchLinkedIn();
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 6);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-[#0077B5] text-white';
      case 'internal': return 'bg-gray-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loadingInternal && loadingLinkedIn) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading social feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium text-black mb-2">Latest Updates</h2>
          <p className="text-gray-600">Stay up to date with our latest news and activities</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          className="border-black text-black hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {allPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No posts yet</h3>
          <p className="text-gray-600">Check back soon for updates!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => (
              <Card key={post.id} className="bg-white border-black hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getPlatformColor(post.platform)}>
                      {post.platform === 'linkedin' ? 'LinkedIn' : 'News'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.date)}
                    </div>
                  </div>

                  {post.title && (
                    <h3 className="font-medium text-black mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                  )}

                  {post.image && (
                    <div className="mb-4">
                      <img
                        src={post.image}
                        alt="Post image"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <p className="text-gray-700 mb-4 line-clamp-4">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {post.likes !== undefined && (
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likes}
                        </div>
                      )}
                      {post.comments !== undefined && (
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </div>
                      )}
                    </div>

                    {post.link && (
                      <Button
                        onClick={() => window.open(post.link, '_blank')}
                        variant="outline"
                        size="sm"
                        className="border-black text-black hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMorePosts && (
            <div className="text-center">
              <Button
                onClick={loadMorePosts}
                variant="outline"
                className="border-black text-black hover:bg-gray-50"
              >
                Load More Posts
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SocialFeed;

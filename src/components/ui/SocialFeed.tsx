
import { useState, useEffect } from 'react';
import { Linkedin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Mock social media posts data
const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'linkedin',
    content: 'We're excited to announce our new coding bootcamp starting next month! Join us for an immersive experience.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    date: '2025-04-15',
    likes: 145,
    comments: 23,
    link: 'https://linkedin.com'
  },
  {
    id: '2',
    platform: 'instagram',
    content: 'Behind the scenes at our latest workshop. #CodingWorkshop #XPerience',
    image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544',
    date: '2025-05-02',
    likes: 89,
    comments: 12,
    link: 'https://instagram.com'
  },
  {
    id: '3',
    platform: 'facebook',
    content: 'Congratulations to our latest graduates! So proud of what you've accomplished.',
    image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
    date: '2025-05-10',
    likes: 210,
    comments: 45,
    link: 'https://facebook.com'
  },
  {
    id: '4',
    platform: 'linkedin',
    content: 'Our team is growing! We're looking for passionate educators to join our mission.',
    date: '2025-05-08',
    likes: 67,
    comments: 15,
    link: 'https://linkedin.com'
  },
  {
    id: '5',
    platform: 'instagram',
    content: 'Learning should be fun! This is how we teach complex concepts in our programs.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    date: '2025-04-25',
    likes: 132,
    comments: 8,
    link: 'https://instagram.com'
  },
  {
    id: '6',
    platform: 'facebook',
    content: 'Join us for our virtual open house next week! Learn all about our upcoming programs.',
    date: '2025-05-15',
    likes: 45,
    comments: 7,
    link: 'https://facebook.com'
  },
];

const SocialFeed = () => {
  const [filter, setFilter] = useState<string>('all');
  const [visiblePosts, setVisiblePosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // Initialize with first batch of filtered posts
  useEffect(() => {
    filterPosts('all');
  }, []);
  
  const filterPosts = (platform: string) => {
    setFilter(platform);
    setPage(1);
    
    const filtered = platform === 'all' 
      ? mockPosts 
      : mockPosts.filter(post => post.platform === platform);
    
    setVisiblePosts(filtered.slice(0, 3));
  };
  
  const loadMorePosts = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = filter === 'all' 
        ? mockPosts 
        : mockPosts.filter(post => post.platform === filter);
      
      const nextPosts = filtered.slice(0, (page + 1) * 3);
      setVisiblePosts(nextPosts);
      setPage(page + 1);
      setLoading(false);
    }, 800);
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

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <Button 
          variant={filter === 'all' ? "default" : "outline"}
          onClick={() => filterPosts('all')}
          className="flex items-center gap-2"
        >
          All
        </Button>
        <Button 
          variant={filter === 'linkedin' ? "default" : "outline"}
          onClick={() => filterPosts('linkedin')}
          className="flex items-center gap-2"
        >
          <Linkedin size={18} /> LinkedIn
        </Button>
        <Button 
          variant={filter === 'facebook' ? "default" : "outline"}
          onClick={() => filterPosts('facebook')}
          className="flex items-center gap-2"
        >
          <Facebook size={18} /> Facebook
        </Button>
        <Button 
          variant={filter === 'instagram' ? "default" : "outline"}
          onClick={() => filterPosts('instagram')}
          className="flex items-center gap-2"
        >
          <Instagram size={18} /> Instagram
        </Button>
      </div>
      
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
                </div>
                <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
              </div>
              
              <p className="mb-4">{post.content}</p>
              
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
      
      {visiblePosts.length < (filter === 'all' ? mockPosts.length : mockPosts.filter(post => post.platform === filter).length) && (
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
    </div>
  );
};

export default SocialFeed;

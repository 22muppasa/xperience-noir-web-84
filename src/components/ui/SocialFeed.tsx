// src/components/ui/SocialFeed.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Calendar,
} from 'lucide-react'

interface SocialPost {
  id: string
  platform: 'internal'
  title: string
  content: string
  image?: string
  date: string
}

export default function SocialFeed() {
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // -- 1) Fetch internal posts --
  const {
    data: internalPosts = [],
    isLoading,
    refetch,
  } = useQuery<SocialPost[], Error>({
    queryKey: ['social-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('id, title, content, image_url, published_at, created_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) throw error

      return (data || []).map((post) => ({
        id: post.id,
        platform: 'internal',
        title: post.title,
        content: post.content,
        image: post.image_url ?? undefined,
        date: post.published_at || post.created_at!,
      }))
    },
    // turn off window-focus refetch if you prefer:
    refetchOnWindowFocus: false,
  })

  // -- 2) Sort & paginate --
  const allPosts = internalPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const displayed = allPosts.slice(0, visiblePosts)
  const hasMore = allPosts.length > visiblePosts

  // -- 3) Handlers --
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }
  const loadMore = () => setVisiblePosts((v) => v + 6)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  // -- 4) Render --
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[24rem]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-black">Loading posts…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-1">
            Latest Updates
          </h2>
          <p className="text-gray-600">Stay up to date with our latest news</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          className="border-black text-black hover:bg-gray-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* empty state */}
      {allPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black mb-2">No posts yet</h3>
          <p className="text-gray-600">Check back soon for updates!</p>
        </div>
      ) : (
        <>
          {/* grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((post) => (
              <Card
                key={post.id}
                className="bg-white border-black hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gray-600 text-white">
                      News
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.date)}
                    </div>
                  </div>

                  <h3 className="font-medium text-black mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  {post.image && (
                    <div className="mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <p className="text-gray-700 mb-4 line-clamp-4">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {/* if you have likes/comments in future, you can insert here */}
                    </div>

                    {/* if you add a `link` field later, render it here */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* load more */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="border-black text-black hover:bg-gray-50"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

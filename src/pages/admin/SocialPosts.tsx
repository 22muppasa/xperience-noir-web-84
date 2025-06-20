// src/pages/admin/SocialPosts.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LinkedInConnection from '@/components/admin/LinkedInConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Plus, Edit, Trash2, Settings } from 'lucide-react';

const AdminSocialPosts = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    scheduled_for: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch social posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['social-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Create post
  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const payload: any = {
        title: postData.title,
        content: postData.content,
        status: postData.status,
        published_at:
          postData.status === 'published'
            ? new Date().toISOString()
            : null,
        ...(postData.scheduled_for
          ? { scheduled_for: new Date(postData.scheduled_for).toISOString() }
          : {}),
      };
      const { error } = await supabase
        .from('social_posts')
        .insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Post created", description: "Social post has been created successfully." });
      setNewPost({ title: '', content: '', status: 'draft', scheduled_for: '' });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update post
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof newPost> }) => {
      const payload: any = {
        ...data,
        updated_at: new Date().toISOString(),
        published_at:
          data.status === 'published' && !editingPost?.published_at
            ? new Date().toISOString()
            : editingPost?.published_at,
        ...(data.scheduled_for
          ? { scheduled_for: new Date(data.scheduled_for).toISOString() }
          : {}),
      };
      const { error } = await supabase
        .from('social_posts')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Post updated", description: "Social post has been updated successfully." });
      setIsEditDialogOpen(false);
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete post
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Post deleted", description: "Social post has been deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':     return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':  return 'bg-red-100 text-red-800 border-red-200';
      default:          return 'bg-white text-black border-black';
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;
    updatePostMutation.mutate({ id: editingPost.id, data: editingPost });
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
            <p className="text-black">Loading social posts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Social Posts Management</h1>
            <p className="text-black">Create and manage internal social media posts</p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center bg-black text-white hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="posts" className="text-black">Internal Posts</TabsTrigger>
            <TabsTrigger value="linkedin" className="text-black">LinkedIn Integration</TabsTrigger>
            <TabsTrigger value="analytics" className="text-black">Analytics</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                ['Published', posts.filter(p => p.status === 'published').length],
                ['Drafts', posts.filter(p => p.status === 'draft').length],
                ['Archived', posts.filter(p => p.status === 'archived').length],
                ['Total', posts.length],
              ].map(([label, count]) => (
                <Card key={label} className="bg-white border-black">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-black">{count}</div>
                    <div className="text-sm text-black">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Table */}
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <FileText className="mr-2 h-5 w-5" /> Internal Social Posts
                  <Badge variant="outline" className="ml-2 text-xs">For website display only</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Title</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                        <TableHead className="text-black">Created</TableHead>
                        <TableHead className="text-black">Published</TableHead>
                        <TableHead className="text-black">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map(post => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-black">{post.title}</div>
                              <div className="text-sm text-black truncate max-w-xs">{post.content}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(post.status || 'draft')}>
                              {post.status || 'draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-black">
                            {post.created_at && new Date(post.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-black">
                            {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm" variant="outline"
                                className="border-black text-white hover:text-black hover:bg-gray-50"
                                onClick={() => handleEditPost(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm" variant="outline"
                                className="text-red-600 hover:text-red-700 border-black hover:bg-red-50"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-black mx-auto mb-4" />
                    <p className="text-black">No internal posts yet</p>
                    <p className="text-sm text-black">Create your first internal social media post</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LinkedIn & Analytics tabs unchanged */}
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Create New Internal Post</DialogTitle>
              <DialogDescription className="text-black">
                Create a new internal post for website display.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Title</label>
                <Input
                  value={newPost.title}
                  onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter post title..."
                  className="bg-white text-black border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                  placeholder="Enter post content..."
                  className="bg-white text-black border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Status</label>
                <select
                  value={newPost.status}
                  onChange={e => setNewPost({ ...newPost, status: e.target.value as any })}
                  className="w-full p-2 border border-black rounded-lg bg-white text-black"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-black text-black">
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending}
                className="bg-black text-white hover:bg-gray-800"
              >
                {createPostMutation.isPending ? 'Creating…' : 'Create Post'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Edit Internal Post</DialogTitle>
              <DialogDescription className="text-black">
                Update your internal post for website display.
              </DialogDescription>
            </DialogHeader>
            {editingPost && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Title</label>
                  <Input
                    value={editingPost.title}
                    onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="bg-white text-black border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Content</label>
                  <Textarea
                    value={editingPost.content}
                    onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={4}
                    className="bg-white text-black border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Status</label>
                  <select
                    value={editingPost.status}
                    onChange={e => setEditingPost({ ...editingPost, status: e.target.value })}
                    className="w-full p-2 border border-black rounded-lg bg-white text-black"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-black text-black">
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePost}
                disabled={updatePostMutation.isPending}
                className="bg-black text-white hover:text-black hover:bg-gray-800"
              >
                {updatePostMutation.isPending ? 'Updating…' : 'Update Post'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminSocialPosts;

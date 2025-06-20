import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
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
import { FileText, Plus, Calendar, Eye, Edit, Trash2, Clock } from 'lucide-react';

type PostStatus = 'draft' | 'published' | 'archived';

interface SocialPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  status: PostStatus;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

const getStatusColor = (status: PostStatus) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800 border-green-200';
    case 'draft':     return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'archived':  return 'bg-red-100 text-red-800 border-red-200';
    default:          return 'bg-white text-black border-black';
  }
};

const AdminSocialPosts: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    status: 'draft' as PostStatus,
    scheduled_for: ''
  });

  // Fetch posts
  const { data: posts = [], isLoading } = useQuery<SocialPost[]>({
    queryKey: ['social-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Create
  const createPost = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const { error } = await supabase
        .from('social_posts')
        .insert([{
          ...postData,
          published_at: postData.status === 'published' ? new Date().toISOString() : null,
          created_by: user?.id
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post created', description: 'Social post has been created successfully.' });
      setNewPost({ title: '', content: '', status: 'draft', scheduled_for: '' });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries(['social-posts']);
    }
  });

  // Update
  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof newPost> }) => {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
        published_at: data.status === 'published' && !editingPost?.published_at
          ? new Date().toISOString()
          : editingPost?.published_at
      };
      const { error } = await supabase
        .from('social_posts')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post updated', description: 'Social post has been updated successfully.' });
      setIsEditDialogOpen(false);
      setEditingPost(null);
      queryClient.invalidateQueries(['social-posts']);
    }
  });

  // Delete
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post deleted', description: 'Social post has been deleted successfully.' });
      queryClient.invalidateQueries(['social-posts']);
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black">Loading social posts...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Social Posts Management</h1>
            <p className="text-black">Create and manage social media posts</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="all" className="text-black">All Posts</TabsTrigger>
            <TabsTrigger value="published" className="text-black">Published</TabsTrigger>
            <TabsTrigger value="draft" className="text-black">Drafts</TabsTrigger>
            <TabsTrigger value="analytics" className="text-black">Analytics</TabsTrigger>
          </TabsList>

          {/* All Posts */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* summary cards */}
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{posts.filter(p => p.status=== 'published').length}</div>
                  <div className="text-sm text-black">Published</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{posts.filter(p => p.status=== 'draft').length}</div>
                  <div className="text-sm text-black">Drafts</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{posts.filter(p => p.status=== 'archived').length}</div>
                  <div className="text-sm text-black">Archived</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-black">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-black">{posts.length}</div>
                  <div className="text-sm text-black">Total Posts</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <FileText className="mr-2 h-5 w-5" /> All Social Posts
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
                            <div className="font-medium text-black">{post.title}</div>
                            <div className="text-sm text-black truncate max-w-xs">{post.content}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                          </TableCell>
                          <TableCell className="text-black">{new Date(post.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-black">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="bg-white border-black text-black hover:bg-gray-50" onClick={() => { setEditingPost(post); setIsEditDialogOpen(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white border-black text-black hover:bg-gray-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-black hover:bg-red-50 hover:text-red-700" onClick={() => handleDeletePost(post.id)}>
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
                    <p className="text-black">No social posts yet</p>
                    <p className="text-sm text-black">Create your first social media post</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent> 

          {/* Additional tabs (published, draft, analytics) unchanged... */}
        </Tabs>

        {/* Create & Edit Dialogs unchanged... */}

      </div>
    </DashboardLayout>
  );
};

export default AdminSocialPosts;
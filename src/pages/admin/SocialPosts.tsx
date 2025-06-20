// src/pages/admin/SocialPosts.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import { useAuth } from '@/contexts/AuthContext';

// align with your DB enum (includes 'scheduled')
type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

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
  storage_path: string | null;
  created_by: string | null;
}

const getStatusColor = (status: PostStatus) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800 border-green-200';
    case 'draft':     return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'archived':  return 'bg-red-100 text-red-800 border-red-200';
    default:          return 'bg-white text-black border-black';
  }
};

const SocialPosts: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<SocialPost | null>(null);
  const [form, setForm] = useState({ title: '', content: '', status: 'draft' as PostStatus, scheduled_for: '' });

  // Fetch with proper typing
  const { data: posts = [], isLoading }: UseQueryResult<SocialPost[], Error> = useQuery({
    queryKey: ['social-posts'],
    queryFn: async (): Promise<SocialPost[]> => {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Create
  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('social_posts')
        .insert([{ 
          ...form,
          published_at: form.status === 'published' ? new Date().toISOString() : null,
          created_by: user?.id
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post created', description: 'Social post has been created.' });
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setIsCreateOpen(false);
      setForm({ title: '', content: '', status: 'draft', scheduled_for: '' });
    }
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const { error } = await supabase
        .from('social_posts')
        .update({
          title: editing.title,
          content: editing.content,
          status: editing.status,
          scheduled_for: editing.scheduled_for || null,
          published_at: editing.status === 'published' && !editing.published_at ? new Date().toISOString() : editing.published_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', editing.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post updated', description: 'Social post has been updated.' });
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
      setIsEditOpen(false);
      setEditing(null);
    }
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Post deleted', description: 'Social post has been deleted.' });
      queryClient.invalidateQueries({ queryKey: ['social-posts'] });
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
        </DashboardLayout>
      );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Social Posts Management</h1>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-black text-white">
            <Plus className="mr-2" /> Create Post
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle>All Social Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    {/* render cells like before... */}
                  </TableRow>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          {/* other tab contents unchanged */}
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Fill in the details</DialogDescription>
            </DialogHeader>
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as PostStatus })}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        {/* similar to Create, using editing state & updateMutation */}

      </div>
    </DashboardLayout>
  );
};

export default SocialPosts;

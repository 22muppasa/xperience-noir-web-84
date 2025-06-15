
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Folder, Image } from 'lucide-react';

interface WorkCollectionsProps {
  childId?: string;
}

const WorkCollections = ({ childId }: WorkCollectionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '', childId: '' });

  // Fetch my children for collection creation
  const { data: myChildren = [] } = useQuery({
    queryKey: ['my-children-for-collections', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          child_id,
          children!inner(
            id,
            first_name,
            last_name
          )
        `)
        .eq('parent_id', user.id);
      
      if (error) throw error;
      return data.map(rel => rel.children);
    },
    enabled: !!user?.id
  });

  // Fetch collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['work-collections', user?.id, childId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('work_collections')
        .select(`
          *,
          children(first_name, last_name),
          work_collection_items(
            work_id,
            kids_work(title, file_url, file_type)
          )
        `)
        .order('created_at', { ascending: false });

      if (childId) {
        query = query.eq('child_id', childId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const createCollectionMutation = useMutation({
    mutationFn: async (collectionData: any) => {
      const { error } = await supabase
        .from('work_collections')
        .insert({
          name: collectionData.name,
          description: collectionData.description,
          child_id: collectionData.childId,
          created_by: user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-collections'] });
      setIsCreateOpen(false);
      setNewCollection({ name: '', description: '', childId: '' });
      toast({
        title: "Collection Created",
        description: "New work collection has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create collection.",
        variant: "destructive",
      });
    }
  });

  const handleCreateCollection = () => {
    if (!newCollection.name || !newCollection.childId) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and select a child.",
        variant: "destructive",
      });
      return;
    }
    createCollectionMutation.mutate(newCollection);
  };

  if (isLoading) {
    return <div>Loading collections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Work Collections</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Collection name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Description (optional)"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div>
                <Select
                  value={newCollection.childId}
                  onValueChange={(value) => setNewCollection(prev => ({ ...prev, childId: value }))}
                >
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {myChildren.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.first_name} {child.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateCollection}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Create Collection
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="border-black bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Folder className="h-5 w-5 text-black" />
                <CardTitle className="text-lg text-black">{collection.name}</CardTitle>
              </div>
              {collection.children && (
                <p className="text-sm text-black">
                  {collection.children.first_name} {collection.children.last_name}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {collection.description && (
                <p className="text-sm text-black">{collection.description}</p>
              )}
              
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-black" />
                <span className="text-sm text-black">
                  {collection.work_collection_items?.length || 0} items
                </span>
              </div>

              {collection.work_collection_items && collection.work_collection_items.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {collection.work_collection_items.slice(0, 3).map((item, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded border border-black">
                      {item.kids_work?.file_type?.startsWith('image/') ? (
                        <img 
                          src={item.kids_work.file_url} 
                          alt={item.kids_work.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-6 w-6 text-black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button variant="outline" className="w-full border-black text-black hover:bg-gray-50">
                View Collection
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length === 0 && (
        <Card className="border-black bg-white">
          <CardContent className="p-12 text-center">
            <Folder className="mx-auto h-16 w-16 text-black mb-4" />
            <h3 className="text-xl font-medium text-black mb-2">No Collections Yet</h3>
            <p className="text-black mb-6 max-w-md mx-auto">
              Create collections to organize your children's work by themes, subjects, or time periods.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkCollections;

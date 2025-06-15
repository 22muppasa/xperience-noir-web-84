
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Tag, X } from 'lucide-react';

interface WorkTagManagerProps {
  workId?: string;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  showCreateNew?: boolean;
}

const WorkTagManager = ({ workId, selectedTags = [], onTagsChange, showCreateNew = true }: WorkTagManagerProps) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });

  // Fetch all tags
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['work-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch current work tags if workId provided
  const { data: workTags = [] } = useQuery({
    queryKey: ['work-tags-for-work', workId],
    queryFn: async () => {
      if (!workId) return [];
      
      const { data, error } = await supabase
        .from('kids_work_tags')
        .select('tag_id, work_tags(name, color)')
        .eq('work_id', workId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!workId
  });

  const createTagMutation = useMutation({
    mutationFn: async (tagData: any) => {
      const { error } = await supabase
        .from('work_tags')
        .insert({
          name: tagData.name,
          color: tagData.color
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-tags'] });
      setIsCreateOpen(false);
      setNewTag({ name: '', color: '#3B82F6' });
      toast({
        title: "Tag Created",
        description: "New tag has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create tag.",
        variant: "destructive",
      });
    }
  });

  const addTagToWorkMutation = useMutation({
    mutationFn: async ({ workId, tagId }: { workId: string; tagId: string }) => {
      const { error } = await supabase
        .from('kids_work_tags')
        .insert({ work_id: workId, tag_id: tagId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-tags-for-work'] });
    }
  });

  const removeTagFromWorkMutation = useMutation({
    mutationFn: async ({ workId, tagId }: { workId: string; tagId: string }) => {
      const { error } = await supabase
        .from('kids_work_tags')
        .delete()
        .eq('work_id', workId)
        .eq('tag_id', tagId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-tags-for-work'] });
    }
  });

  const handleCreateTag = () => {
    if (!newTag.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a tag name.",
        variant: "destructive",
      });
      return;
    }
    createTagMutation.mutate(newTag);
  };

  const handleTagToggle = (tagId: string) => {
    if (workId) {
      const isCurrentlyTagged = workTags.some(wt => wt.tag_id === tagId);
      if (isCurrentlyTagged) {
        removeTagFromWorkMutation.mutate({ workId, tagId });
      } else {
        addTagToWorkMutation.mutate({ workId, tagId });
      }
    } else if (onTagsChange) {
      const newTags = selectedTags.includes(tagId)
        ? selectedTags.filter(id => id !== tagId)
        : [...selectedTags, tagId];
      onTagsChange(newTags);
    }
  };

  const isTagSelected = (tagId: string) => {
    if (workId) {
      return workTags.some(wt => wt.tag_id === tagId);
    }
    return selectedTags.includes(tagId);
  };

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-black" />
          <h3 className="font-medium text-black">Tags</h3>
        </div>
        {showCreateNew && userRole === 'admin' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                New Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-black">
              <DialogHeader>
                <DialogTitle className="text-black">Create New Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Tag name"
                    value={newTag.name}
                    onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                    className="border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Color</label>
                  <Input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                    className="border-black w-20 h-10"
                  />
                </div>
                <Button 
                  onClick={handleCreateTag}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Create Tag
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={isTagSelected(tag.id) ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              isTagSelected(tag.id) 
                ? 'bg-black text-white' 
                : 'border-black text-black hover:bg-gray-50'
            }`}
            style={isTagSelected(tag.id) ? { backgroundColor: tag.color } : {}}
            onClick={() => handleTagToggle(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-sm text-black">No tags available yet.</p>
      )}
    </div>
  );
};

export default WorkTagManager;

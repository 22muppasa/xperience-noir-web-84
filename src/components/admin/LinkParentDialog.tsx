
import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
}

interface LinkParentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChild: Child | null;
}

const LinkParentDialog = ({ isOpen, onOpenChange, selectedChild }: LinkParentDialogProps) => {
  const [selectedParentId, setSelectedParentId] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all parents for linking
  const { data: parents = [] } = useQuery({
    queryKey: ['admin-parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'customer')
        .order('first_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Link parent to child mutation - always creates "parent" relationship
  const linkParentMutation = useMutation({
    mutationFn: async ({ parentId, childId }: { parentId: string; childId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .insert([{
          parent_id: parentId,
          child_id: childId,
          relationship_type: 'parent', // Always set to parent
          assigned_by: user.user?.id,
          status: 'approved' // Auto-approve admin-created relationships
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-child-relationships'] });
      onOpenChange(false);
      setSelectedParentId('');
      toast({
        title: "Success",
        description: "Parent linked to child successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') ? "This relationship already exists" : "Failed to link parent to child",
        variant: "destructive"
      });
    }
  });

  const handleLink = () => {
    if (selectedChild && selectedParentId) {
      linkParentMutation.mutate({
        parentId: selectedParentId,
        childId: selectedChild.id
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-black">
        <DialogHeader>
          <DialogTitle className="text-black">
            Link Parent to {selectedChild?.first_name} {selectedChild?.last_name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="parent" className="text-black">Select Parent</Label>
            <Select value={selectedParentId} onValueChange={setSelectedParentId}>
              <SelectTrigger className="bg-white border-black text-black">
                <SelectValue placeholder="Choose a parent..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-black">
                {parents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id} className="text-black">
                    {parent.first_name} {parent.last_name} ({parent.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            This will create a parent relationship with full access permissions.
          </div>
          
          <Button 
            onClick={handleLink}
            className="w-full bg-white text-black border border-black hover:bg-gray-100"
            disabled={linkParentMutation.isPending || !selectedParentId}
          >
            {linkParentMutation.isPending ? 'Linking...' : 'Link Parent'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkParentDialog;


import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
}

interface DeleteChildDialogProps {
  child: Child | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteChildDialog = ({ child, isOpen, onOpenChange }: DeleteChildDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      // First delete related records manually since we can't use the RPC function yet
      
      // Delete parent-child relationships
      const { error: relationshipError } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('child_id', childId);
      
      if (relationshipError) throw relationshipError;

      // Set child_id to null in enrollments (soft delete)
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({ child_id: null })
        .eq('child_id', childId);
      
      if (enrollmentError) throw enrollmentError;

      // Set child_id to null in kids_work (soft delete)
      const { error: workError } = await supabase
        .from('kids_work')
        .update({ child_id: null })
        .eq('child_id', childId);
      
      if (workError) throw workError;

      // Finally delete the child
      const { data, error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-children'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-child-relationships'] });
      toast({
        title: "Child deleted",
        description: "The child and all related records have been removed successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: "Failed to delete child. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (child) {
      deleteChildMutation.mutate(child.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">Delete Child</AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            Are you sure you want to delete {child?.first_name} {child?.last_name}? 
            This action cannot be undone and will remove all associated records including:
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Parent-child relationships</li>
              <li>Program enrollments (will be set to null)</li>
              <li>Kids work records (will be set to null)</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-black text-white hover:text:black hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteChildMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleteChildMutation.isPending ? 'Deleting...' : 'Delete Child'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChildDialog;

// src/components/admin/DeleteChildDialog.tsx

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
import { Button } from '@/components/ui/button';

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

const DeleteChildDialog = ({
  child,
  isOpen,
  onOpenChange,
}: DeleteChildDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      // 1️⃣ Delete any parent-child relationships (ON DELETE CASCADE also covers this)
      const { error: relErr } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('child_id', childId);
      if (relErr) throw relErr;

      // 2️⃣ Soft-unlink from enrollments
      const { error: enrollErr } = await supabase
        .from('enrollments')
        .update({ child_id: null })
        .eq('child_id', childId);
      if (enrollErr) throw enrollErr;

      // 3️⃣ **Explicitly delete** all kids_work for that child
      const { error: workErr } = await supabase
        .from('kids_work')
        .delete()
        .eq('child_id', childId);
      if (workErr) throw workErr;

      // 4️⃣ Finally delete the child record itself
      const { data, error: childErr } = await supabase
        .from('children')
        .delete()
        .eq('id', childId)
        .select()
        .single();
      if (childErr) throw childErr;
      return data;
    },
    onSuccess: () => {
      // Invalidate any queries that might still include this child or their work
      queryClient.invalidateQueries({ queryKey: ['admin-children'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-child-relationships'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kids-work'] });
      queryClient.invalidateQueries({ queryKey: ['customer-kids-work'] });

      toast({
        title: 'Child deleted',
        description: 'The child and all their related work have been removed.',
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error deleting child:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete child. Please try again.',
        variant: 'destructive',
      });
    },
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
          <AlertDialogTitle className="text-black">
            Delete Child
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            Are you sure you want to delete{' '}
            <strong>
              {child?.first_name} {child?.last_name}
            </strong>
            ? This will also permanently remove all of their shared work.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-black text-white hover:text-black hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleDelete}
              disabled={deleteChildMutation.isLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteChildMutation.isLoading
                ? 'Deleting…'
                : 'Delete Child'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChildDialog;

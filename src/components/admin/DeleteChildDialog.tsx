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

const DeleteChildDialog: React.FC<DeleteChildDialogProps> = ({
  child,
  isOpen,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      // 1️⃣ Remove any parent–child relationships
      const { error: relErr } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('child_id', childId);
      if (relErr) throw relErr;

      // 2️⃣ Unlink from enrollments
      const { error: enrollErr } = await supabase
        .from('enrollments')
        .update({ child_id: null })
        .eq('child_id', childId);
      if (enrollErr) throw enrollErr;

      // 3️⃣ Delete all associated kids_work rows
      const { error: workErr } = await supabase
        .from('kids_work')
        .delete()
        .eq('child_id', childId);
      if (workErr) throw workErr;

      // 4️⃣ Finally delete the child record
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
      // Invalidate all relevant queries by passing an object with queryKey
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

  // React Query v4 uses "pending" instead of "loading"
  const isDeleting = deleteChildMutation.status === 'pending';

  const handleDelete = () => {
    if (child) deleteChildMutation.mutate(child.id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Delete Child
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="px-6 pb-4 text-black">
          Are you sure you want to delete{' '}
          <strong>
            {child?.first_name} {child?.last_name}
          </strong>
          ? This will also permanently remove all of their shared work.
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-black text-white hover:text-black hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting…' : 'Delete Child'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChildDialog;

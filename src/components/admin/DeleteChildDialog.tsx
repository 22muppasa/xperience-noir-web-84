
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
      console.log('Starting comprehensive child deletion for ID:', childId);
      
      // Call the comprehensive deletion function
      const { data, error } = await supabase
        .rpc('delete_child_comprehensive', {
          child_id_param: childId
        });

      console.log('Delete function response:', { data, error });

      if (error) {
        console.error('Error in delete_child_comprehensive:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      console.log('Child deletion successful, invalidating queries...');
      
      // Invalidate all relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['admin-children'] });
      queryClient.invalidateQueries({ queryKey: ['admin-parent-child-relationships'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kids-work'] });
      queryClient.invalidateQueries({ queryKey: ['customer-kids-work'] });
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['child-milestones'] });
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['work-collections'] });

      // Force refetch queries that might cache relationships
      queryClient.refetchQueries({ 
        predicate: (query) => {
          const key = Array.isArray(query.queryKey) ? query.queryKey[0] as string : '';
          return key?.includes('children') || 
                 key?.includes('work') || 
                 key?.includes('relationship') ||
                 key?.includes('enrollment') ||
                 key?.includes('admin');
        }
      });

      console.log('All queries invalidated');

      toast({
        title: 'Child deleted successfully',
        description: 'The child and all their related data have been permanently removed.',
      });
      
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Error deleting child:', error);
      
      let errorMessage = 'Failed to delete child. Please try again.';
      
      if (error.message?.includes('foreign key')) {
        errorMessage = 'Cannot delete child due to existing references. Please contact support.';
      } else if (error.message?.includes('permission')) {
        errorMessage = 'You do not have permission to delete this child.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      toast({
        title: 'Error deleting child',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    if (child) {
      console.log('Initiating delete for child:', child);
      deleteChildMutation.mutate(child.id);
    } else {
      console.error('No child selected for deletion');
    }
  };

  const isDeleting = deleteChildMutation.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Delete Child
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="px-6 pb-4 text-black">
          <div className="mb-4">
            Are you sure you want to delete{' '}
            <strong>
              {child?.first_name} {child?.last_name}
            </strong>
            ?
          </div>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
            <strong>This action will permanently remove:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Child's profile and basic information</li>
              <li>All uploaded work and files</li>
              <li>Parent-child relationships</li>
              <li>Enrollment records (child will be unlinked)</li>
              <li>Milestones and achievements</li>
              <li>Emergency contacts</li>
              <li>Work collections and tags</li>
            </ul>
          </div>
          
          <div className="mt-3 text-sm font-medium text-red-600">
            This action cannot be undone.
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            className="border-black text-black hover:text-black hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 min-w-[120px]"
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Child'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChildDialog;


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

interface PortfolioProject {
  id: string;
  name: string;
  category: string;
}

interface DeleteProjectDialogProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  project,
  isOpen,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });
      toast({
        title: 'Project deleted',
        description: 'The portfolio project has been deleted successfully.',
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    if (project) {
      deleteProjectMutation.mutate(project.id);
    }
  };

  const isDeleting = deleteProjectMutation.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">
            Delete Portfolio Project
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="px-6 pb-4 text-black">
          <div className="mb-4">
            Are you sure you want to delete{' '}
            <strong>
              {project?.name}
            </strong>
            ?
          </div>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
            <strong>This action will permanently remove:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Project details and description</li>
              <li>Associated images and links</li>
              <li>Metrics and performance data</li>
              <li>Project visibility from consulting page</li>
            </ul>
          </div>
          
          <div className="mt-3 text-sm font-medium text-red-600">
            This action cannot be undone.
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel 
            className="border-black text-white hover:text-black hover:bg-gray-50"
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
                'Delete Project'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;

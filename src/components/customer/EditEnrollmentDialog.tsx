
import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';

interface Enrollment {
  id: string;
  child_name: string;
  notes: string | null;
  status: string;
  program_id: string;
  programs: {
    title: string;
  };
}

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
}

interface ParentChildRelationship {
  id: string;
  child_id: string;
  children: Child;
}

interface EditEnrollmentDialogProps {
  enrollment: Enrollment;
}

const EditEnrollmentDialog = ({ enrollment }: EditEnrollmentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(enrollment.notes || '');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's linked children
  const { data: linkedChildren = [] } = useQuery({
    queryKey: ['linked-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          id,
          child_id,
          children!inner(
            id,
            first_name,
            last_name,
            date_of_birth
          )
        `)
        .eq('parent_id', user.id)
        .eq('status', 'approved');
      
      if (error) throw error;
      return data as ParentChildRelationship[];
    },
    enabled: !!user?.id
  });

  const updateEnrollmentMutation = useMutation({
    mutationFn: async ({ notes }: { notes: string }) => {
      const { error } = await supabase
        .from('enrollments')
        .update({ notes: notes.trim() || null })
        .eq('id', enrollment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Enrollment updated",
        description: "Your enrollment has been updated successfully.",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update enrollment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const cancelEnrollmentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'cancelled' })
        .eq('id', enrollment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Enrollment cancelled",
        description: "Your enrollment has been cancelled successfully.",
      });
      setIsOpen(false);
      setShowCancelConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['program-capacity'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel enrollment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleUpdateNotes = (e: React.FormEvent) => {
    e.preventDefault();
    updateEnrollmentMutation.mutate({ notes });
  };

  const handleCancel = () => {
    cancelEnrollmentMutation.mutate();
  };

  if (enrollment.status === 'cancelled') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-black text-black">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-black">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Enrollment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-black mb-2">Program Details</h4>
            <p className="text-sm text-gray-600">{enrollment.programs.title}</p>
            <p className="text-sm text-gray-600">Child: {enrollment.child_name}</p>
            <p className="text-sm text-gray-600 capitalize">Status: {enrollment.status}</p>
          </div>
          
          {!showCancelConfirm ? (
            <>
              <form onSubmit={handleUpdateNotes} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="bg-white text-black border-black"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={updateEnrollmentMutation.isPending}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {updateEnrollmentMutation.isPending ? 'Updating...' : 'Update Notes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-black text-black"
                  >
                    Close
                  </Button>
                </div>
              </form>
              
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(true)}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Enrollment
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Confirm Cancellation</h4>
                <p className="text-sm text-red-600 mb-4">
                  Are you sure you want to cancel this enrollment? This action cannot be undone.
                </p>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCancel}
                    disabled={cancelEnrollmentMutation.isPending}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {cancelEnrollmentMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Enrollment'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="border-gray-300 text-gray-600"
                  >
                    Keep Enrollment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnrollmentDialog;

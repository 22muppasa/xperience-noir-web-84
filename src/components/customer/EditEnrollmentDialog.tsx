
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, UserMinus } from 'lucide-react';

interface Enrollment {
  id: string;
  program_id: string;
  child_name: string;
  enrolled_at: string;
  status: string;
  programs: {
    title: string;
  };
  notes?: string;
}

interface EditEnrollmentDialogProps {
  enrollment: Enrollment;
}

const EditEnrollmentDialog = ({ enrollment }: EditEnrollmentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(enrollment.notes || '');
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateEnrollmentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('enrollments')
        .update({
          notes: notes.trim() || null
        })
        .eq('id', enrollment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notes Updated",
        description: "Your enrollment notes have been updated successfully.",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update enrollment notes",
        variant: "destructive",
      });
    }
  });

  const unenrollMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('enrollments')
        .update({
          status: 'cancelled'
        })
        .eq('id', enrollment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Cancelled",
        description: "You have successfully unenrolled from this program. You can re-enroll if the program is still open.",
      });
      setIsOpen(false);
      setShowUnenrollConfirm(false);
      // Invalidate multiple queries to update all enrollment displays
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['active-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['user-active-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['public-programs'] });
      queryClient.invalidateQueries({ queryKey: ['program-capacity'] });
    },
    onError: (error: any) => {
      toast({
        title: "Unenroll Failed",
        description: error.message || "Failed to cancel enrollment",
        variant: "destructive",
      });
    }
  });

  const handleUpdateNotes = (e: React.FormEvent) => {
    e.preventDefault();
    updateEnrollmentMutation.mutate();
  };

  const handleUnenroll = () => {
    unenrollMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Enrollment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Program</Label>
            <div className="text-sm text-gray-600 mt-1">{enrollment.programs.title}</div>
          </div>
          
          <div>
            <Label>Child</Label>
            <div className="text-sm text-gray-600 mt-1">{enrollment.child_name}</div>
          </div>
          
          <div>
            <Label>Status</Label>
            <div className="mt-1">
              <Badge 
                variant="outline" 
                className={`${
                  enrollment.status === 'active' 
                    ? 'bg-green-50 text-green-700 border-green-700'
                    : enrollment.status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-700'
                    : enrollment.status === 'cancelled'
                    ? 'bg-red-50 text-red-700 border-red-700'
                    : 'bg-gray-50 text-gray-700 border-gray-700'
                }`}
              >
                {enrollment.status === 'pending' ? 'Pending Admin Approval' : enrollment.status}
              </Badge>
            </div>
          </div>

          {!showUnenrollConfirm ? (
            <form onSubmit={handleUpdateNotes} className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this enrollment..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateEnrollmentMutation.isPending}
                  className="flex-1"
                >
                  {updateEnrollmentMutation.isPending ? 'Updating...' : 'Update Notes'}
                </Button>
              </div>

              {enrollment.status !== 'cancelled' && (
                <div className="pt-4 border-t">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowUnenrollConfirm(true)}
                    className="w-full"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unenroll from Program
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="font-semibold text-red-800 mb-2">Confirm Unenrollment</h3>
                <p className="text-red-700 text-sm">
                  Are you sure you want to unenroll {enrollment.child_name} from {enrollment.programs.title}? 
                  You can re-enroll later if the program is still available and has space.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUnenrollConfirm(false)}
                  className="flex-1"
                >
                  Keep Enrollment
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleUnenroll}
                  disabled={unenrollMutation.isPending}
                  className="flex-1"
                >
                  {unenrollMutation.isPending ? 'Processing...' : 'Confirm Unenroll'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnrollmentDialog;

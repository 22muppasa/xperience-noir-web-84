
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit } from 'lucide-react';

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
  const [status, setStatus] = useState(enrollment.status);
  const [notes, setNotes] = useState(enrollment.notes || '');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateEnrollmentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('enrollments')
        .update({
          status,
          notes: notes.trim() || null
        })
        .eq('id', enrollment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Updated",
        description: "The enrollment has been updated successfully.",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update enrollment",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEnrollmentMutation.mutate();
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
          <DialogTitle>Edit Enrollment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Program</Label>
            <div className="text-sm text-gray-600 mt-1">{enrollment.programs.title}</div>
          </div>
          
          <div>
            <Label>Child</Label>
            <div className="text-sm text-gray-600 mt-1">{enrollment.child_name}</div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
              {updateEnrollmentMutation.isPending ? 'Updating...' : 'Update Enrollment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnrollmentDialog;

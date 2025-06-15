
import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Baby } from 'lucide-react';

interface ProgramEnrollmentProps {
  programId: string;
  programTitle: string;
  isEnrolled: boolean;
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

const ProgramEnrollment = ({ programId, programTitle, isEnrolled }: ProgramEnrollmentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [notes, setNotes] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's linked children
  const { data: linkedChildren = [], isLoading: childrenLoading } = useQuery({
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
      
      if (error) {
        console.error('Error fetching linked children:', error);
        throw error;
      }
      
      return data as ParentChildRelationship[];
    },
    enabled: !!user?.id
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      if (!selectedChildId) throw new Error('Please select a child');
      
      const selectedChild = linkedChildren.find(rel => rel.child_id === selectedChildId);
      if (!selectedChild) throw new Error('Selected child not found');
      
      const { error } = await supabase
        .from('enrollments')
        .insert({
          program_id: programId,
          child_id: selectedChildId,
          child_name: `${selectedChild.children.first_name} ${selectedChild.children.last_name}`,
          notes: notes.trim() || null,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      const selectedChild = linkedChildren.find(rel => rel.child_id === selectedChildId);
      toast({
        title: "Enrollment Successful!",
        description: `Successfully enrolled ${selectedChild?.children.first_name} ${selectedChild?.children.last_name} in ${programTitle}`,
      });
      setIsOpen(false);
      setSelectedChildId('');
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in program",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChildId) {
      toast({
        title: "Missing Information",
        description: "Please select a child to enroll",
        variant: "destructive",
      });
      return;
    }

    enrollMutation.mutate();
  };

  if (isEnrolled) {
    return (
      <Button disabled className="w-full">
        Already Enrolled
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Enroll Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in {programTitle}</DialogTitle>
        </DialogHeader>
        
        {childrenLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            <span className="ml-2">Loading your children...</span>
          </div>
        ) : linkedChildren.length === 0 ? (
          <div className="text-center py-8">
            <Baby className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Children Linked</h3>
            <p className="text-gray-600 mb-4">
              You need to have children associated with your account to enroll them in programs.
            </p>
            <p className="text-sm text-gray-500">
              Go to the Children section to request association with your children.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="childSelect">Select Child *</Label>
              <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a child to enroll..." />
                </SelectTrigger>
                <SelectContent>
                  {linkedChildren.map((relationship) => (
                    <SelectItem key={relationship.child_id} value={relationship.child_id}>
                      {relationship.children.first_name} {relationship.children.last_name}
                      {relationship.children.date_of_birth && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Born: {new Date(relationship.children.date_of_birth).toLocaleDateString()})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes..."
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
                disabled={enrollMutation.isPending || !selectedChildId}
                className="flex-1"
              >
                {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProgramEnrollment;


import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Baby, AlertTriangle } from 'lucide-react';

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
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch program capacity info
  const { data: capacityInfo } = useQuery({
    queryKey: ['program-capacity', programId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('check_enrollment_capacity', {
        program_id_param: programId
      });
      
      if (error) throw error;
      return data[0] || { current_count: 0, max_participants: null, is_full: false };
    },
    enabled: !!programId
  });

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
      if (selectedChildIds.length === 0) throw new Error('Please select at least one child');
      
      // Check capacity before enrolling
      if (capacityInfo?.max_participants && 
          (capacityInfo.current_count + selectedChildIds.length) > capacityInfo.max_participants) {
        throw new Error(`Cannot enroll ${selectedChildIds.length} children. Only ${capacityInfo.max_participants - capacityInfo.current_count} spots remaining.`);
      }
      
      const enrollmentPromises = selectedChildIds.map(async (childId) => {
        const selectedChild = linkedChildren.find(rel => rel.child_id === childId);
        if (!selectedChild) throw new Error('Selected child not found');
        
        const { error } = await supabase
          .from('enrollments')
          .insert({
            program_id: programId,
            child_id: childId,
            child_name: `${selectedChild.children.first_name} ${selectedChild.children.last_name}`,
            notes: notes.trim() || null,
            status: 'active' // Changed from 'pending' to 'active' for auto-approval
          });

        if (error) throw error;
        return selectedChild;
      });

      return await Promise.all(enrollmentPromises);
    },
    onSuccess: (enrolledChildren) => {
      const childNames = enrolledChildren.map(rel => `${rel.children.first_name} ${rel.children.last_name}`).join(', ');
      toast({
        title: "Enrollment Successful!",
        description: `Successfully enrolled ${childNames} in ${programTitle}. Your enrollment is now active!`,
      });
      setIsOpen(false);
      setSelectedChildIds([]);
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['program-capacity'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in program",
        variant: "destructive",
      });
    }
  });

  const handleChildSelection = (childId: string, checked: boolean) => {
    if (checked) {
      // Check if adding this child would exceed capacity
      if (capacityInfo?.max_participants && 
          (capacityInfo.current_count + selectedChildIds.length + 1) > capacityInfo.max_participants) {
        toast({
          title: "Program Full",
          description: "Adding this child would exceed the program capacity.",
          variant: "destructive",
        });
        return;
      }
      setSelectedChildIds(prev => [...prev, childId]);
    } else {
      setSelectedChildIds(prev => prev.filter(id => id !== childId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedChildIds.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one child to enroll",
        variant: "destructive",
      });
      return;
    }

    enrollMutation.mutate();
  };

  // Check if program is full
  const isProgramFull = capacityInfo?.is_full || false;
  const remainingSpots = capacityInfo?.max_participants ? 
    capacityInfo.max_participants - capacityInfo.current_count : null;

  if (isEnrolled) {
    return (
      <Button disabled className="w-full">
        Already Enrolled
      </Button>
    );
  }

  if (isProgramFull) {
    return (
      <Button disabled className="w-full bg-red-100 text-red-700 border-red-300">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Program Full
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Enroll Now
          {remainingSpots && remainingSpots <= 5 && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
              {remainingSpots} left
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in {programTitle}</DialogTitle>
          {capacityInfo && (
            <div className="text-sm text-gray-600">
              {capacityInfo.max_participants && (
                <p>
                  Capacity: {capacityInfo.current_count} / {capacityInfo.max_participants} enrolled
                  {remainingSpots && remainingSpots <= 5 && (
                    <span className="ml-2 text-orange-600 font-medium">
                      Only {remainingSpots} spots remaining!
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
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
              <Label>Select Children to Enroll *</Label>
              <div className="space-y-3 mt-2">
                {linkedChildren.map((relationship) => {
                  const wouldExceedCapacity = capacityInfo?.max_participants && 
                    (capacityInfo.current_count + selectedChildIds.length + 1) > capacityInfo.max_participants &&
                    !selectedChildIds.includes(relationship.child_id);
                    
                  return (
                    <div key={relationship.child_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={relationship.child_id}
                        checked={selectedChildIds.includes(relationship.child_id)}
                        onCheckedChange={(checked) => 
                          handleChildSelection(relationship.child_id, checked as boolean)
                        }
                        disabled={wouldExceedCapacity}
                      />
                      <label 
                        htmlFor={relationship.child_id}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                          wouldExceedCapacity ? 'text-gray-400' : ''
                        }`}
                      >
                        {relationship.children.first_name} {relationship.children.last_name}
                        {relationship.children.date_of_birth && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Born: {new Date(relationship.children.date_of_birth).toLocaleDateString()})
                          </span>
                        )}
                        {wouldExceedCapacity && (
                          <span className="text-xs text-red-500 ml-2">(Would exceed capacity)</span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
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
                disabled={enrollMutation.isPending || selectedChildIds.length === 0}
                className="flex-1"
              >
                {enrollMutation.isPending ? 'Enrolling...' : `Enroll ${selectedChildIds.length} Child${selectedChildIds.length !== 1 ? 'ren' : ''}`}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProgramEnrollment;

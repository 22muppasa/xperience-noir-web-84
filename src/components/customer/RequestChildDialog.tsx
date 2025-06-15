
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
}

interface RequestChildDialogProps {
  myChildren: any[];
  pendingRequests: any[];
}

const RequestChildDialog = ({ myChildren, pendingRequests }: RequestChildDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [childSearchTerm, setChildSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all children for search
  const { data: allChildren = [] } = useQuery({
    queryKey: ['all-children-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, first_name, last_name, date_of_birth')
        .order('first_name');
      
      if (error) throw error;
      return data as Child[];
    }
  });

  // Request child association mutation
  const requestChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('child_association_requests')
        .insert([{
          parent_id: user.id,
          child_id: childId
        }])
        .select();
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already requested association with this child');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      setIsOpen(false);
      setChildSearchTerm('');
      toast({
        title: "Request Submitted",
        description: "Your child association request has been submitted for admin approval"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit child association request",
        variant: "destructive"
      });
    }
  });

  const filteredAvailableChildren = allChildren.filter(child => {
    const isAlreadyAssociated = myChildren.some(rel => rel.child_id === child.id);
    const hasPendingRequest = pendingRequests.some(req => req.child_id === child.id);
    const matchesSearch = child.first_name.toLowerCase().includes(childSearchTerm.toLowerCase()) ||
                         child.last_name.toLowerCase().includes(childSearchTerm.toLowerCase());
    return !isAlreadyAssociated && !hasPendingRequest && matchesSearch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black border border-black hover:bg-gray-100">
          <UserPlus className="h-4 w-4 mr-2" />
          Request Child Association
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-black">
        <DialogHeader>
          <DialogTitle className="text-black">Request Child Association</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="child_search" className="text-black">Search for your child</Label>
            <Input
              id="child_search"
              placeholder="Enter child's name..."
              value={childSearchTerm}
              onChange={(e) => setChildSearchTerm(e.target.value)}
              className="bg-white border-black text-black"
            />
          </div>
          
          {childSearchTerm && (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredAvailableChildren.length === 0 ? (
                <p className="text-sm text-black text-center py-4">
                  No available children found. Contact an administrator if your child is not listed or if you believe there's an error.
                </p>
              ) : (
                filteredAvailableChildren.map((child) => (
                  <Card key={child.id} className="cursor-pointer hover:bg-gray-50 border-black bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-black">
                            {child.first_name} {child.last_name}
                          </h4>
                          {child.date_of_birth && (
                            <p className="text-sm text-black">
                              Born: {new Date(child.date_of_birth).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => requestChildMutation.mutate(child.id)}
                          className="bg-white text-black border border-black hover:bg-gray-100"
                          disabled={requestChildMutation.isPending}
                        >
                          {requestChildMutation.isPending ? 'Requesting...' : 'Request'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestChildDialog;

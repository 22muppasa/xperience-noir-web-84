
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, CheckCircle, XCircle, User, Baby } from 'lucide-react';

interface ChildAssociationRequest {
  id: string;
  parent_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  notes: string | null;
  children: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
  };
  profiles: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

const ChildAssociationRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<ChildAssociationRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all pending requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-child-association-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_association_requests')
        .select(`
          *,
          children!inner(id, first_name, last_name, date_of_birth),
          profiles!parent_id(id, first_name, last_name, email)
        `)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      return data as ChildAssociationRequest[];
    }
  });

  // Approve request mutation
  const approveRequestMutation = useMutation({
    mutationFn: async ({ requestId, notes }: { requestId: string; notes: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      // First, update the request status
      const { error: requestError } = await supabase
        .from('child_association_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.user?.id,
          notes: notes
        })
        .eq('id', requestId);
      
      if (requestError) throw requestError;

      // Get the request details to create the relationship
      const { data: request, error: fetchError } = await supabase
        .from('child_association_requests')
        .select('parent_id, child_id')
        .eq('id', requestId)
        .single();
      
      if (fetchError) throw fetchError;

      // Create the parent-child relationship
      const { error: relationshipError } = await supabase
        .from('parent_child_relationships')
        .insert([{
          parent_id: request.parent_id,
          child_id: request.child_id,
          relationship_type: 'parent',
          status: 'approved',
          assigned_by: user.user?.id
        }]);
      
      if (relationshipError) {
        // If relationship creation fails, revert the request status
        await supabase
          .from('child_association_requests')
          .update({ status: 'pending', reviewed_at: null, reviewed_by: null, notes: null })
          .eq('id', requestId);
        throw relationshipError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-child-association-requests'] });
      setIsReviewOpen(false);
      setSelectedRequest(null);
      setReviewNotes('');
      toast({
        title: "Request Approved",
        description: "Child association request has been approved successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive"
      });
    }
  });

  // Reject request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: async ({ requestId, notes }: { requestId: string; notes: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('child_association_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.user?.id,
          notes: notes
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-child-association-requests'] });
      setIsReviewOpen(false);
      setSelectedRequest(null);
      setReviewNotes('');
      toast({
        title: "Request Rejected",
        description: "Child association request has been rejected"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive"
      });
    }
  });

  const handleReview = (request: ChildAssociationRequest, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      approveRequestMutation.mutate({ requestId: request.id, notes: reviewNotes });
    } else {
      rejectRequestMutation.mutate({ requestId: request.id, notes: reviewNotes });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-sm text-black">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Child Association Requests</h2>
          <p className="text-black">Review and approve parent-child association requests</p>
        </div>
        <Badge variant="outline" className="text-black border-black bg-white">
          {requests.length} Pending
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-white border-black">
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-black mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-black">No pending requests</h3>
            <p className="text-black">All child association requests have been processed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-white border-black">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-black" />
                      <div>
                        <h3 className="font-semibold text-black">
                          {request.profiles?.first_name} {request.profiles?.last_name}
                        </h3>
                        <p className="text-sm text-black">{request.profiles?.email}</p>
                      </div>
                    </div>
                    <div className="text-black">→</div>
                    <div className="flex items-center space-x-2">
                      <Baby className="h-4 w-4 text-black" />
                      <div>
                        <h3 className="font-semibold text-black">
                          {request.children.first_name} {request.children.last_name}
                        </h3>
                        {request.children.date_of_birth && (
                          <p className="text-sm text-black">
                            Born: {new Date(request.children.date_of_birth).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-white">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                    <Dialog open={isReviewOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                      setIsReviewOpen(open);
                      if (!open) {
                        setSelectedRequest(null);
                        setReviewNotes('');
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="border-black text-black hover:bg-gray-50"
                        >
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-black">
                        <DialogHeader>
                          <DialogTitle className="text-black">Review Association Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-black">Request Details:</h4>
                            <p className="text-sm text-black">
                              <strong>Parent:</strong> {request.profiles?.first_name} {request.profiles?.last_name} ({request.profiles?.email})
                            </p>
                            <p className="text-sm text-black">
                              <strong>Child:</strong> {request.children.first_name} {request.children.last_name}
                            </p>
                            <p className="text-sm text-black">
                              <strong>Requested:</strong> {new Date(request.requested_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="review_notes" className="text-black">Review Notes (Optional)</Label>
                            <Textarea
                              id="review_notes"
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              placeholder="Add any notes about this decision..."
                              className="bg-white border-black text-black"
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleReview(request, 'approve')}
                              disabled={approveRequestMutation.isPending || rejectRequestMutation.isPending}
                              className="flex-1 bg-green-600 text-white hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {approveRequestMutation.isPending ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              onClick={() => handleReview(request, 'reject')}
                              disabled={approveRequestMutation.isPending || rejectRequestMutation.isPending}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {rejectRequestMutation.isPending ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="mt-2 text-xs text-black">
                  Requested: {new Date(request.requested_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildAssociationRequests;


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Calendar, Phone, Heart, UserPlus, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
}

interface ParentChildRelationship {
  id: string;
  child_id: string;
  relationship_type: string;
  can_view_work: boolean;
  can_receive_notifications: boolean;
  assigned_at: string;
  status: string;
  children: Child;
}

interface ChildAssociationRequest {
  id: string;
  parent_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  notes: string | null;
  children: Child;
}

const ChildrenManagement = () => {
  const [isRequestChildOpen, setIsRequestChildOpen] = useState(false);
  const [childSearchTerm, setChildSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's approved children relationships
  const { data: myChildren = [], isLoading } = useQuery({
    queryKey: ['my-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          *,
          children!inner(*)
        `)
        .eq('parent_id', user.id)
        .eq('status', 'approved')
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as ParentChildRelationship[];
    },
    enabled: !!user?.id
  });

  // Fetch user's pending requests
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pending-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('child_association_requests')
        .select(`
          *,
          children!inner(*)
        `)
        .eq('parent_id', user.id)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      return data as ChildAssociationRequest[];
    },
    enabled: !!user?.id
  });

  // Fetch all children for search (to request association)
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
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already requested association with this child');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      setIsRequestChildOpen(false);
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
    // Filter out children that are already associated or have pending requests
    const isAlreadyAssociated = myChildren.some(rel => rel.child_id === child.id);
    const hasPendingRequest = pendingRequests.some(req => req.child_id === child.id);
    const matchesSearch = child.first_name.toLowerCase().includes(childSearchTerm.toLowerCase()) ||
                         child.last_name.toLowerCase().includes(childSearchTerm.toLowerCase());
    return !isAlreadyAssociated && !hasPendingRequest && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-sm text-black">Loading your children...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">My Children</h2>
          <p className="text-black">Manage your children and view their information</p>
        </div>
        
        <Dialog open={isRequestChildOpen} onOpenChange={setIsRequestChildOpen}>
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
      </div>

      <Tabs defaultValue="approved" className="space-y-6">
        <TabsList className="bg-white border-black">
          <TabsTrigger value="approved" className="flex items-center space-x-2 text-black">
            <Users className="h-4 w-4" />
            <span>My Children ({myChildren.length})</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center space-x-2 text-black">
            <Clock className="h-4 w-4" />
            <span>Pending Requests ({pendingRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          {myChildren.length === 0 ? (
            <Card className="bg-white border-black">
              <CardContent className="p-12 text-center">
                <Baby className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">No children associated</h3>
                <p className="text-black mb-4">
                  Request to add your children to view their work and progress.
                </p>
                <Button 
                  onClick={() => setIsRequestChildOpen(true)}
                  className="bg-white text-black border border-black hover:bg-gray-100"
                >
                  Request Your First Child
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myChildren.map((relationship) => (
                <Card key={relationship.id} className="bg-white border-black">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-black">
                        {relationship.children.first_name} {relationship.children.last_name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relationship.children.date_of_birth && (
                      <div className="flex items-center space-x-2 text-sm text-black">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(relationship.children.date_of_birth).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {relationship.children.emergency_contact_name && (
                      <div className="flex items-center space-x-2 text-sm text-black">
                        <Phone className="h-4 w-4" />
                        <span>{relationship.children.emergency_contact_name}</span>
                      </div>
                    )}
                    
                    {relationship.children.medical_notes && (
                      <div className="flex items-center space-x-2 text-sm text-black">
                        <Heart className="h-4 w-4" />
                        <span className="line-clamp-2">{relationship.children.medical_notes}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 pt-2">
                      <Badge variant="outline" className="text-xs text-black border-black bg-white">
                        {relationship.relationship_type}
                      </Badge>
                      {relationship.can_view_work && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600 bg-white">
                          Can view work
                        </Badge>
                      )}
                      {relationship.can_receive_notifications && (
                        <Badge variant="outline" className="text-xs text-blue-600 border-blue-600 bg-white">
                          Notifications enabled
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-black">
                      Associated: {new Date(relationship.assigned_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <Card className="bg-white border-black">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">No pending requests</h3>
                <p className="text-black mb-4">
                  You don't have any pending child association requests.
                </p>
                <Button 
                  onClick={() => setIsRequestChildOpen(true)}
                  className="bg-white text-black border border-black hover:bg-gray-100"
                >
                  Request Child Association
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="bg-white border-black">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-black">
                          {request.children.first_name} {request.children.last_name}
                        </h3>
                        {request.children.date_of_birth && (
                          <p className="text-sm text-black">
                            Born: {new Date(request.children.date_of_birth).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-white">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-black">
                          Requested: {new Date(request.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildrenManagement;

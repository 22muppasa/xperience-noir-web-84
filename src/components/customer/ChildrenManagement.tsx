
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
import { Baby, Calendar, Phone, Heart, UserPlus, Users } from 'lucide-react';

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
  children: Child;
}

const ChildrenManagement = () => {
  const [isRequestChildOpen, setIsRequestChildOpen] = useState(false);
  const [childSearchTerm, setChildSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's children
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
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as ParentChildRelationship[];
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
        .from('parent_child_relationships')
        .insert([{
          parent_id: user.id,
          child_id: childId,
          relationship_type: 'parent',
          assigned_by: user.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-children'] });
      setIsRequestChildOpen(false);
      setChildSearchTerm('');
      toast({
        title: "Success",
        description: "Child association request created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') ? "You are already associated with this child" : "Failed to request child association",
        variant: "destructive"
      });
    }
  });

  const filteredAvailableChildren = allChildren.filter(child => {
    const isAlreadyAssociated = myChildren.some(rel => rel.child_id === child.id);
    const matchesSearch = child.first_name.toLowerCase().includes(childSearchTerm.toLowerCase()) ||
                         child.last_name.toLowerCase().includes(childSearchTerm.toLowerCase());
    return !isAlreadyAssociated && matchesSearch;
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
              Add Child
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
                      No children found. Contact an administrator if your child is not listed.
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
                              {requestChildMutation.isPending ? 'Adding...' : 'Add'}
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

      {/* My Children List */}
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
              Add Your First Child
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
                  <Badge variant="outline" className="text-black border-black bg-white">
                    {relationship.relationship_type}
                  </Badge>
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
    </div>
  );
};

export default ChildrenManagement;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChildAssociationRequests from '@/components/admin/ChildAssociationRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Baby, Calendar, Phone, Heart, Search, Link, Unlink, Clock } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
  created_at: string;
}

interface ParentChildRelationship {
  id: string;
  parent_id: string;
  child_id: string;
  relationship_type: string;
  can_view_work: boolean;
  can_receive_notifications: boolean;
  assigned_at: string;
  children: Child;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

const AdminChildren = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateChildOpen, setIsCreateChildOpen] = useState(false);
  const [isLinkParentOpen, setIsLinkParentOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [relationshipType, setRelationshipType] = useState('parent');
  const [newChild, setNewChild] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all children
  const { data: children = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ['admin-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Child[];
    }
  });

  // Fetch all parent-child relationships
  const { data: relationships = [], isLoading: isLoadingRelationships } = useQuery({
    queryKey: ['admin-parent-child-relationships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          *,
          children!inner(*),
          profiles!parent_id(first_name, last_name, email)
        `)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as ParentChildRelationship[];
    }
  });

  // Fetch all parents for linking
  const { data: parents = [] } = useQuery({
    queryKey: ['admin-parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'customer')
        .order('first_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Create child mutation
  const createChildMutation = useMutation({
    mutationFn: async (childData: typeof newChild) => {
      const { data, error } = await supabase
        .from('children')
        .insert([childData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-children'] });
      setIsCreateChildOpen(false);
      setNewChild({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_notes: ''
      });
      toast({
        title: "Success",
        description: "Child created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create child",
        variant: "destructive"
      });
    }
  });

  // Link parent to child mutation
  const linkParentMutation = useMutation({
    mutationFn: async ({ parentId, childId, relationshipType }: { parentId: string; childId: string; relationshipType: string }) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .insert([{
          parent_id: parentId,
          child_id: childId,
          relationship_type: relationshipType,
          assigned_by: user.user?.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-child-relationships'] });
      setIsLinkParentOpen(false);
      setSelectedChild(null);
      setSelectedParentId('');
      toast({
        title: "Success",
        description: "Parent linked to child successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message.includes('duplicate') ? "This relationship already exists" : "Failed to link parent to child",
        variant: "destructive"
      });
    }
  });

  // Unlink parent from child mutation
  const unlinkParentMutation = useMutation({
    mutationFn: async (relationshipId: string) => {
      const { error } = await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('id', relationshipId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-parent-child-relationships'] });
      toast({
        title: "Success",
        description: "Parent unlinked from child successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unlink parent from child",
        variant: "destructive"
      });
    }
  });

  const filteredChildren = children.filter(child =>
    child.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRelationships = relationships.filter(rel =>
    rel.children.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.children.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingChildren || isLoadingRelationships) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-black">Loading children management...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Children Management</h1>
            <p className="text-black mt-1">Manage children profiles and parent associations</p>
          </div>
          
          <div className="flex space-x-2">
            <Dialog open={isCreateChildOpen} onOpenChange={setIsCreateChildOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black border border-black hover:bg-gray-100">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-black max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-black">Create New Child Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name" className="text-black">First Name</Label>
                      <Input
                        id="first_name"
                        value={newChild.first_name}
                        onChange={(e) => setNewChild(prev => ({ ...prev, first_name: e.target.value }))}
                        className="bg-white border-black text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-black">Last Name</Label>
                      <Input
                        id="last_name"
                        value={newChild.last_name}
                        onChange={(e) => setNewChild(prev => ({ ...prev, last_name: e.target.value }))}
                        className="bg-white border-black text-black"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="date_of_birth" className="text-black">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={newChild.date_of_birth}
                      onChange={(e) => setNewChild(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="bg-white border-black text-black"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergency_contact_name" className="text-black">Emergency Contact Name</Label>
                      <Input
                        id="emergency_contact_name"
                        value={newChild.emergency_contact_name}
                        onChange={(e) => setNewChild(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                        className="bg-white border-black text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_phone" className="text-black">Emergency Contact Phone</Label>
                      <Input
                        id="emergency_contact_phone"
                        value={newChild.emergency_contact_phone}
                        onChange={(e) => setNewChild(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                        className="bg-white border-black text-black"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="medical_notes" className="text-black">Medical Notes</Label>
                    <Textarea
                      id="medical_notes"
                      value={newChild.medical_notes}
                      onChange={(e) => setNewChild(prev => ({ ...prev, medical_notes: e.target.value }))}
                      className="bg-white border-black text-black"
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => createChildMutation.mutate(newChild)}
                    className="w-full bg-white text-black border border-black hover:bg-gray-100"
                    disabled={createChildMutation.isPending || !newChild.first_name}
                  >
                    {createChildMutation.isPending ? 'Creating...' : 'Create Child'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
          <Input
            placeholder="Search children or parents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-black text-black placeholder:text-gray-500"
          />
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="requests" className="flex items-center space-x-2 text-black">
              <Clock className="h-4 w-4" />
              <span>Association Requests</span>
            </TabsTrigger>
            <TabsTrigger value="children" className="flex items-center space-x-2 text-black">
              <Baby className="h-4 w-4" />
              <span>Children ({filteredChildren.length})</span>
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center space-x-2 text-black">
              <Users className="h-4 w-4" />
              <span>Relationships ({filteredRelationships.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <ChildAssociationRequests />
          </TabsContent>

          <TabsContent value="children">
            {filteredChildren.length === 0 ? (
              <Card className="bg-white border-black">
                <CardContent className="p-12 text-center">
                  <Baby className="h-12 w-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-black">No children found</h3>
                  <p className="text-black">Start by creating a child profile</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChildren.map((child) => (
                  <Card key={child.id} className="bg-white border-black">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-black">
                          {child.first_name} {child.last_name}
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedChild(child);
                            setIsLinkParentOpen(true);
                          }}
                          className="border-black text-black hover:bg-gray-50"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {child.date_of_birth && (
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(child.date_of_birth).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {child.emergency_contact_name && (
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <Phone className="h-4 w-4" />
                          <span>{child.emergency_contact_name}</span>
                        </div>
                      )}
                      
                      {child.medical_notes && (
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <Heart className="h-4 w-4" />
                          <span className="line-clamp-2">{child.medical_notes}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-black">
                        Created: {new Date(child.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="relationships">
            {filteredRelationships.length === 0 ? (
              <Card className="bg-white border-black">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-black">No relationships found</h3>
                  <p className="text-black">Link parents to children to create relationships</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRelationships.map((relationship) => (
                  <Card key={relationship.id} className="bg-white border-black">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-black">
                              {relationship.profiles?.first_name} {relationship.profiles?.last_name}
                            </h3>
                            <p className="text-sm text-black">{relationship.profiles?.email}</p>
                          </div>
                          <div className="text-black">→</div>
                          <div>
                            <h3 className="font-semibold text-black">
                              {relationship.children.first_name} {relationship.children.last_name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-black border-black bg-white">
                                {relationship.relationship_type}
                              </Badge>
                              {relationship.can_view_work && (
                                <Badge variant="outline" className="text-green-600 border-green-600 bg-white">
                                  Can view work
                                </Badge>
                              )}
                              {relationship.can_receive_notifications && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600 bg-white">
                                  Notifications
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unlinkParentMutation.mutate(relationship.id)}
                          className="text-red-600 hover:text-red-700 border-black hover:bg-red-50"
                          disabled={unlinkParentMutation.isPending}
                        >
                          <Unlink className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 text-xs text-black">
                        Linked: {new Date(relationship.assigned_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Link Parent Dialog */}
        <Dialog open={isLinkParentOpen} onOpenChange={setIsLinkParentOpen}>
          <DialogContent className="bg-white border-black">
            <DialogHeader>
              <DialogTitle className="text-black">
                Link Parent to {selectedChild?.first_name} {selectedChild?.last_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parent" className="text-black">Select Parent</Label>
                <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                  <SelectTrigger className="bg-white border-black text-black">
                    <SelectValue placeholder="Choose a parent..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black">
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id} className="text-black">
                        {parent.first_name} {parent.last_name} ({parent.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="relationship_type" className="text-black">Relationship Type</Label>
                <Select value={relationshipType} onValueChange={setRelationshipType}>
                  <SelectTrigger className="bg-white border-black text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-black">
                    <SelectItem value="parent" className="text-black">Parent</SelectItem>
                    <SelectItem value="guardian" className="text-black">Guardian</SelectItem>
                    <SelectItem value="family_member" className="text-black">Family Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => {
                  if (selectedChild && selectedParentId) {
                    linkParentMutation.mutate({
                      parentId: selectedParentId,
                      childId: selectedChild.id,
                      relationshipType
                    });
                  }
                }}
                className="w-full bg-white text-black border border-black hover:bg-gray-100"
                disabled={linkParentMutation.isPending || !selectedParentId}
              >
                {linkParentMutation.isPending ? 'Linking...' : 'Link Parent'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminChildren;

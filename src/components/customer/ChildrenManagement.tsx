
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Users } from 'lucide-react';
import RequestChildDialog from './RequestChildDialog';
import RegisterChildDialog from './RegisterChildDialog';
import ChildCard from './ChildCard';

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

const ChildrenManagement = () => {
  const { user } = useAuth();
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  // Fetch user's approved children relationships
  const { data: myChildren = [], isLoading } = useQuery({
    queryKey: ['my-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log('Fetching relationships for user:', user.id);
      
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          *,
          children!inner(*)
        `)
        .eq('parent_id', user.id)
        .eq('status', 'approved')
        .order('assigned_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching children relationships:', error);
        throw error;
      }
      
      console.log('Fetched relationships:', data);
      return data as ParentChildRelationship[];
    },
    enabled: !!user?.id
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
        
        <div className="flex space-x-2">
          <RequestChildDialog myChildren={myChildren} pendingRequests={[]} />
          <RegisterChildDialog 
            isOpen={isRegisterDialogOpen} 
            onOpenChange={setIsRegisterDialogOpen} 
          />
        </div>
      </div>

      <Tabs defaultValue="approved" className="space-y-6">
        <TabsList className="bg-white border-black">
          <TabsTrigger value="approved" className="flex items-center space-x-2 text-black">
            <Users className="h-4 w-4" />
            <span>My Children ({myChildren.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          {myChildren.length === 0 ? (
            <Card className="bg-white border-black">
              <CardContent className="p-12 text-center">
                <Baby className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">No children registered</h3>
                <p className="text-black mb-4">
                  Register your children to view their work and progress.
                </p>
                <div className="flex justify-center space-x-2">
                  <RequestChildDialog myChildren={myChildren} pendingRequests={[]} />
                  <RegisterChildDialog 
                    isOpen={isRegisterDialogOpen} 
                    onOpenChange={setIsRegisterDialogOpen} 
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myChildren.map((relationship) => (
                <ChildCard key={relationship.id} relationship={relationship} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildrenManagement;

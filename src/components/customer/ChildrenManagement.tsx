
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Users, Clock } from 'lucide-react';
import RequestChildDialog from './RequestChildDialog';
import ChildCard from './ChildCard';
import PendingRequestCard from './PendingRequestCard';

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
  const { user } = useAuth();

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
        
        <RequestChildDialog myChildren={myChildren} pendingRequests={pendingRequests} />
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
                <RequestChildDialog myChildren={myChildren} pendingRequests={pendingRequests} />
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

        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <Card className="bg-white border-black">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">No pending requests</h3>
                <p className="text-black mb-4">
                  You don't have any pending child association requests.
                </p>
                <RequestChildDialog myChildren={myChildren} pendingRequests={pendingRequests} />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <PendingRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildrenManagement;

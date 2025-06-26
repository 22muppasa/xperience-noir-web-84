
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChildAssociationRequests from '@/components/admin/ChildAssociationRequests';
import CreateChildDialog from '@/components/admin/CreateChildDialog';
import LinkParentDialog from '@/components/admin/LinkParentDialog';
import ChildrenGrid from '@/components/admin/ChildrenGrid';
import RelationshipsList from '@/components/admin/RelationshipsList';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Baby, Clock, Search } from 'lucide-react';

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

  const handleLinkParent = (child: Child) => {
    setSelectedChild(child);
    setIsLinkParentOpen(true);
  };

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
            <CreateChildDialog 
              isOpen={isCreateChildOpen} 
              onOpenChange={setIsCreateChildOpen} 
            />
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

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="children" className="flex items-center space-x-2 text-black">
              <Baby className="h-4 w-4" />
              <span>Children ({filteredChildren.length})</span>
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center space-x-2 text-black">
              <Users className="h-4 w-4" />
              <span>Relationships ({filteredRelationships.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <ChildrenGrid 
              children={filteredChildren} 
              onLinkParent={handleLinkParent} 
            />
          </TabsContent>

          <TabsContent value="relationships">
            <RelationshipsList relationships={filteredRelationships} />
          </TabsContent>
        </Tabs>

        {/* Link Parent Dialog */}
        <LinkParentDialog
          isOpen={isLinkParentOpen}
          onOpenChange={(open) => {
            setIsLinkParentOpen(open);
            if (!open) setSelectedChild(null);
          }}
          selectedChild={selectedChild}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminChildren;

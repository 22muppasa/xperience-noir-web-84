// src/pages/AdminChildren.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CreateChildDialog from '@/components/admin/CreateChildDialog';
import ChildrenGrid from '@/components/admin/ChildrenGrid';
import RelationshipsList from '@/components/admin/RelationshipsList';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Baby, Search } from 'lucide-react';

interface Child { /* same as before */ }
interface ParentChildRelationship { /* same as before */ }

export default function AdminChildren() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch children
  const { data: children = [] } = useQuery(['admin-children'], async () => {
    const { data, error } = await supabase.from('children').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Child[];
  });

  // Fetch relationships
  const { data: relationships = [] } = useQuery(['admin-relationships'], async () => {
    const { data, error } = await supabase
      .from('parent_child_relationships')
      .select('*, children!inner(*), profiles!parent_id(first_name,last_name,email)')
      .order('assigned_at', { ascending: false });
    if (error) throw error;
    return data as ParentChildRelationship[];
  });

  const filter = (text: string) =>
    text.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredChildren = children.filter(c => filter(c.first_name) || filter(c.last_name));
  const filteredRels     = relationships.filter(r =>
    filter(r.children.first_name) ||
    filter(r.children.last_name)  ||
    filter(r.profiles.first_name) ||
    filter(r.profiles.last_name)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Children Management</h1>
            <p className="text-black mt-1">Create children and view their parent links</p>
          </div>
          <CreateChildDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </header>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
          <Input
            placeholder="Search children or parents..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-black text-black"
          />
        </div>

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList className="bg-white border-black">
            <TabsTrigger value="children" className="flex items-center space-x-2 text-black">
              <Baby className="h-4 w-4" /><span>Children ({filteredChildren.length})</span>
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center space-x-2 text-black">
              <Users className="h-4 w-4" /><span>Relationships ({filteredRels.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <ChildrenGrid children={filteredChildren} /* onLinkParent now unused */ />
          </TabsContent>

          <TabsContent value="relationships">
            <RelationshipsList relationships={filteredRels} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

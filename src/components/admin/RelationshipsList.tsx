
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Unlink, Users } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
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

interface RelationshipsListProps {
  relationships: ParentChildRelationship[];
}

const RelationshipsList = ({ relationships }: RelationshipsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  if (relationships.length === 0) {
    return (
      <Card className="bg-white border-black">
        <CardContent className="p-12 text-center">
          <Users className="h-12 w-12 text-black mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">No relationships found</h3>
          <p className="text-black">Link parents to children to create relationships</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {relationships.map((relationship) => (
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
  );
};

export default RelationshipsList;

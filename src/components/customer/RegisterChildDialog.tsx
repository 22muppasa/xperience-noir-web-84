
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';

interface RegisterChildDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterChildDialog = ({ isOpen, onOpenChange }: RegisterChildDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [childData, setChildData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: ''
  });

  const registerChildMutation = useMutation({
    mutationFn: async (data: typeof childData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // First check if child already exists
      const { data: existingChild, error: checkError } = await supabase
        .from('children')
        .select('id')
        .ilike('first_name', data.first_name)
        .ilike('last_name', data.last_name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let childId: string;

      if (existingChild) {
        // Child exists, check if already linked to this parent
        const { data: existingRelationship, error: relationshipError } = await supabase
          .from('parent_child_relationships')
          .select('id')
          .eq('parent_id', user.id)
          .eq('child_id', existingChild.id)
          .single();

        if (relationshipError && relationshipError.code !== 'PGRST116') {
          throw relationshipError;
        }

        if (existingRelationship) {
          throw new Error('This child is already linked to your account');
        }

        // Link existing child to parent
        const { error: linkError } = await supabase
          .from('parent_child_relationships')
          .insert([{
            parent_id: user.id,
            child_id: existingChild.id,
            relationship_type: 'parent',
            status: 'approved'
          }]);

        if (linkError) throw linkError;
        childId = existingChild.id;
      } else {
        // Create new child
        const { data: newChild, error: createError } = await supabase
          .from('children')
          .insert([data])
          .select()
          .single();

        if (createError) throw createError;

        // Link new child to parent
        const { error: linkError } = await supabase
          .from('parent_child_relationships')
          .insert([{
            parent_id: user.id,
            child_id: newChild.id,
            relationship_type: 'parent',
            status: 'approved'
          }]);

        if (linkError) throw linkError;
        childId = newChild.id;
      }

      return { childId, isExisting: !!existingChild };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['my-children'] });
      onOpenChange(false);
      setChildData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_notes: ''
      });
      toast({
        title: result.isExisting ? "Child linked successfully" : "Child registered successfully",
        description: result.isExisting 
          ? "The existing child has been linked to your account"
          : "Your child has been registered and linked to your account"
      });
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register child",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    if (!childData.first_name || !childData.last_name) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }
    registerChildMutation.mutate(childData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black border border-black hover:bg-gray-100">
          <UserPlus className="h-4 w-4 mr-2" />
          Register My Child
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-black max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-black">Register Child</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-black">First Name *</Label>
              <Input
                id="first_name"
                value={childData.first_name}
                onChange={(e) => setChildData(prev => ({ ...prev, first_name: e.target.value }))}
                className="bg-white border-black text-black"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-black">Last Name *</Label>
              <Input
                id="last_name"
                value={childData.last_name}
                onChange={(e) => setChildData(prev => ({ ...prev, last_name: e.target.value }))}
                className="bg-white border-black text-black"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date_of_birth" className="text-black">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={childData.date_of_birth}
              onChange={(e) => setChildData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              className="bg-white border-black text-black"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name" className="text-black">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={childData.emergency_contact_name}
                onChange={(e) => setChildData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                className="bg-white border-black text-black"
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_phone" className="text-black">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={childData.emergency_contact_phone}
                onChange={(e) => setChildData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                className="bg-white border-black text-black"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="medical_notes" className="text-black">Medical Notes</Label>
            <Textarea
              id="medical_notes"
              value={childData.medical_notes}
              onChange={(e) => setChildData(prev => ({ ...prev, medical_notes: e.target.value }))}
              className="bg-white border-black text-black"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            className="w-full bg-white text-black border border-black hover:bg-gray-100"
            disabled={registerChildMutation.isPending}
          >
            {registerChildMutation.isPending ? 'Registering...' : 'Register Child'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterChildDialog;

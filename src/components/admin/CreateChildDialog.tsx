
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';

interface CreateChildDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateChildDialog = ({ isOpen, onOpenChange }: CreateChildDialogProps) => {
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
      onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
};

export default CreateChildDialog;

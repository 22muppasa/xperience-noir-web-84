// src/components/ui/RegisterChildDialog.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';

interface ChildData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_notes: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegisterChildDialog({ isOpen, onOpenChange }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [childData, setChildData] = useState<ChildData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: ''
  });

  const canSubmit = Boolean(childData.first_name && childData.last_name);

  const manageChild = useMutation({
    mutationFn: async (data: ChildData) => {
      if (!user?.id) throw new Error('Not authenticated');

      // 1) Try to find an existing child by name
      const { data: existingChild, error: fetchChildErr } = await supabase
        .from('children')
        .select('id')
        .match({
          first_name: data.first_name,
          last_name: data.last_name
        })
        .maybeSingle();
      if (fetchChildErr) throw fetchChildErr;

      let childId: string;
      if (existingChild) {
        childId = existingChild.id;
      } else {
        // 2) Insert new child
        const { data: newChild, error: insertChildErr } = await supabase
          .from('children')
          .insert([data])
          .select('id')
          .single();
        if (insertChildErr) throw insertChildErr;
        childId = newChild.id;
      }

      // 3) Check existing parent-child relationship
      const { data: existingRel, error: fetchRelErr } = await supabase
        .from('parent_child_relationships')
        .select('id')
        .match({
          parent_id: user.id,
          child_id: childId
        })
        .maybeSingle();
      if (fetchRelErr) throw fetchRelErr;

      if (existingRel) {
        // Already linked
        throw new Error(`You're already associated with ${data.first_name} ${data.last_name}.`);
      }

      // 4) Create the link
      const { data: rel, error: relErr } = await supabase
        .from('parent_child_relationships')
        .insert([{
          parent_id:         user.id,
          child_id:          childId,
          relationship_type: 'parent',
          status:            'approved',
          assigned_by:       user.id
        }])
        .select()
        .single();
      if (relErr) throw relErr;

      return rel;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-children', user?.id] });
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
        title: 'Success',
        description: 'Child has been registered and linked.'
      });
    },
    onError: (err: any) => {
      toast({
        title: err.message.includes('already associated')
          ? 'Already Linked'
          : 'Error',
        description: err.message,
        variant: err.message.includes('already associated') ? 'warning' : 'destructive'
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black border border-black hover:bg-gray-100">
          <UserPlus className="h-4 w-4 mr-2" />
          Add / Register Child
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-black max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-black">Add or Register a Child</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-black">First Name *</Label>
              <Input
                id="first_name"
                value={childData.first_name}
                onChange={e =>
                  setChildData(cs => ({ ...cs, first_name: e.target.value }))
                }
                className="bg-white border-black text-black"
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-black">Last Name *</Label>
              <Input
                id="last_name"
                value={childData.last_name}
                onChange={e =>
                  setChildData(cs => ({ ...cs, last_name: e.target.value }))
                }
                className="bg-white border-black text-black"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date_of_birth" className="text-black">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={childData.date_of_birth}
              onChange={e =>
                setChildData(cs => ({ ...cs, date_of_birth: e.target.value }))
              }
              className="bg-white border-black text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name" className="text-black">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={childData.emergency_contact_name}
                onChange={e =>
                  setChildData(cs => ({ ...cs, emergency_contact_name: e.target.value }))
                }
                className="bg-white border-black text-black"
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_phone" className="text-black">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={childData.emergency_contact_phone}
                onChange={e =>
                  setChildData(cs => ({ ...cs, emergency_contact_phone: e.target.value }))
                }
                className="bg-white border-black text-black"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="medical_notes" className="text-black">Medical Notes</Label>
            <Textarea
              id="medical_notes"
              rows={3}
              value={childData.medical_notes}
              onChange={e =>
                setChildData(cs => ({ ...cs, medical_notes: e.target.value }))
              }
              className="bg-white border-black text-black"
            />
          </div>

          <Button
            onClick={() => manageChild.mutate(childData)}
            disabled={!canSubmit || manageChild.isPending}
            className="w-full bg-white text-black border border-black hover:bg-gray-100"
          >
            {manageChild.isPending ? 'Registering…' : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterChildDialog;

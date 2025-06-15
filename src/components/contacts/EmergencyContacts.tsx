
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Phone, Mail, User, Edit, Trash2 } from 'lucide-react';

interface EmergencyContactsProps {
  childId: string;
}

const EmergencyContacts = ({ childId }: EmergencyContactsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false,
    canPickup: false,
    notes: ''
  });

  // Fetch emergency contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['emergency-contacts', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('child_id', childId)
        .order('is_primary', { ascending: false })
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!childId
  });

  const createContactMutation = useMutation({
    mutationFn: async (contactData: any) => {
      const { error } = await supabase
        .from('emergency_contacts')
        .insert({
          ...contactData,
          child_id: childId
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      resetForm();
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to add emergency contact.",
        variant: "destructive",
      });
    }
  });

  const updateContactMutation = useMutation({
    mutationFn: async ({ id, ...contactData }: any) => {
      const { error } = await supabase
        .from('emergency_contacts')
        .update(contactData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      resetForm();
      toast({
        title: "Contact Updated",
        description: "Emergency contact has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update emergency contact.",
        variant: "destructive",
      });
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', contactId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts'] });
      toast({
        title: "Contact Deleted",
        description: "Emergency contact has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete emergency contact.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setContactForm({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
      canPickup: false,
      notes: ''
    });
    setEditingContact(null);
    setIsCreateOpen(false);
  };

  const handleSubmit = () => {
    if (!contactForm.name || !contactForm.relationship || !contactForm.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      name: contactForm.name,
      relationship: contactForm.relationship,
      phone: contactForm.phone,
      email: contactForm.email || null,
      is_primary: contactForm.isPrimary,
      can_pickup: contactForm.canPickup,
      notes: contactForm.notes || null
    };

    if (editingContact) {
      updateContactMutation.mutate({ id: editingContact.id, ...submitData });
    } else {
      createContactMutation.mutate(submitData);
    }
  };

  const handleEdit = (contact: any) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || '',
      isPrimary: contact.is_primary,
      canPickup: contact.can_pickup,
      notes: contact.notes || ''
    });
    setIsCreateOpen(true);
  };

  const relationshipOptions = [
    'Parent', 'Guardian', 'Grandparent', 'Aunt/Uncle', 'Sibling', 
    'Family Friend', 'Babysitter', 'Other'
  ];

  if (isLoading) {
    return <div>Loading emergency contacts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Emergency Contacts</h2>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-black max-w-md">
            <DialogHeader>
              <DialogTitle className="text-black">
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-black">Name *</Label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div>
                <Label className="text-black">Relationship *</Label>
                <Select
                  value={contactForm.relationship}
                  onValueChange={(value) => setContactForm(prev => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger className="border-black">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((rel) => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-black">Phone *</Label>
                <Input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div>
                <Label className="text-black">Email</Label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="border-black"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={contactForm.isPrimary}
                  onCheckedChange={(checked) => setContactForm(prev => ({ ...prev, isPrimary: checked }))}
                />
                <Label className="text-black">Primary Contact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={contactForm.canPickup}
                  onCheckedChange={(checked) => setContactForm(prev => ({ ...prev, canPickup: checked }))}
                />
                <Label className="text-black">Authorized for Pickup</Label>
              </div>
              <div>
                <Label className="text-black">Notes</Label>
                <Textarea
                  value={contactForm.notes}
                  onChange={(e) => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="border-black"
                  placeholder="Additional notes or instructions"
                />
              </div>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="border-black bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-black flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>{contact.name}</span>
                  </CardTitle>
                  <p className="text-sm text-black">{contact.relationship}</p>
                </div>
                <div className="flex space-x-1">
                  {contact.is_primary && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Primary</Badge>
                  )}
                  {contact.can_pickup && (
                    <Badge className="bg-green-100 text-green-800 text-xs">Pickup OK</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-black">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center space-x-2 text-sm text-black">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                )}
              </div>

              {contact.notes && (
                <div className="bg-gray-50 border border-black p-2 rounded">
                  <p className="text-xs text-black">{contact.notes}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(contact)}
                  className="border-black text-black hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteContactMutation.mutate(contact.id)}
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card className="border-black bg-white">
          <CardContent className="p-12 text-center">
            <User className="mx-auto h-16 w-16 text-black mb-4" />
            <h3 className="text-xl font-medium text-black mb-2">No Emergency Contacts</h3>
            <p className="text-black mb-6 max-w-md mx-auto">
              Add emergency contacts who can be reached in case of emergencies or authorized for pickup.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyContacts;

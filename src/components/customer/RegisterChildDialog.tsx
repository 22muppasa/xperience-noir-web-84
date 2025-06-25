
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
import { UserPlus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [nameCheckResult, setNameCheckResult] = useState<boolean | null>(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  const checkNameMutation = useMutation({
    mutationFn: async ({ first_name, last_name }: { first_name: string; last_name: string }) => {
      const { data, error } = await supabase.rpc('check_child_name_exists', {
        first_name_param: first_name,
        last_name_param: last_name
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (exists) => {
      setNameCheckResult(exists);
    },
    onError: (error) => {
      console.error('Name check error:', error);
      toast({
        title: "Error",
        description: "Failed to check child name availability",
        variant: "destructive"
      });
    }
  });

  const registerChildMutation = useMutation({
    mutationFn: async (data: typeof childData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data: result, error } = await supabase
        .from('child_registration_requests')
        .insert([{
          parent_id: user.id,
          ...data
        }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child-registration-requests'] });
      onOpenChange(false);
      setChildData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_notes: ''
      });
      setNameCheckResult(null);
      toast({
        title: "Registration request submitted",
        description: "Your child registration request has been submitted for review by an administrator"
      });
    },
    onError: (error) => {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to submit registration request",
        variant: "destructive"
      });
    }
  });

  const handleNameCheck = () => {
    if (childData.first_name && childData.last_name) {
      setIsCheckingName(true);
      checkNameMutation.mutate({
        first_name: childData.first_name,
        last_name: childData.last_name
      });
      setIsCheckingName(false);
    }
  };

  const handleSubmit = () => {
    if (nameCheckResult === false) {
      registerChildMutation.mutate(childData);
    }
  };

  const isFormValid = childData.first_name && childData.last_name && nameCheckResult === false;

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
                onChange={(e) => {
                  setChildData(prev => ({ ...prev, first_name: e.target.value }));
                  setNameCheckResult(null);
                }}
                className="bg-white border-black text-black"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-black">Last Name *</Label>
              <Input
                id="last_name"
                value={childData.last_name}
                onChange={(e) => {
                  setChildData(prev => ({ ...prev, last_name: e.target.value }));
                  setNameCheckResult(null);
                }}
                className="bg-white border-black text-black"
                required
              />
            </div>
          </div>

          {childData.first_name && childData.last_name && (
            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleNameCheck}
                disabled={isCheckingName || checkNameMutation.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isCheckingName || checkNameMutation.isPending ? 'Checking...' : 'Check Name Availability'}
              </Button>
              
              {nameCheckResult !== null && (
                <Alert className={nameCheckResult ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-black">
                    {nameCheckResult 
                      ? `A child with the name "${childData.first_name} ${childData.last_name}" already exists in our system.`
                      : `Great! The name "${childData.first_name} ${childData.last_name}" is available.`
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

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
            disabled={!isFormValid || registerChildMutation.isPending}
          >
            {registerChildMutation.isPending ? 'Submitting...' : 'Submit Registration Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterChildDialog;
